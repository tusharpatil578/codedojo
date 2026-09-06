import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        studentProfile: {
          include: {
            course: true,
            batch: true,
            mentor: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const batches = await prisma.batch.findMany({ include: { course: true } });
    const mentors = await prisma.user.findMany({ where: { role: 'MENTOR' } });

    return NextResponse.json({
      success: true,
      students: students.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        status: s.studentProfile?.status || 'ACTIVE',
        courseTitle: s.studentProfile?.course?.title || 'None',
        batchName: s.studentProfile?.batch?.name || 'Unassigned',
        batchId: s.studentProfile?.batchId,
        mentorName: s.studentProfile?.mentor?.name || 'Unassigned',
        mentorId: s.studentProfile?.mentorId
      })),
      batches: batches.map(b => ({ id: b.id, name: b.name, courseTitle: b.course.title })),
      mentors: mentors.map(m => ({ id: m.id, name: m.name }))
    });

  } catch (error: any) {
    console.error('Admin students fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { studentUserId, batchId, mentorId, status } = body;

    if (!studentUserId) {
      return NextResponse.json({ error: 'Student User ID is required' }, { status: 400 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: studentUserId }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Student Profile not found' }, { status: 404 });
    }

    // Update Profile
    await prisma.studentProfile.update({
      where: { userId: studentUserId },
      data: {
        batchId: batchId || undefined,
        mentorId: mentorId || undefined,
        status: status || undefined
      }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Admin student update error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
