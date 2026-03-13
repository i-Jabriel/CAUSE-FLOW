import { create } from 'zustand';
import type {
  Project,
  TeamMember,
  ProjectStatus,
  Task,
  Comment,
  BudgetSheet,
  Quotation,
  CreativeBrief,
  Proposal,
  PurchaseOrder,
  DeliveryInfo,
  Revision,
  STAGE_ORDER,
} from '../types';
import { sampleProjects, sampleTeamMembers } from '../data/sampleData';

const STAGE_ORDER_LIST: ProjectStatus[] = [
  'intake',
  'quotation',
  'creative',
  'pending_approval',
  'approved',
  'production',
  'delivered',
];

function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function now(): string {
  return new Date().toISOString();
}

interface ProjectStore {
  projects: Project[];
  teamMembers: TeamMember[];

  // Project CRUD
  addProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  advanceStage: (id: string) => void;

  // Team CRUD
  addTeamMember: (data: Omit<TeamMember, 'id' | 'initials'>) => string;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Quotation & Budget
  saveQuotation: (projectId: string, quotation: Quotation) => void;
  saveBudgetSheet: (projectId: string, budgetSheet: BudgetSheet) => void;

  // Brief
  saveBrief: (projectId: string, brief: CreativeBrief) => void;

  // Tasks
  addTask: (projectId: string, data: Omit<Task, 'id' | 'comments'>) => string;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  addComment: (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;

  // Proposals
  addProposal: (projectId: string, proposal: Omit<Proposal, 'id' | 'uploadedAt'>) => void;
  deleteProposal: (projectId: string, proposalId: string) => void;

  // Purchase Order
  savePurchaseOrder: (projectId: string, po: PurchaseOrder) => void;

  // Delivery
  saveDelivery: (projectId: string, delivery: DeliveryInfo) => void;
  addRevision: (projectId: string, revision: Omit<Revision, 'id'>) => void;
  updateRevision: (projectId: string, revisionId: string, updates: Partial<Revision>) => void;

  // Selectors
  getProject: (id: string) => Project | undefined;
  getTeamMember: (id: string) => TeamMember | undefined;
  getProjectsByStatus: (status: ProjectStatus) => Project[];
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: sampleProjects,
  teamMembers: sampleTeamMembers,

  addProject: (data) => {
    const id = generateId('p');
    const project: Project = {
      ...data,
      id,
      createdAt: now(),
      updatedAt: now(),
    };
    set((s) => ({ projects: [...s.projects, project] }));
    return id;
  },

  updateProject: (id, updates) => {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: now() } : p
      ),
    }));
  },

  deleteProject: (id) => {
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
  },

  advanceStage: (id) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) return;
    const currentIdx = STAGE_ORDER_LIST.indexOf(project.status);
    if (currentIdx < STAGE_ORDER_LIST.length - 1) {
      const nextStatus = STAGE_ORDER_LIST[currentIdx + 1];
      set((s) => ({
        projects: s.projects.map((p) =>
          p.id === id ? { ...p, status: nextStatus, updatedAt: now() } : p
        ),
      }));
    }
  },

  addTeamMember: (data) => {
    const id = generateId('tm');
    const initials = data.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const member: TeamMember = { ...data, id, initials };
    set((s) => ({ teamMembers: [...s.teamMembers, member] }));
    return id;
  },

  updateTeamMember: (id, updates) => {
    set((s) => ({
      teamMembers: s.teamMembers.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  },

  deleteTeamMember: (id) => {
    set((s) => ({ teamMembers: s.teamMembers.filter((m) => m.id !== id) }));
  },

  saveQuotation: (projectId, quotation) => {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId ? { ...p, quotation, updatedAt: now() } : p
      ),
    }));
  },

  saveBudgetSheet: (projectId, budgetSheet) => {
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId) return p;
        const updatedQuotation = p.quotation
          ? { ...p.quotation, budgetSheet, amount: budgetSheet.total }
          : undefined;
        return { ...p, quotation: updatedQuotation, updatedAt: now() };
      }),
    }));
  },

  saveBrief: (projectId, brief) => {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId ? { ...p, brief, updatedAt: now() } : p
      ),
    }));
  },

  addTask: (projectId, data) => {
    const id = generateId('t');
    const task: Task = { ...data, id, comments: [] };
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, tasks: [...(p.tasks || []), task], updatedAt: now() }
          : p
      ),
    }));
    return id;
  },

  updateTask: (projectId, taskId, updates) => {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: (p.tasks || []).map((t) =>
                t.id === taskId ? { ...t, ...updates } : t
              ),
              updatedAt: now(),
            }
          : p
      ),
    }));
  },

  deleteTask: (projectId, taskId) => {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, tasks: (p.tasks || []).filter((t) => t.id !== taskId), updatedAt: now() }
          : p
      ),
    }));
  },

  addComment: (projectId, taskId, commentData) => {
    const comment: Comment = {
      ...commentData,
      id: generateId('c'),
      createdAt: now(),
    };
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: (p.tasks || []).map((t) =>
                t.id === taskId
                  ? { ...t, comments: [...t.comments, comment] }
                  : t
              ),
              updatedAt: now(),
            }
          : p
      ),
    }));
  },

  addProposal: (projectId, proposalData) => {
    const proposal: Proposal = {
      ...proposalData,
      id: generateId('pr'),
      uploadedAt: now(),
    };
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, proposals: [...(p.proposals || []), proposal], updatedAt: now() }
          : p
      ),
    }));
  },

  deleteProposal: (projectId, proposalId) => {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, proposals: (p.proposals || []).filter((pr) => pr.id !== proposalId), updatedAt: now() }
          : p
      ),
    }));
  },

  savePurchaseOrder: (projectId, po) => {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId ? { ...p, purchaseOrder: po, updatedAt: now() } : p
      ),
    }));
  },

  saveDelivery: (projectId, delivery) => {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId ? { ...p, delivery, updatedAt: now() } : p
      ),
    }));
  },

  addRevision: (projectId, revisionData) => {
    const revision: Revision = { ...revisionData, id: generateId('r') };
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId || !p.delivery) return p;
        return {
          ...p,
          delivery: { ...p.delivery, revisions: [...p.delivery.revisions, revision] },
          updatedAt: now(),
        };
      }),
    }));
  },

  updateRevision: (projectId, revisionId, updates) => {
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId || !p.delivery) return p;
        return {
          ...p,
          delivery: {
            ...p.delivery,
            revisions: p.delivery.revisions.map((r) =>
              r.id === revisionId ? { ...r, ...updates } : r
            ),
          },
          updatedAt: now(),
        };
      }),
    }));
  },

  getProject: (id) => get().projects.find((p) => p.id === id),
  getTeamMember: (id) => get().teamMembers.find((m) => m.id === id),
  getProjectsByStatus: (status) => get().projects.filter((p) => p.status === status),
}));
