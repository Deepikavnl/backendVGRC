import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Confirm", destructive, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} size="sm">
      <DialogHeader>
        <div className="flex items-center gap-3">
          {destructive && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
          <div>
            <DialogTitle>{title}</DialogTitle>
          </div>
        </div>
        <DialogDescription className="pt-2">{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button variant={destructive ? "destructive" : "default"} onClick={() => { onConfirm(); onOpenChange(false); }}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
