import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  togglePlay: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

export const PlaybackControls = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  togglePlay,
  nextStep,
  prevStep,
  reset,
  setSpeed,
}: PlaybackControlsProps) => {
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="flex flex-col gap-4">
      {/* Progress Bar */}
      <div className="w-full bg-white/5 rounded-full h-1.5 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-violet-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Step Indicator */}
        <div className="text-xs font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
          Step {currentStep + 1} / {totalSteps}
        </div>

        {/* Main Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={reset}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
          
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <SkipBack size={20} />
          </button>

          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="translate-x-0.5" />}
          </button>

          <button 
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {speeds.map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                speed === s 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
