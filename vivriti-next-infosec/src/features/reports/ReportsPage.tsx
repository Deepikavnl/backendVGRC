import { FileBarChart, Download, FileText, FileSpreadsheet, Building2, ClipboardList, ShieldAlert, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartCard } from "@/components/charts/chart-card";
import { DonutChart } from "@/components/charts/donut-chart";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { TrendChart } from "@/components/charts/trend-chart";
import { riskDistribution, findingsBySeverity, complianceTrend, assessmentStatusDistribution } from "@/data/api";
import { exportToCSV } from "@/lib/export";
import { entities, assessments, findings } from "@/data/mock";
import { toast } from "@/store/toast";

const riskColors: Record<string, string> = { critical: "#dc2626", high: "#f97316", medium: "#f59e0b", low: "#10b981", minimal: "#94a3b8" };
const sevColors: Record<string, string> = { critical: "#dc2626", high: "#f97316", medium: "#f59e0b", low: "#10b981" };

const reports = [
  { name: "Vendor Report", desc: "Full posture profile per vendor including risk, findings and history.", icon: Building2 },
  { name: "Assessment Report", desc: "Detailed responses, scores and reviewer decisions for an assessment.", icon: ClipboardList },
  { name: "Findings Report", desc: "All findings with severity, ownership and remediation status.", icon: ShieldAlert },
  { name: "Risk Report", desc: "Portfolio risk distribution and trend across all third parties.", icon: TrendingUp },
  { name: "Executive Dashboard", desc: "Board-ready summary of program health and key metrics.", icon: FileBarChart },
];

export function ReportsPage() {
  const risk = riskDistribution().map((r) => ({ name: r.level[0].toUpperCase() + r.level.slice(1), value: r.count, color: riskColors[r.level] }));
  const sev = findingsBySeverity().map((f) => ({ name: f.severity[0].toUpperCase() + f.severity.slice(1), value: f.count, color: sevColors[f.severity] }));
  const status = assessmentStatusDistribution().map((s) => ({ name: s.status.replace(/_/g, " "), value: s.count }));

  return (
    <>
      <PageHeader title="Reports" description="Generate and export governance, risk and compliance reports." breadcrumbs={[{ label: "Reports" }]} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.name} className="group flex flex-col">
            <CardContent className="flex flex-1 flex-col p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300"><r.icon className="h-5 w-5" /></div>
              <h3 className="mt-3 font-semibold">{r.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.desc}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info("Generating PDF", `${r.name} is being prepared`)}><FileText className="h-3.5 w-3.5" /> PDF</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => exportToCSV(r.name.replace(/\s/g, "_"), r.name === "Findings Report" ? findings.map((f) => ({ Code: f.code, Title: f.title, Severity: f.severity, Status: f.status })) : r.name === "Assessment Report" ? assessments.map((a) => ({ Code: a.code, Entity: a.entityName, Status: a.status })) : entities.map((e) => ({ Name: e.name, Risk: e.riskRating, Compliance: e.complianceScore })))}><FileSpreadsheet className="h-3.5 w-3.5" /> Excel</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><ChartCard title="Compliance Trend" description="Portfolio compliance over time"><TrendChart data={complianceTrend()} /></ChartCard></div>
        <ChartCard title="Risk Distribution"><DonutChart data={risk} centerValue={entities.length} centerLabel="Vendors" /></ChartCard>
        <ChartCard title="Findings by Severity"><SimpleBarChart data={sev} /></ChartCard>
        <div className="lg:col-span-2"><ChartCard title="Assessments by Status"><SimpleBarChart data={status} color="#1f47d8" /></ChartCard></div>
      </div>
    </>
  );
}
