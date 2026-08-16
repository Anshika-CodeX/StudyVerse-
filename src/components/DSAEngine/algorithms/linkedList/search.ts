import type { WorkspaceStep, LinkedListNodeData } from '../../types/workspace.types';

// Helper: fills required array-index fields with empty defaults for LL steps
const mkStep = (partial: Omit<WorkspaceStep, 'currentIndexes' | 'activeIndexes' | 'sortedIndexes'>): WorkspaceStep => ({
  currentIndexes: [],
  activeIndexes: [],
  sortedIndexes: [],
  ...partial,
});

export function generateLLSearchSteps(values: number[], targetVal: number = 30): WorkspaceStep[] {
  const arr = values.length > 0 ? values : [10, 20, 30, 40];
  const steps: WorkspaceStep[] = [];

  const nodes: LinkedListNodeData[] = arr.map((val, idx) => ({
    id: `node-${idx}`,
    value: val,
    nextId: idx < arr.length - 1 ? `node-${idx + 1}` : null,
  }));

  // Step 0: Idle
  steps.push(mkStep({
    arrayState: [...arr],
    linkedListState: {
      nodes: [...nodes],
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'CURRENT', nodeId: 'node-0', color: 'cyan' },
      ],
      activeNodeIds: ['node-0'],
    },
    variables: { head: arr[0], current: arr[0], target: targetVal, position: 0 },
    explanation: `Search in Linked List: Searching for target ${targetVal}. Start current = head.`,
    codeLine: 0,
    phase: 'idle',
  }));

  let foundIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    const currId = `node-${i}`;
    const isMatch = arr[i] === targetVal;

    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: [...nodes],
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'CURRENT', nodeId: currId, color: isMatch ? 'emerald' : 'amber' },
        ],
        comparingNodeIds: [currId],
        successNodeIds: isMatch ? [currId] : [],
      },
      variables: {
        head: arr[0],
        current: arr[i],
        'current.value': arr[i],
        target: targetVal,
        position: i,
        match: isMatch ? 'YES ✓' : 'NO',
      },
      explanation: isMatch
        ? `Position ${i}: current.value = ${arr[i]} === ${targetVal}. MATCH FOUND AT POSITION ${i}!`
        : `Position ${i}: current.value = ${arr[i]} ≠ ${targetVal}. Not a match. Move to current.next.`,
      codeLine: isMatch ? 3 : 2,
      phase: isMatch ? 'found' : 'compare',
    }));

    if (isMatch) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex >= 0) {
    const foundId = `node-${foundIndex}`;
    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: [...nodes],
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'FOUND', nodeId: foundId, color: 'emerald' },
        ],
        successNodeIds: [foundId],
      },
      variables: { target: targetVal, foundPosition: foundIndex, result: `Found at position ${foundIndex}` },
      explanation: `SEARCH COMPLETE! Target ${targetVal} found at 0-based position ${foundIndex}.`,
      codeLine: 4,
      phase: 'done',
    }));
  } else {
    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: [...nodes],
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'CURRENT', nodeId: null, color: 'amber' },
        ],
        dimmedNodeIds: nodes.map(n => n.id),
      },
      variables: { target: targetVal, result: 'NOT FOUND', position: -1 },
      explanation: `TARGET NOT FOUND! Reached end of list (current == null) without finding ${targetVal}.`,
      codeLine: 6,
      phase: 'not_found',
    }));
  }

  return steps;
}

export const llSearchCodeTemplates = {
  javascript: `class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function searchList(head, target) {
  let current = head;
  let position = 0;
  while (current !== null) {
    if (current.val === target) {
      return position; // Match found at position
    }
    current = current.next;
    position++;
  }
  return -1; // Target Not Found
}`,

  python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def search_list(head, target):
    current = head
    position = 0
    while current:
        if current.val == target:
            return position  # Found at position
        current = current.next
        position += 1
    return -1  # Not Found`,

  cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

int searchList(ListNode* head, int target) {
    ListNode* current = head;
    int position = 0;
    while (current != nullptr) {
        if (current->val == target) {
            return position; // Match found
        }
        current = current->next;
        position++;
    }
    return -1; // Not Found
}`,

  java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public int searchList(ListNode head, int target) {
    ListNode current = head;
    int position = 0;
    while (current != null) {
        if (current.val == target) {
            return position;
        }
        current = current.next;
        position++;
    }
    return -1;
}`,

  c: `struct ListNode {
    int val;
    struct ListNode* next;
};

int searchList(struct ListNode* head, int target) {
    struct ListNode* current = head;
    int position = 0;
    while (current != NULL) {
        if (current->val == target) {
            return position;
        }
        current = current->next;
        position++;
    }
    return -1;
}`,
};
