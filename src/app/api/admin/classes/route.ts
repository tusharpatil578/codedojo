import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const classes = await prisma.class.findMany({
      include: {
        batch: true,
        instructor: true,
        module: true
      },
      orderBy: [
        { date: 'desc' },
        { startTime: 'desc' }
      ]
    });

    const instructors = await prisma.user.findMany({ where: { role: 'INSTRUCTOR' } });
    const batches = await prisma.batch.findMany({ include: { course: true } });
    const modules = await prisma.module.findMany({ include: { course: true } });

    return NextResponse.json({
      success: true,
      classes: classes.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        date: c.date,
        startTime: c.startTime,
        endTime: c.endTime,
        zoomLink: c.zoomLink,
        status: c.status,
        batchName: c.batch.name,
        instructorName: c.instructor.name,
        moduleTitle: c.module.title
      })),
      instructors: instructors.map(i => ({ id: i.id, name: i.name })),
      batches: batches.map(b => ({ id: b.id, name: b.name })),
      modules: modules.map(m => ({ id: m.id, title: m.title, courseTitle: m.course.title }))
    });

  } catch (error: any) {
    console.error('Admin classes query error:', error);
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
    const { title, description, date, startTime, endTime, zoomLink, instructorId, moduleId, batchId } = body;

    if (!title || !date || !startTime || !endTime || !zoomLink || !instructorId || !moduleId || !batchId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        title,
        description,
        date,
        startTime,
        endTime,
        zoomLink,
        instructorId,
        moduleId,
        batchId,
        status: 'UPCOMING'
      }
    });

    // Automations: Notify all enrolled students in the batch
    const profiles = await prisma.studentProfile.findMany({
      where: { batchId }
    });

    for (const s of profiles) {
      await prisma.notification.create({
        data: {
          userId: s.userId,
          message: `Your schedule has been updated! New class "${title}" is set for ${date} at ${startTime} PM.`,
          isRead: false
        }
      });
    }

    return NextResponse.json({ success: true, class: newClass });

  } catch (error: any) {
    console.error('Admin schedule class error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
