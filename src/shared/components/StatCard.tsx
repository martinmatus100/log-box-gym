import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  variant?: 'default' | 'accent' | 'box';
  'data-testid'?: string;
}

export function StatCard({ icon, value, label, variant = 'default', 'data-testid': testId }: StatCardProps) {
  const variantStyles = {
    default: 'bg-bg-surface border-border-subtle',
    accent: 'bg-accent-glow border-accent/30',
    box: 'bg-box/10 border-box/30',
  };
  
  const iconStyles = {
    default: 'text-text-secondary',
    accent: 'text-accent',
    box: 'text-box',
  };

  return (
    <div data-testid={testId} className={`flex flex-col items-center p-2.5 rounded-card ${variantStyles[variant]}`}>
      <div className={`mb-1 ${iconStyles[variant]}`}>
        {icon}
      </div>
      <span data-testid="stat-value" className="text-lg font-bold text-text-primary">{value}</span>
      <span data-testid="stat-label" className="text-[10px] text-text-secondary mt-0.5 leading-tight">{label}</span>
    </div>
  );
}