import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ClipboardList,
  FileEdit,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bell,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/status-badge";

import { useAuthStore } from "@/store/auth";
import { formatDate } from "@/lib/utils";

import { vendorApi } from "@/api/vendorApi";


export function VendorDashboardPage() {

  const navigate = useNavigate();

  const { user } = useAuthStore();

  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  /*
   * LOAD ASSESSMENTS
   */
  const loadAssessments = async () => {

    try {

      setRefreshing(true);

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

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  useEffect(() => {

    loadAssessments();

  }, []);


  /*
   * TODAY
   */
  const today = new Date();

  today.setHours(
      0,
      0,
      0,
      0
  );


  /*
   * DATE HELPER
   */
  const getDueDate = (
      date?: string
  ) => {

    if (!date) {
      return null;
    }

    const dueDate =
        new Date(date);

    dueDate.setHours(
        0,
        0,
        0,
        0
    );

    return dueDate;

  };


  /*
   * COMPLETED STATUSES
   */
  const completedStatuses = [
    "APPROVED",
    "COMPLETED"
  ];


  /*
   * REVIEW STATUSES
   */
  const reviewStatuses = [
    "SUBMITTED",
    "UNDER_REVIEW"
  ];


  /*
   * CORRECTION STATUSES
   */
  const correctionStatuses = [
    "NEEDS_CORRECTION",
    "CORRECTION_REQUIRED",
    "CORRECTION"
  ];


  /*
   * ASSIGNED COUNT
   */
  const assignedCount =
      assessments.filter(
          (assessment) =>
              [
                "ASSIGNED",
                "DRAFT",
                "IN_PROGRESS",
                ...correctionStatuses
              ].includes(
                  assessment.status
              )
      ).length;


  /*
   * DRAFT COUNT
   */
  const draftCount =
      assessments.filter(
          (assessment) =>
              assessment.status === "DRAFT"
      ).length;


  /*
   * SUBMITTED COUNT
   */
  const submittedCount =
      assessments.filter(
          (assessment) =>
              reviewStatuses.includes(
                  assessment.status
              )
      ).length;


  /*
   * APPROVED COUNT
   */
  const approvedCount =
      assessments.filter(
          (assessment) =>
              completedStatuses.includes(
                  assessment.status
              )
      ).length;


  /*
   * CORRECTION COUNT
   */
  const correctionCount =
      assessments.filter(
          (assessment) =>
              correctionStatuses.includes(
                  assessment.status
              )
      ).length;


  /*
   * OVERDUE
   */
  const overdueAssessments =
      assessments.filter(
          (assessment) => {

            const dueDate =
                getDueDate(
                    assessment.dueDate
                );

            if (!dueDate) {
              return false;
            }

            return (
                dueDate < today &&
                ![
                  ...reviewStatuses,
                  ...completedStatuses
                ].includes(
                    assessment.status
                )
            );

          }
      );


  /*
   * DUE SOON
   *
   * Within next 7 days
   */
  const dueSoonAssessments =
      assessments.filter(
          (assessment) => {

            const dueDate =
                getDueDate(
                    assessment.dueDate
                );

            if (!dueDate) {
              return false;
            }

            const difference =
                dueDate.getTime() -
                today.getTime();

            const days =
                difference /
                (1000 * 60 * 60 * 24);

            return (
                days >= 0 &&
                days <= 7 &&
                ![
                  ...reviewStatuses,
                  ...completedStatuses
                ].includes(
                    assessment.status
                )
            );

          }
      );


  /*
   * AVERAGE PROGRESS
   */
  const averageProgress =
      assessments.length === 0
          ? 0
          : Math.round(
              assessments.reduce(
                  (
                      total,
                      assessment
                  ) =>
                      total +
                      Number(
                          assessment.progress ?? 0
                      ),
                  0
              ) /
              assessments.length
          );


  /*
   * COMPLETION RATE
   */
  const completionRate =
      assessments.length === 0
          ? 0
          : Math.round(
              (
                  approvedCount /
                  assessments.length
              ) * 100
          );


  /*
   * RECENT ASSESSMENTS
   */
  const recentAssessments =
      useMemo(
          () => {

            return [...assessments]
                .sort(
                    (a, b) => {

                      const dateA =
                          new Date(
                              a.createdAt ??
                              a.dueDate ??
                              0
                          ).getTime();

                      const dateB =
                          new Date(
                              b.createdAt ??
                              b.dueDate ??
                              0
                          ).getTime();

                      return dateB - dateA;

                    }
                )
                .slice(
                    0,
                    6
                );

          },
          [assessments]
      );


  /*
   * STATUS CLASS
   */
  const getStatusClass = (
      status?: string
  ) => {

    switch (status) {

      case "APPROVED":
      case "COMPLETED":

        return "text-green-700 bg-green-50 border-green-200";

      case "SUBMITTED":
      case "UNDER_REVIEW":

        return "text-yellow-700 bg-yellow-50 border-yellow-200";

      case "REJECTED":
      case "NEEDS_CORRECTION":
      case "CORRECTION_REQUIRED":
      case "CORRECTION":

        return "text-red-700 bg-red-50 border-red-200";

      case "IN_PROGRESS":

        return "text-blue-700 bg-blue-50 border-blue-200";

      case "DRAFT":

        return "text-gray-700 bg-gray-50 border-gray-200";

      case "ASSIGNED":

        return "text-purple-700 bg-purple-50 border-purple-200";

      default:

        return "text-blue-700 bg-blue-50 border-blue-200";

    }

  };


  /*
   * STATUS LABEL
   *
   * Using replace() instead of replaceAll()
   * so older TypeScript targets also work.
   */
  const getStatusLabel = (
      status?: string
  ) => {

    return String(
        status || "ASSIGNED"
    )
        .replace(
            /_/g,
            " "
        );

  };


  /*
   * ATTENTION ASSESSMENTS
   */
  const attentionAssessments =
      useMemo(
          () => {

            const items = [
              ...overdueAssessments,

              ...assessments.filter(
                  (assessment) =>
                      correctionStatuses.includes(
                          assessment.status
                      )
              ),

              ...dueSoonAssessments
            ];

            return items
                .filter(
                    (
                        assessment,
                        index,
                        self
                    ) =>
                        self.findIndex(
                            (item) =>
                                item.id ===
                                assessment.id
                        ) === index
                )
                .slice(
                    0,
                    5
                );

          },
          [
            assessments,
            overdueAssessments,
            dueSoonAssessments
          ]
      );


  /*
   * LOADING
   */
  if (loading) {

    return (

        <div className="space-y-6">

          <PageHeader
              title="Vendor Dashboard"
              description="Loading your security assessment workspace..."
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            {[1, 2, 3, 4].map(
                (item) => (

                    <Card key={item}>

                      <CardContent className="p-6">

                        <div className="h-16 animate-pulse rounded-md bg-muted" />

                      </CardContent>

                    </Card>

                )
            )}

          </div>

        </div>

    );

  }


  return (

      <div className="space-y-6">

        {/* HEADER */}

        <PageHeader

            title={
              `Welcome, ${
                  user?.name?.split(" ")[0] ||
                  "Vendor"
              }`
            }

            description={
              `${
                  user?.company ||
                  "Your organisation"
              } · Security assessment portal`
            }

            actions={

              <Button
                  variant="outline"
                  onClick={loadAssessments}
                  disabled={refreshing}
              >

                <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                        refreshing
                            ? "animate-spin"
                            : ""
                    }`}
                />

                Refresh

              </Button>

            }

        />


        {/* STAT CARDS */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
              label="Assigned"
              value={assignedCount}
              icon={ClipboardList}
              accent="blue"
          />

          <StatCard
              label="Drafts"
              value={draftCount}
              icon={FileEdit}
              accent="amber"
          />

          <StatCard
              label="Submitted"
              value={submittedCount}
              icon={CheckCircle2}
              accent="green"
          />

          <StatCard
              label="Due Soon"
              value={dueSoonAssessments.length}
              icon={Clock}
              accent="red"
          />

        </div>


        {/* OVERVIEW */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* OVERALL PROGRESS */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2 text-base">

                <TrendingUp className="h-4 w-4 text-blue-500" />

                Overall Progress

              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="flex items-end justify-between">

                            <span className="text-3xl font-bold">

                                {averageProgress}%

                            </span>

                <span className="text-sm text-muted-foreground">

                                {assessments.length} assessments

                            </span>

              </div>

              <Progress
                  value={averageProgress}
                  className="mt-4"
              />

            </CardContent>

          </Card>


          {/* COMPLETION RATE */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2 text-base">

                <CheckCircle2 className="h-4 w-4 text-green-500" />

                Completion Rate

              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="flex items-end justify-between">

                            <span className="text-3xl font-bold">

                                {completionRate}%

                            </span>

                <span className="text-sm text-muted-foreground">

                                {approvedCount} completed

                            </span>

              </div>

              <Progress
                  value={completionRate}
                  className="mt-4"
              />

            </CardContent>

          </Card>


          {/* ATTENTION */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-2 text-base">

                <AlertTriangle
                    className={
                      correctionCount > 0 ||
                      overdueAssessments.length > 0
                          ? "h-4 w-4 text-red-500"
                          : "h-4 w-4 text-green-500"
                    }
                />

                Attention Required

              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="flex items-end justify-between">

                            <span className="text-3xl font-bold">

                                {
                                    correctionCount +
                                    overdueAssessments.length
                                }

                            </span>

                <span className="text-sm text-muted-foreground">

                                items

                            </span>

              </div>

              <p className="mt-3 text-sm text-muted-foreground">

                {
                  correctionCount > 0

                      ? `${correctionCount} assessment${
                          correctionCount > 1
                              ? "s"
                              : ""
                      } need correction.`

                      : overdueAssessments.length > 0

                          ? `${overdueAssessments.length} assessment${
                              overdueAssessments.length > 1
                                  ? "s"
                                  : ""
                          } overdue.`

                          : "Everything is up to date."
                }

              </p>

            </CardContent>

          </Card>

        </div>


        {/* ACTION REQUIRED */}

        {
            attentionAssessments.length > 0 && (

                <Card className="border-yellow-200">

                  <CardHeader>

                    <CardTitle className="flex items-center gap-2 text-base">

                      <AlertTriangle className="h-4 w-4 text-yellow-500" />

                      Action Required

                    </CardTitle>

                  </CardHeader>

                  <CardContent className="space-y-3">

                    {
                      attentionAssessments.map(
                          (assessment) => {

                            const isOverdue =
                                overdueAssessments.some(
                                    (item) =>
                                        item.id ===
                                        assessment.id
                                );

                            const isCorrection =
                                correctionStatuses.includes(
                                    assessment.status
                                );

                            return (

                                <button

                                    key={
                                      assessment.id
                                    }

                                    onClick={() =>
                                        navigate(
                                            `/vendor/assessments/${assessment.id}`
                                        )
                                    }

                                    className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition hover:bg-muted"

                                >

                                  <div
                                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                          isOverdue ||
                                          isCorrection
                                              ? "bg-red-100 text-red-600"
                                              : "bg-yellow-100 text-yellow-600"
                                      }`}
                                  >

                                    <AlertTriangle className="h-5 w-5" />

                                  </div>


                                  <div className="min-w-0 flex-1">

                                    <p className="truncate font-medium">

                                      {
                                          assessment.templateName ||
                                          "Security Assessment"
                                      }

                                    </p>

                                    <p className="text-xs text-muted-foreground">

                                      {
                                          assessment.code ||
                                          `Assessment #${assessment.id}`
                                      }

                                      {" · "}

                                      {
                                        assessment.dueDate
                                            ? `Due ${formatDate(
                                                assessment.dueDate
                                            )}`
                                            : "No due date"
                                      }

                                    </p>

                                  </div>


                                  <StatusBadge
                                      status={
                                        assessment.status
                                      }
                                  />

                                  <ArrowRight className="h-4 w-4 shrink-0" />

                                </button>

                            );

                          }
                      )
                    }

                  </CardContent>

                </Card>

            )
        }


        {/* MAIN CONTENT */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* RECENT ASSESSMENTS */}

          <Card className="lg:col-span-2">

            <CardHeader className="flex-row items-center justify-between space-y-0">

              <CardTitle className="text-base">

                Recent Assessments

              </CardTitle>

              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                      navigate(
                          "/vendor/assessments"
                      )
                  }
              >

                View all

                <ArrowRight className="ml-1 h-4 w-4" />

              </Button>

            </CardHeader>


            <CardContent className="space-y-2">

              {
                recentAssessments.length === 0

                    ? (

                        <div className="flex flex-col items-center justify-center py-12 text-center">

                          <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground" />

                          <p className="font-medium">

                            No assessments assigned

                          </p>

                          <p className="mt-1 text-sm text-muted-foreground">

                            Your assigned assessments will appear here.

                          </p>

                        </div>

                    )

                    : (

                        recentAssessments.map(
                            (assessment) => {

                              const progress =
                                  Number(
                                      assessment.progress ?? 0
                                  );

                              const statusClass =
                                  getStatusClass(
                                      assessment.status
                                  );

                              return (

                                  <button

                                      key={
                                        assessment.id
                                      }

                                      onClick={() =>
                                          navigate(
                                              `/vendor/assessments/${assessment.id}`
                                          )
                                      }

                                      className="group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition hover:bg-muted"

                                  >

                                    {/* ICON */}

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                                      <ClipboardList className="h-5 w-5" />

                                    </div>


                                    {/* DETAILS */}

                                    <div className="min-w-0 flex-1">

                                      <p className="truncate text-sm font-semibold">

                                        {
                                            assessment.templateName ||
                                            "Security Assessment"
                                        }

                                      </p>

                                      <p className="mt-1 truncate text-xs text-muted-foreground">

                                        {
                                            assessment.code ||
                                            `Assessment #${assessment.id}`
                                        }

                                        {" · "}

                                        {
                                          assessment.dueDate
                                              ? `Due ${formatDate(
                                                  assessment.dueDate
                                              )}`
                                              : "No due date"
                                        }

                                      </p>

                                    </div>


                                    {/* PROGRESS */}

                                    <div className="hidden w-28 md:block">

                                      <div className="mb-1 flex justify-between">

                                                            <span className="text-[11px] text-muted-foreground">

                                                                Progress

                                                            </span>

                                        <span className="text-[11px] font-medium">

                                                                {progress}%

                                                            </span>

                                      </div>

                                      <Progress
                                          value={progress}
                                      />

                                    </div>


                                    {/* STATUS */}

                                    <div
                                        className={`hidden rounded-full border px-2.5 py-1 text-xs font-medium sm:block ${statusClass}`}
                                    >

                                      {
                                        getStatusLabel(
                                            assessment.status
                                        )
                                      }

                                    </div>


                                    <ArrowRight
                                        className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1"
                                    />

                                  </button>

                              );

                            }
                        )

                    )
              }

            </CardContent>

          </Card>


          {/* RIGHT PANEL */}

          <div className="space-y-6">

            {/* QUICK ACTIONS */}

            <Card>

              <CardHeader>

                <CardTitle className="text-base">

                  Quick Actions

                </CardTitle>

              </CardHeader>

              <CardContent className="space-y-2">

                <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() =>
                        navigate(
                            "/vendor/assessments"
                        )
                    }
                >

                                <span className="flex items-center gap-2">

                                    <ClipboardList className="h-4 w-4" />

                                    View Assessments

                                </span>

                  <ArrowRight className="h-4 w-4" />

                </Button>


                <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() =>
                        navigate(
                            "/vendor/history"
                        )
                    }
                >

                                <span className="flex items-center gap-2">

                                    <CalendarDays className="h-4 w-4" />

                                    Submission History

                                </span>

                  <ArrowRight className="h-4 w-4" />

                </Button>


                <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() =>
                        navigate(
                            "/vendor/messages"
                        )
                    }
                >

                                <span className="flex items-center gap-2">

                                    <Bell className="h-4 w-4" />

                                    Messages

                                </span>

                  <ArrowRight className="h-4 w-4" />

                </Button>

              </CardContent>

            </Card>


            {/* STATUS SUMMARY */}

            <Card>

              <CardHeader>

                <CardTitle className="text-base">

                  Assessment Summary

                </CardTitle>

              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex items-center justify-between">

                                <span className="text-sm text-muted-foreground">

                                    In progress

                                </span>

                  <span className="font-semibold text-blue-600">

                                    {
                                      assessments.filter(
                                          (a) =>
                                              a.status ===
                                              "IN_PROGRESS"
                                      ).length
                                    }

                                </span>

                </div>


                <div className="flex items-center justify-between">

                                <span className="text-sm text-muted-foreground">

                                    Under review

                                </span>

                  <span className="font-semibold text-yellow-600">

                                    {
                                      assessments.filter(
                                          (a) =>
                                              reviewStatuses.includes(
                                                  a.status
                                              )
                                      ).length
                                    }

                                </span>

                </div>


                <div className="flex items-center justify-between">

                                <span className="text-sm text-muted-foreground">

                                    Approved

                                </span>

                  <span className="font-semibold text-green-600">

                                    {approvedCount}

                                </span>

                </div>


                <div className="flex items-center justify-between">

                                <span className="text-sm text-muted-foreground">

                                    Corrections

                                </span>

                  <span className="font-semibold text-red-600">

                                    {correctionCount}

                                </span>

                </div>


                <div className="flex items-center justify-between">

                                <span className="text-sm text-muted-foreground">

                                    Overdue

                                </span>

                  <span className="font-semibold text-red-600">

                                    {
                                      overdueAssessments.length
                                    }

                                </span>

                </div>

              </CardContent>

            </Card>

          </div>

        </div>

      </div>

  );

}