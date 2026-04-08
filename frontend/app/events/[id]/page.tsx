import { notFound } from 'next/navigation';

import { DashboardShell } from '@/components/DashboardShell';
import { VideoPlayer } from '@/components/VideoPlayer';
import { fetchEvent } from '@/lib/api';
import { ThreatBadge } from '@/components/ThreatBadge';
import { formatToIst } from '@/lib/time';

export default async function EventDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const event = await fetchEvent(id);
  if (!event) {
    notFound();
  }
  const eventData = event;

  return (
    <DashboardShell>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-6">
          <div className="glass-card subtle-ring p-6">
            <div className="flex flex-wrap items-center gap-3">
              <ThreatBadge level={eventData.threat_level} />
              <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{formatToIst(eventData.timestamp)} IST</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white">Event details</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{eventData.summary}</p>
          </div>
          <img src={`${process.env.NEXT_PUBLIC_BACKEND_HTTP_URL ?? 'http://localhost:8000'}/events/${eventData._id}/thumbnail`} alt="Event thumbnail" className="aspect-video w-full rounded-2xl border border-white/10 object-cover shadow-glass" />
          <VideoPlayer src={eventData.video_url} />
        </section>
        <aside className="space-y-6">
          <div className="glass-card subtle-ring p-6">
            <p className="metric-label">Threat score</p>
            <div className="mt-3 text-5xl font-semibold tracking-tight text-white">{eventData.anomaly_score.toFixed(2)}</div>
          </div>
          <div className="glass-card subtle-ring p-6">
            <p className="metric-label">Detected objects</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {eventData.detected_objects.map((object) => (
                <span key={`${object.label}-${object.x1}-${object.y1}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                  {object.label}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-card subtle-ring p-6">
            <p className="metric-label">Suggested actions</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{eventData.escalation_steps}</p>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
