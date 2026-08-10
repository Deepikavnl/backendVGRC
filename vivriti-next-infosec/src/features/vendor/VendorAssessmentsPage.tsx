import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowRight,
    Building2,
    CalendarDays,
    ClipboardCheck,
    FileText,
    RefreshCw,
    Search,
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
    TableCell,
} from "@/components/ui/table";

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { EmptyState } from "@/components/ui/empty-state";

import { formatDate } from "@/lib/utils";

import { vendorApi } from "@/api/vendorApi";

import { toast } from "@/store/toast";


interface VendorAssessment {
    id: number;
    code?: string;
    entityId?: number;
    entityName?: string;
    templateName?: string;
    reviewerName?: string;
    status?: string;
    progress?: number;
    dueDate?: string;
    submittedAt?: string;
    completedAt?: string;
    score?: number;
    riskLevel?: string;
}


/*
 * ==========================================
 * STATUS STYLE
 * ==========================================
 */

const getStatusStyle = (status?: string) => {

    switch (status) {

        /*
         * GREEN
         * Approved / Completed
         */

        case "APPROVED":
        case "COMPLETED":

            return {
                container:
                    "border-green-200 bg-green-50/60 hover:bg-green-50",

                icon:
                    "bg-green-100 text-green-600",

                progress:
                    "bg-green-500",

                text:
                    "text-green-700",

                dot:
                    "bg-green-500",
            };


        /*
         * YELLOW
         * Submitted / Under Review
         */

        case "SUBMITTED":
        case "UNDER_REVIEW":

            return {
                container:
                    "border-yellow-200 bg-yellow-50/60 hover:bg-yellow-50",

                icon:
                    "bg-yellow-100 text-yellow-600",

                progress:
                    "bg-yellow-500",

                text:
                    "text-yellow-700",

                dot:
                    "bg-yellow-500",
            };


        /*
         * RED
         * Rejected / Correction
         */

        case "REJECTED":
        case "NEEDS_CORRECTION":
        case "CORRECTION_REQUIRED":
        case "CORRECTION":

            return {
                container:
                    "border-red-200 bg-red-50/60 hover:bg-red-50",

                icon:
                    "bg-red-100 text-red-600",

                progress:
                    "bg-red-500",

                text:
                    "text-red-700",

                dot:
                    "bg-red-500",
            };


        /*
         * BLUE
         * In Progress
         */

        case "IN_PROGRESS":

            return {
                container:
                    "border-blue-200 bg-blue-50/50 hover:bg-blue-50",

                icon:
                    "bg-blue-100 text-blue-600",

                progress:
                    "bg-blue-500",

                text:
                    "text-blue-700",

                dot:
                    "bg-blue-500",
            };


        /*
         * INDIGO
         * Assigned
         */

        case "ASSIGNED":

            return {
                container:
                    "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50",

                icon:
                    "bg-indigo-100 text-indigo-600",

                progress:
                    "bg-indigo-500",

                text:
                    "text-indigo-700",

                dot:
                    "bg-indigo-500",
            };


        /*
         * GRAY
         * Draft / Default
         */

        case "DRAFT":
        default:

            return {
                container:
                    "border-gray-200 bg-gray-50/50 hover:bg-gray-50",

                icon:
                    "bg-gray-100 text-gray-600",

                progress:
                    "bg-gray-400",

                text:
                    "text-gray-700",

                dot:
                    "bg-gray-400",
            };
    }
};


/*
 * ==========================================
 * STATUS LABEL
 * ==========================================
 */

const getStatusLabel = (status?: string) => {

    const value = status || "DRAFT";

    return value
        .split("_")
        .join(" ");
};


/*
 * ==========================================
 * COMPONENT
 * ==========================================
 */

export function VendorAssessmentsPage() {

    const navigate = useNavigate();


    /*
     * ======================================
     * STATE
     * ======================================
     */

    const [search, setSearch] =
        useState("");

    const [tab, setTab] =
        useState("all");

    const [assessments, setAssessments] =
        useState<VendorAssessment[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);


    /*
     * ======================================
     * LOAD ASSESSMENTS
     * ======================================
     */

    const loadAssessments = async (
        showRefresh = false
    ) => {

        try {

            if (showRefresh) {

                setRefreshing(true);

            } else {

                setLoading(true);

            }


            const data =
                await vendorApi.getVendorAssessments();


            setAssessments(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Failed to load vendor assessments",
                error
            );

            setAssessments([]);

            toast.error(
                "Failed to load assessments"
            );


        } finally {

            setLoading(false);

            setRefreshing(false);

        }
    };


    /*
     * ======================================
     * INITIAL LOAD
     * ======================================
     */

    useEffect(() => {

        loadAssessments();

    }, []);


    /*
     * ======================================
     * FILTER
     * ======================================
     */

    const filteredAssessments =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return assessments.filter(
                (assessment) => {


                    /*
                     * SEARCH
                     */

                    const searchableText = [

                        assessment.code,

                        assessment.entityName,

                        assessment.templateName,

                        assessment.reviewerName,

                        assessment.status,

                        assessment.riskLevel,

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    const searchMatch =
                        !searchValue ||
                        searchableText.includes(
                            searchValue
                        );


                    /*
                     * STATUS FILTER
                     */

                    let statusMatch = true;


                    if (tab === "drafts") {

                        statusMatch =
                            assessment.status ===
                            "DRAFT" ||

                            assessment.status ===
                            "ASSIGNED";

                    }


                    if (tab === "submitted") {

                        statusMatch =
                            assessment.status ===
                            "SUBMITTED" ||

                            assessment.status ===
                            "UNDER_REVIEW";

                    }


                    if (tab === "corrections") {

                        statusMatch =
                            assessment.status ===
                            "NEEDS_CORRECTION" ||

                            assessment.status ===
                            "CORRECTION_REQUIRED" ||

                            assessment.status ===
                            "CORRECTION" ||

                            assessment.status ===
                            "REJECTED";

                    }


                    return (
                        searchMatch &&
                        statusMatch
                    );

                }
            );

        }, [
            assessments,
            search,
            tab,
        ]);


    /*
     * ======================================
     * COUNTS
     * ======================================
     */

    const totalCount =
        assessments.length;


    const inProgressCount =
        assessments.filter(
            (assessment) =>
                assessment.status ===
                "IN_PROGRESS" ||
                assessment.status ===
                "ASSIGNED"
        ).length;


    const submittedCount =
        assessments.filter(
            (assessment) =>
                assessment.status ===
                "SUBMITTED" ||
                assessment.status ===
                "UNDER_REVIEW"
        ).length;


    const correctionCount =
        assessments.filter(
            (assessment) =>
                assessment.status ===
                "NEEDS_CORRECTION" ||
                assessment.status ===
                "CORRECTION_REQUIRED" ||
                assessment.status ===
                "CORRECTION" ||
                assessment.status ===
                "REJECTED"
        ).length;


    /*
     * ======================================
     * OPEN ASSESSMENT
     * ======================================
     */

    const openAssessment = (
        assessment: VendorAssessment
    ) => {

        navigate(
            `/vendor/assessments/${assessment.id}`
        );

    };


    /*
     * ======================================
     * LOADING
     * ======================================
     */

    if (loading) {

        return (

            <div className="space-y-6">

                <PageHeader
                    title="My Assessments"
                    description="Security assessments assigned to your organisation."
                />


                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {[1, 2, 3, 4].map(
                        (item) => (

                            <Card
                                key={item}
                                className="p-5"
                            >

                                <div className="animate-pulse space-y-3">

                                    <div className="h-4 w-24 rounded bg-muted" />

                                    <div className="h-8 w-16 rounded bg-muted" />

                                </div>

                            </Card>

                        )
                    )}

                </div>


                <Card>

                    <div className="flex min-h-[300px] items-center justify-center">

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

                            <p className="text-sm text-muted-foreground">

                                Loading your assessments...

                            </p>

                        </div>

                    </div>

                </Card>

            </div>

        );

    }


    /*
     * ======================================
     * PAGE
     * ======================================
     */

    return (

        <div className="space-y-6">


            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <PageHeader

                title="My Assessments"

                description="
                    Review and complete security assessments
                    assigned to your organisation.
                "

                actions={

                    <Button

                        variant="outline"

                        disabled={refreshing}

                        onClick={() =>
                            loadAssessments(true)
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


            {/* ================================= */}
            {/* SUMMARY CARDS */}
            {/* ================================= */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                {/* TOTAL */}

                <Card className="p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-muted-foreground">
                                Total Assessments
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                {totalCount}
                            </p>

                        </div>

                        <div className="rounded-xl bg-primary/10 p-3">

                            <ClipboardCheck
                                className="h-5 w-5 text-primary"
                            />

                        </div>

                    </div>

                </Card>


                {/* IN PROGRESS */}

                <Card className="border-blue-200 bg-blue-50/30 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-blue-700">
                                In Progress
                            </p>

                            <p className="mt-1 text-2xl font-bold text-blue-700">
                                {inProgressCount}
                            </p>

                        </div>

                        <div className="rounded-xl bg-blue-100 p-3">

                            <FileText
                                className="h-5 w-5 text-blue-600"
                            />

                        </div>

                    </div>

                </Card>


                {/* UNDER REVIEW */}

                <Card className="border-yellow-200 bg-yellow-50/30 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-yellow-700">
                                Under Review
                            </p>

                            <p className="mt-1 text-2xl font-bold text-yellow-700">
                                {submittedCount}
                            </p>

                        </div>

                        <div className="rounded-xl bg-yellow-100 p-3">

                            <ClipboardCheck
                                className="h-5 w-5 text-yellow-600"
                            />

                        </div>

                    </div>

                </Card>


                {/* CORRECTIONS */}

                <Card className="border-red-200 bg-red-50/30 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-red-700">
                                Corrections
                            </p>

                            <p className="mt-1 text-2xl font-bold text-red-700">
                                {correctionCount}
                            </p>

                        </div>

                        <div className="rounded-xl bg-red-100 p-3">

                            <RefreshCw
                                className="h-5 w-5 text-red-600"
                            />

                        </div>

                    </div>

                </Card>


            </div>


            {/* ================================= */}
            {/* FILTERS */}
            {/* ================================= */}

            <Card className="p-4">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                    {/* TABS */}

                    <Tabs
                        value={tab}
                        onValueChange={setTab}
                    >

                        <TabsList>

                            <TabsTrigger value="all">
                                All
                            </TabsTrigger>

                            <TabsTrigger value="drafts">
                                Drafts
                            </TabsTrigger>

                            <TabsTrigger value="submitted">
                                Under Review
                            </TabsTrigger>

                            <TabsTrigger value="corrections">
                                Corrections
                            </TabsTrigger>

                        </TabsList>

                    </Tabs>


                    {/* SEARCH */}

                    <div className="relative w-full lg:max-w-sm">

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

                            placeholder="Search assessment, entity, template or reviewer..."

                            className="pl-9"

                        />

                    </div>


                </div>

            </Card>


            {/* ================================= */}
            {/* EMPTY */}
            {/* ================================= */}

            {filteredAssessments.length === 0 && (

                <EmptyState

                    title={
                        search
                            ? "No matching assessments"
                            : "No assessments assigned"
                    }

                    description={
                        search
                            ? "Try changing your search criteria."
                            : "Your organisation does not have any security assessments yet."
                    }

                />

            )}


            {/* ================================= */}
            {/* TABLE */}
            {/* ================================= */}

            {filteredAssessments.length > 0 && (

                <Card className="overflow-hidden">


                    {/* TABLE HEADER */}

                    <div className="border-b px-6 py-4">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="font-semibold">
                                    Assigned Assessments
                                </h2>

                                <p className="text-sm text-muted-foreground">

                                    {filteredAssessments.length} assessment
                                    {filteredAssessments.length !== 1
                                        ? "s"
                                        : ""
                                    } found

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* TABLE */}

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
                                        Template
                                    </TableHead>

                                    <TableHead>
                                        Progress
                                    </TableHead>

                                    <TableHead>
                                        Status
                                    </TableHead>

                                    <TableHead>
                                        Due Date
                                    </TableHead>

                                    <TableHead className="w-[60px]" />

                                </TableRow>

                            </TableHeader>


                            <TableBody>

                                {filteredAssessments.map(
                                    (assessment) => {

                                        const progress =
                                            Math.min(
                                                Math.max(
                                                    Number(
                                                        assessment.progress ??
                                                        0
                                                    ),
                                                    0
                                                ),
                                                100
                                            );


                                        const statusStyle =
                                            getStatusStyle(
                                                assessment.status
                                            );


                                        return (

                                            <TableRow

                                                key={
                                                    assessment.id
                                                }

                                                className={`
                                                    cursor-pointer
                                                    border-l-4
                                                    transition-all
                                                    duration-200
                                                    ${statusStyle.container}
                                                `}

                                                onClick={() =>
                                                    openAssessment(
                                                        assessment
                                                    )
                                                }

                                            >


                                                {/* ===================== */}
                                                {/* ASSESSMENT */}
                                                {/* ===================== */}

                                                <TableCell>

                                                    <div className="flex items-center gap-3">

                                                        <div
                                                            className={`
                                                                flex
                                                                h-10
                                                                w-10
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-xl
                                                                ${statusStyle.icon}
                                                            `}
                                                        >

                                                            <ClipboardCheck className="h-5 w-5" />

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="truncate font-semibold">

                                                                {
                                                                    assessment.code ||
                                                                    `Assessment #${assessment.id}`
                                                                }

                                                            </p>

                                                            <p className="text-xs text-muted-foreground">

                                                                ID: {assessment.id}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </TableCell>


                                                {/* ===================== */}
                                                {/* ENTITY */}
                                                {/* ===================== */}

                                                <TableCell>

                                                    <div className="flex items-center gap-2">

                                                        <Building2
                                                            className="
                                                                h-4
                                                                w-4
                                                                shrink-0
                                                                text-muted-foreground
                                                            "
                                                        />

                                                        <span className="max-w-[180px] truncate">

                                                            {
                                                                assessment.entityName ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </div>

                                                </TableCell>


                                                {/* ===================== */}
                                                {/* TEMPLATE */}
                                                {/* ===================== */}

                                                <TableCell>

                                                    <div className="flex items-center gap-2">

                                                        <FileText
                                                            className="
                                                                h-4
                                                                w-4
                                                                shrink-0
                                                                text-muted-foreground
                                                            "
                                                        />

                                                        <span className="max-w-[180px] truncate">

                                                            {
                                                                assessment.templateName ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </div>

                                                </TableCell>


                                                {/* ===================== */}
                                                {/* PROGRESS */}
                                                {/* ===================== */}

                                                <TableCell>

                                                    <div className="min-w-[140px]">

                                                        <div className="mb-1 flex items-center justify-between">

                                                            <span className="text-xs text-muted-foreground">

                                                                Completion

                                                            </span>

                                                            <span
                                                                className={`
                                                                    text-xs
                                                                    font-semibold
                                                                    ${statusStyle.text}
                                                                `}
                                                            >

                                                                {progress}%

                                                            </span>

                                                        </div>


                                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">

                                                            <div
                                                                className={`
                                                                    h-full
                                                                    rounded-full
                                                                    transition-all
                                                                    duration-500
                                                                    ${statusStyle.progress}
                                                                `}
                                                                style={{
                                                                    width:
                                                                        `${progress}%`,
                                                                }}
                                                            />

                                                        </div>

                                                    </div>

                                                </TableCell>


                                                {/* ===================== */}
                                                {/* STATUS */}
                                                {/* ===================== */}

                                                <TableCell>

                                                    <div
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            rounded-full
                                                            border
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-semibold
                                                            ${statusStyle.container}
                                                            ${statusStyle.text}
                                                        `}
                                                    >

                                                        <span
                                                            className={`
                                                                mr-1.5
                                                                h-1.5
                                                                w-1.5
                                                                rounded-full
                                                                ${statusStyle.dot}
                                                            `}
                                                        />

                                                        {
                                                            getStatusLabel(
                                                                assessment.status
                                                            )
                                                        }

                                                    </div>

                                                </TableCell>


                                                {/* ===================== */}
                                                {/* DUE DATE */}
                                                {/* ===================== */}

                                                <TableCell>

                                                    <div className="flex items-center gap-2">

                                                        <CalendarDays
                                                            className="
                                                                h-4
                                                                w-4
                                                                shrink-0
                                                                text-muted-foreground
                                                            "
                                                        />

                                                        <span
                                                            className={`
                                                                whitespace-nowrap
                                                                text-sm
                                                                ${
                                                                assessment.dueDate
                                                                    ? "text-muted-foreground"
                                                                    : "text-muted-foreground"
                                                            }
                                                            `}
                                                        >

                                                            {
                                                                assessment.dueDate
                                                                    ? formatDate(
                                                                        assessment.dueDate
                                                                    )
                                                                    : "-"
                                                            }

                                                        </span>

                                                    </div>

                                                </TableCell>


                                                {/* ===================== */}
                                                {/* ACTION */}
                                                {/* ===================== */}

                                                <TableCell>

                                                    <Button

                                                        variant="ghost"

                                                        size="icon"

                                                        className="transition-transform hover:translate-x-1"

                                                        onClick={(event) => {

                                                            event.stopPropagation();

                                                            openAssessment(
                                                                assessment
                                                            );

                                                        }}

                                                    >

                                                        <ArrowRight
                                                            className="h-4 w-4"
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