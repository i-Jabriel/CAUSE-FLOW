import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { WorkflowStepper } from '../../components/WorkflowStepper';
import { StatusBadge, PriorityBadge } from '../../components/Badge';
import { Avatar, AvatarGroup } from '../../components/Avatar';
import { IntakeStage } from './IntakeStage';
import { QuotationStage } from './QuotationStage';
import { CreativeStage } from './CreativeStage';
import { ApprovalStage } from './ApprovalStage';
import { ProductionStage } from './ProductionStage';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, teamMembers, deleteProject, getTeamMember } = useProjectStore();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500">Project not found.</p>
        <Link to="/" className="text-black underline text-sm mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const bd = project.businessDeveloperId ? getTeamMember(project.businessDeveloperId) : undefined;
  const pm = project.projectManagerId ? getTeamMember(project.projectManagerId) : undefined;
  const creatives = (project.creativeTeamIds || []).map((id) => getTeamMember(id)).filter(Boolean) as typeof teamMembers;
  const ops = project.operationsLeadId ? getTeamMember(project.operationsLeadId) : undefined;
  const allMembers = [bd, pm, ...creatives, ops].filter(Boolean) as typeof teamMembers;

  const handleDelete = () => {
    if (window.confirm('Delete this project? This action cannot be undone.')) {
      deleteProject(project.id);
      navigate('/');
    }
  };

  const renderStage = () => {
    switch (project.status) {
      case 'intake':
        return <IntakeStage project={project} />;
      case 'quotation':
        return <QuotationStage project={project} />;
      case 'creative':
        return <CreativeStage project={project} />;
      case 'pending_approval':
        return <ApprovalStage project={project} />;
      case 'approved':
        return <ApprovalStage project={project} isPOReceived />;
      case 'production':
        return <ProductionStage project={project} />;
      case 'delivered':
        return <ProductionStage project={project} isDelivered />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Project Header */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight leading-tight mb-1">
              {project.title}
            </h1>
            <p className="text-zinc-500 text-sm">{project.client}</p>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="text-zinc-300 hover:text-red-500 transition-colors p-2 flex-shrink-0"
            title="Delete project"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Team row */}
        {allMembers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-wrap items-center gap-4">
            <span className="text-xs text-zinc-400">Team</span>
            <div className="flex flex-wrap gap-3">
              {bd && (
                <div className="flex items-center gap-1.5">
                  <Avatar member={bd} size="xs" />
                  <span className="text-xs text-zinc-500">{bd.name} <span className="text-zinc-300">· BD</span></span>
                </div>
              )}
              {pm && (
                <div className="flex items-center gap-1.5">
                  <Avatar member={pm} size="xs" />
                  <span className="text-xs text-zinc-500">{pm.name} <span className="text-zinc-300">· PM</span></span>
                </div>
              )}
              {creatives.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <AvatarGroup members={creatives} size="xs" max={3} />
                  <span className="text-xs text-zinc-400">Creative</span>
                </div>
              )}
              {ops && (
                <div className="flex items-center gap-1.5">
                  <Avatar member={ops} size="xs" />
                  <span className="text-xs text-zinc-500">{ops.name} <span className="text-zinc-300">· Ops</span></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Workflow Stepper */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-6">
        <WorkflowStepper currentStatus={project.status} />
      </div>

      {/* Stage Content */}
      <div>
        {renderStage()}
      </div>
    </div>
  );
};
