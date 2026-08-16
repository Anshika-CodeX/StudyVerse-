import type { WorkspaceStep } from '../../types/workspace.types';

export function generateTwoSumSteps(arr: number[], target: number): WorkspaceStep[] {
  const steps: WorkspaceStep[] = [];
  const mapStr: Record<string, number> = {};

  steps.push({
    arrayState: [...arr],
    currentIndexes: [],
    activeIndexes: [],
    sortedIndexes: [],
    variables: { target, hashMap: '{}', i: -1 },
    explanation: `Two Sum HashMap Approach: Find two indices whose values add up to target = ${target}.`,
    codeLine: 0,
    phase: 'idle',
  });

  let foundPair: [number, number] | null = null;

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    const complement = target - val;
    const hasComplement = complement in mapStr;

    // Compare step
    steps.push({
      arrayState: [...arr],
      currentIndexes: [i],
      activeIndexes: hasComplement ? [mapStr[complement], i] : [],
      sortedIndexes: Object.values(mapStr),
      variables: {
        i,
        currentValue: val,
        target,
        complement,
        inHashMap: hasComplement ? `YES (index ${mapStr[complement]})` : 'NO',
        hashMap: JSON.stringify(mapStr),
      },
      explanation: `Index ${i}: currentValue = ${val}. Complement needed = ${target} - ${val} = ${complement}. Is ${complement} in HashMap? ${hasComplement ? 'YES!' : 'NO.'}`,
      codeLine: 3,
      phase: hasComplement ? 'found' : 'compare',
    });

    if (hasComplement) {
      foundPair = [mapStr[complement], i];
      steps.push({
        arrayState: [...arr],
        currentIndexes: [],
        activeIndexes: [foundPair[0], foundPair[1]],
        sortedIndexes: [foundPair[0], foundPair[1]],
        variables: {
          i,
          currentValue: val,
          target,
          complement,
          foundPair: `[${foundPair[0]}, ${foundPair[1]}]`,
          values: `${arr[foundPair[0]]} + ${arr[foundPair[1]]} = ${target}`,
          hashMap: JSON.stringify(mapStr),
        },
        explanation: `FOUND PAIR! Indices [${foundPair[0]}, ${foundPair[1]}] with values ${arr[foundPair[0]]} + ${arr[foundPair[1]]} = ${target}.`,
        codeLine: 4,
        phase: 'done',
      });
      break;
    } else {
      mapStr[val] = i;
      steps.push({
        arrayState: [...arr],
        currentIndexes: [i],
        activeIndexes: [],
        sortedIndexes: Object.values(mapStr),
        variables: {
          i,
          currentValue: val,
          target,
          complement,
          addedToMap: `${val} → index ${i}`,
          hashMap: JSON.stringify(mapStr),
        },
        explanation: `Add arr[${i}] = ${val} to HashMap: { ${val}: ${i} }. Move to next element.`,
        codeLine: 6,
        phase: 'insert',
      });
    }
  }

  if (!foundPair) {
    steps.push({
      arrayState: [...arr],
      currentIndexes: [],
      activeIndexes: [],
      sortedIndexes: [],
      variables: { target, result: 'No two elements sum to target', hashMap: JSON.stringify(mapStr) },
      explanation: `No two numbers in [${arr.join(', ')}] sum up to target ${target}.`,
      codeLine: 8,
      phase: 'not_found',
    });
  }

  return steps;
}

export const twoSumCodeTemplates = {
  javascript: `function twoSum(arr, target) {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    let complement = target - arr[i];
    if (map.has(complement)) {
      return [map.get(complement), i]; // Found pair
    }
    map.set(arr[i], i); // Insert into HashMap
  }
  return [];
}`,
  python: `def two_sum(arr, target):
    seen = {}
    for i, num in enumerate(arr):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]  # Found pair
        seen[num] = i  # Insert into hash map
    return []`,
  cpp: `vector<int> twoSum(vector<int>& arr, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < arr.size(); i++) {
        int complement = target - arr[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[arr[i]] = i;
    }
    return {};
}`,
  java: `int[] twoSum(int[] arr, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < arr.length; i++) {
        int complement = target - arr[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(arr[i], i);
    }
    return new int[]{};
}`,
  c: `// Hash Map solution in C
int* twoSum(int* arr, int n, int target, int* returnSize) {
    // Simple table lookup for positive small values
    int hash[1000] = {0};
    int* result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < n; i++) {
        int complement = target - arr[i];
        if (hash[complement] > 0) {
            result[0] = hash[complement] - 1;
            result[1] = i;
            *returnSize = 2;
            return result;
        }
        hash[arr[i]] = i + 1;
    }
    *returnSize = 0;
    return NULL;
}`,
};
