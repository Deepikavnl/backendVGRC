import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import {
    Check,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    FileText,
    ShieldAlert,
    History,
    ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";

import { EmptyState } from "@/components/ui/empty-state";

import {
    RiskBadge,
    StatusBadge,
} from "@/components/common/status-badge";

import { cn } from "@/lib/utils";
import { toast } from "@/store/toast";

import { reviewerApi } from "@/features/reviewer/reviewerApi";
import * as findingApi from "@/features/findings/findingApi";

// =========================================================
// TYPES
// =========================================================

type Decision =
    | "approved"
    | "flagged"
    | "correction"
    | null;

type FindingStatus =
    | "OPEN"
    | "IN_REMEDIATION"
    | "REMEDIATION_SUBMITTED"
    | "RESOLVED"
    | "ACCEPTED_RISK";

type SaveDecisionType =
    | "APPROVED"
    | "CORRECTION";

// =========================================================
// CONSTANTS
// =========================================================

const QUESTIONS_PER_PAGE = 10;
const FINDINGS_PER_PAGE = 5;

// =========================================================
// COMPONENT
// =========================================================

export function ReviewWorkspacePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // =========================================================
    // ASSESSMENT STATE
    // =========================================================

    const [assessment, setAssessment] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    // =========================================================
    // QUESTION STATE
    // =========================================================

    const [questionPage, setQuestionPage] =
        useState(1);

    const [idx, setIdx] =
        useState(0);

    const [decisions, setDecisions] =
        useState<Record<string, Decision>>({});

    const [comments, setComments] =
        useState<Record<string, string>>({});

    const [comment, setComment] =
        useState("");

    // =========================================================
    // FINDING STATE
    // =========================================================

    const [findings, setFindings] =
        useState<any[]>([]);

    const [findingsLoading, setFindingsLoading] =
        useState(false);

    const [findingPage, setFindingPage] =
        useState(1);

    const [findingSortOrder, setFindingSortOrder] =
        useState<"newest" | "oldest">("newest");

    // =========================================================
    // EVIDENCE STATE
    // =========================================================

    const [findingEvidence, setFindingEvidence] =
        useState<Record<number, any[]>>({});

    const [evidenceLoading, setEvidenceLoading] =
        useState<Record<number, boolean>>({});

    // =========================================================
    // FINDING UPDATE STATE
    // =========================================================

    const [findingUpdating, setFindingUpdating] =
        useState<Record<number, boolean>>({});

    // =========================================================
    // LOAD REVIEW WORKSPACE
    // =========================================================

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const loadWorkspace = async () => {
            try {
                setLoading(true);

                const assessmentId = Number(id);

                if (Number.isNaN(assessmentId)) {
                    toast.error("Invalid assessment ID");
                    return;
                }

                const data =
                    await reviewerApi.getWorkspace(
                        assessmentId
                    );

                console.log(
                    "Reviewer Workspace:",
                    data
                );

                setAssessment(data);

                // -------------------------------------------------
                // LOAD FINDINGS
                // -------------------------------------------------

                await loadAssessmentFindings(
                    assessmentId
                );

                // -------------------------------------------------
                // LOAD EXISTING DECISIONS
                // -------------------------------------------------

                const loadedDecisions:
                    Record<string, Decision> = {};

                const loadedComments:
                    Record<string, string> = {};

                if (Array.isArray(data?.answers)) {
                    data.answers.forEach(
                        (answer: any) => {
                            const questionId =
                                String(answer.questionId);

                            if (answer.reviewerDecision) {
                                const normalizedDecision =
                                    String(
                                        answer.reviewerDecision
                                    ).toLowerCase();

                                if (
                                    normalizedDecision ===
                                    "approved"
                                ) {
                                    loadedDecisions[
                                        questionId
                                        ] = "approved";
                                } else if (
                                    normalizedDecision ===
                                    "correction"
                                ) {
                                    loadedDecisions[
                                        questionId
                                        ] = "correction";
                                } else if (
                                    normalizedDecision ===
                                    "flagged"
                                ) {
                                    loadedDecisions[
                                        questionId
                                        ] = "flagged";
                                }
                            }

                            if (answer.reviewerComment) {
                                loadedComments[
                                    questionId
                                    ] = answer.reviewerComment;
                            }
                        }
                    );
                }

                setDecisions(
                    loadedDecisions
                );

                setComments(
                    loadedComments
                );

                // -------------------------------------------------
                // RESET QUESTION POSITION
                // -------------------------------------------------

                setQuestionPage(1);
                setIdx(0);

                // -------------------------------------------------
                // LOAD FIRST COMMENT
                // -------------------------------------------------

                const firstAnswer =
                    data?.answers?.[0];

                if (firstAnswer) {
                    setComment(
                        loadedComments[
                            String(
                                firstAnswer.questionId
                            )
                            ] || ""
                    );
                } else {
                    setComment("");
                }
            } catch (error) {
                console.error(
                    "Failed to load reviewer workspace",
                    error
                );

                setAssessment(null);

                toast.error(
                    "Failed to load reviewer workspace"
                );
            } finally {
                setLoading(false);
            }
        };

        loadWorkspace();
    }, [id]);

    // =========================================================
    // LOAD ASSESSMENT FINDINGS
    // =========================================================

    const loadAssessmentFindings =
        async (
            assessmentId: number
        ) => {
            try {
                setFindingsLoading(true);

                const findingData =
                    await reviewerApi.getAssessmentFindings(
                        assessmentId
                    );

                console.log(
                    "Assessment Findings:",
                    findingData
                );

                const normalizedFindings =
                    Array.isArray(findingData)
                        ? findingData
                        : [];

                setFindings(
                    normalizedFindings
                );

                setFindingPage(1);
            } catch (error) {
                console.error(
                    "Failed to load assessment findings",
                    error
                );

                setFindings([]);
            } finally {
                setFindingsLoading(false);
            }
        };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div
                className="
          flex
          min-h-[70vh]
          items-center
          justify-center
        "
            >
                <p
                    className="
            text-sm
            text-muted-foreground
          "
                >
                    Loading reviewer workspace...
                </p>
            </div>
        );
    }

    // =========================================================
    // ASSESSMENT NOT FOUND
    // =========================================================

    if (!assessment) {
        return (
            <EmptyState
                icon={FileText}
                title="Assessment not found"
            />
        );
    }

    // =========================================================
    // ANSWERS
    // =========================================================

    const answers =
        Array.isArray(
            assessment.answers
        )
            ? assessment.answers
            : [];

    if (!answers.length) {
        return (
            <EmptyState
                icon={FileText}
                title="No responses to review"
            />
        );
    }

    // =========================================================
    // KEEP INDEX VALID
    // =========================================================

    const safeIdx =
        Math.min(
            Math.max(idx, 0),
            answers.length - 1
        );

    const current =
        answers[safeIdx];

    // =========================================================
    // QUESTION PAGINATION
    // =========================================================

    const totalQuestionPages =
        Math.max(
            1,
            Math.ceil(
                answers.length /
                QUESTIONS_PER_PAGE
            )
        );

    const safeQuestionPage =
        Math.min(
            Math.max(questionPage, 1),
            totalQuestionPages
        );

    const questionStartIndex =
        (safeQuestionPage - 1) *
        QUESTIONS_PER_PAGE;

    const paginatedAnswers =
        answers.slice(
            questionStartIndex,
            questionStartIndex +
            QUESTIONS_PER_PAGE
        );

    // =========================================================
    // CURRENT QUESTION PAGE
    // =========================================================

    const currentQuestionPage =
        Math.floor(
            safeIdx /
            QUESTIONS_PER_PAGE
        ) + 1;

    // =========================================================
    // REVIEWED COUNT
    // =========================================================

    const reviewed =
        answers.filter(
            (answer: any) => {
                const decision =
                    decisions[
                        String(
                            answer.questionId
                        )
                        ];

                return (
                    decision === "approved" ||
                    decision === "correction" ||
                    decision === "flagged"
                );
            }
        ).length;

    // =========================================================
    // FINDING SORTING
    // =========================================================

    const sortedFindings =
        [...findings].sort(
            (a: any, b: any) => {
                const dateA = a?.createdAt
                    ? new Date(
                        a.createdAt
                    ).getTime()
                    : 0;

                const dateB = b?.createdAt
                    ? new Date(
                        b.createdAt
                    ).getTime()
                    : 0;

                if (
                    findingSortOrder ===
                    "newest"
                ) {
                    if (dateB !== dateA) {
                        return dateB - dateA;
                    }

                    return (
                        Number(b?.id ?? 0) -
                        Number(a?.id ?? 0)
                    );
                }

                if (dateA !== dateB) {
                    return dateA - dateB;
                }

                return (
                    Number(a?.id ?? 0) -
                    Number(b?.id ?? 0)
                );
            }
        );

    // =========================================================
    // FINDING PAGINATION
    // =========================================================

    const totalFindingPages =
        Math.max(
            1,
            Math.ceil(
                sortedFindings.length /
                FINDINGS_PER_PAGE
            )
        );

    const safeFindingPage =
        Math.min(
            Math.max(findingPage, 1),
            totalFindingPages
        );

    const findingStartIndex =
        (safeFindingPage - 1) *
        FINDINGS_PER_PAGE;

    const paginatedFindings =
        sortedFindings.slice(
            findingStartIndex,
            findingStartIndex +
            FINDINGS_PER_PAGE
        );

    // =========================================================
    // CHANGE QUESTION
    // =========================================================

    const goToQuestion =
        (newIndex: number) => {
            if (
                newIndex < 0 ||
                newIndex >= answers.length
            ) {
                return;
            }

            setIdx(newIndex);

            const newPage =
                Math.floor(
                    newIndex /
                    QUESTIONS_PER_PAGE
                ) + 1;

            setQuestionPage(newPage);

            const selectedAnswer =
                answers[newIndex];

            if (selectedAnswer) {
                setComment(
                    comments[
                        String(
                            selectedAnswer.questionId
                        )
                        ] || ""
                );
            } else {
                setComment("");
            }
        };

    // =========================================================
    // CHANGE QUESTION PAGE
    // =========================================================

    const goToQuestionPage =
        (page: number) => {
            if (
                page < 1 ||
                page > totalQuestionPages
            ) {
                return;
            }

            setQuestionPage(page);

            const newIndex =
                (page - 1) *
                QUESTIONS_PER_PAGE;

            if (
                newIndex <
                answers.length
            ) {
                setIdx(newIndex);

                const selectedAnswer =
                    answers[newIndex];

                setComment(
                    comments[
                        String(
                            selectedAnswer.questionId
                        )
                        ] || ""
                );
            }
        };

    // =========================================================
    // SAVE QUESTION REVIEW DECISION
    // =========================================================

    const saveDecision =
        async (
            decision: SaveDecisionType
        ) => {
            if (!current) {
                toast.error(
                    "No question selected"
                );
                return;
            }

            try {
                await reviewerApi.saveDecision({
                    assessmentId:
                        Number(
                            assessment.id
                        ),

                    questionId:
                        Number(
                            current.questionId
                        ),

                    decision,

                    comment:
                        comment.trim(),
                });

                const normalizedDecision:
                    Decision =
                    decision === "APPROVED"
                        ? "approved"
                        : "correction";

                const questionKey =
                    String(
                        current.questionId
                    );

                setDecisions(
                    (prev) => ({
                        ...prev,
                        [questionKey]:
                        normalizedDecision,
                    })
                );

                setComments(
                    (prev) => ({
                        ...prev,
                        [questionKey]:
                            comment.trim(),
                    })
                );

                toast.success(
                    decision === "APPROVED"
                        ? "Response approved"
                        : "Correction requested"
                );

                // -------------------------------------------------
                // Move to next question automatically
                // -------------------------------------------------

                if (
                    safeIdx <
                    answers.length - 1
                ) {
                    const nextIndex =
                        safeIdx + 1;

                    setIdx(nextIndex);

                    const nextPage =
                        Math.floor(
                            nextIndex /
                            QUESTIONS_PER_PAGE
                        ) + 1;

                    setQuestionPage(
                        nextPage
                    );

                    const nextAnswer =
                        answers[nextIndex];

                    setComment(
                        comments[
                            String(
                                nextAnswer.questionId
                            )
                            ] || ""
                    );
                } else {
                    setComment("");
                }
            } catch (error) {
                console.error(
                    "Failed to save reviewer decision",
                    error
                );

                toast.error(
                    "Failed to save reviewer decision"
                );
            }
        };

    // =========================================================
    // LOAD FINDING EVIDENCE
    // =========================================================

    const loadFindingEvidence =
        async (
            findingId: number
        ) => {
            if (!findingId) {
                return;
            }

            try {
                setEvidenceLoading(
                    (prev) => ({
                        ...prev,
                        [findingId]:
                            true,
                    })
                );

                const data =
                    await reviewerApi.getFindingEvidence(
                        findingId
                    );

                console.log(
                    "Finding Evidence:",
                    data
                );

                const evidence =
                    Array.isArray(data)
                        ? data
                        : [];

                setFindingEvidence(
                    (prev) => ({
                        ...prev,
                        [findingId]:
                        evidence,
                    })
                );
            } catch (error) {
                console.error(
                    "Failed to load finding evidence",
                    error
                );

                setFindingEvidence(
                    (prev) => ({
                        ...prev,
                        [findingId]: [],
                    })
                );

                toast.error(
                    "Failed to load submitted evidence"
                );
            } finally {
                setEvidenceLoading(
                    (prev) => ({
                        ...prev,
                        [findingId]:
                            false,
                    })
                );
            }
        };

    // =========================================================
    // UPDATE FINDING STATUS
    // =========================================================

    const updateFindingStatus =
        async (
            findingId: number,
            status:
                | "RESOLVED"
                | "IN_REMEDIATION"
                | "ACCEPTED_RISK"
        ) => {
            if (!findingId) {
                throw new Error(
                    "Invalid finding ID"
                );
            }

            try {
                setFindingUpdating(
                    (prev) => ({
                        ...prev,
                        [findingId]:
                            true,
                    })
                );

                const updated =
                    await reviewerApi.reviewFinding(
                        findingId,
                        status
                    );

                setFindings(
                    (prev) =>
                        prev.map(
                            (item) =>
                                Number(
                                    item.id
                                ) === findingId
                                    ? {
                                        ...item,
                                        ...(updated || {}),
                                        status,
                                    }
                                    : item
                        )
                );

                if (assessment?.id) {
                    await loadAssessmentFindings(
                        Number(
                            assessment.id
                        )
                    );
                }

                return updated;
            } catch (error) {
                console.error(
                    "Finding status update failed",
                    error
                );

                throw error;
            } finally {
                setFindingUpdating(
                    (prev) => ({
                        ...prev,
                        [findingId]:
                            false,
                    })
                );
            }
        };

    // =========================================================
    // APPROVE / VERIFY FINDING
    // =========================================================

    const handleApproveFinding =
        async (
            finding: any
        ) => {
            const findingId =
                Number(
                    finding?.id
                );

            if (!findingId) {
                toast.error(
                    "Invalid finding"
                );
                return;
            }

            try {
                let evidence =
                    findingEvidence[
                        findingId
                        ] || [];

                // -------------------------------------------------
                // Load evidence if not already loaded
                // -------------------------------------------------

                if (
                    evidence.length === 0
                ) {
                    const latestEvidence =
                        await reviewerApi.getFindingEvidence(
                            findingId
                        );

                    evidence =
                        Array.isArray(
                            latestEvidence
                        )
                            ? latestEvidence
                            : [];

                    setFindingEvidence(
                        (prev) => ({
                            ...prev,
                            [findingId]:
                            evidence,
                        })
                    );
                }

                // -------------------------------------------------
                // Evidence required
                // -------------------------------------------------

                if (
                    evidence.length === 0
                ) {
                    toast.error(
                        "Cannot approve finding without submitted evidence"
                    );
                    return;
                }

                // -------------------------------------------------
                // REMEDIATION_SUBMITTED
                //             ↓
                //          RESOLVED
                // -------------------------------------------------

                await updateFindingStatus(
                    findingId,
                    "RESOLVED"
                );

                toast.success(
                    "Finding verified and resolved"
                );
            } catch (error) {
                console.error(
                    "Failed to approve finding",
                    error
                );

                toast.error(
                    "Failed to approve finding"
                );
            }
        };

    // =========================================================
    // REJECT / SEND BACK FINDING
    // =========================================================

    const handleRejectFinding =
        async (
            finding: any
        ) => {
            const findingId =
                Number(
                    finding?.id
                );

            if (!findingId) {
                toast.error(
                    "Invalid finding"
                );
                return;
            }

            try {
                await updateFindingStatus(
                    findingId,
                    "IN_REMEDIATION"
                );

                toast.success(
                    "Finding sent back to Risk Team"
                );
            } catch (error) {
                console.error(
                    "Failed to reject finding",
                    error
                );

                toast.error(
                    "Failed to send finding back"
                );
            }
        };

    // =========================================================
    // SUBMIT REVIEW
    // =========================================================

    const submitReview =
        async () => {
            try {
                if (
                    reviewed <
                    answers.length
                ) {
                    toast.error(
                        "Please review all responses before submitting"
                    );
                    return;
                }

                await reviewerApi.submitReview(
                    Number(
                        assessment.id
                    )
                );

                toast.success(
                    "Review submitted successfully"
                );

                navigate(
                    "/reviewer"
                );
            } catch (error) {
                console.error(
                    "Submit review failed",
                    error
                );

                toast.error(
                    "Submit failed"
                );
            }
        };

    // =========================================================
    // OPEN EVIDENCE
    // =========================================================

    const openEvidence =
        (
            evidenceId: number
        ) => {
            if (!evidenceId) {
                toast.error(
                    "Invalid evidence"
                );
                return;
            }

            const url =
                reviewerApi.viewEvidence(
                    evidenceId
                );

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );
        };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div
            className="
        -m-4
        min-h-[calc(100vh-64px)]
        lg:-m-6
        xl:-m-8
      "
        >
            {/* =====================================================
          HEADER
      ===================================================== */}

            <div
                className="
          sticky
          top-0
          z-20
          flex
          items-center
          gap-3
          border-b
          bg-card
          px-4
          py-3
        "
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        navigate(
                            "/reviewer"
                        )
                    }
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <Avatar
                    name={
                        assessment.entityName ||
                        "Entity"
                    }
                    className="h-8 w-8"
                />

                <div className="min-w-0">
                    <p
                        className="
              truncate
              text-sm
              font-semibold
            "
                    >
                        {assessment.entityName ||
                            "Assessment"}
                    </p>

                    <p
                        className="
              truncate
              text-xs
              text-muted-foreground
            "
                    >
                        {assessment.code ||
                            `Assessment #${assessment.id}`}
                        {" · "}
                        {assessment.templateName ||
                            "Template"}
                    </p>
                </div>

                <RiskBadge
                    level={
                        assessment.riskLevel ||
                        "HIGH"
                    }
                />

                <div
                    className="
            ml-auto
            flex
            items-center
            gap-3
          "
                >
                    <div
                        className="
              hidden
              items-center
              gap-2
              sm:flex
            "
                    >
            <span
                className="
                text-xs
                text-muted-foreground
              "
            >
              Reviewed{" "}
                {reviewed}/
                {answers.length}
            </span>

                        <Progress
                            value={
                                answers.length > 0
                                    ? (reviewed /
                                        answers.length) *
                                    100
                                    : 0
                            }
                            className="w-24"
                        />
                    </div>

                    <Button
                        size="sm"
                        onClick={
                            submitReview
                        }
                        disabled={
                            reviewed <
                            answers.length
                        }
                    >
                        <Check className="mr-2 h-4 w-4" />
                        Submit Review
                    </Button>
                </div>
            </div>

            {/* =====================================================
          REVIEW WORKSPACE
      ===================================================== */}

            <div
                className="
          grid
          grid-cols-1
          lg:grid-cols-[260px_minmax(0,1fr)_320px]
        "
            >
                {/* ===================================================
            LEFT QUESTION LIST
        =================================================== */}

                <div
                    className="
            border-r
            bg-muted/20
          "
                >
                    <div
                        className="
              sticky
              top-[57px]
              max-h-[calc(100vh-57px)]
              overflow-y-auto
            "
                    >
                        <p
                            className="
                px-4
                pb-2
                pt-4
                text-xs
                font-semibold
                uppercase
                text-muted-foreground
              "
                        >
                            Questions
                        </p>

                        {paginatedAnswers.map(
                            (
                                ans: any,
                                localIndex: number
                            ) => {
                                const actualIndex =
                                    questionStartIndex +
                                    localIndex;

                                const decision =
                                    decisions[
                                        String(
                                            ans.questionId
                                        )
                                        ];

                                return (
                                    <button
                                        key={
                                            ans.questionId ??
                                            actualIndex
                                        }
                                        onClick={() =>
                                            goToQuestion(
                                                actualIndex
                                            )
                                        }
                                        className={cn(
                                            `
                        flex
                        w-full
                        items-start
                        gap-2
                        border-l-2
                        px-4
                        py-3
                        text-left
                        transition
                      `,
                                            safeIdx ===
                                            actualIndex
                                                ? `
                          border-primary
                          bg-card
                        `
                                                : `
                          border-transparent
                          hover:bg-card
                        `
                                        )}
                                    >
                    <span
                        className={cn(
                            `
                          mt-0.5
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          text-[10px]
                          font-bold
                        `,
                            decision ===
                            "approved"
                                ? "bg-success text-white"
                                : decision ===
                                "correction"
                                    ? "bg-destructive text-white"
                                    : decision ===
                                    "flagged"
                                        ? "bg-yellow-500 text-white"
                                        : "bg-muted text-muted-foreground"
                        )}
                    >
                      {decision ===
                      "approved" ? (
                          <Check className="h-3 w-3" />
                      ) : (
                          actualIndex + 1
                      )}
                    </span>

                                        <span
                                            className="
                        text-xs
                        leading-5
                      "
                                        >
                      {ans.questionText ||
                          "Question"}
                    </span>
                                    </button>
                                );
                            }
                        )}

                        {/* QUESTION PAGINATION */}

                        {totalQuestionPages >
                            1 && (
                                <div
                                    className="
                  border-t
                  p-3
                "
                                >
                                    <div
                                        className="
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                safeQuestionPage ===
                                                1
                                            }
                                            onClick={() =>
                                                goToQuestionPage(
                                                    safeQuestionPage -
                                                    1
                                                )
                                            }
                                        >
                                            <ChevronLeft className="mr-1 h-4 w-4" />
                                            Previous
                                        </Button>

                                        <span
                                            className="
                      text-xs
                      text-muted-foreground
                    "
                                        >
                    {safeQuestionPage}
                                            {" / "}
                                            {totalQuestionPages}
                  </span>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                safeQuestionPage ===
                                                totalQuestionPages
                                            }
                                            onClick={() =>
                                                goToQuestionPage(
                                                    safeQuestionPage +
                                                    1
                                                )
                                            }
                                        >
                                            Next
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* ===================================================
            CENTER QUESTION
        =================================================== */}

                <div
                    className="
            min-w-0
            bg-background
            p-6
            lg:p-8
          "
                >
                    <div
                        className="
              mx-auto
              w-full
              max-w-4xl
            "
                    >
                        <div
                            className="
                mb-6
                flex
                items-center
                justify-between
              "
                        >
                            <Badge variant="secondary">
                                Question{" "}
                                {safeIdx + 1}
                                {" of "}
                                {answers.length}
                            </Badge>

                            <div
                                className="
                  flex
                  gap-2
                "
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={
                                        safeIdx === 0
                                    }
                                    onClick={() =>
                                        goToQuestion(
                                            safeIdx - 1
                                        )
                                    }
                                >
                                    <ChevronLeft />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={
                                        safeIdx ===
                                        answers.length -
                                        1
                                    }
                                    onClick={() =>
                                        goToQuestion(
                                            safeIdx + 1
                                        )
                                    }
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>

                        <div
                            className="
                rounded-xl
                border
                bg-card
                p-6
                shadow-sm
              "
                        >
                            <h2
                                className="
                  text-xl
                  font-semibold
                  leading-8
                "
                            >
                                {current.questionText}
                            </h2>

                            <div className="mt-8">
                                <p
                                    className="
                    mb-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                                >
                                    Vendor Response
                                </p>

                                <div
                                    className="
                    min-h-[140px]
                    rounded-lg
                    border
                    bg-muted/20
                    p-5
                    text-sm
                    leading-6
                  "
                                >
                                    {current.answerValue ||
                                        "No response provided."}
                                </div>
                            </div>

                            {decisions[
                                    String(
                                        current.questionId
                                    )
                                    ] ===
                                "correction" && (
                                    <div
                                        className="
                    mt-6
                    rounded-lg
                    border
                    border-destructive/30
                    bg-destructive/5
                    p-4
                  "
                                    >
                                        <p
                                            className="
                      flex
                      items-center
                      gap-2
                      font-medium
                      text-destructive
                    "
                                        >
                                            <History className="h-4 w-4" />
                                            Correction Required
                                        </p>

                                        <div className="mt-3">
                                            <p
                                                className="
                        text-xs
                        uppercase
                        text-muted-foreground
                      "
                                            >
                                                Reviewer Comment
                                            </p>

                                            <p className="mt-1 text-sm">
                                                {comments[
                                                        String(
                                                            current.questionId
                                                        )
                                                        ] ||
                                                    "No reviewer comment."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* QUESTION PAGE INFO */}

                        {totalQuestionPages >
                            1 && (
                                <div
                                    className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  border
                  bg-card
                  px-4
                  py-3
                "
                                >
                <span
                    className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  Questions{" "}
                    {questionStartIndex +
                        1}
                    {" - "}
                    {Math.min(
                        questionStartIndex +
                        QUESTIONS_PER_PAGE,
                        answers.length
                    )}
                    {" of "}
                    {answers.length}
                </span>

                                    <div
                                        className="
                    flex
                    items-center
                    gap-2
                  "
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                currentQuestionPage ===
                                                1
                                            }
                                            onClick={() =>
                                                goToQuestionPage(
                                                    currentQuestionPage -
                                                    1
                                                )
                                            }
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        <span
                                            className="
                      min-w-16
                      text-center
                      text-xs
                    "
                                        >
                    Page{" "}
                                            {currentQuestionPage}
                                            {" / "}
                                            {totalQuestionPages}
                  </span>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                currentQuestionPage ===
                                                totalQuestionPages
                                            }
                                            onClick={() =>
                                                goToQuestionPage(
                                                    currentQuestionPage +
                                                    1
                                                )
                                            }
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* ===================================================
            RIGHT REVIEW PANEL
        =================================================== */}

                <div
                    className="
            border-l
            bg-muted/20
            p-5
          "
                >
                    <div
                        className="
              sticky
              top-[57px]
            "
                    >
                        <p
                            className="
                mb-3
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-muted-foreground
              "
                        >
                            Reviewer Decision
                        </p>

                        <Textarea
                            value={comment}
                            onChange={(e) =>
                                setComment(
                                    e.target.value
                                )
                            }
                            placeholder="Add comment for vendor..."
                            rows={6}
                        />

                        <div
                            className="
                mt-4
                space-y-2
              "
                        >
                            <Button
                                className="w-full"
                                onClick={() =>
                                    saveDecision(
                                        "APPROVED"
                                    )
                                }
                            >
                                <Check className="mr-2" />
                                Approve Response
                            </Button>

                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() =>
                                    saveDecision(
                                        "CORRECTION"
                                    )
                                }
                            >
                                <RotateCcw className="mr-2" />
                                Request Correction
                            </Button>
                        </div>

                        {/* DECISION STATUS */}

                        <div
                            className="
                mt-6
                rounded-lg
                border
                bg-card
                p-4
              "
                        >
                            <p
                                className="
                  text-xs
                  font-semibold
                  uppercase
                  text-muted-foreground
                "
                            >
                                Decision Status
                            </p>

                            <div
                                className="
                  mt-3
                  space-y-1
                "
                            >
                                <p className="text-sm">
                                    Approved:{" "}
                                    {
                                        Object.values(
                                            decisions
                                        ).filter(
                                            (d) =>
                                                d ===
                                                "approved"
                                        ).length
                                    }
                                </p>

                                <p className="text-sm">
                                    Correction:{" "}
                                    {
                                        Object.values(
                                            decisions
                                        ).filter(
                                            (d) =>
                                                d ===
                                                "correction"
                                        ).length
                                    }
                                </p>

                                <p className="text-sm">
                                    Flagged:{" "}
                                    {
                                        Object.values(
                                            decisions
                                        ).filter(
                                            (d) =>
                                                d ===
                                                "flagged"
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
          FINDINGS
      ===================================================== */}

            <div
                className="
          border-t
          bg-muted/10
          p-6
          lg:p-8
        "
            >
                <div
                    className="
            mx-auto
            w-full
            max-w-[1400px]
          "
                >
                    {/* FINDING HEADER */}

                    <div
                        className="
              mb-5
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
            "
                    >
                        <div
                            className="
                flex
                items-center
                gap-2
              "
                        >
                            <ShieldAlert
                                className="
                  h-5
                  w-5
                  text-destructive
                "
                            />

                            <div>
                                <p
                                    className="
                    font-semibold
                  "
                                >
                                    Assessment Findings
                                </p>

                                <p
                                    className="
                    text-xs
                    text-muted-foreground
                  "
                                >
                                    Findings requiring
                                    remediation and
                                    reviewer verification.
                                </p>
                            </div>
                        </div>

                        <div
                            className="
                flex
                items-center
                gap-2
              "
                        >
                            <Select
                                value={
                                    findingSortOrder
                                }
                                onValueChange={
                                    (value) => {
                                        const newOrder =
                                            value as
                                                | "newest"
                                                | "oldest";

                                        setFindingSortOrder(
                                            newOrder
                                        );

                                        setFindingPage(1);
                                    }
                                }
                                options={[
                                    {
                                        label:
                                            "Newest First",
                                        value:
                                            "newest",
                                    },
                                    {
                                        label:
                                            "Oldest First",
                                        value:
                                            "oldest",
                                    },
                                ]}
                            />

                            <Badge variant="secondary">
                                {findings.length}
                                {" finding"}
                                {findings.length !==
                                1
                                    ? "s"
                                    : ""}
                            </Badge>
                        </div>
                    </div>

                    {/* FINDINGS LOADING */}

                    {findingsLoading ? (
                        <div
                            className="
                rounded-lg
                border
                bg-card
                p-8
                text-center
              "
                        >
                            <p
                                className="
                  text-sm
                  text-muted-foreground
                "
                            >
                                Loading findings...
                            </p>
                        </div>
                    ) : findings.length ===
                    0 ? (
                        <div
                            className="
                rounded-lg
                border
                border-dashed
                bg-card
                p-10
                text-center
              "
                        >
                            <ShieldAlert
                                className="
                  mx-auto
                  h-8
                  w-8
                  text-muted-foreground
                "
                            />

                            <p
                                className="
                  mt-3
                  text-sm
                  font-medium
                "
                            >
                                No findings created
                            </p>

                            <p
                                className="
                  mt-1
                  text-xs
                  text-muted-foreground
                "
                            >
                                Findings associated
                                with this assessment
                                will appear here.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* PAGINATED FINDINGS */}

                            <div
                                className="
                  space-y-5
                "
                            >
                                {paginatedFindings.map(
                                    (
                                        finding: any
                                    ) => {
                                        const findingId =
                                            Number(
                                                finding.id
                                            );

                                        const evidence =
                                            findingEvidence[
                                                findingId
                                                ] || [];

                                        const status:
                                            FindingStatus =
                                            String(
                                                finding.status ||
                                                "OPEN"
                                            ).toUpperCase() as
                                                FindingStatus;

                                        const isSubmitted =
                                            status ===
                                            "REMEDIATION_SUBMITTED";

                                        const isResolved =
                                            status ===
                                            "RESOLVED";

                                        const isAcceptedRisk =
                                            status ===
                                            "ACCEPTED_RISK";

                                        const updating =
                                            findingUpdating[
                                                findingId
                                                ] || false;

                                        return (
                                            <div
                                                key={
                                                    finding.id
                                                }
                                                className="
                          rounded-xl
                          border
                          bg-card
                          p-5
                          shadow-sm
                        "
                                            >
                                                {/* FINDING HEADER */}

                                                <div
                                                    className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                                                >
                                                    <div
                                                        className="
                              min-w-0
                            "
                                                    >
                                                        <p
                                                            className="
                                text-sm
                                font-semibold
                              "
                                                        >
                                                            {finding.code ||
                                                                `FIND-${finding.id}`}
                                                        </p>

                                                        <p
                                                            className="
                                mt-1
                                text-base
                                font-medium
                              "
                                                        >
                                                            {finding.title ||
                                                                "Risk Finding"}
                                                        </p>

                                                        {finding.createdAt && (
                                                            <p
                                                                className="
                                  mt-1
                                  text-xs
                                  text-muted-foreground
                                "
                                                            >
                                                                Created{" "}
                                                                {new Date(
                                                                    finding.createdAt
                                                                ).toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <RiskBadge
                                                        level={
                                                            finding.severity ||
                                                            "HIGH"
                                                        }
                                                    />
                                                </div>

                                                {/* STATUS */}

                                                <div
                                                    className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                                                >
                                                    <StatusBadge
                                                        status={
                                                            finding.status ||
                                                            "OPEN"
                                                        }
                                                    />

                                                    {isSubmitted && (
                                                        <Badge variant="secondary">
                                                            Awaiting Verification
                                                        </Badge>
                                                    )}

                                                    {isResolved && (
                                                        <Badge variant="secondary">
                                                            Verified & Resolved
                                                        </Badge>
                                                    )}

                                                    {isAcceptedRisk && (
                                                        <Badge variant="secondary">
                                                            Risk Accepted
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* OWNER */}

                                                <p
                                                    className="
                            mt-3
                            text-xs
                            text-muted-foreground
                          "
                                                >
                                                    Owner:{" "}
                                                    {finding.owner ||
                                                        "Not assigned"}
                                                </p>

                                                {/* EVIDENCE BUTTON */}

                                                <div className="mt-5">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            loadFindingEvidence(
                                                                findingId
                                                            )
                                                        }
                                                        disabled={
                                                            !findingId ||
                                                            evidenceLoading[
                                                                findingId
                                                                ]
                                                        }
                                                    >
                                                        <FileText className="mr-2 h-4 w-4" />

                                                        {evidenceLoading[
                                                            findingId
                                                            ]
                                                            ? "Loading..."
                                                            : "View Submitted Evidence"}
                                                    </Button>
                                                </div>

                                                {/* EVIDENCE LIST */}

                                                {evidence.length >
                                                    0 && (
                                                        <div
                                                            className="
                              mt-4
                              rounded-lg
                              border
                              bg-muted/20
                              p-4
                            "
                                                        >
                                                            <div
                                                                className="
                                mb-3
                                flex
                                items-center
                                justify-between
                              "
                                                            >
                                                                <p
                                                                    className="
                                  text-sm
                                  font-semibold
                                "
                                                                >
                                                                    Submitted Evidence
                                                                </p>

                                                                <Badge variant="secondary">
                                                                    {evidence.length}
                                                                    {" file"}
                                                                    {evidence.length !==
                                                                    1
                                                                        ? "s"
                                                                        : ""}
                                                                </Badge>
                                                            </div>

                                                            <div
                                                                className="
                                space-y-2
                              "
                                                            >
                                                                {evidence.map(
                                                                    (
                                                                        item: any
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="
                                      flex
                                      items-center
                                      justify-between
                                      gap-3
                                      rounded-md
                                      border
                                      bg-card
                                      p-3
                                    "
                                                                        >
                                                                            <div
                                                                                className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-3
                                      "
                                                                            >
                                                                                <FileText
                                                                                    className="
                                          h-4
                                          w-4
                                          shrink-0
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
                                                                                        {item.fileName ||
                                                                                            item.filename ||
                                                                                            "Evidence file"}
                                                                                    </p>

                                                                                    <p
                                                                                        className="
                                            text-xs
                                            text-muted-foreground
                                          "
                                                                                    >
                                                                                        {item.fileType ||
                                                                                            "File"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() =>
                                                                                    openEvidence(
                                                                                        Number(
                                                                                            item.id
                                                                                        )
                                                                                    )
                                                                                }
                                                                            >
                                                                                View
                                                                            </Button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* NO EVIDENCE */}

                                                {!evidenceLoading[
                                                        findingId
                                                        ] &&
                                                    evidence.length ===
                                                    0 &&
                                                    isSubmitted && (
                                                        <div
                                                            className="
                                mt-3
                                rounded-md
                                border
                                border-dashed
                                p-3
                              "
                                                        >
                                                            <p
                                                                className="
                                  text-xs
                                  text-destructive
                                "
                                                            >
                                                                No submitted
                                                                evidence was
                                                                found. Reviewer
                                                                cannot approve
                                                                this finding.
                                                            </p>
                                                        </div>
                                                    )}

                                                {/* REVIEWER VERIFICATION */}

                                                {isSubmitted && (
                                                    <div
                                                        className="
                              mt-5
                              rounded-lg
                              border
                              border-primary/20
                              bg-primary/5
                              p-4
                            "
                                                    >
                                                        <div
                                                            className="
                                flex
                                items-start
                                gap-3
                              "
                                                        >
                                                            <ShieldAlert
                                                                className="
                                  mt-0.5
                                  h-5
                                  w-5
                                  shrink-0
                                  text-primary
                                "
                                                            />

                                                            <div>
                                                                <p
                                                                    className="
                                    font-semibold
                                  "
                                                                >
                                                                    Reviewer Verification
                                                                </p>

                                                                <p
                                                                    className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-muted-foreground
                                  "
                                                                >
                                                                    Review the
                                                                    remediation
                                                                    details and
                                                                    submitted
                                                                    evidence
                                                                    before
                                                                    deciding
                                                                    whether the
                                                                    finding has
                                                                    been
                                                                    successfully
                                                                    resolved.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="
                                mt-4
                                flex
                                flex-wrap
                                gap-3
                              "
                                                        >
                                                            {/* ACCEPT */}

                                                            <Button
                                                                disabled={
                                                                    updating
                                                                }
                                                                onClick={() =>
                                                                    handleApproveFinding(
                                                                        finding
                                                                    )
                                                                }
                                                            >
                                                                <Check className="mr-2 h-4 w-4" />

                                                                {updating
                                                                    ? "Processing..."
                                                                    : "Accept / Verify"}
                                                            </Button>

                                                            {/* REJECT */}

                                                            <Button
                                                                variant="destructive"
                                                                disabled={
                                                                    updating
                                                                }
                                                                onClick={() =>
                                                                    handleRejectFinding(
                                                                        finding
                                                                    )
                                                                }
                                                            >
                                                                <RotateCcw className="mr-2 h-4 w-4" />

                                                                {updating
                                                                    ? "Processing..."
                                                                    : "Reject / Send Back"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* RESOLVED */}

                                                {isResolved && (
                                                    <div
                                                        className="
                              mt-5
                              flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              border-green-200
                              bg-green-50
                              p-4
                            "
                                                    >
                                                        <Check
                                                            className="
                                h-5
                                w-5
                                text-green-600
                              "
                                                        />

                                                        <div>
                                                            <p
                                                                className="
                                  text-sm
                                  font-semibold
                                "
                                                            >
                                                                Finding Verified &
                                                                Resolved
                                                            </p>

                                                            <p
                                                                className="
                                  mt-1
                                  text-xs
                                  text-muted-foreground
                                "
                                                            >
                                                                The reviewer
                                                                accepted the
                                                                remediation and
                                                                supporting
                                                                evidence.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* ACCEPTED RISK */}

                                                {isAcceptedRisk && (
                                                    <div
                                                        className="
                              mt-5
                              rounded-lg
                              border
                              border-yellow-200
                              bg-yellow-50
                              p-4
                            "
                                                    >
                                                        <p
                                                            className="
                                text-sm
                                font-semibold
                              "
                                                        >
                                                            Risk Accepted
                                                        </p>

                                                        <p
                                                            className="
                                mt-1
                                text-xs
                                text-muted-foreground
                              "
                                                        >
                                                            This finding has
                                                            been formally
                                                            accepted as a
                                                            risk.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            {/* FINDING PAGINATION */}

                            {totalFindingPages >
                                1 && (
                                    <div
                                        className="
                    mt-6
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                    rounded-lg
                    border
                    bg-card
                    px-4
                    py-3
                  "
                                    >
                  <span
                      className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Showing{" "}
                      {findingStartIndex +
                          1}
                      {" - "}
                      {Math.min(
                          findingStartIndex +
                          FINDINGS_PER_PAGE,
                          sortedFindings.length
                      )}
                      {" of "}
                      {sortedFindings.length}
                      {" findings"}
                  </span>

                                        <div
                                            className="
                      flex
                      items-center
                      gap-2
                    "
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={
                                                    safeFindingPage ===
                                                    1
                                                }
                                                onClick={() =>
                                                    setFindingPage(
                                                        safeFindingPage -
                                                        1
                                                    )
                                                }
                                            >
                                                <ChevronLeft className="mr-1 h-4 w-4" />
                                                Previous
                                            </Button>

                                            <span
                                                className="
                        min-w-20
                        text-center
                        text-xs
                      "
                                            >
                      Page{" "}
                                                {safeFindingPage}
                                                {" / "}
                                                {totalFindingPages}
                    </span>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={
                                                    safeFindingPage ===
                                                    totalFindingPages
                                                }
                                                onClick={() =>
                                                    setFindingPage(
                                                        safeFindingPage +
                                                        1
                                                    )
                                                }
                                            >
                                                Next
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}