import type { WorkspaceStep } from '../../types/workspace.types';

export function generateInsertionSteps(
  arr: number[],
  insertIndex: number,
  insertValue: number
): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];
  const safeIndex = Math.max(0, Math.min(insertIndex, arr.length));
  const safeValue = insertValue;

  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { index: safeIndex, value: safeValue, length: arr.length },
    explanation: `Inserting value ${safeValue} at index ${safeIndex}. Array length = ${arr.length}. We must shift elements to make room.`,
    codeLine: 0,
    phase: 'idle',
  });

  // Show which index we're inserting at
  steps.push({
    arrayState: [...arr],
    currentIndexes: [safeIndex],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { index: safeIndex, value: safeValue, length: arr.length },
    explanation: `Target position is index ${safeIndex}. All elements from this index onward must shift right by one.`,
    codeLine: 2,
    phase: 'traverse',
  });

  // Animate shifting
  const shifting = [...arr];
  for (let i = arr.length - 1; i >= safeIndex; i--) {
    steps.push({
      arrayState: [...shifting, 0].map((v, idx) => idx === i + 1 ? shifting[i] : (idx === i && i >= safeIndex ? shifting[i] : v)),
      currentIndexes: [i + 1],
      activeIndexes: [i],
      sortedIndexes: Array.from({ length: arr.length - 1 - i }, (_, k) => arr.length - k).filter(x => x <= arr.length),
      variables: { i, value: arr[i], shifting: `arr[${i}] → arr[${i + 1}]` },
      explanation: `Shifting element ${arr[i]} from index ${i} to index ${i + 1}.`,
      codeLine: 4,
      phase: 'insert',
    });
  }

  // Insert the new element
  const result = [...arr];
  result.splice(safeIndex, 0, safeValue);

  steps.push({
    arrayState: result,
    currentIndexes: [safeIndex],
    activeIndexes: [safeIndex],
    sortedIndexes: [],
    variables: { index: safeIndex, value: safeValue, length: result.length },
    explanation: `Inserted ${safeValue} at index ${safeIndex}. Array length is now ${result.length}.`,
    codeLine: 7,
    phase: 'done',
  });

  return steps;
}

export const insertionCodeTemplates = {
  javascript: `function insert(arr, index, value) {
  const n = arr.length;
  arr.push(0); // Expand array
  for (let i = n; i > index; i--) {
    arr[i] = arr[i - 1]; // Shift right
  }
  arr[index] = value; // Place value
  return arr;
}`,
  python: `def insert(arr, index, value):
    arr.append(0)  # Expand array
    n = len(arr)
    for i in range(n - 1, index, -1):
        arr[i] = arr[i - 1]  # Shift right
    arr[index] = value  # Place value
    return arr`,
  cpp: `void insert(int arr[], int &n, int index, int value) {
    n++; // Expand size
    for (int i = n - 1; i > index; i--) {
        arr[i] = arr[i - 1]; // Shift right
    }
    arr[index] = value; // Place value
}`,
  java: `void insert(int[] arr, int n, int index, int value) {
    for (int i = n; i > index; i--) {
        arr[i] = arr[i - 1]; // Shift right
    }
    arr[index] = value; // Place value
}`,
  c: `void insert(int arr[], int *n, int index, int value) {
    (*n)++;
    for (int i = *n - 1; i > index; i--) {
        arr[i] = arr[i - 1]; /* Shift right */
    }
    arr[index] = value; /* Place value */
}`,
};
