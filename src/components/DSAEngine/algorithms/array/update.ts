import type { WorkspaceStep } from '../../types/workspace.types';

export function generateUpdateSteps(
  arr: number[],
  updateIndex: number,
  updateValue: number
): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];
  const safeIndex = Math.max(0, Math.min(updateIndex, arr.length - 1));
  const oldValue = arr[safeIndex];

  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { index: safeIndex, oldValue, newValue: updateValue },
    explanation: `Updating element at index ${safeIndex} from ${oldValue} to ${updateValue}. Direct access — O(1) operation.`,
    codeLine: 0,
    phase: 'idle',
  });

  steps.push({
    arrayState: [...arr],
    currentIndexes: [safeIndex],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { index: safeIndex, oldValue, newValue: updateValue },
    explanation: `Accessing index ${safeIndex} directly. Arrays support O(1) random access via base address + offset.`,
    codeLine: 1,
    phase: 'traverse',
  });

  steps.push({
    arrayState: [...arr],
    currentIndexes: [safeIndex],
    activeIndexes: [safeIndex],
    sortedIndexes: [],
    variables: { index: safeIndex, oldValue, newValue: updateValue, updating: true },
    explanation: `Old value: ${oldValue}. Replacing with ${updateValue}...`,
    codeLine: 2,
    phase: 'update',
  });

  const result = [...arr];
  result[safeIndex] = updateValue;

  steps.push({
    arrayState: result,
    currentIndexes: [],
    activeIndexes: [safeIndex],
    sortedIndexes: [safeIndex],
    variables: { index: safeIndex, oldValue, newValue: updateValue, done: true },
    explanation: `Update complete. arr[${safeIndex}] is now ${updateValue}. Time Complexity: O(1).`,
    codeLine: 3,
    phase: 'done',
  });

  return steps;
}

export const updateCodeTemplates = {
  javascript: `function update(arr, index, value) {
  const oldValue = arr[index]; // Access O(1)
  arr[index] = value;          // Update O(1)
  return arr;
}`,
  python: `def update(arr, index, value):
    old_value = arr[index]  # Access O(1)
    arr[index] = value      # Update O(1)
    return arr`,
  cpp: `void update(int arr[], int index, int value) {
    int oldValue = arr[index]; // Access O(1)
    arr[index] = value;        // Update O(1)
}`,
  java: `void update(int[] arr, int index, int value) {
    int oldValue = arr[index]; // Access O(1)
    arr[index] = value;        // Update O(1)
}`,
  c: `void update(int arr[], int index, int value) {
    int oldValue = arr[index]; /* Access O(1) */
    arr[index] = value;        /* Update O(1) */
}`,
};
