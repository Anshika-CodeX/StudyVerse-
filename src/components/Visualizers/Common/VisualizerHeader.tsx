import type { DSATopic } from '../types/visualizer.types';
import { Network, List, Layers, Database, Code2 } from 'lucide-react';

interface VisualizerHeaderProps {
  topic: DSATopic;
  operation: string;
  question: string;
}

export const VisualizerHeader = ({ topic, operation, question }: VisualizerHeaderProps) => {
  const getTopicIcon = () => {
    switch (topic) {
      case 'Array': return <List className="text-primary-400" size={20} />;
      case 'Stack': return <Layers className="text-pink-400" size={20} />;
      case 'Queue': return <Layers className="text-blue-400" size={20} />;
      case 'LinkedList': return <Network className="text-green-400" size={20} />;
      case 'Tree': return <Network className="text-amber-400" size={20} />;
      case 'Graph': return <Database className="text-violet-400" size={20} />;
      default: return <Code2 className="text-primary-400" size={20} />;
    }
  };

  return (
    <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          {getTopicIcon()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{operation}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded-full">
              {topic}
            </span>
          </div>
        </div>
      </div>
      {question && (
        <p className="text-sm text-gray-400 mt-2 ml-1 border-l-2 border-white/10 pl-3">
          {question}
        </p>
      )}
    </div>
  );
};
