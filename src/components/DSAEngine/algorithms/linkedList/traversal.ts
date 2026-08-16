import type { WorkspaceStep, LinkedListNodeData } from '../../types/workspace.types';

export function generateLLTraversalSteps(values: number[]): WorkspaceStep[] {
  const arr = values.length > 0 ? values : [10, 20, 30, 40];
  const steps: WorkspaceStep[] = [];

  const nodes: LinkedListNodeData[] = arr.map((val, idx) => ({
    id: `node-${idx}`,
    value: val,
    nextId: idx < arr.length - 1 ? `node-${idx + 1}` : null,
  }));

  // Step 0: Idle state
  steps.push({
    arrayState: [...arr],
    currentIndexes: [0],
    activeIndexes: [],
    sortedIndexes: [],
    linkedListState: {
      nodes: [...nodes],
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'CURRENT', nodeId: 'node-0', color: 'cyan' },
      ],
      activeNodeIds: ['node-0'],
    },
    variables: { head: arr[0], current: arr[0], 'current.value': arr[0], step: 0 },
    explanation: 'We start traversal from HEAD. Initialize current = head.',
    codeLine: 0,
    phase: 'idle',
  });

  for (let i = 0; i < arr.length; i++) {
    const currId = `node-${i}`;

    // Visit node
    steps.push({
      arrayState: [...arr],
      currentIndexes: [i],
      activeIndexes: [],
      sortedIndexes: Array.from({ length: i }, (_, k) => k),
      linkedListState: {
        nodes: [...nodes],
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'CURRENT', nodeId: currId, color: 'cyan' },
        ],
        activeNodeIds: [currId],
        successNodeIds: Array.from({ length: i }, (_, k) => `node-${k}`),
      },
      variables: { head: arr[0], current: arr[i], 'current.value': arr[i], step: i + 1 },
      explanation: `Visit node at index ${i}: current.value = ${arr[i]}. Process element.`,
      codeLine: 2,
      phase: 'traverse',
    });

    // Move to next node (if not last)
    if (i < arr.length - 1) {
      const nextId = `node-${i + 1}`;
      steps.push({
        arrayState: [...arr],
        currentIndexes: [i + 1],
        activeIndexes: [],
        sortedIndexes: Array.from({ length: i + 1 }, (_, k) => k),
        linkedListState: {
          nodes: [...nodes],
          pointers: [
            { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
            { name: 'CURRENT', nodeId: nextId, color: 'cyan' },
          ],
          activeNodeIds: [nextId],
          successNodeIds: Array.from({ length: i + 1 }, (_, k) => `node-${k}`),
        },
        variables: { head: arr[0], current: arr[i + 1], 'current.value': arr[i + 1], step: i + 1 },
        explanation: `Advance pointer: current = current.next (now pointing to node ${arr[i + 1]}).`,
        codeLine: 3,
        phase: 'traverse',
      });
    }
  }

  // Done: current == null
  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: Array.from({ length: arr.length }, (_, k) => k),
    linkedListState: {
      nodes: [...nodes],
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'CURRENT', nodeId: null, color: 'amber' },
      ],
      successNodeIds: nodes.map(n => n.id),
    },
    variables: { head: arr[0], current: 'NULL', step: arr.length },
    explanation: 'current == null. TRAVERSAL COMPLETE! All nodes visited successfully.',
    codeLine: 5,
    phase: 'done',
  });

  return steps;
}


export const llTraversalCodeTemplates = {
  javascript: `class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function traverseList(head) {
  let current = head;
  while (current !== null) {
    console.log(current.val); // Visit node
    current = current.next;   // Move to next node
  }
  // Traversal Complete
}`,

  python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def traverse_list(head):
    current = head
    while current:
        print(current.val) # Visit node
        current = current.next # Move to next node
    # Traversal Complete`,

  cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

void traverseList(ListNode* head) {
    ListNode* current = head;
    while (current != nullptr) {
        cout << current->val << " "; // Visit node
        current = current->next;    // Move to next node
    }
    // Traversal Complete
}`,

  java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public void traverseList(ListNode head) {
    ListNode current = head;
    while (current != null) {
        System.out.print(current.val + " "); // Visit node
        current = current.next;             // Move to next node
    }
    // Traversal Complete
}`,

  c: `struct ListNode {
    int val;
    struct ListNode* next;
};

void traverseList(struct ListNode* head) {
    struct ListNode* current = head;
    while (current != NULL) {
        printf("%d ", current->val); // Visit node
        current = current->next;     // Move to next node
    }
    /* Traversal Complete */
}`,
};
