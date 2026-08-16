import React from 'react';

interface VisualizerContainerProps {
  children: React.ReactNode;
}

export const VisualizerContainer = ({ children }: VisualizerContainerProps) => {
  return (
    <div className="w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 mt-4 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
};
