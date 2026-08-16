import { useMemo } from 'react';
import type { WorkspaceStep, DebuggerState } from '../types/workspace.types';

export function useDebugger(steps: WorkspaceStep[], currentStep: number): DebuggerState {
  return useMemo((): DebuggerState => {
    if (!steps.length) {
      return {
        variables: {},
        currentLine: 0,
        executionHistory: [],
        phase: 'idle',
      };
    }

    const active = steps[currentStep];
    return {
      variables: active?.variables ?? {},
      currentLine: active?.codeLine ?? 0,
      executionHistory: steps.slice(0, currentStep + 1),
      phase: active?.phase ?? 'idle',
    };
  }, [steps, currentStep]);
}
