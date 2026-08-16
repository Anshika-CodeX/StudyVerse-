import type { DSAVisualizerData } from '../types/visualizer.types';
import { ArrayVisualizer } from '../Array/ArrayVisualizer';

interface DSAEngineOrchestratorProps {
  data: DSAVisualizerData;
}

export const DSAEngineOrchestrator = ({ data }: DSAEngineOrchestratorProps) => {
  if (!data || !data.topic) return null;

  switch (data.topic) {
    case 'Array':
      return <ArrayVisualizer data={data} />;
    case 'Stack':
    case 'Queue':
    case 'LinkedList':
    case 'Tree':
    case 'Graph':
      return (
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-gray-400 mt-4">
          <p className="text-sm">The <strong>{data.topic}</strong> visualizer module is currently in development and will be available soon!</p>
        </div>
      );
    default:
      return null;
  }
};
