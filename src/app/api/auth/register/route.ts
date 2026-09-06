import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, phone, courseId } = body;

    if (!email || !password || !name || !courseId) {
      return NextResponse.json({ error: 'Missing required registration fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password and create user
    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        phone,
        role: 'STUDENT',
      },
    });

    // Find a batch matching the courseId
    const batch = await prisma.batch.findFirst({
      where: { courseId },
    });

    // Assign a default mentor (e.g. Siddharth Mehta)
    const mentor = await prisma.user.findFirst({
      where: { role: 'MENTOR' },
    });

    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        courseId,
        batchId: batch ? batch.id : null,
        mentorId: mentor ? mentor.id : null,
      },
    });

    // Automatically create a "Welcome to CODEDOJO" notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `Welcome to CODEDOJO, ${name}! Start exploring your dashboard and modules.`,
        isRead: false,
      },
    });

    // Sign JWT
    const token = await signJWT({ id: user.id, email: user.email, role: user.role, name: user.name });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
