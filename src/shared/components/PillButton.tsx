import React from 'react';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function PillButton({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}: PillButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-target';
  
  const sizeStyles = {
    sm: 'h-8 px-4 text-sm rounded-full',
    md: 'h-12 px-6 text-base rounded-full',
    lg: 'h-14 px-8 text-lg rounded-full',
  };
  
  const variantStyles = {
    primary: 'bg-transparent text-accent hover:bg-accent/10 border-2 border-accent',
    secondary: 'bg-transparent text-text-primary hover:bg-bg-elevated border-2 border-border-subtle',
    danger: 'bg-transparent text-danger hover:bg-danger/10 border-2 border-danger',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary border-2 border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}