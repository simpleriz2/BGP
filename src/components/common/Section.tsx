import React from 'react';

type SectionProps = {
  id?: string;
  variant?: 'light' | 'dark' | 'gray';
  children: React.ReactNode;
  className?: string;
};

export default function Section({
  id,
  variant = 'light',
  children,
  className = '',
}: SectionProps) {
  const getBgColor = () => {
    switch (variant) {
      case 'dark':
        return 'var(--primary)';
      case 'gray':
        return '#f1f5f9';
      case 'light':
      default:
        return 'var(--background)';
    }
  };

  const getTextColor = () => {
    return variant === 'dark' ? '#ffffff' : 'var(--foreground)';
  };

  return (
    <section
      id={id}
      className={`section ${className}`}
      style={{
        backgroundColor: getBgColor(),
        color: getTextColor(),
        paddingTop: '60px',
        paddingBottom: '60px',
      }}
    >
      <style jsx global>{`
        @media (max-width: 767px) {
          .section {
            padding-top: 44px !important;
            padding-bottom: 44px !important;
          }
        }

        @media (min-width: 768px) {
          .section {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
          }
        }
      `}</style>
      {children}
    </section>
  );
}
