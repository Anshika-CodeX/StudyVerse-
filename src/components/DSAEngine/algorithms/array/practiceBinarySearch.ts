import type { WorkspaceStep } from '../../types/workspace.types';

export function generatePracticeBinarySearchSteps(arr: number[], target: number): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];

  // Check if sorted
  let isSorted = true;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      isSorted = false;
      break;
    }
  }

  if (!isSorted) {
    steps.push({
      arrayState: [...arr],
      currentIndexes: [],
      activeIndexes: [],
      sortedIndexes: [],
      variables: { target, error: 'Array Not Sorted' },
      explanation: `Validation Error: Binary Search requires a sorted array. Please enter an array sorted in ascending order (e.g. 1 3 5 7 9 11 13).`,
      codeLine: 0,
      phase: 'not_found',
    });
    return steps;
  }

  let left = 0;
  let right = arr.length - 1;
  let foundIndex = -1;

  steps.push({
    arrayState: [...arr],
    currentIndexes: [left, right],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { left, right, target },
    explanation: `Binary Search start: Searching for ${target}. Range is index ${left} to ${right}.`,
    codeLine: 0,
    phase: 'idle',
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = arr[mid];
    const rangeIndexes = Array.from({ length: right - left + 1 }, (_, k) => left + k);

    steps.push({
      arrayState: [...arr],
      currentIndexes: [left, right],
      activeIndexes: [mid],
      sortedIndexes: rangeIndexes,
      variables: { left, mid, right, 'arr[mid]': midVal, target },
      explanation: `Calculate mid = floor((${left} + ${right}) / 2) = ${mid}. arr[mid] = ${midVal}.`,
      codeLine: 3,
      phase: 'compare',
    });

    if (midVal === target) {
      foundIndex = mid;
      steps.push({
        arrayState: [...arr],
        currentIndexes: [],
        activeIndexes: [mid],
        sortedIndexes: [mid],
        variables: { left, mid, right, 'arr[mid]': midVal, target, foundIndex: mid },
        explanation: `arr[mid] (${midVal}) === target (${target}). Target found at index ${mid}!`,
        codeLine: 4,
        phase: 'found',
      });
      break;
    } else if (midVal < target) {
      steps.push({
        arrayState: [...arr],
        currentIndexes: [left, right],
        activeIndexes: [mid],
        sortedIndexes: rangeIndexes,
        variables: { left, mid, right, 'arr[mid]': midVal, target },
        explanation: `arr[mid] (${midVal}) < target (${target}). Search RIGHT half. New left = ${mid + 1}.`,
        codeLine: 6,
        phase: 'traverse',
      });
      left = mid + 1;
    } else {
      steps.push({
        arrayState: [...arr],
        currentIndexes: [left, right],
        activeIndexes: [mid],
        sortedIndexes: rangeIndexes,
        variables: { left, mid, right, 'arr[mid]': midVal, target },
        explanation: `arr[mid] (${midVal}) > target (${target}). Search LEFT half. New right = ${mid - 1}.`,
        codeLine: 8,
        phase: 'traverse',
      });
      right = mid - 1;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      arrayState: [...arr],
      currentIndexes: [],
      activeIndexes: [],
      sortedIndexes: [],
      variables: { left, right, target, foundIndex: -1 },
      explanation: `Target ${target} is not present in the array. Return -1.`,
      codeLine: 11,
      phase: 'not_found',
    });
  }

  return steps;
}

export const practiceBinarySearchCodeTemplates = {
  javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid; // Found at index mid
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  return -1; // Not found
}`,
  python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid  # Found
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    return -1  # Not found`,
  cpp: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  java: `int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  c: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
};
