/**
 * LoadingSpinner Molecule Component
 * Centered loading indicator
 */

import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function LoadingSpinner({ size = 'md', label, className }: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-2',
        className
      )}
    >
      <Loader2
        className={clsx('animate-spin text-blue-500', sizeClasses[size])}
      />
      {label && (
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      )}
    </div>
  );
}

export default LoadingSpinner;
