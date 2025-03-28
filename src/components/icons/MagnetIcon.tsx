
import React from 'react';

export const MagnetIcon: React.FC = () => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m6 15-4-4 4-4" />
      <path d="m18 15 4-4-4-4" />
      <path d="M10 19h4" />
      <path d="M12 19v-8" />
      <path d="M12 11V9c0-1 .6-2 2.5-2s2.5 1 2.5 2v2" />
      <path d="M6 11V9c0-1 .6-2 2.5-2S11 8 11 9v2" />
    </svg>
  );
};
