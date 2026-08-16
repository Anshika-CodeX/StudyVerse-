import type { WorkspaceStep } from '../../types/workspace.types';

export function generateLinearSearchSteps(arr: number[], target: number): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];

  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { target, i: -1, found: false },
    explanation: `Linear Search for target = ${target}. We check every element one by one until found or end of array.`,
    codeLine: 0,
    phase: 'idle',
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      arrayState: [...arr],
      currentIndexes: [i],
      activeIndexes: [],
      sortedIndexes: Array.from({ length: i }, (_, k) => k),
      variables: { i, current: arr[i], target, found: false },
      explanation: `Checking index ${i}: arr[${i}] = ${arr[i]}. Is ${arr[i]} === ${target}?`,
      codeLine: 2,
      phase: 'traverse',
    });

    if (arr[i] === target) {
      steps.push({
        arrayState: [...arr],
        currentIndexes: [i],
        activeIndexes: [i],
        sortedIndexes: [],
        variables: { i, found: true, target, foundAt: i },
        explanation: `✓ Found! arr[${i}] = ${target}. Element found at index ${i}. Time: O(n) worst, O(1) best.`,
        codeLine: 3,
        phase: 'found',
      });
      return steps;
    } else {
      steps.push({
        arrayState: [...arr],
        currentIndexes: [i],
        activeIndexes: [],
        sortedIndexes: Array.from({ length: i + 1 }, (_, k) => k),
        variables: { i, current: arr[i], target, found: false },
        explanation: `${arr[i]} ≠ ${target}. Move to next index.`,
        codeLine: 5,
        phase: 'traverse',
      });
    }
  }

  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: arr.length }, (_, k) => k),
    variables: { target, found: false, result: -1 },
    explanation: `✗ Not found. Searched all ${arr.length} elements. ${target} is not in the array. Returns -1.`,
    codeLine: 8,
    phase: 'not_found',
  });

  return steps;
}

export const linearSearchCodeTemplates = {
  javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) { // Check element
      return i; // Found at index i
    }
    // Not found at i, continue
  }
  return -1; // Not found
}`,
  python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:  # Check element
            return i  # Found at index i
        # Not found at i, continue
    return -1  # Not found`,
  cpp: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) { // Check element
            return i; // Found at index i
        }
        // Not found at i, continue
    }
    return -1; // Not found
}`,
  java: `int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) { // Check element
            return i; // Found at index i
        }
        // Not found at i, continue
    }
    return -1; // Not found
}`,
  c: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) /* Check element */
            return i; /* Found at index i */
        /* Not found at i, continue */
    }
    return -1; /* Not found */
}`,
};
