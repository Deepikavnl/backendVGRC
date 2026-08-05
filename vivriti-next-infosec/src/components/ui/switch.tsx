import { cn } from "@/lib/utils";
export function Switch({ checked, onCheckedChange, className }: { checked?: boolean; onCheckedChange?: (c: boolean) => void; className?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", checked ? "bg-primary" : "bg-muted-foreground/30", className)}
    >
      <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform", checked ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}
