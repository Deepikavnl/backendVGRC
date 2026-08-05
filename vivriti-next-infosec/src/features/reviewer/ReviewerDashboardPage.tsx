import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Toolbar, SearchInput } from "@/components/common/toolbar";
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

import { formatDate } from "@/lib/utils";

import  assessmentApi  from "@/features/assessments/assessment";
import type { Assessment } from "@/types";

export function ReviewerDashboardPage() {

  const navigate = useNavigate();

  const [assessments, setAssessments] =
      useState<Assessment[]>([]);

  const [loading, setLoading] =
      useState(true);

  const [search, setSearch] =
      useState("");

    useEffect(() => {
        assessmentApi
            .getAllAssessments()
            .then((data) => {
                setAssessments(data);
            })
            .catch((error) => {
                console.error("Failed to load assessments", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    const queue = useMemo(() => {

        return assessments.filter((a: any) =>
            [
                "SUBMITTED",
                "UNDER_REVIEW",
                "CORRECTION_SUBMITTED",
                "CORRECTION_REQUIRED",
            ].includes(String(a.status).toUpperCase())
        );

    }, [assessments]);


  const filtered = useMemo(() => {

    return queue.filter((a: any) =>

        !search ||

        a.entityName
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        a.code
            ?.toLowerCase()
            .includes(search.toLowerCase())

    );

  }, [queue, search]);


  const stats = [

    {
      label: "Awaiting Review",
      value: queue.filter(
          (a: any) =>
              String(a.status).toUpperCase() === "SUBMITTED"
      ).length,
      icon: Clock,
      accent: "amber" as const,
    },

    {
      label: "Under Review",
      value: queue.filter(
          (a: any) =>
              String(a.status).toUpperCase() === "UNDER_REVIEW"
      ).length,
      icon: UserCheck,
      accent: "blue" as const,
    },
      {
          label: "Needs Correction",
          value: queue.filter(
              (a: any) =>
                  String(a.status).toUpperCase() === "CORRECTION_REQUIRED"
          ).length,
          icon: AlertCircle,
          accent: "red" as const,
      },

    {
      label: "Resubmitted",
      value: queue.filter(
          (a: any) =>
              String(a.status).toUpperCase() === "CORRECTION_SUBMITTED"
      ).length,
      icon: CheckCircle2,
      accent: "green" as const,
    },

  ];


  if (loading) {

    return (
        <div className="p-6">
          Loading reviewer workspace...
        </div>
    );

  }


  return (
      <>
        <PageHeader
            title="Reviewer Workspace"
            description="Your review queue — submissions awaiting validation."
            breadcrumbs={[
              {
                label: "Reviewer Workspace",
              },
            ]}
        />

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
              <StatCard
                  key={s.label}
                  {...s}
              />
          ))}
        </div>

        <Toolbar>

          <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search queue..."
              className="w-full sm:max-w-xs"
          />

        </Toolbar>

        {
          filtered.length === 0 ? (

              <EmptyState
                  icon={CheckCircle2}
                  title="Queue is clear"
                  description="No assessments are awaiting your review."
              />

          ) : (

              <Card>

                <Table>

                  <TableHeader>

                    <TableRow>

                      <TableHead>Code</TableHead>

                      <TableHead>Entity</TableHead>

                      <TableHead>Risk</TableHead>

                      <TableHead>Progress</TableHead>

                      <TableHead>Status</TableHead>

                      <TableHead>Submitted</TableHead>

                      <TableHead></TableHead>

                    </TableRow>

                  </TableHeader>

                  <TableBody>

                    {filtered.map((a: any) => (

                        <TableRow
                            key={a.id}
                            className="cursor-pointer"
                            onClick={() => navigate(`/reviewer/${a.id}`)}
                        >

                          <TableCell className="font-mono text-xs">
                            {a.code}
                          </TableCell>

                          <TableCell>

                            <div className="flex items-center gap-2">

                              <Avatar
                                  name={a.entityName}
                                  className="h-7 w-7"
                              />

                              <span className="text-sm font-medium">
                                        {a.entityName}
                                    </span>

                            </div>

                          </TableCell>

                          <TableCell>

                            <RiskBadge
                                level={a.riskRating || a.riskLevel}
                            />

                          </TableCell>

                          <TableCell>

                            <div className="flex items-center gap-2">

                              <Progress
                                  value={a.progress}
                                  className="w-16"
                              />

                              <span className="text-xs text-muted-foreground">
                                        {a.progress}%
                                    </span>

                            </div>

                          </TableCell>

                          <TableCell>

                            <StatusBadge
                                status={a.status}
                            />

                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">

                            {a.submittedAt
                                ? formatDate(a.submittedAt)
                                : "-"}

                          </TableCell>

                          <TableCell>

                            <Button
                                variant="ghost"
                                size="icon"
                            >

                              <ArrowRight className="h-4 w-4" />

                            </Button>

                          </TableCell>

                        </TableRow>

                    ))}

                  </TableBody>

                </Table>
              </Card>

          )

        }

      </>

  );

}