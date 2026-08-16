import type { WorkspaceStep } from '../../types/workspace.types';

export function generateFindMaxSteps(arr: number[]): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];

  // Initial
  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { i: -1, currentMax: '—', length: arr.length },
    explanation: `Find Maximum: We scan all ${arr.length} elements and track the largest seen so far.`,
    codeLine: 0,
    phase: 'idle',
  });

  let currentMax = arr[0];
  let maxIdx = 0;

  // Initialise with first element
  steps.push({
    arrayState: [...arr],
    currentIndexes: [0],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { i: 0, 'arr[i]': arr[0], currentMax: arr[0] },
    explanation: `Initialize: currentMax = arr[0] = ${arr[0]}. Start scanning from index 1.`,
    codeLine: 1,
    phase: 'traverse',
  });

  for (let i = 1; i < arr.length; i++) {
    const isNewMax = arr[i] > currentMax;

    steps.push({
      arrayState: [...arr],
      currentIndexes: [i],
      activeIndexes: isNewMax ? [i, maxIdx] : [],
      sortedIndexes: [maxIdx],
      variables: { i, 'arr[i]': arr[i], currentMax, comparing: `${arr[i]} > ${currentMax}?` },
      explanation: isNewMax
        ? `Index ${i}: ${arr[i]} > ${currentMax}. NEW MAXIMUM FOUND!`
        : `Index ${i}: ${arr[i]} ≤ ${currentMax}. currentMax stays ${currentMax}.`,
      codeLine: isNewMax ? 3 : 4,
      phase: isNewMax ? 'found' : 'compare',
    });

    if (isNewMax) {
      currentMax = arr[i];
      maxIdx = i;

      steps.push({
        arrayState: [...arr],
        currentIndexes: [],
        activeIndexes: [maxIdx],
        sortedIndexes: [maxIdx],
        variables: { i, currentMax, 'maxIndex': maxIdx },
        explanation: `Updated: currentMax = ${currentMax} (at index ${maxIdx}).`,
        codeLine: 3,
        phase: 'update',
      });
    }
  }

  // Final
  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [maxIdx],
    variables: { currentMax, 'maxIndex': maxIdx, result: currentMax },
    explanation: `Done! Maximum element = ${currentMax} at index ${maxIdx}.`,
    codeLine: 6,
    phase: 'done',
  });

  return steps;
}

export const findMaxCodeTemplates = {
  javascript: `function findMax(arr) {
  let currentMax = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > currentMax) {
      currentMax = arr[i]; // New max found
    }
  }
  return currentMax;
}`,
  python: `def find_max(arr):
    current_max = arr[0]
    for i in range(1, len(arr)):
        if arr[i] > current_max:
            current_max = arr[i]  # New max
    return current_max`,
  cpp: `int findMax(int arr[], int n) {
    int currentMax = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > currentMax) {
            currentMax = arr[i]; // New max
        }
    }
    return currentMax;
}`,
  java: `int findMax(int[] arr) {
    int currentMax = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > currentMax) {
            currentMax = arr[i];
        }
    }
    return currentMax;
}`,
  c: `int findMax(int arr[], int n) {
    int currentMax = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > currentMax) {
            currentMax = arr[i];
        }
    }
    return currentMax;
}`,
};
