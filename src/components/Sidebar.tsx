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
    <aside className="w-60 flex-shrink-0 min-h-screen flex flex-col" style={{ backgroundColor: '#012340' }}>
      {/* Brand */}
      <div className="px-6 py-6" style={{ borderBottom: '1px solid rgba(110,237,199,0.15)' }}>
        <div className="flex items-baseline gap-0">
          <span className="text-2xl font-black tracking-tight" style={{ color: '#6EEDC7' }}>CAUSE</span>
          <span className="text-2xl font-light tracking-wider text-white/50">FLOW</span>
        </div>
        <p className="text-xs mt-0.5 tracking-widest uppercase" style={{ color: 'rgba(208,239,242,0.5)' }}>
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
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'text-[#012340] font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`
            }
            style={({ isActive }) =>
              isActive ? { backgroundColor: '#6EEDC7', color: '#012340' } : {}
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
          className="flex items-center justify-center gap-2 w-full py-2 rounded-md text-sm font-semibold border transition-all"
          style={{ borderColor: '#6EEDC7', color: '#6EEDC7' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#6EEDC7';
            (e.currentTarget as HTMLElement).style.color = '#012340';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#6EEDC7';
          }}
        >
          <Plus size={14} />
          New Project
        </NavLink>
      </div>

      {/* Pipeline Status Summary */}
      <div className="px-3 py-4 flex-1" style={{ borderTop: '1px solid rgba(110,237,199,0.15)' }}>
        <p className="text-xs font-semibold tracking-widest uppercase px-3 mb-3" style={{ color: 'rgba(208,239,242,0.4)' }}>
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
                className="flex items-center justify-between px-3 py-1.5 rounded-md transition-all group"
                style={{ color: 'rgba(208,239,242,0.6)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.07)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
              >
                <span className="text-xs">{STATUS_SHORT[status]}</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(110,237,199,0.15)', color: '#6EEDC7' }}>
                  {count}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(110,237,199,0.15)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/80">{activeCount} active</p>
            <p className="text-xs" style={{ color: 'rgba(208,239,242,0.4)' }}>{projects.length} total projects</p>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6EEDC7' }}>
            <span className="text-xs font-black" style={{ color: '#012340' }}>C</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
