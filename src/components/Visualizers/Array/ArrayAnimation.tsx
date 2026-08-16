import { motion, AnimatePresence } from 'framer-motion';

interface ArrayAnimationProps {
  arrayState: number[];
  currentIndexes: number[];
  activeIndexes: number[];
}

export const ArrayAnimation = ({ arrayState, currentIndexes, activeIndexes }: ArrayAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 overflow-x-auto hidden-scrollbar w-full min-h-[200px]">
      <div className="flex items-end gap-2 relative">
        <AnimatePresence mode="popLayout">
          {arrayState.map((val, idx) => {
            const isCurrent = currentIndexes.includes(idx);
            const isActive = activeIndexes.includes(idx);

            return (
              <div key={`${val}-${idx}`} className="flex flex-col items-center gap-3">
                {/* Value Box */}
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: isActive ? 1.1 : 1,
                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                  }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  className={`
                    w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl
                    text-lg sm:text-xl font-bold font-mono shadow-xl transition-colors duration-300
                    ${isActive 
                      ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-pink-500/30 border-2 border-pink-400' 
                      : isCurrent
                        ? 'bg-gradient-to-br from-primary-500 to-indigo-600 text-white shadow-primary-500/30 border-2 border-primary-400'
                        : 'bg-white/10 text-white border border-white/20'
                    }
                  `}
                >
                  {val}
                </motion.div>

                {/* Index Label */}
                <motion.div 
                  layout
                  className="text-xs font-mono text-gray-500 bg-black/40 px-2 py-0.5 rounded-md"
                >
                  {idx}
                </motion.div>
                
                {/* Pointer Indicator (Arrow) */}
                <div className="h-6 mt-1 flex flex-col items-center justify-start">
                  {isCurrent && (
                    <motion.div
                      layoutId={`pointer-${idx}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-primary-500 flex flex-col items-center"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
