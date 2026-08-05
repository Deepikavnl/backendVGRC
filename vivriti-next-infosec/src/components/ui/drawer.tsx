import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  width?: string;
}

export function Drawer({ open, onOpenChange, children, title, description, className, width = "max-w-xl" }: DrawerProps) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in" onClick={() => onOpenChange(false)} />
      <div className={cn("absolute right-0 top-0 h-full w-full bg-card shadow-popover flex flex-col animate-slide-in-right", width, className)}>
        {(title || description) && (
          <div className="flex items-start justify-between border-b p-5">
            <div>
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
            </div>
            <button onClick={() => onOpenChange(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>
      </div>
    </div>,
    document.body
  );
}
