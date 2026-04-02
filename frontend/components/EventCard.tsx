import Link from 'next/link';

import { ThreatEvent } from '../lib/types';
import { ThreatBadge } from './ThreatBadge';

const BACKEND_HTTP_URL = process.env.NEXT_PUBLIC_BACKEND_HTTP_URL || 'http://localhost:8000';

export function EventCard({ event }: { event: ThreatEvent }) {
  const thumbnailSrc = event.thumbnail_url ? `${BACKEND_HTTP_URL}${event.thumbnail_url}` : '';

  return (
    <Link href={`/events/${event._id}`} className="glass-card subtle-ring block p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent/30">
      {thumbnailSrc ? (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/50">
          <img src={thumbnailSrc} alt="Event thumbnail" className="aspect-video w-full object-cover" />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <ThreatBadge level={event.threat_level} />
            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
              {new Date(event.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-200">{event.summary}</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <div>Anomaly</div>
          <div className="mt-1 text-lg font-semibold text-white">{event.anomaly_score.toFixed(2)}</div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {event.detected_objects.slice(0, 4).map((object) => (
          <span key={`${object.label}-${object.x1}-${object.y1}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {object.label}
          </span>
        ))}
      </div>
    </Link>
  );
}
