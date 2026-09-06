import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'codedojo_super_secret_key_128_128_0_olive_green'
);

export default async function DashboardRedirectPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let destination = '/login';

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    if (role === 'ADMIN') {
      destination = '/admin/dashboard';
    } else if (role === 'STUDENT') {
      destination = '/student/dashboard';
    } else if (role === 'MENTOR') {
      destination = '/mentor/dashboard';
    } else if (role === 'INSTRUCTOR') {
      destination = '/instructor/dashboard';
    }
  } catch (error) {
    console.error('Dashboard token decoding error:', error);
    destination = '/login';
  }

  redirect(destination);
}
