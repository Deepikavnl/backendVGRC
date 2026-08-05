import { cn } from "@/lib/utils";
import { initials as toInitials } from "@/lib/utils";

export function Avatar({ name, className, src }: { name: string; className?: string; src?: string }) {
  return (
    <div className={cn("flex items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold overflow-hidden shrink-0 dark:bg-brand-900 dark:text-brand-200", className)}>
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : toInitials(name)}
    </div>
  );
}
