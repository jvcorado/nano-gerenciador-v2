"use client";

import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12'
  };

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className="relative">
        <div className={cn(
          'rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 shadow-lg',
          iconSizes[size]
        )}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-full w-full text-white"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.3"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
      </div>
      <div className="flex flex-col">
        <h1 className={cn(
          'font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent',
          sizeClasses[size]
        )}>
          ClientManager
        </h1>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 -mt-1">
          PRO
        </span>
      </div>
    </div>
  );
}