import type { WorkspaceStep } from '../../types/workspace.types';

export function generateDeletionSteps(arr: number[], deleteIndex: number): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];
  const safeIndex = Math.max(0, Math.min(deleteIndex, arr.length - 1));
  const deletedValue = arr[safeIndex];

  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { index: safeIndex, length: arr.length },
    explanation: `Deleting element at index ${safeIndex}. Current value = ${deletedValue}. Elements after it will shift left.`,
    codeLine: 0,
    phase: 'idle',
  });

  // Highlight target
  steps.push({
    arrayState: [...arr],
    currentIndexes: [safeIndex],
    activeIndexes: [safeIndex],
    sortedIndexes: [],
    variables: { index: safeIndex, value: deletedValue },
    explanation: `Found element ${deletedValue} at index ${safeIndex}. Marking for deletion.`,
    codeLine: 2,
    phase: 'traverse',
  });

  // Animate shifting left
  const shifting = [...arr];
  for (let i = safeIndex; i < arr.length - 1; i++) {
    const intermediate = [...shifting];
    intermediate[i] = shifting[i + 1];
    steps.push({
      arrayState: [...intermediate.slice(0, arr.length - 1), intermediate[arr.length - 1]],
      currentIndexes: [i],
      activeIndexes: [i + 1],
      sortedIndexes: Array.from({ length: i - safeIndex }, (_, k) => safeIndex + k),
      variables: { i, value: arr[i + 1], shifting: `arr[${i + 1}] → arr[${i}]` },
      explanation: `Shifting element ${arr[i + 1]} from index ${i + 1} to index ${i}.`,
      codeLine: 4,
      phase: 'delete',
    });
    shifting[i] = shifting[i + 1];
  }

  const result = [...arr];
  result.splice(safeIndex, 1);

  steps.push({
    arrayState: result,
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: result.length }, (_, k) => k),
    variables: { deletedValue, newLength: result.length },
    explanation: `Deletion complete. ${deletedValue} removed from index ${safeIndex}. Array length is now ${result.length}.`,
    codeLine: 7,
    phase: 'done',
  });

  return steps;
}

export const deletionCodeTemplates = {
  javascript: `function deleteAt(arr, index) {
  const n = arr.length;
  const deleted = arr[index]; // Save deleted value
  for (let i = index; i < n - 1; i++) {
    arr[i] = arr[i + 1]; // Shift left
  }
  arr.pop(); // Remove last
  return arr;
}`,
  python: `def delete_at(arr, index):
    deleted = arr[index]  # Save deleted value
    for i in range(index, len(arr) - 1):
        arr[i] = arr[i + 1]  # Shift left
    arr.pop()  # Remove last
    return arr`,
  cpp: `void deleteAt(int arr[], int &n, int index) {
    int deleted = arr[index]; // Save deleted value
    for (int i = index; i < n - 1; i++) {
        arr[i] = arr[i + 1]; // Shift left
    }
    n--; // Reduce size
}`,
  java: `void deleteAt(int[] arr, int n, int index) {
    int deleted = arr[index]; // Save deleted value
    for (int i = index; i < n - 1; i++) {
        arr[i] = arr[i + 1]; // Shift left
    }
    // n-- in calling code
}`,
  c: `void deleteAt(int arr[], int *n, int index) {
    int deleted = arr[index]; /* Save deleted value */
    for (int i = index; i < *n - 1; i++) {
        arr[i] = arr[i + 1]; /* Shift left */
    }
    (*n)--; /* Reduce size */
}`,
};
