import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Save,
    Send,
    Lock,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Clock3,
    ChevronDown,
    ChevronUp,
    FileText,
    ShieldCheck
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { toast } from "@/store/toast";

import { vendorApi } from "@/api/vendorApi";



interface Question {
    questionId: number;
    sectionId?: number;
    sectionName?: string;

    questionText: string;
    questionType: string;

    mandatory?: boolean;
    weight?: number;

    answer?: string;

    reviewerDecision?: string;
    reviewerComment?: string;

    options?: string[];
    choices?: string[];
}



type Answers = Record<number, string>;



export function VendorQuestionnairePage() {

    const { id, token } = useParams();

    const navigate = useNavigate();



    const routeAssessmentId =
        id ? Number(id) : null;



    const [assessmentId, setAssessmentId] =
        useState<number | null>(
            routeAssessmentId
        );



    const [questions, setQuestions] =
        useState<Question[]>([]);



    const [answers, setAnswers] =
        useState<Answers>({});



    const [loading, setLoading] =
        useState(true);



    const [saving, setSaving] =
        useState(false);



    const [submitting, setSubmitting] =
        useState(false);



    const [locked, setLocked] =
        useState(false);



    const [assessmentStatus, setAssessmentStatus] =
        useState<string>("DRAFT");



    const [reviewerComment, setReviewerComment] =
        useState("");



    const [correctionRequired, setCorrectionRequired] =
        useState(false);



    const [confirmSubmit, setConfirmSubmit] =
        useState(false);



    const [expandedSections, setExpandedSections] =
        useState<Record<string, boolean>>({});



    const [activeQuestion, setActiveQuestion] =
        useState<number | null>(null);





    /*
     * LOAD QUESTIONNAIRE
     */
    useEffect(() => {

        const loadQuestions = async () => {

            try {

                let data: any;



                if (token) {

                    data =
                        await vendorApi
                            .getVendorQuestionnaireByToken(
                                token
                            );

                } else if (
                    assessmentId &&
                    !Number.isNaN(assessmentId)
                ) {

                    data =
                        await vendorApi
                            .getVendorQuestionnaire(
                                assessmentId
                            );

                } else {

                    toast.error(
                        "Invalid assessment"
                    );

                    navigate(
                        "/vendor/assessments"
                    );

                    return;
                }



                const questionnaire: Question[] =
                    Array.isArray(data)
                        ? data
                        : (
                            data.questions ??
                            data.data?.questions ??
                            []
                        );



                const returnedAssessmentId =
                    data.assessmentId ??
                    data.data?.assessmentId;



                if (
                    token &&
                    returnedAssessmentId
                ) {

                    setAssessmentId(
                        Number(returnedAssessmentId)
                    );

                }



                const status =
                    data.status ??
                    data.data?.status ??
                    "DRAFT";



                const comment =
                    data.reviewerComment ??
                    data.data?.reviewerComment ??
                    "";



                setAssessmentStatus(
                    status
                );



                setReviewerComment(
                    comment
                );



                /*
                 * Status handling
                 */
                const lockedStatuses = [
                    "SUBMITTED",
                    "UNDER_REVIEW",
                    "APPROVED",
                    "REJECTED",
                    "COMPLETED"
                ];



                if (
                    lockedStatuses.includes(
                        status
                    )
                ) {

                    setLocked(
                        true
                    );

                }



                if (
                    status === "CORRECTION_REQUIRED" ||
                    status === "NEEDS_CORRECTION"
                ) {

                    setCorrectionRequired(
                        true
                    );

                    setLocked(
                        false
                    );

                }



                /*
                 * Existing answers
                 */
                const existingAnswers: Answers = {};



                questionnaire.forEach(
                    (question) => {

                        if (
                            question.answer !== undefined &&
                            question.answer !== null
                        ) {

                            existingAnswers[
                                question.questionId
                                ] =
                                String(
                                    question.answer
                                );

                        }

                    }
                );



                setQuestions(
                    questionnaire
                );



                setAnswers(
                    existingAnswers
                );



                /*
                 * Expand all sections initially
                 */
                const sections: Record<
                    string,
                    boolean
                > = {};



                questionnaire.forEach(
                    (question) => {

                        const key =
                            String(
                                question.sectionId ??
                                question.sectionName ??
                                "default"
                            );

                        sections[key] = true;

                    }
                );



                setExpandedSections(
                    sections
                );



            } catch (error) {

                console.error(
                    "Questionnaire loading failed",
                    error
                );

                toast.error(
                    "Unable to load questionnaire"
                );

            } finally {

                setLoading(false);

            }

        };



        loadQuestions();

    }, [
        assessmentId,
        token,
        navigate
    ]);





    /*
     * UPDATE ANSWER
     */
    const updateAnswer = (
        questionId: number,
        value: string
    ) => {

        if (locked) {
            return;
        }



        setAnswers(
            (previous) => ({
                ...previous,
                [questionId]: value
            })
        );

    };





    /*
     * QUESTION ANSWERED COUNT
     */
    const answeredCount =
        useMemo(() => {

            return questions.filter(
                (question) => {

                    const answer =
                        answers[
                            question.questionId
                            ];



                    return (
                        answer !== undefined &&
                        answer !== null &&
                        String(answer).trim() !== ""
                    );

                }
            ).length;

        }, [
            questions,
            answers
        ]);





    /*
     * REQUIRED QUESTIONS
     */
    const requiredQuestions =
        useMemo(() => {

            return questions.filter(
                (question) =>
                    question.mandatory
            );

        }, [
            questions
        ]);





    const unansweredRequired =
        useMemo(() => {

            return requiredQuestions.filter(
                (question) => {

                    const answer =
                        answers[
                            question.questionId
                            ];



                    return (
                        answer === undefined ||
                        answer === null ||
                        String(answer).trim() === ""
                    );

                }
            );

        }, [
            requiredQuestions,
            answers
        ]);





    /*
     * PROGRESS
     */
    const progress =
        questions.length === 0
            ? 0
            : Math.round(
                (
                    answeredCount /
                    questions.length
                ) *
                100
            );





    /*
     * GROUP QUESTIONS BY SECTION
     */
    const groupedQuestions =
        useMemo(() => {

            const groups: Record<
                string,
                Question[]
            > = {};



            questions.forEach(
                (question) => {

                    const sectionKey =
                        question.sectionName ??
                        (
                            question.sectionId
                                ? `Section ${question.sectionId}`
                                : "Assessment Questions"
                        );



                    if (!groups[sectionKey]) {

                        groups[sectionKey] = [];

                    }



                    groups[sectionKey].push(
                        question
                    );

                }
            );



            return groups;

        }, [
            questions
        ]);





    /*
     * TOGGLE SECTION
     */
    const toggleSection = (
        section: string
    ) => {

        setExpandedSections(
            (previous) => ({
                ...previous,
                [section]:
                    !previous[section]
            })
        );

    };





    /*
     * SAVE DRAFT
     */
    const saveDraft = async () => {

        if (assessmentId == null) {

            toast.error(
                "Assessment ID is missing"
            );

            return;

        }



        try {

            setSaving(true);



            for (
                const [
                    questionId,
                    answer
                ]
                of Object.entries(answers)
                ) {

                await vendorApi.saveAnswer(
                    assessmentId,
                    Number(questionId),
                    answer
                );

            }



            toast.success(
                "Draft saved successfully"
            );

        } catch (error) {

            console.error(
                "Draft save failed",
                error
            );

            toast.error(
                "Unable to save draft"
            );

        } finally {

            setSaving(false);

        }

    };





    /*
     * VALIDATE BEFORE SUBMIT
     */
    const validateBeforeSubmit = () => {

        if (
            unansweredRequired.length > 0
        ) {

            const firstMissing =
                unansweredRequired[0];



            const index =
                questions.findIndex(
                    (question) =>
                        question.questionId ===
                        firstMissing.questionId
                );



            setActiveQuestion(
                index
            );



            toast.error(
                `Please answer all required questions. Question ${index + 1} is incomplete.`
            );



            return false;

        }



        return true;

    };





    /*
     * SUBMIT
     */
    const submitAssessment = async () => {

        if (
            assessmentId == null
        ) {

            toast.error(
                "Assessment cannot be submitted from this link."
            );

            return;

        }



        if (
            !validateBeforeSubmit()
        ) {

            setConfirmSubmit(
                false
            );

            return;

        }



        try {

            setSubmitting(
                true
            );



            /*
             * Save all answers
             */
            for (
                const [
                    questionId,
                    answer
                ]
                of Object.entries(answers)
                ) {

                await vendorApi.saveAnswer(
                    assessmentId,
                    Number(questionId),
                    answer
                );

            }



            /*
             * Submit assessment
             */
            await vendorApi.submitAssessment(
                assessmentId
            );



            toast.success(
                "Assessment submitted successfully"
            );



            setLocked(
                true
            );



            setAssessmentStatus(
                "SUBMITTED"
            );



            setConfirmSubmit(
                false
            );



        } catch (error) {

            console.error(
                "Assessment submission failed",
                error
            );

            toast.error(
                "Assessment submission failed"
            );

        } finally {

            setSubmitting(
                false
            );

        }

    };





    /*
     * STATUS STYLE
     */
    const getStatusConfig = (
        status: string
    ) => {

        switch (
            status?.toUpperCase()
            ) {

            case "APPROVED":

                return {
                    label: "Approved",
                    className:
                        "bg-green-100 text-green-700 border-green-300",
                    icon: CheckCircle2
                };



            case "REJECTED":

                return {
                    label: "Rejected",
                    className:
                        "bg-red-100 text-red-700 border-red-300",
                    icon: AlertCircle
                };



            case "CORRECTION_REQUIRED":

            case "NEEDS_CORRECTION":

                return {
                    label: "Correction Required",
                    className:
                        "bg-red-100 text-red-700 border-red-300",
                    icon: AlertCircle
                };



            case "UNDER_REVIEW":

                return {
                    label: "Under Review",
                    className:
                        "bg-yellow-100 text-yellow-700 border-yellow-300",
                    icon: Clock3
                };



            case "SUBMITTED":

                return {
                    label: "Submitted",
                    className:
                        "bg-yellow-100 text-yellow-700 border-yellow-300",
                    icon: Clock3
                };



            case "COMPLETED":

                return {
                    label: "Completed",
                    className:
                        "bg-green-100 text-green-700 border-green-300",
                    icon: CheckCircle2
                };



            default:

                return {
                    label: "Draft",
                    className:
                        "bg-gray-100 text-gray-700 border-gray-300",
                    icon: FileText
                };

        }

    };





    const statusConfig =
        getStatusConfig(
            assessmentStatus
        );



    const StatusIcon =
        statusConfig.icon;





    /*
     * QUESTION RENDERER
     */
    const renderQuestionInput = (
        question: Question
    ) => {

        const value =
            answers[
                question.questionId
                ] ?? "";



        const disabled =
            locked;



        const options =
            question.options ??
            question.choices ??
            [];



        switch (
            question.questionType
                ?.toUpperCase()
            ) {

            case "YESNO":

                return (

                    <div className="flex gap-3">

                        <Button
                            type="button"
                            variant={
                                value === "YES"
                                    ? "default"
                                    : "outline"
                            }
                            disabled={disabled}
                            onClick={() =>
                                updateAnswer(
                                    question.questionId,
                                    "YES"
                                )
                            }
                        >
                            Yes
                        </Button>



                        <Button
                            type="button"
                            variant={
                                value === "NO"
                                    ? "destructive"
                                    : "outline"
                            }
                            disabled={disabled}
                            onClick={() =>
                                updateAnswer(
                                    question.questionId,
                                    "NO"
                                )
                            }
                        >
                            No
                        </Button>

                    </div>

                );



            case "DROPDOWN":

                return (

                    <select
                        value={value}
                        disabled={disabled}
                        onChange={(event) =>
                            updateAnswer(
                                question.questionId,
                                event.target.value
                            )
                        }
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >

                        <option value="">
                            Select an answer
                        </option>

                        {options.map(
                            (
                                option,
                                index
                            ) => (

                                <option
                                    key={index}
                                    value={option}
                                >
                                    {option}
                                </option>

                            )
                        )}

                    </select>

                );



            case "CHECKBOX":

                return (

                    <div className="space-y-2">

                        {options.map(
                            (
                                option,
                                index
                            ) => {

                                const selected =
                                    value
                                        .split(",")
                                        .map(
                                            (item) =>
                                                item.trim()
                                        )
                                        .includes(
                                            option
                                        );



                                return (

                                    <label
                                        key={index}
                                        className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-muted"
                                    >

                                        <input
                                            type="checkbox"
                                            disabled={disabled}
                                            checked={selected}
                                            onChange={(
                                                event
                                            ) => {

                                                const current =
                                                    value
                                                        ? value
                                                            .split(",")
                                                            .map(
                                                                (item) =>
                                                                    item.trim()
                                                            )
                                                            .filter(
                                                                Boolean
                                                            )
                                                        : [];



                                                const updated =
                                                    event.target.checked

                                                        ? [
                                                            ...current,
                                                            option
                                                        ]

                                                        : current.filter(
                                                            (item) =>
                                                                item !==
                                                                option
                                                        );



                                                updateAnswer(
                                                    question.questionId,
                                                    updated.join(
                                                        ", "
                                                    )
                                                );

                                            }}
                                        />

                                        <span className="text-sm">
                                            {option}
                                        </span>

                                    </label>

                                );

                            }
                        )}

                    </div>

                );



            case "NUMBER":

                return (

                    <Input
                        type="number"
                        value={value}
                        disabled={disabled}
                        placeholder="Enter a number"
                        onChange={(event) =>
                            updateAnswer(
                                question.questionId,
                                event.target.value
                            )
                        }
                    />

                );



            case "DATE":

                return (

                    <Input
                        type="date"
                        value={value}
                        disabled={disabled}
                        onChange={(event) =>
                            updateAnswer(
                                question.questionId,
                                event.target.value
                            )
                        }
                    />

                );



            case "PARAGRAPH":

            case "TEXTAREA":

                return (

                    <Textarea
                        value={value}
                        disabled={disabled}
                        placeholder="Enter your answer..."
                        rows={5}
                        onChange={(event) =>
                            updateAnswer(
                                question.questionId,
                                event.target.value
                            )
                        }
                    />

                );



            default:

                return (

                    <Input
                        value={value}
                        disabled={disabled}
                        placeholder="Enter your answer..."
                        onChange={(event) =>
                            updateAnswer(
                                question.questionId,
                                event.target.value
                            )
                        }
                    />

                );

        }

    };





    if (loading) {

        return (

            <div className="flex min-h-[400px] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

                    <p className="text-sm text-muted-foreground">
                        Loading assessment questionnaire...
                    </p>

                </div>

            </div>

        );

    }





    return (

        <div className="space-y-6">

            {/* BACK */}

            <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                    navigate(
                        "/vendor/assessments"
                    )
                }
            >

                <ArrowLeft className="mr-2 h-4 w-4" />

                Back to Assessments

            </Button>





            {/* HEADER */}

            <PageHeader

                title="Security Assessment Questionnaire"

                description={
                    correctionRequired
                        ? "Please update the requested responses and resubmit."
                        : "Complete the assessment questionnaire carefully before submitting."
                }

                actions={

                    <div className="flex flex-wrap gap-2">

                        <Badge
                            className={
                                statusConfig.className
                            }
                        >

                            <StatusIcon
                                className="mr-1 h-3.5 w-3.5"
                            />

                            {statusConfig.label}

                        </Badge>



                        {!locked && (

                            <Button
                                variant="outline"
                                disabled={saving}
                                onClick={saveDraft}
                            >

                                <Save className="mr-2 h-4 w-4" />

                                {saving
                                    ? "Saving..."
                                    : "Save Draft"}

                            </Button>

                        )}



                        {!locked && (

                            <Button
                                disabled={submitting}
                                onClick={() =>
                                    setConfirmSubmit(
                                        true
                                    )
                                }
                            >

                                <Send className="mr-2 h-4 w-4" />

                                {submitting
                                    ? "Submitting..."
                                    : "Submit Assessment"}

                            </Button>

                        )}

                    </div>

                }

            />





            {/* CORRECTION MESSAGE */}

            {correctionRequired && (

                <Card className="border-red-300 bg-red-50">

                    <CardContent className="p-5">

                        <div className="flex gap-3">

                            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

                            <div>

                                <h3 className="font-semibold text-red-700">
                                    Correction Required
                                </h3>

                                <p className="mt-1 text-sm text-red-600">
                                    {reviewerComment ||
                                        "The reviewer has requested changes to this assessment."}
                                </p>

                                <p className="mt-2 text-xs text-red-500">
                                    Please review the highlighted questions and resubmit.
                                </p>

                            </div>

                        </div>

                    </CardContent>

                </Card>

            )}







            {/* LOCKED */}

            {locked && (

                <Card className="border-green-200 bg-green-50">

                    <CardContent className="flex items-center gap-3 p-4">

                        <Lock className="h-5 w-5 text-green-600" />

                        <div>

                            <p className="font-medium text-green-700">
                                Assessment is locked
                            </p>

                            <p className="text-sm text-green-600">
                                This assessment has already been submitted and cannot be edited.
                            </p>

                        </div>

                    </CardContent>

                </Card>

            )}







            {/* PROGRESS */}

            <div className="grid gap-4 md:grid-cols-4">

                <Card>

                    <CardContent className="p-5">

                        <div className="flex items-center gap-3">

                            <div className="rounded-lg bg-primary/10 p-2">

                                <FileText className="h-5 w-5 text-primary" />

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Total Questions
                                </p>

                                <p className="text-2xl font-bold">
                                    {questions.length}
                                </p>

                            </div>

                        </div>

                    </CardContent>

                </Card>





                <Card>

                    <CardContent className="p-5">

                        <div className="flex items-center gap-3">

                            <div className="rounded-lg bg-green-100 p-2">

                                <CheckCircle2 className="h-5 w-5 text-green-600" />

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Answered
                                </p>

                                <p className="text-2xl font-bold text-green-600">
                                    {answeredCount}
                                </p>

                            </div>

                        </div>

                    </CardContent>

                </Card>





                <Card>

                    <CardContent className="p-5">

                        <div className="flex items-center gap-3">

                            <div className="rounded-lg bg-red-100 p-2">

                                <AlertCircle className="h-5 w-5 text-red-600" />

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Required Remaining
                                </p>

                                <p className="text-2xl font-bold text-red-600">
                                    {unansweredRequired.length}
                                </p>

                            </div>

                        </div>

                    </CardContent>

                </Card>





                <Card>

                    <CardContent className="p-5">

                        <div className="flex items-center gap-3">

                            <div className="rounded-lg bg-blue-100 p-2">

                                <ShieldCheck className="h-5 w-5 text-blue-600" />

                            </div>

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Completion
                                </p>

                                <p className="text-2xl font-bold">
                                    {progress}%
                                </p>

                            </div>

                        </div>

                    </CardContent>

                </Card>

            </div>







            {/* MAIN PROGRESS */}

            <Card>

                <CardContent className="p-5">

                    <div className="mb-2 flex items-center justify-between">

                        <div>

                            <p className="font-medium">
                                Assessment Progress
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {answeredCount} of {questions.length} questions answered
                            </p>

                        </div>

                        <span className="text-sm font-semibold">
                            {progress}%
                        </span>

                    </div>

                    <Progress
                        value={progress}
                        className="h-2"
                    />

                </CardContent>

            </Card>







            {/* QUESTIONS */}

            <div className="space-y-5">

                {Object.entries(
                    groupedQuestions
                ).map(
                    (
                        [
                            section,
                            sectionQuestions
                        ]
                    ) => {

                        const expanded =
                            expandedSections[
                                section
                                ] ?? true;



                        const sectionAnswered =
                            sectionQuestions.filter(
                                (question) => {

                                    const answer =
                                        answers[
                                            question.questionId
                                            ];

                                    return (
                                        answer !== undefined &&
                                        String(answer).trim() !== ""
                                    );

                                }
                            ).length;



                        return (

                            <Card
                                key={section}
                                className="overflow-hidden"
                            >

                                {/* SECTION HEADER */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleSection(
                                            section
                                        )
                                    }
                                    className="flex w-full items-center justify-between border-b bg-muted/30 px-5 py-4 text-left hover:bg-muted/50"
                                >

                                    <div>

                                        <p className="font-semibold">
                                            {section}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {sectionAnswered} / {sectionQuestions.length} answered
                                        </p>

                                    </div>



                                    {expanded
                                        ? (
                                            <ChevronUp className="h-5 w-5" />
                                        )
                                        : (
                                            <ChevronDown className="h-5 w-5" />
                                        )}

                                </button>





                                {expanded && (

                                    <CardContent className="space-y-8 p-6">

                                        {sectionQuestions.map(
                                            (
                                                question,
                                                sectionIndex
                                            ) => {

                                                const globalIndex =
                                                    questions.findIndex(
                                                        (item) =>
                                                            item.questionId ===
                                                            question.questionId
                                                    );



                                                const answer =
                                                    answers[
                                                        question.questionId
                                                        ] ?? "";



                                                const isAnswered =
                                                    answer.trim() !== "";



                                                const needsCorrection =
                                                    question.reviewerDecision ===
                                                    "CORRECTION" ||
                                                    question.reviewerDecision ===
                                                    "REJECTED";



                                                return (

                                                    <div
                                                        key={
                                                            question.questionId
                                                        }
                                                        id={`question-${question.questionId}`}
                                                        className={`
                                                            rounded-xl border p-5
                                                            transition
                                                            ${
                                                            needsCorrection
                                                                ? "border-red-300 bg-red-50/70"
                                                                : isAnswered
                                                                    ? "border-green-200 bg-green-50/30"
                                                                    : "border-border"
                                                        }
                                                        `}
                                                    >

                                                        <div className="mb-4 flex items-start gap-3">

                                                            <div
                                                                className={`
                                                                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold
                                                                    ${
                                                                    needsCorrection
                                                                        ? "bg-red-100 text-red-700"
                                                                        : isAnswered
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-muted text-muted-foreground"
                                                                }
                                                                `}
                                                            >

                                                                {globalIndex + 1}

                                                            </div>



                                                            <div className="flex-1">

                                                                <div className="flex flex-wrap items-center gap-2">

                                                                    <Label className="text-base font-semibold">

                                                                        {question.questionText}

                                                                    </Label>



                                                                    {question.mandatory && (

                                                                        <span className="text-red-500">
                                                                            *
                                                                        </span>

                                                                    )}



                                                                    {isAnswered && (

                                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                                            Answered
                                                                        </Badge>

                                                                    )}



                                                                    {needsCorrection && (

                                                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                                                            Correction Required
                                                                        </Badge>

                                                                    )}

                                                                </div>



                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    {question.questionType}
                                                                    {question.weight
                                                                        ? ` • Weight ${question.weight}`
                                                                        : ""}
                                                                </p>

                                                            </div>

                                                        </div>





                                                        {/* REVIEWER COMMENT */}

                                                        {needsCorrection &&
                                                            question.reviewerComment && (

                                                                <div className="mb-4 rounded-lg border border-red-300 bg-white p-4">

                                                                    <p className="text-sm font-semibold text-red-700">
                                                                        Reviewer Comment
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-red-600">
                                                                        {question.reviewerComment}
                                                                    </p>

                                                                </div>

                                                            )}





                                                        {/* INPUT */}

                                                        <div className="ml-11">

                                                            {renderQuestionInput(
                                                                question
                                                            )}

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </CardContent>

                                )}

                            </Card>

                        );

                    }
                )}

            </div>







            {/* BOTTOM ACTIONS */}

            {!locked && (

                <Card className="sticky bottom-4 z-20 shadow-lg">

                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="font-medium">
                                Ready to submit?
                            </p>

                            <p className="text-sm text-muted-foreground">

                                {unansweredRequired.length > 0

                                    ? `${unansweredRequired.length} required question(s) remaining`

                                    : "All required questions are completed"}

                            </p>

                        </div>



                        <div className="flex gap-2">

                            <Button
                                variant="outline"
                                disabled={saving}
                                onClick={saveDraft}
                            >

                                <Save className="mr-2 h-4 w-4" />

                                Save Draft

                            </Button>



                            <Button
                                disabled={
                                    submitting ||
                                    unansweredRequired.length > 0
                                }
                                onClick={() =>
                                    setConfirmSubmit(
                                        true
                                    )
                                }
                            >

                                <Send className="mr-2 h-4 w-4" />

                                Submit Assessment

                            </Button>

                        </div>

                    </CardContent>

                </Card>

            )}







            {/* SUBMIT CONFIRMATION */}

            {confirmSubmit && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <Card className="w-full max-w-md">

                        <CardHeader>

                            <CardTitle>
                                Submit Assessment?
                            </CardTitle>

                        </CardHeader>



                        <CardContent className="space-y-5">

                            <p className="text-sm text-muted-foreground">

                                Once submitted, the assessment will be sent to the reviewer for evaluation.

                                You will not be able to edit the answers unless the reviewer requests corrections.

                            </p>



                            <div className="rounded-lg bg-muted p-4">

                                <div className="flex justify-between text-sm">

                                    <span>
                                        Questions
                                    </span>

                                    <span className="font-medium">
                                        {questions.length}
                                    </span>

                                </div>



                                <div className="mt-2 flex justify-between text-sm">

                                    <span>
                                        Answered
                                    </span>

                                    <span className="font-medium text-green-600">
                                        {answeredCount}
                                    </span>

                                </div>



                                <div className="mt-2 flex justify-between text-sm">

                                    <span>
                                        Required remaining
                                    </span>

                                    <span className="font-medium text-red-600">
                                        {unansweredRequired.length}
                                    </span>

                                </div>

                            </div>



                            <div className="flex justify-end gap-2">

                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setConfirmSubmit(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </Button>



                                <Button
                                    disabled={
                                        submitting ||
                                        unansweredRequired.length > 0
                                    }
                                    onClick={
                                        submitAssessment
                                    }
                                >

                                    <Send className="mr-2 h-4 w-4" />

                                    {submitting
                                        ? "Submitting..."
                                        : "Confirm Submit"}

                                </Button>

                            </div>

                        </CardContent>

                    </Card>

                </div>

            )}

        </div>

    );

}