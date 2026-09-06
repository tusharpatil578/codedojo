'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, ShieldAlert, User, HelpCircle, CheckCircle2 } from 'lucide-react';

interface Sender {
  id: string;
  name: string;
  role: string;
}

interface Message {
  id: string;
  senderId: string;
  message: string;
  createdAt: string;
  sender: Sender;
}

interface TicketDetails {
  id: string;
  title: string;
  category: string;
  status: string;
  messages: Message[];
}

export default function TicketChatPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadTicket() {
      try {
        const res = await fetch(`/api/student/tickets/${ticketId}`);
        if (!res.ok) throw new Error('Ticket not found');
        const data = await res.json();
        setTicket(data.ticket);
      } catch (err) {
        console.error(err);
        router.push('/student/support');
      } finally {
        setLoading(false);
      }
    }
    loadTicket();
  }, [ticketId, router]);

  // Scroll to bottom on messages load
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/student/tickets/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      if (ticket) {
        setTicket({
          ...ticket,
          messages: [...ticket.messages, data.message]
        });
      }
      setText('');
    } catch (err) {
      alert('Error sending message. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-[#090D16]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-[#808000]" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading conversation thread...</p>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="space-y-6 animate-slide-in text-white max-w-4xl mx-auto">
      {/* Header links */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <Link href="/student/support" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={16} /> Back to Support Desk
        </Link>
        <span className="text-[10px] text-gray-500 font-extrabold tracking-wider uppercase">
          Ticket Thread: {ticket.category}
        </span>
      </div>

      {/* Subject summary */}
      <div className="glass-card p-5 bg-[#0D1321]/45 flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <span className="text-[9px] bg-[#808000]/10 border border-[#808000]/25 px-2 py-0.5 rounded text-[#808000] font-extrabold uppercase tracking-wider">
            {ticket.category}
          </span>
          <h3 className="font-extrabold text-base pt-1">{ticket.title}</h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs font-bold">
          <CheckCircle2 size={14} className="text-[#808000]" />
          <span>Status: {ticket.status}</span>
        </div>
      </div>

      {/* Chat messages box */}
      <div className="glass-card p-5 bg-[#0D1321]/20 flex flex-col justify-between h-[380px] border border-white/5">
        
        {/* Messages viewport */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth">
          {ticket.messages.map((msg) => {
            const isAdmin = msg.sender.role === 'ADMIN';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[80%] ${isAdmin ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
              >
                {/* User avatar indicator */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border mt-0.5 ${
                  isAdmin 
                    ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                    : 'bg-[#808000]/10 border-[#808000]/20 text-[#808000]'
                }`}>
                  {isAdmin ? <ShieldAlert size={14} /> : <User size={14} />}
                </div>

                <div className="space-y-1">
                  <div className={`text-[10px] text-gray-500 font-bold ${isAdmin ? 'text-left' : 'text-right'}`}>
                    {msg.sender.name} ({msg.sender.role})
                  </div>
                  <div className={`p-3 rounded-xl text-xs font-medium leading-relaxed ${
                    isAdmin 
                      ? 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5' 
                      : 'bg-[#808000]/10 text-white rounded-tr-none border border-[#808000]/20'
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-[8px] text-gray-600 block mt-0.5">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input box form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-white/5 mt-4">
          <input
            type="text"
            required
            disabled={submitting}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message reply here..."
            className="flex-1 bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-4 py-2 text-xs text-white focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="bg-[#808000] hover:bg-[#666600] disabled:bg-gray-500/20 disabled:text-gray-500 text-white font-extrabold text-xs px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-[0_2px_8px_rgba(128,128,0,0.15)] shrink-0"
          >
            Reply <Send size={12} />
          </button>
        </form>

      </div>
    </div>
  );
}
