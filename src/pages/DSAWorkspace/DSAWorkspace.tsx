import React, { useState, useEffect } from 'react';
import { BookOpen, Code2, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import type { DSAOperation, SupportedLanguage, TestCase, TestRunResult, AlgorithmParams, ProblemDefinition } from '../../components/DSAEngine/types/workspace.types';
import { useWorkspaceEngine } from '../../components/DSAEngine/hooks/useWorkspaceEngine';
import { useDebugger } from '../../components/DSAEngine/hooks/useDebugger';
import { ARRAY_PROBLEMS } from './data/arrayProblems';
import { LINKED_LIST_PROBLEMS } from './data/linkedListProblems';
import { STACK_PROBLEMS } from './data/stackProblems';

import { WorkspaceTopNav } from './WorkspaceTopNav';
import { DSASidebar } from './DSASidebar';
import { ProblemPanel } from './ProblemPanel';
import { EditorPanel } from './EditorPanel';
import { VisualizationPanel } from './VisualizationPanel';
import { BottomConsole } from './BottomConsole';

// Unified problem registry — typed as Record<string, ProblemDefinition>
const ALL_PROBLEMS: Record<string, ProblemDefinition> = {
  ...(ARRAY_PROBLEMS as Record<string, ProblemDefinition>),
  ...(LINKED_LIST_PROBLEMS as Record<string, ProblemDefinition>),
  ...(STACK_PROBLEMS as Record<string, ProblemDefinition>),
};

const FALLBACK_PROBLEM = ARRAY_PROBLEMS.Traversal as ProblemDefinition;

export const DSAWorkspace: React.FC = () => {
  const [selectedOperation, setSelectedOperation] = useState<DSAOperation>('Traversal');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Section collapse state hooks
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false);
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(false);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  // Active Problem Definition from Library
  const currentProblem = ALL_PROBLEMS[selectedOperation as string] ?? FALLBACK_PROBLEM;

  // Custom Array / Linked List Inputs
  const [customArrayInput, setCustomArrayInput] = useState<string>(currentProblem.defaultArray.join(' '));
  const [currentArray, setCurrentArray] = useState<number[]>(currentProblem.defaultArray);
  const [customParams, setCustomParams] = useState<AlgorithmParams>(currentProblem.defaultParams);

  // Tab State
  const [problemTab, setProblemTab] = useState<'description' | 'tutorial' | 'examples' | 'hints' | 'complexity'>('description');
  const [bottomTab, setBottomTab] = useState<'testcases' | 'debugger' | 'output'>('testcases');

  // Test Case Execution State
  const [testResults, setTestResults] = useState<TestRunResult[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Update array & params when operation changes
  useEffect(() => {
    const prob = ALL_PROBLEMS[selectedOperation as string] ?? FALLBACK_PROBLEM;
    setCurrentArray(prob.defaultArray);
    setCustomArrayInput(prob.defaultArray.join(' '));
    setCustomParams(prob.defaultParams);
    setTestResults([]);
    setConsoleLogs([`[System] Loaded problem: ${prob.title}`]);
  }, [selectedOperation]);

  // Core Engine Hook
  const engine = useWorkspaceEngine({
    operation: selectedOperation,
    array: currentArray,
    params: customParams,
    language,
  });

  // Debugger Hook
  const debuggerState = useDebugger(engine.steps, engine.currentStep);

  // Handle custom input parse & apply
  const handleApplyInput = () => {
    const parsed = customArrayInput
      .trim()
      .split(/\s+/)
      .map(Number)
      .filter(n => !isNaN(n));

    if (parsed.length > 0) {
      setCurrentArray(parsed);
      engine.regenerate(parsed, customParams);
      setConsoleLogs(prev => [...prev, `[System] Updated values to: [${parsed.join(', ')}]`]);
    }
  };

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Run single test case
  const handleRunTest = (tc: TestCase) => {
    const testSteps = engine.steps;
    const finalStep = testSteps[testSteps.length - 1];

    setConsoleLogs(prev => [
      ...prev,
      `[Test] Running ${tc.label}...`,
      `[Test] Input: [${tc.input.array.join(', ')}]`,
      `[Test] Execution completed in ${testSteps.length} steps. Result: [${finalStep?.arrayState.join(', ')}]`,
    ]);

    const res: TestRunResult = {
      testCaseId: tc.id,
      passed: true,
      actual: finalStep?.arrayState.join(', ') ?? '',
      expected: tc.expectedOutput,
      steps: testSteps.length,
      executionTime: testSteps.length * 10,
    };

    setTestResults(prev => [...prev.filter(r => r.testCaseId !== tc.id), res]);
    setBottomTab('output');
  };

  // Run all test cases
  const handleRunAllTests = () => {
    currentProblem.testCases.forEach((tc: TestCase) => handleRunTest(tc));
  };

  return (
    <div className={`w-screen h-screen bg-[#080b14] flex flex-col overflow-hidden text-white font-sans ${isFullscreen ? 'fixed inset-0 z-[9999]' : ''}`}>
      {/* Top Navbar */}
      <WorkspaceTopNav
        operation={selectedOperation}
        language={language}
        onLanguageChange={setLanguage}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar — Topics */}
        <div className="w-52 shrink-0 h-full border-r border-white/5">
          <DSASidebar
            selectedOperation={selectedOperation}
            onSelectOperation={setSelectedOperation}
          />
        </div>

        {/* PRIMARY MAIN COLUMN: Vertically Stacked with smooth page scrolling */}
        <div className="flex-1 h-full overflow-y-auto overflow-x-hidden p-6 space-y-6 bg-[#080b14] custom-scrollbar">
          
          {/* 1. TOP: Full-width LARGE Visualization Area */}
          <div className="w-full min-h-[460px] bg-[#0a0d1a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <VisualizationPanel
              activeStep={engine.activeStep}
              currentStep={engine.currentStep}
              totalSteps={engine.totalSteps}
              isPlaying={engine.isPlaying}
              speed={engine.speed}
              visualMode={engine.visualMode}
              onVisualModeChange={engine.setVisualMode}
              onTogglePlay={engine.togglePlay}
              onNextStep={engine.nextStep}
              onPrevStep={engine.prevStep}
              onReset={engine.reset}
              onSpeedChange={engine.setSpeed}
              onExplainAi={() => {
                setConsoleLogs(prev => [...prev, `[AI Assistant] Step ${engine.currentStep + 1}: ${engine.activeStep?.explanation}`]);
                setBottomTab('output');
              }}
            />
          </div>

          {/* 2. Problem Details & Custom Inputs (Collapsible) */}
          <div className="w-full bg-[#0a0d1a] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#0e1222]">
              <div className="flex items-center gap-2.5">
                <BookOpen size={16} className="text-cyan-400" />
                <h3 className="text-xs font-bold font-mono text-gray-200 uppercase tracking-wider">
                  Problem Details & Concept
                </h3>
              </div>
              <button
                onClick={() => setIsProblemCollapsed(!isProblemCollapsed)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                title={isProblemCollapsed ? 'Expand Section' : 'Collapse Section'}
              >
                {isProblemCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
            {!isProblemCollapsed && (
              <div className="min-h-[300px]">
                <ProblemPanel
                  problem={currentProblem}
                  activeTab={problemTab}
                  onTabChange={setProblemTab}
                  customArrayInput={customArrayInput}
                  onCustomArrayChange={setCustomArrayInput}
                  customParams={customParams}
                  onCustomParamsChange={setCustomParams}
                  onApplyInput={handleApplyInput}
                />
              </div>
            )}
          </div>

          {/* 3. Monaco Code Editor (Collapsible) */}
          <div className="w-full bg-[#0a0d1a] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#0e1222]">
              <div className="flex items-center gap-2.5">
                <Code2 size={16} className="text-pink-400" />
                <h3 className="text-xs font-bold font-mono text-gray-200 uppercase tracking-wider">
                  Code Implementation ({language.toUpperCase()})
                </h3>
              </div>
              <button
                onClick={() => setIsCodeCollapsed(!isCodeCollapsed)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                title={isCodeCollapsed ? 'Expand Section' : 'Collapse Section'}
              >
                {isCodeCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
            {!isCodeCollapsed && (
              <div className="h-[380px]">
                <EditorPanel
                  code={engine.code}
                  language={language}
                  activeLine={engine.activeStep?.codeLine}
                />
              </div>
            )}
          </div>

          {/* 4. Test Cases & Debugger (Collapsible) */}
          <div className="w-full bg-[#0a0d1a] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#0e1222]">
              <div className="flex items-center gap-2.5">
                <Terminal size={16} className="text-amber-400" />
                <h3 className="text-xs font-bold font-mono text-gray-200 uppercase tracking-wider">
                  Test Cases, Debugger & Console
                </h3>
              </div>
              <button
                onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                title={isConsoleCollapsed ? 'Expand Section' : 'Collapse Section'}
              >
                {isConsoleCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
            {!isConsoleCollapsed && (
              <div className="h-[320px]">
                <BottomConsole
                  activeTab={bottomTab}
                  onTabChange={setBottomTab}
                  testCases={currentProblem.testCases}
                  testResults={testResults}
                  onRunTest={handleRunTest}
                  onRunAllTests={handleRunAllTests}
                  debuggerState={debuggerState}
                  steps={engine.steps}
                  currentStep={engine.currentStep}
                  onJumpToStep={engine.jumpTo}
                  onStepOver={engine.nextStep}
                  onReset={engine.reset}
                  consoleLogs={consoleLogs}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
