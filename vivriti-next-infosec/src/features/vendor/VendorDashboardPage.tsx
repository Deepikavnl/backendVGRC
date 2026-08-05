import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  FileEdit,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bell
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
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
  console.log("CURRENT USER:", user);

  const [assessments, setAssessments] = useState<any[]>([]);


  const [loading, setLoading] = useState(true);




  useEffect(() => {



    const loadAssessments = async () => {

      try {

        const data = await vendorApi.getVendorAssessments();

        setAssessments(Array.isArray(data) ? data : []);

      } catch (error) {

        console.error("Failed to load vendor assessments", error);

        setAssessments([]);

      } finally {

        setLoading(false);

      }

    };

    loadAssessments();

  }, []);




  if (loading) {

    return <div>Loading dashboard...</div>;

  }



  const stats = [


    {
      label: "Assigned",
      value:
      assessments.filter(
          (a) =>
              [
                "ASSIGNED",
                "DRAFT",
                "IN_PROGRESS",
                "NEEDS_CORRECTION"
              ].includes(a.status)
      ).length,

      icon: ClipboardList,
      accent: "blue" as const
    },



    {
      label: "Drafts",

      value:
      assessments.filter(
          (a) =>
              a.status === "DRAFT"
      ).length,

      icon: FileEdit,
      accent: "amber" as const
    },



    {
      label: "Submitted",

      value:
      assessments.filter(
          (a) =>
              a.status === "SUBMITTED"
      ).length,

      icon: CheckCircle2,
      accent: "green" as const
    },



    {
      label: "Due Soon",

      value:
      assessments.filter(
          (a) =>
              a.dueDate &&
              new Date(a.dueDate)
              <
              new Date()
      ).length,

      icon: Clock,
      accent: "red" as const
    }

  ];



  return (

      <>


        <PageHeader

            title={`Welcome, ${user?.name?.split(" ")[0]}`}

            description={`${user?.company} · Security assessment portal`}

        />




        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">


          {stats.map((s) => (

              <StatCard
                  key={s.label}
                  {...s}
              />

          ))}


        </div>





        <div className="grid gap-6 lg:grid-cols-3">


          <Card className="lg:col-span-2">


            <CardHeader className="flex-row items-center justify-between space-y-0">


              <CardTitle className="text-base">

                Your Assessments

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

                <ArrowRight className="h-4 w-4" />

              </Button>


            </CardHeader>




            <CardContent className="space-y-1">


              {assessments
                  .slice(0,6)
                  .map((a) => (


                      <button

                          key={a.id}

                          onClick={() =>
                              navigate(
                                  `/vendor/assessments/${a.id}`
                              )
                          }

                          className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left hover:bg-muted"

                      >


                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">

                          <ClipboardList className="h-4 w-4"/>

                        </div>



                        <div className="min-w-0 flex-1">


                          <p className="truncate text-sm font-medium">

                            {a.templateName}

                          </p>



                          <p className="truncate text-xs text-muted-foreground">

                            {a.code}
                            {" · "}
                            Due {formatDate(a.dueDate)}

                          </p>


                        </div>




                        <div className="hidden w-24 sm:block">

                          <Progress
                              value={
                                  a.progress ?? 0
                              }
                          />

                        </div>



                        <StatusBadge
                            status={a.status}
                        />



                      </button>


                  ))}


            </CardContent>


          </Card>





          <Card>


            <CardHeader>


              <CardTitle className="text-base flex items-center gap-2">

                <Bell className="h-4 w-4"/>

                Messages

              </CardTitle>


            </CardHeader>



            <CardContent className="space-y-3">


              <p className="text-sm text-muted-foreground">

                No new messages

              </p>



              <Button

                  variant="outline"

                  size="sm"

                  className="w-full"

                  onClick={() =>
                      navigate(
                          "/vendor/messages"
                      )
                  }

              >

                View all messages

              </Button>


            </CardContent>


          </Card>


        </div>


      </>

  );

}