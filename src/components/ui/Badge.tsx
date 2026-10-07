import React from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'easy' | 'medium' | 'hard' | 'feature' | 'fix' | 'breaking' | 'new';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  easy: 'bg-theme-success/12 text-theme-success',
  medium: 'bg-theme-warning/12 text-theme-warning',
  hard: 'bg-theme-error/12 text-theme-error',
  feature: 'bg-theme-primary/12 text-theme-primary',
  new: 'bg-theme-primary/12 text-theme-primary',
  fix: 'bg-content-muted/12 text-content-secondary',
  breaking: 'bg-theme-error/15 text-theme-error border border-theme-error/20',
};

const defaultLabels: Record<BadgeVariant, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  feature: 'Feature',
  new: 'New',
  fix: 'Fix',
  breaking: 'Breaking',
};

export const Badge: React.FC<BadgeProps> = ({ variant, label, className }) => {
  const displayLabel = label ?? defaultLabels[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow-neu-raised-sm',
        variantStyles[variant],
        className
      )}
    >
      {displayLabel}
    </span>
  );
};
