import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkspaceStep, LinkedListState } from '../types/workspace.types';

interface LinkedListVisualizerProps {
  step: WorkspaceStep;
}

const POINTER_COLOR_CLASSES: Record<string, { bg: string; text: string; border: string }> = {
  HEAD: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40' },
  CURRENT: { bg: 'bg-cyan-500/25', text: 'text-cyan-300', border: 'border-cyan-400' },
  PREV: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
  NEXT: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },
  TARGET: { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/40' },
  NEW: { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/40' },
  FOUND: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
};

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ step }) => {
  const llState: LinkedListState = step.linkedListState ?? {
    nodes: step.arrayState.map((val, i) => ({
      id: `node-${i}`,
      value: val,
      nextId: i < step.arrayState.length - 1 ? `node-${i + 1}` : null,
    })),
    pointers: [{ name: 'HEAD', nodeId: 'node-0', color: 'cyan' }],
  };

  const {
    nodes,
    pointers,
    activeNodeIds = [],
    comparingNodeIds = [],
    specialNodeIds = [],
    successNodeIds = [],
    dimmedNodeIds = [],
  } = llState;

  // Separate regular linked list sequence nodes from detached (isNew) nodes
  const detachedNodes = nodes.filter(n => n.isNew);
  const mainNodes = nodes.filter(n => !n.isNew);

  // Helper to determine node visual style
  const getNodeStyle = (id: string) => {
    if (successNodeIds.includes(id)) {
      return {
        border: 'border-emerald-400',
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-200',
        nextBg: 'bg-emerald-500/30',
        glow: 'shadow-[0_0_24px_rgba(52,211,153,0.5)]',
      };
    }
    if (specialNodeIds.includes(id)) {
      return {
        border: 'border-pink-500',
        bg: 'bg-pink-500/20',
        text: 'text-pink-200',
        nextBg: 'bg-pink-500/30',
        glow: 'shadow-[0_0_24px_rgba(236,72,153,0.5)]',
      };
    }
    if (comparingNodeIds.includes(id)) {
      return {
        border: 'border-amber-400',
        bg: 'bg-amber-400/20',
        text: 'text-amber-200',
        nextBg: 'bg-amber-500/30',
        glow: 'shadow-[0_0_24px_rgba(251,191,36,0.5)]',
      };
    }
    if (activeNodeIds.includes(id)) {
      return {
        border: 'border-cyan-400',
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-200',
        nextBg: 'bg-cyan-500/30',
        glow: 'shadow-[0_0_24px_rgba(6,182,212,0.5)]',
      };
    }
    if (dimmedNodeIds.includes(id)) {
      return {
        border: 'border-white/5',
        bg: 'bg-white/3',
        text: 'text-gray-600',
        nextBg: 'bg-white/5',
        glow: 'opacity-40',
      };
    }
    return {
      border: 'border-white/10',
      bg: 'bg-white/5',
      text: 'text-gray-200',
      nextBg: 'bg-white/10',
      glow: '',
    };
  };

  // Find pointers pointing to null
  const nullPointers = pointers.filter(p => p.nodeId === null);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[320px] pt-12 pb-8 px-8 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* Detached New Node Row (if an insertion is in progress) */}
      {detachedNodes.length > 0 && (
        <div className="flex items-center justify-center gap-4 mb-8">
          {detachedNodes.map(node => {
            const style = getNodeStyle(node.id);
            const nodePointers = pointers.filter(p => p.nodeId === node.id);

            return (
              <div key={node.id} className="flex flex-col items-center gap-2">
                {/* Pointer tags */}
                <div className="flex items-center gap-1 min-h-[24px]">
                  {nodePointers.map(p => {
                    const c = POINTER_COLOR_CLASSES[p.name] ?? POINTER_COLOR_CLASSES.NEW;
                    return (
                      <span
                        key={p.name}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}
                      >
                        {p.name}
                      </span>
                    );
                  })}
                </div>

                {/* Detached Node Box */}
                <div className="flex items-center">
                  <div
                    className={`
                      flex items-center rounded-xl border ${style.border} ${style.bg} ${style.glow}
                      transition-all duration-300 font-mono overflow-hidden shadow-lg backdrop-blur-md
                    `}
                  >
                    <div className="px-4 py-3 text-base font-bold text-white border-r border-white/10">
                      {node.value}
                    </div>
                    <div className={`px-3 py-3 text-xs ${style.nextBg} text-gray-400 font-semibold flex items-center gap-1`}>
                      <span>next</span>
                      <span className="text-cyan-400">→</span>
                    </div>
                  </div>

                  {/* Arrow to target or NULL */}
                  <div className="flex items-center px-2">
                    <svg className="w-8 h-6 text-pink-400" viewBox="0 0 32 24" fill="none">
                      <path d="M2 12H24M24 12L18 6M24 12L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-mono font-bold text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10">
                      {node.nextId ? mainNodes.find(n => n.id === node.nextId)?.value ?? node.nextId : 'NULL'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-pink-400">Detached New Node</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Linked List Chain */}
      <div className="flex items-center justify-center gap-3 py-4 flex-nowrap min-w-max">
        {mainNodes.map((node, idx) => {
          const style = getNodeStyle(node.id);
          const nodePointers = pointers.filter(p => p.nodeId === node.id);

          return (
            <React.Fragment key={node.id}>
              <div className="flex flex-col items-center gap-2 relative group">
                {/* Pointer Badges Above Node */}
                <div className="flex items-center gap-1 min-h-[26px]">
                  <AnimatePresence>
                    {nodePointers.map(p => {
                      const c = POINTER_COLOR_CLASSES[p.name] ?? POINTER_COLOR_CLASSES.CURRENT;
                      return (
                        <motion.div
                          key={p.name}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="flex flex-col items-center"
                        >
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border} shadow-sm`}>
                            {p.name}
                          </span>
                          <span className={`${c.text} text-[10px] leading-none mt-0.5`}>▼</span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Node Box [ Value | next ] */}
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`
                    flex items-center rounded-xl border ${style.border} ${style.bg} ${style.glow}
                    transition-all duration-300 font-mono overflow-hidden shadow-xl backdrop-blur-md
                  `}
                >
                  {/* Value Section */}
                  <div className={`px-4 py-3 text-lg font-bold ${style.text} border-r border-white/10 flex items-center justify-center min-w-[52px]`}>
                    {node.value}
                  </div>

                  {/* Next Section */}
                  <div className={`px-3 py-3 text-xs ${style.nextBg} text-gray-400 font-semibold flex items-center gap-1`}>
                    <span>next</span>
                    <span className="text-cyan-400 text-xs">●</span>
                  </div>
                </motion.div>

                {/* Index Subtitle */}
                <span className="text-[10px] font-mono text-gray-500">
                  [{idx}]
                </span>
              </div>

              {/* Arrow connecting to next node or NULL */}
              <div className="flex items-center justify-center px-1">
                <svg className="w-10 h-6 text-cyan-400" viewBox="0 0 40 24" fill="none">
                  <defs>
                    <marker id={`arrowhead-${idx}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill="currentColor" />
                    </marker>
                  </defs>
                  <path
                    d="M 2 12 L 34 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    markerEnd={`url(#arrowhead-${idx})`}
                  />
                </svg>
              </div>
            </React.Fragment>
          );
        })}

        {/* Terminal NULL Node */}
        <div className="flex flex-col items-center gap-2">
          {/* NULL Pointers */}
          <div className="flex items-center gap-1 min-h-[26px]">
            {nullPointers.map(p => {
              const c = POINTER_COLOR_CLASSES[p.name] ?? POINTER_COLOR_CLASSES.PREV;
              return (
                <div key={p.name} className="flex flex-col items-center">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                    {p.name}
                  </span>
                  <span className={`${c.text} text-[10px] leading-none mt-0.5`}>▼</span>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-400 font-mono font-bold text-sm shadow-md">
            NULL
          </div>
          <span className="text-[10px] font-mono text-gray-600">End</span>
        </div>
      </div>
    </div>
  );
};
