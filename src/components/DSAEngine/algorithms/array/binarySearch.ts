import type { WorkspaceStep } from '../../types/workspace.types';

export function generateBinarySearchSteps(arr: number[], target: number): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];
  const sorted = [...arr].sort((a, b) => a - b);
  let left = 0;
  let right = sorted.length - 1;

  steps.push({
    arrayState: [...sorted],
    currentIndexes: [left, right],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: sorted.length }, (_, k) => k),
    variables: { left, right, target },
    explanation: `Binary Search requires a SORTED array. Array: [${sorted.join(', ')}]. Searching for ${target}.`,
    codeLine: 0,
    phase: 'idle',
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      arrayState: [...sorted],
      currentIndexes: [left, right],
      activeIndexes: [mid],
      sortedIndexes: Array.from({ length: sorted.length }, (_, k) => k),
      pivotIndex: mid,
      variables: { left, right, mid, midValue: sorted[mid], target },
      explanation: `mid = (${left} + ${right}) / 2 = ${mid}. Checking arr[${mid}] = ${sorted[mid]} vs target = ${target}.`,
      codeLine: 3,
      phase: 'compare',
    });

    if (sorted[mid] === target) {
      steps.push({
        arrayState: [...sorted],
        currentIndexes: [mid],
        activeIndexes: [mid],
        sortedIndexes: Array.from({ length: sorted.length }, (_, k) => k),
        variables: { left, right, mid, found: true, foundAt: mid },
        explanation: `✓ Found! arr[${mid}] = ${target}. Eliminated ${sorted.length - 1} comparisons. Time: O(log n).`,
        codeLine: 4,
        phase: 'found',
      });
      return steps;
    } else if (sorted[mid] < target) {
      steps.push({
        arrayState: [...sorted],
        currentIndexes: [mid + 1, right],
        activeIndexes: [],
        sortedIndexes: Array.from({ length: sorted.length }, (_, k) => k),
        pivotIndex: mid,
        variables: { left: mid + 1, right, mid, reason: `${sorted[mid]} < ${target}, search right half` },
        explanation: `arr[${mid}]=${sorted[mid]} < target=${target}. Discard left half. Move left to ${mid + 1}.`,
        codeLine: 6,
        phase: 'traverse',
      });
      left = mid + 1;
    } else {
      steps.push({
        arrayState: [...sorted],
        currentIndexes: [left, mid - 1],
        activeIndexes: [],
        sortedIndexes: Array.from({ length: sorted.length }, (_, k) => k),
        pivotIndex: mid,
        variables: { left, right: mid - 1, mid, reason: `${sorted[mid]} > ${target}, search left half` },
        explanation: `arr[${mid}]=${sorted[mid]} > target=${target}. Discard right half. Move right to ${mid - 1}.`,
        codeLine: 8,
        phase: 'traverse',
      });
      right = mid - 1;
    }
  }

  steps.push({
    arrayState: [...sorted],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: sorted.length }, (_, k) => k),
    variables: { target, found: false, result: -1 },
    explanation: `✗ Not found. left (${left}) > right (${right}). ${target} is not in the array. Returns -1.`,
    codeLine: 11,
    phase: 'not_found',
  });

  return steps;
}

export const binarySearchCodeTemplates = {
  javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid; // Found
    else if (arr[mid] < target) left = mid + 1; // Search right
    else right = mid - 1;                         // Search left
  }
  return -1; // Not found
}`,
  python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target: return mid  # Found
        elif arr[mid] < target: left = mid + 1  # Right half
        else: right = mid - 1               # Left half
    return -1  # Not found`,
  cpp: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid; // Found
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Not found
}`,
  java: `int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid; // Found
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Not found
}`,
  c: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid; /* Found */
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; /* Not found */
}`,
};
