'use client';

import React, { useState, useRef } from 'react';
import { 
  Download, 
  Sparkles, 
  Edit3, 
  Check, 
  FileText, 
  Layout, 
  Award, 
  ShieldCheck, 
  Printer,
  ExternalLink,
  Code2
} from 'lucide-react';
import { ResumeData } from '@/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeViewerProps {
  resume: ResumeData;
  onUpdateResume?: (updated: ResumeData) => void;
  onRegenerateWithAI?: () => void;
  isRegenerating?: boolean;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({
  resume,
  onUpdateResume,
  onRegenerateWithAI,
  isRegenerating = false
}) => {
  const [template, setTemplate] = useState<ResumeData['template']>(resume.template || 'modern');
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editableResume, setEditableResume] = useState<ResumeData>(resume);

  const resumePrintRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPDF = async () => {
    if (!resumePrintRef.current) return;
    setIsDownloading(true);

    try {
      const element = resumePrintRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 standard width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${(resume.personalInfo.fullName || 'CareerOS_Resume').replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onUpdateResume) {
      onUpdateResume({ ...editableResume, template });
    }
  };

  const { personalInfo, professionalSummary, education, technicalSkills, projects, experience, certifications, achievements } = editableResume;

  return (
    <div className="space-y-6">
      
      {/* Top Action & Template Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl">
        
        {/* Template switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Template:</span>
          <div className="flex rounded-lg bg-slate-950 p-1 border border-white/10">
            {[
              { id: 'modern', label: 'Modern' },
              { id: 'minimal_ats', label: 'Minimal ATS' },
              { id: 'technical', label: 'Technical' },
              { id: 'fresher', label: 'Fresher' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id as any)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  template === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onRegenerateWithAI && (
            <button
              onClick={onRegenerateWithAI}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3.5 py-2 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate with Gemini'}
            </button>
          )}

          <button
            onClick={() => {
              if (isEditing) handleSaveEdit();
              else setIsEditing(true);
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all ${
              isEditing
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10'
            }`}
          >
            {isEditing ? <Check className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
            {isEditing ? 'Save Edits' : 'Edit Resume'}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Real Paper Resume Container (Clean High-Contrast White Background for Crisp Print & ATS) */}
      <div className="flex justify-center">
        <div 
          ref={resumePrintRef}
          className="w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 border border-slate-200 font-sans"
          style={{ minHeight: '1050px' }}
        >
          
          {/* HEADER SECTION */}
          <header className={`border-b pb-4 mb-6 ${template === 'modern' ? 'border-indigo-600' : 'border-slate-800'}`}>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
              {personalInfo.fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
              {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
              {personalInfo.github && <span>• {personalInfo.github}</span>}
              {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
            </div>
          </header>

          {/* PROFESSIONAL SUMMARY */}
          {professionalSummary && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b ${template === 'modern' ? 'text-indigo-700 border-indigo-200' : 'text-slate-800 border-slate-300'}`}>
                Professional Summary
              </h2>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={professionalSummary}
                  onChange={(e) => setEditableResume({ ...editableResume, professionalSummary: e.target.value })}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed">
                  {professionalSummary}
                </p>
              )}
            </section>
          )}

          {/* EDUCATION SECTION */}
          {education && education.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b ${template === 'modern' ? 'text-indigo-700 border-indigo-200' : 'text-slate-800 border-slate-300'}`}>
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{edu.institution}</div>
                      <div className="text-slate-700">{edu.degree} — {edu.branch}</div>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="text-[11px] text-slate-600 italic mt-0.5">
                          {edu.achievements.join(' • ')}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-slate-600 shrink-0">
                      <div>{edu.startYear} - {edu.endYear}</div>
                      {edu.cgpa && <div className="font-semibold text-slate-800">CGPA: {edu.cgpa}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TECHNICAL SKILLS */}
          {technicalSkills && technicalSkills.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b ${template === 'modern' ? 'text-indigo-700 border-indigo-200' : 'text-slate-800 border-slate-300'}`}>
                Technical Skills
              </h2>
              <div className="space-y-1 text-xs">
                {technicalSkills.map((cat, idx) => (
                  <div key={idx} className="flex items-baseline">
                    <span className="font-bold text-slate-900 w-44 shrink-0">{cat.category}:</span>
                    <span className="text-slate-700">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS SECTION */}
          {projects && projects.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b ${template === 'modern' ? 'text-indigo-700 border-indigo-200' : 'text-slate-800 border-slate-300'}`}>
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">
                        {proj.title}
                        {proj.role && <span className="font-normal text-slate-600"> | {proj.role}</span>}
                      </span>
                      {proj.link && (
                        <span className="text-[11px] text-indigo-700 font-medium">
                          {proj.link}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-semibold text-slate-600">
                      Technologies: {proj.techStack.join(', ')}
                    </div>

                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-xs ml-1">
                      {proj.bulletPoints.map((bp, bidx) => (
                        <li key={bidx} className="leading-relaxed">
                          {bp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCE SECTION (Only if exists) */}
          {experience && experience.length > 0 && (
            <section className="mb-6">
              <h2 className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b ${template === 'modern' ? 'text-indigo-700 border-indigo-200' : 'text-slate-800 border-slate-300'}`}>
                Experience & Internships
              </h2>
              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{exp.title} — {exp.company}</span>
                      <span className="text-slate-600">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-xs ml-1">
                      {exp.bulletPoints.map((bp, bidx) => (
                        <li key={bidx}>{bp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS & ACHIEVEMENTS */}
          {(certifications?.length > 0 || achievements?.length > 0) && (
            <section className="mb-4">
              <h2 className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b ${template === 'modern' ? 'text-indigo-700 border-indigo-200' : 'text-slate-800 border-slate-300'}`}>
                Certifications & Achievements
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                {certifications?.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-slate-900">{c.title}</span> — {c.issuer} ({c.year})
                  </li>
                ))}
                {achievements?.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
