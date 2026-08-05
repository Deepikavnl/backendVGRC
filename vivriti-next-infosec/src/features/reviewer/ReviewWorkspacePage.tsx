import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  Check,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  FileText,
  ShieldAlert,
  History,
  ArrowLeft,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RiskBadge } from "@/components/common/status-badge";


import { cn } from "@/lib/utils";
import { toast } from "@/store/toast";


import {
  reviewerApi
} from "@/features/reviewer/reviewerApi";



type Decision =
    | "approved"
    | "flagged"
    | "correction"
    | null;



export function ReviewWorkspacePage(){


  const {
    id
  } = useParams();



  const navigate =
      useNavigate();



  const [
    assessment,
    setAssessment
  ] =
      useState<any>(null);



  const [
    loading,
    setLoading
  ] =
      useState(true);



  const [
    idx,
    setIdx
  ] =
      useState(0);



  const [
    decisions,
    setDecisions
  ] =
      useState<Record<string,Decision>>({});



  const [
    comments,
    setComments
  ] =
      useState<Record<string,string>>({});



  const [
    comment,
    setComment
  ] =
      useState("");



  const [
    findingOpen,
    setFindingOpen
  ] =
      useState(false);




  useEffect(()=>{


    if(!id)
      return;



    const loadWorkspace = async()=>{

      try{


        const data =
            await reviewerApi.getWorkspace(
                Number(id)
            );


        console.log(
            "Reviewer Workspace:",
            data
        );


        setAssessment(data);



        const loadedDecisions:any = {};
        const loadedComments:any = {};



        data.answers?.forEach(
            (answer:any)=>{


              if(answer.reviewerDecision){


                loadedDecisions[
                    answer.questionId
                    ] =
                    answer.reviewerDecision
                        .toLowerCase();


              }



              if(answer.reviewerComment){


                loadedComments[
                    answer.questionId
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
      catch(error){


        console.error(error);


        toast.error(
            "Failed to load reviewer workspace"
        );


      }
      finally{


        setLoading(false);


      }


    };



    loadWorkspace();



  },[id]);






  if(loading){


    return (

        <div className="p-6">

          Loading reviewer workspace...

        </div>

    );


  }






  if(!assessment){


    return (

        <EmptyState

            icon={FileText}

            title="Assessment not found"

        />

    );


  }






  const answers =
      assessment.answers || [];





  if(!answers.length){


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
      Object.keys(decisions)
          .length;





  return (

      <div
          className="
      -m-4
      flex
      h-[calc(100vh-64px)]
      flex-col
      lg:-m-6
      xl:-m-8
      "
      >



        {/* HEADER */}

        <div
            className="
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

              onClick={()=>
                  navigate("/reviewer")
              }

          >

            <ArrowLeft className="h-4 w-4"/>

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
                      (reviewed / answers.length) * 100
                  }

                  className="w-24"

              />


            </div>



            <Button

                variant="outline"

                size="sm"

                onClick={()=>
                    setFindingOpen(true)
                }

            >

              <ShieldAlert className="h-4 w-4"/>

              Create Finding

            </Button>





            <Button

                size="sm"

                onClick={async()=>{


                  try{


                    await reviewerApi.submitReview(
                        assessment.id
                    );


                    toast.success(
                        "Review submitted successfully"
                    );


                    navigate("/reviewer");


                  }
                  catch(error){


                    toast.error(
                        "Submit failed"
                    );


                  }


                }}

            >

              <Check className="h-4 w-4"/>

              Submit Review

            </Button>




          </div>


        </div>
        {/* MAIN GRID */}

        <div
            className="
        grid
        flex-1
        grid-cols-1
        overflow-hidden
        lg:grid-cols-[260px_1fr_320px]
        "
        >



          {/* QUESTION LIST */}

          <div
              className="
          hidden
          overflow-y-auto
          scrollbar-thin
          border-r
          bg-muted/20
          lg:block
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



            {
              answers.map(
                  (ans:any,index:number)=>{


                    const decision =
                        decisions[ans.questionId];



                    return (

                        <button

                            key={ans.questionId}

                            onClick={()=>
                                setIdx(index)
                            }


                            className={cn(

                                "flex w-full items-start gap-2 border-l-2 px-4 py-2.5 text-left",

                                idx===index
                                    ?
                                    "border-primary bg-card"
                                    :
                                    "border-transparent hover:bg-card/60"

                            )}

                        >


                    <span
                        className={cn(

                            "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",

                            decision==="approved"
                                ?
                                "bg-success text-white"
                                :
                                decision==="correction"
                                    ?
                                    "bg-destructive text-white"
                                    :
                                    "bg-muted text-muted-foreground"

                        )}

                    >

                      {
                        decision==="approved"
                            ?
                            <Check className="h-3 w-3"/>
                            :
                            index+1
                      }


                    </span>



                          <span
                              className="
                      line-clamp-2
                      text-xs
                      "
                          >

                      {ans.questionText}

                    </span>


                        </button>


                    );


                  }

              )
            }


          </div>





          {/* CENTER */}

          <div
              className="
          overflow-y-auto
          scrollbar-thin
          p-6
          "
          >


            <div
                className="
            mx-auto
            max-w-2xl
            "
            >



              <div
                  className="
              mb-4
              flex
              justify-between
              "
              >


                <Badge variant="secondary">

                  Question {idx+1} of {answers.length}

                </Badge>



                <div className="flex gap-1">


                  <Button

                      variant="outline"

                      size="icon"

                      disabled={idx===0}

                      onClick={()=>
                          setIdx(idx-1)
                      }

                  >

                    <ChevronLeft/>

                  </Button>



                  <Button

                      variant="outline"

                      size="icon"

                      disabled={
                          idx===answers.length-1
                      }

                      onClick={()=>
                          setIdx(idx+1)
                      }

                  >

                    <ChevronRight/>

                  </Button>


                </div>


              </div>





              <h2 className="text-lg font-semibold">

                {current.questionText}

              </h2>




              <div className="mt-5">


                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">

                  Vendor Response

                </p>



                <div className="rounded-lg border bg-card p-4">

                  {current.answerValue}

                </div>


              </div>





              {
                  decisions[current.questionId]==="correction" && (

                      <div
                          className="
                mt-5
                rounded-lg
                border
                border-destructive/30
                bg-destructive/5
                p-4
                "
                      >


                        <p className="flex gap-2 font-medium text-destructive">

                          <History/>

                          Correction Required

                        </p>



                        <div className="mt-3">


                          <p className="text-xs uppercase text-muted-foreground">

                            Reviewer Comment

                          </p>


                          <p>

                            {comments[current.questionId]}

                          </p>


                        </div>


                      </div>

                  )
              }



            </div>


          </div>






          {/* REVIEW PANEL */}

          <div
              className="
          overflow-y-auto
          border-l
          bg-muted/20
          p-4
          "
          >



            <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">

              Reviewer Decision

            </p>




            <Textarea

                value={comment}

                onChange={(e)=>
                    setComment(e.target.value)
                }

                placeholder="Add comment for vendor..."

                rows={5}

            />





            <div className="mt-4 space-y-2">



              {/* APPROVE */}

              <Button

                  className="w-full"

                  onClick={async()=>{


                    await reviewerApi.saveDecision({

                      assessmentId:
                      assessment.id,

                      questionId:
                      current.questionId,

                      decision:
                          "APPROVED",

                      comment

                    });



                    setDecisions(prev=>({

                      ...prev,

                      [current.questionId]:
                          "approved"

                    }));



                    setComments(prev=>({

                      ...prev,

                      [current.questionId]:
                      comment

                    }));



                    setComment("");



                    toast.success(
                        "Response approved"
                    );


                  }}

              >

                <Check/>

                Approve Response

              </Button>





              {/* CORRECTION */}

              <Button

                  variant="destructive"

                  className="w-full"

                  onClick={async()=>{


                    await reviewerApi.saveDecision({

                      assessmentId:
                      assessment.id,

                      questionId:
                      current.questionId,

                      decision:
                          "CORRECTION",

                      comment

                    });



                    setDecisions(prev=>({

                      ...prev,

                      [current.questionId]:
                          "correction"

                    }));



                    setComments(prev=>({

                      ...prev,

                      [current.questionId]:
                      comment

                    }));



                    setComment("");



                    toast.success(
                        "Correction marked"
                    );


                  }}

              >

                <RotateCcw/>

                Request Correction


              </Button>



            </div>




            <div
                className="
            mt-6
            rounded-lg
            border
            bg-card
            p-3
            "
            >

              <p className="text-xs font-semibold uppercase text-muted-foreground">

                Decision Status

              </p>



              <p className="mt-2 text-sm">

                Approved : {
                Object.values(decisions)
                    .filter(
                        d=>d==="approved"
                    )
                    .length
              }

              </p>



              <p className="text-sm">

                Correction : {
                Object.values(decisions)
                    .filter(
                        d=>d==="correction"
                    )
                    .length
              }

              </p>


            </div>



          </div>


        </div>





        {/* FINDING DIALOG */}

        <Dialog

            open={findingOpen}

            onOpenChange={setFindingOpen}

        >

          <DialogHeader>

            <DialogTitle>

              <ShieldAlert/>

              Create Finding

            </DialogTitle>


          </DialogHeader>



          <DialogBody>

            Finding module already integrated.

          </DialogBody>



          <DialogFooter>


            <Button

                variant="outline"

                onClick={()=>
                    setFindingOpen(false)
                }

            >

              Cancel

            </Button>


          </DialogFooter>


        </Dialog>




      </div>

  );


}