// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div style={{ boxShadow: "4px 5px 8px 2px  rgba(0,0,0,0.3)" }}  className={` rounded-xl   p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="text-sm text-primary-50">{children}</div>;
};

export default Card;
