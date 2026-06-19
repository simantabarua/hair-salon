import React from 'react';
import { Scissors } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 font-manrope">
      {/* Background Soft Glow */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse" />

      {/* Loading Container */}
      <div className="flex flex-col items-center relative z-10 text-center">
        {/* Animated Rings and Icon */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Outermost Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin" />
          
          {/* Middle Ring */}
          <div className="absolute inset-2 rounded-full border border-t-transparent border-r-transparent border-b-primary/45 border-l-primary/45 animate-spin [animation-direction:reverse]" />
          
          {/* Innermost pulsing circle */}
          <div className="absolute inset-4 rounded-full bg-secondary border border-primary/20 flex items-center justify-center shadow-lg shadow-black/50">
            <Scissors className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Typography */}
        <h2 className="font-cormorant text-2xl font-semibold tracking-widest text-white mb-2">
          HAIR <span className="text-primary font-bold">SALON</span>
        </h2>
        
        {/* Text */}
        <p className="font-manrope text-xs text-white/50 tracking-wider uppercase pl-1.5 animate-pulse">
          Curating Your Experience...
        </p>
      </div>
    </div>
  );
}
