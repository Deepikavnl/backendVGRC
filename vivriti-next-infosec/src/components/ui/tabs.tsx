import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsCtx { value: string; setValue: (v: string) => void; }
const Ctx = React.createContext<TabsCtx | null>(null);

export function Tabs({ value, onValueChange, children, className }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  return <Ctx.Provider value={{ value, setValue: onValueChange }}><div className={className}>{children}</div></Ctx.Provider>;
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("inline-flex items-center gap-1 border-b border-border", className)}>{children}</div>;
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(Ctx)!;
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={cn(
        "relative -mb-px px-4 py-2.5 text-sm font-medium transition-colors border-b-2",
        active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(Ctx)!;
  if (ctx.value !== value) return null;
  return <div className={cn("animate-fade-in", className)}>{children}</div>;
}
