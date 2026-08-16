import type { StackOperation, AlgorithmParams, WorkspaceStep, SupportedLanguage } from '../../types/workspace.types';

const mkStep = (partial: Omit<WorkspaceStep, 'currentIndexes' | 'activeIndexes' | 'sortedIndexes'>): WorkspaceStep => ({
  currentIndexes: [],
  activeIndexes: [],
  sortedIndexes: [],
  ...partial,
});

function normalizeNumberStack(values: number[]): number[] {
  return values.length > 0 ? [...values] : [10, 20, 30, 40];
}

function toStackState(values: Array<number | string>, topIndex: number | null, options?: {
  activeIndices?: number[];
  comparingIndices?: number[];
  successIndices?: number[];
  dimmedIndices?: number[];
}) {
  return {
    values,
    topIndex,
    activeIndices: options?.activeIndices ?? [],
    comparingIndices: options?.comparingIndices ?? [],
    successIndices: options?.successIndices ?? [],
    dimmedIndices: options?.dimmedIndices ?? [],
  };
}

export function generateStackTraversalSteps(values: number[]): WorkspaceStep[] {
  const stack = normalizeNumberStack(values);
  const steps: WorkspaceStep[] = [];

  steps.push(mkStep({
    arrayState: [...stack],
    stackState: toStackState([...stack], stack.length - 1, { activeIndices: [stack.length - 1] }),
    variables: { top: stack[stack.length - 1], size: stack.length },
    explanation: 'Stack traversal starts at the top of the stack. TOP points to the last element.',
    codeLine: 0,
    phase: 'idle',
  }));

  for (let i = stack.length - 1; i >= 0; i--) {
    steps.push(mkStep({
      arrayState: [...stack],
      stackState: toStackState([...stack], i, { activeIndices: [i], successIndices: stack.slice(i + 1).map((_, idx) => stack.length - idx - 1) }),
      variables: { top: stack[i], index: i, visited: stack[i] },
      explanation: `Visit stack element ${stack[i]} at index ${i}. The top pointer is currently at this element.`,
      codeLine: 2,
      phase: 'traverse',
    }));
  }

  steps.push(mkStep({
    arrayState: [...stack],
    stackState: toStackState([...stack], stack.length - 1, { successIndices: stack.map((_, idx) => idx) }),
    variables: { top: stack[stack.length - 1], size: stack.length, done: true },
    explanation: 'Traversal complete. Every stack element has been visited from top to bottom.',
    codeLine: 4,
    phase: 'done',
  }));

  return steps;
}

export function generateStackPushSteps(values: number[], pushValue: number = 40): WorkspaceStep[] {
  const stack = normalizeNumberStack(values);
  const steps: WorkspaceStep[] = [];

  steps.push(mkStep({
    arrayState: [...stack],
    stackState: toStackState([...stack], stack.length - 1, { activeIndices: [stack.length - 1] }),
    variables: { top: stack[stack.length - 1], pushValue },
    explanation: 'Prepare to push a new element onto the stack.',
    codeLine: 0,
    phase: 'idle',
  }));

  steps.push(mkStep({
    arrayState: [...stack],
    stackState: toStackState([...stack, pushValue], stack.length, { activeIndices: [stack.length], comparingIndices: [stack.length - 1] }),
    variables: { top: stack[stack.length - 1], newValue: pushValue },
    explanation: `Add ${pushValue} to the top of the stack. The new element becomes the new TOP.`,
    codeLine: 2,
    phase: 'insert',
  }));

  const final = [...stack, pushValue];
  steps.push(mkStep({
    arrayState: [...final],
    stackState: toStackState([...final], final.length - 1, { successIndices: [final.length - 1] }),
    variables: { top: final[final.length - 1], size: final.length },
    explanation: `Push complete. ${pushValue} is now at the top of the stack.`,
    codeLine: 4,
    phase: 'done',
  }));

  return steps;
}

export function generateStackPopSteps(values: number[], _popCount: number = 1): WorkspaceStep[] {
  const stack = normalizeNumberStack(values);
  const steps: WorkspaceStep[] = [];
  const removed = stack[stack.length - 1];

  steps.push(mkStep({
    arrayState: [...stack],
    stackState: toStackState([...stack], stack.length - 1, { activeIndices: [stack.length - 1] }),
    variables: { top: removed, size: stack.length },
    explanation: 'POP removes the top element from the stack.',
    codeLine: 0,
    phase: 'delete',
  }));

  const after = stack.slice(0, -1);
  steps.push(mkStep({
    arrayState: [...after],
    stackState: toStackState([...after], after.length - 1, { activeIndices: [after.length - 1] }),
    variables: { popped: removed, newTop: after[after.length - 1] ?? 'NULL', size: after.length },
    explanation: `Remove ${removed}. The new top is ${after[after.length - 1] ?? 'NULL'}.`,
    codeLine: 2,
    phase: 'delete',
  }));

  steps.push(mkStep({
    arrayState: [...after],
    stackState: toStackState([...after], after.length - 1, { successIndices: after.map((_, idx) => idx) }),
    variables: { top: after[after.length - 1] ?? 'NULL', result: removed },
    explanation: `Pop complete. ${removed} was removed from the stack.`,
    codeLine: 4,
    phase: 'done',
  }));

  return steps;
}

export function generateStackValidParenthesesSteps(expression: string = '([{}])'): WorkspaceStep[] {
  const expr = expression || '([{}])';
  const chars = expr.split('');
  const steps: WorkspaceStep[] = [];
  const stack: string[] = [];

  steps.push(mkStep({
    arrayState: [],
    stackState: toStackState([], null),
    variables: { expression: expr, valid: true },
    explanation: `Check whether the expression ${expr} is balanced using a stack.`,
    codeLine: 0,
    phase: 'idle',
  }));

  let valid = true;

  chars.forEach((char) => {
    const opening = ['(', '[', '{'];
    const closing = { ')': '(', ']': '[', '}': '{' };

    if (opening.includes(char)) {
      stack.push(char);
      steps.push(mkStep({
        arrayState: [],
        stackState: toStackState([...stack], stack.length - 1, { activeIndices: [stack.length - 1] }),
        variables: { currentChar: char, top: stack[stack.length - 1], valid: true },
        explanation: `Open bracket ${char} found. Push it onto the stack.`,
        codeLine: 2,
        phase: 'compare',
      }));
    } else if (closing[char as keyof typeof closing]) {
      const expected = closing[char as keyof typeof closing];
      const top = stack[stack.length - 1];
      if (top === expected) {
        stack.pop();
        steps.push(mkStep({
          arrayState: [],
          stackState: toStackState([...stack], stack.length - 1, { comparingIndices: [stack.length], successIndices: stack.map((_, idx) => idx) }),
          variables: { currentChar: char, expected, top, valid: true },
          explanation: `Close bracket ${char} matches top ${top}. Pop it from the stack.`,
          codeLine: 3,
          phase: 'found',
        }));
      } else {
        valid = false;
        steps.push(mkStep({
          arrayState: [],
          stackState: toStackState([...stack], stack.length - 1, { activeIndices: [stack.length - 1], dimmedIndices: stack.map((_, idx) => idx) }),
          variables: { currentChar: char, expected, top, valid: false },
          explanation: `Mismatch: expected ${expected} but found ${top}. The expression is invalid.`,
          codeLine: 4,
          phase: 'not_found',
        }));
      }
    }
  });

  if (stack.length === 0 && valid) {
    steps.push(mkStep({
      arrayState: [],
      stackState: toStackState([], null, { successIndices: [] }),
      variables: { valid: true, result: 'Balanced' },
      explanation: 'All brackets were matched. The expression is valid.',
      codeLine: 6,
      phase: 'done',
    }));
  } else if (valid) {
    steps.push(mkStep({
      arrayState: [],
      stackState: toStackState([...stack], stack.length - 1, { dimmedIndices: stack.map((_, idx) => idx) }),
      variables: { valid: false, result: 'Unbalanced' },
      explanation: 'The stack still contains unmatched opening brackets at the end.',
      codeLine: 6,
      phase: 'not_found',
    }));
  }

  return steps;
}

export function generateStackNextGreaterSteps(values: number[] = [4, 2, 7, 1, 9]): WorkspaceStep[] {
  const arr = values.length > 0 ? values : [4, 2, 7, 1, 9];
  const steps: WorkspaceStep[] = [];
  const stack: number[] = [];
  const result = Array(arr.length).fill(-1);

  steps.push(mkStep({
    arrayState: [...arr],
    stackState: toStackState([], null),
    variables: { input: arr.join(', '), current: 'none' },
    explanation: 'Scan the array from left to right. Maintain a monotonic stack of candidates for the next greater element.',
    codeLine: 0,
    phase: 'idle',
  }));

  arr.forEach((value, index) => {
    while (stack.length > 0 && arr[stack[stack.length - 1]] < value) {
      const poppedIndex = stack.pop()!;
      result[poppedIndex] = value;
      steps.push(mkStep({
        arrayState: [...arr],
        stackState: toStackState(stack.map(i => arr[i]), stack.length - 1, { activeIndices: [index], comparingIndices: [poppedIndex], successIndices: [poppedIndex] }),
        variables: { current: value, poppedIndex, nextGreater: value },
        explanation: `Current value ${value} is greater than stack top ${arr[poppedIndex]}. Pop it and set the next greater element to ${value}.`,
        codeLine: 2,
        phase: 'compare',
      }));
    }
    stack.push(index);
    steps.push(mkStep({
      arrayState: [...arr],
      stackState: toStackState(stack.map(i => arr[i]), stack.length - 1, { activeIndices: [index], successIndices: [index] }),
      variables: { current: value, stackTop: arr[stack[stack.length - 1]] },
      explanation: `Push index ${index} (${value}) onto the stack for future comparisons.`,
      codeLine: 4,
      phase: 'traverse',
    }));
  });

  steps.push(mkStep({
    arrayState: [...arr],
    stackState: toStackState(result.map(v => v === -1 ? 'N/A' : v), result.indexOf(Math.max(...result.filter(v => v !== -1))) >= 0 ? result.indexOf(Math.max(...result.filter(v => v !== -1))) : null, { successIndices: result.map((_, idx) => idx) }),
    variables: { result: result.join(', ') },
    explanation: `Final next-greater result: ${result.join(', ')}`,
    codeLine: 6,
    phase: 'done',
  }));

  return steps;
}

export function generateStackReverseSteps(values: number[] = [1, 2, 3, 4]): WorkspaceStep[] {
  const stack = normalizeNumberStack(values);
  const reversed = [...stack].reverse();
  const steps: WorkspaceStep[] = [];

  steps.push(mkStep({
    arrayState: [...stack],
    stackState: toStackState([...stack], stack.length - 1, { activeIndices: [stack.length - 1] }),
    variables: { start: stack.join(', ') },
    explanation: 'Reverse a stack by repeatedly popping elements and pushing them back in the opposite order.',
    codeLine: 0,
    phase: 'idle',
  }));

  for (let i = stack.length - 1; i >= 0; i--) {
    steps.push(mkStep({
      arrayState: [...stack],
      stackState: toStackState([...stack.slice(0, i + 1)], i, { activeIndices: [i], comparingIndices: [stack.length - 1] }),
      variables: { current: stack[i], remaining: stack.slice(0, i + 1).join(', ') },
      explanation: `Pop ${stack[i]} and place it back into the reversed stack order.`,
      codeLine: 2,
      phase: 'compare',
    }));
  }

  steps.push(mkStep({
    arrayState: [...reversed],
    stackState: toStackState([...reversed], reversed.length - 1, { successIndices: reversed.map((_, idx) => idx) }),
    variables: { result: reversed.join(', ') },
    explanation: `Reverse complete. The final stack is ${reversed.join(', ')}.`,
    codeLine: 5,
    phase: 'done',
  }));

  return steps;
}

export function generateStackPostfixToPrefixSteps(expression: string = 'A B C * +'): WorkspaceStep[] {
  const tokens = expression.trim().split(/\s+/);
  const stack: string[] = [];
  const steps: WorkspaceStep[] = [];

  steps.push(mkStep({
    arrayState: [],
    stackState: toStackState([], null),
    variables: { expression },
    explanation: `Convert postfix expression ${expression} to prefix by using a stack of temporary strings.`,
    codeLine: 0,
    phase: 'idle',
  }));

  for (const token of tokens) {
    if (/[A-Za-z0-9]/.test(token)) {
      stack.push(token);
      steps.push(mkStep({
        arrayState: [],
        stackState: toStackState([...stack], stack.length - 1, { activeIndices: [stack.length - 1] }),
        variables: { token, stackTop: token },
        explanation: `Token ${token} is an operand. Push it onto the stack.`,
        codeLine: 2,
        phase: 'traverse',
      }));
    } else {
      const right = stack.pop() ?? '';
      const left = stack.pop() ?? '';
      const combined = `${token}${left}${right}`;
      stack.push(combined);
      steps.push(mkStep({
        arrayState: [],
        stackState: toStackState([...stack], stack.length - 1, { activeIndices: [stack.length - 1], comparingIndices: [Math.max(0, stack.length - 2)] }),
        variables: { operator: token, left, right, combined },
        explanation: `Operator ${token} combines ${left} and ${right} into ${combined}.`,
        codeLine: 3,
        phase: 'compare',
      }));
    }
  }

  steps.push(mkStep({
    arrayState: [],
    stackState: toStackState([...stack], stack.length - 1, { successIndices: stack.map((_, idx) => idx) }),
    variables: { result: stack[0] ?? '' },
    explanation: `Conversion complete. Prefix result: ${stack[0] ?? ''}`,
    codeLine: 5,
    phase: 'done',
  }));

  return steps;
}

export function generateStackSteps(operation: StackOperation, arr: number[], params: AlgorithmParams): WorkspaceStep[] {
  switch (operation) {
    case 'Stack_Traversal':
      return generateStackTraversalSteps(arr);
    case 'Stack_Push':
      return generateStackPushSteps(arr, params.pushValue ?? 40);
    case 'Stack_Pop':
      return generateStackPopSteps(arr, params.popCount ?? 1);
    case 'Stack_ValidParentheses':
      return generateStackValidParenthesesSteps(params.expression ?? '([{}])');
    case 'Stack_NextGreaterElement':
      return generateStackNextGreaterSteps(arr.length ? arr : [4, 2, 7, 1, 9]);
    case 'Stack_Reverse':
      return generateStackReverseSteps(arr.length ? arr : [1, 2, 3, 4]);
    case 'Stack_PostfixToPrefix':
      return generateStackPostfixToPrefixSteps(params.expression ?? 'A B C * +');
    default:
      return generateStackTraversalSteps(arr);
  }
}

const STACK_CODE_TEMPLATES: Record<StackOperation, Record<SupportedLanguage, string>> = {
  Stack_Traversal: {
    javascript: `function traverseStack(stack) {\n  for (let i = stack.length - 1; i >= 0; i--) {\n    console.log(stack[i]);\n  }\n}`,
    python: `def traverse_stack(stack):\n    for value in reversed(stack):\n        print(value)`,
    cpp: `void traverseStack(vector<int> stack) {\n  for (int i = stack.size() - 1; i >= 0; i--) {\n    cout << stack[i] << " ";\n  }\n}`,
    java: `void traverseStack(int[] stack) {\n  for (int i = stack.length - 1; i >= 0; i--) {\n    System.out.print(stack[i] + " ");\n  }\n}`,
    c: `void traverseStack(int stack[], int size) {\n  for (int i = size - 1; i >= 0; i--) {\n    printf("%d ", stack[i]);\n  }\n}`,
  },
  Stack_Push: {
    javascript: `function push(stack, value) {\n  stack.push(value);\n  return stack;\n}`,
    python: `def push(stack, value):\n    stack.append(value)\n    return stack`,
    cpp: `void push(vector<int>& stack, int value) { stack.push_back(value); }`,
    java: `void push(ArrayList<Integer> stack, int value) { stack.add(value); }`,
    c: `void push(int stack[], int* top, int value) { stack[++(*top)] = value; }`,
  },
  Stack_Pop: {
    javascript: `function pop(stack) {\n  return stack.pop();\n}`,
    python: `def pop(stack):\n    return stack.pop()`,
    cpp: `int pop(vector<int>& stack) { int v = stack.back(); stack.pop_back(); return v; }`,
    java: `int pop(ArrayList<Integer> stack) { return stack.remove(stack.size() - 1); }`,
    c: `int pop(int stack[], int* top) { return stack[(*top)--]; }`,
  },
  Stack_ValidParentheses: {
    javascript: `function isBalanced(expr) {\n  const stack = [];\n  for (const ch of expr) {\n    if (['(', '[', '{'].includes(ch)) stack.push(ch);\n    else {\n      const top = stack.pop();\n      if ((ch === ')' && top !== '(') || (ch === ']' && top !== '[') || (ch === '}' && top !== '{')) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
    python: `def is_balanced(expr):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for ch in expr:\n        if ch in '([{':\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack`,
    cpp: `bool isBalanced(string expr) {\n  stack<char> s;\n  for (char ch : expr) {\n    if (ch == '(' || ch == '[' || ch == '{') s.push(ch);\n    else {\n      if (s.empty()) return false;\n      char top = s.top();\n      s.pop();\n      if ((ch == ')' && top != '(') || (ch == ']' && top != '[') || (ch == '}' && top != '{')) return false;\n    }\n  }\n  return s.empty();\n}`,
    java: `boolean isBalanced(String expr) {\n  Stack<Character> stack = new Stack<>();\n  for (char ch : expr.toCharArray()) {\n    if (ch == '(' || ch == '[' || ch == '{') stack.push(ch);\n    else {\n      if (stack.isEmpty()) return false;\n      char top = stack.pop();\n      if ((ch == ')' && top != '(') || (ch == ']' && top != '[') || (ch == '}' && top != '{')) return false;\n    }\n  }\n  return stack.isEmpty();\n}`,
    c: `int isBalanced(char expr[]) {\n  int top = -1;\n  char stack[100];\n  for (int i = 0; expr[i] != '\0'; i++) {\n    if (expr[i] == '(' || expr[i] == '[' || expr[i] == '{') stack[++top] = expr[i];\n    else {\n      if (top == -1) return 0;\n      char topChar = stack[top--];\n      if ((expr[i] == ')' && topChar != '(') || (expr[i] == ']' && topChar != '[') || (expr[i] == '}' && topChar != '{')) return 0;\n    }\n  }\n  return top == -1;\n}`,
  },
  Stack_NextGreaterElement: {
    javascript: `function nextGreater(arr) {\n  const stack = [];\n  const result = new Array(arr.length).fill(-1);\n  for (let i = 0; i < arr.length; i++) {\n    while (stack.length && arr[stack[stack.length - 1]] < arr[i]) {\n      const idx = stack.pop();\n      result[idx] = arr[i];\n    }\n    stack.push(i);\n  }\n  return result;\n}`,
    python: `def next_greater(arr):\n    stack = []\n    result = [-1] * len(arr)\n    for i, val in enumerate(arr):\n        while stack and arr[stack[-1]] < val:\n            idx = stack.pop()\n            result[idx] = val\n        stack.append(i)\n    return result`,
    cpp: `vector<int> nextGreater(vector<int> arr) {\n  stack<int> s;\n  vector<int> result(arr.size(), -1);\n  for (int i = 0; i < arr.size(); i++) {\n    while (!s.empty() && arr[s.top()] < arr[i]) {\n      int idx = s.top(); s.pop(); result[idx] = arr[i];\n    }\n    s.push(i);\n  }\n  return result;\n}`,
    java: `int[] nextGreater(int[] arr) {\n  Stack<Integer> stack = new Stack<>();\n  int[] result = new int[arr.length];\n  Arrays.fill(result, -1);\n  for (int i = 0; i < arr.length; i++) {\n    while (!stack.isEmpty() && arr[stack.peek()] < arr[i]) {\n      int idx = stack.pop();\n      result[idx] = arr[i];\n    }\n    stack.push(i);\n  }\n  return result;\n}`,
    c: `void nextGreater(int arr[], int n, int result[]) {\n  int top = -1;\n  int stack[100];\n  for (int i = 0; i < n; i++) {\n    while (top >= 0 && arr[stack[top]] < arr[i]) {\n      int idx = stack[top--]; result[idx] = arr[i];\n    }\n    stack[++top] = i;\n  }\n}`,
  },
  Stack_Reverse: {
    javascript: `function reverseStack(stack) {\n  if (stack.length === 0) return stack;\n  const top = stack.pop();\n  reverseStack(stack);\n  insertAtBottom(stack, top);\n  return stack;\n}`,
    python: `def reverse_stack(stack):\n    if not stack:\n        return stack\n    top = stack.pop()\n    reverse_stack(stack)\n    insert_at_bottom(stack, top)\n    return stack`,
    cpp: `void reverseStack(vector<int>& stack) {\n  if (stack.empty()) return;\n  int top = stack.back(); stack.pop_back();\n  reverseStack(stack);\n  insertAtBottom(stack, top);\n}`,
    java: `void reverseStack(Stack<Integer> stack) {\n  if (stack.isEmpty()) return;\n  int top = stack.pop();\n  reverseStack(stack);\n  insertAtBottom(stack, top);\n}`,
    c: `void reverseStack(int stack[], int* top) {\n  if (*top < 0) return;\n  int value = stack[(*top)--];\n  reverseStack(stack, top);\n  insertAtBottom(stack, top, value);\n}`,
  },
  Stack_PostfixToPrefix: {
    javascript: `function postfixToPrefix(expr) {\n  const stack = [];\n  for (const token of expr.split(' ')) {\n    if (/^[A-Za-z0-9]+$/.test(token)) stack.push(token);\n    else {\n      const a = stack.pop();\n      const b = stack.pop();\n      stack.push(token + b + a);\n    }\n  }\n  return stack[0];\n}`,
    python: `def postfix_to_prefix(expr):\n    stack = []\n    for token in expr.split():\n        if token.isalnum():\n            stack.append(token)\n        else:\n            a = stack.pop()\n            b = stack.pop()\n            stack.append(token + b + a)\n    return stack[0]`,
    cpp: `string postfixToPrefix(vector<string> tokens) {\n  stack<string> s;\n  for (const string& token : tokens) {\n    if (token == "+" || token == "-" || token == "*" || token == "/") {\n      string a = s.top(); s.pop();\n      string b = s.top(); s.pop();\n      s.push(token + b + a);\n    } else {\n      s.push(token);\n    }\n  }\n  return s.top();\n}`,
    java: `String postfixToPrefix(String expr) {\n  Stack<String> stack = new Stack<>();\n  for (String token : expr.split(" ")) {\n    if (token.matches("[A-Za-z0-9]+")) stack.push(token);\n    else {\n      String a = stack.pop();\n      String b = stack.pop();\n      stack.push(token + b + a);\n    }\n  }\n  return stack.pop();\n}`,
    c: `char* postfixToPrefix(char expr[]) {\n  // C implementation omitted for brevity; conceptually same as stack-based conversion.\n  return expr;\n}`,
  },
};

export function getStackCodeTemplate(operation: StackOperation, language: SupportedLanguage): string {
  return STACK_CODE_TEMPLATES[operation]?.[language] ?? '// No template available';
}
