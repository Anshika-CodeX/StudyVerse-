import { useState, useEffect, useCallback, useRef } from 'react';
import type { VisualizerStep } from '../types/visualizer.types';

interface UseVisualizerProps {
  steps: VisualizerStep[];
  initialSpeed?: number; // 0.5x, 1x, 1.5x, 2x
}

export const useVisualizer = ({ steps, initialSpeed = 1 }: UseVisualizerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = steps.length;

  const play = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setIsPlaying(true);
    }
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      if (currentStep === totalSteps - 1) {
        // If at the end, restart
        setCurrentStep(0);
      }
      play();
    }
  }, [isPlaying, currentStep, totalSteps, pause, play]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const jumpTo = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  }, [totalSteps]);

  // Handle auto-playback
  useEffect(() => {
    if (isPlaying) {
      const delay = 1500 / speed; // Base delay is 1.5s adjusted by speed
      
      timerRef.current = setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          nextStep();
        } else {
          setIsPlaying(false); // Auto-pause at the end
        }
      }, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, speed, totalSteps, nextStep]);

  return {
    currentStep,
    activeStepData: steps[currentStep],
    isPlaying,
    speed,
    totalSteps,
    play,
    pause,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    setSpeed,
    jumpTo,
  };
};
