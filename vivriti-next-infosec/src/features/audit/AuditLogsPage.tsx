import { useEffect, useMemo, useState } from "react";

import {
    Download,
    ScrollText,
    Lock
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";

import {
    Toolbar,
    SearchInput
} from "@/components/common/toolbar";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from "@/components/ui/table";

import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";

import {
    exportToCSV
} from "@/lib/export";

import {
    formatDateTime
} from "@/lib/utils";

import auditLogApi, {
    type AuditLog
} from "@/api/auditLogApi";


const PAGE_SIZE = 15;


export function AuditLogsPage() {

    /*
     * =========================================================
     * STATE
     * =========================================================
     */

    const [auditLogs, setAuditLogs] =
        useState<AuditLog[]>([]);

    const [search, setSearch] =
        useState("");

    const [module, setModule] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    const [loading, setLoading] =
        useState(false);


    /*
     * =========================================================
     * LOAD AUDIT LOGS
     * =========================================================
     */

    useEffect(() => {

        const loadAuditLogs = async () => {

            try {

                setLoading(true);

                const response =
                    await auditLogApi.getAuditLogs({

                        search,

                        module,

                        page: page - 1,

                        size: PAGE_SIZE

                    });


                setAuditLogs(
                    response.content || []
                );


                setTotal(
                    response.totalElements || 0
                );

            } catch (error) {

                console.error(
                    "Failed to load audit logs:",
                    error
                );

                setAuditLogs([]);

                setTotal(0);

            } finally {

                setLoading(false);

            }

        };


        loadAuditLogs();

    }, [
        search,
        module,
        page
    ]);


    /*
     * =========================================================
     * MODULE OPTIONS
     * =========================================================
     */

    const modules =
        useMemo(() => {

            return Array.from(
                new Set(
                    auditLogs
                        .map(
                            (log) => log.module
                        )
                        .filter(Boolean)
                )
            );

        }, [
            auditLogs
        ]);


    /*
     * =========================================================
     * EXPORT
     * =========================================================
     */

    const handleExport = () => {

        exportToCSV(

            "audit_logs",

            auditLogs.map(
                (log) => ({

                    Timestamp:
                    log.timestamp,

                    User:
                    log.user,

                    Action:
                    log.action,

                    Module:
                    log.module,

                    Entity:
                    log.entity,

                    PreviousValue:
                    log.previousValue,

                    NewValue:
                    log.newValue,

                    IP:
                    log.ip

                })
            )

        );

    };


    /*
     * =========================================================
     * PAGE
     * =========================================================
     */

    return (

        <>

            <PageHeader

                title="Audit Logs"

                description="
                    Immutable record of every action across the platform.
                "

                breadcrumbs={[
                    {
                        label: "Audit Logs"
                    }
                ]}

                actions={

                    <Button

                        variant="outline"

                        onClick={
                            handleExport
                        }

                        disabled={
                            loading ||
                            auditLogs.length === 0
                        }

                    >

                        <Download
                            className="
                                h-4
                                w-4
                                mr-2
                            "
                        />

                        Export

                    </Button>

                }

            />


            {/* =================================================
                COMPLIANCE MESSAGE
            ================================================= */}

            <div
                className="
                    mb-4
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    bg-accent/40
                    px-4
                    py-2.5
                    text-sm
                    text-muted-foreground
                "
            >

                <Lock
                    className="
                        h-4
                        w-4
                        text-primary
                    "
                />

                Audit records are append-only and cannot be edited
                or deleted, in line with compliance requirements.

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <Toolbar>

                <SearchInput

                    value={search}

                    onChange={(value) => {

                        setSearch(value);

                        setPage(1);

                    }}

                    placeholder="
                        Search by user, action or entity…
                    "

                    className="
                        w-full
                        sm:max-w-sm
                    "

                />


                <Select

                    value={module}

                    onValueChange={(value) => {

                        setModule(value);

                        setPage(1);

                    }}

                    placeholder="All Modules"

                    className="w-48"

                    options={[

                        {
                            label: "All Modules",
                            value: ""
                        },

                        ...modules.map(
                            (m) => ({

                                label: m,

                                value: m

                            })
                        )

                    ]}

                />

            </Toolbar>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <Card
                    className="
                        mt-4
                        p-8
                        text-center
                        text-sm
                        text-muted-foreground
                    "
                >

                    Loading audit logs...

                </Card>

            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
                auditLogs.length === 0 && (

                    <EmptyState

                        icon={ScrollText}

                        title="No log entries"

                    />

                )
            }


            {/* =================================================
                TABLE
            ================================================= */}

            {!loading &&
                auditLogs.length > 0 && (

                    <Card>

                        <Table>

                            <TableHeader>

                                <TableRow>

                                    <TableHead>
                                        Timestamp
                                    </TableHead>

                                    <TableHead>
                                        User
                                    </TableHead>

                                    <TableHead>
                                        Action
                                    </TableHead>

                                    <TableHead>
                                        Module
                                    </TableHead>

                                    <TableHead>
                                        Entity
                                    </TableHead>

                                    <TableHead>
                                        Change
                                    </TableHead>

                                    <TableHead>
                                        IP
                                    </TableHead>

                                </TableRow>

                            </TableHeader>


                            <TableBody>

                                {auditLogs.map(
                                    (log) => (

                                        <TableRow
                                            key={log.id}
                                        >

                                            {/* Timestamp */}

                                            <TableCell>

                                                {formatDateTime(
                                                    log.timestamp
                                                )}

                                            </TableCell>


                                            {/* User */}

                                            <TableCell>

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >

                                                    <Avatar

                                                        name={
                                                            log.user
                                                        }

                                                        className="
                                                            h-6
                                                            w-6
                                                            text-[9px]
                                                        "

                                                    />

                                                    <div>

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-medium
                                                            "
                                                        >

                                                            {
                                                                log.user
                                                            }

                                                        </p>

                                                        <p
                                                            className="
                                                                text-[10px]
                                                                text-muted-foreground
                                                            "
                                                        >

                                                            {
                                                                log.userRole
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </TableCell>


                                            {/* Action */}

                                            <TableCell>

                                                {log.action}

                                            </TableCell>


                                            {/* Module */}

                                            <TableCell>

                                                <Badge
                                                    variant="secondary"
                                                >

                                                    {
                                                        log.module
                                                    }

                                                </Badge>

                                            </TableCell>


                                            {/* Entity */}

                                            <TableCell>

                                                {
                                                    log.entity
                                                }

                                            </TableCell>


                                            {/* Change */}

                                            <TableCell>

                                                {
                                                    log.previousValue
                                                        ? (
                                                            <span>

                                                                {
                                                                    log.previousValue
                                                                }

                                                                {" → "}

                                                                {
                                                                    log.newValue
                                                                }

                                                            </span>
                                                        )
                                                        : "—"
                                                }

                                            </TableCell>


                                            {/* IP */}

                                            <TableCell>

                                                {
                                                    log.ip
                                                }

                                            </TableCell>

                                        </TableRow>

                                    )
                                )}

                            </TableBody>

                        </Table>


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        <div
                            className="
                                border-t
                                px-4
                            "
                        >

                            <Pagination

                                page={page}

                                pageSize={
                                    PAGE_SIZE
                                }

                                total={
                                    total
                                }

                                onPageChange={
                                    setPage
                                }

                            />

                        </div>

                    </Card>

                )
            }

        </>

    );

}