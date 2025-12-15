import React from 'react';

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background Circle */}
    <circle cx="50" cy="50" r="45" className="fill-base-500 dark:fill-base-600" />
    
    {/* Stylized Chart Line */}
    <path 
      d="M20 70 L 40 50 L 55 65 L 80 30" 
      stroke="white" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Star/Snowflake at the peak */}
    <path 
      d="M80 30 L 85 15 M 80 30 L 95 30 M 80 30 L 65 30 M 80 30 L 75 45" 
      stroke="#F8B229" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />
    
    {/* Festive dots (ornaments) */}
    <circle cx="40" cy="50" r="4" fill="#D42426" />
    <circle cx="55" cy="65" r="4" fill="#146B3A" />
  </svg>
);