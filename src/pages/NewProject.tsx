import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { Avatar } from '../components/Avatar';
import type { TeamMember } from '../types';

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const { addProject, teamMembers } = useProjectStore();

  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [bdId, setBdId] = useState('');

  const bds = teamMembers.filter((m) => m.role === 'business_developer');
  const isValid = title.trim() && client.trim() && description.trim() && bdId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const id = addProject({
      title: title.trim(),
      client: client.trim(),
      description: description.trim(),
      priority,
      status: 'intake',
      businessDeveloperId: bdId,
    });

    navigate(`/projects/${id}`);
  };

  const selectedBd = teamMembers.find((m) => m.id === bdId);

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-black tracking-tight">New Project</h1>
        <p className="text-zinc-500 mt-1">Enter project details to start the workflow.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Title */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1.5">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Horizon Brand Identity Campaign"
            className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm text-black placeholder-zinc-400 outline-none focus:border-black transition-colors bg-white"
            required
          />
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1.5">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="e.g. Horizon Ventures"
            className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm text-black placeholder-zinc-400 outline-none focus:border-black transition-colors bg-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1.5">
            Project Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe the project scope and objectives..."
            rows={4}
            className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm text-black placeholder-zinc-400 outline-none focus:border-black transition-colors bg-white resize-none"
            required
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1.5">Priority</label>
          <div className="flex gap-3">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all capitalize ${
                  priority === p
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Business Developer */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1.5">
            Business Developer <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {bds.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setBdId(m.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg transition-all text-left ${
                  bdId === m.id
                    ? 'border-black bg-zinc-50'
                    : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                <Avatar member={m} size="sm" />
                <div>
                  <p className="text-sm font-medium text-black">{m.name}</p>
                  <p className="text-xs text-zinc-500">{m.title}</p>
                </div>
                {bdId === m.id && (
                  <div className="ml-auto w-5 h-5 bg-black rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isValid}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-lg text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Project & Start Workflow
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
