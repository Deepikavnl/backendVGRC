
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
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";

import { EmptyState } from "@/components/ui/empty-state";

import {
  RiskBadge,
  StatusBadge,
} from "@/components/common/status-badge";

import { cn } from "@/lib/utils";
import { toast } from "@/store/toast";

import { reviewerApi } from "@/features/reviewer/reviewerApi";

import * as findingApi from "@/features/findings/findingApi";


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


export function ReviewWorkspacePage() {

  const { id } = useParams();

  const navigate = useNavigate();


  // =========================================================
  // STATE
  // =========================================================

  const [assessment, setAssessment] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [idx, setIdx] =
    useState(0);

  const [decisions, setDecisions] =
    useState<Record<string, Decision>>({});

  const [comments, setComments] =
    useState<Record<string, string>>({});

  const [comment, setComment] =
    useState("");

  const [findings, setFindings] =
    useState<any[]>([]);

  const [findingsLoading, setFindingsLoading] =
    useState(false);

  const [findingEvidence, setFindingEvidence] =
    useState<Record<number, any[]>>({});

  const [evidenceLoading, setEvidenceLoading] =
    useState<Record<number, boolean>>({});

  const [findingOpen, setFindingOpen] =
    useState(false);

  const [riskTeam, setRiskTeam] =
    useState("");

  const [findingCreating, setFindingCreating] =
    useState(false);

  const [findingUpdating, setFindingUpdating] =
    useState<Record<number, boolean>>({});


  // =========================================================
  // LOAD REVIEW WORKSPACE
  // =========================================================

  useEffect(() => {

    if (!id) return;


    const loadWorkspace = async () => {

      try {

        setLoading(true);


        const data =
          await reviewerApi.getWorkspace(
            Number(id)
          );


        console.log(
          "Reviewer Workspace:",
          data
        );


        setAssessment(data);


        await loadAssessmentFindings(
          Number(id)
        );


        const loadedDecisions:
          Record<string, Decision> = {};

        const loadedComments:
          Record<string, string> = {};


        data.answers?.forEach(
          (answer: any) => {

            if (answer.reviewerDecision) {

              loadedDecisions[
                String(answer.questionId)
              ] =
                answer.reviewerDecision
                  .toLowerCase();

            }


            if (answer.reviewerComment) {

              loadedComments[
                String(answer.questionId)
              ] =
                answer.reviewerComment;

            }

          }
        );


        setDecisions(
          loadedDecisions
        );

        setComments(
          loadedComments
        );

      }
      catch (error) {

        console.error(
          "Failed to load reviewer workspace",
          error
        );

        toast.error(
          "Failed to load reviewer workspace"
        );

      }
      finally {

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


        setFindings(
          findingData || []
        );

      }
      catch (error) {

        console.error(
          "Failed to load assessment findings",
          error
        );


        setFindings([]);

      }
      finally {

        setFindingsLoading(false);

      }

    };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <p className="text-sm text-muted-foreground">
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
    assessment.answers || [];


  if (!answers.length) {

    return (
      <EmptyState
        icon={FileText}
        title="No responses to review"
      />
    );

  }


  const current =
    answers[idx];


  const reviewed =
    Object.keys(decisions).length;


  // =========================================================
  // SAVE QUESTION REVIEW DECISION
  // =========================================================

  const saveDecision = async (
    decision: "APPROVED" | "CORRECTION"
  ) => {

    try {

      await reviewerApi.saveDecision({

        assessmentId:
          assessment.id,

        questionId:
          current.questionId,

        decision,

        comment,

      });


      setDecisions(prev => ({

        ...prev,

        [String(current.questionId)]:
          decision === "APPROVED"
            ? "approved"
            : "correction",

      }));


      setComments(prev => ({

        ...prev,

        [String(current.questionId)]:
          comment,

      }));


      setComment("");


      toast.success(
        decision === "APPROVED"
          ? "Response approved"
          : "Correction requested"
      );

    }
    catch (error) {

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

      try {

        setEvidenceLoading(prev => ({

          ...prev,

          [findingId]: true,

        }));


        const data =
          await reviewerApi.getFindingEvidence(
            findingId
          );


        console.log(
          "Finding Evidence:",
          data
        );


        setFindingEvidence(prev => ({

          ...prev,

          [findingId]:
            data || [],

        }));

      }
      catch (error) {

        console.error(
          "Failed to load finding evidence",
          error
        );


        setFindingEvidence(prev => ({

          ...prev,

          [findingId]: [],

        }));


        toast.error(
          "Failed to load submitted evidence"
        );

      }
      finally {

        setEvidenceLoading(prev => ({

          ...prev,

          [findingId]: false,

        }));

      }

    };


  // =========================================================
  // CREATE FINDING
  // =========================================================

  const handleCreateFinding = async () => {

    if (!riskTeam) {

      toast.error(
        "Please select a Risk Team"
      );

      return;

    }


    try {

      setFindingCreating(true);


      await findingApi.createFinding({

        assessmentId:
          Number(assessment.id),

        questionId:
          Number(current.questionId),

        title:
          current.questionText,

        description:
          `Finding identified during review for ${assessment.entityName}.`,

        severity:
          assessment.riskLevel || "HIGH",

        owner:
          riskTeam,

        recommendation:
          "Risk Team must investigate the finding, provide remediation evidence and submit it for verification.",

        topic:
          current.topic || "",

        dueDate:
          null,

      });


      toast.success(
        `Finding assigned to ${riskTeam}`
      );


      setFindingOpen(false);

      setRiskTeam("");


      await loadAssessmentFindings(
        Number(assessment.id)
      );

    }
    catch (error) {

      console.error(
        "Finding creation failed",
        error
      );


      toast.error(
        "Failed to create finding"
      );

    }
    finally {

      setFindingCreating(false);

    }

  };


  // =========================================================
  // UPDATE FINDING STATUS
  // =========================================================

  // =========================================================
// UPDATE FINDING STATUS
// =========================================================

  const updateFindingStatus = async (
      findingId: number,
      status:
          | "RESOLVED"
          | "IN_REMEDIATION"
          | "ACCEPTED_RISK"
  ) => {
    try {
      setFindingUpdating((prev) => ({
        ...prev,
        [findingId]: true,
      }));

      const updated = await reviewerApi.reviewFinding(
          findingId,
          status
      );

      // Update immediately in UI
      setFindings((prev) =>
          prev.map((item) =>
              Number(item.id) === findingId
                  ? {
                    ...item,
                    ...updated,
                    status,
                  }
                  : item
          )
      );

      // Reload from backend to make sure DB status is reflected
      if (assessment?.id) {
        await loadAssessmentFindings(
            Number(assessment.id)
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
      setFindingUpdating((prev) => ({
        ...prev,
        [findingId]: false,
      }));
    }
  };


// =========================================================
// ACCEPT / VERIFY FINDING
// =========================================================

  const handleApproveFinding = async (
      finding: any
  ) => {
    const findingId = Number(finding.id);

    try {
      /*
       * Finding must have submitted evidence
       * before reviewer can verify it.
       */
      let evidence =
          findingEvidence[findingId] || [];

      if (evidence.length === 0) {
        const latestEvidence =
            await reviewerApi.getFindingEvidence(
                findingId
            );

        evidence = latestEvidence || [];

        setFindingEvidence((prev) => ({
          ...prev,
          [findingId]: evidence,
        }));
      }

      if (evidence.length === 0) {
        toast.error(
            "Cannot approve finding without submitted evidence"
        );

        return;
      }

      /*
       * REMEDIATION_SUBMITTED
       *          ↓
       *       RESOLVED
       */
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




  // =========================================================
  // REJECT / SEND BACK FINDING
  // =========================================================

  const handleRejectFinding = async (
    finding: any
  ) => {

    const findingId =
      Number(finding.id);


    try {

      /*
       * REMEDIATION_SUBMITTED
       *      ↓
       * IN_REMEDIATION
       *
       * Risk Team must correct the issue
       * and submit evidence again.
       */
      await updateFindingStatus(
        findingId,
        "IN_REMEDIATION"
      );


      toast.success(
        "Finding sent back to Risk Team"
      );

    }
    catch (error) {

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

  const submitReview = async () => {

    try {

      /*
       * Prevent submitting if some answers
       * have not been reviewed.
       */
      if (
        Object.keys(decisions).length <
        answers.length
      ) {

        toast.error(
          "Please review all responses before submitting"
        );

        return;

      }


      await reviewerApi.submitReview(
        assessment.id
      );


      toast.success(
        "Review submitted successfully"
      );


      navigate("/reviewer");

    }
    catch (error) {

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
    (evidenceId: number) => {

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
            navigate("/reviewer")
          }
        >

          <ArrowLeft className="h-4 w-4" />

        </Button>


        <Avatar
          name={
            assessment.entityName
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

            {assessment.entityName}

          </p>


          <p
            className="
              truncate
              text-xs
              text-muted-foreground
            "
          >

            {assessment.code}

            {" · "}

            {assessment.templateName}

          </p>

        </div>


        <RiskBadge
          level={
            assessment.riskLevel
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

              Reviewed {reviewed}/{answers.length}

            </span>


            <Progress
              value={
                (reviewed /
                  answers.length) *
                100
              }
              className="w-24"
            />

          </div>


          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFindingOpen(true)
            }
          >

            <ShieldAlert
              className="mr-2 h-4 w-4"
            />

            Create Finding

          </Button>


          <Button
            size="sm"
            onClick={submitReview}
            disabled={
              reviewed < answers.length
            }
          >

            <Check
              className="mr-2 h-4 w-4"
            />

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


            {answers.map(
              (
                ans: any,
                index: number
              ) => {

                const decision =
                  decisions[
                    String(ans.questionId)
                  ];


                return (

                  <button
                    key={ans.questionId}
                    onClick={() =>
                      setIdx(index)
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

                      idx === index
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

                        decision === "approved"
                          ? "bg-success text-white"

                          : decision === "correction"
                            ? "bg-destructive text-white"

                            : "bg-muted text-muted-foreground"
                      )}
                    >

                      {decision === "approved"
                        ? (
                          <Check
                            className="h-3 w-3"
                          />
                        )
                        : index + 1}

                    </span>


                    <span
                      className="
                        text-xs
                        leading-5
                      "
                    >

                      {ans.questionText}

                    </span>

                  </button>

                );

              }
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

                Question {idx + 1} of {answers.length}

              </Badge>


              <div className="flex gap-2">

                <Button
                  variant="outline"
                  size="icon"
                  disabled={idx === 0}
                  onClick={() =>
                    setIdx(idx - 1)
                  }
                >

                  <ChevronLeft />

                </Button>


                <Button
                  variant="outline"
                  size="icon"
                  disabled={
                    idx === answers.length - 1
                  }
                  onClick={() =>
                    setIdx(idx + 1)
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
                String(current.questionId)
              ] === "correction" && (

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

                      {
                        comments[
                          String(
                            current.questionId
                          )
                        ]
                      }

                    </p>

                  </div>

                </div>

              )}

            </div>

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
                  saveDecision("APPROVED")
                }
              >

                <Check className="mr-2" />

                Approve Response

              </Button>


              <Button
                variant="destructive"
                className="w-full"
                onClick={() =>
                  saveDecision("CORRECTION")
                }
              >

                <RotateCcw className="mr-2" />

                Request Correction

              </Button>

            </div>


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


              <div className="mt-3 space-y-1">

                <p className="text-sm">

                  Approved:{" "}

                  {
                    Object.values(decisions)
                      .filter(
                        d =>
                          d === "approved"
                      )
                      .length
                  }

                </p>


                <p className="text-sm">

                  Correction:{" "}

                  {
                    Object.values(decisions)
                      .filter(
                        d =>
                          d === "correction"
                      )
                      .length
                  }

                </p>

              </div>

            </div>


            <div
              className="
                mt-6
                rounded-lg
                border
                bg-card
                p-4
              "
            >

              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                "
              >

                <Users className="h-4 w-4" />

                <p className="font-semibold">

                  Risk Team

                </p>

              </div>


              <p
                className="
                  mb-3
                  text-xs
                  leading-5
                  text-muted-foreground
                "
              >

                Create a finding when a vendor
                response identifies a risk that
                requires remediation.

              </p>


              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFindingOpen(true)
                }
              >

                <ShieldAlert
                  className="mr-2 h-4 w-4"
                />

                Assign Finding

              </Button>

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

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
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

                <p className="font-semibold">

                  Assessment Findings

                </p>


                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >

                  Findings requiring remediation
                  and reviewer verification.

                </p>

              </div>

            </div>


            <Badge variant="secondary">

              {findings.length} finding
              {findings.length !== 1
                ? "s"
                : ""}

            </Badge>

          </div>


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

          ) : findings.length === 0 ? (

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

                Findings created during this
                assessment will appear here.

              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {findings.map(
                (finding: any) => {

                  const evidence =
                    findingEvidence[
                      Number(finding.id)
                    ] || [];


                  const status:
                    FindingStatus =
                    finding.status;


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
                      Number(finding.id)
                    ] || false;


                  return (

                    <div
                      key={finding.id}
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

                        <div className="min-w-0">

                          <p
                            className="
                              text-sm
                              font-semibold
                            "
                          >

                            {finding.code}

                          </p>


                          <p
                            className="
                              mt-1
                              text-base
                              font-medium
                            "
                          >

                            {finding.title}

                          </p>

                        </div>


                        <RiskBadge
                          level={
                            finding.severity
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
                            finding.status
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


                      {/* EVIDENCE */}

                      <div className="mt-5">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            loadFindingEvidence(
                              Number(
                                finding.id
                              )
                            )
                          }
                        >

                          <FileText
                            className="
                              mr-2
                              h-4
                              w-4
                            "
                          />

                          {evidenceLoading[
                            Number(finding.id)
                          ]
                            ? "Loading..."
                            : "View Submitted Evidence"}

                        </Button>

                      </div>


                      {/* EVIDENCE LIST */}

                      {evidence.length > 0 && (

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

                              {evidence.length} file
                              {evidence.length !== 1
                                ? "s"
                                : ""}

                            </Badge>

                          </div>


                          <div className="space-y-2">

                            {evidence.map(
                              (item: any) => (

                                <div
                                  key={item.id}
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

                                        {
                                          item.fileName ||
                                          item.filename ||
                                          "Evidence file"
                                        }

                                      </p>


                                      <p
                                        className="
                                          text-xs
                                          text-muted-foreground
                                        "
                                      >

                                        {
                                          item.fileType ||
                                          "File"
                                        }

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
                        Number(finding.id)
                      ] &&
                        evidence.length === 0 &&
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

                              No submitted evidence
                              was found. Reviewer
                              cannot approve this
                              finding.

                            </p>

                          </div>

                        )}


                      {/* =================================================
                          REVIEWER FINDING VERIFICATION
                      ================================================= */}

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

                                Review the remediation
                                details and submitted
                                evidence before deciding
                                whether the finding has
                                been successfully resolved.

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

                              <Check
                                className="
                                  mr-2
                                  h-4
                                  w-4
                                "
                              />

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

                              <RotateCcw
                                className="
                                  mr-2
                                  h-4
                                  w-4
                                "
                              />

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

                              Finding Verified & Resolved

                            </p>


                            <p
                              className="
                                mt-1
                                text-xs
                                text-muted-foreground
                              "
                            >

                              The reviewer accepted
                              the remediation and
                              supporting evidence.

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

                            This finding has been
                            formally accepted as a risk.

                          </p>

                        </div>

                      )}

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          CREATE FINDING DIALOG
      ===================================================== */}

      <Dialog
        open={findingOpen}
        onOpenChange={
          setFindingOpen
        }
      >

        <DialogHeader>

          <DialogTitle>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <ShieldAlert
                className="h-5 w-5"
              />

              Create Risk Finding

            </div>

          </DialogTitle>

        </DialogHeader>


        <DialogBody>

          <div className="space-y-4">

            <div>

              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >

                Entity

              </p>


              <p className="font-medium">

                {assessment.entityName}

              </p>

            </div>


            <div>

              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >

                Question

              </p>


              <p className="text-sm">

                {current.questionText}

              </p>

            </div>


            <div>

              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >

                Vendor Response

              </p>


              <div
                className="
                  mt-1
                  rounded
                  border
                  bg-muted/30
                  p-3
                  text-sm
                "
              >

                {current.answerValue ||
                  "No response"}

              </div>

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >

                Assign Risk Team

              </label>


              <Select
                value={riskTeam}
                onValueChange={
                  setRiskTeam
                }
                placeholder="Select Risk Team"
                options={[
                  {
                    label:
                      "Risk & Compliance Team",
                    value:
                      "RISK_COMPLIANCE",
                  },
                  {
                    label:
                      "Operational Risk Team",
                    value:
                      "OPERATIONAL_RISK",
                  },
                  {
                    label:
                      "Information Security Risk",
                    value:
                      "INFORMATION_SECURITY_RISK",
                  },
                  {
                    label:
                      "Third Party Risk Team",
                    value:
                      "THIRD_PARTY_RISK",
                  },
                ]}
              />

            </div>


            <div
              className="
                rounded-lg
                border
                bg-muted/20
                p-3
              "
            >

              <p className="text-sm font-medium">

                What happens next?

              </p>


              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-muted-foreground
                "
              >

                The Risk Team will investigate
                the finding, perform remediation,
                upload supporting evidence and
                submit it for reviewer verification.

              </p>

            </div>

          </div>

        </DialogBody>


        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => {

              setFindingOpen(false);

              setRiskTeam("");

            }}
            disabled={
              findingCreating
            }
          >

            Cancel

          </Button>


          <Button
            onClick={
              handleCreateFinding
            }
            disabled={
              findingCreating ||
              !riskTeam
            }
          >

            <ShieldAlert
              className="
                mr-2
                h-4
                w-4
              "
            />

            {findingCreating
              ? "Creating..."
              : "Create & Assign"}

          </Button>

        </DialogFooter>

      </Dialog>

    </div>

  );

}

