
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import assessmentApi, {
    Assessment,
} from "./assessment";

import {
    PageHeader,
} from "@/components/common/page-header";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Button,
} from "@/components/ui/button";

import {
    Badge,
} from "@/components/ui/badge";

import {
    Progress,
} from "@/components/ui/progress";

import {
    ArrowLeft,
    Trash2,
    Building2,
    FileText,
    User,
    CalendarDays,
    Copy,
} from "lucide-react";

import {
    toast,
} from "@/store/toast";

export function AssessmentDetailPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [assessment, setAssessment] =
        useState<Assessment | null>(null);

    const [loading, setLoading] =
        useState(true);

    /*
     * LOAD ASSESSMENT
     */
    const loadAssessment = async () => {

        try {

            if (!id) {
                return;
            }

            const data =
                await assessmentApi.getAssessmentById(
                    Number(id)
                );

            setAssessment(data);

        } catch (error) {

            console.error(
                "Assessment details failed",
                error
            );

            toast.error(
                "Failed to load assessment"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadAssessment();

    }, [id]);

    /*
     * DELETE ASSESSMENT
     */
    const deleteAssessment = async () => {

        if (!assessment) {
            return;
        }

        try {

            await assessmentApi.deleteAssessment(
                assessment.id
            );

            toast.success(
                "Assessment deleted successfully"
            );

            navigate("/assessments");

        } catch (error) {

            console.error(
                "Delete assessment failed",
                error
            );

            toast.error(
                "Delete failed"
            );

        }
    };

    /*
     * LOADING
     */
    if (loading) {

        return (
            <div className="flex items-center justify-center p-10">
                Loading assessment...
            </div>
        );

    }

    /*
     * NOT FOUND
     */
    if (!assessment) {

        return (
            <div className="space-y-4 p-6">

                <Button
                    variant="outline"
                    onClick={() =>
                        navigate("/assessments")
                    }
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <p className="text-muted-foreground">
                    Assessment not found.
                </p>

            </div>
        );

    }

    return (
        <div className="space-y-6">

            {/* ============================= */}
            {/* PAGE HEADER */}
            {/* ============================= */}

            <PageHeader
                title={assessment.code}
                description="Assessment Details"
                actions={
                    <div className="flex gap-2">

                        <Button
                            variant="outline"
                            onClick={() =>
                                navigate("/assessments")
                            }
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={deleteAssessment}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>

                    </div>
                }
            />

            {/* ============================= */}
            {/* SUMMARY CARDS */}
            {/* ============================= */}

            <div className="grid gap-5 md:grid-cols-3">

                {/* STATUS */}

                <Card>

                    <CardHeader>
                        <CardTitle>
                            Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <Badge>
                            {assessment.status}
                        </Badge>

                    </CardContent>

                </Card>

                {/* PROGRESS */}

                <Card>

                    <CardHeader>
                        <CardTitle>
                            Progress
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <p className="mb-3 text-3xl font-bold">
                            {assessment.progress}%
                        </p>

                        <Progress
                            value={
                                assessment.progress ?? 0
                            }
                        />

                    </CardContent>

                </Card>

                {/* RISK */}

                <Card>

                    <CardHeader>
                        <CardTitle>
                            Risk
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <Badge>
                            {assessment.riskLevel ?? "LOW"}
                        </Badge>

                    </CardContent>

                </Card>

            </div>

            {/* ============================= */}
            {/* INFORMATION */}
            {/* ============================= */}

            <Card>

                <CardHeader>

                    <CardTitle>
                        Assessment Information
                    </CardTitle>

                </CardHeader>

                <CardContent className="space-y-5">

                    {/* ASSESSMENT CODE */}

                    <div className="flex items-start gap-3">

                        <FileText className="mt-1 h-5 w-5 text-muted-foreground" />

                        <div>

                            <p className="text-sm text-muted-foreground">
                                Assessment Code
                            </p>

                            <p className="font-medium">
                                {assessment.code}
                            </p>

                        </div>

                    </div>

                    {/* ENTITY */}

                    <div className="flex items-start gap-3">

                        <Building2 className="mt-1 h-5 w-5 text-muted-foreground" />

                        <div>

                            <p className="text-sm text-muted-foreground">
                                Entity
                            </p>

                            <p className="font-medium">
                                {assessment.entityName || "-"}
                            </p>

                        </div>

                    </div>

                    {/* TEMPLATE */}

                    <div className="flex items-start gap-3">

                        <FileText className="mt-1 h-5 w-5 text-muted-foreground" />

                        <div>

                            <p className="text-sm text-muted-foreground">
                                Template
                            </p>

                            <p className="font-medium">
                                {assessment.templateName || "-"}
                            </p>

                        </div>

                    </div>

                    {/* REVIEWER */}

                    <div className="flex items-start gap-3">

                        <User className="mt-1 h-5 w-5 text-muted-foreground" />

                        <div>

                            <p className="text-sm text-muted-foreground">
                                Reviewer
                            </p>

                            <p className="font-medium">
                                {assessment.reviewerName || "-"}
                            </p>

                        </div>

                    </div>

                    {/* DUE DATE */}

                    <div className="flex items-start gap-3">

                        <CalendarDays className="mt-1 h-5 w-5 text-muted-foreground" />

                        <div>

                            <p className="text-sm text-muted-foreground">
                                Due Date
                            </p>

                            <p className="font-medium">
                                {assessment.dueDate || "-"}
                            </p>

                        </div>

                    </div>

                </CardContent>

            </Card>

            {/* ============================= */}
            {/* VENDOR ASSESSMENT LINK */}
            {/* ============================= */}

            {assessment.assessmentLink && (

                <Card>

                    <CardHeader>

                        <CardTitle>
                            Vendor Assessment Link
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="flex gap-2">

                            <input
                                readOnly
                                value={
                                    assessment.assessmentLink
                                }
                                className="flex-1 rounded-md border bg-muted/30 px-3 py-2 text-sm"
                            />

                            <Button
                                variant="outline"
                                onClick={async () => {

                                    try {

                                        await navigator.clipboard.writeText(
                                            assessment.assessmentLink ?? ""
                                        );

                                        toast.success(
                                            "Link copied"
                                        );

                                    } catch (error) {

                                        console.error(
                                            "Copy failed",
                                            error
                                        );

                                        toast.error(
                                            "Failed to copy link"
                                        );
                                    }

                                }}
                            >

                                <Copy className="mr-2 h-4 w-4" />

                                Copy

                            </Button>

                        </div>

                    </CardContent>

                </Card>

            )}

        </div>
    );
}

