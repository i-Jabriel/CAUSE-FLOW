import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { Avatar } from '../components/Avatar';
import type { TeamRole } from '../types';
import { ROLE_LABELS } from '../types';

const ROLE_ORDER: TeamRole[] = [
  'business_developer',
  'project_manager',
  'creative',
  'operations',
];

interface MemberFormData {
  name: string;
  role: TeamRole;
  title: string;
  email: string;
  avatar: string;
}

const defaultForm: MemberFormData = {
  name: '',
  role: 'creative',
  title: '',
  email: '',
  avatar: '',
};

export const TeamPage: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useProjectStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberFormData>(defaultForm);
  const [filterRole, setFilterRole] = useState<TeamRole | 'all'>('all');

  const filtered = filterRole === 'all'
    ? teamMembers
    : teamMembers.filter((m) => m.role === filterRole);

  const grouped = ROLE_ORDER.reduce<Record<TeamRole, typeof teamMembers>>((acc, role) => {
    acc[role] = filtered.filter((m) => m.role === role);
    return acc;
  }, {} as Record<TeamRole, typeof teamMembers>);

  const handleEdit = (id: string) => {
    const m = teamMembers.find((m) => m.id === id);
    if (!m) return;
    setForm({ name: m.name, role: m.role, title: m.title, email: m.email, avatar: m.avatar || '' });
    setEditId(id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.title.trim()) return;
    if (editId) {
      updateTeamMember(editId, {
        name: form.name,
        role: form.role,
        title: form.title,
        email: form.email,
        avatar: form.avatar || undefined,
        initials: form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      });
    } else {
      addTeamMember({
        name: form.name,
        role: form.role,
        title: form.title,
        email: form.email,
        avatar: form.avatar || undefined,
      });
    }
    setShowForm(false);
    setEditId(null);
    setForm(defaultForm);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(defaultForm);
  };

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">Team</h1>
          <p className="text-zinc-500 mt-1">{teamMembers.length} members across all roles</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(defaultForm); }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Role Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {(['all', ...ROLE_ORDER] as const).map((role) => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filterRole === role
                ? 'bg-black text-white border-black'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            {role === 'all' ? 'All' : ROLE_LABELS[role]}
          </button>
        ))}
      </div>

      {/* Team Grid by Role */}
      {ROLE_ORDER.map((role) => {
        const members = grouped[role];
        if (members.length === 0) return null;
        return (
          <div key={role} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-bold text-black tracking-widest uppercase">
                {ROLE_LABELS[role]}
              </h2>
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-xs text-zinc-400">{members.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-zinc-200 rounded-xl p-4 flex items-start gap-3 group hover:border-zinc-400 transition-colors"
                >
                  <Avatar member={m} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-black text-sm leading-tight">{m.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{m.title}</p>
                    <p className="text-xs text-zinc-400 mt-1 truncate">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(m.id)}
                      className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteTeamMember(m.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-black">
                {editId ? 'Edit Member' : 'Add Team Member'}
              </h2>
              <button onClick={handleCancel} className="text-zinc-400 hover:text-black transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-black mb-1.5 uppercase tracking-wide">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1.5 uppercase tracking-wide">
                  Role *
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as TeamRole }))}
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm outline-none focus:border-black bg-white"
                >
                  {ROLE_ORDER.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1.5 uppercase tracking-wide">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Senior Designer"
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1.5 uppercase tracking-wide">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="email@cause.co"
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1.5 uppercase tracking-wide">
                  Photo URL (optional)
                </label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm outline-none focus:border-black"
                />
                {form.avatar && (
                  <img src={form.avatar} alt="Preview" className="mt-2 w-10 h-10 rounded-full object-cover border border-zinc-200" />
                )}
                {!form.avatar && form.name && (
                  <div className="mt-2">
                    <p className="text-xs text-zinc-400">Avatar preview:</p>
                    <div className="mt-1 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg text-sm font-medium hover:border-zinc-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.email.trim() || !form.title.trim()}
                className="flex-1 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={14} />
                {editId ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
