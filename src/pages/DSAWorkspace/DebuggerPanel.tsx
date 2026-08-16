import React from 'react';
import { Bug, Cpu, Layers, HardDrive, ArrowRight, StepForward, RotateCcw } from 'lucide-react';
import type { DebuggerState, WorkspaceStep } from '../../components/DSAEngine/types/workspace.types';

interface DebuggerPanelProps {
  debuggerState: DebuggerState;
  steps: WorkspaceStep[];
  currentStep: number;
  onJumpToStep: (stepIdx: number) => void;
  onStepOver: () => void;
  onReset: () => void;
}

export const DebuggerPanel: React.FC<DebuggerPanelProps> = ({
  debuggerState,
  steps,
  currentStep,
  onJumpToStep,
  onStepOver,
  onReset,
}) => {
  const { variables } = debuggerState;

  return (
    <div className="h-full bg-[#0a0d1a] border-t border-white/5 flex flex-col p-4 space-y-4 overflow-y-auto hidden-scrollbar text-xs font-mono text-gray-300">
      {/* Control Toolbar */}
      <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Bug size={14} className="text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider">Debugger</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onStepOver}
            className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-all text-[11px]"
            title="Step Over (Next Step)"
          >
            <StepForward size={12} />
            <span>Step Over</span>
          </button>
          <button
            onClick={onReset}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Reset Execution"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Grid Layout for Debugger Sub-panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
        {/* 1. Live Variable Watcher */}
        <div className="bg-white/3 border border-white/5 rounded-xl p-3 flex flex-col space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-white/5 pb-1.5">
            <Cpu size={13} />
            <span className="uppercase tracking-wider text-[10px]">Variables Watch</span>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto hidden-scrollbar">
            {Object.keys(variables).length === 0 ? (
              <span className="text-gray-600 italic">No active variables</span>
            ) : (
              Object.entries(variables).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded border border-white/5">
                  <span className="text-purple-300 font-bold">{key}</span>
                  <span className="text-cyan-300 font-bold">{String(val)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Execution Timeline / Step Log */}
        <div className="bg-white/3 border border-white/5 rounded-xl p-3 flex flex-col space-y-2">
          <div className="flex items-center gap-1.5 text-pink-400 font-bold border-b border-white/5 pb-1.5">
            <ArrowRight size={13} />
            <span className="uppercase tracking-wider text-[10px]">Execution Timeline</span>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto hidden-scrollbar max-h-40">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => onJumpToStep(idx)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition-all ${
                  idx === currentStep
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <span className="truncate">#{idx + 1} {step.phase}</span>
                <span className="text-[10px] font-mono text-gray-600">Line {step.codeLine + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Call Stack (Placeholder for multi-frame algorithms) */}
        <div className="bg-white/3 border border-white/5 rounded-xl p-3 flex flex-col space-y-2">
          <div className="flex items-center gap-1.5 text-violet-400 font-bold border-b border-white/5 pb-1.5">
            <Layers size={13} />
            <span className="uppercase tracking-wider text-[10px]">Call Stack</span>
          </div>

          <div className="space-y-1">
            <div className="bg-black/40 px-2.5 py-1.5 rounded border border-violet-500/30 text-violet-300 font-bold flex justify-between">
              <span>main()</span>
              <span className="text-gray-500 text-[10px]">Frame 0</span>
            </div>
          </div>
        </div>

        {/* 4. Memory View (Placeholder for pointers / dynamic allocations) */}
        <div className="bg-white/3 border border-white/5 rounded-xl p-3 flex flex-col space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold border-b border-white/5 pb-1.5">
            <HardDrive size={13} />
            <span className="uppercase tracking-wider text-[10px]">Memory Heap/Stack</span>
          </div>

          <div className="text-gray-500 italic text-[11px] leading-relaxed">
            Contiguous Memory Allocated: {steps[currentStep]?.arrayState.length ?? 0} slots
          </div>
        </div>
      </div>
    </div>
  );
};
