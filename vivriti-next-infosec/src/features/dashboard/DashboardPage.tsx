import { useNavigate } from "react-router-dom";
import {
  Building2, ClipboardCheck, ClipboardList, CalendarClock, ShieldAlert, AlertTriangle,
  CheckCircle2, TrendingUp, Plus, FileBarChart, UserPlus, ArrowRight, Activity, Bell,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { RiskBadge, StatusBadge } from "@/components/common/status-badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ChartCard } from "@/components/charts/chart-card";
import { DonutChart } from "@/components/charts/donut-chart";
import { TrendChart } from "@/components/charts/trend-chart";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { dashboardStats, riskDistribution, complianceTrend, findingsBySeverity } from "@/data/api";
import { assessments, auditLogs, entities } from "@/data/mock";
import { relativeTime, pct } from "@/lib/utils";

const riskColors: Record<string, string> = { critical: "#dc2626", high: "#f97316", medium: "#f59e0b", low: "#10b981", minimal: "#94a3b8" };
const sevColors: Record<string, string> = { critical: "#dc2626", high: "#f97316", medium: "#f59e0b", low: "#10b981" };

export function DashboardPage() {
  const navigate = useNavigate();
  const s = dashboardStats();
  const risk = riskDistribution();
  const trend = complianceTrend();
  const findings = findingsBySeverity();

  const donutData = risk.map((r) => ({ name: r.level[0].toUpperCase() + r.level.slice(1), value: r.count, color: riskColors[r.level] }));
  const barData = findings.map((f) => ({ name: f.severity[0].toUpperCase() + f.severity.slice(1), value: f.count, color: sevColors[f.severity] }));

  const recentAssessments = [...assessments]
    .filter((a) => ["submitted", "under_review", "needs_correction", "in_progress"].includes(a.status))
    .slice(0, 6);
  const topRisk = [...entities].filter((e) => e.riskRating === "critical" || e.riskRating === "high").slice(0, 5);

  const stats = [
    { label: "Total Vendors", value: s.totalVendors, icon: Building2, accent: "blue" as const, trend: { value: "6.2%", up: true }, to: "/entities" },
    { label: "Active Assessments", value: s.activeAssessments, icon: ClipboardList, accent: "blue" as const, trend: { value: "12%", up: true }, to: "/assessments" },
    { label: "Pending Reviews", value: s.pendingReviews, icon: ClipboardCheck, accent: "amber" as const, trend: { value: "4%", up: false, positive: true }, to: "/reviewer" },
    { label: "Assessments Due", value: s.dueSoon, icon: CalendarClock, accent: "amber" as const, to: "/assessments" },
    { label: "High Risk Vendors", value: s.highRisk, icon: ShieldAlert, accent: "red" as const, trend: { value: "2", up: false, positive: true }, to: "/entities" },
    { label: "Open Findings", value: s.openFindings, icon: AlertTriangle, accent: "red" as const, to: "/findings" },
    { label: "Compliance", value: pct(s.compliance), icon: TrendingUp, accent: "green" as const, trend: { value: "3.1%", up: true }, to: "/reports" },
    { label: "Completed", value: s.completed, icon: CheckCircle2, accent: "green" as const, trend: { value: "18%", up: true }, to: "/assessments" },
  ];

  return (
    <>
      <PageHeader
        title="Executive Dashboard"
        description="Third-party security posture at a glance — Thursday, 09 July 2026"
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/reports")}><FileBarChart className="h-4 w-4" /> Reports</Button>
            <Button onClick={() => navigate("/assessments/new")}><Plus className="h-4 w-4" /> New Assessment</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {stats.map((st) => (
          <StatCard key={st.label} {...st} onClick={() => navigate(st.to)} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Compliance Trend" description="Portfolio-wide compliance score over the last 7 months">
            <TrendChart data={trend} />
          </ChartCard>
        </div>
        <ChartCard title="Vendor Risk Distribution" description="By inherent risk rating">
          <DonutChart data={donutData} centerValue={s.totalVendors} centerLabel="Vendors" />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" /> Assessments in Motion</CardTitle>
            <CardDescription className="mt-1">Live assessments requiring attention</CardDescription></div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/assessments")}>View all <ArrowRight className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentAssessments.map((a) => (
              <button key={a.id} onClick={() => navigate(`/assessments/${a.id}`)}
                className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-muted">
                <Avatar name={a.entityName} className="h-9 w-9" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.entityName}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.code} · {a.templateName}</p>
                </div>
                <div className="hidden w-28 sm:block"><Progress value={a.progress} /><span className="text-[11px] text-muted-foreground">{a.progress}%</span></div>
                <StatusBadge status={a.status} />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Quick actions + notifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { label: "New Assessment", icon: Plus, to: "/assessments/new" },
                { label: "Add Entity", icon: UserPlus, to: "/entities" },
                { label: "Build Template", icon: ClipboardList, to: "/templates/builder" },
                { label: "View Findings", icon: AlertTriangle, to: "/findings" },
              ].map((q) => (
                <button key={q.label} onClick={() => navigate(q.to)}
                  className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/50">
                  <q.icon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">{q.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
          <ChartCard title="Findings by Severity">
            <SimpleBarChart data={barData} />
          </ChartCard>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-destructive" /> High Risk Vendors</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/entities")}>View all <ArrowRight className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {topRisk.map((e) => (
              <button key={e.id} onClick={() => navigate(`/entities/${e.id}`)} className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left hover:bg-muted">
                <Avatar name={e.name} className="h-9 w-9" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{e.name}</p><p className="truncate text-xs text-muted-foreground">{e.category} · {e.country}</p></div>
                <span className="hidden text-xs text-muted-foreground sm:block">{e.openFindings} findings</span>
                <RiskBadge level={e.riskRating} />
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {auditLogs.slice(0, 6).map((l) => (
              <div key={l.id} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0"><p className="text-sm"><span className="font-medium">{l.user}</span> <span className="text-muted-foreground">{l.action.toLowerCase()}</span></p>
                <p className="text-xs text-muted-foreground">{l.module} · {relativeTime(l.timestamp)}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
