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

    // =========================================================
    // LOAD FINDINGS
    // =========================================================

    useEffect(() => {
        const loadFindings = async () => {
            try {
                setLoading(true);

                const response: any =
                    await findingApi.getAllFindings();

                console.log("Findings API response:", response);

                /*
                 * Backend may return:
                 *
                 * 1. Array
                 * [
                 *   {...},
                 *   {...}
                 * ]
                 *
                 * 2. Axios response
                 * {
                 *   data: [...]
                 * }
                 *
                 * 3. Page response
                 * {
                 *   content: [...]
                 * }
                 */

                let findingList: Finding[] = [];

                if (Array.isArray(response)) {
                    findingList = response;
                } else if (
                    response &&
                    Array.isArray(response.data)
                ) {
                    findingList = response.data;
                } else if (
                    response &&
                    Array.isArray(response.content)
                ) {
                    findingList = response.content;
                } else if (
                    response &&
                    response.data &&
                    Array.isArray(response.data.content)
                ) {
                    findingList = response.data.content;
                }

                console.log(
                    "Normalized findings:",
                    findingList
                );

                setFindings(findingList);
            } catch (error) {
                console.error(
                    "Failed loading findings",
                    error
                );

                setFindings([]);
            } finally {
                setLoading(false);
            }
        };

        loadFindings();
    }, []);

    // =========================================================
    // FILTER + NEWEST FIRST SORTING
    // =========================================================

    const filtered = useMemo(() => {
        const searchText =
            search.trim().toLowerCase();

        const result = findings.filter((f: any) => {
            const title =
                String(f.title ?? "").toLowerCase();

            const entityName =
                String(f.entityName ?? "").toLowerCase();

            const code =
                String(f.code ?? "").toLowerCase();

            const topic =
                String(f.topic ?? "").toLowerCase();

            const matchesSearch =
                !searchText ||
                title.includes(searchText) ||
                entityName.includes(searchText) ||
                code.includes(searchText) ||
                topic.includes(searchText);

            const matchesSeverity =
                !sev ||
                String(f.severity ?? "").toUpperCase() ===
                sev;

            const matchesStatus =
                !status ||
                String(f.status ?? "").toUpperCase() ===
                status;

            return (
                matchesSearch &&
                matchesSeverity &&
                matchesStatus
            );
        });

        /*
         * IMPORTANT:
         *
         * Sort newest created finding first.
         *
         * createdAt DESC
         *
         * Example:
         *
         * 2026-08-17  -> first
         * 2026-08-16  -> second
         * 2026-08-15  -> third
         *
         * If createdAt is missing or equal,
         * use the ID as a fallback.
         */

        return result.sort((a: any, b: any) => {
            const dateA = a.createdAt
                ? new Date(a.createdAt).getTime()
                : 0;

            const dateB = b.createdAt
                ? new Date(b.createdAt).getTime()
                : 0;

            if (dateB !== dateA) {
                return dateB - dateA;
            }

            // Fallback: latest/highest ID first
            return (
                Number(b.id ?? 0) -
                Number(a.id ?? 0)
            );
        });
    }, [
        findings,
        search,
        sev,
        status,
    ]);

    // =========================================================
    // RESET PAGINATION WHEN FILTER CHANGES
    // =========================================================

    useEffect(() => {
        setPage(1);
    }, [
        search,
        sev,
        status,
    ]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const pageData = useMemo(() => {
        const start =
            (page - 1) * PAGE_SIZE;

        const end =
            start + PAGE_SIZE;

        return filtered.slice(
            start,
            end
        );
    }, [
        filtered,
        page,
    ]);

    // =========================================================
    // STATS
    // =========================================================

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
                (f: any) =>
                    String(
                        f.severity ?? ""
                    ).toUpperCase() ===
                    "CRITICAL"
            ).length,
            icon: ShieldAlert,
            accent: "red" as const,
        },
        {
            label: "Open",
            value: findings.filter(
                (f: any) =>
                    String(
                        f.status ?? ""
                    ).toUpperCase() ===
                    "OPEN"
            ).length,
            icon: AlertTriangle,
            accent: "amber" as const,
        },
        {
            label: "Resolved",
            value: findings.filter(
                (f: any) =>
                    String(
                        f.status ?? ""
                    ).toUpperCase() ===
                    "RESOLVED"
            ).length,
            icon: AlertTriangle,
            accent: "green" as const,
        },
    ];

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="flex items-center justify-center p-10">
                <p className="text-sm text-muted-foreground">
                    Loading findings...
                </p>
            </div>
        );
    }

    // =========================================================
    // UI
    // =========================================================

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
                                filtered.map(
                                    (f: any) => ({
                                        Code: f.code,
                                        Title: f.title,
                                        Entity:
                                        f.entityName,
                                        Severity:
                                            String(
                                                f.severity ??
                                                ""
                                            ),
                                        Status:
                                            String(
                                                f.status ??
                                                ""
                                            ),
                                        Owner:
                                        f.owner,
                                        Due:
                                            formatDate(
                                                f.dueDate
                                            ),
                                        Created:
                                            f.createdAt
                                                ? formatDate(
                                                    f.createdAt
                                                )
                                                : "",
                                    })
                                )
                            )
                        }
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                }
            />

            {/* =====================================================
                STAT CARDS
            ===================================================== */}

            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.label}
                        {...stat}
                    />
                ))}
            </div>

            {/* =====================================================
                FILTERS
            ===================================================== */}

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
                                label: "Remediation Submitted",
                                value: "REMEDIATION_SUBMITTED",
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

            {/* =====================================================
                EMPTY STATE
            ===================================================== */}

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
                                <TableHead>
                                    Code
                                </TableHead>

                                <TableHead>
                                    Finding
                                </TableHead>

                                <TableHead>
                                    Entity
                                </TableHead>

                                <TableHead>
                                    Severity
                                </TableHead>

                                <TableHead>
                                    Owner
                                </TableHead>

                                <TableHead>
                                    Status
                                </TableHead>

                                <TableHead>
                                    Due Date
                                </TableHead>

                                <TableHead>
                                    Created
                                </TableHead>

                                <TableHead className="w-10">
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {pageData.map(
                                (f: any) => (
                                    <TableRow
                                        key={f.id}
                                        className="cursor-pointer"
                                        onClick={() =>
                                            navigate(
                                                `/findings/${f.id}`
                                            )
                                        }
                                    >
                                        {/* CODE */}

                                        <TableCell className="font-mono text-xs">
                                            {f.code ||
                                                `FND-${f.id}`}
                                        </TableCell>

                                        {/* FINDING */}

                                        <TableCell>
                                            <div className="max-w-xs">
                                                <p className="truncate font-medium">
                                                    {f.title}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {f.topic ||
                                                        "-"}
                                                </p>
                                            </div>
                                        </TableCell>

                                        {/* ENTITY */}

                                        <TableCell>
                                            {f.entityName ||
                                                f.entity?.name ||
                                                "-"}
                                        </TableCell>

                                        {/* SEVERITY */}

                                        <TableCell>
                                            <RiskBadge
                                                level={
                                                    f.severity
                                                }
                                            />
                                        </TableCell>

                                        {/* OWNER */}

                                        <TableCell>
                                            {f.owner ||
                                                "-"}
                                        </TableCell>

                                        {/* STATUS */}

                                        <TableCell>
                                            <StatusBadge
                                                status={
                                                    f.status
                                                }
                                            />
                                        </TableCell>

                                        {/* DUE DATE */}

                                        <TableCell>
                                            {f.dueDate
                                                ? formatDate(
                                                    f.dueDate
                                                )
                                                : "-"}
                                        </TableCell>

                                        {/* CREATED */}

                                        <TableCell className="text-sm text-muted-foreground">
                                            {f.createdAt
                                                ? formatDate(
                                                    f.createdAt
                                                )
                                                : "-"}
                                        </TableCell>

                                        {/* ACTIONS */}

                                        <TableCell
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
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
                                                        navigate(
                                                            `/findings/${f.id}`
                                                        )
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>

                    {/* =================================================
                        PAGINATION
                    ================================================= */}

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

            {/* =====================================================
                RESULT SUMMARY
            ===================================================== */}

            {filtered.length > 0 && (
                <div className="mt-3 text-xs text-muted-foreground">
                    Showing{" "}
                    {Math.min(
                        (page - 1) *
                        PAGE_SIZE +
                        1,
                        filtered.length
                    )}{" "}
                    -{" "}
                    {Math.min(
                        page *
                        PAGE_SIZE,
                        filtered.length
                    )}{" "}
                    of{" "}
                    {filtered.length} findings
                </div>
            )}
        </>
    );
}