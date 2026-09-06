import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { studentId: user.id },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ success: true, tickets });

  } catch (error: any) {
    console.error('Support ticket fetch API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, category } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing title, category or description parameter' }, { status: 400 });
    }

    // Create Support Ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        studentId: user.id,
        title,
        description,
        category,
        status: 'OPEN'
      }
    });

    // Create Initial Message in Chat log
    await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: user.id,
        message: description
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `Your support ticket regarding "${title}" has been successfully logged (ID: ${ticket.id}).`,
        isRead: false
      }
    });

    return NextResponse.json({ success: true, ticket });

  } catch (error: any) {
    console.error('Support ticket create error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
