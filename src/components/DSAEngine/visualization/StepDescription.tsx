import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkspaceStep } from '../types/workspace.types';

interface StepDescriptionProps {
  step: WorkspaceStep | null;
  currentStep: number;
  totalSteps: number;
}

const PHASE_COLORS: Record<string, { border: string; bg: string; dot: string; text: string }> = {
  traverse:   { border: 'border-cyan-500/40',   bg: 'bg-cyan-500/10',   dot: 'bg-cyan-400',    text: 'text-cyan-300'    },
  compare:    { border: 'border-amber-500/40',  bg: 'bg-amber-500/10',  dot: 'bg-amber-400',   text: 'text-amber-300'   },
  swap:       { border: 'border-pink-500/40',   bg: 'bg-pink-500/10',   dot: 'bg-pink-400',    text: 'text-pink-300'    },
  insert:     { border: 'border-violet-500/40', bg: 'bg-violet-500/10', dot: 'bg-violet-400',  text: 'text-violet-300'  },
  delete:     { border: 'border-red-500/40',    bg: 'bg-red-500/10',    dot: 'bg-red-400',     text: 'text-red-300'     },
  update:     { border: 'border-blue-500/40',   bg: 'bg-blue-500/10',   dot: 'bg-blue-400',    text: 'text-blue-300'    },
  found:      { border: 'border-emerald-500/40',bg: 'bg-emerald-500/10',dot: 'bg-emerald-400', text: 'text-emerald-300' },
  not_found:  { border: 'border-red-500/40',    bg: 'bg-red-500/10',    dot: 'bg-red-400',     text: 'text-red-300'     },
  sorted:     { border: 'border-emerald-500/40',bg: 'bg-emerald-500/10',dot: 'bg-emerald-400', text: 'text-emerald-300' },
  rotate:     { border: 'border-indigo-500/40', bg: 'bg-indigo-500/10', dot: 'bg-indigo-400',  text: 'text-indigo-300'  },
  done:       { border: 'border-emerald-500/40',bg: 'bg-emerald-500/10',dot: 'bg-emerald-400', text: 'text-emerald-300' },
  idle:       { border: 'border-white/10',      bg: 'bg-white/5',       dot: 'bg-gray-400',    text: 'text-gray-300'    },
};

export const StepDescription: React.FC<StepDescriptionProps> = ({ step, currentStep, totalSteps }) => {
  if (!step) return null;

  const colors = PHASE_COLORS[step.phase] ?? PHASE_COLORS.idle;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className={`border ${colors.border} ${colors.bg} rounded-2xl p-4 flex items-start gap-3`}
      >
        {/* Phase indicator dot */}
        <div className="mt-1 shrink-0">
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${colors.text} opacity-70`}>
              {step.phase.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-mono text-gray-500">
              Step {currentStep + 1} / {totalSteps}
            </span>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">{step.explanation}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
