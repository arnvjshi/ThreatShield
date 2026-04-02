"use client";

import { useState } from 'react';

import { DashboardShell } from '@/components/DashboardShell';
import { LiveStreamCanvas } from '@/components/LiveStreamCanvas';
import { ThreeBackground } from '@/components/ThreeBackground';
import { CameraControls } from '@/components/CameraControls';
import { ThreatBadge } from '@/components/ThreatBadge';

function StatusWidget({ onClose }: Readonly<{ onClose: () => void }>) {
  const statusRows = [
    { label: 'Camera', value: 'Ready' },
    { label: 'YOLO', value: 'Configured' },
    { label: 'Anomaly model', value: 'Active' },
    { label: 'Summarizer', value: 'Ollama + Gemini' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-end bg-black/40 px-4 py-4 backdrop-blur-sm sm:items-start sm:px-6 sm:py-6">
      <button aria-label="Close status panel" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className="relative z-10 w-full max-w-md rounded-[1.75rem] border border-white/10 bg-[rgba(12,17,24,0.92)] p-5 shadow-glass ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="metric-label">System status</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Pipeline overview</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-white/10">
            Close
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {statusRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-slate-300">{row.label}</span>
              <span className="text-white">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [statusOpen, setStatusOpen] = useState(false);

  return (
    <DashboardShell>
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(10,14,20,0.65)] p-5 shadow-glass sm:p-6">
        <ThreeBackground />

        <div className="relative z-10 space-y-6">
          <header className="glass-card subtle-ring flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              <ThreatBadge level="Low" />
              <h2 className="text-xl font-semibold text-white sm:text-2xl">Live monitoring</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setStatusOpen(true)} className="control-button bg-cyan-500/15 text-cyan-100 hover:border-cyan-400/30 hover:bg-cyan-400/15">
                Status
              </button>
              <a href="/user" className="control-button">
                User info
              </a>
            </div>
          </header>

          <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
            <section className="space-y-6">
              <LiveStreamCanvas />
            </section>

            <aside className="space-y-6">
              <div className="glass-card subtle-ring p-6">
                <p className="metric-label">Controls</p>
                <div className="mt-4">
                  <CameraControls />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {statusOpen ? <StatusWidget onClose={() => setStatusOpen(false)} /> : null}
      </div>
    </DashboardShell>
  );
}
