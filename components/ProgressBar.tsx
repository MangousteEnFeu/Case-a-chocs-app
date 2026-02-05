import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, color = '#E91E63', height = 'h-2' }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`w-full bg-[#111] border border-gray-700 ${height}`}>
      <div 
        className="h-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      ></div>
    </div>
  );
};

export default ProgressBar;