import type { WorkspaceStep } from '../../types/workspace.types';

export function generateBubbleSortSteps(arr: number[]): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];
  const working = [...arr];
  const n = working.length;
  const sortedIndexes: number[] = [];

  steps.push({
    arrayState: [...working],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { pass: 0, n },
    explanation: `Bubble Sort: Compare adjacent pairs, bubble the largest to the end each pass. ${n} elements → ${n - 1} passes needed.`,
    codeLine: 0,
    phase: 'idle',
  });

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;

    steps.push({
      arrayState: [...working],
      currentIndexes: [],
      activeIndexes: [],
      sortedIndexes: [...sortedIndexes],
      variables: { pass: pass + 1, comparisons: n - pass - 1 },
      explanation: `Pass ${pass + 1}: Bubble the largest unsorted element to position ${n - pass - 1}.`,
      codeLine: 1,
      phase: 'traverse',
    });

    for (let j = 0; j < n - pass - 1; j++) {
      // Compare step
      steps.push({
        arrayState: [...working],
        currentIndexes: [j, j + 1],
        activeIndexes: [j, j + 1],
        sortedIndexes: [...sortedIndexes],
        variables: { pass: pass + 1, j, comparing: `arr[${j}]=${working[j]} vs arr[${j + 1}]=${working[j + 1]}` },
        explanation: `Comparing arr[${j}]=${working[j]} and arr[${j + 1}]=${working[j + 1]}. Is ${working[j]} > ${working[j + 1]}?`,
        codeLine: 3,
        phase: 'compare',
      });

      if (working[j] > working[j + 1]) {
        const tmp = working[j];
        working[j] = working[j + 1];
        working[j + 1] = tmp;
        swapped = true;

        steps.push({
          arrayState: [...working],
          currentIndexes: [j, j + 1],
          activeIndexes: [j, j + 1],
          sortedIndexes: [...sortedIndexes],
          variables: { pass: pass + 1, j, swapped: `${working[j + 1]} ↔ ${working[j]}` },
          explanation: `Yes! Swapping. arr[${j}] = ${working[j]}, arr[${j + 1}] = ${working[j + 1]}.`,
          codeLine: 5,
          phase: 'swap',
        });
      } else {
        steps.push({
          arrayState: [...working],
          currentIndexes: [j + 1],
          activeIndexes: [],
          sortedIndexes: [...sortedIndexes],
          variables: { pass: pass + 1, j, noSwap: `${working[j]} ≤ ${working[j + 1]}` },
          explanation: `No swap needed. ${working[j]} ≤ ${working[j + 1]}.`,
          codeLine: 6,
          phase: 'compare',
        });
      }
    }

    sortedIndexes.push(n - pass - 1);

    steps.push({
      arrayState: [...working],
      currentIndexes: [],
      activeIndexes: [],
      sortedIndexes: [...sortedIndexes],
      variables: { pass: pass + 1, sortedElement: working[n - pass - 1], sortedAt: n - pass - 1 },
      explanation: `Pass ${pass + 1} complete. ${working[n - pass - 1]} is now in its correct position at index ${n - pass - 1}.`,
      codeLine: 8,
      phase: 'sorted',
    });

    if (!swapped) {
      for (let k = 0; k < n; k++) {
        if (!sortedIndexes.includes(k)) sortedIndexes.push(k);
      }
      steps.push({
        arrayState: [...working],
        currentIndexes: [],
        activeIndexes: [],
        sortedIndexes: [...sortedIndexes],
        variables: { earlyTermination: true },
        explanation: `Optimization: No swaps in this pass → array is already sorted! Early termination.`,
        codeLine: 9,
        phase: 'done',
      });
      return steps;
    }
  }

  sortedIndexes.push(0);
  steps.push({
    arrayState: [...working],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: n }, (_, k) => k),
    variables: { done: true, result: working.join(', ') },
    explanation: `Sort complete! Array is fully sorted: [${working.join(', ')}]. Time: O(n²), Space: O(1).`,
    codeLine: 11,
    phase: 'done',
  });

  return steps;
}

export const bubbleSortCodeTemplates = {
  javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let pass = 0; pass < n - 1; pass++) {
    for (let j = 0; j < n - pass - 1; j++) {
      if (arr[j] > arr[j + 1]) {  // Compare
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
      }
      // No swap needed
    }
    // Element sorted at end
    if (/* no swaps */) break; // Early exit
  }
  return arr;
}`,
  python: `def bubble_sort(arr):
    n = len(arr)
    for pass_ in range(n - 1):
        swapped = False
        for j in range(n - pass_ - 1):
            if arr[j] > arr[j + 1]:  # Compare
                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # Swap
                swapped = True
        if not swapped: break  # Early exit
    return arr`,
  cpp: `void bubbleSort(int arr[], int n) {
    for (int p = 0; p < n - 1; p++) {
        bool swapped = false;
        for (int j = 0; j < n - p - 1; j++) {
            if (arr[j] > arr[j + 1]) { // Compare
                swap(arr[j], arr[j + 1]); // Swap
                swapped = true;
            }
        }
        if (!swapped) break; // Early exit
    }
}`,
  java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int p = 0; p < n - 1; p++) {
        boolean swapped = false;
        for (int j = 0; j < n - p - 1; j++) {
            if (arr[j] > arr[j + 1]) { // Compare
                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
                swapped = true;
            }
        }
        if (!swapped) break; // Early exit
    }
}`,
  c: `void bubbleSort(int arr[], int n) {
    for (int p = 0; p < n - 1; p++) {
        int swapped = 0;
        for (int j = 0; j < n - p - 1; j++) {
            if (arr[j] > arr[j + 1]) { /* Compare */
                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
                swapped = 1;
            }
        }
        if (!swapped) break; /* Early exit */
    }
}`,
};
