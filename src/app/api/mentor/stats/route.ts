import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'MENTOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get assigned students
    const students = await prisma.studentProfile.findMany({
      where: { mentorId: user.id },
      include: {
        user: true,
        batch: true
      }
    });

    // 2. Get mentor sessions
    const sessions = await prisma.mentorSession.findMany({
      where: { mentorId: user.id },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ],
      include: {
        student: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      students: students.map(s => ({
        id: s.id,
        name: s.user.name,
        email: s.user.email,
        batchName: s.batch?.name || 'Unassigned'
      })),
      sessions: sessions.map(s => ({
        id: s.id,
        studentName: s.student.name,
        studentEmail: s.student.email,
        date: s.date,
        time: s.time,
        topic: s.topic,
        zoomLink: s.zoomLink,
        status: s.status,
        notes: s.notes,
        actionItems: s.actionItems
      }))
    });

  } catch (error: any) {
    console.error('Mentor dashboard error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
