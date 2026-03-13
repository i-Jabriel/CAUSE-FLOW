import React, { useState } from 'react';
import {
  ArrowRight, Plus, X, Send, Upload, FileText, CheckCircle,
  Clock, RotateCcw, Circle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { Avatar } from '../../components/Avatar';
import type { Project, Task } from '../../types';

interface CreativeStageProps {
  project: Project;
}

const TASK_STATUS_ICONS: Record<Task['status'], React.ReactNode> = {
  todo: <Circle size={14} className="text-zinc-300" />,
  in_progress: <Clock size={14} className="text-zinc-600" />,
  review: <RotateCcw size={14} className="text-zinc-700" />,
  completed: <CheckCircle size={14} className="text-black" />,
};

const TASK_STATUS_LABELS: Record<Task['status'], string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'In Review',
  completed: 'Completed',
};

export const CreativeStage: React.FC<CreativeStageProps> = ({ project }) => {
  const {
    addTask, updateTask, deleteTask, addComment,
    addProposal, deleteProposal, advanceStage, teamMembers
  } = useProjectStore();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [commentAuthorId, setCommentAuthorId] = useState('');

  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDesc, setProposalDesc] = useState('');
  const [proposalFile, setProposalFile] = useState('');
  const [proposalUploaderId, setProposalUploaderId] = useState('');

  const creativeTeam = (project.creativeTeamIds || [])
    .map((id) => teamMembers.find((m) => m.id === id))
    .filter(Boolean) as typeof teamMembers;
  const allTeam = teamMembers;

  const tasks = project.tasks || [];
  const proposals = project.proposals || [];

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const hasProposals = proposals.length > 0;
  const canAdvance = hasProposals;

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    addTask(project.id, {
      title: taskTitle,
      description: taskDesc,
      assignedToId: taskAssignee || undefined,
      deadline: taskDeadline,
      status: 'todo',
    });
    setTaskTitle('');
    setTaskDesc('');
    setTaskAssignee('');
    setTaskDeadline('');
    setShowTaskForm(false);
  };

  const handleAddComment = (taskId: string, authorId: string) => {
    const text = commentText[taskId];
    if (!text?.trim() || !authorId) return;
    addComment(project.id, taskId, { authorId, text });
    setCommentText((prev) => ({ ...prev, [taskId]: '' }));
  };

  const handleAddProposal = () => {
    if (!proposalTitle.trim() || !proposalUploaderId) return;
    addProposal(project.id, {
      title: proposalTitle,
      description: proposalDesc,
      uploadedById: proposalUploaderId,
      fileName: proposalFile || undefined,
    });
    setProposalTitle('');
    setProposalDesc('');
    setProposalFile('');
    setProposalUploaderId('');
    setShowProposalForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
        <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-1">Stage 3 of 7</p>
        <h2 className="text-xl font-bold text-black mb-1">Creative Production</h2>
        <p className="text-sm text-zinc-500">
          Delegate tasks to the creative team, track progress, and upload the proposal once complete.
        </p>
        <div className="mt-3 pt-3 border-t border-zinc-200 flex flex-wrap gap-3">
          {creativeTeam.map((m) => (
            <Avatar key={m.id} member={m} size="xs" showName />
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-zinc-100">
          <div>
            <span className="font-semibold text-black">Tasks</span>
            <span className="ml-2 text-xs text-zinc-400">
              {completedTasks}/{tasks.length} completed
            </span>
          </div>
          <button
            onClick={() => setShowTaskForm((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-black hover:text-zinc-600 transition-colors"
          >
            <Plus size={14} />
            Add Task
          </button>
        </div>

        {showTaskForm && (
          <div className="px-5 py-4 bg-zinc-50 border-b border-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title *"
                  className="input-base"
                />
              </div>
              <div className="md:col-span-2">
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                  className="input-base resize-none"
                />
              </div>
              <select
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                className="input-base bg-white"
              >
                <option value="">Assign to...</option>
                {creativeTeam.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="input-base"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddTask} disabled={!taskTitle.trim()} className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-40 transition-colors">
                Add Task
              </button>
              <button onClick={() => setShowTaskForm(false)} className="px-4 py-2 border border-zinc-200 text-zinc-600 text-xs font-semibold rounded-lg hover:border-zinc-400 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-zinc-100 bg-white">
          {tasks.length === 0 ? (
            <div className="px-5 py-8 text-center text-zinc-400 text-sm">
              No tasks yet. Add tasks to delegate work to the creative team.
            </div>
          ) : (
            tasks.map((task) => {
              const assignee = task.assignedToId
                ? teamMembers.find((m) => m.id === task.assignedToId)
                : undefined;
              const isExpanded = expandedTask === task.id;

              return (
                <div key={task.id}>
                  <div className="px-5 py-4 flex items-start gap-3">
                    {/* Status toggle */}
                    <select
                      value={task.status}
                      onChange={(e) => updateTask(project.id, task.id, { status: e.target.value as Task['status'] })}
                      className="mt-0.5 text-xs border-0 outline-none bg-transparent cursor-pointer"
                      title="Change status"
                    >
                      {Object.entries(TASK_STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-zinc-400' : 'text-black'}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-zinc-500 mt-0.5">{task.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {task.deadline && (
                            <span className="text-xs text-zinc-400">{task.deadline}</span>
                          )}
                          {assignee && <Avatar member={assignee} size="xs" />}
                          <button
                            onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                            className="text-zinc-400 hover:text-black transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          <button
                            onClick={() => deleteTask(project.id, task.id)}
                            className="text-zinc-300 hover:text-red-500 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments panel */}
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-zinc-50 border-t border-zinc-100">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3 pt-3">
                        Comments {task.comments.length > 0 && `(${task.comments.length})`}
                      </p>
                      <div className="space-y-2 mb-3">
                        {task.comments.map((comment) => {
                          const author = teamMembers.find((m) => m.id === comment.authorId);
                          return (
                            <div key={comment.id} className="flex gap-2">
                              {author && <Avatar member={author} size="xs" />}
                              <div className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-black">{author?.name || 'Unknown'}</span>
                                  <span className="text-xs text-zinc-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-700">{comment.text}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={commentAuthorId}
                          onChange={(e) => setCommentAuthorId(e.target.value)}
                          className="text-xs border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:border-black bg-white"
                        >
                          <option value="">As...</option>
                          {allTeam.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={commentText[task.id] || ''}
                          onChange={(e) => setCommentText((prev) => ({ ...prev, [task.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(task.id, commentAuthorId); }}
                          placeholder="Add a comment..."
                          className="flex-1 text-xs border border-zinc-200 rounded-lg px-3 py-1.5 outline-none focus:border-black"
                        />
                        <button
                          onClick={() => handleAddComment(task.id, commentAuthorId)}
                          disabled={!commentText[task.id]?.trim() || !commentAuthorId}
                          className="p-2 bg-black text-white rounded-lg hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Proposals */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-zinc-100">
          <span className="font-semibold text-black">Proposals</span>
          <button
            onClick={() => setShowProposalForm((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-black hover:text-zinc-600 transition-colors"
          >
            <Upload size={14} />
            Upload Proposal
          </button>
        </div>

        {showProposalForm && (
          <div className="px-5 py-4 bg-zinc-50 border-b border-zinc-200 space-y-3">
            <input
              type="text"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              placeholder="Proposal title *"
              className="input-base"
            />
            <textarea
              value={proposalDesc}
              onChange={(e) => setProposalDesc(e.target.value)}
              rows={2}
              placeholder="Description (optional)"
              className="input-base resize-none"
            />
            <input
              type="text"
              value={proposalFile}
              onChange={(e) => setProposalFile(e.target.value)}
              placeholder="Filename (e.g. Proposal_v2.pdf)"
              className="input-base"
            />
            <select
              value={proposalUploaderId}
              onChange={(e) => setProposalUploaderId(e.target.value)}
              className="input-base bg-white"
            >
              <option value="">Uploaded by... *</option>
              {creativeTeam.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={handleAddProposal} disabled={!proposalTitle.trim() || !proposalUploaderId} className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-40 transition-colors">
                Add Proposal
              </button>
              <button onClick={() => setShowProposalForm(false)} className="px-4 py-2 border border-zinc-200 text-zinc-600 text-xs font-semibold rounded-lg hover:border-zinc-400 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-zinc-100 bg-white">
          {proposals.length === 0 ? (
            <div className="px-5 py-8 text-center text-zinc-400 text-sm">
              No proposals uploaded yet. Upload a proposal to send to the client for approval.
            </div>
          ) : (
            proposals.map((p) => {
              const uploader = teamMembers.find((m) => m.id === p.uploadedById);
              return (
                <div key={p.id} className="px-5 py-4 flex items-start gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={15} className="text-zinc-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">{p.title}</p>
                    {p.description && <p className="text-xs text-zinc-500 mt-0.5">{p.description}</p>}
                    {p.fileName && <p className="text-xs text-zinc-400 mt-0.5 font-mono">{p.fileName}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      {uploader && <Avatar member={uploader} size="xs" showName />}
                      <span className="text-xs text-zinc-400">·</span>
                      <span className="text-xs text-zinc-400">
                        {new Date(p.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProposal(project.id, p.id)}
                    className="text-zinc-300 hover:text-red-500 transition-colors p-1"
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Advance */}
      <div className="pt-4 border-t border-zinc-100">
        <button
          onClick={() => advanceStage(project.id)}
          disabled={!canAdvance}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send to Client for Approval
          <ArrowRight size={16} />
        </button>
        {!canAdvance && (
          <p className="text-xs text-zinc-400 mt-2">
            Upload at least one proposal before sending to the client.
          </p>
        )}
      </div>
    </div>
  );
};
