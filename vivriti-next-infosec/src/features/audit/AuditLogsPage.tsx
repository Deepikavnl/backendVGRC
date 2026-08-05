import { useMemo, useState } from "react";
import { Download, ScrollText, Lock } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar, SearchInput } from "@/components/common/toolbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { auditLogs } from "@/data/mock";
import { exportToCSV } from "@/lib/export";
import { formatDateTime } from "@/lib/utils";

const PAGE_SIZE = 15;

export function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("");
  const [page, setPage] = useState(1);
  const modules = Array.from(new Set(auditLogs.map((l) => l.module)));

  const filtered = useMemo(() => auditLogs.filter((l) =>
    (!search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.entity.toLowerCase().includes(search.toLowerCase())) &&
    (!module || l.module === module)
  ), [search, module]);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHeader title="Audit Logs" description="Immutable record of every action across the platform." breadcrumbs={[{ label: "Audit Logs" }]}
        actions={<Button variant="outline" onClick={() => exportToCSV("audit_logs", filtered.map((l) => ({ Timestamp: formatDateTime(l.timestamp), User: l.user, Role: l.userRole, Action: l.action, Module: l.module, Entity: l.entity, Previous: l.previousValue ?? "", New: l.newValue ?? "", IP: l.ip })))}><Download className="h-4 w-4" /> Export</Button>} />

      <div className="mb-4 flex items-center gap-2 rounded-lg border bg-accent/40 px-4 py-2.5 text-sm text-muted-foreground"><Lock className="h-4 w-4 text-primary" /> Audit records are append-only and cannot be edited or deleted, in line with compliance requirements.</div>

      <Toolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by user, action or entity…" className="w-full sm:max-w-sm" />
        <Select value={module} onValueChange={setModule} placeholder="All Modules" className="w-48" options={[{ label: "All Modules", value: "" }, ...modules.map((m) => ({ label: m, value: m }))]} />
      </Toolbar>

      {filtered.length === 0 ? <EmptyState icon={ScrollText} title="No log entries" /> : (
        <Card><Table>
          <TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Module</TableHead><TableHead>Entity</TableHead><TableHead>Change</TableHead><TableHead>IP</TableHead></TableRow></TableHeader>
          <TableBody>
            {pageData.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDateTime(l.timestamp)}</TableCell>
                <TableCell><div className="flex items-center gap-2"><Avatar name={l.user} className="h-6 w-6 text-[9px]" /><div><p className="text-sm font-medium">{l.user}</p><p className="text-[10px] text-muted-foreground">{l.userRole}</p></div></div></TableCell>
                <TableCell className="text-sm">{l.action}</TableCell>
                <TableCell><Badge variant="secondary">{l.module}</Badge></TableCell>
                <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">{l.entity}</TableCell>
                <TableCell className="text-xs">{l.previousValue ? <span className="text-muted-foreground"><span className="line-through">{l.previousValue}</span> → <span className="font-medium text-foreground">{l.newValue}</span></span> : "—"}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table><div className="border-t px-4"><Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} /></div></Card>
      )}
    </>
  );
}
