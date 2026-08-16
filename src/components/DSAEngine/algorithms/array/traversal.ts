import type { WorkspaceStep } from '../../types/workspace.types';

export function generateTraversalSteps(arr: number[]): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];

  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { i: -1, length: arr.length },
    explanation: `Array traversal starts. We will visit each element from index 0 to ${arr.length - 1}.`,
    codeLine: 0,
    phase: 'idle',
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      arrayState: [...arr],
      currentIndexes: [i],
      activeIndexes: [],
      sortedIndexes: Array.from({ length: i }, (_, k) => k),
      variables: { i, value: arr[i], length: arr.length },
      explanation: `Step ${i + 1}: Visiting index ${i}. Element = ${arr[i]}.`,
      codeLine: 3,
      phase: 'traverse',
    });
  }

  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: arr.length }, (_, k) => k),
    variables: { i: arr.length, length: arr.length },
    explanation: `Traversal complete! All ${arr.length} elements visited.`,
    codeLine: 5,
    phase: 'done',
  });

  return steps;
}

export const traversalCodeTemplates = {
  javascript: `function traverse(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    console.log(arr[i]);  // Visit element
  }
  // Traversal complete
}`,
  python: `def traverse(arr):
    n = len(arr)
    for i in range(n):
        print(arr[i])  # Visit element
    # Traversal complete`,
  cpp: `void traverse(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";  // Visit element
    }
    // Traversal complete
}`,
  java: `void traverse(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        System.out.print(arr[i] + " ");  // Visit element
    }
    // Traversal complete
}`,
  c: `void traverse(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);  /* Visit element */
    }
    /* Traversal complete */
}`,
};
