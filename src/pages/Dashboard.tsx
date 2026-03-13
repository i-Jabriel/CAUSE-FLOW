import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, ArrowRight, Clock } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { Avatar, AvatarGroup } from '../components/Avatar';
import type { ProjectStatus } from '../types';
import { STAGE_LABELS, STAGE_ORDER } from '../types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

export const Dashboard: React.FC = () => {
  const { projects, teamMembers, getTeamMember } = useProjectStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const statusFilter = searchParams.get('status') as ProjectStatus | null;

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status !== 'delivered').length,
    pendingApproval: projects.filter((p) => p.status === 'pending_approval').length,
    delivered: projects.filter((p) => p.status === 'delivered').length,
    inProduction: projects.filter((p) => p.status === 'production').length,
  };

  const filtered = projects.filter((p) => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sortedProjects = [...filtered].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1">
            {statusFilter ? `Filtered: ${STAGE_LABELS[statusFilter]}` : 'All projects overview'}
          </p>
        </div>
        <Link
          to="/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          style={{ backgroundColor: '#6EEDC7', color: '#012340' }}
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: stats.total, accent: false },
          { label: 'Active', value: stats.active, accent: true },
          { label: 'In Production', value: stats.inProduction, accent: false },
          { label: 'Awaiting Approval', value: stats.pendingApproval, accent: false },
          { label: 'Delivered', value: stats.delivered, accent: false },
        ].map(({ label, value, accent }) => (
          <div key={label} className="rounded-xl p-4 border" style={accent ? { backgroundColor: '#012340', borderColor: '#012340' } : { backgroundColor: 'white', borderColor: '#e4e4e7' }}>
            <p className="text-3xl font-black" style={{ color: accent ? '#6EEDC7' : '#012340' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: accent ? 'rgba(208,239,242,0.7)' : '#71717a' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search projects or clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-xs px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-black transition-colors placeholder-zinc-400"
        />
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-black transition-colors text-zinc-600"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Project Grid */}
      {sortedProjects.length === 0 ? (
        <div className="text-center py-24 text-zinc-400">
          <FolderIcon />
          <p className="mt-4 text-lg font-medium">No projects found</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new project</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedProjects.map((project) => {
            const bd = project.businessDeveloperId
              ? getTeamMember(project.businessDeveloperId)
              : undefined;
            const pm = project.projectManagerId
              ? getTeamMember(project.projectManagerId)
              : undefined;
            const creatives = (project.creativeTeamIds || [])
              .map((id) => getTeamMember(id))
              .filter(Boolean) as typeof teamMembers;
            const opsLead = project.operationsLeadId
              ? getTeamMember(project.operationsLeadId)
              : undefined;

            const allMembers = [bd, pm, ...creatives, opsLead].filter(Boolean) as typeof teamMembers;

            const stageIdx = STAGE_ORDER.indexOf(project.status);
            const stageProgress = Math.round((stageIdx / (STAGE_ORDER.length - 1)) * 100);

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white border rounded-xl p-5 transition-all group block"
                style={{ borderColor: '#e4e4e7' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#6EEDC7'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(110,237,199,0.15)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#e4e4e7'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <StatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                </div>

                {/* Title */}
                <h3 className="font-bold text-black text-base leading-snug mb-1 group-hover:text-zinc-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-500 mb-3">{project.client}</p>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-zinc-500">{STAGE_LABELS[project.status]}</span>
                    <span className="text-xs font-semibold text-zinc-600">{stageProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ backgroundColor: '#6EEDC7', width: `${stageProgress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                  <AvatarGroup members={allMembers} size="xs" max={4} />
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <Clock size={11} />
                    {timeAgo(project.updatedAt)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const FolderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-zinc-300">
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
  </svg>
);
