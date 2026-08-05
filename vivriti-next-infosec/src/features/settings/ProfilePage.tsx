import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/toast";

export function ProfilePage() {
  const { user } = useAuthStore();
  return (
    <>
      <PageHeader title="Profile" description="Manage your personal information." breadcrumbs={[{ label: "Profile" }]} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card><CardContent className="flex flex-col items-center p-6 text-center">
          <Avatar name={user?.name ?? "U"} className="h-20 w-20 text-2xl" />
          <h2 className="mt-4 font-semibold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Badge variant="secondary" className="mt-2">{user?.role}</Badge>
          <Button variant="outline" size="sm" className="mt-4">Change photo</Button>
        </CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Personal information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue={user?.name} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={user?.email} /></div>
            <div className="space-y-1.5"><Label>Role</Label><Input defaultValue={user?.role} disabled /></div>
            <div className="space-y-1.5"><Label>Department</Label><Input defaultValue="Information Security" /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
            <div className="space-y-1.5"><Label>Location</Label><Input defaultValue="Chennai, India" /></div>
            <div className="sm:col-span-2"><Button onClick={() => toast.success("Profile updated")}>Save changes</Button></div>
          </CardContent></Card>
      </div>
    </>
  );
}
