import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all courses for Admin
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: { orderBy: { order: 'asc' } }
          }
        },
        features: true,
        projects: true,
        prerequisites: true,
        outcomes: true,
        faqs: true,
        batches: true
      }
    });
    return NextResponse.json({ courses });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST create course
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, description, duration, price } = body;

    const course = await prisma.course.create({
      data: {
        title: title || 'New Course Title',
        slug: slug || `new-course-${Date.now()}`,
        description: description || 'Add course description here.',
        duration: duration || '12 Weeks',
        price: price ? parseInt(price) : 9999,
        published: false
      }
    });

    // Create a default batch for this course
    await prisma.batch.create({
      data: {
        name: `${course.title} Batch Aug 2026`,
        courseId: course.id
      }
    });

    return NextResponse.json({ course });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create course' }, { status: 500 });
  }
}

// PUT update course details and curriculum
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { 
      id, 
      title, 
      slug, 
      description, 
      duration, 
      price, 
      priceOriginal, 
      mode, 
      published,
      features,
      prerequisites,
      outcomes,
      faqs,
      projects,
      modules
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Update basic course attributes in transaction
    const updatedCourse = await prisma.$transaction(async (tx) => {
      
      // Update core course
      const main = await tx.course.update({
        where: { id },
        data: {
          title,
          slug,
          description,
          duration,
          price: parseInt(price) || 0,
          priceOriginal: priceOriginal ? parseInt(priceOriginal) : null,
          mode: mode || 'Live',
          published: published !== undefined ? published : true,
        }
      });

      // Synchronize Features if provided
      if (features) {
        await tx.courseFeature.deleteMany({ where: { courseId: id } });
        if (features.length > 0) {
          await tx.courseFeature.createMany({
            data: features.map((f: any) => ({
              courseId: id,
              text: f.text,
              icon: f.icon || 'Check'
            }))
          });
        }
      }

      // Synchronize Prerequisites
      if (prerequisites) {
        await tx.coursePrerequisite.deleteMany({ where: { courseId: id } });
        if (prerequisites.length > 0) {
          await tx.coursePrerequisite.createMany({
            data: prerequisites.map((p: any) => ({
              courseId: id,
              text: p.text
            }))
          });
        }
      }

      // Synchronize Outcomes
      if (outcomes) {
        await tx.courseOutcome.deleteMany({ where: { courseId: id } });
        if (outcomes.length > 0) {
          await tx.courseOutcome.createMany({
            data: outcomes.map((o: any) => ({
              courseId: id,
              text: o.text
            }))
          });
        }
      }

      // Synchronize FAQs
      if (faqs) {
        await tx.courseFAQ.deleteMany({ where: { courseId: id } });
        if (faqs.length > 0) {
          await tx.courseFAQ.createMany({
            data: faqs.map((f: any) => ({
              courseId: id,
              question: f.question,
              answer: f.answer
            }))
          });
        }
      }

      // Synchronize Projects
      if (projects) {
        await tx.courseProject.deleteMany({ where: { courseId: id } });
        if (projects.length > 0) {
          await tx.courseProject.createMany({
            data: projects.map((p: any) => ({
              courseId: id,
              title: p.title,
              problemStatement: p.problemStatement,
              technologies: p.technologies,
              skillsCovered: p.skillsCovered,
              difficulty: p.difficulty || 'MEDIUM',
              outcome: p.outcome
            }))
          });
        }
      }

      // Synchronize Modules and Lessons
      if (modules) {
        // Because Cascade delete is set up, deleting modules will auto delete their CourseLessons
        await tx.module.deleteMany({ where: { courseId: id } });
        
        for (const m of modules) {
          const mod = await tx.module.create({
            data: {
              courseId: id,
              title: m.title,
              order: parseInt(m.order) || 1
            }
          });
          
          if (m.lessons && m.lessons.length > 0) {
            await tx.courseLesson.createMany({
              data: m.lessons.map((l: any, lIdx: number) => ({
                moduleId: mod.id,
                title: l.title,
                description: l.description || '',
                order: l.order || lIdx + 1
              }))
            });
          }
        }
      }

      return main;
    });

    return NextResponse.json({ course: updatedCourse });
  } catch (e: any) {
    console.error('Course PUT Error:', e);
    return NextResponse.json({ error: e.message || 'Failed to update course' }, { status: 500 });
  }
}
