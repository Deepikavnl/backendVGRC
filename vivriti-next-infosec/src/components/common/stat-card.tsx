import * as React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: string; up: boolean; positive?: boolean };
  accent?: "blue" | "green" | "amber" | "red" | "slate";
  onClick?: () => void;
}
const accents: Record<string, string> = {
  blue: "bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300",
  green: "bg-success/10 text-success",
  amber: "bg-warning/12 text-warning",
  red: "bg-destructive/10 text-destructive",
  slate: "bg-muted text-muted-foreground",
};
export function StatCard({ label, value, icon: Icon, trend, accent = "blue", onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className={cn("p-5 transition-shadow", onClick && "cursor-pointer hover:shadow-elevated")}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className={cn("flex items-center gap-0.5 font-medium", trend.positive ?? trend.up ? "text-success" : "text-destructive")}>
            {trend.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend.value}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </Card>
  );
}
