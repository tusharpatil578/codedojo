import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logAttendanceToBigQuery } from '@/lib/bigquery';

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const classId = searchParams.get('classId');

  try {
    if (!classId) {
      // Just return active classes list to populate select menu
      const classes = await prisma.class.findMany({
        include: { batch: true },
        orderBy: { date: 'desc' }
      });
      return NextResponse.json({ success: true, classes });
    }

    const targetClass = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!targetClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Fetch all students enrolled in this class's batch
    const students = await prisma.studentProfile.findMany({
      where: { batchId: targetClass.batchId },
      include: { user: true }
    });

    // Fetch existing attendance logs
    const logs = await prisma.attendance.findMany({
      where: { classId }
    });

    return NextResponse.json({
      success: true,
      students: students.map(s => {
        const log = logs.find(l => l.studentId === s.userId);
        return {
          userId: s.userId,
          name: s.user.name,
          email: s.user.email,
          status: log ? log.status : 'ABSENT'
        };
      })
    });
  } catch (error: any) {
    console.error('Admin attendance fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { classId, records } = body; // records: { userId: string, status: string }[]

    if (!classId || !records || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Class ID and student records list are required' }, { status: 400 });
    }

    const targetClass = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!targetClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Process bulk check-in
    for (const r of records) {
      // Upsert attendance record in SQLite
      const existing = await prisma.attendance.findFirst({
        where: { classId, studentId: r.userId }
      });

      if (existing) {
        await prisma.attendance.update({
          where: { id: existing.id },
          data: { status: r.status, markedById: user.id, markedAt: new Date() }
        });
      } else {
        await prisma.attendance.create({
          data: {
            classId,
            studentId: r.userId,
            status: r.status,
            markedById: user.id
          }
        });
      }

      // Stream log to BigQuery Analytics
      const studentUser = await prisma.user.findUnique({ where: { id: r.userId } });
      if (studentUser) {
        await logAttendanceToBigQuery({
          studentId: r.userId,
          studentName: studentUser.name,
          classTitle: targetClass.title,
          status: r.status,
          markedAt: new Date().toISOString()
        });
      }
    }

    // If the class is not already marked completed, update it
    if (targetClass.status !== 'COMPLETED') {
      await prisma.class.update({
        where: { id: classId },
        data: { status: 'COMPLETED' }
      });

      // Notify students that recording (and attendance stats) are available
      const batchStudents = await prisma.studentProfile.findMany({
        where: { batchId: targetClass.batchId }
      });
      for (const s of batchStudents) {
        await prisma.notification.create({
          data: {
            userId: s.userId,
            message: `Attendance marks and recording are now posted for lecture "${targetClass.title}".`,
            isRead: false
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin attendance save error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
