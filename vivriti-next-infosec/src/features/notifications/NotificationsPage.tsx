import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, ClipboardList, CheckCircle2, Clock, MessageSquare, RotateCcw, ThumbsUp } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { notifications as seed } from "@/data/mock";
import { relativeTime, cn } from "@/lib/utils";
import { toast } from "@/store/toast";
import type { NotificationType } from "@/types";

const icons: Record<NotificationType, { icon: React.ElementType; cls: string }> = {
  assigned: { icon: ClipboardList, cls: "bg-brand-50 text-brand-600" },
  submitted: { icon: CheckCircle2, cls: "bg-success/10 text-success" },
  reminder: { icon: Clock, cls: "bg-warning/12 text-warning" },
  comment: { icon: MessageSquare, cls: "bg-muted text-muted-foreground" },
  correction: { icon: RotateCcw, cls: "bg-destructive/10 text-destructive" },
  approved: { icon: ThumbsUp, cls: "bg-success/10 text-success" },
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState("all");
  const filtered = items.filter((n) => tab === "all" ? true : tab === "unread" ? !n.read : n.read);

  return (
    <>
      <PageHeader title="Notifications" description="Assessment and workflow activity across the platform." breadcrumbs={[{ label: "Notifications" }]}
        actions={<Button variant="outline" onClick={() => { setItems(items.map((n) => ({ ...n, read: true }))); toast.success("All marked as read"); }}><Check className="h-4 w-4" /> Mark all read</Button>} />
      <Tabs value={tab} onValueChange={setTab} className="mb-4"><TabsList>
        <TabsTrigger value="all">All ({items.length})</TabsTrigger>
        <TabsTrigger value="unread">Unread ({items.filter((n) => !n.read).length})</TabsTrigger>
        <TabsTrigger value="read">Read</TabsTrigger>
      </TabsList></Tabs>
      {filtered.length === 0 ? <EmptyState icon={Bell} title="No notifications" description="You're all caught up." /> : (
        <Card><CardContent className="divide-y p-0">
          {filtered.map((n) => {
            const { icon: Icon, cls } = icons[n.type];
            return (
              <button key={n.id} onClick={() => { setItems(items.map((x) => x.id === n.id ? { ...x, read: true } : x)); navigate(n.link ?? "/dashboard"); }}
                className={cn("flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/40", !n.read && "bg-accent/30")}>
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", cls)}><Icon className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1"><p className="text-sm font-medium">{n.title} {!n.read && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-primary align-middle" />}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p><p className="mt-0.5 text-xs text-muted-foreground">{n.actor} · {relativeTime(n.createdAt)}</p></div>
              </button>
            );
          })}
        </CardContent></Card>
      )}
    </>
  );
}
