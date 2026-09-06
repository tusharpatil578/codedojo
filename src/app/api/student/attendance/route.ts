import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: user.id },
      include: {
        class: {
          include: {
            instructor: true,
            module: true
          }
        }
      },
      orderBy: {
        class: {
          date: 'desc'
        }
      }
    });

    // Parse month categories dynamically
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthlyStats: Record<string, { attended: number; total: number }> = {};

    attendance.forEach(a => {
      // Expecting date string format '2026-08-29'
      const parts = a.class.date.split('-');
      if (parts.length === 3) {
        const monthIndex = parseInt(parts[1], 10) - 1;
        const monthName = months[monthIndex];

        if (!monthlyStats[monthName]) {
          monthlyStats[monthName] = { attended: 0, total: 0 };
        }

        monthlyStats[monthName].total++;
        if (a.status === 'PRESENT' || a.status === 'LATE') {
          monthlyStats[monthName].attended++;
        }
      }
    });

    const monthlyReport = Object.keys(monthlyStats).map(m => ({
      month: m,
      attended: monthlyStats[m].attended,
      total: monthlyStats[m].total,
      percentage: Math.round((monthlyStats[m].attended / monthlyStats[m].total) * 100)
    }));

    return NextResponse.json({
      success: true,
      records: attendance.map(a => ({
        id: a.id,
        date: a.class.date,
        classTitle: a.class.title,
        instructorName: a.class.instructor.name,
        status: a.status
      })),
      monthlyReport
    });

  } catch (error: any) {
    console.error('Attendance fetch API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
