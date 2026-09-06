import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getBigQueryAnalyticsSummary } from '@/lib/bigquery';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const studentsCount = await prisma.studentProfile.count();
    const coursesCount = await prisma.course.count();
    const batchesCount = await prisma.batch.count();
    const ticketsCount = await prisma.supportTicket.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }
    });

    // Fetch analytical details from BigQuery / SQLite fallback
    const analytics = await getBigQueryAnalyticsSummary();

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: studentsCount,
        totalCourses: coursesCount,
        totalBatches: batchesCount,
        unresolvedTickets: ticketsCount,
        averageGrade: analytics.average_grade,
        dataSource: analytics.data_source
      }
    });

  } catch (error: any) {
    console.error('Admin stats query error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
