import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = user.studentProfile;
  if (!profile || !profile.batchId) {
    return NextResponse.json({ error: 'No active batch assigned' }, { status: 404 });
  }

  try {
    // Fetch course details, modules, and classes
    const course = await prisma.course.findUnique({
      where: { id: profile.courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            classes: {
              where: { batchId: profile.batchId },
              orderBy: { date: 'asc' },
              include: {
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
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Fetch student's attendance records to evaluate completed classes
    const attendance = await prisma.attendance.findMany({
      where: { studentId: user.id }
    });

    // Format module stats
    const modulesWithStats = course.modules.map((mod) => {
      const totalClasses = mod.classes.length;
      
      // Class status evaluation
      const classesFormatted = mod.classes.map((cls) => {
        const hasAttended = attendance.find(a => a.classId === cls.id && (a.status === 'PRESENT' || a.status === 'LATE'));
        
        let status = 'LOCKED';
        if (cls.status === 'COMPLETED') {
          status = 'COMPLETED';
        } else if (cls.status === 'LIVE') {
          status = 'IN_PROGRESS';
        } else if (cls.status === 'UPCOMING') {
          // If the previous class is completed, this is "UPCOMING", otherwise "LOCKED"
          status = 'UPCOMING';
        }

        // Evaluate assignment progress for this class
        let assignmentSolved = 0;
        let assignmentTotal = 0;
        const assignment = cls.assignments[0];
        if (assignment) {
          assignmentTotal = assignment.questions.length;
          assignment.questions.forEach((q) => {
            if (q.submissions && q.submissions.length > 0) {
              assignmentSolved++;
            }
          });
        }

        return {
          id: cls.id,
          title: cls.title,
          description: cls.description,
          date: cls.date,
          startTime: cls.startTime,
          status,
          hasAttended: !!hasAttended,
          assignment: assignment ? {
            id: assignment.id,
            title: assignment.title,
            solved: assignmentSolved,
            total: assignmentTotal
          } : null
        };
      });

      const completedClasses = classesFormatted.filter(c => c.status === 'COMPLETED').length;
      const progressPercent = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

      return {
        id: mod.id,
        title: mod.title,
        order: mod.order,
        progressPercent,
        completedClasses,
        totalClasses,
        classes: classesFormatted
      };
    });

    return NextResponse.json({
      success: true,
      courseTitle: course.title,
      courseDescription: course.description,
      modules: modulesWithStats
    });

  } catch (error: any) {
    console.error('Curriculum query error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
