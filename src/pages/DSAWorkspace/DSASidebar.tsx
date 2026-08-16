import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid, Lock, ChevronRight,
  List, Layers, Network, GitBranch, Share2, BrainCircuit,
} from 'lucide-react';
import type { DSAOperation } from '../../components/DSAEngine/types/workspace.types';
import { ARRAY_PROBLEMS } from './data/arrayProblems';
import { LINKED_LIST_PROBLEMS } from './data/linkedListProblems';

interface DSASidebarProps {
  selectedOperation: DSAOperation;
  onSelectOperation: (op: DSAOperation) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-red-400',
};

// Sub-sections for each topic
const TOPIC_SECTIONS = [
  {
    topic: 'Array',
    icon: LayoutGrid,
    color: 'text-cyan-400',
    borderActive: 'border-cyan-500',
    bgActive: 'bg-cyan-500/10 border-cyan-500/20',
    available: true,
    subSections: [
      {
        label: 'Core Operations',
        labelColor: 'text-gray-500',
        ops: [
          'Traversal',
          'Insertion',
          'Deletion',
          'Update',
          'Reverse',
          'Rotate',
          'LinearSearch',
          'BinarySearch',
          'BubbleSort',
        ],
        problems: ARRAY_PROBLEMS,
      },
      {
        label: 'Practice Problems',
        labelColor: 'text-cyan-400',
        ops: [
          'ReverseArray',
          'FindMax',
          'PracticeLinearSearch',
          'PracticeBinarySearch',
          'TwoSum',
        ],
        problems: ARRAY_PROBLEMS,
      },
    ],
  },
  {
    topic: 'Linked List',
    icon: GitBranch,
    color: 'text-pink-400',
    borderActive: 'border-pink-500',
    bgActive: 'bg-pink-500/10 border-pink-500/20',
    available: true,
    subSections: [
      {
        label: 'Basics',
        labelColor: 'text-gray-500',
        ops: ['LL_Traversal', 'LL_Insertion', 'LL_Deletion'],
        problems: LINKED_LIST_PROBLEMS,
      },
      {
        label: 'Practice',
        labelColor: 'text-pink-400',
        ops: ['LL_Reverse', 'LL_Search', 'LL_Swap'],
        problems: LINKED_LIST_PROBLEMS,
      },
    ],
  },
  {
    topic: 'Stack',
    icon: Layers,
    color: 'text-violet-400',
    borderActive: 'border-violet-500',
    bgActive: 'bg-violet-500/10 border-violet-500/20',
    available: true,
    subSections: [
      {
        label: 'Basics',
        labelColor: 'text-gray-500',
        ops: ['Stack_Traversal', 'Stack_Push', 'Stack_Pop'],
        problems: {} as any,
      },
      {
        label: 'Practice',
        labelColor: 'text-violet-400',
        ops: [
          'Stack_ValidParentheses',
          'Stack_NextGreaterElement',
          'Stack_Reverse',
          'Stack_PostfixToPrefix',
        ],
        problems: {} as any,
      },
    ],
  },
  {
    topic: 'Queue',
    icon: List,
    color: 'text-amber-400',
    available: false,
    subSections: [],
  },
  {
    topic: 'Tree',
    icon: Network,
    color: 'text-emerald-400',
    available: false,
    subSections: [],
  },
  {
    topic: 'Graph',
    icon: Share2,
    color: 'text-blue-400',
    available: false,
    subSections: [],
  },
  {
    topic: 'DP',
    icon: BrainCircuit,
    color: 'text-orange-400',
    available: false,
    subSections: [],
  },
];

export const DSASidebar: React.FC<DSASidebarProps> = ({
  selectedOperation,
  onSelectOperation,
}) => {
  const [expanded, setExpanded] = React.useState<string>('Array');

  return (
    <div className="h-full bg-[#0a0d1a] border-r border-white/5 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Topics
        </h3>
      </div>

      {/* Topic sections */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar py-2">
        {TOPIC_SECTIONS.map(
          ({
            topic,
            icon: Icon,
            color,
            available,
            bgActive,
            borderActive,
            subSections,
          }) => (
            <div key={topic} className="mb-1">

              {/* Topic header */}
              <button
                onClick={() =>
                  available &&
                  setExpanded(expanded === topic ? '' : topic)
                }
                disabled={!available}
                className={`w-full flex items-center justify-between px-4 py-2.5 group transition-all ${
                  available
                    ? 'hover:bg-white/5 cursor-pointer'
                    : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className={color} />

                  <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                    {topic}
                  </span>
                </div>

                {available ? (
                  <ChevronRight
                    size={14}
                    className={`text-gray-600 transition-transform duration-200 ${
                      expanded === topic ? 'rotate-90' : ''
                    }`}
                  />
                ) : (
                  <div className="flex items-center gap-1">
                    <Lock size={10} className="text-gray-700" />
                    <span className="text-[9px] font-mono text-gray-700 uppercase tracking-wider">
                      Soon
                    </span>
                  </div>
                )}
              </button>

              {/* Operations list */}
              {available && expanded === topic && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {subSections.map((section) => (
                    <div key={section.label}>

                      {/* Sub-section label */}
                      <div
                        className={`px-4 py-1 pl-10 text-[9px] font-bold font-mono uppercase tracking-wider ${section.labelColor}`}
                      >
                        {section.label}
                      </div>

                      {/* Operation buttons */}
                      {section.ops.map((op) => {
                        const problem =
                          section.problems[
                            op as keyof typeof section.problems
                          ];

                        const isSelected = selectedOperation === op;

                        return (
                          <motion.button
                            key={op}
                            onClick={() =>
                              onSelectOperation(op as DSAOperation)
                            }
                            whileTap={{ scale: 0.97 }}
                            className={`w-full flex items-center justify-between px-4 py-1.5 pl-10 text-left transition-all border-l-2 ${
                              isSelected
                                ? `${
                                    bgActive ??
                                    'bg-cyan-500/10 border-cyan-500/20'
                                  } ${
                                    borderActive ?? 'border-cyan-500'
                                  } text-white`
                                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/3 hover:border-white/10'
                            }`}
                          >
                            <span
                              className={`text-xs font-medium ${
                                isSelected ? color : ''
                              }`}
                            >
                              {problem?.title ?? op}
                            </span>

                            <span
                              className={`text-[9px] font-mono ${
                                DIFFICULTY_COLORS[
                                  problem?.difficulty ?? 'Easy'
                                ]
                              }`}
                            >
                              {problem?.difficulty}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}

                </motion.div>
              )}
            </div>
          )
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="text-[9px] text-gray-700 font-mono text-center">
          Arrays · Linked List · 7 topics planned
        </div>
      </div>
    </div>
  );
};