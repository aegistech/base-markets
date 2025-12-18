import React, { useMemo } from 'react';

export const Snowfall = () => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${10 + Math.random() * 20}s`,
      opacity: 0.3 + Math.random() * 0.7,
      size: `${2 + Math.random() * 4}px`,
    }));
  }, []);

  return (
    <div className="snow-container fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute bg-white rounded-full animate-snow"
          style={{
            left: flake.left,
            top: '-10px',
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDelay: flake.animationDelay,
            animationDuration: flake.animationDuration,
          }}
        />
      ))}
    </div>
  );
};