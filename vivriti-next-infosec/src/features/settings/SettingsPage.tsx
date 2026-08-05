import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useThemeStore } from "@/store/theme";
import { toast } from "@/store/toast";

function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 rounded-lg border p-4"><div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{desc}</p></div>{children}</div>;
}

export function SettingsPage() {
  const { theme, set } = useThemeStore();
  const [tab, setTab] = useState("general");
  const [emailNotif, setEmailNotif] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [mfa, setMfa] = useState(true);

  return (
    <>
      <PageHeader title="Settings" description="Configure platform preferences and organisation defaults." breadcrumbs={[{ label: "Settings" }]} />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="organisation">Organisation</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card><CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader><CardContent className="space-y-3">
            <Row title="Theme" desc="Choose light or dark mode"><Select value={theme} onValueChange={(v) => set(v as any)} className="w-32" options={[{ label: "Light", value: "light" }, { label: "Dark", value: "dark" }]} /></Row>
            <Row title="Density" desc="Table and list row spacing"><Select defaultValue="comfortable" className="w-36" options={[{ label: "Comfortable", value: "comfortable" }, { label: "Compact", value: "compact" }]} /></Row>
            <Row title="Language" desc="Interface language"><Select defaultValue="en" className="w-36" options={[{ label: "English", value: "en" }]} /></Row>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card><CardHeader><CardTitle className="text-base">Email &amp; alerts</CardTitle></CardHeader><CardContent className="space-y-3">
            <Row title="Email notifications" desc="Receive email for key events"><Switch checked={emailNotif} onCheckedChange={setEmailNotif} /></Row>
            <Row title="Due date reminders" desc="Automatic reminders before deadlines"><Switch checked={reminders} onCheckedChange={setReminders} /></Row>
            <Row title="Weekly digest" desc="Summary of activity every Monday"><Switch checked={false} onCheckedChange={() => {}} /></Row>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="security">
          <Card><CardHeader><CardTitle className="text-base">Access &amp; authentication</CardTitle></CardHeader><CardContent className="space-y-3">
            <Row title="Multi-factor authentication" desc="Require MFA for sign-in"><Switch checked={mfa} onCheckedChange={setMfa} /></Row>
            <Row title="Session timeout" desc="Auto sign-out after inactivity"><Select defaultValue="30" className="w-32" options={[{ label: "15 min", value: "15" }, { label: "30 min", value: "30" }, { label: "1 hour", value: "60" }]} /></Row>
            <div className="pt-1"><Button variant="outline">Change password</Button></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="organisation">
          <Card><CardHeader><CardTitle className="text-base">Organisation defaults</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Organisation name</Label><Input defaultValue="Vivriti NEXT Limited" /></div>
            <div className="space-y-1.5"><Label>Default reviewer SLA (days)</Label><Input type="number" defaultValue={7} /></div>
            <div className="space-y-1.5"><Label>Default assessment validity (months)</Label><Input type="number" defaultValue={12} /></div>
            <div className="space-y-1.5"><Label>Risk framework</Label><Select defaultValue="iso" options={[{ label: "ISO 27001", value: "iso" }, { label: "NIST CSF", value: "nist" }]} /></div>
            <div className="sm:col-span-2"><Button onClick={() => toast.success("Settings saved")}>Save settings</Button></div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
