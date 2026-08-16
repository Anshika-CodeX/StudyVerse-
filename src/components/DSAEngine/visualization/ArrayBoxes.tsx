import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkspaceStep } from '../types/workspace.types';

interface ArrayBoxesProps {
  step: WorkspaceStep;
}

export const ArrayBoxes: React.FC<ArrayBoxesProps> = ({ step }) => {
  const { arrayState, currentIndexes, activeIndexes, sortedIndexes, pivotIndex } = step;

  const getBoxStyle = (idx: number) => {
    if (activeIndexes.includes(idx)) return {
      border: 'border-pink-500',
      bg: 'bg-pink-500/20',
      text: 'text-pink-200',
      glow: 'shadow-[0_0_24px_rgba(236,72,153,0.6)]',
      label: 'text-pink-400',
    };
    if (pivotIndex === idx) return {
      border: 'border-amber-400',
      bg: 'bg-amber-400/20',
      text: 'text-amber-200',
      glow: 'shadow-[0_0_24px_rgba(251,191,36,0.6)]',
      label: 'text-amber-400',
    };
    if (sortedIndexes.includes(idx)) return {
      border: 'border-emerald-500',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-300',
      glow: 'shadow-[0_0_16px_rgba(52,211,153,0.4)]',
      label: 'text-emerald-500',
    };
    if (currentIndexes.includes(idx)) return {
      border: 'border-cyan-400',
      bg: 'bg-cyan-400/15',
      text: 'text-cyan-200',
      glow: 'shadow-[0_0_24px_rgba(34,211,238,0.5)]',
      label: 'text-cyan-400',
    };
    return {
      border: 'border-white/10',
      bg: 'bg-white/5',
      text: 'text-gray-300',
      glow: '',
      label: 'text-gray-600',
    };
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full pt-8 pb-4 px-6 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* Pointer arrow row */}
      <div className="flex items-end justify-center gap-2 w-full">
        {arrayState.map((_: number, idx: number) => (
          <div key={`ptr-${idx}`} className="flex-1 flex flex-col items-center" style={{ maxWidth: 80 }}>
            <AnimatePresence>
              {currentIndexes.includes(idx) && (
                <motion.div
                  key={`arrow-${idx}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center gap-1"
                >
                  {/* Variable name label */}
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">
                    {Object.entries(step.variables).find(([k, v]) => v === idx && ['i','j','left','right','mid'].includes(k))?.[0] ?? 'ptr'}
                  </span>
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-cyan-400 text-base leading-none"
                  >
                    ▼
                  </motion.div>
                </motion.div>
              )}
              {activeIndexes.includes(idx) && !currentIndexes.includes(idx) && (
                <motion.div
                  key={`active-arrow-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-pink-400 text-base leading-none"
                >
                  ▼
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Box cells */}
      <div className="flex items-center justify-center gap-2 w-full flex-wrap">
        <AnimatePresence mode="popLayout">
          {arrayState.map((val: number, idx: number) => {
            const style = getBoxStyle(idx);
            const isActive = activeIndexes.includes(idx) || currentIndexes.includes(idx);

            return (
              <motion.div
                key={`box-${idx}-${val}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{
                  opacity: 1,
                  scale: isActive ? 1.1 : 1,
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={`
                  relative flex flex-col items-center justify-center
                  w-14 h-14 sm:w-16 sm:h-16 rounded-xl
                  border ${style.border} ${style.bg} ${style.glow}
                  transition-shadow duration-200
                `}
              >
                {/* Value */}
                <span className={`text-lg font-bold font-mono ${style.text}`}>{val}</span>

                {/* Shimmer on active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-white/10"
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Index labels */}
      <div className="flex items-center justify-center gap-2 w-full flex-wrap">
        {arrayState.map((_: number, idx: number) => {
          const style = getBoxStyle(idx);
          return (
            <div key={`idx-${idx}`} className="w-14 sm:w-16 flex justify-center">
              <span className={`text-xs font-mono font-semibold ${style.label}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
