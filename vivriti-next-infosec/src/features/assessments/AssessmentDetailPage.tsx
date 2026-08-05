import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import assessmentApi, {
  Assessment
} from "./assessment";



import {
  PageHeader
} from "@/components/common/page-header";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


import {
  Button
} from "@/components/ui/button";


import {
  Badge
} from "@/components/ui/badge";


import {
  Progress
} from "@/components/ui/progress";


import {
  ArrowLeft,
  Trash2,
  Building2,
  FileText,
  User,
  CalendarDays,
  Copy
} from "lucide-react";


import {
  toast
} from "@/store/toast";





export function AssessmentDetailPage(){



  const {
    id
  } = useParams();



  const navigate =
      useNavigate();




  const [assessment,setAssessment]
      = useState<Assessment | null>(null);



  const [loading,setLoading]
      = useState(true);







  const loadAssessment = async()=>{


    try{


      if(!id)
        return;



      const data =
          await assessmentApi
              .getAssessmentById(
                  (id)
              );



      setAssessment(data);



    }
    catch(error){


      console.error(
          "Assessment details failed",
          error
      );


    }
    finally{


      setLoading(false);


    }


  };







  useEffect(()=>{


    loadAssessment();


  },[id]);









  const deleteAssessment = async()=>{


    if(!assessment)
      return;



    try{


      await assessmentApi
          .deleteAssessment(
              assessment.id
          );



      toast.success(
          "Assessment deleted"
      );



      navigate(
          "/assessments"
      );


    }
    catch(error){


      toast.error(
          "Delete failed"
      );


    }


  };









  if(loading){


    return (

        <div className="p-6">

          Loading assessment...

        </div>

    );


  }







  if(!assessment){


    return (

        <div className="p-6">

          Assessment not found

        </div>

    );


  }







  return (

      <div className="space-y-6">





        <PageHeader


            title={
              assessment.code
            }


            description="Assessment Details"



            actions={

              <div className="flex gap-2">



                <Button

                    variant="outline"

                    onClick={()=>
                        navigate(
                            "/assessments"
                        )
                    }

                >

                  <ArrowLeft className="mr-2 h-4 w-4"/>

                  Back

                </Button>






                <Button

                    variant="destructive"

                    onClick={
                      deleteAssessment
                    }

                >

                  <Trash2 className="mr-2 h-4 w-4"/>

                  Delete


                </Button>



              </div>

            }


        />









        <div className="grid gap-5 md:grid-cols-3">





          <Card>

            <CardHeader>

              <CardTitle>
                Status
              </CardTitle>

            </CardHeader>


            <CardContent>

              <Badge>

                {
                  assessment.status
                }

              </Badge>

            </CardContent>


          </Card>






          <Card>

            <CardHeader>

              <CardTitle>
                Progress
              </CardTitle>

            </CardHeader>


            <CardContent>


              <p className="text-3xl font-bold">

                {
                  assessment.progress
                }%

              </p>



              <Progress

                  value={
                    assessment.progress
                  }

              />

            </CardContent>


          </Card>







          <Card>

            <CardHeader>

              <CardTitle>
                Risk
              </CardTitle>

            </CardHeader>


            <CardContent>

              <Badge>

                {
                    assessment.riskLevel ??
                    "LOW"
                }

              </Badge>

            </CardContent>


          </Card>



        </div>










        <Card>


          <CardHeader>

            <CardTitle>
              Information
            </CardTitle>

          </CardHeader>



          <CardContent className="space-y-5">





            <div className="flex gap-3">

              <Building2/>


              <div>

                <p className="text-sm text-muted-foreground">

                  Entity

                </p>


                <p>

                  {
                    assessment.entityName
                  }

                </p>


              </div>


            </div>









            <div className="flex gap-3">

              <FileText/>


              <div>

                <p className="text-sm text-muted-foreground">

                  Template

                </p>


                <p>

                  {
                    assessment.templateName
                  }

                </p>


              </div>


            </div>









            <div className="flex gap-3">

              <User/>


              <div>

                <p className="text-sm text-muted-foreground">

                  Reviewer

                </p>


                <p>

                  {
                    assessment.reviewerName
                  }

                </p>


              </div>


            </div>








            <div className="flex gap-3">


              <CalendarDays/>


              <div>


                <p className="text-sm text-muted-foreground">

                  Due Date

                </p>


                <p>

                  {
                    assessment.dueDate
                  }

                </p>


              </div>


            </div>







          </CardContent>


        </Card>









        {
            assessment.assessmentLink &&

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

                      className="flex-1 rounded border px-3 py-2"

                  />



                  <Button

                      variant="outline"

                      onClick={()=>{


                        navigator.clipboard
                            .writeText(
                                assessment.assessmentLink ?? ""
                            );


                        toast.success(
                            "Link copied"
                        );


                      }}

                  >

                    <Copy/>

                  </Button>



                </div>


              </CardContent>


            </Card>

        }





      </div>

  );


}