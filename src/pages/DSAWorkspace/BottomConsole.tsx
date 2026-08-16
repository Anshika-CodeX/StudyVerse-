import React from 'react';
import { Play, CheckCircle2, XCircle, Terminal, Bug, TestTube } from 'lucide-react';
import type { TestCase, TestRunResult, WorkspaceStep } from '../../components/DSAEngine/types/workspace.types';
import { DebuggerPanel } from './DebuggerPanel';

interface BottomConsoleProps {
  activeTab: 'testcases' | 'debugger' | 'output';
  onTabChange: (tab: 'testcases' | 'debugger' | 'output') => void;
  testCases: TestCase[];
  testResults: TestRunResult[];
  onRunTest: (tc: TestCase) => void;
  onRunAllTests: () => void;
  debuggerState: any;
  steps: WorkspaceStep[];
  currentStep: number;
  onJumpToStep: (idx: number) => void;
  onStepOver: () => void;
  onReset: () => void;
  consoleLogs: string[];
}

export const BottomConsole: React.FC<BottomConsoleProps> = ({
  activeTab,
  onTabChange,
  testCases,
  testResults,
  onRunTest,
  onRunAllTests,
  debuggerState,
  steps,
  currentStep,
  onJumpToStep,
  onStepOver,
  onReset,
  consoleLogs,
}) => {
  return (
    <div className="h-full bg-[#080b14] border-t border-white/5 flex flex-col overflow-hidden">
      {/* Top Console Bar */}
      <div className="px-4 py-2 bg-[#060810] border-b border-white/5 flex items-center justify-between shrink-0">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTabChange('testcases')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'testcases'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <TestTube size={13} />
            <span>Test Cases ({testCases.length})</span>
          </button>

          <button
            onClick={() => onTabChange('debugger')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'debugger'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <Bug size={13} />
            <span>Debugger</span>
          </button>

          <button
            onClick={() => onTabChange('output')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'output'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <Terminal size={13} />
            <span>Console Output</span>
          </button>
        </div>

        {/* Run All Test Cases Button */}
        {activeTab === 'testcases' && (
          <button
            onClick={onRunAllTests}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all"
          >
            <Play size={12} />
            <span>Run All Tests</span>
          </button>
        )}
      </div>

      {/* Main Tab Panels */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {activeTab === 'testcases' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {testCases.map((tc) => {
                const res = testResults.find(r => r.testCaseId === tc.id);
                return (
                  <div key={tc.id} className="bg-white/3 border border-white/5 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold font-mono text-white">{tc.label}</span>
                        {res && (
                          <span className={`flex items-center gap-1 text-[10px] font-mono font-bold ${res.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            {res.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {res.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">
                        Input: <span className="text-gray-200">[{tc.input.array.join(', ')}]</span>
                      </div>
                      {tc.expectedOutput !== undefined && (
                        <div className="text-[11px] font-mono text-gray-400">
                          Expected: <span className="text-cyan-300">{String(tc.expectedOutput)}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onRunTest(tc)}
                      className="w-full mt-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-gray-300 transition-all flex items-center justify-center gap-1"
                    >
                      <Play size={10} />
                      <span>Run Test</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'debugger' && (
          <DebuggerPanel
            debuggerState={debuggerState}
            steps={steps}
            currentStep={currentStep}
            onJumpToStep={onJumpToStep}
            onStepOver={onStepOver}
            onReset={onReset}
          />
        )}

        {activeTab === 'output' && (
          <div className="font-mono text-xs text-gray-300 space-y-1">
            {consoleLogs.length === 0 ? (
              <span className="text-gray-600 italic">No console logs. Run an operation or test case to see output.</span>
            ) : (
              consoleLogs.map((log, i) => (
                <div key={i} className="text-cyan-300">
                  {log}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
