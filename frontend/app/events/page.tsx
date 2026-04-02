import { DashboardShell } from '@/components/DashboardShell';
import { EventCard } from '@/components/EventCard';
import { fetchEvents } from '@/lib/api';

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <DashboardShell>
      <div className="glass-card subtle-ring p-6">
        <p className="metric-label">Events</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Detected clips</h1>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {events.length > 0 ? events.map((event) => <EventCard key={event._id} event={event} />) : <div className="glass-card subtle-ring p-6 text-sm text-slate-300">No events have been recorded yet.</div>}
      </div>
    </DashboardShell>
  );
}
