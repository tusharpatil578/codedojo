'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Bot, 
  Wrench, 
  Layers, 
  Cpu, 
  Container, 
  GitBranch, 
  Cloud,
  Send, 
  CheckCircle, 
  Activity, 
  Code2, 
  Info,
  RefreshCw,
  AlertTriangle,
  Play
} from 'lucide-react';

interface LogLine {
  text: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'system';
}

interface PipelineNode {
  id: string;
  name: string;
  icon: any;
  status: 'dormant' | 'active' | 'success' | 'error';
  description: string;
  details: string;
  codeSnippet?: string;
}

export default function SandboxPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Welcome to the CODEDOJO Architecture Sandbox! Ask me questions about your curriculum, check your attendance progress, or query mentor availability to watch the data trace down our 11-step pipeline.' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [selectedNode, setSelectedNode] = useState<string>('nextjs');
  const [systemOnline, setSystemOnline] = useState(true);
  
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 11 Pipeline Nodes definitions
  const [nodes, setNodes] = useState<PipelineNode[]>([
    {
      id: 'nextjs',
      name: 'Next.js',
      icon: Layers,
      status: 'dormant',
      description: 'Full-stack React Framework supplying the app structure, visual components, client hydration, and routing.',
      details: 'This sandbox uses Next.js 16 App Router. When you submit a request, Next.js routes the query through serverless route segments.',
      codeSnippet: `// next.config.ts\nimport type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {\n  output: "standalone",\n  reactStrictMode: true,\n};\n\nexport default nextConfig;`
    },
    {
      id: 'api',
      name: 'Backend API',
      icon: Cpu,
      status: 'dormant',
      description: 'Serverless route handlers executing backend procedures and database requests.',
      details: 'POST requests flow into \`/api/student/ai-agent\`. The router processes payloads and returns structured responses.',
      codeSnippet: `// src/app/api/student/ai-agent/route.ts\nexport async function POST(req: NextRequest) {\n  const { message } = await req.json();\n  // Route execution logic...\n  return NextResponse.json({ success: true, response });\n}`
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      icon: Database,
      status: 'dormant',
      description: 'Supabase-managed PostgreSQL database storing user stats, classes, and support tickets.',
      details: 'Connects via connection pooler (port 6543) and executes SQL queries through Prisma ORM wrapper.',
      codeSnippet: `// prisma/schema.prisma\ndatasource db {\n  provider  = "postgresql"\n  url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")\n}\n\nmodel User {\n  id    String @id @default(uuid())\n  email String @unique\n}`
    },
    {
      id: 'auth',
      name: 'Authentication',
      icon: ShieldCheck,
      status: 'dormant',
      description: 'Session enforcement using JWT (JSON Web Tokens) inside HTTP-only cookies.',
      details: 'Validates user roles (STUDENT, ADMIN) and decodes user metadata securely on every API call.',
      codeSnippet: `// src/lib/auth.ts\nexport async function getSessionUser() {\n  const token = cookies().get('token')?.value;\n  if (!token) return null;\n  const payload = await verifyJWT(token);\n  return prisma.user.findUnique({ where: { id: payload.id } });\n}`
    },
    {
      id: 'llm',
      name: 'AI / LLM',
      icon: Bot,
      status: 'dormant',
      description: 'Generative model processing requests and generating contextual answers.',
      details: 'Powered by Google Gemini 2.5 Flash API. Handles prompts containing dynamic curriculum and DB context.',
      codeSnippet: `// src/lib/gemini.ts\nexport async function generateContent(prompt: string, systemInstruction?: string) {\n  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`;\n  const res = await fetch(url, { method: 'POST', body: JSON.stringify({ contents, systemInstruction }) });\n  return res.json();\n}`
    },
    {
      id: 'rag',
      name: 'RAG',
      icon: Sparkles,
      status: 'dormant',
      description: 'Retrieval-Augmented Generation retrieving curriculum modules to inject into the LLM prompt.',
      details: 'Queries PostgreSQL for courses, modules, and classes matching the student profile, appending syllabus details to the system prompt.',
      codeSnippet: `// RAG implementation in Route Handler\nconst course = await prisma.course.findUnique({\n  where: { id: user.studentProfile.courseId },\n  include: { modules: true }\n});\nconst courseInfo = course.modules.map(m => m.title).join('\\n');`
    },
    {
      id: 'agent',
      name: 'AI Agent',
      icon: Activity,
      status: 'dormant',
      description: 'Autonomous execution engine running an intent-classifier loop to decide database tools.',
      details: 'Scans the natural language input to check if standard database tools (progress report, mentor sessions, ticket creation) need to run.',
      codeSnippet: `// AI Agent Decision Loop\nif (normalized.includes('progress') || normalized.includes('score')) {\n  executedTool = "get_student_progress";\n  toolResult = await runStudentProgressTool(user.id);\n}`
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: Wrench,
      status: 'dormant',
      description: 'Functional database execution hooks available for the AI Agent to run.',
      details: 'Direct SQL wrappers in Prisma that query student metrics or perform inserts (e.g. creating support tickets).',
      codeSnippet: `// create_support_ticket tool\nconst ticket = await prisma.supportTicket.create({\n  data: {\n    studentId: user.id,\n    title: \`AI Agent Ticket: \${query.substring(0,40)}\`,\n    category: "Technical Issue",\n    status: "OPEN"\n  }\n});`
    },
    {
      id: 'docker',
      name: 'Docker',
      icon: Container,
      status: 'dormant',
      description: 'Containerization wrapper bundling Next.js, standalone build files, and Prisma engines.',
      details: 'Utilizes a multi-stage Dockerfile containing Alpine Node image, compiling standalone files to save build space.',
      codeSnippet: `# Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN npx prisma generate && npm run build\n\nFROM node:20-alpine AS runner\nCOPY --from=builder /app/.next/standalone ./\nCMD ["node", "server.js"]`
    },
    {
      id: 'cicd',
      name: 'CI / CD',
      icon: GitBranch,
      status: 'dormant',
      description: 'Automated integration workflow compiling TypeScript, linting, and verifying Docker compilation.',
      details: 'Managed by GitHub Actions, running validation triggers on pushes to the master branch.',
      codeSnippet: `# .github/workflows/deploy.yml\nname: CI/CD Pipeline\non:\n  push:\n    branches: [ "master" ]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build`
    },
    {
      id: 'cloud',
      name: 'Cloud',
      icon: Cloud,
      status: 'dormant',
      description: 'Cloud hosting ecosystem rendering the application live on Vercel.',
      details: 'Vercel pulls code commits, serves static layers via edge endpoints, and routes API queries to serverless handlers.',
      codeSnippet: `# Vercel Settings\n# Auto-configured through Vercel Git integration.\n# Production environment requires:\n# DATABASE_URL, DIRECT_URL, JWT_SECRET, GEMINI_API_KEY`
    }
  ]);

  // Handle auto-scrolls
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inject system logs
  const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'error' | 'system' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { text, timestamp, type }]);
  };

  // Run initial diagnostics log
  useEffect(() => {
    addLog('System Diagnostics initialization...', 'system');
    addLog('Checking local server status... [OK]', 'success');
    addLog('Prisma Database connector instantiated', 'info');
    addLog('Supabase connection pool initialized (Port 6543)', 'success');
    addLog('Docker build image tag: codedojo-web:latest', 'info');
    addLog('System components ready for interactive simulation.', 'system');
  }, []);

  // Submit Query to Agent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userQuery = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsProcessing(true);

    // Initialize node animation sequence
    addLog(`Initiating request trace for query: "${userQuery}"`, 'system');
    
    // Step 1: Next.js Client Request
    updateNodeStatus('nextjs', 'active');
    addLog('[Next.js Client] Captured user submission. Packaging context headers.', 'info');
    
    await sleep(400);
    updateNodeStatus('nextjs', 'success');
    updateNodeStatus('api', 'active');
    addLog('[Backend API] Route POST /api/student/ai-agent matches. Extracting body payload.', 'info');

    // Step 2: Auth Validation
    await sleep(400);
    updateNodeStatus('api', 'success');
    updateNodeStatus('auth', 'active');
    addLog('[Authentication] Inspecting session cookies. Verifying JWT signatures.', 'info');

    await sleep(400);
    updateNodeStatus('auth', 'success');
    updateNodeStatus('postgres', 'active');
    addLog('[PostgreSQL] DB client request. Checking connection state...', 'info');

    // Step 3: Call real API backend
    try {
      const res = await fetch('/api/student/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuery })
      });

      if (!res.ok) {
        throw new Error(`API returned error status ${res.status}`);
      }

      const data = await res.json();
      
      // Step 4: RAG processing
      updateNodeStatus('postgres', 'success');
      updateNodeStatus('rag', 'active');
      addLog('[RAG Core] Searching databases for relevant course context metadata.', 'info');
      await sleep(500);
      updateNodeStatus('rag', 'success');

      // Step 5: Agent Decision
      updateNodeStatus('agent', 'active');
      addLog(`[AI Agent Loop] Intent matching complete. Executed DB Tool: ${data.executedTool || 'None'}`, 'info');
      await sleep(500);
      updateNodeStatus('agent', 'success');

      // Step 6: Tool Execution
      if (data.executedTool && data.executedTool !== 'None') {
        updateNodeStatus('tools', 'active');
        addLog(`[Tools] Successfully ran tool action: ${data.executedTool}. SQL write/read completed in Postgres.`, 'success');
        await sleep(500);
        updateNodeStatus('tools', 'success');
      }

      // Step 7: LLM Synthesis
      updateNodeStatus('llm', 'active');
      addLog(`[AI/LLM] Directing context mapping to Google Gemini API (Mode: ${data.source === 'api' ? 'Live API' : 'Simulation Mode'}).`, 'info');
      await sleep(600);
      updateNodeStatus('llm', 'success');

      // Step 8: Docker, CI/CD, Cloud completion logs
      updateNodeStatus('docker', 'success');
      updateNodeStatus('cicd', 'success');
      updateNodeStatus('cloud', 'success');
      
      // Inject logs generated on backend
      if (data.logs && Array.isArray(data.logs)) {
        data.logs.forEach((backendLog: string) => {
          let type: 'info' | 'success' | 'warn' | 'error' = 'info';
          if (backendLog.includes('✅') || backendLog.includes('🔒') || backendLog.includes('🔌') || backendLog.includes('⚡')) type = 'success';
          if (backendLog.includes('❌')) type = 'error';
          if (backendLog.includes('⚠️')) type = 'warn';
          addLog(backendLog, type);
        });
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      addLog('Pipeline processing transaction complete. Exiting route handler.', 'system');

    } catch (err: any) {
      addLog(`Error processing pipeline query: ${err.message}`, 'error');
      // Highlight errors in diagram
      updateNodeStatus('api', 'error');
      updateNodeStatus('postgres', 'error');
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ **Pipeline Error:** Failed to establish connection to PostgreSQL/Supabase OR AI API endpoints. Check details: \`${err.message}\`.` 
      }]);
    } finally {
      setIsProcessing(false);
      // Reset nodes to default states after brief delay
      setTimeout(() => {
        resetAllNodes();
      }, 3000);
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const updateNodeStatus = (id: string, status: 'dormant' | 'active' | 'success' | 'error') => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status } : n));
  };

  const resetAllNodes = () => {
    setNodes(prev => prev.map(n => ({ ...n, status: 'dormant' })));
  };

  // Node testing console simulation
  const testNode = (nodeId: string) => {
    addLog(`[Diag-Test] Querying Diagnostics loop for node: "${nodeId}"`, 'warn');
    const matchedNode = nodes.find(n => n.id === nodeId);
    if (!matchedNode) return;
    
    updateNodeStatus(nodeId, 'active');
    setTimeout(() => {
      updateNodeStatus(nodeId, 'success');
      addLog(`[Diag-Test] Diagnostics complete. Node "${matchedNode.name}" status: 200 OK.`, 'success');
      setTimeout(() => {
        updateNodeStatus(nodeId, 'dormant');
      }, 1500);
    }, 800);
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#090D16] text-white">
      {/* Upper info panel */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0C1321]/60">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#808000] animate-ping" />
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Architecture Lab Dashboard</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">DB Config:</span>
            <span className="text-[#808000]">Supabase Postgres</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Deployment Target:</span>
            <span className="text-yellow-500">Vercel Cloud</span>
          </div>
          <button 
            onClick={() => {
              addLog('Executing hardware environment check...', 'system');
              setSystemOnline(!systemOnline);
              addLog(`System status switched to: ${!systemOnline ? 'ONLINE' : 'MAINTENANCE_MODE'}`, !systemOnline ? 'success' : 'warn');
            }} 
            className="flex items-center gap-1 bg-white/5 border border-white/10 hover:bg-white/10 px-2 py-1 rounded transition-colors text-white"
          >
            <RefreshCw size={12} className={isProcessing ? 'animate-spin' : ''} />
            Diagnostic Check
          </button>
        </div>
      </div>

      {/* Main Grid: Architecture Visualizer (Left) vs Chat / Console (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Pipeline Diagram & Node Info (Cols 7) */}
        <div className="lg:col-span-7 flex flex-col border-r border-white/5 overflow-y-auto p-6 space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Layers size={18} className="text-[#808000]" /> Full-Stack Architecture Pipeline
            </h2>
            <p className="text-xs text-gray-400 max-w-xl font-medium">
              Click on any node block below to view its production configuration (Dockerfile, workflows, schemas) and verify its individual diagnostic metrics.
            </p>
          </div>

          {/* Flowchart Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {nodes.map((node, index) => {
              const NodeIcon = node.icon;
              const isActive = node.status === 'active';
              const isSuccess = node.status === 'success';
              const isError = node.status === 'error';
              
              let borderClass = 'border-white/5 bg-[#0D1321]/40';
              let iconColor = 'text-gray-500';
              let pulseClass = '';

              if (isActive) {
                borderClass = 'border-[#808000] bg-[#808000]/10 shadow-[0_0_15px_rgba(128,128,0,0.2)]';
                iconColor = 'text-[#808000]';
                pulseClass = 'animate-pulse';
              } else if (isSuccess) {
                borderClass = 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]';
                iconColor = 'text-green-400';
              } else if (isError) {
                borderClass = 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
                iconColor = 'text-red-400';
              } else if (selectedNode === node.id) {
                borderClass = 'border-white/20 bg-white/5';
                iconColor = 'text-white';
              }

              return (
                <div 
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`relative p-4 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] ${borderClass} ${pulseClass}`}
                >
                  <div className="absolute top-2 left-2 text-[9px] text-gray-600 font-bold font-mono">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  
                  <div className={`p-2.5 rounded-lg bg-white/5 mb-2 ${iconColor}`}>
                    <NodeIcon size={20} />
                  </div>
                  
                  <span className="text-xs font-bold tracking-wide text-white block mb-0.5">{node.name}</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase">
                    {isActive ? 'Processing' : isSuccess ? 'Success' : isError ? 'Error' : 'Dormant'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detailed Node Inspector Panel */}
          <div className="bg-[#0D1321]/60 border border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] bg-[#808000]/10 text-[#808000] border border-[#808000]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Node Settings Inspector
                </span>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2 pt-1">
                  {selectedNodeData.name} Node Integration
                </h3>
              </div>
              <button 
                onClick={() => testNode(selectedNodeData.id)}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Play size={12} className="text-[#808000]" /> Test Node Loop
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              {selectedNodeData.description}
            </p>
            
            <div className="p-3 bg-black/40 border border-white/5 rounded-lg flex items-start gap-2.5 text-xs text-gray-400">
              <Info size={14} className="text-[#808000] shrink-0 mt-0.5" />
              <span>{selectedNodeData.details}</span>
            </div>

            {selectedNodeData.codeSnippet && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-500 font-bold font-mono">Configuration snippet / Code base:</span>
                <div className="relative">
                  <pre className="text-[11px] font-mono bg-black/60 border border-white/5 rounded-lg p-4 text-gray-300 overflow-x-auto max-h-48 leading-relaxed">
                    <code>{selectedNodeData.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Chat Sandbox & Console Output (Cols 5) */}
        <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
          
          {/* Top Half: Dynamic Agent Chat box */}
          <div className="flex-1 flex flex-col border-b border-white/5 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 bg-[#0C1321]/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-[#808000]" />
                <span className="text-xs font-extrabold tracking-wide uppercase">AI Agent Interaction Terminal</span>
              </div>
              <span className="text-[9px] bg-[#808000]/10 text-[#808000] border border-[#808000]/20 px-2 py-0.5 rounded font-bold uppercase">
                Active Client
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, index) => (
                <div 
                  key={index}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed font-medium ${
                    m.role === 'user' 
                      ? 'bg-[#808000] text-white rounded-br-none shadow-[0_4px_12px_rgba(128,128,0,0.2)]'
                      : 'bg-[#0D1321] text-gray-200 border border-white/5 rounded-bl-none'
                  }`}>
                    {m.content.split('\n').map((line: string, i: number) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-[#0D1321]/20 flex gap-2 shrink-0">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about syllabus, grades, or raise a ticket..."
                disabled={isProcessing}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#808000] disabled:opacity-55"
              />
              <button 
                type="submit"
                disabled={isProcessing}
                className="bg-[#808000] hover:bg-[#666600] text-white px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </form>
          </div>

          {/* Bottom Half: Console log traces */}
          <div className="h-60 bg-black/95 flex flex-col overflow-hidden">
            <div className="px-5 py-2.5 border-b border-white/5 bg-[#070B12] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 font-mono tracking-widest uppercase">Pipeline Execution Logs</span>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[9px] text-gray-500 hover:text-white transition-colors uppercase font-bold"
              >
                Clear Console
              </button>
            </div>

            {/* Log Output lines */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1.5">
              {logs.length === 0 ? (
                <div className="text-gray-600 flex items-center justify-center h-full">
                  Console idle. Run queries above to inspect execution trace.
                </div>
              ) : (
                logs.map((log, index) => {
                  let color = 'text-gray-400';
                  if (log.type === 'success') color = 'text-green-400';
                  if (log.type === 'warn') color = 'text-yellow-500';
                  if (log.type === 'error') color = 'text-red-400';
                  if (log.type === 'system') color = 'text-[#808000] font-bold';

                  return (
                    <div key={index} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-gray-600 select-none shrink-0">[{log.timestamp}]</span>
                      <span className={color}>{log.text}</span>
                    </div>
                  );
                })
              )}
              <div ref={consoleEndRef} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
