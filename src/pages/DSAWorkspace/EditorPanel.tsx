import React, { useRef, useEffect } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { SupportedLanguage } from '../../components/DSAEngine/types/workspace.types';

interface EditorPanelProps {
  code: string;
  language: SupportedLanguage;
  activeLine?: number;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ code, language, activeLine }) => {
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const getMonacoLanguage = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'python': return 'python';
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'c': return 'c';
      default: return 'javascript';
    }
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom dark theme
    monaco.editor.defineTheme('studyverse-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'number', foreground: 'f472b6' },
        { token: 'string', foreground: '38bdf8' },
        { token: 'function', foreground: '818cf8' },
      ],
      colors: {
        'editor.background': '#0a0d1a',
        'editor.lineHighlightBackground': '#1e293b40',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#38bdf8',
      },
    });

    monaco.editor.setTheme('studyverse-dark');
  };

  // Synchronize active line highlight with execution step
  useEffect(() => {
    if (editorRef.current && activeLine !== undefined) {
      const editor = editorRef.current;
      const lineNumber = activeLine + 1; // Monaco is 1-indexed

      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: new (window as any).monaco.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            className: 'bg-cyan-500/20 border-l-2 border-cyan-400',
            glyphMarginClassName: 'text-cyan-400 font-bold',
          },
        },
      ]);

      editor.revealLineInCenterIfOutsideViewport(lineNumber);
    }
  }, [activeLine]);

  return (
    <div className="h-full bg-[#0a0d1a] flex flex-col overflow-hidden border-t border-white/5">
      {/* Editor Header */}
      <div className="px-4 py-2 bg-[#080b14] border-b border-white/5 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
          Code Solution ({language})
        </span>
        {activeLine !== undefined && (
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Line {activeLine + 1} Executing
          </span>
        )}
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onMount={handleEditorMount}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    </div>
  );
};
