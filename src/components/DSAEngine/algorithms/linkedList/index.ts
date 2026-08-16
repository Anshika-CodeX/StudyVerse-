import type { LinkedListOperation, AlgorithmParams, WorkspaceStep, SupportedLanguage } from '../../types/workspace.types';
import { generateLLTraversalSteps, llTraversalCodeTemplates } from './traversal';
import { generateLLInsertionSteps, llInsertionCodeTemplates } from './insertion';
import { generateLLDeletionSteps, llDeletionCodeTemplates } from './deletion';
import { generateLLReverseSteps, llReverseCodeTemplates } from './reverse';
import { generateLLSearchSteps, llSearchCodeTemplates } from './search';
import { generateLLSwapSteps, llSwapCodeTemplates } from './swap';

export { generateLLTraversalSteps, llTraversalCodeTemplates } from './traversal';
export { generateLLInsertionSteps, llInsertionCodeTemplates } from './insertion';
export { generateLLDeletionSteps, llDeletionCodeTemplates } from './deletion';
export { generateLLReverseSteps, llReverseCodeTemplates } from './reverse';
export { generateLLSearchSteps, llSearchCodeTemplates } from './search';
export { generateLLSwapSteps, llSwapCodeTemplates } from './swap';

export function generateLinkedListSteps(
  operation: LinkedListOperation,
  arr: number[],
  params: AlgorithmParams
): WorkspaceStep[] {
  switch (operation) {
    case 'LL_Traversal':
      return generateLLTraversalSteps(arr);
    case 'LL_Insertion':
      return generateLLInsertionSteps(arr, params.insertIndex ?? 1, params.insertValue ?? 15);
    case 'LL_Deletion':
      return generateLLDeletionSteps(arr, params.deleteIndex ?? 2);
    case 'LL_Reverse':
      return generateLLReverseSteps(arr);
    case 'LL_Search':
      return generateLLSearchSteps(arr, params.searchTarget ?? 30);
    case 'LL_Swap':
      return generateLLSwapSteps(arr, params.firstIndex ?? 1, params.secondIndex ?? 2);
    default:
      return generateLLTraversalSteps(arr);
  }
}

const LINKED_LIST_CODE_TEMPLATES: Record<LinkedListOperation, Record<SupportedLanguage, string>> = {
  LL_Traversal: llTraversalCodeTemplates,
  LL_Insertion: llInsertionCodeTemplates,
  LL_Deletion: llDeletionCodeTemplates,
  LL_Reverse: llReverseCodeTemplates,
  LL_Search: llSearchCodeTemplates,
  LL_Swap: llSwapCodeTemplates,
};

export function getLinkedListCodeTemplate(operation: LinkedListOperation, language: SupportedLanguage): string {
  return LINKED_LIST_CODE_TEMPLATES[operation]?.[language] ?? '// No template available';
}
