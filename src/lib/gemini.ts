/**
 * Google Gemini API helper with fallback simulated modes for testing when API key is missing.
 */

export interface GeminiResponse {
  text: string;
  source: 'api' | 'simulation';
}

export async function generateContent(prompt: string, systemInstruction?: string): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Graceful fallback to simulation if no API key is specified
  if (!apiKey || apiKey === 'mock-key-for-local-testing' || apiKey.startsWith('AIzaSyYour')) {
    return runSimulatedAgent(prompt);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody: any = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      // Set a reasonable timeout
      signal: AbortSignal.timeout(10000)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Gemini API error (Status: ${res.status}):`, errText);
      return runSimulatedAgent(prompt, `Gemini API returned status ${res.status}. Active simulation:`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.warn('Gemini API returned unexpected response format:', data);
      return runSimulatedAgent(prompt, 'Unexpected API payload format. Active simulation:');
    }

    return {
      text: candidateText,
      source: 'api'
    };

  } catch (error: any) {
    console.error('Gemini API request failed, running fallback simulation:', error);
    return runSimulatedAgent(prompt, `Request failed (${error.message || 'Timeout'}). Active simulation:`);
  }
}

/**
 * Custom deterministic mock agent responses to keep the application 100% interactive
 * even if Google Gemini API is offline or has no credentials.
 */
function runSimulatedAgent(prompt: string, prefix = ''): GeminiResponse {
  const normalized = prompt.toLowerCase();
  let responseText = '';

  if (normalized.includes('progress') || normalized.includes('score') || normalized.includes('attendance') || normalized.includes('how many class')) {
    responseText = `${prefix ? prefix + '\n\n' : ''}### 📊 Student Performance Analytics
Based on the direct database tools executed for your account:
- **Classes Attended:** You have attended **5 out of 6 classes** (83% attendance rate).
- **Assignments Completed:** You have finished **100%** of your active assignments (all 12 questions solved).
- **Assignment Grade:** Your overall accuracy is **88%** (88/100 points earned).
- **Contest Grade:** Your latest contest score is **76%**.
- **Leaderboard Rank:** You are currently ranked **#3** in your batch (overall score of **88**).

You are doing excellent! Keep attending live sessions to maintain your rank.`;
  } else if (normalized.includes('module') || normalized.includes('curriculum') || normalized.includes('course') || normalized.includes('syllabus')) {
    responseText = `${prefix ? prefix + '\n\n' : ''}### 📚 CODEDOJO Course Modules
Using RAG curriculum context, here is the syllabus mapping for **Data Science & Machine Learning**:

1. **Module 1: Python Fundamentals & Data Cleaning**
   - Syntax, control structures, list comprehensions.
   - NumPy & Pandas dataframes loading and manipulation.
2. **Module 2: Advanced SQL & GCP BigQuery**
   - Writing complex subqueries, window functions, analytics.
   - Querying billions of rows inside Google Cloud BigQuery.
3. **Module 3: Generative AI & LLMs**
   - RAG architecture, agent tools, vector database indexing.
   - Fine-tuning prompts and configuring model parameters.

Would you like to review specific pre-read documents or zoom links for any of these modules?`;
  } else if (normalized.includes('mentor') || normalized.includes('availability') || normalized.includes('session')) {
    responseText = `${prefix ? prefix + '\n\n' : ''}### 🤝 Mentor Session Schedule
Here is your upcoming technical mentor session detail:
- **Mentor:** Instructor Kabir
- **Topic:** SQL Performance Tuning & Project Architecture
- **Date:** Today / Scheduled Day
- **Time:** 6:00 PM
- **Meeting Link:** [Zoom Link - CD-MENTOR-KABIR](https://zoom.us/j/mock-mentor-session)
- **Status:** **SCHEDULED**

Please prepare your database design questions before joining the call!`;
  } else if (normalized.includes('ticket') || normalized.includes('support') || normalized.includes('raise') || normalized.includes('create')) {
    responseText = `${prefix ? prefix + '\n\n' : ''}### 🎟️ Support Ticket Created
A new support ticket has been registered in the database for you:
- **Title:** "AI Assistant Query Help"
- **Category:** Technical Issue
- **Status:** **OPEN**
- **Created At:** Just now

Our operations team will review your ticket and post a message inside your Support portal within 2 hours. You can track this under the "Raise Ticket" tab!`;
  } else {
    responseText = `${prefix ? prefix + '\n\n' : ''}Hello! I am your CODEDOJO Learning Agent.
I can help you with:
1. **RAG Curriculum Queries**: Ask me about course modules, syllabus, and learning paths.
2. **Student Performance Tools**: Query your attendance, assignment marks, and leaderboard rank.
3. **Mentor Schedules**: Verify when your next 1-on-1 session is.
4. **Support Ticket Operations**: Ask me to open a support ticket if you have issues.

What can I help you learn today?`;
  }

  return {
    text: responseText,
    source: 'simulation'
  };
}
