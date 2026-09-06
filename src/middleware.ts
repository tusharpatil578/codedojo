import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'codedojo_super_secret_key_128_128_0_olive_green'
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const path = req.nextUrl.pathname;

  // Paths that require authentication
  const isStudentPath = path.startsWith('/student');
  const isAdminPath = path.startsWith('/admin');
  const isMentorPath = path.startsWith('/mentor');
  const isInstructorPath = path.startsWith('/instructor');
  const isDashboardPath = path.startsWith('/dashboard');

  if (isStudentPath || isAdminPath || isDashboardPath || isMentorPath || isInstructorPath) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(path)}`, req.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      if (!payload) {
        const res = NextResponse.redirect(new URL('/login', req.url));
        res.cookies.delete('token');
        return res;
      }

      // Check role permissions
      const role = payload.role as string;

      if (isAdminPath && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      if (isStudentPath && role !== 'STUDENT' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      if (isMentorPath && role !== 'MENTOR' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      if (isInstructorPath && role !== 'INSTRUCTOR' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

    } catch (e) {
      const res = NextResponse.redirect(new URL('/login', req.url));
      res.cookies.delete('token');
      return res;
    }
  }

  // If already logged in, redirect away from login/register
  if (path === '/login' || path === '/register') {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch (e) {
        // Bad token, clear it
        const res = NextResponse.next();
        res.cookies.delete('token');
        return res;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/:path*',
    '/admin/:path*',
    '/mentor/:path*',
    '/instructor/:path*',
    '/dashboard',
    '/login',
    '/register',
  ],
};
