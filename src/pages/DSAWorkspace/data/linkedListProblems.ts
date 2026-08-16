import type { ProblemDefinition } from '../../../components/DSAEngine/types/workspace.types';
import {
  llTraversalCodeTemplates,
  llInsertionCodeTemplates,
  llDeletionCodeTemplates,
  llReverseCodeTemplates,
  llSearchCodeTemplates,
} from '../../../components/DSAEngine/algorithms/linkedList';

import { llSwapCodeTemplates } from '../../../components/DSAEngine/algorithms/linkedList/swap';

export const LINKED_LIST_PROBLEMS: Record<string, ProblemDefinition> = {
  LL_Traversal: {
    id: 'll-traversal',
    topic: 'LinkedList',
    operation: 'LL_Traversal',
    title: 'Linked List Traversal',
    difficulty: 'Easy',
    defaultArray: [10, 20, 30, 40],
    defaultParams: {},
    description: `## Linked List Traversal\n\nTraversal means visiting each node in the linked list sequentially starting from the **HEAD** pointer until reaching **NULL**.\n\n### Key Concept:\nUnlike arrays where elements are stored in contiguous memory, Linked List nodes are connected via **pointers** (\`current.next\`).\n\n### Algorithm:\n1. Initialize a pointer \`current = head\`.\n2. Loop while \`current !== null\`.\n3. Process the node's value (\`current.val\`).\n4. Move pointer forward: \`current = current.next\`.\n5. Stop when \`current\` becomes \`NULL\`.`,
    tutorial: [
      'Step 1: Set pointer current = head (points to node 10).',
      'Step 2: Read current.val (10) and process node.',
      'Step 3: Advance pointer: current = current.next (points to node 20).',
      'Step 4: Repeat reading values until current reaches NULL.',
      'Step 5: When current == null, traversal is complete!',
    ],
    examples: [
      '**Input:** 10 → 20 → 30 → 40 → NULL → **Output:** 10 20 30 40',
      '**Input:** 5 → 15 → NULL → **Output:** 5 15',
    ],
    hints: [
      'Never move current past NULL or you will trigger a null pointer exception.',
      'Time complexity is O(n) as we visit all n nodes once.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Linear time. No extra node allocations required.' },
    testCases: [
      { id: 'tc1', label: 'Basic List', input: { array: [10, 20, 30, 40] }, expectedOutput: '10 20 30 40' },
      { id: 'tc2', label: 'Single Node', input: { array: [100] }, expectedOutput: '100' },
      { id: 'tc3', label: 'Two Nodes', input: { array: [5, 15] }, expectedOutput: '5 15' },
    ],
    codeTemplates: llTraversalCodeTemplates,
  },

  LL_Insertion: {
    id: 'll-insertion',
    topic: 'LinkedList',
    operation: 'LL_Insertion',
    title: 'Insert Node',
    difficulty: 'Easy',
    defaultArray: [10, 20, 30],
    defaultParams: { insertIndex: 1, insertValue: 15 },
    description: `## Insert Node in Linked List\n\nInsert a new node with value \`val\` at position \`index\` by updating pointers.\n\n### Key Concept:\nLinked list insertion does **NOT** require shifting elements (unlike arrays). It only requires **pointer rewiring**!\n\n### Algorithm (Middle Insertion):\n1. Create a new detached node: \`newNode = new ListNode(15)\`.\n2. Traverse to the node before target position: \`current = head\` at index - 1.\n3. Connect new node to rest of list: \`newNode.next = current.next\`.\n4. Rewire current node to new node: \`current.next = newNode\`.`,
    tutorial: [
      'Step 1: Create new detached node with value 15 (15 → NULL).',
      'Step 2: Traverse current pointer to node before position (node 10).',
      'Step 3: Point newNode.next = current.next (15 → 20).',
      'Step 4: Update current.next = newNode (10 → 15).',
      'Step 5: Pointer rewiring complete! List is now 10 → 15 → 20 → 30.',
    ],
    examples: [
      '**Input:** 10 → 20 → 30, Insert 15 at index 1 → **Output:** 10 → 15 → 20 → 30',
      '**Input:** 10 → 20, Insert 5 at index 0 → **Output:** 5 → 10 → 20',
    ],
    hints: [
      'Always set newNode.next FIRST before setting current.next, otherwise you lose the reference to the rest of the list!',
      'Inserting at head (index 0) updates the HEAD pointer.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'O(1) insertion after traversing to index position.' },
    testCases: [
      { id: 'tc1', label: 'Insert Middle', input: { array: [10, 20, 30], params: { insertIndex: 1, insertValue: 15 } }, expectedOutput: '[10, 15, 20, 30]' },
      { id: 'tc2', label: 'Insert Head', input: { array: [10, 20], params: { insertIndex: 0, insertValue: 5 } }, expectedOutput: '[5, 10, 20]' },
      { id: 'tc3', label: 'Insert Tail', input: { array: [10, 20], params: { insertIndex: 2, insertValue: 30 } }, expectedOutput: '[10, 20, 30]' },
    ],
    codeTemplates: llInsertionCodeTemplates,
  },

  LL_Deletion: {
    id: 'll-deletion',
    topic: 'LinkedList',
    operation: 'LL_Deletion',
    title: 'Delete Node',
    difficulty: 'Easy',
    defaultArray: [10, 20, 30, 40],
    defaultParams: { deleteIndex: 2 },
    description: `## Delete Node from Linked List\n\nDelete the node at \`index\` by updating pointers to bypass the target node.\n\n### Key Concept:\nDeleting a node requires finding the node **before** it (\`prev\`) and setting \`prev.next = target.next\`.\n\n### Algorithm:\n1. Handle head deletion (\`index == 0\`): set \`head = head.next\`.\n2. Otherwise, traverse to node before target (\`prev\` at index - 1).\n3. Identify target node: \`target = prev.next\`.\n4. Bypass target: \`prev.next = target.next\`.\n5. Target node is disconnected and freed from memory.`,
    tutorial: [
      'Step 1: Traverse PREV pointer to node before target (node 20 at index 1).',
      'Step 2: Identify TARGET node (node 30 at index 2).',
      'Step 3: Update prev.next = target.next (20 now points directly to 40).',
      'Step 4: Target node 30 is disconnected from the list.',
      'Step 5: Free node 30 from memory. List is now 10 → 20 → 40 → NULL.',
    ],
    examples: [
      '**Input:** 10 → 20 → 30 → 40, Delete index 2 → **Output:** 10 → 20 → 40',
      '**Input:** 10 → 20 → 30, Delete index 0 → **Output:** 20 → 30',
    ],
    hints: [
      'Make sure to save target.next before breaking the link.',
      'In languages like C/C++, remember to free/delete the unlinked node to prevent memory leaks.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'O(n) to traverse to position, O(1) to bypass link.' },
    testCases: [
      { id: 'tc1', label: 'Delete Middle', input: { array: [10, 20, 30, 40], params: { deleteIndex: 2 } }, expectedOutput: '[10, 20, 40]' },
      { id: 'tc2', label: 'Delete Head', input: { array: [10, 20, 30], params: { deleteIndex: 0 } }, expectedOutput: '[20, 30]' },
      { id: 'tc3', label: 'Delete Tail', input: { array: [10, 20, 30], params: { deleteIndex: 2 } }, expectedOutput: '[10, 20]' },
    ],
    codeTemplates: llDeletionCodeTemplates,
  },

  LL_Reverse: {
    id: 'll-reverse',
    topic: 'LinkedList',
    operation: 'LL_Reverse',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    defaultArray: [10, 20, 30, 40],
    defaultParams: {},
    description: `## Reverse Linked List\n\nReverse the direction of all pointers in-place using three pointers: **PREV**, **CURRENT**, and **NEXT**.\n\n### Key Concept:\nWe flip every \`current.next\` pointer backwards to point to \`prev\` instead of next node.\n\n### 4-Step Iteration:\nFor every node:\n1. \`next = current.next\` (Save reference to next node)\n2. \`current.next = prev\` (Reverse the pointer link!)\n3. \`prev = current\` (Advance PREV pointer)\n4. \`current = next\` (Advance CURRENT pointer)\n\nFinally, update \`head = prev\`.`,
    tutorial: [
      'Step 1: Initialize prev = null, current = head (node 10).',
      'Step 2: Save next = current.next (NEXT points to 20).',
      'Step 3: Reverse link: current.next = prev (10 points to NULL).',
      'Step 4: Advance PREV: prev = current (PREV at 10).',
      'Step 5: Advance CURRENT: current = next (CURRENT at 20).',
      'Step 6: Repeat until current reaches NULL. Then head = prev!',
    ],
    examples: [
      '**Input:** 10 → 20 → 30 → 40 → NULL → **Output:** 40 → 30 → 20 → 10 → NULL',
      '**Input:** 1 → 2 → NULL → **Output:** 2 → 1 → NULL',
    ],
    hints: [
      'Always save current.next in a temporary variable NEXT before overwriting current.next!',
      'When loop terminates, prev will be pointing to the new HEAD node.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Single pass through list. Reverses links in-place.' },
    testCases: [
      { id: 'tc1', label: 'Four Nodes', input: { array: [10, 20, 30, 40] }, expectedOutput: '[40, 30, 20, 10]' },
      { id: 'tc2', label: 'Two Nodes', input: { array: [1, 2] }, expectedOutput: '[2, 1]' },
      { id: 'tc3', label: 'Single Node', input: { array: [99] }, expectedOutput: '[99]' },
    ],
    codeTemplates: llReverseCodeTemplates,
  },

  LL_Search: {
    id: 'll-search',
    topic: 'LinkedList',
    operation: 'LL_Search',
    title: 'Search in Linked List',
    difficulty: 'Easy',
    defaultArray: [10, 20, 30, 40],
    defaultParams: { searchTarget: 30 },
    description: `## Search in Linked List\n\nSearch for a target value in a linked list by traversing nodes sequentially.\n\n### Key Concept:\nSince linked lists do not support random access (no \`arr[i]\` indexed lookup), we must perform a **linear search**.\n\n### Algorithm:\n1. Initialize \`current = head\` and \`position = 0\`.\n2. Loop while \`current !== null\`.\n3. Compare \`current.val === target\`.\n4. If equal, return \`position\`.\n5. Otherwise, advance \`current = current.next\` and increment \`position\`.\n6. If end of list reached without match, return \`-1\`.`,
    tutorial: [
      'Step 1: Set current = head (node 10), position = 0.',
      'Step 2: Compare current.val (10) with target (30). No match.',
      'Step 3: Advance current = current.next (node 20, position 1). Compare: 20 ≠ 30.',
      'Step 4: Advance current = current.next (node 30, position 2). Compare: 30 == 30. MATCH!',
      'Step 5: Highlight target node GREEN and return position 2.',
    ],
    examples: [
      '**Input:** 10 → 20 → 30 → 40, Target: 30 → **Output:** Position 2',
      '**Input:** 10 → 20 → 30 → 40, Target: 99 → **Output:** -1 (Not Found)',
    ],
    hints: [
      'Search takes O(n) in worst case as elements are linked sequentially.',
      '0-based indexing is standard for position reporting.',
    ],
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Linear search through nodes. Constant extra space.' },
    testCases: [
      { id: 'tc1', label: 'Target Present', input: { array: [10, 20, 30, 40], params: { searchTarget: 30 } }, expectedOutput: 'Position 2' },
      { id: 'tc2', label: 'Target at Head', input: { array: [10, 20, 30, 40], params: { searchTarget: 10 } }, expectedOutput: 'Position 0' },
      { id: 'tc3', label: 'Target Absent', input: { array: [10, 20, 30, 40], params: { searchTarget: 99 } }, expectedOutput: '-1' },
    ],
    codeTemplates: llSearchCodeTemplates,
  },


  LL_Swap: {
    id: 'll-swap',
    topic: 'LinkedList',
    operation: 'LL_Swap',
    title: 'Swap Two Elements',
    difficulty: 'Easy',
    defaultArray: [10, 20, 30, 40],
    defaultParams: { firstIndex: 1, secondIndex: 2 },

    description: `## Swap Two Elements in Linked List

Swap two nodes containing the given values in a linked list.

### Key Concept:
Unlike arrays, linked list nodes cannot be swapped using indexes directly. We need to find both nodes and update their links.

### Algorithm:
1. Find the first node and its previous node.
2. Find the second node and its previous node.
3. If either node is not found, stop.
4. Update the previous node links.
5. Swap the next pointers of both nodes.
6. The linked list now has the two nodes swapped.`,

    tutorial: [
      'Step 1: Start with the linked list 10 → 20 → 30 → 40.',
      'Step 2: Find the first node containing value 20.',
      'Step 3: Find the second node containing value 30.',
      'Step 4: Store the connections of both nodes.',
      'Step 5: Update the links to swap nodes 20 and 30.',
      'Step 6: Final list becomes 10 → 30 → 20 → 40.',
    ],

    examples: [
      '**Input:** 10 → 20 → 30 → 40, Swap: 20 and 30 → **Output:** 10 → 30 → 20 → 40',
      '**Input:** 10 → 20 → 30 → 40, Swap: 10 and 40 → **Output:** 40 → 20 → 30 → 10',
    ],

    hints: [
      'Keep track of the previous nodes while searching.',
      'Handle the case where one of the nodes is the head.',
      'If either value is not found, do not modify the list.',
    ],

    complexity: {
      time: 'O(n)',
      space: 'O(1)',
      note: 'We traverse the linked list to find both nodes and swap their links.',
    },

    testCases: [
      {
        id: 'tc1',
        label: 'Swap Adjacent Nodes',
        input: {
          array: [10, 20, 30, 40],
          params: { firstIndex: 20, secondIndex: 30 },
        },
        expectedOutput: '[10, 30, 20, 40]',
      },
      {
        id: 'tc2',
        label: 'Swap Head and Tail',
        input: {
          array: [10, 20, 30, 40],
          params: { firstIndex: 0, secondIndex: 3 },
        },
        expectedOutput: '[40, 20, 30, 10]',
      },
      {
        id: 'tc3',
        label: 'Value Not Found',
        input: {
          array: [10, 20, 30, 40],
          params: { firstIndex: 20, secondIndex: 99 },
        },
        expectedOutput: '[10, 20, 30, 40]',
      },
    ],

    codeTemplates: llSwapCodeTemplates,
  },
};

