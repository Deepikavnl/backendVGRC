
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    History,
    Download,
    Search,
    RefreshCw,
    CheckCircle2,
    Clock3,
    XCircle,
    FileCheck2,
    ArrowRight
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from "@/components/ui/table";

import { EmptyState } from "@/components/ui/empty-state";

import { formatDate } from "@/lib/utils";

import { vendorApi } from "@/api/vendorApi";

import { toast } from "@/store/toast";


interface VendorHistoryItem {

    id: number;

    code?: string;

    templateName?: string;

    entityName?: string;

    submittedAt?: string;

    completedAt?: string;

    status?: string;

    score?: number;

    reviewerName?: string;

}


/*
 * ============================================================
 * STATUS CONFIGURATION
 * ============================================================
 */

const getStatusConfig = (
    status?: string
) => {

    const normalized =
        status?.toUpperCase() || "UNKNOWN";


    switch (normalized) {

        case "UNDER_REVIEW":

            return {
                label: "Under Review",
                className:
                    "bg-yellow-100 text-yellow-800 border-yellow-300",
                dot:
                    "bg-yellow-500",
                icon:
                    Clock3
            };


        case "APPROVED":

            return {
                label: "Approved",
                className:
                    "bg-green-100 text-green-800 border-green-300",
                dot:
                    "bg-green-500",
                icon:
                    CheckCircle2
            };


        case "REJECTED":

            return {
                label: "Rejected",
                className:
                    "bg-red-100 text-red-800 border-red-300",
                dot:
                    "bg-red-500",
                icon:
                    XCircle
            };


        case "SUBMITTED":

            return {
                label: "Submitted",
                className:
                    "bg-blue-100 text-blue-800 border-blue-300",
                dot:
                    "bg-blue-500",
                icon:
                    FileCheck2
            };


        case "COMPLETED":

            return {
                label: "Completed",
                className:
                    "bg-green-100 text-green-800 border-green-300",
                dot:
                    "bg-green-500",
                icon:
                    CheckCircle2
            };


        case "NEEDS_CORRECTION":

            return {
                label: "Needs Correction",
                className:
                    "bg-orange-100 text-orange-800 border-orange-300",
                dot:
                    "bg-orange-500",
                icon:
                    RefreshCw
            };


        default:

            return {
                label:
                    status || "Unknown",
                className:
                    "bg-gray-100 text-gray-700 border-gray-300",
                dot:
                    "bg-gray-500",
                icon:
                    History
            };

    }

};


/*
 * ============================================================
 * STATUS BADGE
 * ============================================================
 */

function DynamicStatusBadge({
    status
}: {
    status?: string;
}) {

    const config =
        getStatusConfig(status);


    const Icon =
        config.icon;


    return (

        <span
            className={`
inline-flex
items-center
gap-1.5
rounded-full
border
px-2.5
py-1
text-xs
font-medium
${config.className}
`}
        >

            <span
                className={`
h-1.5
w-1.5
rounded-full
${config.dot}
`}
            />

            <Icon
                className="h-3.5 w-3.5"
            />

            {config.label}

        </span>

    );

}


/*
 * ============================================================
 * PAGE
 * ============================================================
 */

export function VendorHistoryPage() {


    const navigate =
        useNavigate();


    const [history, setHistory] =
        useState<VendorHistoryItem[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [refreshing, setRefreshing] =
        useState(false);


    const [search, setSearch] =
        useState("");


    const [statusFilter, setStatusFilter] =
        useState("ALL");


    /*
     * ========================================================
     * LOAD HISTORY
     * ========================================================
     */

    const loadHistory = async (
        refresh = false
    ) => {

        try {

            if (refresh) {

                setRefreshing(true);

            } else {

                setLoading(true);

            }


            const data =
                await vendorApi.getVendorHistory();


            setHistory(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Failed to load history",
                error
            );


            setHistory([]);


            toast.error(
                "Failed to load submission history"
            );


        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    /*
     * ========================================================
     * INITIAL LOAD
     * ========================================================
     */

    useEffect(() => {

        loadHistory();

    }, []);


    /*
     * ========================================================
     * FILTER HISTORY
     * ========================================================
     */

    const filteredHistory =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return history.filter(
                (item) => {

                    const searchableText = [

                        item.code,

                        item.templateName,

                        item.entityName,

                        item.reviewerName,

                        item.status

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    const matchesSearch =
                        !searchValue ||
                        searchableText.includes(
                            searchValue
                        );


                    const matchesStatus =
                        statusFilter === "ALL" ||
                        item.status?.toUpperCase() ===
                            statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );

        }, [
            history,
            search,
            statusFilter
        ]);


    /*
     * ========================================================
     * STATISTICS
     * ========================================================
     */

    const total =
        history.length;


    const underReview =
        history.filter(
            (item) =>
                item.status?.toUpperCase() ===
                "UNDER_REVIEW"
        ).length;


    const approved =
        history.filter(
            (item) =>
                item.status?.toUpperCase() ===
                "APPROVED"
        ).length;


    const rejected =
        history.filter(
            (item) =>
                item.status?.toUpperCase() ===
                "REJECTED"
        ).length;


    /*
     * ========================================================
     * LOADING
     * ========================================================
     */

    if (loading) {

        return (

            <div className="space-y-6">

                <PageHeader

                    title="Submission History"

                    description="
                        Review your previous assessment
                        submissions and their outcomes.
                    "

                />


                <Card>

                    <div className="
                        flex
                        min-h-[300px]
                        items-center
                        justify-center
                    ">

                        <div className="text-center">

                            <div
                                className="
                                    mx-auto
                                    mb-4
                                    h-8
                                    w-8
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-primary
                                    border-t-transparent
                                "
                            />

                            <p className="
                                text-sm
                                text-muted-foreground
                            ">
                                Loading submission history...
                            </p>

                        </div>

                    </div>

                </Card>

            </div>

        );

    }


    /*
     * ========================================================
     * PAGE
     * ========================================================
     */

    return (

        <div className="space-y-6">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <PageHeader

                title="Submission History"

                description="
                    Track your past assessment submissions,
                    review decisions and scores.
                "

                actions={

                    <Button

                        variant="outline"

                        disabled={refreshing}

                        onClick={() =>
                            loadHistory(true)
                        }

                    >

                        <RefreshCw
                            className={`
mr-2
h-4
w-4
${
    refreshing
        ? "animate-spin"
        : ""
}
`}
                        />

                        Refresh

                    </Button>

                }

            />


            {/* ================================================= */}
            {/* SUMMARY CARDS */}
            {/* ================================================= */}

            <div className="
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
            ">


                {/* TOTAL */}

                <Card className="p-5">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-muted-foreground
                            ">
                                Total Submissions
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-bold
                            ">
                                {total}
                            </p>

                        </div>

                        <div className="
                            rounded-lg
                            bg-blue-100
                            p-3
                        ">

                            <History
                                className="
                                    h-5
                                    w-5
                                    text-blue-600
                                "
                            />

                        </div>

                    </div>

                </Card>


                {/* UNDER REVIEW */}

                <Card className="p-5">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-muted-foreground
                            ">
                                Under Review
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-bold
                                text-yellow-600
                            ">
                                {underReview}
                            </p>

                        </div>

                        <div className="
                            rounded-lg
                            bg-yellow-100
                            p-3
                        ">

                            <Clock3
                                className="
                                    h-5
                                    w-5
                                    text-yellow-600
                                "
                            />

                        </div>

                    </div>

                </Card>


                {/* APPROVED */}

                <Card className="p-5">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-muted-foreground
                            ">
                                Approved
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-bold
                                text-green-600
                            ">
                                {approved}
                            </p>

                        </div>

                        <div className="
                            rounded-lg
                            bg-green-100
                            p-3
                        ">

                            <CheckCircle2
                                className="
                                    h-5
                                    w-5
                                    text-green-600
                                "
                            />

                        </div>

                    </div>

                </Card>


                {/* REJECTED */}

                <Card className="p-5">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-muted-foreground
                            ">
                                Rejected
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-bold
                                text-red-600
                            ">
                                {rejected}
                            </p>

                        </div>

                        <div className="
                            rounded-lg
                            bg-red-100
                            p-3
                        ">

                            <XCircle
                                className="
                                    h-5
                                    w-5
                                    text-red-600
                                "
                            />

                        </div>

                    </div>

                </Card>


            </div>


            {/* ================================================= */}
            {/* FILTER BAR */}
            {/* ================================================= */}

            <Card className="p-4">

                <div className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                ">


                    {/* SEARCH */}

                    <div className="
                        relative
                        w-full
                        lg:max-w-sm
                    ">

                        <Search
                            className="
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-muted-foreground
                            "
                        />

                        <Input

                            value={search}

                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }

                            placeholder="
                                Search code, assessment,
                                entity or reviewer...
                            "

                            className="pl-9"

                        />

                    </div>


                    {/* STATUS FILTER */}

                    <div className="
                        flex
                        flex-wrap
                        gap-2
                    ">


                        <Button

                            size="sm"

                            variant={
                                statusFilter === "ALL"
                                    ? "default"
                                    : "outline"
                            }

                            onClick={() =>
                                setStatusFilter(
                                    "ALL"
                                )
                            }

                        >
                            All
                        </Button>


                        <Button

                            size="sm"

                            variant={
                                statusFilter ===
                                "UNDER_REVIEW"
                                    ? "default"
                                    : "outline"
                            }

                            onClick={() =>
                                setStatusFilter(
                                    "UNDER_REVIEW"
                                )
                            }

                        >
                            <Clock3 className="mr-1 h-4 w-4" />
                            Under Review
                        </Button>


                        <Button

                            size="sm"

                            variant={
                                statusFilter ===
                                "APPROVED"
                                    ? "default"
                                    : "outline"
                            }

                            onClick={() =>
                                setStatusFilter(
                                    "APPROVED"
                                )
                            }

                        >
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Approved
                        </Button>


                        <Button

                            size="sm"

                            variant={
                                statusFilter ===
                                "REJECTED"
                                    ? "default"
                                    : "outline"
                            }

                            onClick={() =>
                                setStatusFilter(
                                    "REJECTED"
                                )
                            }

                        >
                            <XCircle className="mr-1 h-4 w-4" />
                            Rejected
                        </Button>


                    </div>


                </div>

            </Card>


            {/* ================================================= */}
            {/* EMPTY */}
            {/* ================================================= */}

            {filteredHistory.length === 0 && (

                <EmptyState

                    icon={History}

                    title={
                        search ||
                        statusFilter !== "ALL"
                            ? "No matching submissions"
                            : "No submissions yet"
                    }

                    description={
                        search ||
                        statusFilter !== "ALL"
                            ? "Try changing your search or status filter."
                            : "Your completed assessment submissions will appear here."
                    }

                />

            )}


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            {filteredHistory.length > 0 && (

                <Card className="overflow-hidden">


                    <div className="
                        border-b
                        px-6
                        py-4
                    ">

                        <div>

                            <h2 className="font-semibold">
                                Assessment Submissions
                            </h2>

                            <p className="
                                text-sm
                                text-muted-foreground
                            ">
                                {filteredHistory.length}
                                {" "}
                                submission
                                {filteredHistory.length !== 1
                                    ? "s"
                                    : ""
                                }
                                {" "}
                                found
                            </p>

                        </div>

                    </div>


                    <div className="overflow-x-auto">


                        <Table>


                            <TableHeader>

                                <TableRow>

                                    <TableHead>
                                        Assessment
                                    </TableHead>

                                    <TableHead>
                                        Entity
                                    </TableHead>

                                    <TableHead>
                                        Submitted
                                    </TableHead>

                                    <TableHead>
                                        Status
                                    </TableHead>

                                    <TableHead>
                                        Score
                                    </TableHead>

                                    <TableHead>
                                        Reviewer
                                    </TableHead>

                                    <TableHead className="w-20" />

                                </TableRow>

                            </TableHeader>


                            <TableBody>

                                {filteredHistory.map(
                                    (item) => {

                                        const score =
                                            item.score;


                                        return (

                                            <TableRow

                                                key={
                                                    item.id
                                                }

                                                className="
                                                    cursor-pointer
                                                    transition-colors
                                                    hover:bg-muted/50
                                                "

                                                onClick={() =>
                                                    navigate(
                                                        `/vendor/assessments/${item.id}`
                                                    )
                                                }

                                            >


                                                {/* ASSESSMENT */}

                                                <TableCell>

                                                    <div>

                                                        <p className="
                                                            font-medium
                                                        ">

                                                            {
                                                                item.templateName ||
                                                                "Assessment"
                                                            }

                                                        </p>

                                                        <p className="
                                                            font-mono
                                                            text-xs
                                                            text-muted-foreground
                                                        ">

                                                            {
                                                                item.code ||
                                                                `#${item.id}`
                                                            }

                                                        </p>

                                                    </div>

                                                </TableCell>


                                                {/* ENTITY */}

                                                <TableCell>

                                                    <span className="
                                                        text-sm
                                                        text-muted-foreground
                                                    ">

                                                        {
                                                            item.entityName ||
                                                            "—"
                                                        }

                                                    </span>

                                                </TableCell>


                                                {/* SUBMITTED */}

                                                <TableCell>

                                                    <span className="
                                                        whitespace-nowrap
                                                        text-sm
                                                        text-muted-foreground
                                                    ">

                                                        {
                                                            item.submittedAt
                                                                ? formatDate(
                                                                    item.submittedAt
                                                                )
                                                                : "—"
                                                        }

                                                    </span>

                                                </TableCell>


                                                {/* STATUS */}

                                                <TableCell>

                                                    <DynamicStatusBadge
                                                        status={
                                                            item.status
                                                        }
                                                    />

                                                </TableCell>


                                                {/* SCORE */}

                                                <TableCell>

                                                    {
                                                        score !==
                                                            undefined &&
                                                        score !==
                                                            null
                                                            ? (
                                                                <span className="
                                                                    font-semibold
                                                                ">
                                                                    {score}%
                                                                </span>
                                                            )
                                                            : (
                                                                <span className="
                                                                    text-sm
                                                                    text-muted-foreground
                                                                ">
                                                                    —
                                                                </span>
                                                            )
                                                    }

                                                </TableCell>


                                                {/* REVIEWER */}

                                                <TableCell>

                                                    <span className="
                                                        text-sm
                                                        text-muted-foreground
                                                    ">

                                                        {
                                                            item.reviewerName ||
                                                            "—"
                                                        }

                                                    </span>

                                                </TableCell>


                                                {/* ACTION */}

                                                <TableCell

                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }

                                                >

                                                    <Button

                                                        variant="ghost"

                                                        size="icon"

                                                        onClick={() =>
                                                            navigate(
                                                                `/vendor/assessments/${item.id}`
                                                            )
                                                        }

                                                    >

                                                        <ArrowRight
                                                            className="
                                                                h-4
                                                                w-4
                                                            "
                                                        />

                                                    </Button>

                                                </TableCell>


                                            </TableRow>

                                        );

                                    }
                                )}

                            </TableBody>

                        </Table>

                    </div>

                </Card>

            )}


        </div>

    );

}

