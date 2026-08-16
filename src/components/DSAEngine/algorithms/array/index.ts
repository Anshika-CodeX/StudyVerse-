// Central registry for all array algorithm generators and code templates.
// To add a new operation: create a file, export the generator + templates, register here.

export { generateTraversalSteps, traversalCodeTemplates } from './traversal';
export { generateInsertionSteps, insertionCodeTemplates } from './insertion';
export { generateDeletionSteps, deletionCodeTemplates } from './deletion';
export { generateUpdateSteps, updateCodeTemplates } from './update';
export { generateReverseSteps, reverseCodeTemplates } from './reverse';
export { generateRotateSteps, rotateCodeTemplates } from './rotate';
export { generateLinearSearchSteps, linearSearchCodeTemplates } from './linearSearch';
export { generateBinarySearchSteps, binarySearchCodeTemplates } from './binarySearch';
export { generateBubbleSortSteps, bubbleSortCodeTemplates } from './bubbleSort';

export { generateReverseArraySteps, reverseArrayCodeTemplates } from './reverseArray';
export { generateFindMaxSteps, findMaxCodeTemplates } from './findMax';
export { generatePracticeLinearSearchSteps, practiceLinearSearchCodeTemplates } from './practiceLinearSearch';
export { generatePracticeBinarySearchSteps, practiceBinarySearchCodeTemplates } from './practiceBinarySearch';
export { generateTwoSumSteps, twoSumCodeTemplates } from './twoSum';

import type { ArrayOperation, AlgorithmParams, WorkspaceStep, SupportedLanguage } from '../../types/workspace.types';
import { generateTraversalSteps, traversalCodeTemplates } from './traversal';
import { generateInsertionSteps, insertionCodeTemplates } from './insertion';
import { generateDeletionSteps, deletionCodeTemplates } from './deletion';
import { generateUpdateSteps, updateCodeTemplates } from './update';
import { generateReverseSteps, reverseCodeTemplates } from './reverse';
import { generateRotateSteps, rotateCodeTemplates } from './rotate';
import { generateLinearSearchSteps, linearSearchCodeTemplates } from './linearSearch';
import { generateBinarySearchSteps, binarySearchCodeTemplates } from './binarySearch';
import { generateBubbleSortSteps, bubbleSortCodeTemplates } from './bubbleSort';

import { generateReverseArraySteps, reverseArrayCodeTemplates } from './reverseArray';
import { generateFindMaxSteps, findMaxCodeTemplates } from './findMax';
import { generatePracticeLinearSearchSteps, practiceLinearSearchCodeTemplates } from './practiceLinearSearch';
import { generatePracticeBinarySearchSteps, practiceBinarySearchCodeTemplates } from './practiceBinarySearch';
import { generateTwoSumSteps, twoSumCodeTemplates } from './twoSum';

// ── Unified step generator ─────────────────────────────────────
export function generateSteps(
  operation: ArrayOperation,
  arr: number[],
  params: AlgorithmParams
): WorkspaceStep[] {
  switch (operation) {
    case 'Traversal':
      return generateTraversalSteps(arr);
    case 'Insertion':
      return generateInsertionSteps(arr, params.insertIndex ?? arr.length, params.insertValue ?? 0);
    case 'Deletion':
      return generateDeletionSteps(arr, params.deleteIndex ?? 0);
    case 'Update':
      return generateUpdateSteps(arr, params.updateIndex ?? 0, params.updateValue ?? 0);
    case 'Reverse':
      return generateReverseSteps(arr);
    case 'Rotate':
      return generateRotateSteps(arr, params.rotateBy ?? 1);
    case 'LinearSearch':
      return generateLinearSearchSteps(arr, params.searchTarget ?? arr[0]);
    case 'BinarySearch':
      return generateBinarySearchSteps(arr, params.searchTarget ?? arr[0]);
    case 'BubbleSort':
      return generateBubbleSortSteps(arr);
    // ── Practice Problems ──
    case 'ReverseArray':
      return generateReverseArraySteps(arr);
    case 'FindMax':
      return generateFindMaxSteps(arr);
    case 'PracticeLinearSearch':
      return generatePracticeLinearSearchSteps(arr, params.searchTarget ?? 8);
    case 'PracticeBinarySearch':
      return generatePracticeBinarySearchSteps(arr, params.searchTarget ?? 9);
    case 'TwoSum':
      return generateTwoSumSteps(arr, params.twoSumTarget ?? params.searchTarget ?? 9);
    default:
      return generateTraversalSteps(arr);
  }
}

// ── Unified code template getter ───────────────────────────────
const CODE_TEMPLATES: Record<ArrayOperation, Record<SupportedLanguage, string>> = {
  Traversal: traversalCodeTemplates,
  Insertion: insertionCodeTemplates,
  Deletion: deletionCodeTemplates,
  Update: updateCodeTemplates,
  Reverse: reverseCodeTemplates,
  Rotate: rotateCodeTemplates,
  LinearSearch: linearSearchCodeTemplates,
  BinarySearch: binarySearchCodeTemplates,
  BubbleSort: bubbleSortCodeTemplates,
  // ── Practice Problems ──
  ReverseArray: reverseArrayCodeTemplates,
  FindMax: findMaxCodeTemplates,
  PracticeLinearSearch: practiceLinearSearchCodeTemplates,
  PracticeBinarySearch: practiceBinarySearchCodeTemplates,
  TwoSum: twoSumCodeTemplates,
};

export function getCodeTemplate(operation: ArrayOperation, language: SupportedLanguage): string {
  return CODE_TEMPLATES[operation]?.[language] ?? '// No template available';
}
