import React from 'react';
import Link from 'next/link';
import { Compass, Scissors, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center bg-background px-4 md:px-8 py-20 text-white font-manrope">
      <div className="text-center max-w-xl mx-auto relative">
        {/* Abstract Background Light */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Decorative Golden Icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary border border-primary/20 shadow-2xl mb-8 animate-pulse">
          <Scissors className="w-10 h-10 text-primary rotate-45" />
          <div className="absolute -inset-1 rounded-full border border-primary/10 animate-ping opacity-30" />
        </div>

        {/* 404 Header */}
        <h1 className="font-cormorant text-8xl md:text-9xl font-bold text-primary mb-2 select-none tracking-widest">
          404
        </h1>
        
        {/* Title */}
        <h2 className="font-cormorant text-3xl md:text-4xl font-bold mb-4 tracking-wide">
          Style Lost In Transition
        </h2>

        {/* Description */}
        <p className="text-white/60 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
          The page you are looking for has been trimmed from our site or moved to a new style directory. Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" passHref className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary text-black hover:bg-primary/80 font-bold px-8 h-12 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <Link href="/services" passHref className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-secondary border border-primary/20 text-white hover:bg-white/5 font-semibold px-8 h-12 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Compass className="w-4 h-4 text-primary" /> Explore Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
