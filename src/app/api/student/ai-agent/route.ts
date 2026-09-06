import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateContent } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  const traceLogs: string[] = [];
  
  // 1. Next.js App Router & API Layer Entry
  traceLogs.push("⚡ [Next.js Web Router] Post request received at /api/student/ai-agent");
  traceLogs.push("⚙️ [Backend API] Extracting request payload and parsing cookies");

  try {
    // 2. Authentication Layer (JWT verification)
    const user = await getSessionUser();
    if (!user || user.role !== 'STUDENT') {
      traceLogs.push("❌ [Authentication] JWT token verification failed or unauthorized role");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    traceLogs.push(`🔒 [Authentication] JWT validated: User="${user.name}" (ID: ${user.id.substring(0,8)}...), Role="STUDENT"`);

    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      traceLogs.push("⚠️ [Backend API] Empty or invalid message payload");
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const query = message.trim();
    traceLogs.push(`💬 [Backend API] User query received: "${query}"`);

    // 3. PostgreSQL Database Connection Pool initialization
    traceLogs.push("🔌 [PostgreSQL / Supabase] Borrowing client from Prisma connection pool");

    // 4. RAG (Retrieval-Augmented Generation) Core
    traceLogs.push("🔍 [RAG Core] Analyzing query concepts for Curriculum matching...");
    
    // Fetch courses matching curriculum or just load active course syllabus
    const activeCourseId = user.studentProfile?.courseId;
    let courseInfo = "";
    
    if (activeCourseId) {
      const course = await prisma.course.findUnique({
        where: { id: activeCourseId },
        include: {
          modules: {
            include: {
              classes: true
            }
          }
        }
      });
      if (course) {
        courseInfo = `Course Title: ${course.title}\nModules:\n` + 
          course.modules.map(m => `- Module ${m.order}: ${m.title} (${m.classes.length} classes)`).join("\n");
        traceLogs.push(`📚 [RAG Core] Database query success: Extracted syllabus metadata for "${course.title}"`);
      }
    } else {
      traceLogs.push("🔍 [RAG Core] No course profile found. Scanning all public course records");
      const publicCourses = await prisma.course.findMany({ take: 3 });
      courseInfo = publicCourses.map(c => `- ${c.title} (${c.duration})`).join("\n");
    }

    // 5. AI Agent & Tool Executor
    traceLogs.push("🤖 [AI Agent Loop] Intent classifier running. Deciding which database tool to run...");
    
    const normalized = query.toLowerCase();
    let toolResult = "";
    let executedTool = "None";

    // Intent 1: Student progress/attendance/grades
    if (normalized.includes('progress') || normalized.includes('score') || normalized.includes('attendance') || normalized.includes('how many class') || normalized.includes('grade')) {
      executedTool = "get_student_progress";
      traceLogs.push(`🛠️ [AI Agent Loop] Selected Tool: "${executedTool}"`);
      
      // Execute database logic
      const totalClasses = await prisma.class.count({
        where: { batchId: user.studentProfile?.batchId || "" }
      });
      const attendance = await prisma.attendance.findMany({
        where: { studentId: user.id }
      });
      const attendedCount = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      
      const submissions = await prisma.submission.findMany({
        where: { studentId: user.id }
      });
      const correctCount = submissions.filter(s => s.isCorrect).length;
      const totalScore = correctCount * 10;

      toolResult = `Student Performance Stats:\n- Attended ${attendedCount} of ${totalClasses} classes.\n- Completed ${submissions.length} assignment questions, scoring ${totalScore} accuracy points.`;
      traceLogs.push(`📊 [Tool execution: ${executedTool}] SQL query complete. Fetched attendance & scores`);
    }
    // Intent 2: Mentor sessions
    else if (normalized.includes('mentor') || normalized.includes('session') || normalized.includes('availability')) {
      executedTool = "check_mentor_availability";
      traceLogs.push(`🛠️ [AI Agent Loop] Selected Tool: "${executedTool}"`);

      const sessions = await prisma.mentorSession.findMany({
        where: { studentId: user.id },
        include: { mentor: true }
      });

      if (sessions.length > 0) {
        toolResult = sessions.map(s => `- Topic: "${s.topic}" with ${s.mentor.name} on ${s.date} at ${s.time} (${s.status})`).join("\n");
      } else {
        toolResult = "No scheduled mentor sessions found in DB.";
      }
      traceLogs.push(`🤝 [Tool execution: ${executedTool}] SQL query complete. Retrieved ${sessions.length} mentor sessions`);
    }
    // Intent 3: Raise/Create support ticket
    else if (normalized.includes('ticket') || normalized.includes('support') || normalized.includes('raise') || normalized.includes('create')) {
      executedTool = "create_support_ticket";
      traceLogs.push(`🛠️ [AI Agent Loop] Selected Tool: "${executedTool}"`);

      // Actually raise a database record in Supabase!
      try {
        const ticket = await prisma.supportTicket.create({
          data: {
            studentId: user.id,
            title: `AI Agent Ticket: ${query.substring(0, 40)}`,
            description: `Auto-generated ticket raised by student query: "${query}"`,
            category: "Technical Issue",
            status: "OPEN"
          }
        });
        toolResult = `Successfully raised support ticket: ID=${ticket.id.substring(0,8)}..., Category=Technical Issue, Status=OPEN.`;
        traceLogs.push(`🎟️ [Tool execution: ${executedTool}] SQL Write complete! Created Ticket Record in Supabase database`);
      } catch (err: any) {
        toolResult = `Failed to create ticket: ${err.message}`;
        traceLogs.push(`❌ [Tool execution: ${executedTool}] Error writing to PostgreSQL: ${err.message}`);
      }
    }
    // Intent 4: Normal conversation (No tool)
    else {
      traceLogs.push("ℹ️ [AI Agent Loop] No custom database tools required. Directing context payload to LLM");
      toolResult = "No specific tool execution data required.";
    }

    // 6. AI/LLM Synthesis Stage (with RAG & Tool context)
    traceLogs.push("🧠 [AI/LLM Stage] Injecting prompt + system instructions into Gemini context");
    
    const systemPrompt = `You are the CODEDOJO Learning Assistant, integrated into a Next.js full-stack platform running on Supabase PostgreSQL.
Your goal is to answer student queries about their courses, attendance, grades, and sessions.
Below is the verified context fetched from the database:
[RAG CURRICULUM CONTEXT]
${courseInfo}

[AGENT TOOL QUERY RESULTS]
${toolResult}

Always reply in a professional, encouraging, and clear developer tone. Use Markdown.
If you used a tool (like creating a ticket or fetching scores), explicitly summarize it in your response.`;

    const userPrompt = `Student Username: ${user.name}
Student Email: ${user.email}
Query: ${query}`;

    traceLogs.push("🤖 [AI/LLM Stage] Invoking Google Gemini 2.5 Flash model");
    const aiResponse = await generateContent(userPrompt, systemPrompt);
    traceLogs.push(`✅ [AI/LLM Stage] Response generated successfully (Source: ${aiResponse.source})`);

    // 7. DevOps & CI-CD Trace Simulator Logs
    traceLogs.push("📦 [Docker Container] Response packaged in Next.js Serverless Standalone payload");
    traceLogs.push("☁️ [Cloud / Vercel] Streaming response payload over HTTP header to client");

    return NextResponse.json({
      success: true,
      response: aiResponse.text,
      source: aiResponse.source,
      executedTool,
      logs: traceLogs
    });

  } catch (error: any) {
    traceLogs.push(`❌ [System Error] Execution aborted: ${error.message}`);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error',
      logs: traceLogs
    }, { status: 500 });
  }
}
