// ============================================================
// DSA Workspace — Shared Types
// All data structures, algorithms, and UI state live here.
// Fully modular: adding Stack/Queue/Tree requires only extending
// DSATopic and adding a new generator — no refactoring needed.
// ============================================================

// ── Topic Registry ──────────────────────────────────────────
export type DSATopic = 'Array' | 'Stack' | 'Queue' | 'LinkedList' | 'Tree' | 'Graph' | 'DP';

// ── Array Operations ─────────────────────────────────────────
export type ArrayOperation =
  | 'Traversal'
  | 'Insertion'
  | 'Deletion'
  | 'Update'
  | 'Reverse'
  | 'Rotate'
  | 'LinearSearch'
  | 'BinarySearch'
  | 'BubbleSort'
  // ── Practice Problems ──
  | 'ReverseArray'
  | 'FindMax'
  | 'PracticeLinearSearch'
  | 'PracticeBinarySearch'
  | 'TwoSum';

// ── Linked List Operations ───────────────────────────────────
export type LinkedListOperation =
  | 'LL_Traversal'
  | 'LL_Insertion'
  | 'LL_Deletion'
  | 'LL_Reverse'
  | 'LL_Search'
  | 'LL_Swap';

// Generic operation type — extend for future data structures
export type StackOperation =
  | 'Stack_Traversal'
  | 'Stack_Push'
  | 'Stack_Pop'
  | 'Stack_ValidParentheses'
  | 'Stack_NextGreaterElement'
  | 'Stack_Reverse'
  | 'Stack_PostfixToPrefix';

export type DSAOperation = ArrayOperation | LinkedListOperation | StackOperation | string;

// ── Step Phase ───────────────────────────────────────────────
export type StepPhase =
  | 'traverse'
  | 'compare'
  | 'swap'
  | 'insert'
  | 'delete'
  | 'update'
  | 'found'
  | 'not_found'
  | 'sorted'
  | 'done'
  | 'rotate'
  | 'idle';

// ── Visualization Step ────────────────────────────────────────
// One step in the animation timeline.
// Designed to be structure-agnostic; only the relevant state
// field is populated (arrayState for arrays, stackState later etc.)
export interface StackState {
  values: Array<number | string>;
  topIndex: number | null;
  activeIndices?: number[];
  comparingIndices?: number[];
  successIndices?: number[];
  dimmedIndices?: number[];
}

export interface WorkspaceStep {
  // Data state
  arrayState: number[];

  // Highlighting
  currentIndexes: number[];   // Neon-blue: pointer/cursor positions
  activeIndexes: number[];    // Neon-pink: comparing / swapping / found
  sortedIndexes: number[];    // Neon-green: confirmed sorted/processed

  // Optional
  pivotIndex?: number;        // Neon-amber: pivot in partition algorithms

  // Linked List state (present when operation is Linked List)
  linkedListState?: LinkedListState;
  stackState?: StackState;

  // Context
  variables: Record<string, number | string | boolean>;
  explanation: string;        // Human-readable step description
  codeLine: number;           // 0-indexed line to highlight in editor

  // Metadata
  phase: StepPhase;
}

// ── Algorithm Params ─────────────────────────────────────────
// Each generator receives these — all are optional and algorithm-specific
export interface AlgorithmParams {
  insertIndex?: number;
  insertValue?: number;
  deleteIndex?: number;
  updateIndex?: number;
  updateValue?: number;
  searchTarget?: number;
  rotateBy?: number;
  twoSumTarget?: number;  // for Two Sum practice problem
  linkedListValues?: number[]; // for linked list custom values
  firstIndex?: number;
  secondIndex?: number;
  pushValue?: number;
  popCount?: number;
  expression?: string;
}

// ── Linked List Visualization State ─────────────────────────────
export interface LinkedListNodeData {
  id: string;            // unique node ID (e.g. 'node-0', 'node-1', 'new-node')
  value: number;
  nextId: string | null; // ID of next node, or null if points to NULL
  isNew?: boolean;       // true if detached node created during insertion
}

export interface LinkedListPointerData {
  name: string;          // 'HEAD' | 'CURRENT' | 'PREV' | 'NEXT' | 'TARGET' | 'NEW' | 'TEMP'
  nodeId: string | null; // target node ID or null if points to NULL
  color?: 'cyan' | 'amber' | 'purple' | 'pink' | 'emerald' | 'blue';
}

export interface LinkedListState {
  nodes: LinkedListNodeData[];
  pointers: LinkedListPointerData[];
  activeNodeIds?: string[];    // Cyan: active/current node
  comparingNodeIds?: string[]; // Amber: comparing/temporary node
  specialNodeIds?: string[];   // Pink/Purple: pointer rewiring
  successNodeIds?: string[];   // Green: found/completed node
  dimmedNodeIds?: string[];    // Dimmed/inactive node
}

// ── Problem Definition ────────────────────────────────────────
// Used by ProblemPanel — supports future "Problem Library"
export interface TestCase {
  id: string;
  label: string;
  input: {
    array: number[];
    params?: AlgorithmParams;
  };
  expectedOutput?: number | number[] | string;
  description?: string;
}

export interface ProblemDefinition {
  id: string;
  topic: DSATopic;
  operation: DSAOperation;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  tutorial: string[];         // Step-by-step tutorial text (syncs with animation)
  examples: string[];
  hints: string[];
  complexity: {
    time: string;
    space: string;
    note?: string;
  };
  testCases: TestCase[];
  defaultArray: number[];
  defaultParams: AlgorithmParams;
  codeTemplates: Record<SupportedLanguage, string>;
}

// ── Languages ─────────────────────────────────────────────────
export type SupportedLanguage = 'javascript' | 'python' | 'cpp' | 'java' | 'c';

// ── Visualization Mode ────────────────────────────────────────
export type VisualizationMode = 'bars' | 'boxes' | 'both';

// ── Playback State ────────────────────────────────────────────
export interface PlaybackState {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;  // multiplier: 0.25 | 0.5 | 1 | 1.5 | 2 | 4
}

// ── Debugger State ────────────────────────────────────────────
export interface DebuggerState {
  variables: Record<string, number | string | boolean>;
  currentLine: number;
  executionHistory: WorkspaceStep[];
  phase: StepPhase;
}

// ── Test Run Result ───────────────────────────────────────────
export interface TestRunResult {
  testCaseId: string;
  passed: boolean;
  actual: number | number[] | string;
  expected?: number | number[] | string;
  steps: number;
  executionTime: number;  // ms
}

// ── Workspace UI State ────────────────────────────────────────
export interface WorkspaceUIState {
  selectedTopic: DSATopic;
  selectedOperation: DSAOperation;
  visualMode: VisualizationMode;
  language: SupportedLanguage;
  problemPanelTab: 'description' | 'tutorial' | 'examples' | 'hints' | 'complexity';
  bottomTab: 'testcases' | 'debugger' | 'output';
  isFullscreen: boolean;
  customArray: number[];
  customParams: AlgorithmParams;
}
