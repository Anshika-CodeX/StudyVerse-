import type { VisualizerVariables } from '../types/visualizer.types';
import { motion, AnimatePresence } from 'framer-motion';

interface VariableTrackerProps {
  variables?: VisualizerVariables;
}

export const VariableTracker = ({ variables }: VariableTrackerProps) => {
  if (!variables || Object.keys(variables).length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      <AnimatePresence>
        {Object.entries(variables).map(([key, value]) => (
          value !== undefined && (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-inner"
            >
              <div className="bg-white/10 px-3 py-1.5 text-xs font-mono font-bold text-gray-300 border-r border-white/10">
                {key}
              </div>
              <div className="px-3 py-1.5 text-sm font-mono font-bold text-primary-400 min-w-[2.5rem] text-center">
                {value}
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};
