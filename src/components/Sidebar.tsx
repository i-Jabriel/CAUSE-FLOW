import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Plus } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import type { ProjectStatus } from '../types';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban, exact: false },
  { to: '/team', label: 'Team', icon: Users, exact: false },
];

const STATUS_ORDER: ProjectStatus[] = [
  'intake',
  'quotation',
  'creative',
  'pending_approval',
  'approved',
  'production',
  'delivered',
];

const STATUS_SHORT: Record<ProjectStatus, string> = {
  intake: 'Intake',
  quotation: 'Quotation',
  creative: 'Creative',
  pending_approval: 'Approval',
  approved: 'Approved',
  production: 'Production',
  delivered: 'Delivered',
};

export const Sidebar: React.FC = () => {
  const { projects } = useProjectStore();
  const location = useLocation();

  const countByStatus = STATUS_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = projects.filter((p) => p.status === s).length;
    return acc;
  }, {});

  const activeCount = projects.filter(
    (p) => p.status !== 'delivered'
  ).length;

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-zinc-200 min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-zinc-100">
        <div className="flex items-baseline gap-0">
          <span className="text-2xl font-black tracking-tight text-black">CAUSE</span>
          <span className="text-2xl font-light tracking-wider text-zinc-400">FLOW</span>
        </div>
        <p className="text-xs text-zinc-400 mt-0.5 tracking-widest uppercase">
          Workflow Pipeline
        </p>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* New Project */}
      <div className="px-3 pb-4">
        <NavLink
          to="/projects/new"
          className={({ isActive }) =>
            `flex items-center justify-center gap-2 w-full py-2 rounded-md text-sm font-semibold border transition-all ${
              isActive
                ? 'bg-black text-white border-black'
                : 'border-black text-black hover:bg-black hover:text-white'
            }`
          }
        >
          <Plus size={14} />
          New Project
        </NavLink>
      </div>

      {/* Pipeline Status Summary */}
      <div className="px-3 py-4 border-t border-zinc-100 flex-1">
        <p className="text-xs font-semibold text-zinc-400 tracking-widest uppercase px-3 mb-3">
          Pipeline
        </p>
        <div className="space-y-1">
          {STATUS_ORDER.map((status) => {
            const count = countByStatus[status] || 0;
            if (count === 0) return null;
            return (
              <NavLink
                key={status}
                to={`/projects?status=${status}`}
                className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-zinc-50 group"
              >
                <span className="text-xs text-zinc-500 group-hover:text-zinc-800 transition-colors">
                  {STATUS_SHORT[status]}
                </span>
                <span className="text-xs font-semibold text-zinc-800 bg-zinc-100 px-1.5 py-0.5 rounded">
                  {count}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-zinc-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-800">{activeCount} active</p>
            <p className="text-xs text-zinc-400">{projects.length} total projects</p>
          </div>
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
