import React from 'react';
import type { ProjectStatus } from '../types';
import { STAGE_LABELS } from '../types';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  intake: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  quotation: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  creative: 'bg-black text-white border-black',
  pending_approval: 'bg-zinc-800 text-white border-zinc-800',
  approved: 'bg-zinc-100 text-zinc-800 border-zinc-400',
  production: 'bg-black text-white border-black',
  delivered: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const style = STATUS_STYLES[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium tracking-wide ${style} ${sizeClass}`}
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
  medium: 'text-zinc-600',
  high: 'text-black font-semibold',
};

const PRIORITY_DOT: Record<string, string> = {
  low: 'bg-zinc-300',
  medium: 'bg-zinc-500',
  high: 'bg-black',
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs ${PRIORITY_STYLES[priority]}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[priority]}`} />
    {priority.charAt(0).toUpperCase() + priority.slice(1)}
  </span>
);
