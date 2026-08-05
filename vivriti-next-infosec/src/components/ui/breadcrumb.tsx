import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb { label: string; to?: string; }
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
      <Link to="/" className="flex items-center hover:text-foreground"><Home className="h-3.5 w-3.5" /></Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          {c.to && i < items.length - 1 ? (
            <Link to={c.to} className="hover:text-foreground">{c.label}</Link>
          ) : (
            <span className="font-medium text-foreground">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
