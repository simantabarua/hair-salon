import React from 'react';

interface AureliaLogoProps {
  className?: string;
  size?: number;
}

export default function AureliaLogo({ className = 'text-primary', size = 32 }: AureliaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Premium thin outer border with a dash gap for an editorial aesthetic */}
      <circle 
        cx="50" 
        cy="50" 
        r="44" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeDasharray="210 40" 
        strokeLinecap="round"
      />
      
      {/* Elegant high-contrast letter A */}
      <path
        d="M36 70 L48 26 H52 L64 70"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* The crossbar of A, styled with a graceful wave curve representing hair styling */}
      <path
        d="M41 55 C46 53 54 53 59 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Decorative luxury sparkles / diamond shapes inside */}
      <path
        d="M50 14 L52.5 19 L58 20 L52.5 21 L50 26 L47.5 21 L42 20 L47.5 19 Z"
        fill="currentColor"
      />
    </svg>
  );
}
