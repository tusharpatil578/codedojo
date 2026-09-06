import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logSubmissionToBigQuery } from '@/lib/bigquery';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { questionId, answer, timeSpent } = body;

    if (!questionId || answer === undefined) {
      return NextResponse.json({ error: 'Question ID and answer are required' }, { status: 400 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        assignment: {
          include: {
            class: {
              include: {
                module: {
                  include: {
                    course: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Auto-grading logic (case insensitive exact match for demo SQL/MCQ answers)
    const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    const score = isCorrect ? question.points : 0;

    // Save submission to SQLite database
    const submission = await prisma.submission.create({
      data: {
        studentId: user.id,
        questionId: question.id,
        answer,
        isCorrect,
        score,
        timeSpent: timeSpent || 30,
      }
    });

    // Stream submission to Google BigQuery Data Warehouse
    const assignmentTitle = question.assignment.title;
    await logSubmissionToBigQuery({
      studentId: user.id,
      studentName: user.name,
      assignmentTitle,
      score,
      maxScore: question.points,
      submittedAt: new Date().toISOString()
    });

    // AUTOMATION: Evaluate Certificate Eligibility
    // Rules: Completed course if assignment score average >= 80% and attendance >= 90%
    const courseId = question.assignment.class.module.courseId;
    
    // Check if certificate already exists
    const existingCert = await prisma.certificate.findFirst({
      where: { studentId: user.id, courseId }
    });

    if (!existingCert) {
      // 1. Calculate Attendance
      const classes = await prisma.class.findMany({
        where: { batchId: user.studentProfile?.batchId || '' }
      });
      const completedClasses = classes.filter(c => c.status === 'COMPLETED');
      const attendance = await prisma.attendance.findMany({
        where: { studentId: user.id }
      });
      const attended = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      const attendanceRate = completedClasses.length > 0 ? (attended / completedClasses.length) : 0;

      // 2. Calculate Assignment Grades
      const allAssignments = await prisma.assignment.findMany({
        where: { classId: { in: classes.map(c => c.id) } },
        include: { questions: { include: { submissions: { where: { studentId: user.id } } } } }
      });

      let totalPoints = 0;
      let earnedPoints = 0;
      allAssignments.forEach(a => {
        a.questions.forEach(q => {
          totalPoints += q.points;
          const sObj = q.submissions[0];
          if (sObj && sObj.isCorrect) {
            earnedPoints += q.points;
          }
        });
      });

      const gradeRate = totalPoints > 0 ? (earnedPoints / totalPoints) : 0;

      // Eligibility thresholds: Attendance >= 80% and Assignment Score >= 80%
      if (attendanceRate >= 0.8 && gradeRate >= 0.8) {
        // Automatically issue Certificate!
        const randomId = Math.floor(10000 + Math.random() * 90000);
        const certId = `CD-${question.assignment.class.module.course.title.substring(0, 3).toUpperCase()}-2026-${randomId}`;
        
        await prisma.certificate.create({
          data: {
            studentId: user.id,
            courseId,
            issuedDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            certificateId: certId
          }
        });

        // Notify Student
        await prisma.notification.create({
          data: {
            userId: user.id,
            message: `Congratulations! You have earned your Certificate of Excellence in ${question.assignment.class.module.course.title} (ID: ${certId}).`,
            isRead: false
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        isCorrect,
        score,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      }
    });

  } catch (error: any) {
    console.error('Submit answer API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
