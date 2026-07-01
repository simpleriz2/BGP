import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`container ${className}`}>
      <style jsx>{`
        .container {
          width: 100%;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 18px;
          padding-right: 18px;
        }
        @media (min-width: 768px) {
          .container {
            padding-left: 32px;
            padding-right: 32px;
          }
        }
      `}</style>
      {children}
    </div>
  );
}
