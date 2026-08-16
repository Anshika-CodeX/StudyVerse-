import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkspaceStep } from '../types/workspace.types';

interface StackVisualizerProps {
  step: WorkspaceStep;
}

const getCellStyle = (index: number, topIndex: number | null, activeIndices: number[], comparingIndices: number[], successIndices: number[], dimmedIndices: number[]) => {
  const isTop = topIndex === index;
  const isActive = activeIndices.includes(index);
  const isComparing = comparingIndices.includes(index);
  const isSuccess = successIndices.includes(index);
  const isDimmed = dimmedIndices.includes(index);

  if (isSuccess) return 'border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_24px_rgba(52,211,153,0.4)]';
  if (isComparing) return 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-[0_0_22px_rgba(251,191,36,0.45)]';
  if (isActive) return 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.45)]';
  if (isTop) return 'border-violet-400 bg-violet-500/20 text-violet-200 shadow-[0_0_22px_rgba(168,85,247,0.45)]';
  if (isDimmed) return 'border-white/5 bg-white/5 text-gray-600 opacity-45';
  return 'border-white/10 bg-white/5 text-gray-200';
};

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ step }) => {
  const stackValues = step.stackState?.values ?? step.arrayState;
  const topIndex = step.stackState?.topIndex ?? (stackValues.length > 0 ? stackValues.length - 1 : null);
  const activeIndices = step.stackState?.activeIndices ?? [];
  const comparingIndices = step.stackState?.comparingIndices ?? [];
  const successIndices = step.stackState?.successIndices ?? [];
  const dimmedIndices = step.stackState?.dimmedIndices ?? [];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[320px] px-8 py-8 overflow-x-auto">
      <div className="flex items-end justify-center gap-3 flex-wrap">
        {stackValues.length === 0 ? (
          <div className="flex flex-col items-center gap-2">
            <div className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-400 font-mono font-bold">EMPTY</div>
            <span className="text-[10px] font-mono text-gray-500">TOP = NULL</span>
          </div>
        ) : (
          stackValues.map((value, idx) => (
            <div key={`stack-${idx}-${String(value)}`} className="flex flex-col items-center gap-2">
              <AnimatePresence>
                {(topIndex === idx || activeIndices.includes(idx) || comparingIndices.includes(idx) || successIndices.includes(idx)) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-1"
                  >
                    {topIndex === idx && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-violet-500/40 bg-violet-500/20 text-violet-300">TOP</span>
                    )}
                    {activeIndices.includes(idx) && !comparingIndices.includes(idx) && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-500/20 text-cyan-300">CURRENT</span>
                    )}
                    {comparingIndices.includes(idx) && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/20 text-amber-300">COMPARE</span>
                    )}
                    {successIndices.includes(idx) && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-300">OK</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                className={`w-16 h-16 rounded-xl border flex items-center justify-center font-mono text-base font-bold ${getCellStyle(idx, topIndex, activeIndices, comparingIndices, successIndices, dimmedIndices)}`}
              >
                {value}
              </motion.div>

              <div className="text-[10px] font-mono text-gray-500">[{idx}]</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">TOP</span>
          <div className="mt-1 px-3 py-2 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-200 font-mono text-sm">
            {topIndex === null || stackValues.length === 0 ? 'NULL' : String(stackValues[topIndex])}
          </div>
        </div>
        <div className="w-20 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500" />
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">BOTTOM</span>
          <div className="mt-1 px-3 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 font-mono text-sm">
            {stackValues.length === 0 ? 'NULL' : String(stackValues[0])}
          </div>
        </div>
      </div>
    </div>
  );
};
