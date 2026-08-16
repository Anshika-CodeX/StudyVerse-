import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, BarChart2, Box, Layers, Sparkles } from 'lucide-react';
import type { WorkspaceStep, VisualizationMode } from '../../components/DSAEngine/types/workspace.types';
import { ArrayBars } from '../../components/DSAEngine/visualization/ArrayBars';
import { ArrayBoxes } from '../../components/DSAEngine/visualization/ArrayBoxes';
import { LinkedListVisualizer } from '../../components/DSAEngine/visualization/LinkedListVisualizer';
import { StackVisualizer } from '../../components/DSAEngine/visualization/StackVisualizer';
import { StepDescription } from '../../components/DSAEngine/visualization/StepDescription';

interface VisualizationPanelProps {
  activeStep: WorkspaceStep | null;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  visualMode: VisualizationMode;
  onVisualModeChange: (mode: VisualizationMode) => void;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onExplainAi?: () => void;
}

const SPEEDS = [0.25, 0.5, 1, 1.5, 2, 4];

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  activeStep,
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  visualMode,
  onVisualModeChange,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  onSpeedChange,
  onExplainAi,
}) => {
  return (
    <div className="h-full bg-[#0a0d1a] flex flex-col justify-between p-4 overflow-hidden relative border-l border-white/5">
      {/* Header controls (Mode selector + AI Explain button) */}
      <div className="flex items-center justify-between shrink-0 mb-4 z-10">
        {/* Mode selector — shown for arrays */}
        {!activeStep?.linkedListState && !activeStep?.stackState ? (
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => onVisualModeChange('boxes')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                visualMode === 'boxes' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Box size={13} />
              <span>Boxes</span>
            </button>
            <button
              onClick={() => onVisualModeChange('bars')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                visualMode === 'bars' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart2 size={13} />
              <span>Bars</span>
            </button>
            <button
              onClick={() => onVisualModeChange('both')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                visualMode === 'both' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>Both</span>
            </button>
          </div>
        ) : activeStep?.linkedListState ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-300 text-xs font-mono font-bold">
            <span>Linked List Nodes & Pointer View</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-300 text-xs font-mono font-bold">
            <span>Stack View</span>
          </div>
        )}

        {/* Explain Current Step button */}
        <button
          onClick={onExplainAi}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-500/30 text-purple-200 text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <Sparkles size={13} className="text-pink-400" />
          <span>Explain Step with AI</span>
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden py-4 space-y-6">
        {activeStep && (
          <>
            {activeStep.linkedListState ? (
              <LinkedListVisualizer step={activeStep} />
            ) : activeStep.stackState ? (
              <StackVisualizer step={activeStep} />
            ) : (
              <>
                {(visualMode === 'boxes' || visualMode === 'both') && (
                  <ArrayBoxes step={activeStep} />
                )}
                {(visualMode === 'bars' || visualMode === 'both') && (
                  <ArrayBars step={activeStep} />
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Step Explanation Overlay */}
      <div className="my-3 z-10 shrink-0">
        <StepDescription step={activeStep} currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Playback Controls */}
      <div className="bg-[#080b14] border border-white/5 rounded-2xl p-3 flex flex-col gap-3 shrink-0 z-10">
        {/* Progress Bar */}
        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          {/* Step Counter */}
          <span className="text-xs font-mono text-gray-400">
            Step {currentStep + 1} / {totalSteps}
          </span>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onPrevStep}
              disabled={currentStep === 0}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30"
              title="Previous Step"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="translate-x-0.5" />}
            </button>

            <button
              onClick={onNextStep}
              disabled={currentStep === totalSteps - 1}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30"
              title="Next Step"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
            {SPEEDS.map(s => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-colors ${
                  speed === s ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
