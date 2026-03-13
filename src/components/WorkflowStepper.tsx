import React from 'react';
import { Check } from 'lucide-react';
import type { ProjectStatus } from '../types';
import { STAGE_ORDER, STAGE_LABELS } from '../types';

interface WorkflowStepperProps {
  currentStatus: ProjectStatus;
  onStepClick?: (status: ProjectStatus) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStatus,
  onStepClick,
}) => {
  const currentIdx = STAGE_ORDER.indexOf(currentStatus);

  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center w-full">
        {STAGE_ORDER.map((stage, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isUpcoming = idx > currentIdx;

          return (
            <React.Fragment key={stage}>
              {/* Step */}
              <button
                onClick={() => onStepClick?.(stage)}
                disabled={!onStepClick}
                className={`flex flex-col items-center group ${onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                    ${isCompleted ? 'bg-black border-black text-white' : ''}
                    ${isCurrent ? 'bg-black border-black text-white ring-4 ring-zinc-200' : ''}
                    ${isUpcoming ? 'bg-white border-zinc-300 text-zinc-400' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium leading-tight text-center max-w-[80px]
                    ${isCurrent ? 'text-black' : ''}
                    ${isCompleted ? 'text-zinc-500' : ''}
                    ${isUpcoming ? 'text-zinc-300' : ''}
                  `}
                >
                  {STAGE_LABELS[stage]}
                </span>
              </button>

              {/* Connector line */}
              {idx < STAGE_ORDER.length - 1 && (
                <div className="flex-1 mx-2 mb-5">
                  <div
                    className={`h-px transition-all ${
                      idx < currentIdx ? 'bg-black' : 'bg-zinc-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile stepper — compact */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {STAGE_ORDER.map((stage, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div
                key={stage}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  isCurrent
                    ? 'bg-black text-white border-black'
                    : isCompleted
                    ? 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    : 'bg-white text-zinc-300 border-zinc-200'
                }`}
              >
                {STAGE_LABELS[stage]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
