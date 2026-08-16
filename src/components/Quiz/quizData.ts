export type QuizTopic = 'Array' | 'Linked List' | 'Stack';

export interface QuizQuestion {
  id: number;
  topic: QuizTopic;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const QUIZ_TOPICS: QuizTopic[] = ['Array', 'Linked List', 'Stack'];
export const QUIZ_COUNTS = [5, 10, 15] as const;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Array (15)
  { id: 101, topic: 'Array', question: 'What is the time complexity of accessing arr[i] in an array?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 0, explanation: 'Array indexing uses direct address calculation, so random access is O(1).' },
  { id: 102, topic: 'Array', question: 'Which operation is typically O(n) in a dynamic array when done at index 0?', options: ['Read element', 'Append at end (amortized)', 'Insert at beginning', 'Check length'], correctAnswer: 2, explanation: 'Inserting at the front shifts all existing elements right, making it O(n).' },
  { id: 103, topic: 'Array', question: 'Binary search requires the array to be:', options: ['Circular', 'Sorted', 'Unique', '2D'], correctAnswer: 1, explanation: 'Binary search relies on sorted order to eliminate half each step.' },
  { id: 104, topic: 'Array', question: 'What is the worst-case complexity of linear search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], correctAnswer: 2, explanation: 'Linear search may scan every element in the worst case.' },
  { id: 105, topic: 'Array', question: 'What does in-place array reversal mainly optimize?', options: ['Speed only', 'Memory usage', 'Stability', 'Hash collisions'], correctAnswer: 1, explanation: 'In-place reversal avoids extra arrays, so auxiliary space is O(1).' },
  { id: 106, topic: 'Array', question: 'The two-pointer approach for reversing an array swaps:', options: ['Only middle values', 'Adjacent values only', 'Symmetric ends moving inward', 'Random indices'], correctAnswer: 2, explanation: 'Left and right pointers swap mirror positions until they meet.' },
  { id: 107, topic: 'Array', question: 'Which algorithm repeatedly swaps adjacent out-of-order elements?', options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Heap Sort'], correctAnswer: 2, explanation: 'Bubble sort compares and swaps adjacent elements through passes.' },
  { id: 108, topic: 'Array', question: 'For an array of length n, valid indices are:', options: ['1 to n', '0 to n', '0 to n-1', '-1 to n-1'], correctAnswer: 2, explanation: 'Zero-based arrays index from 0 through n-1.' },
  { id: 109, topic: 'Array', question: 'Which statement about arrays is true?', options: ['Elements are in contiguous memory', 'Each element stores pointer to next', 'Insertion anywhere is O(1)', 'No fixed order'], correctAnswer: 0, explanation: 'Arrays store elements contiguously, enabling fast indexed access.' },
  { id: 110, topic: 'Array', question: 'What is the main drawback of array deletion at middle index?', options: ['Needs hashing', 'Needs balancing', 'Needs shifting elements', 'Cannot delete'], correctAnswer: 2, explanation: 'Deleting from the middle shifts trailing elements left.' },
  { id: 111, topic: 'Array', question: 'Rotate array by k using reversal trick has complexity:', options: ['O(k)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 1, explanation: 'Three reversals each linear still total O(n).' },
  { id: 112, topic: 'Array', question: 'If target appears first, linear search best case is:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 0, explanation: 'Best case stops immediately at index 0.' },
  { id: 113, topic: 'Array', question: 'What is returned when binary search fails to find target?', options: ['Always 0', 'Always n', '-1 (commonly)', 'Middle index'], correctAnswer: 2, explanation: 'Many implementations return -1 to indicate not found.' },
  { id: 114, topic: 'Array', question: 'Two Sum optimized solution usually uses:', options: ['Stack', 'Queue', 'Hash map', 'Tree traversal'], correctAnswer: 2, explanation: 'Hash map stores complements/seen values for O(n) lookup.' },
  { id: 115, topic: 'Array', question: 'When appending to dynamic array occasionally expensive, average append is:', options: ['O(1) amortized', 'O(log n)', 'O(n)', 'O(n^2)'], correctAnswer: 0, explanation: 'Resizing is occasional; averaged over many appends, cost is amortized O(1).' },

  // Linked List (15)
  { id: 201, topic: 'Linked List', question: 'Searching in a singly linked list is typically:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 2, explanation: 'Without indexing, nodes must be traversed one by one.' },
  { id: 202, topic: 'Linked List', question: 'Insert at head in singly linked list takes:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], correctAnswer: 0, explanation: 'Update newNode.next and head directly without traversal.' },
  { id: 203, topic: 'Linked List', question: 'Fast/slow pointer method is commonly used to:', options: ['Sort list', 'Find middle node', 'Compress list', 'Hash node values'], correctAnswer: 1, explanation: 'Fast moves 2 steps, slow moves 1; slow reaches middle.' },
  { id: 204, topic: 'Linked List', question: 'A null head pointer means:', options: ['One-node list', 'List is empty', 'Cycle exists', 'Tail missing'], correctAnswer: 1, explanation: 'Head null indicates no first node, so list is empty.' },
  { id: 205, topic: 'Linked List', question: 'Main advantage of linked list over array:', options: ['Faster random access', 'Easy insertion/deletion at known node', 'Lower memory always', 'Cache-friendly layout'], correctAnswer: 1, explanation: 'Pointer rewiring can avoid shifting many elements.' },
  { id: 206, topic: 'Linked List', question: 'To delete node after prev, update:', options: ['prev = prev.next', 'prev.next = prev.next.next', 'head = null always', 'tail = head'], correctAnswer: 1, explanation: 'Bypassing target node removes it from chain.' },
  { id: 207, topic: 'Linked List', question: 'Reversing a singly linked list primarily changes:', options: ['Node values only', 'Node memory addresses', 'Next pointers', 'Head type'], correctAnswer: 2, explanation: 'Reversal rewires next references for each node.' },
  { id: 208, topic: 'Linked List', question: 'Cycle detection commonly uses:', options: ['Binary search', 'Floyd tortoise-hare', 'Heap sort', 'Prefix sums'], correctAnswer: 1, explanation: 'Two pointers moving at different speeds detect loops.' },
  { id: 209, topic: 'Linked List', question: 'Random access to k-th node in singly linked list is:', options: ['O(1)', 'O(k) from head', 'O(log k)', 'Impossible'], correctAnswer: 1, explanation: 'Must traverse from head to the k-th position.' },
  { id: 210, topic: 'Linked List', question: 'Tail insertion is O(1) when:', options: ['List sorted', 'Tail pointer maintained', 'Using recursion', 'No duplicates'], correctAnswer: 1, explanation: 'Direct tail reference avoids traversal.' },
  { id: 211, topic: 'Linked List', question: 'In doubly linked list each node stores:', options: ['Only next', 'Only prev', 'prev and next', 'Index and value only'], correctAnswer: 2, explanation: 'Doubly linked nodes point both backward and forward.' },
  { id: 212, topic: 'Linked List', question: 'Linked list traversal ends when:', options: ['Node value is 0', 'next points to head', 'current is null', 'size is odd'], correctAnswer: 2, explanation: 'Null indicates no more nodes in standard singly list.' },
  { id: 213, topic: 'Linked List', question: 'Swapping two nodes by value means:', options: ['Exchange next pointers only', 'Exchange node values', 'Delete and reinsert always', 'Sort whole list'], correctAnswer: 1, explanation: 'Value swap keeps structure same but values exchanged.' },
  { id: 214, topic: 'Linked List', question: 'Which is true about memory locality in linked list?', options: ['Usually contiguous', 'Better than arrays', 'Often non-contiguous', 'Always in stack memory'], correctAnswer: 2, explanation: 'Nodes are often scattered, reducing cache locality.' },
  { id: 215, topic: 'Linked List', question: 'Finding nth node from end can be done with:', options: ['Sorting first', 'Two pointers with gap', 'Hashing all pairs', 'Binary heap'], correctAnswer: 1, explanation: 'Maintain fixed gap; when fast ends, slow is at desired node.' },

  // Stack (15)
  { id: 301, topic: 'Stack', question: 'Stack follows which order?', options: ['FIFO', 'LIFO', 'Priority', 'Random'], correctAnswer: 1, explanation: 'Stack is Last-In First-Out.' },
  { id: 302, topic: 'Stack', question: 'Which operation inserts an element into stack?', options: ['enqueue', 'dequeue', 'push', 'peek'], correctAnswer: 2, explanation: 'Push adds a new item at the top.' },
  { id: 303, topic: 'Stack', question: 'Which operation removes top element?', options: ['peek', 'pop', 'push', 'front'], correctAnswer: 1, explanation: 'Pop removes and returns the top item.' },
  { id: 304, topic: 'Stack', question: 'Peek/top operation complexity is usually:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 0, explanation: 'Top can be read directly without traversal.' },
  { id: 305, topic: 'Stack', question: 'Valid parentheses checking uses stack because:', options: ['Sorts brackets', 'Matches nested order', 'Reduces memory to O(1)', 'Avoids loops'], correctAnswer: 1, explanation: 'Most recent opening bracket must match first closing bracket encountered.' },
  { id: 306, topic: 'Stack', question: 'If popping from empty stack, it is called:', options: ['Overflow', 'Underflow', 'Collision', 'Saturation'], correctAnswer: 1, explanation: 'Underflow occurs when removing from empty structure.' },
  { id: 307, topic: 'Stack', question: 'Function call management in many languages uses:', options: ['Queue', 'Stack', 'Graph', 'Tree map'], correctAnswer: 1, explanation: 'Call stack tracks active function frames in LIFO order.' },
  { id: 308, topic: 'Stack', question: 'Postfix expression evaluation commonly uses:', options: ['Binary search', 'Hash set', 'Stack', 'Trie'], correctAnswer: 2, explanation: 'Operands are pushed, operators pop needed operands.' },
  { id: 309, topic: 'Stack', question: 'Next Greater Element optimized solution uses:', options: ['Monotonic stack', 'Only recursion', 'Prefix tree', 'Adjacency matrix'], correctAnswer: 0, explanation: 'Monotonic stack tracks unresolved indices efficiently.' },
  { id: 310, topic: 'Stack', question: 'Which is true for array-based stack push?', options: ['Always O(n)', 'Usually O(1)', 'Requires sorting', 'Needs binary tree'], correctAnswer: 1, explanation: 'Push increments top and stores value; constant time in fixed capacity model.' },
  { id: 311, topic: 'Stack', question: 'To convert postfix to prefix, when operator appears:', options: ['Push operator only', 'Pop one operand', 'Pop two operands and combine', 'Reverse whole string'], correctAnswer: 2, explanation: 'Operator combines two popped expressions into new expression.' },
  { id: 312, topic: 'Stack', question: 'Stack traversal in array representation starts from:', options: ['Index 0', 'Middle index', 'Top index', 'Random index'], correctAnswer: 2, explanation: 'Top is the latest pushed element, visited first.' },
  { id: 313, topic: 'Stack', question: 'If top = -1 in array stack, stack is:', options: ['Full', 'Sorted', 'Empty', 'Circular'], correctAnswer: 2, explanation: 'Common convention uses -1 to indicate no elements.' },
  { id: 314, topic: 'Stack', question: 'Balanced expression final stack state should be:', options: ['One operator left', 'Two operands left', 'Empty', 'Half full'], correctAnswer: 2, explanation: 'All opening brackets must be matched and popped.' },
  { id: 315, topic: 'Stack', question: 'Reverse a stack recursively requires helper to:', options: ['Insert at bottom', 'Heapify stack', 'Sort by value', 'Binary partition'], correctAnswer: 0, explanation: 'Insert-at-bottom step rebuilds reversed order during unwinding.' },
];

export function getQuestionsByTopic(topic: QuizTopic): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((question) => question.topic === topic);
}

// Keep legacy Linked List test behavior intact for the existing DSATest page.
export const DSA_TEST_QUESTIONS: QuizQuestion[] = getQuestionsByTopic('Linked List').slice(0, 5);