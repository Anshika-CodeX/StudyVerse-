import type { WorkspaceStep } from '../../types/workspace.types';

// Dedicated "practice" linear search — same algorithm as the engine's
// linearSearch but presented as a self-contained problem with its own
// code templates and tutorial steps.
export function generatePracticeLinearSearchSteps(arr: number[], target: number): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];

  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { target, foundIndex: -1, i: -1 },
    explanation: `Linear Search: Look for target ${target} in [${arr.join(', ')}]. Compare each element one by one.`,
    codeLine: 0,
    phase: 'idle',
  });

  let foundIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    const isMatch = arr[i] === target;

    steps.push({
      arrayState: [...arr],
      currentIndexes: [i],
      activeIndexes: isMatch ? [i] : [],
      sortedIndexes: Array.from({ length: i }, (_, k) => k),
      variables: { i, 'arr[i]': arr[i], target, match: isMatch ? 'YES ✓' : 'NO' },
      explanation: isMatch
        ? `Index ${i}: arr[${i}] = ${arr[i]} === ${target}. MATCH FOUND!`
        : `Index ${i}: arr[${i}] = ${arr[i]} ≠ ${target}. Not a match, continue.`,
      codeLine: isMatch ? 3 : 2,
      phase: isMatch ? 'found' : 'compare',
    });

    if (isMatch) {
      foundIndex = i;
      break;
    }
  }

  // Final step
  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: foundIndex >= 0 ? [foundIndex] : [],
    sortedIndexes: foundIndex >= 0 ? [foundIndex] : Array.from({ length: arr.length }, (_, k) => k),
    variables: { target, foundIndex, result: foundIndex >= 0 ? `Found at index ${foundIndex}` : 'Not Found' },
    explanation: foundIndex >= 0
      ? `Search complete! ${target} found at index ${foundIndex}.`
      : `Search complete! ${target} was NOT found in the array. Return -1.`,
    codeLine: foundIndex >= 0 ? 4 : 6,
    phase: foundIndex >= 0 ? 'found' : 'not_found',
  });

  return steps;
}

export const practiceLinearSearchCodeTemplates = {
  javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`,
  python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Found
    return -1  # Not found`,
  cpp: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Found
        }
    }
    return -1; // Not found
}`,
  java: `int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
  c: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}`,
};
