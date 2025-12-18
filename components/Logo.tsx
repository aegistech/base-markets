import React from 'react';

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Clean Base Blue Circle */}
    <circle cx="50" cy="50" r="48" className="fill-base-500" />
    
    {/* Strong White Chart Line - More "Web3" and less "Earth" */}
    <path 
      d="M25 70 L 45 50 L 55 60 L 75 35" 
      stroke="white" 
      strokeWidth="10" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Highlight at the tip */}
    <circle cx="75" cy="35" r="6" fill="white" className="animate-pulse" />
  </svg>
);