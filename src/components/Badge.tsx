import React from 'react';
import type { ProjectStatus } from '../types';
import { STAGE_LABELS } from '../types';


interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

// Using inline styles for CAUSE brand colors since they're outside Tailwind's default palette
const STATUS_INLINE: Record<ProjectStatus, React.CSSProperties> = {
  intake:          { background: 'rgba(1,35,64,0.07)',    color: '#012340',  border: '1px solid rgba(1,35,64,0.2)' },
  quotation:       { background: 'rgba(1,35,64,0.1)',     color: '#012340',  border: '1px solid rgba(1,35,64,0.25)' },
  creative:        { background: '#012340',                color: '#6EEDC7',  border: '1px solid #012340' },
  pending_approval:{ background: 'rgba(110,237,199,0.15)',color: '#0A6B53',  border: '1px solid rgba(110,237,199,0.5)' },
  approved:        { background: '#6EEDC7',                color: '#012340',  border: '1px solid #3DD9AC' },
  production:      { background: '#012340',                color: '#6EEDC7',  border: '1px solid #012340' },
  delivered:       { background: 'rgba(61,217,172,0.12)', color: '#3DD9AC',  border: '1px solid rgba(61,217,172,0.4)' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-wide ${sizeClass}`}
      style={STATUS_INLINE[status]}
    >
      {STAGE_LABELS[status]}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

const PRIORITY_STYLES: Record<string, string> = {
  low: 'text-zinc-400',
  medium: 'text-zinc-500',
  high: 'font-semibold',
};

const PRIORITY_DOT_COLOR: Record<string, string> = {
  low: '#d4d4d8',
  medium: '#6EEDC7',
  high: '#012340',
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs ${PRIORITY_STYLES[priority]}`} style={priority === 'high' ? { color: '#012340' } : {}}>
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIORITY_DOT_COLOR[priority] }} />
    {priority.charAt(0).toUpperCase() + priority.slice(1)}
  </span>
);
