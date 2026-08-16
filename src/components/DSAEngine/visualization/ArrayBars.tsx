import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkspaceStep } from '../types/workspace.types';

interface ArrayBarsProps {
  step: WorkspaceStep;
}

const MAX_HEIGHT = 200;
const MIN_HEIGHT = 16;

export const ArrayBars: React.FC<ArrayBarsProps> = ({ step }) => {
  const { arrayState, currentIndexes, activeIndexes, sortedIndexes, pivotIndex } = step;
  const max = Math.max(...arrayState, 1);

  const getColor = (idx: number): string => {
    if (activeIndexes.includes(idx)) return 'from-pink-500 to-rose-600';
    if (pivotIndex === idx) return 'from-amber-400 to-orange-500';
    if (sortedIndexes.includes(idx)) return 'from-emerald-400 to-green-600';
    if (currentIndexes.includes(idx)) return 'from-cyan-400 to-blue-500';
    return 'from-indigo-800/60 to-indigo-900/60';
  };

  const getGlow = (idx: number): string => {
    if (activeIndexes.includes(idx)) return 'shadow-[0_0_20px_rgba(236,72,153,0.7)]';
    if (pivotIndex === idx) return 'shadow-[0_0_20px_rgba(251,191,36,0.7)]';
    if (sortedIndexes.includes(idx)) return 'shadow-[0_0_20px_rgba(52,211,153,0.7)]';
    if (currentIndexes.includes(idx)) return 'shadow-[0_0_20px_rgba(34,211,238,0.7)]';
    return '';
  };

  return (
    <div className="flex items-end justify-center gap-1.5 w-full h-full px-4" style={{ minHeight: MAX_HEIGHT + 60 }}>
      <AnimatePresence mode="popLayout">
        {arrayState.map((val: number, idx: number) => {
          const barHeight = Math.max(MIN_HEIGHT, Math.floor((val / max) * MAX_HEIGHT));
          const color = getColor(idx);
          const glow = getGlow(idx);

          return (
            <div key={`bar-${idx}`} className="flex flex-col items-center gap-2 flex-1 min-w-0" style={{ maxWidth: 60 }}>
              {/* Value label on top */}
              <motion.span
                layout
                className="text-xs font-mono font-bold text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {val}
              </motion.span>

              {/* Bar */}
              <motion.div
                layout
                key={`val-${val}-${idx}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: barHeight,
                  opacity: 1,
                  scale: activeIndexes.includes(idx) || currentIndexes.includes(idx) ? 1.05 : 1,
                }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className={`w-full rounded-t-lg bg-gradient-to-t ${color} ${glow} transition-shadow duration-200 relative overflow-hidden`}
              >
                {/* Shimmer effect on active */}
                {(activeIndexes.includes(idx) || currentIndexes.includes(idx)) && (
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Index label */}
              <span className={`text-[10px] font-mono font-semibold ${
                currentIndexes.includes(idx) ? 'text-cyan-400' :
                activeIndexes.includes(idx) ? 'text-pink-400' :
                sortedIndexes.includes(idx) ? 'text-emerald-400' :
                'text-gray-600'
              }`}>
                {idx}
              </span>

              {/* Pointer arrow */}
              {currentIndexes.includes(idx) && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-cyan-400 text-xs"
                >
                  ▲
                </motion.div>
              )}
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
