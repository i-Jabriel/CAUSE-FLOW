import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { BudgetItem, BudgetSheet as BudgetSheetType } from '../types';

function generateId() {
  return `bi_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
}

function calcSheet(items: BudgetItem[], taxRate: number): BudgetSheetType {
  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const taxAmount = +(subtotal * (taxRate / 100)).toFixed(2);
  const total = +(subtotal + taxAmount).toFixed(2);
  return { items, subtotal, taxRate, taxAmount, total };
}

interface BudgetSheetProps {
  initial?: BudgetSheetType;
  readOnly?: boolean;
  onChange?: (sheet: BudgetSheetType) => void;
}

function fmt(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
}

export const BudgetSheet: React.FC<BudgetSheetProps> = ({
  initial,
  readOnly = false,
  onChange,
}) => {
  const [items, setItems] = useState<BudgetItem[]>(
    initial?.items ?? [{ id: generateId(), description: '', quantity: 1, unitCost: 0, total: 0 }]
  );
  const [taxRate, setTaxRate] = useState(initial?.taxRate ?? 0);

  const sheet = calcSheet(items, taxRate);

  useEffect(() => {
    onChange?.(sheet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, taxRate]);

  const updateItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          updated.total = +(+updated.quantity * +updated.unitCost).toFixed(2);
        }
        return updated;
      })
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: generateId(), description: '', quantity: 1, unitCost: 0, total: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-3 pr-4 font-semibold text-black">Description</th>
              <th className="text-right py-3 px-4 font-semibold text-black w-20">Qty</th>
              <th className="text-right py-3 px-4 font-semibold text-black w-32">Unit Cost</th>
              <th className="text-right py-3 pl-4 font-semibold text-black w-32">Total</th>
              {!readOnly && <th className="w-10" />}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-zinc-100 group">
                <td className="py-2 pr-4">
                  {readOnly ? (
                    <span className="text-zinc-800">{item.description || <span className="text-zinc-400 italic">—</span>}</span>
                  ) : (
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder={`Line item ${idx + 1}`}
                      className="w-full bg-transparent border-0 outline-none text-zinc-800 placeholder-zinc-300 focus:bg-zinc-50 px-1 py-0.5 rounded"
                    />
                  )}
                </td>
                <td className="py-2 px-4 text-right">
                  {readOnly ? (
                    <span>{item.quantity}</span>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', +e.target.value)}
                      className="w-full bg-transparent border-0 outline-none text-right text-zinc-800 focus:bg-zinc-50 px-1 py-0.5 rounded"
                    />
                  )}
                </td>
                <td className="py-2 px-4 text-right">
                  {readOnly ? (
                    <span>{fmt(item.unitCost)}</span>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitCost}
                      onChange={(e) => updateItem(item.id, 'unitCost', +e.target.value)}
                      className="w-full bg-transparent border-0 outline-none text-right text-zinc-800 focus:bg-zinc-50 px-1 py-0.5 rounded"
                    />
                  )}
                </td>
                <td className="py-2 pl-4 text-right font-medium text-black">
                  {fmt(item.total)}
                </td>
                {!readOnly && (
                  <td className="py-2 pl-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-black transition-all p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <button
          onClick={addItem}
          className="mt-3 flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors px-1"
        >
          <Plus size={14} />
          Add line item
        </button>
      )}

      {/* Totals */}
      <div className="mt-4 ml-auto w-64 space-y-1.5 text-sm">
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal</span>
          <span className="font-medium">{fmt(sheet.subtotal)}</span>
        </div>
        <div className="flex justify-between text-zinc-600 items-center">
          <span>Tax</span>
          <div className="flex items-center gap-2">
            {readOnly ? (
              <span>{sheet.taxRate}%</span>
            ) : (
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(+e.target.value)}
                className="w-14 bg-transparent border-0 border-b border-zinc-300 outline-none text-right text-zinc-800 focus:border-black py-0.5"
              />
            )}
            {!readOnly && <span className="text-zinc-400">%</span>}
            <span className="font-medium">{fmt(sheet.taxAmount)}</span>
          </div>
        </div>
        <div className="flex justify-between text-black font-bold text-base pt-2 border-t-2 border-black">
          <span>Total</span>
          <span>{fmt(sheet.total)}</span>
        </div>
      </div>
    </div>
  );
};
