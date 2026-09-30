'use client';

import React, { useState } from 'react';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  User, 
  Mail, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Award, 
  Save, 
  Check, 
  Sparkles 
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, setProfile } = useCareerStore();

  const [formData, setFormData] = useState({
    name: profile?.name || 'Rahul Verma',
    email: profile?.email || 'rahul.verma@example.edu',
    location: profile?.location || 'Bangalore, India',
    college: profile?.college || 'National Institute of Technology',
    degree: profile?.degree || 'B.Tech',
    branch: profile?.branch || 'Computer Science and Engineering',
    year: profile?.year || 'Final Year (4th Year)',
    cgpa: profile?.cgpa || 8.4,
    bio: profile?.bio || ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setProfile({
      ...profile,
      ...formData,
      updatedAt: new Date().toISOString()
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-indigo-400" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Student Profile
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Your verified educational and personal information.
        </p>
      </div>

      <form onSubmit={handleSave} className="glass-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-indigo-600/20">
            {formData.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{formData.name}</h3>
            <p className="text-xs text-slate-400">{formData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">College / University</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Degree & Branch</label>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Year of Study</label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">CGPA</label>
            <input
              type="number"
              step="0.1"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-slate-300 font-semibold">Bio & Career Statement</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {savedSuccess ? (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              Profile updated successfully!
            </span>
          ) : <div />}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-transform active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
