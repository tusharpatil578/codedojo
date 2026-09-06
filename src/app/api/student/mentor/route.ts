import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const mentorSessions = await prisma.mentorSession.findMany({
      where: { studentId: user.id },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ],
      include: { mentor: true }
    });

    const activeMentorId = user.studentProfile?.mentorId;
    let mentorProfile = null;
    if (activeMentorId) {
      mentorProfile = await prisma.user.findUnique({
        where: { id: activeMentorId }
      });
    }

    return NextResponse.json({
      success: true,
      sessions: mentorSessions,
      assignedMentor: mentorProfile ? {
        id: mentorProfile.id,
        name: mentorProfile.name,
        email: mentorProfile.email,
        phone: mentorProfile.phone
      } : null
    });

  } catch (error: any) {
    console.error('Mentor fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const activeMentorId = user.studentProfile?.mentorId;
  if (!activeMentorId) {
    return NextResponse.json({ error: 'No mentor assigned to this student profile' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { date, time, topic } = body;

    if (!date || !time || !topic) {
      return NextResponse.json({ error: 'Missing date, time slot, or topic parameter' }, { status: 400 });
    }

    const newSession = await prisma.mentorSession.create({
      data: {
        studentId: user.id,
        mentorId: activeMentorId,
        date,
        time,
        topic,
        zoomLink: 'https://zoom.us/j/98765432100',
        status: 'SCHEDULED'
      }
    });

    // Notify Student
    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `Your mentor session on "${topic}" with your advisor has been booked for ${date} at ${time} PM.`,
        isRead: false
      }
    });

    return NextResponse.json({
      success: true,
      session: newSession
    });

  } catch (error: any) {
    console.error('Mentor booking error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
