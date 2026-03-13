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
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                  style={
                    isCompleted
                      ? { backgroundColor: '#6EEDC7', borderColor: '#6EEDC7', color: '#012340' }
                      : isCurrent
                      ? { backgroundColor: '#012340', borderColor: '#6EEDC7', color: '#6EEDC7', boxShadow: '0 0 0 4px rgba(110,237,199,0.2)' }
                      : { backgroundColor: 'white', borderColor: '#e4e4e7', color: '#a1a1aa' }
                  }
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <span
                  className="mt-2 text-xs font-medium leading-tight text-center max-w-[80px]"
                  style={
                    isCurrent
                      ? { color: '#012340' }
                      : isCompleted
                      ? { color: '#3DD9AC' }
                      : { color: '#d4d4d8' }
                  }
                >
                  {STAGE_LABELS[stage]}
                </span>
              </button>

              {/* Connector line */}
              {idx < STAGE_ORDER.length - 1 && (
                <div className="flex-1 mx-2 mb-5">
                  <div
                    className="h-0.5 transition-all rounded-full"
                    style={{ backgroundColor: idx < currentIdx ? '#6EEDC7' : '#e4e4e7' }}
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
                className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all"
                style={
                  isCurrent
                    ? { backgroundColor: '#012340', color: '#6EEDC7', borderColor: '#6EEDC7' }
                    : isCompleted
                    ? { backgroundColor: 'rgba(110,237,199,0.1)', color: '#3DD9AC', borderColor: '#6EEDC7' }
                    : { backgroundColor: 'white', color: '#d4d4d8', borderColor: '#e4e4e7' }
                }
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
