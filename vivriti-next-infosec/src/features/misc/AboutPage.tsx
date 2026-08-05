import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LOGO_URL } from "@/lib/utils";
import { ShieldCheck, GitBranch, Layers, Cpu } from "lucide-react";

const modules = [
  { name: "Third Party Security Posture Management", status: "Live" },
  { name: "Risk Management", status: "Planned" },
  { name: "Compliance Management", status: "Planned" },
  { name: "Audit Management", status: "Planned" },
  { name: "Policy Management", status: "Planned" },
  { name: "Incident Management", status: "Planned" },
  { name: "Business Continuity", status: "Planned" },
];
const stack = ["React 19", "TypeScript", "Vite", "Tailwind CSS", "TanStack Query", "Zustand", "React Hook Form", "React Router", "Framer Motion", "Recharts", "dnd-kit"];

export function AboutPage() {
  return (
    <>
      <PageHeader title="About" description="Platform information and architecture." breadcrumbs={[{ label: "About" }]} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="flex items-start gap-5 p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-950 p-3"><img src={LOGO_URL} alt="Vivriti NEXT" className="h-full w-full object-contain" /></div>
            <div>
              <h2 className="text-xl font-bold">Vivriti NEXT InfoSec</h2>
              <p className="text-sm text-muted-foreground">Governance, Risk &amp; Compliance Platform</p>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">An enterprise GRC platform for the Vivriti NEXT Information Security team. The first module — Third Party Security Posture Management — is built on a modular, API-ready architecture so additional governance modules can plug in without redesign.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary"><ShieldCheck className="h-3 w-3" /> ISO 27001 aligned</Badge>
                <Badge variant="outline"><GitBranch className="h-3 w-3" /> v1.0.0</Badge>
                <Badge variant="outline"><Cpu className="h-3 w-3" /> Demo build</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Cpu className="h-4 w-4" /> Technology</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {stack.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4" /> Module roadmap</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">{m.name}</span>
                <Badge
                    variant={
                      m.status === "Live"
                          ? "secondary"
                          : "outline"
                    }>
                    </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
