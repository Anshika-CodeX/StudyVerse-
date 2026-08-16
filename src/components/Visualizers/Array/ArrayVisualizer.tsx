import type { DSAVisualizerData } from '../types/visualizer.types';
import { useVisualizer } from '../hooks/useVisualizer';

// Common Components
import { VisualizerContainer } from '../Common/VisualizerContainer';
import { VisualizerHeader } from '../Common/VisualizerHeader';
import { PlaybackControls } from '../Common/PlaybackControls';
import { VariableTracker } from '../Common/VariableTracker';
import { ComplexityCard } from '../Common/ComplexityCard';
import { CodeViewer } from '../Common/CodeViewer';
import { NotesViewer } from '../Common/NotesViewer';

// Array Specific
import { ArrayAnimation } from './ArrayAnimation';

interface ArrayVisualizerProps {
  data: DSAVisualizerData;
}

export const ArrayVisualizer = ({ data }: ArrayVisualizerProps) => {
  const {
    currentStep,
    activeStepData,
    isPlaying,
    speed,
    totalSteps,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    setSpeed,
  } = useVisualizer({ steps: data.steps });

  return (
    <VisualizerContainer>
      <VisualizerHeader 
        topic={data.topic} 
        operation={data.operation} 
        question={data.question} 
      />

      {/* Main Visualization Canvas */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-6 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
        
        {/* State Tracker (Variables) */}
        <div className="flex justify-between items-start z-10">
          <VariableTracker variables={activeStepData.variables} />
        </div>

        {/* Array Animation Engine */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <ArrayAnimation 
            arrayState={activeStepData.arrayState || []}
            currentIndexes={activeStepData.currentIndexes}
            activeIndexes={activeStepData.activeIndexes}
          />
        </div>

        {/* AI Step Explanation */}
        <div className="mt-6 z-10">
          <p className="text-gray-300 text-sm bg-white/5 p-4 rounded-xl border border-white/10 italic">
            <span className="text-primary-400 font-bold mr-2 not-italic">AI:</span>
            {activeStepData.explanation}
          </p>
        </div>
      </div>

      {/* Unified Playback Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={totalSteps}
        speed={speed}
        togglePlay={togglePlay}
        nextStep={nextStep}
        prevStep={prevStep}
        reset={reset}
        setSpeed={setSpeed}
      />

      {/* Details Grid (Code & Complexity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <CodeViewer 
          code={data.code} 
          language={data.language} 
          activeLine={activeStepData.codeLine} 
        />
        <div className="flex flex-col gap-6">
          <ComplexityCard 
            time={data.complexity.time} 
            space={data.complexity.space} 
          />
          <NotesViewer 
            notes={data.notes}
            edgeCases={data.edgeCases}
            interviewQuestions={data.interviewQuestions}
            practiceProblems={data.practiceProblems}
          />
        </div>
      </div>
    </VisualizerContainer>
  );
};
