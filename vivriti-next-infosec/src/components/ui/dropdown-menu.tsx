import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}

export function DropdownMenu({ trigger, children, align = "end", className }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute z-50 mt-1 min-w-[11rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-popover animate-slide-up",
            align === "end" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  className, children, destructive, ...props
}: React.HTMLAttributes<HTMLButtonElement> & { destructive?: boolean }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-sm text-left transition-colors [&_svg]:size-4 [&_svg]:text-muted-foreground",
        destructive ? "text-destructive hover:bg-destructive/10 [&_svg]:text-destructive" : "hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">{children}</div>;
}
export function DropdownSeparator() {
  return <div className="my-1 h-px bg-border" />;
}
