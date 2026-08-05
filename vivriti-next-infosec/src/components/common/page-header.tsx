import * as React from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  className?: string;
}
export function PageHeader({ title, description, breadcrumbs, actions, className }: Props) {
  return (
    <div className={cn("mb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} className="mb-3" />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
