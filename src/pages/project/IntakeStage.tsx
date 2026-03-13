import React from 'react';
import { ArrowRight, User, Calendar, FileText } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { Avatar } from '../../components/Avatar';
import type { Project } from '../../types';

interface IntakeStageProps {
  project: Project;
}

export const IntakeStage: React.FC<IntakeStageProps> = ({ project }) => {
  const { advanceStage, teamMembers, updateProject } = useProjectStore();
  const bd = project.businessDeveloperId
    ? teamMembers.find((m) => m.id === project.businessDeveloperId)
    : undefined;

  const pms = teamMembers.filter((m) => m.role === 'project_manager');

  const [pmId, setPmId] = React.useState(project.projectManagerId || '');

  const canAdvance = pmId.trim().length > 0;

  const handleAdvance = () => {
    if (!canAdvance) return;
    updateProject(project.id, { projectManagerId: pmId });
    advanceStage(project.id);
  };

  return (
    <div className="space-y-8">
      {/* Stage description */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
        <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-1">Stage 1 of 7</p>
        <h2 className="text-xl font-bold text-black mb-1">Project Intake</h2>
        <p className="text-sm text-zinc-500">
          The project has been entered by the Business Developer. Assign a Project Manager to begin
          the quotation and creative brief process.
        </p>
      </div>

      {/* Project info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={<FileText size={15} />} label="Project" value={project.title} />
        <InfoCard icon={<User size={15} />} label="Client" value={project.client} />
        <InfoCard icon={<Calendar size={15} />} label="Entered" value={new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
        <InfoCard
          icon={<span className="text-xs font-bold">{project.priority.toUpperCase()}</span>}
          label="Priority"
          value={project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
        />
      </div>

      {/* Description */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Description</p>
        <p className="text-sm text-zinc-700 leading-relaxed bg-white border border-zinc-200 rounded-xl p-4">
          {project.description}
        </p>
      </div>

      {/* Business Developer */}
      {bd && (
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            Business Developer
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 inline-flex">
            <Avatar member={bd} size="md" showName showRole />
          </div>
        </div>
      )}

      {/* Assign PM */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
          Assign Project Manager *
        </p>
        <div className="space-y-2">
          {pms.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPmId(m.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl transition-all text-left max-w-sm ${
                pmId === m.id
                  ? 'border-black bg-zinc-50'
                  : 'border-zinc-200 bg-white hover:border-zinc-400'
              }`}
            >
              <Avatar member={m} size="sm" />
              <div>
                <p className="text-sm font-medium text-black">{m.name}</p>
                <p className="text-xs text-zinc-500">{m.title}</p>
              </div>
              {pmId === m.id && (
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

      {/* Advance */}
      <div className="pt-4 border-t border-zinc-100">
        <button
          onClick={handleAdvance}
          disabled={!canAdvance}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send to Quotation & Brief
          <ArrowRight size={16} />
        </button>
        <p className="text-xs text-zinc-400 mt-2">
          This will notify the Project Manager to begin the quotation and creative brief.
        </p>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-start gap-3">
    <div className="text-zinc-400 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-black">{value}</p>
    </div>
  </div>
);
