import { useState, useEffect, useCallback, useRef } from 'react';
import type { WorkspaceStep, DSAOperation, AlgorithmParams, SupportedLanguage, VisualizationMode } from '../types/workspace.types';
import { generateSteps, getCodeTemplate } from '../algorithms/array/index';
import { generateLinkedListSteps, getLinkedListCodeTemplate } from '../algorithms/linkedList/index';
import { generateStackSteps, getStackCodeTemplate } from '../algorithms/stack/index';
import type { LinkedListOperation, StackOperation } from '../types/workspace.types';

interface UseWorkspaceEngineProps {
  operation: DSAOperation;
  array: number[];
  params: AlgorithmParams;
  language: SupportedLanguage;
}

// Helper to determine if an operation belongs to Linked List module
const isLinkedListOp = (op: DSAOperation): op is LinkedListOperation =>
  typeof op === 'string' && op.startsWith('LL_');

const isStackOp = (op: DSAOperation): op is StackOperation =>
  typeof op === 'string' && op.startsWith('Stack_');

export interface WorkspaceEngineReturn {
  steps: WorkspaceStep[];
  currentStep: number;
  activeStep: WorkspaceStep | null;
  isPlaying: boolean;
  speed: number;
  totalSteps: number;
  code: string;
  visualMode: VisualizationMode;
  setVisualMode: (mode: VisualizationMode) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  jumpTo: (step: number) => void;
  setSpeed: (speed: number) => void;
  regenerate: (arr: number[], params: AlgorithmParams) => void;
}

const SPEED_DELAYS: Record<number, number> = {
  0.25: 3000,
  0.5: 2000,
  1: 1200,
  1.5: 800,
  2: 500,
  4: 200,
};

export function useWorkspaceEngine({
  operation,
  array,
  params,
  language,
}: UseWorkspaceEngineProps): WorkspaceEngineReturn {
  const [steps, setSteps] = useState<WorkspaceStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [code, setCode] = useState('');
  const [visualMode, setVisualMode] = useState<VisualizationMode>('boxes');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unified step generator — dispatches to correct module
  const _generateSteps = useCallback((op: DSAOperation, arr: number[], p: AlgorithmParams): WorkspaceStep[] => {
    if (isLinkedListOp(op)) return generateLinkedListSteps(op, arr, p);
    if (isStackOp(op)) return generateStackSteps(op, arr, p);
    return generateSteps(op as never, arr, p);
  }, []);

  // Unified code template getter
  const _getCodeTemplate = useCallback((op: DSAOperation, lang: SupportedLanguage): string => {
    if (isLinkedListOp(op)) return getLinkedListCodeTemplate(op, lang);
    if (isStackOp(op)) return getStackCodeTemplate(op, lang);
    return getCodeTemplate(op as never, lang);
  }, []);

  // Generate steps when operation or array changes
  const regenerate = useCallback((arr: number[], p: AlgorithmParams) => {
    const newSteps = _generateSteps(operation, arr, p);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [operation, _generateSteps]);

  const arrayKey = array.join(',');
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    const newSteps = _generateSteps(operation, array, params);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [operation, arrayKey, paramsKey, _generateSteps]);

  // Update code when language or operation changes
  useEffect(() => {
    setCode(_getCodeTemplate(operation, language));
  }, [operation, language, _getCodeTemplate]);

  // Auto-playback
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const delay = SPEED_DELAYS[speed] ?? 1200;
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, delay);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, speed, steps.length]);

  const play = useCallback(() => {
    if (currentStep < steps.length - 1) setIsPlaying(true);
    else { setCurrentStep(0); setIsPlaying(true); }
  }, [currentStep, steps.length]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => (isPlaying ? pause() : play()), [isPlaying, pause, play]);
  const nextStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(p => Math.min(p + 1, steps.length - 1));
  }, [steps.length]);
  const prevStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(p => Math.max(p - 1, 0));
  }, []);
  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);
  const jumpTo = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setIsPlaying(false);
      setCurrentStep(step);
    }
  }, [steps.length]);

  return {
    steps,
    currentStep,
    activeStep: steps[currentStep] ?? null,
    isPlaying,
    speed,
    totalSteps: steps.length,
    code,
    visualMode,
    setVisualMode,
    play,
    pause,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    jumpTo,
    setSpeed,
    regenerate,
  };
}
