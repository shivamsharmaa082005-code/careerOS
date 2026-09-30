'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { CopilotDrawer } from '../copilot/CopilotDrawer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onOpenCopilot={() => setCopilotOpen(true)} />
      <main className="flex-1 flex flex-col">{children}</main>
      <CopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
};
