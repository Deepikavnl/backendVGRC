import * as React from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useToastStore, type ToastVariant } from "@/store/toast";
import { cn } from "@/lib/utils";

const config: Record<ToastVariant, { icon: React.ElementType; cls: string }> = {
  success: { icon: CheckCircle2, cls: "text-success" },
  error: { icon: XCircle, cls: "text-destructive" },
  warning: { icon: AlertTriangle, cls: "text-warning" },
  default: { icon: Info, cls: "text-primary" },
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return createPortal(
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const { icon: Icon, cls } = config[t.variant];
        return (
          <div key={t.id} className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-popover animate-slide-up">
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", cls)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
