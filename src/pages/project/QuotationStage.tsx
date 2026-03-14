import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { Avatar } from '../../components/Avatar';
import { BudgetSheet } from '../../components/BudgetSheet';
import type { Project, Quotation, CreativeBrief, BudgetSheet as BudgetSheetType } from '../../types';

interface QuotationStageProps {
  project: Project;
}

function generateId() {
  return `q_${Date.now()}`;
}

const EMPTY_BUDGET: BudgetSheetType = {
  items: [],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 0,
};

export const QuotationStage: React.FC<QuotationStageProps> = ({ project }) => {
  const { saveQuotation, saveBrief, advanceStage, updateProject, teamMembers } = useProjectStore();

  const pm = project.projectManagerId
    ? teamMembers.find((m) => m.id === project.projectManagerId)
    : undefined;
  const bd = project.businessDeveloperId
    ? teamMembers.find((m) => m.id === project.businessDeveloperId)
    : undefined;
  const creativeMembers = teamMembers.filter((m) => m.role === 'creative');

  // Quotation state
  const [quotationSection, setQuotationSection] = useState(true);
  const [briefSection, setBriefSection] = useState(true);
  const [teamSection, setTeamSection] = useState(true);

  const [quoteNumber, setQuoteNumber] = useState(project.quotation?.number || `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`);
  const [quoteDate, setQuoteDate] = useState(project.quotation?.date || new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState(project.quotation?.validUntil || '');
  const [currency, setCurrency] = useState(project.quotation?.currency || 'USD');
  const [quoteNotes, setQuoteNotes] = useState(project.quotation?.notes || '');
  const [budgetSheet, setBudgetSheet] = useState<BudgetSheetType>(project.quotation?.budgetSheet || EMPTY_BUDGET);

  // Brief state
  const [objective, setObjective] = useState(project.brief?.objective || '');
  const [targetAudience, setTargetAudience] = useState(project.brief?.targetAudience || '');
  const [deliverables, setDeliverables] = useState<string[]>(project.brief?.deliverables || ['']);
  const [timeline, setTimeline] = useState(project.brief?.timeline || '');
  const [references, setReferences] = useState(project.brief?.references || '');
  const [briefNotes, setBriefNotes] = useState(project.brief?.notes || '');

  // Team state
  const [selectedCreativeIds, setSelectedCreativeIds] = useState<string[]>(
    project.creativeTeamIds || []
  );

  const canAdvance =
    budgetSheet.items.length > 0 &&
    objective.trim() &&
    timeline.trim() &&
    deliverables.some((d) => d.trim()) &&
    selectedCreativeIds.length > 0;

  const handleSaveAndAdvance = () => {
    const quotation: Quotation = {
      id: generateId(),
      number: quoteNumber,
      date: quoteDate,
      validUntil,
      amount: budgetSheet.total,
      currency,
      notes: quoteNotes,
      budgetSheet,
    };
    const brief: CreativeBrief = {
      objective,
      targetAudience,
      deliverables: deliverables.filter((d) => d.trim()),
      timeline,
      references,
      notes: briefNotes,
    };
    saveQuotation(project.id, quotation);
    saveBrief(project.id, brief);
    updateProject(project.id, { creativeTeamIds: selectedCreativeIds });
    advanceStage(project.id);
  };

  const toggleCreative = (id: string) => {
    setSelectedCreativeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addDeliverable = () => setDeliverables((prev) => [...prev, '']);
  const updateDeliverable = (idx: number, val: string) =>
    setDeliverables((prev) => prev.map((d, i) => (i === idx ? val : d)));
  const removeDeliverable = (idx: number) =>
    setDeliverables((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
        <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-1">Stage 2 of 7</p>
        <h2 className="text-xl font-bold text-black mb-1">Quotation & Creative Brief</h2>
        <p className="text-sm text-zinc-500">
          Prepare the budget sheet, quotation, and creative brief. Assign the creative team before
          passing to production.
        </p>
        {pm && (
          <div className="mt-3 pt-3 border-t border-zinc-200 flex items-center gap-2">
            <span className="text-xs text-zinc-400">Project Manager:</span>
            <Avatar member={pm} size="xs" showName />
          </div>
        )}
      </div>

      {/* ─── Budget Sheet & Quotation ─── */}
      <Section
        title="Budget Sheet & Quotation"
        open={quotationSection}
        onToggle={() => setQuotationSection((v) => !v)}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <FormField label="Quote Number">
            <input
              type="text"
              value={quoteNumber}
              onChange={(e) => setQuoteNumber(e.target.value)}
              className="input-base"
            />
          </FormField>
          <FormField label="Date">
            <input
              type="date"
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
              className="input-base"
            />
          </FormField>
          <FormField label="Valid Until">
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="input-base"
            />
          </FormField>
          <FormField label="Currency">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input-base bg-white"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AED">AED</option>
              <option value="SAR">SAR</option>
            </select>
          </FormField>
        </div>

        <div className="border border-zinc-200 rounded-xl p-5 bg-white">
          <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-4">
            Cost Breakdown
          </p>
          <BudgetSheet initial={budgetSheet} onChange={setBudgetSheet} />
        </div>

        <FormField label="Quotation Notes" className="mt-4">
          <textarea
            value={quoteNotes}
            onChange={(e) => setQuoteNotes(e.target.value)}
            rows={3}
            placeholder="Payment terms, revision rounds, conditions..."
            className="input-base resize-none"
          />
        </FormField>
      </Section>

      {/* ─── Creative Brief ─── */}
      <Section
        title="Creative Brief"
        open={briefSection}
        onToggle={() => setBriefSection((v) => !v)}
      >
        <div className="space-y-4">
          <FormField label="Objective *">
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
              placeholder="What is the goal of this project?"
              className="input-base resize-none"
            />
          </FormField>

          <FormField label="Target Audience">
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              rows={2}
              placeholder="Who is the audience?"
              className="input-base resize-none"
            />
          </FormField>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
              Deliverables *
            </label>
            <div className="space-y-2">
              {deliverables.map((d, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={d}
                    onChange={(e) => updateDeliverable(idx, e.target.value)}
                    placeholder={`Deliverable ${idx + 1}`}
                    className="input-base flex-1"
                  />
                  {deliverables.length > 1 && (
                    <button
                      onClick={() => removeDeliverable(idx)}
                      className="p-2 text-zinc-400 hover:text-black transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addDeliverable}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black transition-colors"
              >
                <Plus size={13} />
                Add deliverable
              </button>
            </div>
          </div>

          <FormField label="Timeline *">
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 6 weeks from kickoff"
              className="input-base"
            />
          </FormField>

          <FormField label="References & Inspiration">
            <textarea
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              rows={2}
              placeholder="Links, brands, or examples to inspire the direction..."
              className="input-base resize-none"
            />
          </FormField>

          <FormField label="Additional Notes">
            <textarea
              value={briefNotes}
              onChange={(e) => setBriefNotes(e.target.value)}
              rows={2}
              placeholder="Any other important context..."
              className="input-base resize-none"
            />
          </FormField>
        </div>
      </Section>

      {/* ─── Assign Creative Team ─── */}
      <Section
        title="Assign Creative Team"
        open={teamSection}
        onToggle={() => setTeamSection((v) => !v)}
      >
        <p className="text-sm text-zinc-500 mb-4">Select team members who will work on this project.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {creativeMembers.map((m) => {
            const selected = selectedCreativeIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleCreative(m.id)}
                className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all text-left ${
                  selected ? 'border-black bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                <Avatar member={m} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">{m.name}</p>
                  <p className="text-xs text-zinc-500">{m.title}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selected ? 'bg-black border-black' : 'border-zinc-300'
                  }`}
                >
                  {selected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {selectedCreativeIds.length > 0 && (
          <p className="text-xs text-zinc-500 mt-3">
            {selectedCreativeIds.length} member{selectedCreativeIds.length > 1 ? 's' : ''} selected
          </p>
        )}
      </Section>

      {/* Advance */}
      <div className="pt-4 border-t border-zinc-100">
        <button
          onClick={handleSaveAndAdvance}
          disabled={!canAdvance}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send to Creative Team
          <ArrowRight size={16} />
        </button>
        {!canAdvance && (
          <p className="text-xs text-zinc-400 mt-2">
            Complete the budget sheet, brief, and assign the creative team to proceed.
          </p>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, open, onToggle, children }) => (
  <div className="border border-zinc-200 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-zinc-50 transition-colors text-left"
    >
      <span className="font-semibold text-black">{title}</span>
      {open ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
    </button>
    {open && <div className="px-5 pb-5 pt-1 bg-white">{children}</div>}
  </div>
);

const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, children, className = '' }) => (
  <div className={className}>
    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

// Inject input base style globally via a style tag in index.html — or use a Tailwind class string
// We'll use a helper — applied inline since we can't have .input-base in tailwind without config
// Note: We add the actual class in the JSX directly via className="w-full px-3 py-2 border..."
// The "input-base" class name is just for readability above; actual styles are in global CSS below.
// Since we can't easily add to tailwind config here, let's replace all input-base with full classes.
// (We'll handle this with a global CSS file added to main.tsx imports)
