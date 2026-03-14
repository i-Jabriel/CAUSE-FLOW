import React, { useState } from 'react';
import { ArrowRight, FileText, CheckCircle, Clock } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { Avatar } from '../../components/Avatar';
import { BudgetSheet } from '../../components/BudgetSheet';
import type { Project, PurchaseOrder } from '../../types';

interface ApprovalStageProps {
  project: Project;
  isPOReceived?: boolean; // true when status === 'approved'
}

export const ApprovalStage: React.FC<ApprovalStageProps> = ({ project, isPOReceived }) => {
  const { savePurchaseOrder, advanceStage, teamMembers } = useProjectStore();

  const [poNumber, setPoNumber] = useState(project.purchaseOrder?.number || '');
  const [poAmount, setPoAmount] = useState(project.purchaseOrder?.amount ?? project.quotation?.amount ?? '');
  const [poCurrency, setPoCurrency] = useState(project.purchaseOrder?.currency || project.quotation?.currency || 'USD');
  const [poDate, setPoDate] = useState(project.purchaseOrder?.receivedDate || new Date().toISOString().slice(0, 10));
  const [poClient, setPoClient] = useState(project.purchaseOrder?.clientName || project.client);
  const [poNotes, setPoNotes] = useState(project.purchaseOrder?.notes || '');
  const [poFileName, setPoFileName] = useState(project.purchaseOrder?.fileName || '');

  const [opsLeadId, setOpsLeadId] = useState('');
  const [deliveryDeadline, setDeliveryDeadline] = useState('');

  const opsMembers = teamMembers.filter((m) => m.role === 'operations');
  const isRecording = project.status === 'pending_approval';
  const isRecorded = project.status === 'approved' || isPOReceived;

  const canSaveAndAdvance =
    poNumber.trim() && poDate && poClient.trim() && opsLeadId && deliveryDeadline;

  const handleRecord = () => {
    const po: PurchaseOrder = {
      number: poNumber,
      amount: Number(poAmount),
      currency: poCurrency,
      receivedDate: poDate,
      clientName: poClient,
      notes: poNotes,
      fileName: poFileName || undefined,
    };
    savePurchaseOrder(project.id, po);

    // Save ops lead + advance to production
    const { updateProject } = useProjectStore.getState();
    updateProject(project.id, {
      operationsLeadId: opsLeadId,
      delivery: {
        deadline: deliveryDeadline,
        deliverables: project.brief?.deliverables || [],
        revisions: [],
        operationsNotes: '',
        status: 'not_started',
      },
    });
    advanceStage(project.id);
    advanceStage(project.id); // skip approved → production
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`border rounded-xl p-5 ${isRecorded ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-50 border-zinc-200'}`}>
        <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-1">
          {isRecording ? 'Stage 4 of 7' : 'Stage 5 of 7'}
        </p>
        <h2 className="text-xl font-bold text-black mb-1">
          {isRecording ? 'Awaiting Client Approval' : 'PO Received — Record & Confirm'}
        </h2>
        <p className="text-sm text-zinc-500">
          {isRecording
            ? 'Proposal has been sent to the client. Once the Purchase Order is received, record it here and move to production.'
            : 'Record the Purchase Order details and assign Operations to begin delivery.'}
        </p>
      </div>

      {/* Quotation summary */}
      {project.quotation && (
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-zinc-100">
            <span className="font-semibold text-black">Quotation Summary</span>
            <span className="text-xs text-zinc-400 font-mono">{project.quotation.number}</span>
          </div>
          <div className="px-5 py-5 bg-white">
            <BudgetSheet initial={project.quotation.budgetSheet} readOnly />
          </div>
        </div>
      )}

      {/* PO Status */}
      {isRecording && !project.purchaseOrder && (
        <div className="flex items-start gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-4">
          <Clock size={16} className="text-zinc-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-zinc-700">Waiting for Purchase Order</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              The proposal was sent to the client. Fill in the PO details below once approval is received.
            </p>
          </div>
        </div>
      )}

      {project.purchaseOrder && (
        <div className="flex items-start gap-3 bg-zinc-50 border border-black rounded-xl p-4">
          <CheckCircle size={16} className="text-black mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-black">PO Received: {project.purchaseOrder.number}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {project.purchaseOrder.clientName} · {project.purchaseOrder.receivedDate} · {project.purchaseOrder.currency} {project.purchaseOrder.amount.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* PO Form */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 bg-white border-b border-zinc-100">
          <span className="font-semibold text-black">Record Purchase Order</span>
        </div>
        <div className="px-5 py-5 bg-white space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField label="PO Number *">
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                placeholder="e.g. PO-2026-0042"
                className="input-base"
                disabled={!!project.purchaseOrder}
              />
            </FormField>
            <FormField label="Amount">
              <input
                type="number"
                value={poAmount}
                onChange={(e) => setPoAmount(e.target.value)}
                placeholder="0.00"
                className="input-base"
                disabled={!!project.purchaseOrder}
              />
            </FormField>
            <FormField label="Currency">
              <select
                value={poCurrency}
                onChange={(e) => setPoCurrency(e.target.value)}
                className="input-base bg-white"
                disabled={!!project.purchaseOrder}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
              </select>
            </FormField>
            <FormField label="Received Date *">
              <input
                type="date"
                value={poDate}
                onChange={(e) => setPoDate(e.target.value)}
                className="input-base"
                disabled={!!project.purchaseOrder}
              />
            </FormField>
            <FormField label="Client Name *">
              <input
                type="text"
                value={poClient}
                onChange={(e) => setPoClient(e.target.value)}
                className="input-base"
                disabled={!!project.purchaseOrder}
              />
            </FormField>
            <FormField label="PO Filename">
              <input
                type="text"
                value={poFileName}
                onChange={(e) => setPoFileName(e.target.value)}
                placeholder="PO_Client_0042.pdf"
                className="input-base"
                disabled={!!project.purchaseOrder}
              />
            </FormField>
          </div>
          <FormField label="Notes">
            <textarea
              value={poNotes}
              onChange={(e) => setPoNotes(e.target.value)}
              rows={2}
              placeholder="Payment terms, special conditions..."
              className="input-base resize-none"
              disabled={!!project.purchaseOrder}
            />
          </FormField>
        </div>
      </div>

      {/* Assign Operations */}
      {!project.purchaseOrder && (
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-white border-b border-zinc-100">
            <span className="font-semibold text-black">Assign Operations Lead</span>
          </div>
          <div className="px-5 py-5 bg-white space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {opsMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setOpsLeadId(m.id)}
                  className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all text-left ${
                    opsLeadId === m.id ? 'border-black bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-400'
                  }`}
                >
                  <Avatar member={m} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-black">{m.name}</p>
                    <p className="text-xs text-zinc-500">{m.title}</p>
                  </div>
                  {opsLeadId === m.id && (
                    <div className="ml-auto w-5 h-5 bg-black rounded-full flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <FormField label="Delivery Deadline *">
              <input
                type="date"
                value={deliveryDeadline}
                onChange={(e) => setDeliveryDeadline(e.target.value)}
                className="input-base max-w-xs"
              />
            </FormField>
          </div>
        </div>
      )}

      {/* Advance */}
      {!project.purchaseOrder && (
        <div className="pt-4 border-t border-zinc-100">
          <button
            onClick={handleRecord}
            disabled={!canSaveAndAdvance}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Record PO & Start Production
            <ArrowRight size={16} />
          </button>
          {!canSaveAndAdvance && (
            <p className="text-xs text-zinc-400 mt-2">
              Complete PO details and assign an Operations Lead with a delivery deadline to proceed.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    {children}
  </div>
);
