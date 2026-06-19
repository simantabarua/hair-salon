'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console
    console.error(error);
  }, [error]);

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center bg-background px-4 md:px-8 py-20 text-white font-manrope">
      <div className="text-center max-w-xl mx-auto relative">
        {/* Abstract Background Light */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Decorative Error Icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary border border-red-500/20 shadow-2xl mb-8">
          <AlertTriangle className="w-10 h-10 text-red-500" />
          <div className="absolute -inset-1 rounded-full border border-red-500/10 animate-ping opacity-30" />
        </div>

        {/* Title */}
        <h1 className="font-cormorant text-4xl md:text-5xl font-bold mb-4 tracking-wide text-white">
          An Elegant Interruption
        </h1>

        {/* Description */}
        <p className="text-white/60 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
          We encountered an unexpected issue while styling this page. Don&apos;t worry, our team has been notified. Let&apos;s try reloading or going back.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => reset()}
            className="w-full sm:w-auto bg-primary text-black hover:bg-primary/80 font-bold px-8 h-12 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
          <Link href="/" passHref className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-secondary border border-primary/20 text-white hover:bg-white/5 font-semibold px-8 h-12 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Home className="w-4 h-4 text-primary" /> Back to Home
            </Button>
          </Link>
        </div>

        {/* Optional Error Digest */}
        {error.digest && (
          <div className="mt-12 text-xs text-white/30 font-mono tracking-wider">
            Error ID: {error.digest}
          </div>
        )}
      </div>
    </div>
  );
}
