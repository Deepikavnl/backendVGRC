import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Opt { label: string; value: string; }
interface Props {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  options: Opt[];
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}
export function Select({ value, defaultValue, onValueChange, options, placeholder = "Select…", className, id, disabled }: Props) {
  const controlled = value !== undefined;
  const isPlaceholder = controlled ? !value : !defaultValue;
  return (
    <div className="relative">
      <select
        id={id}
        disabled={disabled}
        {...(controlled ? { value } : { defaultValue: defaultValue ?? "" })}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "flex h-9 w-full appearance-none rounded-md border border-input bg-card px-3 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:opacity-50",
          isPlaceholder && "text-muted-foreground",
          className
        )}
      >
        {isPlaceholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-foreground">{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
