export type ProjectStatus =
  | 'intake'           // Business Developer inputs project
  | 'quotation'        // PM prepares quotation + creative brief
  | 'creative'         // Creative team works on tasks + uploads proposal
  | 'pending_approval' // Sent to client, waiting for PO
  | 'approved'         // PO received and recorded
  | 'production'       // Operations handles delivery
  | 'delivered';       // Project complete

export type TeamRole =
  | 'business_developer'
  | 'project_manager'
  | 'creative'
  | 'operations';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  title: string;
  email: string;
  avatar?: string; // photo URL
  initials: string;
}

export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  total: number; // computed: quantity * unitCost
}

export interface BudgetSheet {
  items: BudgetItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface Quotation {
  id: string;
  number: string;
  date: string;
  validUntil: string;
  amount: number;
  currency: string;
  notes: string;
  budgetSheet: BudgetSheet;
}

export interface CreativeBrief {
  objective: string;
  targetAudience: string;
  deliverables: string[];
  timeline: string;
  references: string;
  notes: string;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedToId?: string;
  deadline: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  comments: Comment[];
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  uploadedAt: string;
  uploadedById: string;
  fileName?: string;
  fileUrl?: string;
}

export interface PurchaseOrder {
  number: string;
  amount: number;
  currency: string;
  receivedDate: string;
  clientName: string;
  notes: string;
  fileName?: string;
}

export interface Revision {
  id: string;
  round: number;
  description: string;
  requestedAt: string;
  completedAt?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface DeliveryInfo {
  deadline: string;
  completedAt?: string;
  deliverables: string[];
  revisions: Revision[];
  operationsNotes: string;
  status: 'not_started' | 'in_progress' | 'revision' | 'delivered';
}

export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;

  // Team assignments
  businessDeveloperId?: string;
  projectManagerId?: string;
  creativeTeamIds?: string[];
  operationsLeadId?: string;

  // Stage data
  quotation?: Quotation;
  brief?: CreativeBrief;
  tasks?: Task[];
  proposals?: Proposal[];
  purchaseOrder?: PurchaseOrder;
  delivery?: DeliveryInfo;
}

export const STAGE_ORDER: ProjectStatus[] = [
  'intake',
  'quotation',
  'creative',
  'pending_approval',
  'approved',
  'production',
  'delivered',
];

export const STAGE_LABELS: Record<ProjectStatus, string> = {
  intake: 'Intake',
  quotation: 'Quotation & Brief',
  creative: 'Creative',
  pending_approval: 'Client Approval',
  approved: 'PO Received',
  production: 'Production',
  delivered: 'Delivered',
};

export const ROLE_LABELS: Record<TeamRole, string> = {
  business_developer: 'Business Developer',
  project_manager: 'Project Manager',
  creative: 'Creative',
  operations: 'Operations',
};
