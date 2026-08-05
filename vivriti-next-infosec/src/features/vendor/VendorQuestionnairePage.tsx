import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

import {
    Save,
    Send,
    Lock,
    ArrowLeft
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

import { toast } from "@/store/toast";

import { vendorApi } from "@/api/vendorApi";


export function VendorQuestionnairePage(){



    const { id, token } = useParams();

    const routeAssessmentId = id ? Number(id) : null;

    const [assessmentId, setAssessmentId] =
        useState<number | null>(routeAssessmentId);

    const navigate = useNavigate();
    const [questions,setQuestions]=useState<any[]>([]);

    const [answers,setAnswers]=useState<Record<number,string>>({});

    const [loading,setLoading]=useState(true);

    const [locked,setLocked]=useState(false);
    const [correctionRequired,setCorrectionRequired]=useState(false);

    const [reviewerComment,setReviewerComment]=useState("");
    const [confirmSubmit,setConfirmSubmit]=useState(false);



    useEffect(() => {

        const loadQuestions = async () => {

            try {

                let data;

                if (token) {

                    data = await vendorApi.getVendorQuestionnaireByToken(token);

                } else if (assessmentId && !Number.isNaN(assessmentId)) {

                    data = await vendorApi.getVendorQuestionnaire(
                        assessmentId
                    );

                } else {

                    toast.error("Invalid assessment");

                    navigate("/vendor/assessments");

                    return;
                }

                const questionnaire =
                    Array.isArray(data)
                        ? data
                        : data.questions ?? data.data?.questions ?? [];


                const assessment =
                    data.assessmentId ?? data.data?.assessmentId;

                if (token && assessment) {
                    setAssessmentId(assessment);
                }


                setQuestions(questionnaire);
                const status = data.status ?? data.data?.status;
                const reviewerComment = data.reviewerComment ?? data.data?.reviewerComment;

                if (status === "CORRECTION_REQUIRED") {
                    setCorrectionRequired(true);
                    setReviewerComment(reviewerComment || "");
                }
                const existingAnswers: Record<number, string> = {};

                questionnaire.forEach((q: any) => {
                    if (q.answer) {
                        existingAnswers[q.questionId] = q.answer;
                    }
                });

                setAnswers(existingAnswers);

            } catch (error) {

                console.error(error);

                toast.error("Unable to load questionnaire");

            } finally {

                setLoading(false);

            }
        };

        loadQuestions();

    }, [assessmentId, token, navigate]);



    const updateAnswer=(
        questionId:number,
        value:string
    )=>{

        setAnswers(prev=>({

            ...prev,

            [questionId]:value

        }));

    };

    const submitAssessment = async () => {

        if (assessmentId == null) {
            toast.error("Assessment cannot be submitted from this link.");
            return;
        }

        try {

            for (const [questionId, answer] of Object.entries(answers)) {

                await vendorApi.saveAnswer(
                    assessmentId,
                    Number(questionId),
                    answer
                );

            }

            await vendorApi.submitAssessment(assessmentId);

            toast.success("Assessment submitted");

            setLocked(true);

        } catch (error) {

            console.error(error);

            toast.error("Submission failed");

        }
    };


    const answered=
        questions.filter(
            (q:any)=>
                answers[q.questionId]!==undefined &&
                answers[q.questionId]!==""
        ).length;


    const progress=Math.round(
        (answered/Math.max(questions.length,1))*100
    );


    if(loading){

        return <div>Loading questionnaire...</div>;

    }
    return(

        <>

            <div className="mb-4">

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={()=>navigate("/vendor/assessments")}
                >

                    <ArrowLeft className="h-4 w-4"/>

                    Back

                </Button>

            </div>



            <PageHeader

                title="Security Assessment Questionnaire"
                description={
                    token
                        ? `Access Token: ${token}`
                        : `Assessment ID: ${assessmentId}`
                }

                actions={

                    locked ?

                        <Badge>

                            <Lock className="h-3 w-3 mr-1"/>

                            Submitted

                        </Badge>

                        :

                        <>

                            <Button

                                variant="outline"

                                onClick={()=>toast.success("Draft saved")}

                            >

                                <Save className="h-4 w-4"/>

                                Save Draft

                            </Button>



                            <Button

                                onClick={()=>setConfirmSubmit(true)}

                            >

                                <Send className="h-4 w-4"/>

                                Submit

                            </Button>

                        </>

                }

            />
            {
                correctionRequired && (

                    <Card className="mb-5 border-red-300">

                        <CardContent className="p-5">

                            <h3 className="font-semibold text-red-600">
                                Correction Required
                            </h3>


                            <p className="mt-2 text-sm">

                                {reviewerComment}

                            </p>


                            <p className="mt-3 text-xs text-muted-foreground">

                                Please update your answers and resubmit the assessment.

                            </p>


                        </CardContent>

                    </Card>

                )
            }


            <Card className="mb-5">

                <CardContent className="p-5">

                    <div className="flex justify-between">

<span>

Progress

</span>


                        <span>

{answered}/{questions.length}

</span>


                    </div>


                    <Progress

                        value={
                            locked
                                ?
                                100
                                :
                                progress
                        }

                        className="mt-3"

                    />


                </CardContent>

            </Card>





            <Card>

                <CardContent className="p-6 space-y-8">


                    {

                        questions.map(

                            (q:any,index:number)=>(


                                <div
                                    key={q.questionId}
                                    className={`space-y-3 border-b pb-6 ${
                                        q.reviewerDecision === "CORRECTION"
                                            ? "border-red-500 bg-red-50 rounded-lg p-4"
                                            : ""
                                    }`}
                                >

                                    <Label>
                                        {index + 1}. {q.questionText}

                                        {q.mandatory && (
                                            <span className="text-red-500">*</span>
                                        )}
                                    </Label>

                                    {q.reviewerDecision === "REJECTED" && (
                                        <Badge variant="destructive" className="ml-2">
                                            Correction Required
                                        </Badge>
                                    )}

                                    {q.reviewerDecision === "CORRECTION" && ((
                                        <div className="mt-2 rounded-md border border-red-300 bg-red-50 p-3">
                                            <p className="font-medium text-red-700">
                                                Reviewer Comment
                                            </p>

                                            <p className="text-sm text-red-600">
                                                {q.reviewerComment}
                                            </p>
                                        </div>
                                    )
                                    )}





                                    {

                                        q.questionType==="YESNO"

                                            ?

                                            <div className="flex gap-3">


                                                {

                                                    ["YES","NO"].map(

                                                        (option)=>(


                                                            <Button

                                                                key={option}


                                                                variant={

                                                                    answers[q.questionId]===option

                                                                        ?

                                                                        "default"

                                                                        :

                                                                        "outline"

                                                                }


                                                                disabled={locked}


                                                                onClick={()=>updateAnswer(

                                                                    q.questionId,

                                                                    option

                                                                )}

                                                            >

                                                                {option}

                                                            </Button>


                                                        )

                                                    )


                                                }


                                            </div>



                                            :


                                            q.questionType==="PARAGRAPH"

                                                ?


                                                <Textarea


                                                    disabled={locked}


                                                    value={
                                                        answers[q.questionId] ?? ""
                                                    }


                                                    onChange={

                                                        e=>

                                                            updateAnswer(

                                                                q.questionId,

                                                                e.target.value

                                                            )

                                                    }


                                                />



                                                :


                                                <Input


                                                    disabled={locked}


                                                    value={
                                                        answers[q.questionId] ?? ""
                                                    }


                                                    onChange={

                                                        e=>

                                                            updateAnswer(

                                                                q.questionId,

                                                                e.target.value

                                                            )

                                                    }


                                                />



                                    }



                                </div>


                            )

                        )


                    }



                </CardContent>

            </Card>
            <Dialog

                open={confirmSubmit}

                onOpenChange={setConfirmSubmit}

            >


                <DialogHeader>


                    <DialogTitle>

                        Submit Assessment?

                    </DialogTitle>



                    <DialogDescription>

                        After submission answers will be sent for review.

                    </DialogDescription>


                </DialogHeader>



                <DialogFooter>



                    <Button

                        variant="outline"

                        onClick={()=>setConfirmSubmit(false)}

                    >

                        Cancel

                    </Button>




                    <Button

                        onClick={()=>{

                            setConfirmSubmit(false);

                            submitAssessment();

                        }}

                    >


                        <Send className="h-4 w-4"/>

                        Submit

                    </Button>



                </DialogFooter>


            </Dialog>



        </>

    );

}