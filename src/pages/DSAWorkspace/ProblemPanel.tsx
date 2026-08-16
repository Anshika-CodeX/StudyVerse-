import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { BookOpen, HelpCircle, Code, Clock, Lightbulb, Play } from 'lucide-react';
import type { ProblemDefinition, AlgorithmParams } from '../../components/DSAEngine/types/workspace.types';

interface ProblemPanelProps {
  problem: ProblemDefinition;
  activeTab: 'description' | 'tutorial' | 'examples' | 'hints' | 'complexity';
  onTabChange: (tab: 'description' | 'tutorial' | 'examples' | 'hints' | 'complexity') => void;
  customArrayInput: string;
  onCustomArrayChange: (val: string) => void;
  customParams: AlgorithmParams;
  onCustomParamsChange: (params: AlgorithmParams) => void;
  onApplyInput: () => void;
}

// Shared CSS classes for param inputs — no spinner arrows, dark style
const PARAM_INPUT_CLS =
  'w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-white ' +
  'focus:outline-none focus:border-cyan-500/50 no-spinner';

/**
 * NumericInput — uses a local string while typing so multi-digit numbers work naturally.
 * Parses & commits to parent only on blur or Enter.
 */
const NumericInput: React.FC<{
  label: string;
  value: number | undefined;
  fallback: number;
  onChange: (n: number) => void;
}> = ({ label, value, fallback, onChange }) => {
  const [raw, setRaw] = useState<string>(String(value ?? fallback));

  // Keep raw in sync when parent value changes externally (e.g. operation switch)
  useEffect(() => {
    setRaw(String(value ?? fallback));
  }, [value, fallback]);

  const commit = () => {
    const n = parseInt(raw, 10);
    if (!isNaN(n)) onChange(n);
    else setRaw(String(value ?? fallback)); // revert on invalid
  };

  return (
    <div>
      <label className="text-[10px] text-gray-500 block mb-1 font-mono">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        pattern="-?[0-9]*"
        value={raw}
        onChange={e => setRaw(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); }}
        className={PARAM_INPUT_CLS}
      />
    </div>
  );
};

export const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problem,
  activeTab,
  onTabChange,
  customArrayInput,
  onCustomArrayChange,
  customParams,
  onCustomParamsChange,
  onApplyInput,
}) => {
  const tabs = [
    { id: 'description', label: 'Description', icon: BookOpen },
    { id: 'tutorial',    label: 'Tutorial',    icon: Lightbulb },
    { id: 'examples',   label: 'Examples',    icon: Code },
    { id: 'hints',      label: 'Hints',       icon: HelpCircle },
    { id: 'complexity', label: 'Complexity',  icon: Clock },
  ] as const;

  return (
    <div className="h-full bg-[#0a0d1a] border-r border-white/5 flex flex-col overflow-hidden">
      {/* Header & Tabs */}
      <div className="px-4 pt-3 pb-2 border-b border-white/5 shrink-0 bg-white/2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white font-mono tracking-tight flex items-center gap-2">
            {problem.title}
          </h2>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
            problem.difficulty === 'Easy'   ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            problem.difficulty === 'Medium' ? 'bg-amber-500/10  text-amber-400  border-amber-500/20'  :
                                              'bg-red-500/10    text-red-400    border-red-500/20'
          }`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto hidden-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-5 space-y-4 text-sm leading-relaxed text-gray-300">
        {activeTab === 'description' && (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {problem.description}
            </ReactMarkdown>
          </div>
        )}

        {activeTab === 'tutorial' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono mb-2">
              Interactive Tutorial Steps
            </h3>
            {problem.tutorial.map((stepText, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-gray-200">{stepText}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono mb-2">
              Examples
            </h3>
            {problem.examples.map((ex, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-xl font-mono text-xs text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{ex}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono mb-2">
              Algorithm Hints
            </h3>
            {problem.hints.map((hint, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200">
                <HelpCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <p>{hint}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'complexity' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono mb-2">
              Complexity Analysis
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Time Complexity</span>
                <span className="text-base font-bold font-mono text-cyan-300">{problem.complexity.time}</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase font-mono block mb-1">Space Complexity</span>
                <span className="text-base font-bold font-mono text-pink-300">{problem.complexity.space}</span>
              </div>
            </div>
            {problem.complexity.note && (
              <p className="text-xs text-gray-400 italic bg-white/2 p-3 rounded-xl border border-white/5">
                Note: {problem.complexity.note}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Custom Input Section */}
      <div className="p-4 border-t border-white/5 bg-[#080b14] space-y-3 shrink-0">
        <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider block">
          {problem.topic === 'LinkedList' ? 'Custom List Values' : 'Custom Array Input'}
        </span>

        <div className="flex gap-2">
          <input
            type="text"
            value={customArrayInput}
            onChange={(e) => onCustomArrayChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onApplyInput(); }}
            placeholder={problem.topic === 'LinkedList' ? 'e.g. 10 20 30 40' : 'e.g. 5 3 8 1 2'}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={onApplyInput}
            className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Play size={12} />
            <span>Visualize</span>
          </button>
        </div>

        {/* ── Operation-specific parameter inputs (string-based, no spinners) ── */}
        {problem.operation === 'Insertion' && (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <NumericInput
              label="Insert Index"
              value={customParams.insertIndex}
              fallback={2}
              onChange={n => onCustomParamsChange({ ...customParams, insertIndex: n })}
            />
            <NumericInput
              label="Insert Value"
              value={customParams.insertValue}
              fallback={99}
              onChange={n => onCustomParamsChange({ ...customParams, insertValue: n })}
            />
          </div>
        )}

        {problem.operation === 'Deletion' && (
          <div className="text-xs font-mono">
            <NumericInput
              label="Delete Index"
              value={customParams.deleteIndex}
              fallback={2}
              onChange={n => onCustomParamsChange({ ...customParams, deleteIndex: n })}
            />
          </div>
        )}

        {problem.operation === 'Update' && (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <NumericInput
              label="Update Index"
              value={customParams.updateIndex}
              fallback={2}
              onChange={n => onCustomParamsChange({ ...customParams, updateIndex: n })}
            />
            <NumericInput
              label="New Value"
              value={customParams.updateValue}
              fallback={42}
              onChange={n => onCustomParamsChange({ ...customParams, updateValue: n })}
            />
          </div>
        )}

        {problem.operation === 'Rotate' && (
          <div className="text-xs font-mono">
            <NumericInput
              label="Rotate By (Positions)"
              value={customParams.rotateBy}
              fallback={2}
              onChange={n => onCustomParamsChange({ ...customParams, rotateBy: n })}
            />
          </div>
        )}

        {(problem.operation === 'LinearSearch' || problem.operation === 'BinarySearch' || problem.operation === 'PracticeLinearSearch' || problem.operation === 'PracticeBinarySearch') && (
          <div className="text-xs font-mono">
            <NumericInput
              label="Search Target"
              value={customParams.searchTarget}
              fallback={8}
              onChange={n => onCustomParamsChange({ ...customParams, searchTarget: n })}
            />
          </div>
        )}

        {problem.operation === 'TwoSum' && (
          <div className="text-xs font-mono">
            <NumericInput
              label="Target Sum"
              value={customParams.twoSumTarget ?? customParams.searchTarget}
              fallback={9}
              onChange={n => onCustomParamsChange({ ...customParams, twoSumTarget: n, searchTarget: n })}
            />
          </div>
        )}

        {/* ── Linked List Parameter Inputs ── */}
        {problem.operation === 'LL_Insertion' && (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <NumericInput
              label="Insert at Index"
              value={customParams.insertIndex}
              fallback={1}
              onChange={n => onCustomParamsChange({ ...customParams, insertIndex: n })}
            />
            <NumericInput
              label="Insert Value"
              value={customParams.insertValue}
              fallback={15}
              onChange={n => onCustomParamsChange({ ...customParams, insertValue: n })}
            />
          </div>
        )}

        {problem.operation === 'LL_Deletion' && (
          <div className="text-xs font-mono">
            <NumericInput
              label="Delete at Index"
              value={customParams.deleteIndex}
              fallback={1}
              onChange={n => onCustomParamsChange({ ...customParams, deleteIndex: n })}
            />
          </div>
        )}

        {(problem.operation === 'LL_Search') && (
          <div className="text-xs font-mono">
            <NumericInput
              label="Search Target"
              value={customParams.searchTarget}
              fallback={20}
              onChange={n => onCustomParamsChange({ ...customParams, searchTarget: n })}
            />
          </div>
        )}
      </div>
    </div>
  );
};
