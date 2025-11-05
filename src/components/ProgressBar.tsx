import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  size = 'md'
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-blue-600">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[size]} overflow-hidden`}>
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out flex items-center justify-end pr-1"
          style={{ width: `${percentage}%` }}
        >
          {percentage === 100 && size !== 'sm' && (
            <CheckCircle size={12} className="text-white" />
          )}
        </div>
      </div>

      {size !== 'sm' && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {current} of {total} completed
          </span>
        </div>
      )}
    </div>
  );
}
