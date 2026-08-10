
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Calendar,
  User,
  ShieldAlert,
  Upload,
  FileText,
  Save,
  Send,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { PageHeader } from "@/components/common/page-header";

import {
  RiskBadge,
  StatusBadge,
} from "@/components/common/status-badge";

import { formatDate } from "@/lib/utils";

import * as findingApi from "./findingApi";
import * as findingEvidenceApi from "./findingEvidenceApi";

import { toast } from "@/store/toast";

export function FindingDetailPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [finding, setFinding] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [remediation, setRemediation] =
    useState("");

  const [evidence, setEvidence] =
    useState<any[]>([]);

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  /*
   * LOAD FINDING + EVIDENCE
   */
  useEffect(() => {
    if (!id) {
      return;
    }

    const findingId = Number(id);

    const loadData = async () => {
      try {
        setLoading(true);

        /*
         * Load finding
         */
        const findingResponse =
          await findingApi.getFindingById(
            findingId
          );

        const data =
          findingResponse.data;

        setFinding(data);

        setRemediation(
          data.remediation || ""
        );

        /*
         * Load finding evidence
         */
        const evidenceResponse =
          await findingEvidenceApi
            .getEvidenceByFinding(
              findingId
            );

        setEvidence(
          evidenceResponse.data || []
        );
      } catch (error) {
        console.error(
          "Failed loading finding",
          error
        );

        toast.error(
          "Failed to load finding"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /*
   * START REMEDIATION
   */
  const handleStartRemediation =
    async () => {
      if (!id) {
        return;
      }

      try {
        const response =
          await findingApi
            .updateFindingStatus(
              Number(id),
              "IN_REMEDIATION"
            );

        setFinding(
          response.data
        );

        toast.success(
          "Finding moved to remediation"
        );
      } catch (error) {
        console.error(
          error
        );

        toast.error(
          "Failed to start remediation"
        );
      }
    };

  /*
   * SAVE REMEDIATION
   */
  const handleSaveRemediation =
    async () => {
      if (!id) {
        return;
      }

      if (!remediation.trim()) {
        toast.error(
          "Please enter remediation details"
        );

        return;
      }

      try {
        setSaving(true);

        const response =
          await findingApi
            .updateFindingRemediation(
              Number(id),
              remediation
            );

        setFinding(
          response.data
        );

        toast.success(
          "Remediation saved successfully"
        );
      } catch (error) {
        console.error(
          "Failed saving remediation",
          error
        );

        toast.error(
          "Failed to save remediation"
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * UPLOAD EVIDENCE
   */
  const handleEvidenceUpload =
    async (file: File) => {
      if (!id) {
        return;
      }

      try {
        setUploading(true);

        await findingEvidenceApi
          .uploadEvidence(
            Number(id),
            file
          );

        const response =
          await findingEvidenceApi
            .getEvidenceByFinding(
              Number(id)
            );

        setEvidence(
          response.data || []
        );

        toast.success(
          "Evidence uploaded successfully"
        );
      } catch (error) {
        console.error(
          "Evidence upload failed",
          error
        );

        toast.error(
          "Failed to upload evidence"
        );
      } finally {
        setUploading(false);
      }
    };

  /*
   * SUBMIT REMEDIATION FOR REVIEW
   */
  const handleSubmitForReview =
    async () => {
      if (!id) {
        return;
      }

      if (!remediation.trim()) {
        toast.error(
          "Add remediation details before submitting"
        );

        return;
      }

      if (evidence.length === 0) {
        toast.error(
          "Upload at least one evidence document"
        );

        return;
      }

      try {
        setSubmitting(true);

        /*
         * Save remediation first
         */
        await findingApi
          .updateFindingRemediation(
            Number(id),
            remediation
          );

        /*
         * Submit for reviewer verification
         */
        const response =
          await findingApi
            .updateFindingStatus(
              Number(id),
              "REMEDIATION_SUBMITTED"
            );

        setFinding(
          response.data
        );

        toast.success(
          "Finding submitted for reviewer verification"
        );
      } catch (error) {
        console.error(
          "Failed submitting finding",
          error
        );

        toast.error(
          "Failed to submit finding"
        );
      } finally {
        setSubmitting(false);
      }
    };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="p-6">
        Loading finding...
      </div>
    );
  }

  /*
   * FINDING NOT FOUND
   */
  if (!finding) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() =>
            navigate("/findings")
          }
        >
          <ArrowLeft
            className="mr-2 h-4 w-4"
          />

          Back
        </Button>

        <div className="mt-6">
          Finding not found.
        </div>
      </div>
    );
  }

  /*
   * STATUS FLAGS
   */
  const isOpen =
    finding.status === "OPEN";

  const isInRemediation =
    finding.status ===
    "IN_REMEDIATION";

  const isSubmitted =
    finding.status ===
    "REMEDIATION_SUBMITTED";

  const isResolved =
    finding.status === "RESOLVED";

  const isAcceptedRisk =
    finding.status ===
    "ACCEPTED_RISK";

  return (
    <>
      <PageHeader
        title={finding.title}
        description={finding.code}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              navigate("/findings")
            }
          >
            <ArrowLeft
              className="mr-2 h-4 w-4"
            />

            Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">

        {/* ============================= */}
        {/* FINDING INFORMATION */}
        {/* ============================= */}

        <Card className="space-y-4 p-6">

          <h2 className="text-lg font-semibold">
            Finding Information
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-xs text-muted-foreground">
                Finding Code
              </p>

              <p className="font-medium">
                {finding.code}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Entity
              </p>

              <p>
                {finding.entityName || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Topic
              </p>

              <p>
                {finding.topic || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Severity
              </p>

              <RiskBadge
                level={
                  finding.severity
                }
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Status
              </p>

              <StatusBadge
                status={
                  finding.status
                }
              />
            </div>

          </div>

        </Card>


        {/* ============================= */}
        {/* ASSIGNMENT */}
        {/* ============================= */}

        <Card className="space-y-5 p-6">

          <h2 className="text-lg font-semibold">
            Assignment
          </h2>

          <div className="flex items-center gap-3">

            <User
              className="
                h-5
                w-5
                text-muted-foreground
              "
            />

            <div>

              <p className="text-xs text-muted-foreground">
                Risk Team
              </p>

              <p>
                {finding.owner ||
                  "Not assigned"}
              </p>

            </div>

          </div>


          <div className="flex items-center gap-3">

            <Calendar
              className="
                h-5
                w-5
                text-muted-foreground
              "
            />

            <div>

              <p className="text-xs text-muted-foreground">
                Due Date
              </p>

              <p>
                {formatDate(
                  finding.dueDate
                )}
              </p>

            </div>

          </div>

        </Card>


        {/* ============================= */}
        {/* RECOMMENDATION */}
        {/* ============================= */}

        <Card className="p-6 lg:col-span-2">

          <h2 className="mb-4 text-lg font-semibold">
            Recommendation
          </h2>

          <p className="text-sm leading-6">
            {finding.recommendation ||
              "No recommendation available."}
          </p>

        </Card>


        {/* ============================= */}
        {/* DESCRIPTION */}
        {/* ============================= */}

        <Card className="p-6 lg:col-span-2">

          <h2 className="mb-4 text-lg font-semibold">
            Finding Description
          </h2>

          <p className="text-sm leading-6">
            {finding.description ||
              "No description available."}
          </p>

        </Card>


        {/* ============================= */}
        {/* RISK TEAM REMEDIATION */}
        {/* ============================= */}

        <Card className="p-6 lg:col-span-2">

          <div className="mb-5 flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                bg-primary/10
              "
            >
              <ShieldAlert
                className="
                  h-5
                  w-5
                  text-primary
                "
              />
            </div>

            <div>

              <h2 className="text-lg font-semibold">
                Risk Team Remediation
              </h2>

              <p className="text-sm text-muted-foreground">
                Correct the finding and provide
                evidence of remediation.
              </p>

            </div>

          </div>


          {/* ============================= */}
          {/* OPEN */}
          {/* ============================= */}

          {isOpen && (

            <div
              className="
                rounded-lg
                border
                bg-muted/30
                p-5
              "
            >

              <p className="text-sm">
                This finding has been assigned
                to the Risk Team. Start remediation
                when corrective action begins.
              </p>

              <Button
                className="mt-4"
                onClick={
                  handleStartRemediation
                }
              >
                <ShieldAlert
                  className="
                    mr-2
                    h-4
                    w-4
                  "
                />

                Start Remediation
              </Button>

            </div>

          )}


          {/* ============================= */}
          {/* IN REMEDIATION */}
          {/* ============================= */}

          {isInRemediation && (

            <div className="space-y-6">

              {/* REMEDIATION DETAILS */}

              <div>

                <Label>
                  Remediation Details
                </Label>

                <Textarea
                  className="mt-2"
                  rows={7}
                  value={remediation}
                  onChange={(e) =>
                    setRemediation(
                      e.target.value
                    )
                  }
                  placeholder="
                    Describe the corrective action
                    taken by the Risk Team...
                  "
                />

              </div>


              {/* EVIDENCE */}

              <div>

                <div className="flex items-center justify-between">

                  <div>

                    <Label>
                      Remediation Evidence
                    </Label>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Upload screenshots, policies,
                      reports, certificates, or other
                      supporting documents.
                    </p>

                  </div>


                  <Button
                    type="button"
                    disabled={
                      uploading
                    }
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >

                    <Upload
                      className="
                        mr-2
                        h-4
                        w-4
                      "
                    />

                    {uploading
                      ? "Uploading..."
                      : "Upload Evidence"}

                  </Button>


                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    className="hidden"
                    disabled={
                      uploading
                    }
                    onChange={(e) => {

                      const file =
                        e.target.files?.[0];

                      if (file) {
                        handleEvidenceUpload(
                          file
                        );
                      }

                      e.target.value =
                        "";

                    }}
                  />

                </div>


                {/* EVIDENCE LIST */}

                <div className="mt-4 space-y-3">

                  {evidence.length === 0 ? (

                    <div
                      className="
                        rounded-lg
                        border
                        border-dashed
                        p-6
                        text-center
                      "
                    >

                      <FileText
                        className="
                          mx-auto
                          h-8
                          w-8
                          text-muted-foreground
                        "
                      />

                      <p className="mt-2 text-sm font-medium">
                        No evidence uploaded
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Upload evidence before
                        submitting remediation.
                      </p>

                    </div>

                  ) : (

                    evidence.map(
                      (item) => (

                        <div
                          key={
                            item.id
                          }
                          className="
                            flex
                            items-center
                            justify-between
                            rounded-lg
                            border
                            p-4
                          "
                        >

                          <div className="flex items-center gap-3">

                            <FileText
                              className="
                                h-5
                                w-5
                                text-muted-foreground
                              "
                            />

                            <div>

                              <p className="text-sm font-medium">
                                {
                                  item.fileName
                                }
                              </p>

                              <p className="text-xs text-muted-foreground">

                                {
                                  item.fileType ||
                                  "Document"
                                }

                                {" · "}

                                {
                                  item.fileSize
                                }{" "}
                                bytes

                              </p>

                            </div>

                          </div>


                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(
                                findingEvidenceApi
                                  .viewEvidence(
                                    item.id
                                  ),
                                "_blank"
                              )
                            }
                          >

                            <ExternalLink
                              className="
                                mr-2
                                h-4
                                w-4
                              "
                            />

                            View

                          </Button>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>


              {/* ACTIONS */}

              <div className="flex flex-wrap gap-3">

                <Button
                  variant="outline"
                  disabled={
                    saving
                  }
                  onClick={
                    handleSaveRemediation
                  }
                >

                  <Save
                    className="
                      mr-2
                      h-4
                      w-4
                    "
                  />

                  {saving
                    ? "Saving..."
                    : "Save Remediation"}

                </Button>


                <Button
                  disabled={
                    submitting ||
                    evidence.length === 0
                  }
                  onClick={
                    handleSubmitForReview
                  }
                >

                  <Send
                    className="
                      mr-2
                      h-4
                      w-4
                    "
                  />

                  {submitting
                    ? "Submitting..."
                    : "Submit for Review"}

                </Button>

              </div>


              {evidence.length === 0 && (

                <p className="text-xs text-destructive">
                  At least one evidence document
                  is required before submission.
                </p>

              )}

            </div>

          )}


          {/* ============================= */}
          {/* SUBMITTED */}
          {/* ============================= */}

          {isSubmitted && (

            <div className="space-y-5">

              {/* SUBMITTED MESSAGE */}

              <div
                className="
                  rounded-lg
                  border
                  border-blue-200
                  bg-blue-50
                  p-5
                "
              >

                <p className="font-medium">
                  Remediation Submitted
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  The Risk Team has submitted
                  remediation and evidence.
                  The finding is now waiting
                  for reviewer verification.
                </p>

              </div>


              {/* REMEDIATION */}

              <div>

                <Label>
                  Remediation Submitted
                </Label>

                <div
                  className="
                    mt-2
                    rounded-lg
                    border
                    bg-muted/30
                    p-4
                  "
                >

                  <p className="whitespace-pre-wrap text-sm">
                    {remediation ||
                      "No remediation details provided."}
                  </p>

                </div>

              </div>


              {/* SUBMITTED EVIDENCE */}

              <div>

                <Label>
                  Submitted Evidence
                </Label>

                <div className="mt-3 space-y-3">

                  {evidence.length === 0 ? (

                    <div
                      className="
                        rounded-lg
                        border
                        border-dashed
                        p-5
                        text-center
                      "
                    >

                      <FileText
                        className="
                          mx-auto
                          h-7
                          w-7
                          text-muted-foreground
                        "
                      />

                      <p className="mt-2 text-sm">
                        No evidence found.
                      </p>

                    </div>

                  ) : (

                    evidence.map(
                      (item) => (

                        <div
                          key={
                            item.id
                          }
                          className="
                            flex
                            items-center
                            justify-between
                            rounded-lg
                            border
                            p-4
                          "
                        >

                          <div className="flex items-center gap-3">

                            <FileText
                              className="
                                h-5
                                w-5
                                text-muted-foreground
                              "
                            />

                            <div>

                              <p className="text-sm font-medium">
                                {
                                  item.fileName
                                }
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {
                                  item.fileType ||
                                  "Document"
                                }
                              </p>

                            </div>

                          </div>


                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(
                                findingEvidenceApi
                                  .viewEvidence(
                                    item.id
                                  ),
                                "_blank"
                              )
                            }
                          >

                            <ExternalLink
                              className="
                                mr-2
                                h-4
                                w-4
                              "
                            />

                            View Evidence

                          </Button>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>


              {/* WAITING MESSAGE */}

              <div
                className="
                  rounded-lg
                  border
                  bg-muted/30
                  p-4
                "
              >

                <p className="text-sm font-medium">
                  Waiting for Reviewer
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  The submitted remediation and
                  evidence will be reviewed from
                  the Reviewer Workspace.
                </p>

              </div>

            </div>

          )}


          {/* ============================= */}
          {/* RESOLVED */}
          {/* ============================= */}

          {isResolved && (

            <div
              className="
                rounded-lg
                border
                border-green-200
                bg-green-50
                p-5
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-green-100
                  "
                >

                  <svg
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                    />
                  </svg>

                </div>

                <div>

                  <p className="font-medium">
                    Finding Resolved
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    The reviewer has verified the
                    remediation and supporting evidence.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ============================= */}
          {/* ACCEPTED RISK */}
          {/* ============================= */}

          {isAcceptedRisk && (

            <div
              className="
                rounded-lg
                border
                border-yellow-200
                bg-yellow-50
                p-5
              "
            >

              <p className="font-medium">
                Risk Accepted
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                This finding has been formally
                accepted as a risk.
              </p>

            </div>

          )}

        </Card>

      </div>
    </>
  );
}
