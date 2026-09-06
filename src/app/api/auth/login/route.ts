import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, password, phone, otp, provider } = body;

    let user = null;

    if (type === 'credentials') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user || user.passwordHash !== hashPassword(password)) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    } else if (type === 'mobile') {
      if (!phone || !otp) {
        return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 });
      }

      // Simulated OTP check (for development, accept "123456" or any 6 digit OTP)
      if (otp !== '123456' && otp.length !== 6) {
        return NextResponse.json({ error: 'Invalid OTP. Use 123456 to login.' }, { status: 401 });
      }

      // Look up user by phone number
      user = await prisma.user.findFirst({
        where: { phone },
      });

      if (!user) {
        // If not found, let's create a new student profile for this phone number
        // We will bind them to the Cloud Computing course as a default
        const defaultCourse = await prisma.course.findFirst({
          where: { title: { contains: 'Cloud' } }
        });
        const defaultBatch = await prisma.batch.findFirst({
          where: { name: { contains: 'GCP' } }
        });

        user = await prisma.user.create({
          data: {
            email: `user_${phone}@codedojo.com`,
            name: `User ${phone}`,
            phone,
            passwordHash: hashPassword('password123'),
            role: 'STUDENT',
          }
        });

        if (defaultCourse && defaultBatch) {
          await prisma.studentProfile.create({
            data: {
              userId: user.id,
              courseId: defaultCourse.id,
              batchId: defaultBatch.id,
            }
          });
        }
      }
    } else if (type === 'social') {
      if (!provider || (provider !== 'google' && provider !== 'facebook')) {
        return NextResponse.json({ error: 'Valid social provider is required' }, { status: 400 });
      }

      // For social logins in our MVP, we automatically log in as the primary student "Aarav Sharma"
      // to showcase a full course progression.
      user = await prisma.user.findUnique({
        where: { email: 'aarav@codedojo.com' },
      });

      if (!user) {
        // Fallback: create a user
        user = await prisma.user.create({
          data: {
            email: `social_${provider}@codedojo.com`,
            name: `${provider === 'google' ? 'Google' : 'Facebook'} Student`,
            passwordHash: hashPassword('password123'),
            role: 'STUDENT',
          }
        });
      }
    } else {
      return NextResponse.json({ error: 'Invalid authentication type' }, { status: 400 });
    }

    // Sign JWT session
    const token = await signJWT({ id: user.id, email: user.email, role: user.role, name: user.name });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
