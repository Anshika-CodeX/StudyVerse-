import type { ProblemDefinition } from '../../../components/DSAEngine/types/workspace.types';

// ────────────────────────────────────────────────────────────────────────────
// Array Problem Library
// Each entry maps directly to an ArrayOperation step generator.
// Future: Load from backend API or CMS for dynamic problem sets.
// ────────────────────────────────────────────────────────────────────────────
export const ARRAY_PROBLEMS: Record<string, ProblemDefinition> = {
  Traversal: {
    id: 'arr-traversal',
    topic: 'Array',
    operation: 'Traversal',
    title: 'Array Traversal',
    difficulty: 'Easy',
    defaultArray: [5, 3, 8, 1, 2, 9, 4],
    defaultParams: {},
    description: `## Array Traversal\n\nTraversal means visiting every element in the array **exactly once**, from index \`0\` to \`n-1\`.\n\nThis is the most fundamental array operation — the basis for almost every algorithm that works with arrays.\n\n### When to use:\n- Computing sum, max, min\n- Searching for an element\n- Printing or transforming elements\n\n### Key Insight:\nArrays are stored in **contiguous memory**. Traversal is efficient because each next element is exactly one memory slot away — excellent cache locality.`,
    tutorial: [
      'Start at index 0 — the first element of the array.',
      'Read the current element (arr[i]) and process it.',
      'Move the pointer i forward by 1.',
      'Check if i < n (array length). If yes, repeat from step 2.',
      'When i reaches n, traversal is complete.',
    ],
    examples: [
      '**Input:** [5, 3, 8, 1, 2] → **Output (sum):** 19',
      '**Input:** [10, 20, 30] → **Output (print):** 10 20 30',
    ],
    hints: [
      'The index variable i starts at 0 and ends at n-1.',
      'Each iteration takes O(1) time — total O(n).',
      'You can traverse backwards (right to left) by starting at n-1 and decrementing i.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'We visit n elements, each once. No extra memory needed.' },
    testCases: [
      { id: 'tc1', label: 'Example 1', input: { array: [5, 3, 8, 1, 2] }, description: 'Basic traversal' },
      { id: 'tc2', label: 'Example 2', input: { array: [1] }, description: 'Single element' },
      { id: 'tc3', label: 'Example 3', input: { array: [9, 7, 5, 3, 1] }, description: 'Descending order' },
    ],
    codeTemplates: {} as any, // populated from algorithm file
  },

  Insertion: {
    id: 'arr-insertion',
    topic: 'Array',
    operation: 'Insertion',
    title: 'Array Insertion',
    difficulty: 'Easy',
    defaultArray: [5, 3, 8, 1, 2],
    defaultParams: { insertIndex: 2, insertValue: 99 },
    description: `## Array Insertion\n\nInsert a new element at a given index. All existing elements from that position onward must **shift right** to make space.\n\n### Constraint:\nThe array must have enough allocated capacity to hold the new element.\n\n### Key Insight:\nUnlike linked lists, arrays have O(n) insertion (in the worst case) because of the required shifting. Inserting at the end (index n) is O(1) — no shifting needed.`,
    tutorial: [
      'Identify the target index where the new element will be inserted.',
      'Starting from the last element, shift each element one position to the right.',
      'Continue shifting until the target index is cleared.',
      'Place the new value at the target index.',
      'Increment the array size by 1.',
    ],
    examples: [
      '**Insert 99 at index 2:** [5, 3, 8, 1, 2] → [5, 3, 99, 8, 1, 2]',
      '**Insert 0 at index 0:** [1, 2, 3] → [0, 1, 2, 3]',
    ],
    hints: [
      'Always shift from right to left to avoid overwriting data.',
      'Inserting at index 0 is worst case — requires shifting all n elements.',
      'Inserting at index n (end) is O(1) — no shift needed.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'At most n elements must be shifted. No extra space needed.' },
    testCases: [
      { id: 'tc1', label: 'Insert at middle', input: { array: [5, 3, 8, 1, 2], params: { insertIndex: 2, insertValue: 99 } } },
      { id: 'tc2', label: 'Insert at start', input: { array: [1, 2, 3], params: { insertIndex: 0, insertValue: 0 } } },
      { id: 'tc3', label: 'Insert at end', input: { array: [10, 20, 30], params: { insertIndex: 3, insertValue: 40 } } },
    ],
    codeTemplates: {} as any,
  },

  Deletion: {
    id: 'arr-deletion',
    topic: 'Array',
    operation: 'Deletion',
    title: 'Array Deletion',
    difficulty: 'Easy',
    defaultArray: [5, 3, 8, 1, 2, 9],
    defaultParams: { deleteIndex: 2 },
    description: `## Array Deletion\n\nDelete an element at a given index. All elements after it **shift left** to fill the gap.\n\n### Key Insight:\nDeletion in arrays requires shifting — this is O(n) in the worst case. Deleting the last element is O(1).`,
    tutorial: [
      'Identify the index of the element to delete.',
      'Save the value being deleted (for reference).',
      'Starting from the target index, shift each element one position to the left.',
      'Continue until the last element.',
      'Decrement the array size by 1 — the last slot is now considered empty.',
    ],
    examples: [
      '**Delete index 2:** [5, 3, 8, 1, 2] → [5, 3, 1, 2]',
      '**Delete index 0:** [10, 20, 30] → [20, 30]',
    ],
    hints: [
      'Shift from left to right — opposite of insertion.',
      'Deleting the last element is O(1) — just decrement the size.',
      'For unsorted arrays, swap with last element and decrement size for O(1) deletion.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'At most n elements shift. No extra space needed.' },
    testCases: [
      { id: 'tc1', label: 'Delete middle', input: { array: [5, 3, 8, 1, 2], params: { deleteIndex: 2 } } },
      { id: 'tc2', label: 'Delete first', input: { array: [1, 2, 3], params: { deleteIndex: 0 } } },
      { id: 'tc3', label: 'Delete last', input: { array: [10, 20, 30], params: { deleteIndex: 2 } } },
    ],
    codeTemplates: {} as any,
  },

  Update: {
    id: 'arr-update',
    topic: 'Array',
    operation: 'Update',
    title: 'Array Update',
    difficulty: 'Easy',
    defaultArray: [5, 3, 8, 1, 2],
    defaultParams: { updateIndex: 2, updateValue: 42 },
    description: `## Array Update\n\nUpdate the value at a given index. This is the simplest array operation — direct random access.\n\n### Key Insight:\nArrays use index-based access: \`base_address + index × element_size\`. This gives O(1) time regardless of array size — the main advantage of arrays over linked lists.`,
    tutorial: [
      'Access the element at the given index directly — O(1).',
      'Save the old value if needed.',
      'Write the new value to arr[index].',
      'Done! No shifting required.',
    ],
    examples: [
      '**Update index 2 to 42:** [5, 3, 8, 1, 2] → [5, 3, 42, 1, 2]',
    ],
    hints: ['This is always O(1) — the key advantage of arrays.'],
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Direct memory access. Constant time regardless of size.' },
    testCases: [
      { id: 'tc1', label: 'Update index 2', input: { array: [5, 3, 8, 1, 2], params: { updateIndex: 2, updateValue: 42 } } },
      { id: 'tc2', label: 'Update first', input: { array: [1, 2, 3], params: { updateIndex: 0, updateValue: 99 } } },
    ],
    codeTemplates: {} as any,
  },

  Reverse: {
    id: 'arr-reverse',
    topic: 'Array',
    operation: 'Reverse',
    title: 'Array Reverse',
    difficulty: 'Easy',
    defaultArray: [1, 2, 3, 4, 5],
    defaultParams: {},
    description: `## Array Reverse\n\nReverse an array **in-place** using the two-pointer technique.\n\n### Strategy:\nPlace one pointer at the start, one at the end. Swap the pair and move both inward. Repeat until they meet or cross.\n\n### Key Insight:\nBy reversing in-place, we use O(1) extra space — no new array needed.`,
    tutorial: [
      'Initialize left = 0, right = n-1.',
      'While left < right: swap arr[left] and arr[right].',
      'Move left pointer right (left++).',
      'Move right pointer left (right--).',
      'When left >= right, the array is fully reversed.',
    ],
    examples: [
      '**Input:** [1, 2, 3, 4, 5] → **Output:** [5, 4, 3, 2, 1]',
      '**Input:** [1, 2] → **Output:** [2, 1]',
    ],
    hints: [
      'Two-pointer approach is always O(n) time and O(1) space.',
      'For even-length arrays, all pairs get swapped.',
      'For odd-length arrays, the middle element stays in place.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'n/2 swaps. No extra array needed.' },
    testCases: [
      { id: 'tc1', label: 'Odd length', input: { array: [1, 2, 3, 4, 5] } },
      { id: 'tc2', label: 'Even length', input: { array: [1, 2, 3, 4] } },
      { id: 'tc3', label: 'Single element', input: { array: [42] } },
    ],
    codeTemplates: {} as any,
  },

  Rotate: {
    id: 'arr-rotate',
    topic: 'Array',
    operation: 'Rotate',
    title: 'Array Rotation',
    difficulty: 'Medium',
    defaultArray: [1, 2, 3, 4, 5],
    defaultParams: { rotateBy: 2 },
    description: `## Array Left Rotation\n\nLeft-rotate an array by k positions using the **three-reversal algorithm** — the most efficient approach.\n\n### Algorithm:\n1. Reverse entire array\n2. Reverse first (n-k) elements\n3. Reverse last k elements\n\n### Key Insight:\nNaive rotation (shift one at a time) is O(n·k). The reversal algorithm achieves O(n) time and O(1) space.`,
    tutorial: [
      'Normalize k: k = k % n (handles k > n).',
      'Reverse the entire array.',
      'Reverse the first (n-k) elements.',
      'Reverse the last k elements.',
      'The array is now left-rotated by k positions.',
    ],
    examples: [
      '**Rotate [1,2,3,4,5] by 2:** → [3,4,5,1,2]',
    ],
    hints: [
      'Always normalize k first: k = k % n.',
      'Three reversals = O(n) time, O(1) space.',
      'Right rotation by k = Left rotation by (n-k).',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Three reversal passes, each O(n). Total O(n).' },
    testCases: [
      { id: 'tc1', label: 'Rotate by 2', input: { array: [1, 2, 3, 4, 5], params: { rotateBy: 2 } } },
      { id: 'tc2', label: 'Rotate by 1', input: { array: [10, 20, 30, 40], params: { rotateBy: 1 } } },
    ],
    codeTemplates: {} as any,
  },

  LinearSearch: {
    id: 'arr-linear-search',
    topic: 'Array',
    operation: 'LinearSearch',
    title: 'Linear Search',
    difficulty: 'Easy',
    defaultArray: [5, 3, 8, 1, 2, 9, 4],
    defaultParams: { searchTarget: 9 },
    description: `## Linear Search\n\nSearch for a target by checking each element one by one. Works on **unsorted** arrays.\n\n### When to use:\n- Small or unsorted data\n- When sorting isn't worth the overhead\n- Searching linked lists (no random access)\n\n### Key Insight:\nLinear search is the only option when you have **no information about data ordering**.`,
    tutorial: [
      'Start at index 0.',
      'Compare arr[i] with the target.',
      'If equal, return index i — found!',
      'If not equal, move to index i+1.',
      'If i reaches n without finding target, return -1.',
    ],
    examples: [
      '**Search 9 in [5,3,8,1,2,9,4]:** Found at index 5',
      '**Search 7 in [5,3,8]:** Not found → -1',
    ],
    hints: [
      'Best case O(1): element is at index 0.',
      'Worst case O(n): element is last or not present.',
      'For sorted arrays, use Binary Search for O(log n).',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Must visit each element in worst case.' },
    testCases: [
      { id: 'tc1', label: 'Found at end', input: { array: [5, 3, 8, 1, 2, 9, 4], params: { searchTarget: 9 } }, expectedOutput: 5 },
      { id: 'tc2', label: 'Found at start', input: { array: [5, 3, 8], params: { searchTarget: 5 } }, expectedOutput: 0 },
      { id: 'tc3', label: 'Not found', input: { array: [5, 3, 8], params: { searchTarget: 7 } }, expectedOutput: -1 },
    ],
    codeTemplates: {} as any,
  },

  BinarySearch: {
    id: 'arr-binary-search',
    topic: 'Array',
    operation: 'BinarySearch',
    title: 'Binary Search',
    difficulty: 'Medium',
    defaultArray: [1, 3, 5, 7, 9, 11, 15],
    defaultParams: { searchTarget: 7 },
    description: `## Binary Search\n\nEfficiently search a **sorted** array by halving the search space each step.\n\n### Requirement:\nArray **must be sorted**. The visualizer will auto-sort your input.\n\n### Key Insight:\nWith each comparison, we eliminate **half** the remaining elements. After log₂(n) steps, we either find the target or confirm it's absent.`,
    tutorial: [
      'Set left = 0, right = n-1.',
      'Calculate mid = (left + right) / 2.',
      'If arr[mid] == target: return mid.',
      'If arr[mid] < target: search right half (left = mid + 1).',
      'If arr[mid] > target: search left half (right = mid - 1).',
      'If left > right: target not found, return -1.',
    ],
    examples: [
      '**Search 7 in [1,3,5,7,9,11,15]:** Found at index 3 in 2 steps',
    ],
    hints: [
      'Use mid = left + (right - left) / 2 to avoid integer overflow.',
      'Binary search eliminates half the search space per step.',
      'n=1,000,000 → at most 20 comparisons (log₂(1M) ≈ 20).',
    ],
    complexity: { time: 'O(log n)', space: 'O(1)', note: 'Halving the search space each step gives logarithmic time.' },
    testCases: [
      { id: 'tc1', label: 'Found at mid', input: { array: [1, 3, 5, 7, 9, 11, 15], params: { searchTarget: 7 } }, expectedOutput: 3 },
      { id: 'tc2', label: 'Found at end', input: { array: [1, 3, 5, 7, 9], params: { searchTarget: 9 } }, expectedOutput: 4 },
      { id: 'tc3', label: 'Not found', input: { array: [1, 3, 5, 7, 9], params: { searchTarget: 4 } }, expectedOutput: -1 },
    ],
    codeTemplates: {} as any,
  },

  BubbleSort: {
    id: 'arr-bubble-sort',
    topic: 'Array',
    operation: 'BubbleSort',
    title: 'Bubble Sort',
    difficulty: 'Easy',
    defaultArray: [5, 3, 8, 1, 2],
    defaultParams: {},
    description: `## Bubble Sort\n\nA comparison-based sorting algorithm that repeatedly "bubbles" the largest unsorted element to its correct position.\n\n### Key Insight:\nIn each pass, the largest remaining unsorted element rises to its final position — like a bubble rising in water.\n\n### Optimization:\nIf no swap occurs in a pass, the array is already sorted — early termination saves time.`,
    tutorial: [
      'Pass 1: Compare adjacent pairs from left to right.',
      'If arr[j] > arr[j+1], swap them.',
      'After each pass, the largest element is in its final position.',
      'Repeat for n-1 passes (or until no swaps in a pass).',
      'After n-1 passes, the array is fully sorted.',
    ],
    examples: [
      '**Input:** [5,3,8,1,2] → **Output:** [1,2,3,5,8]',
    ],
    hints: [
      'Bubble Sort is rarely used in practice — O(n²) is too slow for large data.',
      'Early termination optimization: if no swap in a pass, stop.',
      'The inner loop range shrinks by 1 each pass — elements at the end are already sorted.',
    ],
    complexity: { time: 'O(n²)', space: 'O(1)', note: 'Best case O(n) with early termination on sorted input.' },
    testCases: [
      { id: 'tc1', label: 'Random', input: { array: [5, 3, 8, 1, 2] } },
      { id: 'tc2', label: 'Already sorted', input: { array: [1, 2, 3, 4, 5] } },
      { id: 'tc3', label: 'Reverse sorted', input: { array: [5, 4, 3, 2, 1] } },
    ],
    codeTemplates: {} as any,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Practice Problems (5 Questions)
  // ────────────────────────────────────────────────────────────────────────────
  ReverseArray: {
    id: 'practice-reverse-array',
    topic: 'Array',
    operation: 'ReverseArray',
    title: 'Reverse an Array',
    difficulty: 'Easy',
    defaultArray: [1, 2, 3, 4, 5],
    defaultParams: {},
    description: `## Reverse an Array\n\nGiven an array, reverse its elements **in-place** using the two-pointer technique.\n\n### Problem Statement:\nGiven an array \`arr\`, reverse the order of its elements so that the first element becomes last, the second becomes second to last, and so on.\n\n### Strategy:\n- Place a \`left\` pointer at index \`0\` and a \`right\` pointer at index \`n-1\`.\n- Swap \`arr[left]\` and \`arr[right]\`.\n- Increment \`left\` and decrement \`right\`.\n- Repeat until \`left >= right\`.`,
    tutorial: [
      'Step 1: Initialize left = 0 and right = n - 1.',
      'Step 2: Compare values at left and right pointers.',
      'Step 3: Swap arr[left] and arr[right] using a temporary variable.',
      'Step 4: Move left pointer inward (left++) and right pointer inward (right--).',
      'Step 5: When left >= right, the array is fully reversed!',
    ],
    examples: [
      '**Input:** [1, 2, 3, 4, 5] → **Output:** [5, 4, 3, 2, 1]',
      '**Input:** [10, 20] → **Output:** [20, 10]',
    ],
    hints: [
      'Using two pointers achieves O(n) time with O(1) extra space.',
      'Swapping elements requires a temp variable: temp = a; a = b; b = temp.',
      'For odd length arrays, the middle element stays in its place.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'n/2 swaps in total. No extra memory allocated.' },
    testCases: [
      { id: 'tc1', label: 'Odd Length', input: { array: [1, 2, 3, 4, 5] }, expectedOutput: '[5, 4, 3, 2, 1]' },
      { id: 'tc2', label: 'Even Length', input: { array: [10, 20, 30, 40] }, expectedOutput: '[40, 30, 20, 10]' },
      { id: 'tc3', label: 'Single Element', input: { array: [42] }, expectedOutput: '[42]' },
    ],
    codeTemplates: {} as any,
  },

  FindMax: {
    id: 'practice-find-max',
    topic: 'Array',
    operation: 'FindMax',
    title: 'Find Maximum Element',
    difficulty: 'Easy',
    defaultArray: [3, 7, 2, 9, 4],
    defaultParams: {},
    description: `## Find Maximum Element\n\nFind the largest number in an unsorted array of numbers.\n\n### Problem Statement:\nGiven an array \`arr\` of size \`n\`, find and return the maximum element present in the array.\n\n### Strategy:\n- Assume the first element \`arr[0]\` is the current maximum (\`currentMax = arr[0]\`).\n- Iterate through the remaining elements from index \`1\` to \`n-1\`.\n- If \`arr[i] > currentMax\`, update \`currentMax = arr[i]\`.\n- After visiting all elements, return \`currentMax\`.`,
    tutorial: [
      'Step 1: Set currentMax = arr[0].',
      'Step 2: Loop i from index 1 to n - 1.',
      'Step 3: Compare arr[i] with currentMax.',
      'Step 4: If arr[i] > currentMax, highlight NEW MAX and update currentMax = arr[i].',
      'Step 5: Return currentMax after visiting all elements.',
    ],
    examples: [
      '**Input:** [3, 7, 2, 9, 4] → **Output:** 9',
      '**Input:** [-5, -2, -10] → **Output:** -2',
    ],
    hints: [
      'Initialize currentMax with arr[0], not 0 (handles negative arrays correctly).',
      'We visit every element once, so time complexity is O(n).',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Single pass through array. Constant space.' },
    testCases: [
      { id: 'tc1', label: 'Unsorted', input: { array: [3, 7, 2, 9, 4] }, expectedOutput: '9' },
      { id: 'tc2', label: 'Negative Numbers', input: { array: [-5, -2, -10] }, expectedOutput: '-2' },
      { id: 'tc3', label: 'Max at Start', input: { array: [99, 10, 50] }, expectedOutput: '99' },
    ],
    codeTemplates: {} as any,
  },

  PracticeLinearSearch: {
    id: 'practice-linear-search',
    topic: 'Array',
    operation: 'PracticeLinearSearch',
    title: 'Linear Search',
    difficulty: 'Easy',
    defaultArray: [5, 3, 8, 1, 2],
    defaultParams: { searchTarget: 8 },
    description: `## Linear Search\n\nSearch for a target value in an array by scanning elements sequentially from left to right.\n\n### Problem Statement:\nGiven an array \`arr\` and a \`target\` value, return the 0-based index of \`target\` if present, or \`-1\` if not present.\n\n### Strategy:\n- Start at index \`0\`.\n- Compare \`arr[i]\` with \`target\`.\n- If equal, return \`i\` immediately.\n- If not equal, increment \`i\` and check the next element.\n- If the loop finishes without finding \`target\`, return \`-1\`.`,
    tutorial: [
      'Step 1: Start at index 0.',
      'Step 2: Compare arr[i] with target.',
      'Step 3: If arr[i] == target, success! Return index i.',
      'Step 4: If not equal, move pointer i forward by 1.',
      'Step 5: If end of array is reached without match, return -1.',
    ],
    examples: [
      '**Input:** [5, 3, 8, 1, 2], Target: 8 → **Output:** Index 2',
      '**Input:** [5, 3, 8, 1, 2], Target: 99 → **Output:** -1 (Not Found)',
    ],
    hints: [
      'Linear Search works on both sorted and unsorted arrays.',
      'Worst case requires inspecting all n elements — O(n) time.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Linear scan through up to n elements.' },
    testCases: [
      { id: 'tc1', label: 'Target Present', input: { array: [5, 3, 8, 1, 2], params: { searchTarget: 8 } }, expectedOutput: '2' },
      { id: 'tc2', label: 'Target at Start', input: { array: [5, 3, 8, 1, 2], params: { searchTarget: 5 } }, expectedOutput: '0' },
      { id: 'tc3', label: 'Target Absent', input: { array: [5, 3, 8, 1, 2], params: { searchTarget: 99 } }, expectedOutput: '-1' },
    ],
    codeTemplates: {} as any,
  },

  PracticeBinarySearch: {
    id: 'practice-binary-search',
    topic: 'Array',
    operation: 'PracticeBinarySearch',
    title: 'Binary Search',
    difficulty: 'Easy',
    defaultArray: [1, 3, 5, 7, 9, 11, 13],
    defaultParams: { searchTarget: 9 },
    description: `## Binary Search\n\nEfficiently search a **sorted array** by repeatedly halving the search interval.\n\n### Requirement:\nThe input array **MUST BE SORTED** in ascending order.\n\n### Strategy:\n- Maintain two pointers: \`left = 0\` and \`right = n - 1\`.\n- Calculate \`mid = floor((left + right) / 2)\`.\n- If \`arr[mid] == target\`, return \`mid\`.\n- If \`arr[mid] < target\`, target is in the right half → set \`left = mid + 1\`.\n- If \`arr[mid] > target\`, target is in the left half → set \`right = mid - 1\`.\n- Repeat while \`left <= right\`.`,
    tutorial: [
      'Step 1: Set left = 0, right = n - 1.',
      'Step 2: Calculate mid = floor((left + right) / 2).',
      'Step 3: Compare arr[mid] with target.',
      'Step 4: If arr[mid] < target, eliminate left half: left = mid + 1.',
      'Step 5: If arr[mid] > target, eliminate right half: right = mid - 1.',
      'Step 6: If arr[mid] == target, return mid!',
    ],
    examples: [
      '**Input:** [1, 3, 5, 7, 9, 11, 13], Target: 9 → **Output:** Index 4',
      '**Input:** [1, 3, 5, 7, 9], Target: 4 → **Output:** -1 (Not Found)',
    ],
    hints: [
      'Binary Search only works on SORTED arrays.',
      'Halving the search space each step achieves logarithmic O(log n) time.',
    ],
    complexity: { time: 'O(log n)', space: 'O(1)', note: 'Reduces search space by half each iteration.' },
    testCases: [
      { id: 'tc1', label: 'Target Present', input: { array: [1, 3, 5, 7, 9, 11, 13], params: { searchTarget: 9 } }, expectedOutput: '4' },
      { id: 'tc2', label: 'Target at Boundaries', input: { array: [1, 3, 5, 7, 9], params: { searchTarget: 1 } }, expectedOutput: '0' },
      { id: 'tc3', label: 'Target Absent', input: { array: [1, 3, 5, 7, 9], params: { searchTarget: 4 } }, expectedOutput: '-1' },
    ],
    codeTemplates: {} as any,
  },

  TwoSum: {
    id: 'practice-two-sum',
    topic: 'Array',
    operation: 'TwoSum',
    title: 'Two Sum',
    difficulty: 'Easy',
    defaultArray: [2, 7, 11, 15],
    defaultParams: { twoSumTarget: 9, searchTarget: 9 },
    description: `## Two Sum (HashMap Solution)\n\nFind two numbers in an array that add up to a specific target number.\n\n### Problem Statement:\nGiven an array of integers \`arr\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.\n\n### Optimal Strategy (HashMap):\n- Maintain a hash map to store \`{ elementValue: elementIndex }\`.\n- Iterate through the array for each element \`arr[i]\`.\n- Calculate the required complement: \`complement = target - arr[i]\`.\n- Check if \`complement\` exists in the hash map.\n- If it exists, we found our pair! Return \`[map[complement], i]\`.\n- Otherwise, add \`arr[i]\` to the hash map: \`map[arr[i]] = i\`.`,
    tutorial: [
      'Step 1: Initialize an empty HashMap.',
      'Step 2: For each element arr[i], compute complement = target - arr[i].',
      'Step 3: Check if complement is in HashMap.',
      'Step 4: If YES: return [hashMap[complement], i].',
      'Step 5: If NO: store arr[i] -> i in HashMap and continue.',
    ],
    examples: [
      '**Input:** [2, 7, 11, 15], Target: 9 → **Output:** [0, 1] (since 2 + 7 = 9)',
      '**Input:** [3, 2, 4], Target: 6 → **Output:** [1, 2] (since 2 + 4 = 6)',
    ],
    hints: [
      'Brute force takes O(n²) with nested loops.',
      'Using a HashMap trades space for time, achieving O(n) time complexity!',
      'Complement formula: complement = target - arr[i].',
    ],
    complexity: { time: 'O(n)', space: 'O(n)', note: 'Single pass through array. HashMap stores up to n elements.' },
    testCases: [
      { id: 'tc1', label: 'Example 1', input: { array: [2, 7, 11, 15], params: { twoSumTarget: 9, searchTarget: 9 } }, expectedOutput: '[0, 1]' },
      { id: 'tc2', label: 'Example 2', input: { array: [3, 2, 4], params: { twoSumTarget: 6, searchTarget: 6 } }, expectedOutput: '[1, 2]' },
      { id: 'tc3', label: 'Same Values', input: { array: [3, 3], params: { twoSumTarget: 6, searchTarget: 6 } }, expectedOutput: '[0, 1]' },
    ],
    codeTemplates: {} as any,
  },
};

export const ARRAY_OPERATIONS = Object.keys(ARRAY_PROBLEMS) as Array<keyof typeof ARRAY_PROBLEMS>;
