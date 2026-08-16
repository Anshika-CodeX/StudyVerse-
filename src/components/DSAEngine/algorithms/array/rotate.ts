import type { WorkspaceStep } from '../../types/workspace.types';

export function generateRotateSteps(arr: number[], rotateBy: number): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];
  const n = arr.length;
  const k = ((rotateBy % n) + n) % n; // normalize
  let working = [...arr];

  steps.push({
    arrayState: [...working],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { rotateBy: k, n },
    explanation: `Left rotate by ${k}. Strategy: reverse the full array, then reverse the two halves separately.`,
    codeLine: 0,
    phase: 'idle',
  });

  // Helper: generate steps for reversing a sub-array
  const reverseSubArray = (arr: number[], start: number, end: number, label: string) => {
    let l = start;
    let r = end;
    while (l < r) {
      steps.push({
        arrayState: [...arr],
        currentIndexes: [l, r],
        activeIndexes: [l, r],
        sortedIndexes: [],
        variables: { l, r, phase: label },
        explanation: `${label}: Swapping arr[${l}]=${arr[l]} with arr[${r}]=${arr[r]}.`,
        codeLine: label === 'Step 1: Reverse all' ? 3 : label.includes('first') ? 6 : 9,
        phase: 'swap',
      });

      const tmp = arr[l];
      arr[l] = arr[r];
      arr[r] = tmp;
      l++;
      r--;
    }
  };

  // Step 1: reverse all
  reverseSubArray(working, 0, n - 1, 'Step 1: Reverse all');
  steps.push({
    arrayState: [...working],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { afterStep: 1 },
    explanation: `After reversing entire array: [${working.join(', ')}]. Now reverse first (n-k) elements.`,
    codeLine: 4,
    phase: 'traverse',
  });

  // Step 2: reverse first (n-k)
  reverseSubArray(working, 0, n - k - 1, 'Step 2: Reverse first (n-k)');
  steps.push({
    arrayState: [...working],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { afterStep: 2 },
    explanation: `After reversing first ${n - k} elements. Now reverse last k=${k} elements.`,
    codeLine: 7,
    phase: 'traverse',
  });

  // Step 3: reverse last k
  reverseSubArray(working, n - k, n - 1, 'Step 3: Reverse last k');

  steps.push({
    arrayState: [...working],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: n }, (_, i) => i),
    variables: { result: working.join(', '), rotateBy: k, done: true },
    explanation: `Rotation complete! Array left-rotated by ${k}: [${working.join(', ')}].`,
    codeLine: 10,
    phase: 'done',
  });

  return steps;
}

export const rotateCodeTemplates = {
  javascript: `function rotateLeft(arr, k) {
  const n = arr.length;
  k = ((k % n) + n) % n; // Normalize k
  // Three-step reversal algorithm
  reverse(arr, 0, n - 1);      // Reverse all
  reverse(arr, 0, n - k - 1);  // Reverse first n-k
  reverse(arr, n - k, n - 1);  // Reverse last k
  // Rotation complete
  return arr;
}
function reverse(arr, l, r) {
  while (l < r) { [arr[l++], arr[r--]] = [arr[r], arr[l]]; }
}`,
  python: `def rotate_left(arr, k):
    n = len(arr)
    k = k % n  # Normalize k
    # Three-step reversal algorithm
    arr[:] = arr[::-1]          # Reverse all
    arr[:n-k] = arr[:n-k][::-1]  # Reverse first n-k
    arr[n-k:] = arr[n-k:][::-1]  # Reverse last k
    return arr`,
  cpp: `void rotateLeft(int arr[], int n, int k) {
    k = k % n; // Normalize k
    reverse(arr, 0, n - 1);     // Reverse all
    reverse(arr, 0, n - k - 1); // Reverse first n-k
    reverse(arr, n - k, n - 1); // Reverse last k
}`,
  java: `void rotateLeft(int[] arr, int k) {
    int n = arr.length;
    k = k % n; // Normalize k
    reverse(arr, 0, n - 1);     // Reverse all
    reverse(arr, 0, n - k - 1); // Reverse first n-k
    reverse(arr, n - k, n - 1); // Reverse last k
}`,
  c: `void rotateLeft(int arr[], int n, int k) {
    k = k % n; /* Normalize k */
    reverse(arr, 0, n - 1);     /* Reverse all */
    reverse(arr, 0, n - k - 1); /* Reverse first n-k */
    reverse(arr, n - k, n - 1); /* Reverse last k */
}`,
};
