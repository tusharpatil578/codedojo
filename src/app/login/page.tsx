'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Phone, 
  KeyRound, 
  ArrowRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [activeTab, setActiveTab] = useState<'credentials' | 'mobile'>('credentials');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Credentials State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mobile State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Clear errors on tab toggle
  useEffect(() => {
    setError(null);
  }, [activeTab]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = activeTab === 'credentials' 
      ? { type: 'credentials', email, password }
      : { type: 'mobile', phone, otp };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const triggerSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'social', provider }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Social login failed');
      }

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Social login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setOtpSent(true);
    // Visual helper notification for user
    alert('Simulated OTP sent successfully! Use code "123456" to proceed.');
  };

  const fillQuickDemo = (role: 'student' | 'admin' | 'mentor' | 'instructor') => {
    setActiveTab('credentials');
    setError(null);
    if (role === 'student') {
      setEmail('aarav@codedojo.com');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@codedojo.com');
      setPassword('password123');
    } else if (role === 'mentor') {
      setEmail('siddharth@codedojo.com');
      setPassword('password123');
    } else if (role === 'instructor') {
      setEmail('rahul@codedojo.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] flex items-center justify-center p-4">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              DC
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              doomsday<span className="text-emerald-400 font-light">.courses</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white">Sign in to your account</h2>
          <p className="text-xs text-gray-400 font-medium">Continue your learning progress tracker dashboard.</p>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-white/5 pb-0.5">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'credentials'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            Email / Credentials
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'mobile'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            Mobile Number OTP
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleLoginSubmit} className="glass-card p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'credentials' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@codedojo.com"
                    className="w-full bg-[#0A0F1A] border border-white/5 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0A0F1A] border border-white/5 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9900000000"
                      className="w-full bg-[#0A0F1A] border border-white/5 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1.5 animate-slide-in">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Verification OTP
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-[#0A0F1A] border border-white/5 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 block">Enter code "123456" to login.</span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={14} />
          </button>
        </form>

        {/* Social Logins */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className="h-[1px] bg-white/5 flex-1" />
            <span>Or Connect Socially</span>
            <span className="h-[1px] bg-white/5 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => triggerSocialLogin('google')}
              type="button"
              className="bg-white/5 border border-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.281 1.769 15.542 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.6 0 11-4.606 11-11.24 0-.756-.08-1.333-.18-1.955H12.24z"/>
              </svg> Google
            </button>
            <button
              onClick={() => triggerSocialLogin('facebook')}
              type="button"
              className="bg-white/5 border border-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <svg className="h-3.5 w-3.5 text-[#3B5998]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg> Facebook
            </button>
          </div>
        </div>

        {/* Helper quick demo links */}
        <div className="glass-card p-4 border border-emerald-500/15 bg-emerald-500/5 space-y-3">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle size={12} /> Live Testing Accounts
          </p>
          <div className="flex flex-wrap gap-2">
            {['student', 'admin', 'mentor', 'instructor'].map((role) => (
              <button
                key={role}
                onClick={() => fillQuickDemo(role as any)}
                type="button"
                className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 px-2 py-1 rounded transition-all capitalize border border-white/5"
              >
                {role}
              </button>
            ))}
          </div>
          <span className="text-[9px] text-gray-500 block leading-none">
            Password: <strong className="text-gray-400">password123</strong>. Click buttons to auto-fill.
          </span>
        </div>

        {/* Register CTA */}
        <div className="text-center text-xs text-gray-500">
          New to doomsday.courses?{' '}
          <Link href="/register" className="text-emerald-400 hover:underline font-bold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060913] flex items-center justify-center text-white">
        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Loading auth portal...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
