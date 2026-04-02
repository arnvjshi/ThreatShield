import clsx from 'clsx';

import { ThreatLevel } from '../lib/types';

export function ThreatBadge({ level }: Readonly<{ level: ThreatLevel }>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
        level === 'High' && 'border-red-400/30 bg-red-400/10 text-red-200',
        level === 'Medium' && 'border-amber-400/30 bg-amber-400/10 text-amber-200',
        level === 'Low' && 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
      )}
    >
      {level}
    </span>
  );
}
