import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// export default cho các file cũ vẫn dùng default import
export default Card;