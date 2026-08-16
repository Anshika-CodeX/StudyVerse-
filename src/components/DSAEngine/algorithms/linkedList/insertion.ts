import type { WorkspaceStep, LinkedListNodeData } from '../../types/workspace.types';

// Helper: fills required array-index fields with empty defaults for LL steps
const mkStep = (partial: Omit<WorkspaceStep, 'currentIndexes' | 'activeIndexes' | 'sortedIndexes'>): WorkspaceStep => ({
  currentIndexes: [],
  activeIndexes: [],
  sortedIndexes: [],
  ...partial,
});

export function generateLLInsertionSteps(
  values: number[],
  insertIdx: number = 1,
  insertVal: number = 15
): WorkspaceStep[] {
  const arr = values.length > 0 ? values : [10, 20, 30];
  const targetIdx = Math.max(0, Math.min(insertIdx, arr.length));
  const steps: WorkspaceStep[] = [];

  const initialNodes: LinkedListNodeData[] = arr.map((val, idx) => ({
    id: `node-${idx}`,
    value: val,
    nextId: idx < arr.length - 1 ? `node-${idx + 1}` : null,
  }));

  const newNodeId = 'new-node';

  // Step 0: Idle
  steps.push(mkStep({
    arrayState: [...arr],
    linkedListState: {
      nodes: [...initialNodes],
      pointers: [{ name: 'HEAD', nodeId: 'node-0', color: 'cyan' }],
    },
    variables: { head: arr[0], insertIndex: targetIdx, insertValue: insertVal },
    explanation: `Insert Node: Request to insert value ${insertVal} at index ${targetIdx}.`,
    codeLine: 0,
    phase: 'idle',
  }));

  // Step 1: Create detached new node (15 -> NULL)
  const step1Nodes: LinkedListNodeData[] = [
    ...initialNodes,
    { id: newNodeId, value: insertVal, nextId: null, isNew: true },
  ];

  steps.push(mkStep({
    arrayState: [...arr],
    linkedListState: {
      nodes: step1Nodes,
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'NEW', nodeId: newNodeId, color: 'pink' },
      ],
      specialNodeIds: [newNodeId],
    },
    variables: { head: arr[0], newNode: insertVal, 'newNode.next': 'NULL', index: targetIdx },
    explanation: `Step 1: Create a new detached node with value ${insertVal} (newNode.val = ${insertVal}, newNode.next = NULL).`,
    codeLine: 2,
    phase: 'insert',
  }));

  // Insert at beginning (index 0)
  if (targetIdx === 0) {
    // Step 2: newNode.next = head
    const step2Nodes: LinkedListNodeData[] = [
      { id: newNodeId, value: insertVal, nextId: 'node-0', isNew: true },
      ...initialNodes,
    ];

    steps.push(mkStep({
      arrayState: [insertVal, ...arr],
      linkedListState: {
        nodes: step2Nodes,
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'NEW', nodeId: newNodeId, color: 'pink' },
        ],
        specialNodeIds: [newNodeId, 'node-0'],
      },
      variables: { head: arr[0], newNode: insertVal, 'newNode.next': arr[0] },
      explanation: `Step 2: Point newNode.next = head (${insertVal} points to ${arr[0]}).`,
      codeLine: 4,
      phase: 'insert',
    }));

    // Step 3: head = newNode
    const finalNodes: LinkedListNodeData[] = [
      { id: newNodeId, value: insertVal, nextId: 'node-0' },
      ...initialNodes,
    ];

    steps.push(mkStep({
      arrayState: [insertVal, ...arr],
      linkedListState: {
        nodes: finalNodes,
        pointers: [{ name: 'HEAD', nodeId: newNodeId, color: 'cyan' }],
        successNodeIds: finalNodes.map(n => n.id),
      },
      variables: { head: insertVal, 'head.next': arr[0] },
      explanation: `Step 3: Update head = newNode. New node ${insertVal} is now the HEAD of the list!`,
      codeLine: 5,
      phase: 'done',
    }));

    return steps;
  }

  // Middle or End Insertion (targetIdx > 0)
  // Step 2: Traverse to node at targetIdx - 1
  for (let i = 0; i < targetIdx - 1; i++) {
    steps.push(mkStep({
      arrayState: [...arr],
      linkedListState: {
        nodes: step1Nodes,
        pointers: [
          { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
          { name: 'CURRENT', nodeId: `node-${i}`, color: 'amber' },
          { name: 'NEW', nodeId: newNodeId, color: 'pink' },
        ],
        comparingNodeIds: [`node-${i}`],
      },
      variables: { head: arr[0], current: arr[i], targetIndex: targetIdx },
      explanation: `Step 2: Traversing to position before insertion (current = current.next).`,
      codeLine: 8,
      phase: 'traverse',
    }));
  }

  const prevNodeId = `node-${targetIdx - 1}`;
  const nextTargetId = targetIdx < arr.length ? `node-${targetIdx}` : null;

  steps.push(mkStep({
    arrayState: [...arr],
    linkedListState: {
      nodes: step1Nodes,
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'CURRENT', nodeId: prevNodeId, color: 'cyan' },
        { name: 'NEW', nodeId: newNodeId, color: 'pink' },
      ],
      activeNodeIds: [prevNodeId],
      specialNodeIds: [newNodeId],
    },
    variables: { head: arr[0], current: arr[targetIdx - 1], newNode: insertVal, index: targetIdx },
    explanation: `Step 2: Position reached! CURRENT is at node ${arr[targetIdx - 1]} (index ${targetIdx - 1}).`,
    codeLine: 9,
    phase: 'traverse',
  }));

  // Step 3: newNode.next = current.next (connect 15 -> nextTarget)
  const step3Nodes: LinkedListNodeData[] = initialNodes.map(n => ({ ...n }));
  step3Nodes.push({
    id: newNodeId,
    value: insertVal,
    nextId: nextTargetId,
    isNew: true,
  });

  steps.push(mkStep({
    arrayState: [...arr],
    linkedListState: {
      nodes: step3Nodes,
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'CURRENT', nodeId: prevNodeId, color: 'cyan' },
        { name: 'NEW', nodeId: newNodeId, color: 'pink' },
      ],
      specialNodeIds: [newNodeId, ...(nextTargetId ? [nextTargetId] : [])],
    },
    variables: {
      head: arr[0],
      current: arr[targetIdx - 1],
      newNode: insertVal,
      'newNode.next': nextTargetId ? arr[targetIdx] : 'NULL',
    },
    explanation: `Step 3: Rewire pointer: newNode.next = current.next (${insertVal} now points to ${nextTargetId ? arr[targetIdx] : 'NULL'}).`,
    codeLine: 11,
    phase: 'insert',
  }));

  // Step 4: current.next = newNode (connect current -> 15)
  const finalNodes: LinkedListNodeData[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === targetIdx - 1) {
      finalNodes.push({ id: `node-${i}`, value: arr[i], nextId: newNodeId });
      finalNodes.push({ id: newNodeId, value: insertVal, nextId: nextTargetId });
    } else {
      finalNodes.push({
        id: `node-${i}`,
        value: arr[i],
        nextId: i < arr.length - 1 ? `node-${i + 1}` : null,
      });
    }
  }

  const newArrayState = [...arr.slice(0, targetIdx), insertVal, ...arr.slice(targetIdx)];

  steps.push(mkStep({
    arrayState: newArrayState,
    linkedListState: {
      nodes: finalNodes,
      pointers: [
        { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
        { name: 'CURRENT', nodeId: prevNodeId, color: 'cyan' },
        { name: 'NEW', nodeId: newNodeId, color: 'pink' },
      ],
      specialNodeIds: [prevNodeId, newNodeId],
    },
    variables: {
      head: arr[0],
      current: arr[targetIdx - 1],
      'current.next': insertVal,
      newNode: insertVal,
    },
    explanation: `Step 4: Rewire pointer: current.next = newNode (node ${arr[targetIdx - 1]} now points to ${insertVal}).`,
    codeLine: 12,
    phase: 'insert',
  }));

  // Step 5: Done
  steps.push(mkStep({
    arrayState: newArrayState,
    linkedListState: {
      nodes: finalNodes,
      pointers: [{ name: 'HEAD', nodeId: 'node-0', color: 'cyan' }],
      successNodeIds: finalNodes.map(n => n.id),
    },
    variables: { head: arr[0], size: newArrayState.length, result: `[${newArrayState.join(', ')}]` },
    explanation: `Insertion Complete! Node ${insertVal} inserted at index ${targetIdx}.`,
    codeLine: 14,
    phase: 'done',
  }));

  return steps;
}

export const llInsertionCodeTemplates = {
  javascript: `class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function insertNode(head, index, val) {
  const newNode = new ListNode(val);
  if (index === 0) {
    newNode.next = head;
    return newNode; // New Head
  }
  let current = head;
  for (let i = 0; i < index - 1 && current !== null; i++) {
    current = current.next;
  }
  if (current !== null) {
    newNode.next = current.next; // Connect newNode -> next
    current.next = newNode;      // Connect current -> newNode
  }
  return head;
}`,

  python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def insert_node(head, index, val):
    new_node = ListNode(val)
    if index == 0:
        new_node.next = head
        return new_node
    current = head
    for i in range(index - 1):
        if current is None:
            break
        current = current.next
    if current:
        new_node.next = current.next
        current.next = new_node
    return head`,

  cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* insertNode(ListNode* head, int index, int val) {
    ListNode* newNode = new ListNode(val);
    if (index == 0) {
        newNode->next = head;
        return newNode;
    }
    ListNode* current = head;
    for (int i = 0; i < index - 1 && current != nullptr; i++) {
        current = current->next;
    }
    if (current != nullptr) {
        newNode->next = current->next;
        current->next = newNode;
    }
    return head;
}`,

  java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public ListNode insertNode(ListNode head, int index, int val) {
    ListNode newNode = new ListNode(val);
    if (index == 0) {
        newNode.next = head;
        return newNode;
    }
    ListNode current = head;
    for (int i = 0; i < index - 1 && current != null; i++) {
        current = current.next;
    }
    if (current != null) {
        newNode.next = current.next;
        current.next = newNode;
    }
    return head;
}`,

  c: `struct ListNode {
    int val;
    struct ListNode* next;
};

struct ListNode* insertNode(struct ListNode* head, int index, int val) {
    struct ListNode* newNode = (struct ListNode*)malloc(sizeof(struct ListNode));
    newNode->val = val;
    newNode->next = NULL;
    if (index == 0) {
        newNode->next = head;
        return newNode;
    }
    struct ListNode* current = head;
    for (int i = 0; i < index - 1 && current != NULL; i++) {
        current = current->next;
    }
    if (current != NULL) {
        newNode->next = current->next;
        current->next = newNode;
    }
    return head;
}`,
};
