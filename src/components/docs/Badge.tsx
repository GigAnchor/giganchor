import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const STYLES: Record<BadgeVariant, string> = {
  default: "bg-content-muted/10 text-content-secondary",
  primary: "bg-theme-primary/10 text-theme-primary",
  success: "bg-theme-success/10 text-theme-success",
  warning: "bg-theme-warning/10 text-theme-warning",
  danger: "bg-theme-error/10 text-theme-error",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  const variantClass = STYLES[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold shadow-neu-raised-sm",
        variantClass,
        className
      )}
    >
      {children}
    </span>
  );
}
