import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-card rounded-xl shadow-lg border ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export default Card;
