import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'INSTRUCTOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get classes taught by this instructor
    const classes = await prisma.class.findMany({
      where: { instructorId: user.id },
      include: {
        batch: {
          include: {
            course: true
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { startTime: 'desc' }
      ]
    });

    // Extract unique courses taught
    const coursesMap = new Map();
    classes.forEach(c => {
      const course = c.batch.course;
      coursesMap.set(course.id, {
        id: course.id,
        title: course.title,
        description: course.description
      });
    });
    const uniqueCourses = Array.from(coursesMap.values());

    return NextResponse.json({
      success: true,
      courses: uniqueCourses,
      classes: classes.map(c => ({
        id: c.id,
        title: c.title,
        date: c.date,
        startTime: c.startTime,
        endTime: c.endTime,
        zoomLink: c.zoomLink,
        status: c.status,
        batchName: c.batch.name
      }))
    });

  } catch (error: any) {
    console.error('Instructor statistics error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
