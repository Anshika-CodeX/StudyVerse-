import { Clock, HardDrive } from 'lucide-react';

interface ComplexityCardProps {
  time: string;
  space: string;
}

export const ComplexityCard = ({ time, space }: ComplexityCardProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <Clock size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Time Complexity</span>
        </div>
        <span className="text-lg font-mono font-bold text-white">{time}</span>
      </div>
      
      <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <HardDrive size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Space Complexity</span>
        </div>
        <span className="text-lg font-mono font-bold text-white">{space}</span>
      </div>
    </div>
  );
};
