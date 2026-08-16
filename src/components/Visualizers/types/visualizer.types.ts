export type DSATopic = 'Array' | 'Stack' | 'Queue' | 'LinkedList' | 'Tree' | 'Graph';

export interface VisualizerVariables {
  i?: number;
  j?: number;
  left?: number;
  right?: number;
  mid?: number;
  top?: number;
  front?: number;
  rear?: number;
  [key: string]: number | string | undefined; // Extensible for specific algos
}

export interface VisualizerStep {
  // State definitions (only one is typically populated per topic)
  arrayState?: number[];
  stackState?: number[];
  queueState?: number[];
  linkedListState?: number[]; // Future: Could be array of node values or objects
  
  // Highlighting and Pointers
  currentIndexes: number[];
  activeIndexes: number[];
  
  // Context
  variables?: VisualizerVariables;
  explanation: string;
  codeLine?: number;
}

export interface DSAVisualizerData {
  topic: DSATopic;
  operation: string;
  question: string;
  complexity: {
    time: string;
    space: string;
  };
  notes: string[];
  edgeCases: string[];
  interviewQuestions: string[];
  practiceProblems: string[];
  code: string;
  language: string;
  steps: VisualizerStep[];
}
