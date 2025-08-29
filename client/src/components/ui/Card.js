import React from 'react';
import { cn } from '../../utils/helpers';

const Card = React.forwardRef(({ 
  children, 
  className = '', 
  padding = 'default',
  shadow = 'default',
  ...props 
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-xl border border-gray-200',
        paddingClasses[padding],
        shadowClasses[shadow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
