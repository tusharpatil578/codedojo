import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const certificates = await prisma.certificate.findMany({
      where: { studentId: user.id },
      include: {
        course: true
      }
    });

    return NextResponse.json({
      success: true,
      studentName: user.name,
      certificates: certificates.map(c => ({
        id: c.id,
        courseTitle: c.course.title,
        issuedDate: c.issuedDate,
        certificateId: c.certificateId,
        status: c.status
      }))
    });

  } catch (error: any) {
    console.error('Certificate fetch API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
