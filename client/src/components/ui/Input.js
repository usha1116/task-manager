import React from 'react';
import { cn } from '../../utils/helpers';

const Input = React.forwardRef(({ 
  className = '', 
  type = 'text',
  error,
  label,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 transition-colors duration-200',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <RightIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
