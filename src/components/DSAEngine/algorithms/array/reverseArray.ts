import type { WorkspaceStep } from '../../types/workspace.types';

// Two-pointer reverse — distinct from the existing "Reverse" operation
// so both can coexist in the registry without conflict.
export function generateReverseArraySteps(arr: number[]): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];
  const a = [...arr];

  // Initial state
  steps.push({
    arrayState: [...a],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { left: 0, right: a.length - 1, swapCount: 0 },
    explanation: `Start: array has ${a.length} elements. We place LEFT pointer at index 0 and RIGHT pointer at index ${a.length - 1}.`,
    codeLine: 0,
    phase: 'idle',
  });

  let left = 0;
  let right = a.length - 1;
  let swapCount = 0;

  while (left < right) {
    // Highlight both pointers before swap
    steps.push({
      arrayState: [...a],
      currentIndexes: [left, right],
      activeIndexes: [],
      sortedIndexes: [],
      variables: { left, right, 'arr[left]': a[left], 'arr[right]': a[right], swapCount },
      explanation: `LEFT=${left} (${a[left]}), RIGHT=${right} (${a[right]}). Values are different — swap them.`,
      codeLine: 3,
      phase: 'compare',
    });

    // Perform swap
    const temp = a[left];
    a[left] = a[right];
    a[right] = temp;
    swapCount++;

    steps.push({
      arrayState: [...a],
      currentIndexes: [],
      activeIndexes: [left, right],
      sortedIndexes: [],
      variables: { left, right, temp, 'arr[left]': a[left], 'arr[right]': a[right], swapCount },
      explanation: `Swapped! arr[${left}]=${a[left]}, arr[${right}]=${a[right]}. Swap #${swapCount} complete.`,
      codeLine: 5,
      phase: 'swap',
    });

    left++;
    right--;

    if (left < right) {
      steps.push({
        arrayState: [...a],
        currentIndexes: [left, right],
        activeIndexes: [],
        sortedIndexes: [],
        variables: { left, right, swapCount },
        explanation: `Move pointers inward → LEFT=${left}, RIGHT=${right}. Continue swapping.`,
        codeLine: 7,
        phase: 'traverse',
      });
    }
  }

  // Final
  steps.push({
    arrayState: [...a],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: a.length }, (_, i) => i),
    variables: { left, right, swapCount, result: `[${a.join(', ')}]` },
    explanation: `Array fully reversed in ${swapCount} swaps! LEFT=${left} >= RIGHT=${right}, so we stop.`,
    codeLine: 9,
    phase: 'done',
  });

  return steps;
}

export const reverseArrayCodeTemplates = {
  javascript: `function reverseArray(arr) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    // Compare and swap
    let temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    // Move pointers inward
    left++;
    right--;
  }
  return arr;
}`,
  python: `def reverse_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        # Swap elements
        arr[left], arr[right] = arr[right], arr[left]
        # Move pointers inward
        left += 1
        right -= 1
    return arr`,
  cpp: `void reverseArray(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        // Swap
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        // Move inward
        left++;
        right--;
    }
}`,
  java: `void reverseArray(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}`,
  c: `void reverseArray(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}`,
};
