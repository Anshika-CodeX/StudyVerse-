import type {
    WorkspaceStep,
    SupportedLanguage,
    LinkedListNodeData,
} from '../../types/workspace.types';
const mkStep = (
    partial: Omit<
        WorkspaceStep,
        'currentIndexes' | 'activeIndexes' | 'sortedIndexes'
    >
): WorkspaceStep => ({
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    ...partial,
});

export function generateLLSwapSteps(
    values: number[],
    index1: number = 1,
    index2: number = 2
): WorkspaceStep[] {
    const arr = values.length > 0 ? [...values] : [10, 20, 30, 40];
    const steps: WorkspaceStep[] = [];

    const createNodes = (data: number[]): LinkedListNodeData[] =>
        data.map((val, idx) => ({
            id: `node-${idx}`,
            value: val,
            nextId: idx < data.length - 1 ? `node-${idx + 1}` : null,
        }));

    // Step 1: Initial list
    steps.push(
        mkStep({
            arrayState: [...arr],
            linkedListState: {
                nodes: createNodes(arr),
                pointers: [
                    { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
                ],
                activeNodeIds: [],
            },
            variables: { index1, index2 },
            explanation: `Swap the values at positions ${index1} and ${index2}.`,
            codeLine: 0,
            phase: 'idle',
        })
    );

    // Step 2: Select first node
    steps.push(
        mkStep({
            arrayState: [...arr],
            linkedListState: {
                nodes: createNodes(arr),
                pointers: [
                    { name: 'FIRST', nodeId: `node-${index1}`, color: 'amber' },
                ],
                activeNodeIds: [`node-${index1}`],
            },
            variables: { firstValue: arr[index1] },
            explanation: `Select the first node at position ${index1}. Value = ${arr[index1]}.`,
            codeLine: 1,
            phase: 'compare',
        })
    );

    // Step 3: Select second node
    steps.push(
        mkStep({
            arrayState: [...arr],
            linkedListState: {
                nodes: createNodes(arr),
                pointers: [
                    { name: 'FIRST', nodeId: `node-${index1}`, color: 'amber' },
                    { name: 'SECOND', nodeId: `node-${index2}`, color: 'purple' },
                ],
                activeNodeIds: [`node-${index1}`, `node-${index2}`],
            },
            variables: {
                firstValue: arr[index1],
                secondValue: arr[index2],
            },
            explanation: `Select the second node at position ${index2}. Value = ${arr[index2]}.`,
            codeLine: 2,
            phase: 'compare',
        })
    );

    // Step 4: Swap
    const swapped = [...arr];
    [swapped[index1], swapped[index2]] = [
        swapped[index2],
        swapped[index1],
    ];

    steps.push(
        mkStep({
            arrayState: [...swapped],
            linkedListState: {
                nodes: createNodes(swapped),
                pointers: [
                    { name: 'HEAD', nodeId: 'node-0', color: 'cyan' },
                ],
                successNodeIds: [`node-${index1}`, `node-${index2}`],
            },
            variables: {
                result: `${arr[index1]} ↔ ${arr[index2]}`,
            },
            explanation: `Swap complete! The values ${arr[index1]} and ${arr[index2]} have been swapped.`,
            codeLine: 3,
            phase: 'done',
        })
    );

    return steps;
}

export const llSwapCodeTemplates: Record<SupportedLanguage, string> = {
    javascript: `function swapValues(head, index1, index2) {
  let current = head;
  let position = 0;
  let first = null;
  let second = null;

  while (current !== null) {
    if (position === index1) first = current;
    if (position === index2) second = current;
    current = current.next;
    position++;
  }

  if (first && second) {
    const temp = first.val;
    first.val = second.val;
    second.val = temp;
  }

  return head;
}`,

    python: `def swap_values(head, index1, index2):
    current = head
    position = 0
    first = None
    second = None

    while current:
        if position == index1:
            first = current
        if position == index2:
            second = current
        current = current.next
        position += 1

    if first and second:
        first.val, second.val = second.val, first.val

    return head`,

    cpp: `ListNode* swapValues(ListNode* head, int index1, int index2) {
    ListNode* current = head;
    ListNode* first = nullptr;
    ListNode* second = nullptr;
    int position = 0;

    while (current != nullptr) {
        if (position == index1) first = current;
        if (position == index2) second = current;
        current = current->next;
        position++;
    }

    if (first != nullptr && second != nullptr) {
        int temp = first->val;
        first->val = second->val;
        second->val = temp;
    }

    return head;
}`,

    java: `public ListNode swapValues(ListNode head, int index1, int index2) {
    ListNode current = head;
    ListNode first = null;
    ListNode second = null;
    int position = 0;

    while (current != null) {
        if (position == index1) first = current;
        if (position == index2) second = current;
        current = current.next;
        position++;
    }

    if (first != null && second != null) {
        int temp = first.val;
        first.val = second.val;
        second.val = temp;
    }

    return head;
}`,

    c: `struct ListNode* swapValues(struct ListNode* head, int index1, int index2) {
    struct ListNode* current = head;
    struct ListNode* first = NULL;
    struct ListNode* second = NULL;
    int position = 0;

    while (current != NULL) {
        if (position == index1) first = current;
        if (position == index2) second = current;
        current = current->next;
        position++;
    }

    if (first != NULL && second != NULL) {
        int temp = first->val;
        first->val = second->val;
        second->val = temp;
    }

    return head;
}`,
};