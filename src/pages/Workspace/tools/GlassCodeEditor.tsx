import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Copy, CheckCircle2, AlertCircle } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  language?: string;
}

export const GlassCodeEditor: React.FC<CodeEditorProps> = ({ initialCode, language = 'javascript' }) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    // Simulated output for demo purposes
    setOutput("Running code...\nOutput:\n[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]");
  };

  return (
    <div className="w-full mt-4 bg-[#1e1e2e]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl group">
      
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">{language}</span>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors"
          >
            {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button 
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary-600/80 hover:bg-primary-500 text-xs text-white transition-colors shadow-[0_0_10px_rgba(79,70,229,0.3)]"
          >
            <Play size={14} /> Run
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="h-[250px] w-full p-2">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderLineHighlight: "all",
          }}
        />
      </div>

      {/* Simulated Output Console */}
      {output && (
        <div className="border-t border-white/10 bg-black/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Console Output</span>
          </div>
          <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};
