import * as React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, ShieldX, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOGO_URL } from "@/lib/utils";

function Shell({ icon: Icon, code, title, desc, children }: { icon: React.ElementType; code: string; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6 text-center">
      <img src={LOGO_URL} alt="Vivriti NEXT" className="mb-8 h-8" />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-card text-muted-foreground"><Icon className="h-8 w-8" /></div>
      <p className="mt-6 text-5xl font-bold tracking-tight text-foreground">{code}</p>
      <h1 className="mt-2 text-xl font-semibold">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{desc}</p>
      <div className="mt-6 flex gap-2">{children}</div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <Shell icon={SearchX} code="404" title="Page not found" desc="The page you're looking for doesn't exist or has been moved.">
      <Button variant="outline" onClick={() => history.back()}><ArrowLeft className="h-4 w-4" /> Go back</Button>
      <Link to="/dashboard"><Button><Home className="h-4 w-4" /> Dashboard</Button></Link>
    </Shell>
  );
}
export function AccessDeniedPage() {
  return (
    <Shell icon={ShieldX} code="403" title="Access denied" desc="You don't have permission to view this resource. Contact your administrator if you believe this is an error.">
      <Link to="/dashboard"><Button><Home className="h-4 w-4" /> Back to dashboard</Button></Link>
    </Shell>
  );
}
