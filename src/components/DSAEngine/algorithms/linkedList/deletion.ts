import type { WorkspaceStep, LinkedListNodeData } from '../../types/workspace.types';

// Helper: fills required array-index fields with empty defaults for LL steps
const mkStep = (partial: Omit<WorkspaceStep, 'currentIndexes' | 'activeIndexes' | 'sortedIndexes'>): WorkspaceStep => ({
  currentIndexes: [],
  activeIndexes: [],
  sortedIndexes: [],
  ...partial,
});

export function generateLLDeletionSteps(
  values: number[],
  deleteIdx: number = 2
): WorkspaceStep[] {
  const arr = values.length > 0 ? values : [10, 20, 30, 40];
  const targetIdx = Math.max(0, Math.min(deleteIdx, arr.length - 1));
  const steps: WorkspaceStep[] = [];

  const initialNodes: LinkedListNodeData[] = arr.map((val, idx) => ({
    id: `node-${idx}`,
    value: val,
    nextId: idx < arr.length - 1 ? `node-${idx + 1}` : null,
  }));

  // Step 0: Idle
  steps.push(mkStep({
    arrayState: [...arr],
    linkedListState: {
      nodes: [...initialNodes],
      pointers: [{ name: 'HEAD', nodeId: 'node-0', color: 'cyan' }],
    },
    variables: { head: arr[0], deleteIndex: targetIdx, targetValue: arr[targetIdx] },
    explanation: `Delete Node: Request to delete node at index ${targetIdx} (value ${arr[targetIdx]}).`,
    codeLine: 0,
    phase: 'idle',
  }));

  // Case 1: Delete Head (index 0)
  if (targetIdx === 0) {
    // Step 1: TARGET at node-0
    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: [...initialNodes],
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'TARGET', nodeId: 'node-0', color: 'pink' },
        ],
        activeNodeIds: ['node-0'],
      },
      variables: { head: arr[0], target: arr[0], index: 0 },
      explanation: `Step 1: Deleting head node (index 0). TARGET points to node ${arr[0]}.`,
      codeLine: 2,
      phase: 'delete',
    }));

    // Step 2: head = head.next
    const nextHeadId = arr.length > 1 ? 'node-1' : null;
    steps.push(mkStep({
      arrayState: arr.slice(1),
      linkedListState: {
        nodes: [...initialNodes],
        pointers: [
          { name: 'HEAD', nodeId: nextHeadId, color: 'cyan' },
          { name: 'TARGET', nodeId: 'node-0', color: 'pink' },
        ],
        specialNodeIds: ['node-0', ...(nextHeadId ? [nextHeadId] : [])],
      },
      variables: { head: arr.length > 1 ? arr[1] : 'NULL', target: arr[0] },
      explanation: `Step 2: Update head = head.next. HEAD pointer moves to node ${arr.length > 1 ? arr[1] : 'NULL'}.`,
      codeLine: 3,
      phase: 'delete',
    }));

    // Step 3: Remove target node from memory
    const finalNodes = initialNodes.slice(1);
    steps.push(mkStep({
      arrayState: arr.slice(1),
      linkedListState: {
        nodes: finalNodes,
        pointers: [{ name: 'HEAD', nodeId: nextHeadId, color: 'cyan' }],
        successNodeIds: finalNodes.map(n => n.id),
      },
      variables: { head: arr.length > 1 ? arr[1] : 'NULL', result: `[${arr.slice(1).join(', ')}]` },
      explanation: `Step 3: Node ${arr[0]} deleted from memory. Deletion complete!`,
      codeLine: 4,
      phase: 'done',
    }));

    return steps;
  }

  // Case 2: Middle or Tail Deletion (targetIdx > 0)
  // Step 1: Traverse to targetIdx - 1
  for (let i = 0; i < targetIdx - 1; i++) {
    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: [...initialNodes],
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'PREV', nodeId: `node-${i}`, color: 'amber' },
        ],
        comparingNodeIds: [`node-${i}`],
      },
      variables: { head: arr[0], prev: arr[i], targetIndex: targetIdx },
      explanation: `Traversing to node before target index (prev = prev.next).`,
      codeLine: 7,
      phase: 'traverse',
    }));
  }

  const prevId = `node-${targetIdx - 1}`;
  const targetId = `node-${targetIdx}`;
  const nextAfterTargetId = targetIdx < arr.length - 1 ? `node-${targetIdx + 1}` : null;

  // Step 2: Show PREV at targetIdx-1, TARGET at targetIdx
  steps.push(mkStep({
    arrayState: [...arr],
    linkedListState: {
      nodes: [...initialNodes],
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'PREV', nodeId: prevId, color: 'amber' },
        { name: 'TARGET', nodeId: targetId, color: 'pink' },
      ],
      activeNodeIds: [prevId],
      comparingNodeIds: [targetId],
    },
    variables: {
      head: arr[0],
      prev: arr[targetIdx - 1],
      target: arr[targetIdx],
      'target.next': nextAfterTargetId ? arr[targetIdx + 1] : 'NULL',
      index: targetIdx,
    },
    explanation: `Position reached: PREV is at node ${arr[targetIdx - 1]}, TARGET is at node ${arr[targetIdx]}.`,
    codeLine: 8,
    phase: 'delete',
  }));

  // Step 3: Rewire prev.next = target.next (disconnect target, bypass to target.next)
  const rewiredNodes: LinkedListNodeData[] = initialNodes.map(n => {
    if (n.id === prevId) {
      return { ...n, nextId: nextAfterTargetId };
    }
    return { ...n };
  });

  steps.push(mkStep({
    arrayState: [...arr],
    linkedListState: {
      nodes: rewiredNodes,
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'PREV', nodeId: prevId, color: 'amber' },
        { name: 'TARGET', nodeId: targetId, color: 'pink' },
      ],
      specialNodeIds: [prevId, ...(nextAfterTargetId ? [nextAfterTargetId] : [])],
      dimmedNodeIds: [targetId],
    },
    variables: {
      head: arr[0],
      prev: arr[targetIdx - 1],
      'prev.next': nextAfterTargetId ? arr[targetIdx + 1] : 'NULL',
      target: arr[targetIdx],
    },
    explanation: `Rewire pointer: prev.next = target.next (node ${arr[targetIdx - 1]} now points directly to ${nextAfterTargetId ? arr[targetIdx + 1] : 'NULL'}).`,
    codeLine: 10,
    phase: 'delete',
  }));

  // Step 4: Fade & remove target node from list
  const finalNodes = rewiredNodes.filter(n => n.id !== targetId);
  const newArrayState = arr.filter((_, idx) => idx !== targetIdx);

  steps.push(mkStep({
    arrayState: newArrayState,
    linkedListState: {
      nodes: finalNodes,
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'PREV', nodeId: prevId, color: 'amber' },
      ],
      successNodeIds: finalNodes.map(n => n.id),
    },
    variables: {
      head: arr[0],
      deletedValue: arr[targetIdx],
      result: `[${newArrayState.join(', ')}]`,
    },
    explanation: `Node ${arr[targetIdx]} removed from memory. Deletion Complete!`,
    codeLine: 12,
    phase: 'done',
  }));

  return steps;
}

export const llDeletionCodeTemplates = {
  javascript: `class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function deleteNode(head, index) {
  if (head === null) return null;
  if (index === 0) {
    return head.next; // Delete head
  }
  let prev = head;
  for (let i = 0; i < index - 1 && prev !== null; i++) {
    prev = prev.next;
  }
  if (prev !== null && prev.next !== null) {
    let target = prev.next;
    prev.next = target.next; // Disconnect target node
  }
  return head;
}`,

  python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def delete_node(head, index):
    if not head:
        return None
    if index == 0:
        return head.next  # Delete head
    prev = head
    for i in range(index - 1):
        if not prev:
            break
        prev = prev.next
    if prev and prev.next:
        target = prev.next
        prev.next = target.next  # Disconnect target
    return head`,

  cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* deleteNode(ListNode* head, int index) {
    if (head == nullptr) return nullptr;
    if (index == 0) {
        ListNode* newHead = head->next;
        delete head;
        return newHead;
    }
    ListNode* prev = head;
    for (int i = 0; i < index - 1 && prev != nullptr; i++) {
        prev = prev->next;
    }
    if (prev != nullptr && prev->next != nullptr) {
        ListNode* target = prev->next;
        prev->next = target->next; // Disconnect target
        delete target;
    }
    return head;
}`,

  java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public ListNode deleteNode(ListNode head, int index) {
    if (head == null) return null;
    if (index == 0) {
        return head.next;
    }
    ListNode prev = head;
    for (int i = 0; i < index - 1 && prev != null; i++) {
        prev = prev.next;
    }
    if (prev != null && prev.next != null) {
        ListNode target = prev.next;
        prev.next = target.next; // Disconnect target
    }
    return head;
}`,

  c: `struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* deleteNode(struct ListNode* head, int index) {
    if (head == NULL) return NULL;
    if (index == 0) {
        struct ListNode* newHead = head->next;
        free(head);
        return newHead;
    }
    struct ListNode* prev = head;
    for (int i = 0; i < index - 1 && prev != NULL; i++) {
        prev = prev->next;
    }
    if (prev != NULL && prev->next != NULL) {
        struct ListNode* target = prev->next;
        prev->next = target->next; // Disconnect target
        free(target);
    }
    return head;
}`,
};
