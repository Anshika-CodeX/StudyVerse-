import { useRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  primary?: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, primary = false, className = '', ...props }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseClasses = "relative px-8 py-4 rounded-full font-medium tracking-wide transition-colors duration-300 overflow-hidden group";
  const primaryClasses = "bg-primary-600 text-white hover:bg-primary-500 shadow-[0_0_20px_rgba(79,70,229,0.5)]";
  const secondaryClasses = "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10";

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {/* Glow ripple effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full blur-xl" />
    </motion.button>
  );
};

export default MagneticButton;
