
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import assessmentApi, {
    Assessment
} from "./assessment";

import { PageHeader } from "@/components/common/page-header";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import {
    Plus,
    Search,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import { toast } from "@/store/toast";


const ITEMS_PER_PAGE = 10;


export function AssessmentPage() {

    const navigate = useNavigate();


    const [assessments, setAssessments] =
        useState<Assessment[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [search, setSearch] =
        useState<string>("");


    /*
     * CURRENT PAGE
     */
    const [currentPage, setCurrentPage] =
        useState<number>(1);


    /*
     * LOAD ASSESSMENTS
     */
    const loadAssessments = async () => {

        try {

            setLoading(true);

            const data =
                await assessmentApi.getAllAssessments();


            setAssessments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Assessment loading failed",
                error
            );


            setAssessments([]);


            toast.error(
                "Failed to load assessments"
            );

        } finally {

            setLoading(false);

        }
    };


    /*
     * INITIAL LOAD
     */
    useEffect(() => {

        loadAssessments();

    }, []);


    /*
     * SEARCH + SORT
     */
    const filteredAssessments =
        useMemo(() => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            const filtered =
                assessments.filter(
                    (assessment) => {

                        const searchableText =
                            `
${assessment.code ?? ""}
${assessment.entityName ?? ""}
${assessment.templateName ?? ""}
${assessment.reviewerName ?? ""}
${assessment.status ?? ""}
`
                                .toLowerCase();


                        return searchableText.includes(
                            searchText
                        );
                    }
                );


            /*
             * NEWEST FIRST
             *
             * Higher database ID = newer assessment.
             */
            return [...filtered].sort(
                (a, b) =>
                    Number(b.id) -
                    Number(a.id)
            );

        }, [
            assessments,
            search
        ]);


    /*
     * TOTAL PAGES
     */
    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredAssessments.length /
                ITEMS_PER_PAGE
            )
        );


    /*
     * RESET TO PAGE 1
     * WHEN SEARCH CHANGES
     */
    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    /*
     * MAKE SURE CURRENT PAGE
     * IS STILL VALID AFTER DELETE
     */
    useEffect(() => {

        if (currentPage > totalPages) {

            setCurrentPage(
                totalPages
            );
        }

    }, [
        currentPage,
        totalPages
    ]);


    /*
     * PAGINATED DATA
     */
    const paginatedAssessments =
        useMemo(() => {

            const startIndex =
                (currentPage - 1) *
                ITEMS_PER_PAGE;


            const endIndex =
                startIndex +
                ITEMS_PER_PAGE;


            return filteredAssessments.slice(
                startIndex,
                endIndex
            );

        }, [
            filteredAssessments,
            currentPage
        ]);


    /*
     * DELETE
     */
    const deleteAssessment = async (
        id: number
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this assessment?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await assessmentApi.deleteAssessment(
                id
            );


            toast.success(
                "Assessment deleted successfully"
            );


            await loadAssessments();

        } catch (error) {

            console.error(
                "Delete assessment failed",
                error
            );


            toast.error(
                "Failed to delete assessment"
            );
        }
    };


    /*
     * PAGE RANGE
     */
    const startItem =
        filteredAssessments.length === 0
            ? 0
            : (currentPage - 1) *
                  ITEMS_PER_PAGE +
              1;


    const endItem =
        Math.min(
            currentPage *
                ITEMS_PER_PAGE,
            filteredAssessments.length
        );


    return (

        <div className="space-y-6">

            {/* PAGE HEADER */}

            <PageHeader

                title="Assessments"

                description="Manage third party security assessments"

                actions={

                    <Button
                        onClick={() =>
                            navigate(
                                "/assessments/new"
                            )
                        }
                    >

                        <Plus
                            className="mr-2 h-4 w-4"
                        />

                        New Assessment

                    </Button>

                }

            />


            {/* SEARCH + LIST */}

            <Card>

                <CardContent className="p-6">

                    {/* SEARCH */}

                    <div className="mb-6">

                        <div className="relative">

                            <Search
                                className="
                                    absolute
                                    left-3
                                    top-3
                                    h-4
                                    w-4
                                    text-muted-foreground
                                "
                            />

                            <Input

                                className="pl-9"

                                placeholder="Search assessments..."

                                value={search}

                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }

                            />

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="py-10 text-center">

                            <p className="text-sm text-muted-foreground">

                                Loading assessments...

                            </p>

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        filteredAssessments.length === 0 && (

                            <div className="py-10 text-center">

                                <p className="font-medium">

                                    No assessments found

                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">

                                    Create a new assessment
                                    to get started.

                                </p>

                            </div>

                        )}


                    {/* ASSESSMENTS */}

                    {!loading &&
                        paginatedAssessments.length > 0 && (

                            <div className="space-y-4">

                                {paginatedAssessments.map(
                                    (assessment) => (

                                        <div
                                            key={
                                                assessment.id
                                            }
                                            className="
                                                rounded-lg
                                                border
                                                p-5
                                                transition
                                                hover:bg-muted/30
                                            "
                                        >

                                            {/* TOP */}

                                            <div className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            ">

                                                <div>

                                                    {/* GENERATED CODE */}

                                                    <h3 className="
                                                        text-lg
                                                        font-semibold
                                                    ">

                                                        {
                                                            assessment.code
                                                        }

                                                    </h3>


                                                    {/* ENTITY */}

                                                    <p className="
                                                        mt-1
                                                        text-sm
                                                        text-muted-foreground
                                                    ">

                                                        {
                                                            assessment.entityName ||
                                                            "-"
                                                        }

                                                    </p>

                                                </div>


                                                {/* STATUS */}

                                                <Badge>

                                                    {
                                                        assessment.status ||
                                                        "PENDING"
                                                    }

                                                </Badge>

                                            </div>


                                            {/* DETAILS */}

                                            <div className="
                                                mt-5
                                                grid
                                                gap-5
                                                md:grid-cols-4
                                            ">

                                                {/* TEMPLATE */}

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-muted-foreground
                                                    ">

                                                        Template

                                                    </p>

                                                    <p className="mt-1 font-medium">

                                                        {
                                                            assessment.templateName ||
                                                            "-"
                                                        }

                                                    </p>

                                                </div>


                                                {/* REVIEWER */}

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-muted-foreground
                                                    ">

                                                        Reviewer

                                                    </p>

                                                    <p className="mt-1 font-medium">

                                                        {
                                                            assessment.reviewerName ||
                                                            "-"
                                                        }

                                                    </p>

                                                </div>


                                                {/* PROGRESS */}

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-muted-foreground
                                                    ">

                                                        Progress

                                                    </p>

                                                    <p className="mt-1 font-medium">

                                                        {
                                                            assessment.progress ??
                                                            0
                                                        }%

                                                    </p>

                                                </div>


                                                {/* DUE DATE */}

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-muted-foreground
                                                    ">

                                                        Due Date

                                                    </p>

                                                    <p className="mt-1 font-medium">

                                                        {
                                                            assessment.dueDate ||
                                                            "-"
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="
                                                mt-5
                                                flex
                                                gap-3
                                            ">

                                                {/* VIEW */}

                                                <Button
                                                    onClick={() =>
                                                        navigate(
                                                            `/assessments/${assessment.id}`
                                                        )
                                                    }
                                                >

                                                    <Eye
                                                        className="
                                                            mr-2
                                                            h-4
                                                            w-4
                                                        "
                                                    />

                                                    View

                                                </Button>


                                                {/* DELETE */}

                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        deleteAssessment(
                                                            assessment.id
                                                        )
                                                    }
                                                >

                                                    <Trash2
                                                        className="
                                                            mr-2
                                                            h-4
                                                            w-4
                                                        "
                                                    />

                                                    Delete

                                                </Button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                    {/* PAGINATION */}

                    {!loading &&
                        filteredAssessments.length > 0 && (

                            <div className="
                                mt-6
                                flex
                                flex-col
                                gap-4
                                border-t
                                pt-5
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            ">

                                {/* COUNT */}

                                <p className="
                                    text-sm
                                    text-muted-foreground
                                ">

                                    Showing{" "}
                                    <span className="font-medium text-foreground">
                                        {startItem}
                                    </span>
                                    {" - "}
                                    <span className="font-medium text-foreground">
                                        {endItem}
                                    </span>
                                    {" of "}
                                    <span className="font-medium text-foreground">
                                        {filteredAssessments.length}
                                    </span>
                                    {" assessments"}

                                </p>


                                {/* PAGINATION BUTTONS */}

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

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


                                    <div className="
                                        min-w-[90px]
                                        text-center
                                        text-sm
                                        font-medium
                                    ">

                                        Page{" "}
                                        {currentPage}
                                        {" of "}
                                        {totalPages}

                                    </div>


                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            currentPage >=
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

                            </div>

                        )}

                </CardContent>

            </Card>

        </div>

    );
}

