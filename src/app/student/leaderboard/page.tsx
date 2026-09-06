'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Sparkles, Medal, Award } from 'lucide-react';

interface LeaderboardRow {
  rank: number;
  id: string;
  name: string;
  email: string;
  assignmentScore: number;
  contestScore: number;
  overallScore: number;
}

export default function StudentLeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [sortBy, setSortBy] = useState<'overallScore' | 'assignmentScore' | 'contestScore'>('overallScore');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch('/api/student/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setRows(data.leaderboard || []);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  // Sort rows dynamically based on chosen metric
  const sortedRows = [...rows].sort((a, b) => b[sortBy] - a[sortBy]).map((r, idx) => ({
    ...r,
    displayRank: idx + 1
  }));

  const myRow = rows.find(r => r.email === 'aarav@codedojo.com');
  const myRank = myRow ? sortedRows.findIndex(r => r.email === 'aarav@codedojo.com') + 1 : 1;
  const percentile = rows.length > 1 ? Math.round(((rows.length - myRank) / (rows.length - 1)) * 100) : 100;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-24 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div>
        <span className="text-[10px] bg-[#808000]/10 text-[#808000] border border-[#808000]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Cohorts Leaderboard
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold mt-2">Batch rankings</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Compare your learning progress, assignments completion, and contests with your cohort peers.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-4 flex items-center justify-between border-l-4 border-l-[#808000]">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Your Rank</span>
            <p className="text-2xl font-extrabold text-white mt-1">#{myRank}</p>
            <span className="text-[10px] text-green-400 font-semibold block mt-1">Top {100 - percentile}% of Batch</span>
          </div>
          <Medal size={32} className="text-[#808000] opacity-80" />
        </div>

        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Overall Grade</span>
            <p className="text-2xl font-extrabold text-white mt-1">{myRow?.overallScore || 88}%</p>
            <span className="text-[10px] text-gray-400 block mt-1">Weighted formula active</span>
          </div>
          <Trophy size={32} className="text-[#808000] opacity-80" />
        </div>

        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Percentile</span>
            <p className="text-2xl font-extrabold text-white mt-1">{percentile}th</p>
            <span className="text-[10px] text-gray-400 block mt-1">Outperforming {percentile}% students</span>
          </div>
          <TrendingUp size={32} className="text-[#808000] opacity-80" />
        </div>

        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rank Change</span>
            <p className="text-2xl font-extrabold text-green-400 mt-1">+2</p>
            <span className="text-[10px] text-gray-500 block mt-1">Since last module</span>
          </div>
          <Sparkles size={32} className="text-[#808000] opacity-80" />
        </div>

      </div>

      {/* Main rankings Table */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cohort standing</h3>
          
          {/* Sorting Toggles */}
          <div className="flex bg-[#0D1321] p-1 rounded-lg border border-white/5 gap-1">
            {[
              { id: 'overallScore', label: 'Overall' },
              { id: 'assignmentScore', label: 'Assignments' },
              { id: 'contestScore', label: 'Contests' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id as any)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${
                  sortBy === tab.id
                    ? 'bg-[#808000] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* rankings Table */}
        <div className="overflow-x-auto border border-white/5 rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3.5 text-[10px]">Rank</th>
                <th className="p-3.5 text-[10px]">Student Name</th>
                <th className="p-3.5 text-[10px] text-center">Assignment Grade</th>
                <th className="p-3.5 text-[10px] text-center">Contests Grade</th>
                <th className="p-3.5 text-[10px] text-right">Overall Average</th>
              </tr>
            </thead>
            <tbody className="font-semibold text-gray-300">
              {sortedRows.map((row) => (
                <tr 
                  key={row.id} 
                  className={`border-b border-white/5 hover:bg-white/5 transition-all ${
                    row.email === 'aarav@codedojo.com' 
                      ? 'bg-[#808000]/10 border-y border-[#808000]/30 text-white' 
                      : ''
                  }`}
                >
                  <td className="p-3.5">
                    {row.displayRank === 1 ? '🥇 1' : row.displayRank === 2 ? '🥈 2' : row.displayRank === 3 ? '🥉 3' : row.displayRank}
                  </td>
                  <td className="p-3.5 flex items-center gap-2">
                    <span>{row.name}</span>
                    {row.email === 'aarav@codedojo.com' && (
                      <span className="text-[8px] bg-[#808000]/20 text-[#808000] border border-[#808000]/30 px-1.5 py-0.5 rounded font-extrabold uppercase">You</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center text-gray-400">{row.assignmentScore}%</td>
                  <td className="p-3.5 text-center text-gray-400">{row.contestScore}%</td>
                  <td className="p-3.5 text-right text-[#808000] font-bold">{row.overallScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
