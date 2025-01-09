import React from 'react';

interface CharacterCountProps {
  current: number;
  max: number;
}

const CharacterCount: React.FC<CharacterCountProps> = ({ current, max }) => {
  const percentage = (current / max) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <span>{current} characters</span>
        <span>{max - current} remaining</span>
      </div>
      <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default CharacterCount;