import React from 'react';
import { Sprout } from 'lucide-react';

interface FarmLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FarmLogo: React.FC<FarmLogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-xl shadow-md shrink-0 ${dimensions} ${className}`}>
      <Sprout className={iconSize} />
      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white shadow-sm" title="Gabolekwe Farms Gweta" />
    </div>
  );
};
