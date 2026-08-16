import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Code2, Bot } from 'lucide-react';
import type { DSAOperation, SupportedLanguage } from '../../components/DSAEngine/types/workspace.types';

interface WorkspaceTopNavProps {
  operation: DSAOperation;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: 'javascript', label: 'JS' },
  { value: 'python', label: 'Py' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
];

export const WorkspaceTopNav: React.FC<WorkspaceTopNavProps> = ({
  operation,
  language,
  onLanguageChange,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="h-12 bg-[#080b14]/95 border-b border-white/5 flex items-center justify-between px-4 shrink-0 backdrop-blur-xl z-50">
      {/* Left: Logo + breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
            <Code2 size={12} className="text-white" />
          </div>
          <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors hidden sm:inline font-mono">
            StudyVerse
          </span>
        </Link>
        <span className="text-white/20 text-xs">/</span>
        <span className="text-xs font-semibold text-white/40 font-mono">DSA Workspace</span>
        <span className="text-white/20 text-xs">/</span>
        <span className="text-xs font-semibold text-cyan-400 font-mono">{operation}</span>
      </div>

      {/* Center: Language selector */}
      <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
        {LANGUAGES.map(lang => (
          <button
            key={lang.value}
            onClick={() => onLanguageChange(lang.value)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
              language === lang.value
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Link
          to="/ai-tutor"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          title="AI Tutor"
        >
          <Bot size={14} />
          <span className="hidden sm:inline">AI Tutor</span>
        </Link>

        <motion.button
          onClick={onToggleFullscreen}
          whileTap={{ scale: 0.92 }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </motion.button>
      </div>
    </div>
  );
};
