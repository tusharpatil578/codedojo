import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { classId } = await params;

  try {
    const lecture = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        instructor: true,
        assignments: {
          include: {
            questions: {
              include: {
                submissions: {
                  where: { studentId: user.id }
                }
              }
            }
          }
        }
      }
    });

    if (!lecture) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Format pre-read and post-read
    const preRead = lecture.preRead ? JSON.parse(lecture.preRead) : null;
    const postRead = lecture.postRead ? JSON.parse(lecture.postRead) : null;

    // Attendance status for this student
    const attendance = await prisma.attendance.findFirst({
      where: { classId, studentId: user.id }
    });

    return NextResponse.json({
      success: true,
      class: {
        id: lecture.id,
        title: lecture.title,
        description: lecture.description,
        date: lecture.date,
        startTime: lecture.startTime,
        endTime: lecture.endTime,
        zoomLink: lecture.zoomLink,
        recordingUrl: lecture.recordingUrl,
        status: lecture.status,
        instructorName: lecture.instructor.name,
        preRead,
        postRead,
        attendanceStatus: attendance ? attendance.status : 'ABSENT',
        assignments: lecture.assignments.map(a => ({
          id: a.id,
          title: a.title,
          difficulty: a.difficulty,
          deadline: a.deadline,
          questions: a.questions.map(q => {
            const mySubmission = q.submissions[0];
            return {
              id: q.id,
              text: q.text,
              type: q.type,
              options: q.options ? JSON.parse(q.options) : null,
              points: q.points,
              myAnswer: mySubmission ? mySubmission.answer : null,
              isCorrect: mySubmission ? mySubmission.isCorrect : null,
              score: mySubmission ? mySubmission.score : 0,
              correctAnswer: mySubmission ? q.correctAnswer : undefined, // Hide answer unless solved
              explanation: mySubmission ? q.explanation : undefined, // Hide explanation unless solved
            };
          })
        }))
      }
    });

  } catch (error: any) {
    console.error('Class query error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
