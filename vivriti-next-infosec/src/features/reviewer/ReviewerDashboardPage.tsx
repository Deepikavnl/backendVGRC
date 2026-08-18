import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    UserCheck,
    Clock,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    ClipboardList,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import {
    Toolbar,
    SearchInput,
} from "@/components/common/toolbar";

import { StatCard } from "@/components/common/stat-card";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

import {
    RiskBadge,
    StatusBadge,
} from "@/components/common/status-badge";

import { EmptyState } from "@/components/ui/empty-state";

import assessmentApi from "@/features/assessments/assessment";


// =============================================================
// REVIEWER DASHBOARD
// =============================================================

export function ReviewerDashboardPage() {

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [assessments, setAssessments] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const ITEMS_PER_PAGE = 10;


    // =========================================================
    // OPEN ASSESSMENT
    // =========================================================

    const openAssessmentForReview = (
        assessmentId: number | string
    ) => {

        if (
            assessmentId === undefined ||
            assessmentId === null ||
            assessmentId === ""
        ) {

            console.error(
                "Cannot open assessment: Assessment ID is missing."
            );

            return;
        }

        navigate(
            `/reviewer/review/${assessmentId}`
        );
    };


    // =========================================================
    // LOAD ASSESSMENTS
    // =========================================================

    useEffect(() => {

        const loadAssessments = async () => {

            try {

                setLoading(true);

                const response =
                    await assessmentApi.getAllAssessments();

                console.log(
                    "ALL ASSESSMENTS RESPONSE:",
                    response
                );


                let assessmentList: any[] = [];


                // -------------------------------------------------
                // ARRAY RESPONSE
                // -------------------------------------------------

                if (Array.isArray(response)) {

                    assessmentList = response;

                }


                    // -------------------------------------------------
                    // PAGE RESPONSE
                // -------------------------------------------------

                else if (
                    response &&
                    Array.isArray(
                        (response as any).content
                    )
                ) {

                    assessmentList =
                        (response as any).content;

                }


                    // -------------------------------------------------
                    // DATA RESPONSE
                // -------------------------------------------------

                else if (
                    response &&
                    Array.isArray(
                        (response as any).data
                    )
                ) {

                    assessmentList =
                        (response as any).data;

                }


                    // -------------------------------------------------
                    // ASSESSMENTS RESPONSE
                // -------------------------------------------------

                else if (
                    response &&
                    Array.isArray(
                        (response as any).assessments
                    )
                ) {

                    assessmentList =
                        (response as any).assessments;

                }


                console.log(
                    "NORMALIZED ASSESSMENTS:",
                    assessmentList
                );


                setAssessments(
                    assessmentList
                );

                setCurrentPage(1);

            } catch (error) {

                console.error(
                    "Failed to load assessments:",
                    error
                );

                setAssessments([]);

            } finally {

                setLoading(false);

            }

        };


        loadAssessments();

    }, []);


    // =========================================================
    // SORT
    // =========================================================

    const sortedAssessments =
        useMemo(() => {

            return [...assessments].sort(
                (a: any, b: any) => {

                    const dateA =
                        a.createdAt
                            ? new Date(
                                a.createdAt
                            ).getTime()
                            : 0;

                    const dateB =
                        b.createdAt
                            ? new Date(
                                b.createdAt
                            ).getTime()
                            : 0;


                    if (dateB !== dateA) {

                        return dateB - dateA;

                    }


                    return (
                        Number(b.id ?? 0) -
                        Number(a.id ?? 0)
                    );

                }
            );

        }, [assessments]);


    // =========================================================
    // SEARCH
    // =========================================================

    const filtered =
        useMemo(() => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            if (!searchText) {

                return sortedAssessments;

            }


            return sortedAssessments.filter(
                (a: any) => {

                    const entityName =
                        String(
                            a.entityName ?? ""
                        ).toLowerCase();


                    const entityObjectName =
                        String(
                            a.entity?.name ?? ""
                        ).toLowerCase();


                    const code =
                        String(
                            a.code ?? ""
                        ).toLowerCase();


                    const templateName =
                        String(
                            a.templateName ?? ""
                        ).toLowerCase();


                    const templateObjectName =
                        String(
                            a.template?.name ?? ""
                        ).toLowerCase();


                    const status =
                        String(
                            a.status ?? ""
                        ).toLowerCase();


                    return (
                        entityName.includes(searchText) ||
                        entityObjectName.includes(searchText) ||
                        code.includes(searchText) ||
                        templateName.includes(searchText) ||
                        templateObjectName.includes(searchText) ||
                        status.includes(searchText)
                    );

                }
            );

        }, [
            sortedAssessments,
            search,
        ]);


    // =========================================================
    // RESET PAGINATION WHEN SEARCH CHANGES
    // =========================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =========================================================
    // STATUS COUNTS
    // =========================================================

    const submittedCount =
        useMemo(() => {

            return assessments.filter(
                (a: any) =>
                    String(
                        a.status ?? ""
                    ).toUpperCase() ===
                    "SUBMITTED"
            ).length;

        }, [assessments]);


    const underReviewCount =
        useMemo(() => {

            return assessments.filter(
                (a: any) =>
                    String(
                        a.status ?? ""
                    ).toUpperCase() ===
                    "UNDER_REVIEW"
            ).length;

        }, [assessments]);


    const correctionCount =
        useMemo(() => {

            return assessments.filter(
                (a: any) =>
                    String(
                        a.status ?? ""
                    ).toUpperCase() ===
                    "CORRECTION_REQUIRED"
            ).length;

        }, [assessments]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filtered.length /
                ITEMS_PER_PAGE
            )
        );


    useEffect(() => {

        if (
            currentPage >
            totalPages
        ) {

            setCurrentPage(
                totalPages
            );

        }

    }, [
        currentPage,
        totalPages,
    ]);


    const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;


    const endIndex =
        startIndex +
        ITEMS_PER_PAGE;


    const paginatedAssessments =
        filtered.slice(
            startIndex,
            endIndex
        );


    // =========================================================
    // PAGE NUMBERS
    // =========================================================

    const pageNumbers =
        useMemo(() => {

            const pages: number[] = [];


            for (
                let page = 1;
                page <= totalPages;
                page++
            ) {

                pages.push(page);

            }


            return pages;

        }, [totalPages]);


    // =========================================================
    // STATS
    // =========================================================

    const stats = [

        {
            label: "Total Assessments",
            value: assessments.length,
            icon: ClipboardList,
            accent: "blue" as const,
        },

        {
            label: "Submitted",
            value: submittedCount,
            icon: Clock,
            accent: "amber" as const,
        },

        {
            label: "Under Review",
            value: underReviewCount,
            icon: UserCheck,
            accent: "blue" as const,
        },

        {
            label: "Needs Correction",
            value: correctionCount,
            icon: AlertCircle,
            accent: "red" as const,
        },

    ];


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="p-6">

                <p className="text-sm text-muted-foreground">
                    Loading assessments...
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
                title="Reviewer Workspace"
                description="View and review all assessments."
                breadcrumbs={[
                    {
                        label:
                            "Reviewer Workspace",
                    },
                ]}
            />


            {/* =====================================================
                STAT CARDS
            ====================================================== */}

            <div
                className="
                    mb-6
                    grid
                    grid-cols-2
                    gap-4
                    lg:grid-cols-4
                "
            >

                {stats.map(
                    (stat) => (

                        <StatCard
                            key={
                                stat.label
                            }
                            {...stat}
                        />

                    )
                )}

            </div>


            {/* =====================================================
                SEARCH
            ====================================================== */}

            <Toolbar>

                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search assessments..."
                    className="
                        w-full
                        sm:max-w-sm
                    "
                />

            </Toolbar>


            {/* =====================================================
                NO DATA
            ====================================================== */}

            {filtered.length === 0 ? (

                <EmptyState
                    icon={CheckCircle2}
                    title={
                        search
                            ? "No assessments found"
                            : "No assessments available"
                    }
                    description={
                        search
                            ? "Try changing your search criteria."
                            : "There are no assessments in the system."
                    }
                />

            ) : (

                <>

                    {/* =================================================
                        TABLE
                    ================================================== */}

                    <Card>

                        <Table>

                            <TableHeader>

                                <TableRow>

                                    <TableHead>
                                        Code
                                    </TableHead>

                                    <TableHead>
                                        Entity
                                    </TableHead>

                                    <TableHead>
                                        Template
                                    </TableHead>

                                    <TableHead>
                                        Risk
                                    </TableHead>

                                    <TableHead>
                                        Progress
                                    </TableHead>

                                    <TableHead>
                                        Status
                                    </TableHead>

                                    <TableHead />

                                </TableRow>

                            </TableHeader>


                            <TableBody>

                                {paginatedAssessments.map(
                                    (assessment: any) => {

                                        // =================================================
                                        // PROGRESS
                                        // =================================================

                                        const rawProgress =
                                            Number(
                                                assessment.progress ??
                                                0
                                            );


                                        const progress =
                                            Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    rawProgress
                                                )
                                            );


                                        return (

                                            <TableRow
                                                key={
                                                    assessment.id
                                                }
                                                className="
                                                    cursor-pointer
                                                "
                                                onClick={() =>
                                                    openAssessmentForReview(
                                                        assessment.id
                                                    )
                                                }
                                            >

                                                {/* =================================================
                                                    CODE
                                                ================================================== */}

                                                <TableCell
                                                    className="
                                                        font-mono
                                                        text-xs
                                                    "
                                                >

                                                    {assessment.code ||
                                                        `ASM-${assessment.id}`}

                                                </TableCell>


                                                {/* =================================================
                                                    ENTITY
                                                ================================================== */}

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
                                                                assessment.entityName ||
                                                                assessment.entity?.name ||
                                                                "Entity"
                                                            }
                                                            className="
                                                                h-7
                                                                w-7
                                                            "
                                                        />


                                                        <div
                                                            className="
                                                                min-w-0
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    truncate
                                                                    text-sm
                                                                    font-medium
                                                                "
                                                            >

                                                                {assessment.entityName ||
                                                                    assessment.entity?.name ||
                                                                    "-"}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </TableCell>


                                                {/* =================================================
                                                    TEMPLATE
                                                ================================================== */}

                                                <TableCell>

                                                    <span
                                                        className="
                                                            text-sm
                                                        "
                                                    >

                                                        {assessment.templateName ||
                                                            assessment.template?.name ||
                                                            "-"}

                                                    </span>

                                                </TableCell>


                                                {/* =================================================
                                                    RISK
                                                ================================================== */}

                                                <TableCell>

                                                    <RiskBadge
                                                        level={
                                                            assessment.riskRating ||
                                                            assessment.riskLevel ||
                                                            "LOW"
                                                        }
                                                    />

                                                </TableCell>


                                                {/* =================================================
                                                    PROGRESS
                                                ================================================== */}

                                                <TableCell>

                                                    <div
                                                        className="
                                                            flex
                                                            min-w-[120px]
                                                            items-center
                                                            gap-2
                                                        "
                                                    >

                                                        <Progress
                                                            value={
                                                                progress
                                                            }
                                                            className="
                                                                w-20
                                                            "
                                                        />


                                                        <span
                                                            className="
                                                                whitespace-nowrap
                                                                text-xs
                                                                font-medium
                                                                text-muted-foreground
                                                            "
                                                        >

                                                            {progress}%

                                                        </span>

                                                    </div>

                                                </TableCell>


                                                {/* =================================================
                                                    STATUS
                                                ================================================== */}

                                                <TableCell>

                                                    <StatusBadge
                                                        status={
                                                            assessment.status ||
                                                            "DRAFT"
                                                        }
                                                    />

                                                </TableCell>


                                                {/* =================================================
                                                    OPEN
                                                ================================================== */}

                                                <TableCell>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(
                                                            event
                                                        ) => {

                                                            event.stopPropagation();

                                                            openAssessmentForReview(
                                                                assessment.id
                                                            );

                                                        }}
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

                    </Card>


                    {/* =================================================
                        PAGINATION
                    ================================================== */}

                    <div
                        className="
                            mt-4
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div
                            className="
                                text-xs
                                text-muted-foreground
                            "
                        >

                            Showing{" "}

                            <span className="font-medium">

                                {filtered.length === 0
                                    ? 0
                                    : startIndex + 1}

                            </span>{" "}

                            to{" "}

                            <span className="font-medium">

                                {Math.min(
                                    endIndex,
                                    filtered.length
                                )}

                            </span>{" "}

                            of{" "}

                            <span className="font-medium">

                                {filtered.length}

                            </span>{" "}

                            assessments

                        </div>


                        {totalPages > 1 && (

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1
                                "
                            >

                                {/* PREVIOUS */}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.max(
                                                    1,
                                                    page - 1
                                                )
                                        )
                                    }
                                >

                                    <ChevronLeft
                                        className="
                                            mr-1
                                            h-4
                                            w-4
                                        "
                                    />

                                    Previous

                                </Button>


                                {/* PAGE NUMBERS */}

                                <div
                                    className="
                                        hidden
                                        items-center
                                        gap-1
                                        sm:flex
                                    "
                                >

                                    {pageNumbers.map(
                                        (page) => (

                                            <Button
                                                key={page}
                                                variant={
                                                    currentPage === page
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                className="
                                                    min-w-9
                                                "
                                                onClick={() =>
                                                    setCurrentPage(
                                                        page
                                                    )
                                                }
                                            >

                                                {page}

                                            </Button>

                                        )
                                    )}

                                </div>


                                {/* MOBILE PAGE */}

                                <span
                                    className="
                                        px-2
                                        text-xs
                                        text-muted-foreground
                                        sm:hidden
                                    "
                                >

                                    Page{" "}
                                    {currentPage} of{" "}
                                    {totalPages}

                                </span>


                                {/* NEXT */}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.min(
                                                    totalPages,
                                                    page + 1
                                                )
                                        )
                                    }
                                >

                                    Next

                                    <ChevronRight
                                        className="
                                            ml-1
                                            h-4
                                            w-4
                                        "
                                    />

                                </Button>

                            </div>

                        )}

                    </div>

                </>

            )}


            {/* =====================================================
                SUMMARY
            ====================================================== */}

            <div
                className="
                    mt-4
                    text-xs
                    text-muted-foreground
                "
            >

                {filtered.length > 0
                    ? `Page ${currentPage} of ${totalPages} · `
                    : ""}

                Showing {filtered.length} of{" "}

                {assessments.length} assessments

            </div>

        </>

    );
}