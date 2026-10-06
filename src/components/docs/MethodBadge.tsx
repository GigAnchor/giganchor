import type { ComponentProps } from "react";
import { MethodBadge as ApiMethodBadge } from "@/components/api-explorer/MethodBadge";
import { cn } from "@/lib/cn";

export type MethodBadgeProps = ComponentProps<typeof ApiMethodBadge>;

export function MethodBadge({ className, ...props }: MethodBadgeProps) {
  return (
    <ApiMethodBadge
      {...props}
      className={cn(
        "justify-center px-2.5 py-1 text-[10px] font-black uppercase leading-none tracking-[0.16em] shadow-neu-raised-sm",
        className,
      )}
    />
  );
}
