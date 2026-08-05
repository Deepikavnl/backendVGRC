import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { checked?: boolean; onCheckedChange?: (c: boolean) => void; className?: string; id?: string; disabled?: boolean; }
export function Checkbox({ checked, onCheckedChange, className, id, disabled }: Props) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors disabled:opacity-50",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:border-primary",
        className
      )}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  );
}
