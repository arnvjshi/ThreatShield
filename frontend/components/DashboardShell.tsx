"use client";

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { BarChart3, Menu, Shield, UserRound, LayoutDashboard, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/events', label: 'Events', icon: BarChart3 },
  { href: '/user', label: 'User', icon: UserRound },
];

export function DashboardShell({ children }: Readonly<{ children: ReactNode }>) {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (globalThis.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    globalThis.addEventListener('resize', onResize);
    return () => globalThis.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen bg-radial-glow">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,7,11,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
          <button
            type="button"
            onClick={() => {
              if (globalThis.innerWidth >= 1024) {
                setHidden((value) => !value);
                return;
              }
              setMobileOpen((value) => !value);
            }}
            className="control-button px-3 py-2 text-xs"
            aria-expanded={hidden === false || mobileOpen}
            aria-label="Toggle navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
              <Shield className="h-4.5 w-4.5 text-cyan-100" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">ThreatDetect</p>
              <p className="truncate text-sm text-slate-200">Live security monitor</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Live
            </span>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">Ready</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-7xl gap-6 px-4 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => setHidden((value) => !value)}
          className="fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 rounded-r-xl border border-white/10 bg-[rgba(10,14,20,0.92)] p-2 text-slate-200 shadow-glass backdrop-blur lg:inline-flex"
          aria-label={hidden ? 'Show navigation panel' : 'Hide navigation panel'}
        >
          <ChevronRight className={`h-4 w-4 ${hidden ? '' : 'hidden'}`} />
          <ChevronLeft className={`h-4 w-4 ${hidden ? 'hidden' : ''}`} />
        </button>

        <aside
          className={`glass-card fixed bottom-4 left-4 top-[73px] z-20 w-[280px] flex-col p-4 transition-transform duration-200 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-[120%]'
          } ${hidden ? 'lg:hidden' : 'lg:static lg:flex lg:translate-x-0 lg:w-72'}`}
        >
          <nav className="space-y-2 text-sm text-slate-300">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-accent/30 hover:bg-white/10"
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/90">
                  <item.icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Alerting, events, and user profile in one place.
          </div>
        </aside>

        {mobileOpen ? <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-10 bg-black/35 lg:hidden" /> : null}

        <main className="flex-1 py-2">{children}</main>
      </div>
    </div>
  );
}
