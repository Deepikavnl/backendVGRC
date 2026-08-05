import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Download,
    AlertTriangle,
    MoreHorizontal,
    Eye,
    ShieldAlert,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Toolbar, SearchInput } from "@/components/common/toolbar";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
    RiskBadge,
    StatusBadge,
} from "@/components/common/status-badge";
import {
    DropdownMenu,
    DropdownItem,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";

import { exportToCSV } from "@/lib/export";
import { formatDate } from "@/lib/utils";

import * as findingApi from "./findingApi";

import type { Finding } from "@/types";

const PAGE_SIZE = 10;

export function FindingsPage() {
    const navigate = useNavigate();

    const [findings, setFindings] = useState<Finding[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [sev, setSev] = useState("");
    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);

    const [detail, setDetail] = useState<Finding | null>(null);

    useEffect(() => {
        findingApi
            .getAllFindings()
            .then((response: any) => {
                setFindings(response.data);
            })
            .catch((error: any) => {
                console.error("Failed loading findings", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    const filtered = useMemo(() => {
        return findings.filter((f) => {
            const matchesSearch =
                !search ||
                f.title.toLowerCase().includes(search.toLowerCase()) ||
                (f.entityName ?? "")
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesSeverity =
                !sev || String(f.severity).toUpperCase() === sev;

            const matchesStatus =
                !status || String(f.status).toUpperCase() === status;

            return matchesSearch && matchesSeverity && matchesStatus;
        });
    }, [findings, search, sev, status]);

    const pageData = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const stats = [
        {
            label: "Total Findings",
            value: findings.length,
            icon: AlertTriangle,
            accent: "slate" as const,
        },
        {
            label: "Critical",
            value: findings.filter(
                (f) => String(f.severity).toUpperCase() === "CRITICAL"
            ).length,
            icon: ShieldAlert,
            accent: "red" as const,
        },
        {
            label: "Open",
            value: findings.filter(
                (f) => String(f.status).toUpperCase() === "OPEN"
            ).length,
            icon: AlertTriangle,
            accent: "amber" as const,
        },
        {
            label: "Resolved",
            value: findings.filter(
                (f) => String(f.status).toUpperCase() === "RESOLVED"
            ).length,
            icon: AlertTriangle,
            accent: "green" as const,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-10">
                Loading findings...
            </div>
        );
    }

    return (
        <>
            <PageHeader
                title="Findings"
                description="Control gaps identified through assessments and their remediation status."
                breadcrumbs={[
                    {
                        label: "Findings",
                    },
                ]}
                actions={
                    <Button
                        variant="outline"
                        onClick={() =>
                            exportToCSV(
                                "findings",
                                filtered.map((f) => ({
                                    Code: f.code,
                                    Title: f.title,
                                    Entity: f.entityName,
                                    Severity: String(f.severity),
                                    Status: String(f.status),
                                    Owner: f.owner,
                                    Due: formatDate(f.dueDate),
                                }))
                            )
                        }
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                }
            />

            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.label}
                        {...stat}
                    />
                ))}
            </div>

            <Toolbar>
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search findings..."
                    className="w-full sm:max-w-xs"
                />

                <div className="flex gap-2">
                    <Select
                        value={sev}
                        onValueChange={setSev}
                        placeholder="All Severity"
                        className="w-40"
                        options={[
                            {
                                label: "All Severity",
                                value: "",
                            },
                            {
                                label: "Critical",
                                value: "CRITICAL",
                            },
                            {
                                label: "High",
                                value: "HIGH",
                            },
                            {
                                label: "Medium",
                                value: "MEDIUM",
                            },
                            {
                                label: "Low",
                                value: "LOW",
                            },
                        ]}
                    />

                    <Select
                        value={status}
                        onValueChange={setStatus}
                        placeholder="All Status"
                        className="w-44"
                        options={[
                            {
                                label: "All Status",
                                value: "",
                            },
                            {
                                label: "Open",
                                value: "OPEN",
                            },
                            {
                                label: "In Remediation",
                                value: "IN_REMEDIATION",
                            },
                            {
                                label: "Resolved",
                                value: "RESOLVED",
                            },
                            {
                                label: "Accepted Risk",
                                value: "ACCEPTED_RISK",
                            },
                        ]}
                    />
                </div>
            </Toolbar>
            {filtered.length === 0 ? (
                <EmptyState
                    icon={AlertTriangle}
                    title="No Findings"
                    description="No findings match your filters."
                />
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Finding</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="w-10"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {pageData.map((f) => (
                                <TableRow
                                    key={f.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/findings/${f.id}`)}
                                >
                                    <TableCell className="font-mono text-xs">
                                        {f.code}
                                    </TableCell>

                                    <TableCell>
                                        <div className="max-w-xs">
                                            <p className="truncate font-medium">
                                                {f.title}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {f.topic}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {f.entityName}
                                    </TableCell>

                                    <TableCell>
                                        <RiskBadge level={f.severity} />
                                    </TableCell>

                                    <TableCell>
                                        {f.owner}
                                    </TableCell>

                                    <TableCell>
                                        <StatusBadge status={f.status} />
                                    </TableCell>

                                    <TableCell>
                                        {formatDate(f.dueDate)}
                                    </TableCell>

                                    <TableCell
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DropdownMenu
                                            trigger={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            }
                                        >
                                            <DropdownItem
                                                onClick={() =>
                                                    navigate(`/findings/${f.id}`)
                                                }
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="border-t px-4 py-3">
                        <Pagination
                            page={page}
                            pageSize={PAGE_SIZE}
                            total={filtered.length}
                            onPageChange={setPage}
                        />
                    </div>
                </Card>
            )}
        </>
    );
}