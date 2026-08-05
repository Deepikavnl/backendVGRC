import { Badge, type BadgeProps } from "@/components/ui/badge";
import { RiskBadge, StatusBadge } from "@/components/common/status-badge";
type V = BadgeProps["variant"];

const statusMap: Record<string, { label: string; variant: V }> = {
  draft: { label: "Draft", variant: "muted" },
  assigned: { label: "Assigned", variant: "default" },
  in_progress: { label: "In Progress", variant: "default" },
  submitted: { label: "Submitted", variant: "warning" },
  under_review: { label: "Under Review", variant: "warning" },
  needs_correction: { label: "Needs Correction", variant: "destructive" },
  correction_submitted: { label: "Correction Submitted", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  completed: { label: "Completed", variant: "success" },
  overdue: { label: "Overdue", variant: "destructive" },
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "muted" },
  archived: { label: "Archived", variant: "muted" },
  published: { label: "Published", variant: "success" },
  open: { label: "Open", variant: "destructive" },
  resolved: { label: "Resolved", variant: "success" },
  in_remediation: { label: "In Remediation", variant: "warning" },
  accepted_risk: { label: "Risk Accepted", variant: "muted" },
  onboarding: { label: "Onboarding", variant: "default" },
  suspended: { label: "Suspended", variant: "destructive" },
};

const riskMap: Record<string, { label: string; variant: V }> = {
  critical: { label: "Critical", variant: "destructive" },
  high: { label: "High", variant: "destructive" },
  medium: { label: "Medium", variant: "warning" },
  low: { label: "Low", variant: "success" },
  minimal: { label: "Minimal", variant: "muted" },
};

export function StatusBadge({
                              status,
                            }: {
  status?: string | null;
}) {
  const key = (status ?? "").toLowerCase();

  const s =
      statusMap[key] ??
      {
        label: status || "Unknown",
        variant: "muted" as V,
      };

  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function RiskBadge({
                            level,
                          }: {
  level?: string | null;
}) {
  const key = (level ?? "").toLowerCase();

  const r =
      riskMap[key] ??
      {
        label: level || "Not Assessed",
        variant: "muted" as V,
      };

  return (
      <Badge variant={r.variant}>
        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
        {r.label}
      </Badge>
  );
}

export function SeverityBadge({
                                severity,
                              }: {
  severity?: string | null;
}) {
  return <RiskBadge level={severity} />;
}