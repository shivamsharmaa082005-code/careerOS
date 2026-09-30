'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Mail, Check } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md glass-card rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto border border-indigo-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h1>
          <p className="text-xs text-slate-400">
            Enter your account email and we’ll send you password reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-6 text-center space-y-3">
            <Check className="h-8 w-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Reset Link Sent</h3>
            <p className="text-xs text-slate-300">
              Check your inbox for instructions to reset your CareerOS account password.
            </p>
            <Link
              href="/auth/login"
              className="inline-block mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Send Reset Link</span>
            </button>

            <div className="text-center pt-2">
              <Link href="/auth/login" className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
