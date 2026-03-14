import React, { useState } from 'react';
import { ArrowRight, Plus, CheckCircle, Clock, RotateCcw, Package, FileText } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { Avatar } from '../../components/Avatar';
import type { Project, Revision } from '../../types';

interface ProductionStageProps {
  project: Project;
  isDelivered?: boolean;
}

export const ProductionStage: React.FC<ProductionStageProps> = ({ project, isDelivered }) => {
  const { saveDelivery, addRevision, updateRevision, advanceStage, teamMembers, updateProject } = useProjectStore();

  const delivery = project.delivery;
  const opsLead = project.operationsLeadId
    ? teamMembers.find((m) => m.id === project.operationsLeadId)
    : undefined;

  const [notes, setNotes] = useState(delivery?.operationsNotes || '');
  const [deliverableInput, setDeliverableInput] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>(delivery?.deliverables || []);
  const [deliveryStatus, setDeliveryStatus] = useState<'not_started' | 'in_progress' | 'revision' | 'delivered'>(
    delivery?.status || 'not_started'
  );

  // Revision form
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionDesc, setRevisionDesc] = useState('');

  const revisions = delivery?.revisions || [];
  const completedRevisions = revisions.filter((r) => r.status === 'completed').length;

  const handleSave = () => {
    saveDelivery(project.id, {
      deadline: delivery?.deadline || '',
      completedAt: deliveryStatus === 'delivered' ? new Date().toISOString() : delivery?.completedAt,
      deliverables,
      revisions,
      operationsNotes: notes,
      status: deliveryStatus,
    });
  };

  const handleAddDeliverable = () => {
    if (!deliverableInput.trim()) return;
    setDeliverables((prev) => [...prev, deliverableInput.trim()]);
    setDeliverableInput('');
  };

  const handleAddRevision = () => {
    if (!revisionDesc.trim()) return;
    addRevision(project.id, {
      round: revisions.length + 1,
      description: revisionDesc,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    });
    setRevisionDesc('');
    setShowRevisionForm(false);
  };

  const handleCompleteRevision = (revisionId: string) => {
    updateRevision(project.id, revisionId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  };

  const handleMarkDelivered = () => {
    saveDelivery(project.id, {
      deadline: delivery?.deadline || '',
      completedAt: new Date().toISOString(),
      deliverables,
      revisions,
      operationsNotes: notes,
      status: 'delivered',
    });
    advanceStage(project.id);
  };

  const canDeliver = deliverables.length > 0 && !isDelivered;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
        <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-1">
          {isDelivered ? 'Stage 7 of 7' : 'Stage 6 of 7'}
        </p>
        <h2 className="text-xl font-bold text-black mb-1">
          {isDelivered ? 'Project Delivered' : 'Production & Delivery'}
        </h2>
        <p className="text-sm text-zinc-500">
          {isDelivered
            ? 'All deliverables have been completed and sent to the client.'
            : 'Track delivery progress, manage revisions, and mark the project as delivered when complete.'}
        </p>
        {opsLead && (
          <div className="mt-3 pt-3 border-t border-zinc-200 flex items-center gap-2">
            <span className="text-xs text-zinc-400">Operations Lead:</span>
            <Avatar member={opsLead} size="xs" showName />
          </div>
        )}
      </div>

      {/* PO Summary */}
      {project.purchaseOrder && (
        <div className="flex items-start gap-3 bg-white border border-zinc-200 rounded-xl p-4">
          <FileText size={15} className="text-zinc-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-0.5">Purchase Order</p>
            <p className="text-sm font-semibold text-black">{project.purchaseOrder.number}</p>
            <p className="text-xs text-zinc-500">
              {project.purchaseOrder.clientName} · {project.purchaseOrder.currency} {project.purchaseOrder.amount.toLocaleString()} · Received {project.purchaseOrder.receivedDate}
            </p>
          </div>
        </div>
      )}

      {/* Delivery Info */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-zinc-100">
          <span className="font-semibold text-black">Delivery Details</span>
          {delivery?.deadline && (
            <span className="text-xs text-zinc-500 flex items-center gap-1.5">
              <Clock size={12} />
              Due {delivery.deadline}
            </span>
          )}
        </div>
        <div className="px-5 py-5 bg-white space-y-4">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Delivery Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(['not_started', 'in_progress', 'revision', 'delivered'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => !isDelivered && setDeliveryStatus(s)}
                  disabled={isDelivered}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all capitalize ${
                    deliveryStatus === s
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 disabled:opacity-50'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
              Deliverables
            </label>
            <div className="space-y-1.5 mb-2">
              {deliverables.map((d, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-zinc-400 flex-shrink-0" />
                  <span className="text-sm text-zinc-700">{d}</span>
                  {!isDelivered && (
                    <button
                      onClick={() => setDeliverables((prev) => prev.filter((_, i) => i !== idx))}
                      className="ml-auto text-zinc-300 hover:text-red-500 text-xs transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {!isDelivered && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deliverableInput}
                  onChange={(e) => setDeliverableInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddDeliverable(); }}
                  placeholder="Add deliverable..."
                  className="flex-1 text-xs border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-black"
                />
                <button
                  onClick={handleAddDeliverable}
                  disabled={!deliverableInput.trim()}
                  className="px-3 py-2 bg-black text-white text-xs rounded-lg hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Operations Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Delivery notes, tracking info, client comms..."
              disabled={isDelivered}
              className="input-base resize-none"
            />
          </div>

          {!isDelivered && (
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-black text-black text-xs font-semibold rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Revisions */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-zinc-100">
          <div>
            <span className="font-semibold text-black">Revisions</span>
            {revisions.length > 0 && (
              <span className="ml-2 text-xs text-zinc-400">
                {completedRevisions}/{revisions.length} resolved
              </span>
            )}
          </div>
          {!isDelivered && (
            <button
              onClick={() => setShowRevisionForm((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-black hover:text-zinc-600 transition-colors"
            >
              <Plus size={14} />
              Request Revision
            </button>
          )}
        </div>

        {showRevisionForm && (
          <div className="px-5 py-4 bg-zinc-50 border-b border-zinc-200 space-y-3">
            <textarea
              value={revisionDesc}
              onChange={(e) => setRevisionDesc(e.target.value)}
              rows={3}
              placeholder="Describe the revision requested by the client..."
              className="input-base resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleAddRevision} disabled={!revisionDesc.trim()} className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-40 transition-colors">
                Add Revision
              </button>
              <button onClick={() => setShowRevisionForm(false)} className="px-4 py-2 border border-zinc-200 text-zinc-600 text-xs font-semibold rounded-lg hover:border-zinc-400 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-zinc-100 bg-white">
          {revisions.length === 0 ? (
            <div className="px-5 py-6 text-center text-zinc-400 text-sm">
              No revisions requested.
            </div>
          ) : (
            revisions.map((r) => (
              <div key={r.id} className="px-5 py-4 flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  r.status === 'completed' ? 'bg-zinc-100 text-zinc-500' : 'bg-black text-white'
                }`}>
                  {r.round}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${r.status === 'completed' ? 'text-zinc-400 line-through' : 'text-black font-medium'}`}>
                      {r.description}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                      r.status === 'completed'
                        ? 'bg-zinc-50 text-zinc-400 border-zinc-200'
                        : r.status === 'in_progress'
                        ? 'bg-zinc-100 text-zinc-600 border-zinc-300'
                        : 'bg-black text-white border-black'
                    }`}>
                      {r.status === 'completed' ? 'Resolved' : r.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Requested {new Date(r.requestedAt).toLocaleDateString()}
                    {r.completedAt && ` · Resolved ${new Date(r.completedAt).toLocaleDateString()}`}
                  </p>
                  {r.status !== 'completed' && !isDelivered && (
                    <button
                      onClick={() => handleCompleteRevision(r.id)}
                      className="mt-2 flex items-center gap-1 text-xs text-zinc-500 hover:text-black transition-colors"
                    >
                      <CheckCircle size={12} />
                      Mark as resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mark Delivered */}
      {!isDelivered && (
        <div className="pt-4 border-t border-zinc-100">
          <button
            onClick={handleMarkDelivered}
            disabled={!canDeliver}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Package size={16} />
            Mark as Delivered
          </button>
          {!canDeliver && (
            <p className="text-xs text-zinc-400 mt-2">
              Add at least one deliverable before marking as delivered.
            </p>
          )}
        </div>
      )}

      {/* Delivered banner */}
      {isDelivered && delivery?.completedAt && (
        <div className="flex items-center gap-3 bg-zinc-900 text-white rounded-xl p-5">
          <CheckCircle size={20} className="flex-shrink-0" />
          <div>
            <p className="font-bold">Project Delivered</p>
            <p className="text-sm text-zinc-400">
              Completed on {new Date(delivery.completedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
