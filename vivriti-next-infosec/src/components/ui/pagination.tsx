import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
}
export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const nums: (number | string)[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-3 text-sm">
      <span className="text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}</span>–<span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {nums.map((n, i) =>
          n === "…" ? (
            <span key={i} className="px-2 text-muted-foreground">…</span>
          ) : (
            <Button key={i} variant={n === page ? "default" : "outline"} size="icon-sm" onClick={() => onPageChange(n as number)}>
              {n}
            </Button>
          )
        )}
        <Button variant="outline" size="icon-sm" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
