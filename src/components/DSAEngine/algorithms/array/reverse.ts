import type { WorkspaceStep } from '../../types/workspace.types';

export function generateReverseSteps(arr: number[]): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];
  const working = [...arr];
  let left = 0;
  let right = arr.length - 1;

  steps.push({
    arrayState: [...working],
    currentIndexes: [left, right],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { left, right },
    explanation: `Two-pointer reverse. Initialize left = 0, right = ${right}. Pointers move inward, swapping as they go.`,
    codeLine: 1,
    phase: 'idle',
  });

  while (left < right) {
    // Highlight the pair to swap
    steps.push({
      arrayState: [...working],
      currentIndexes: [left, right],
      activeIndexes: [left, right],
      sortedIndexes: [],
      variables: { left, right, leftVal: working[left], rightVal: working[right] },
      explanation: `left = ${left}, right = ${right}. Comparing arr[${left}]=${working[left]} and arr[${right}]=${working[right]}. Will swap.`,
      codeLine: 3,
      phase: 'compare',
    });

    // Swap
    const temp = working[left];
    working[left] = working[right];
    working[right] = temp;

    steps.push({
      arrayState: [...working],
      currentIndexes: [left, right],
      activeIndexes: [left, right],
      sortedIndexes: Array.from({ length: left }, (_, k) => k).concat(Array.from({ length: arr.length - right }, (_, k) => right + k)),
      variables: { left, right, swapped: `${working[left]} ↔ ${working[right]}` },
      explanation: `Swapped! arr[${left}] = ${working[left]}, arr[${right}] = ${working[right]}.`,
      codeLine: 5,
      phase: 'swap',
    });

    left++;
    right--;

    if (left <= right) {
      steps.push({
        arrayState: [...working],
        currentIndexes: [left, right],
        activeIndexes: [],
        sortedIndexes: Array.from({ length: left }, (_, k) => k).concat(Array.from({ length: arr.length - right - 1 }, (_, k) => right + 1 + k)),
        variables: { left, right },
        explanation: `Move pointers inward. left → ${left}, right → ${right}.`,
        codeLine: 7,
        phase: 'traverse',
      });
    }
  }

  steps.push({
    arrayState: [...working],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: working.length }, (_, k) => k),
    variables: { left, right, done: true },
    explanation: `Pointers crossed! Reverse complete. Array is now [${working.join(', ')}].`,
    codeLine: 9,
    phase: 'done',
  });

  return steps;
}

export const reverseCodeTemplates = {
  javascript: `function reverse(arr) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    // Swap arr[left] and arr[right]
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;  // Move pointers inward
    right--;
  }
  // Reverse complete
  return arr;
}`,
  python: `def reverse(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        # Swap arr[left] and arr[right]
        arr[left], arr[right] = arr[right], arr[left]
        left += 1   # Move pointers inward
        right -= 1
    # Reverse complete
    return arr`,
  cpp: `void reverse(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        // Swap arr[left] and arr[right]
        swap(arr[left], arr[right]);
        left++;  // Move pointers inward
        right--;
    }
    // Reverse complete
}`,
  java: `void reverse(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        // Swap arr[left] and arr[right]
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;  // Move pointers inward
        right--;
    }
}`,
  c: `void reverse(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        int temp = arr[left]; /* Swap */
        arr[left] = arr[right];
        arr[right] = temp;
        left++;  right--; /* Inward */
    }
}`,
};
