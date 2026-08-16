import { Target, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';

export const RightPanel = () => {
  return (
    <div className="h-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-6 overflow-y-auto hidden-scrollbar">
      
      {/* Progress Overview */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary-400" />
          Learning Progress
        </h3>
        
        {/* Animated Circular Progress Placeholder (CSS based for now) */}
        <div className="flex items-center justify-center py-4">
          <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-black/20 border-4 border-white/5 shadow-inner">
            {/* SVG Circle for Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle 
                cx="64" cy="64" r="56" 
                fill="none" 
                stroke="url(#gradient)" 
                strokeWidth="8" 
                strokeDasharray="351" 
                strokeDashoffset="87" 
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-pink-400">75%</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Mastery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Goal */}
      <div className="bg-primary-600/10 border border-primary-500/20 rounded-2xl p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary-500/20 blur-2xl rounded-full group-hover:bg-primary-500/30 transition-colors"></div>
        <div className="flex items-center gap-3 mb-2">
          <Target size={16} className="text-primary-400" />
          <h4 className="text-sm font-bold text-white">Today's Goal</h4>
        </div>
        <p className="text-xs text-gray-300 mb-3">Complete 2 Data Structure modules.</p>
        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 w-1/2 rounded-full"></div>
        </div>
      </div>

      {/* Weak Areas */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-orange-400" />
          Focus Areas
        </h3>
        <div className="flex flex-col gap-2">
          {['Graph Traversal', 'Dynamic Programming', 'CSS Grid'].map((topic, i) => (
            <div key={i} className="flex justify-between items-center bg-black/20 border border-white/5 rounded-xl p-3 hover:bg-white/5 transition-colors cursor-pointer">
              <span className="text-xs text-gray-300">{topic}</span>
              <button className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded-md border border-orange-500/30 hover:bg-orange-500/30 transition-colors">Review</button>
            </div>
          ))}
        </div>
      </div>

      {/* Next Lesson */}
      <div className="mt-auto">
        <div className="bg-gradient-to-br from-secondary-600/20 to-pink-600/20 border border-pink-500/30 rounded-2xl p-4 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all cursor-pointer group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <BookOpen size={16} className="text-pink-400" />
            </div>
            <div>
              <h4 className="text-xs text-pink-400 font-bold uppercase tracking-wider">Up Next</h4>
              <p className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">Dijkstra's Algorithm</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
