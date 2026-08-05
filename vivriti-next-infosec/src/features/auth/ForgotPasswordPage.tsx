import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGO_URL } from "@/lib/utils";

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-elevated">
        <img src={LOGO_URL} alt="Vivriti NEXT" className="mb-6 h-8" />
        {!sent ? (
          <>
            <h1 className="text-xl font-bold">Reset your password</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send you a secure reset link.</p>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@vivritinext.com" className="pl-9" required />
                </div>
              </div>
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success"><CheckCircle2 className="h-6 w-6" /></div>
            <h1 className="text-xl font-bold">Check your inbox</h1>
            <p className="mt-1 text-sm text-muted-foreground">We've sent a password reset link to your email address.</p>
          </div>
        )}
        <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
