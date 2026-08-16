import type { WorkspaceStep, LinkedListNodeData } from '../../types/workspace.types';

// Helper: fills required array-index fields with empty defaults for LL steps
const mkStep = (partial: Omit<WorkspaceStep, 'currentIndexes' | 'activeIndexes' | 'sortedIndexes'>): WorkspaceStep => ({
  currentIndexes: [],
  activeIndexes: [],
  sortedIndexes: [],
  ...partial,
});

export function generateLLReverseSteps(values: number[]): WorkspaceStep[] {
  const arr = values.length > 0 ? values : [10, 20, 30, 40];
  const steps: WorkspaceStep[] = [];

  // Track dynamic pointers for each node (nextId)
  // Initially: 0 -> 1 -> 2 -> 3 -> null
  const currentNextMap: Record<string, string | null> = {};
  arr.forEach((_, idx) => {
    currentNextMap[`node-${idx}`] = idx < arr.length - 1 ? `node-${idx + 1}` : null;
  });

  const getNodesState = (): LinkedListNodeData[] => {
    return arr.map((val, idx) => ({
      id: `node-${idx}`,
      value: val,
      nextId: currentNextMap[`node-${idx}`],
    }));
  };

  // Step 0: Idle
  steps.push(mkStep({
    arrayState: [...arr],
    linkedListState: {
      nodes: getNodesState(),
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'PREV', nodeId: null, color: 'purple' },
        { name: 'CURRENT', nodeId: 'node-0', color: 'cyan' },
      ],
      activeNodeIds: ['node-0'],
    },
    variables: { prev: 'NULL', current: arr[0], head: arr[0] },
    explanation: 'Reverse Linked List: Initialize prev = null, current = head.',
    codeLine: 1,
    phase: 'idle',
  }));

  for (let i = 0; i < arr.length; i++) {
    const currId = `node-${i}`;
    const nextId = i < arr.length - 1 ? `node-${i + 1}` : null;
    const prevId = i > 0 ? `node-${i - 1}` : null;

    // Sub-step 1: next = current.next (Save NEXT)
    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: getNodesState(),
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'PREV', nodeId: prevId, color: 'purple' },
          { name: 'CURRENT', nodeId: currId, color: 'cyan' },
          { name: 'NEXT', nodeId: nextId, color: 'amber' },
        ],
        activeNodeIds: [currId],
        comparingNodeIds: nextId ? [nextId] : [],
      },
      variables: {
        prev: prevId ? arr[i - 1] : 'NULL',
        current: arr[i],
        next: nextId ? arr[i + 1] : 'NULL',
      },
      explanation: `Step 1: Save next = current.next (NEXT points to node ${nextId ? arr[i + 1] : 'NULL'}).`,
      codeLine: 3,
      phase: 'traverse',
    }));

    // Sub-step 2: current.next = prev (Reverse pointer!)
    currentNextMap[currId] = prevId;

    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: getNodesState(),
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'PREV', nodeId: prevId, color: 'purple' },
          { name: 'CURRENT', nodeId: currId, color: 'cyan' },
          { name: 'NEXT', nodeId: nextId, color: 'amber' },
        ],
        specialNodeIds: [currId, ...(prevId ? [prevId] : [])],
      },
      variables: {
        prev: prevId ? arr[i - 1] : 'NULL',
        current: arr[i],
        'current.next': prevId ? arr[i - 1] : 'NULL',
        next: nextId ? arr[i + 1] : 'NULL',
      },
      explanation: `Step 2: Reverse link! current.next = prev (node ${arr[i]} now points backwards to ${prevId ? arr[i - 1] : 'NULL'}).`,
      codeLine: 4,
      phase: 'swap',
    }));

    // Sub-step 3: prev = current (Advance PREV)
    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: getNodesState(),
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'PREV', nodeId: currId, color: 'purple' },
          { name: 'CURRENT', nodeId: currId, color: 'cyan' },
          { name: 'NEXT', nodeId: nextId, color: 'amber' },
        ],
        activeNodeIds: [currId],
      },
      variables: {
        prev: arr[i],
        current: arr[i],
        next: nextId ? arr[i + 1] : 'NULL',
      },
      explanation: `Step 3: Advance PREV pointer: prev = current (PREV is now at node ${arr[i]}).`,
      codeLine: 5,
      phase: 'traverse',
    }));

    // Sub-step 4: current = next (Advance CURRENT)
    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: getNodesState(),
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'PREV', nodeId: currId, color: 'purple' },
          { name: 'CURRENT', nodeId: nextId, color: 'cyan' },
          { name: 'NEXT', nodeId: nextId, color: 'amber' },
        ],
        activeNodeIds: nextId ? [nextId] : [],
      },
      variables: {
        prev: arr[i],
        current: nextId ? arr[i + 1] : 'NULL',
        next: nextId ? arr[i + 1] : 'NULL',
      },
      explanation: `Step 4: Advance CURRENT pointer: current = next (CURRENT is now at node ${nextId ? arr[i + 1] : 'NULL'}).`,
      codeLine: 6,
      phase: 'traverse',
    }));
  }

  // Final step: head = prev
  const lastNodeId = `node-${arr.length - 1}`;
  const reversedArr = [...arr].reverse();

  steps.push(mkStep({
    arrayState: reversedArr,
    linkedListState: {
      nodes: getNodesState(),
      pointers: [
        { name: 'HEAD', nodeId: lastNodeId, color: 'cyan' },
        { name: 'PREV', nodeId: lastNodeId, color: 'purple' },
        { name: 'CURRENT', nodeId: null, color: 'cyan' },
      ],
      successNodeIds: arr.map((_, idx) => `node-${idx}`),
    },
    variables: {
      head: arr[arr.length - 1],
      prev: arr[arr.length - 1],
      current: 'NULL',
      result: `[${reversedArr.join(', ')}]`,
    },
    explanation: `Reversal Complete! Update head = prev. New HEAD is node ${arr[arr.length - 1]}. List is fully reversed!`,
    codeLine: 8,
    phase: 'done',
  }));

  return steps;
}

export const llReverseCodeTemplates = {
  javascript: `class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function reverseList(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    let next = current.next; // 1. Save next
    current.next = prev;     // 2. Reverse link
    prev = current;          // 3. Move prev
    current = next;          // 4. Move current
  }
  return prev; // New Head
}`,

  python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    current = head
    while current:
        next_node = current.next  # 1. Save next
        current.next = prev       # 2. Reverse link
        prev = current            # 3. Move prev
        current = next_node       # 4. Move current
    return prev  # New Head`,

  cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    while (current != nullptr) {
        ListNode* nextNode = current->next; // 1. Save next
        current->next = prev;               // 2. Reverse link
        prev = current;                     // 3. Move prev
        current = nextNode;                 // 4. Move current
    }
    return prev; // New Head
}`,

  java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    while (current != null) {
        ListNode nextNode = current.next; // 1. Save next
        current.next = prev;             // 2. Reverse link
        prev = current;                  // 3. Move prev
        current = nextNode;              // 4. Move current
    }
    return prev; // New Head
}`,

  c: `struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* reverseList(struct ListNode* head) {
    struct ListNode* prev = NULL;
    struct ListNode* current = head;
    while (current != NULL) {
        struct ListNode* nextNode = current->next; // 1. Save next
        current->next = prev;                      // 2. Reverse link
        prev = current;                            // 3. Move prev
        current = nextNode;                        // 4. Move current
    }
    return prev; // New Head
}`,
};
