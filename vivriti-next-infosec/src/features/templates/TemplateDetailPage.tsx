import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Pencil,
    Copy,
    FileText,
    Layers,
    Send,
    FolderOpen,
    ShieldCheck,
    Hash,
    CheckCircle2,
    CalendarDays,
    Clock
} from "lucide-react";


import { PageHeader } from "@/components/common/page-header";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";


import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { EmptyState } from "@/components/ui/empty-state";

import { StatusBadge } from "@/components/common/status-badge";

import { toast } from "@/store/toast";

import { templateApi } from "@/features/templates/templateApi";



export function TemplateDetailPage() {


    const { id } = useParams();

    const navigate = useNavigate();


    const templateId = Number(id);



    const [template, setTemplate] = useState<any>(null);

    const [loading, setLoading] = useState(true);



    //=========================================
    // Load Template
    //=========================================


    useEffect(() => {


        if (!templateId || Number.isNaN(templateId)) {

            setLoading(false);

            toast.error("Invalid template id");

            return;

        }



        const loadTemplate = async () => {


            try {


                setLoading(true);



                const response =
                    await templateApi.getTemplate(templateId);



                console.log(
                    "Template Detail:",
                    response
                );



                setTemplate(response);



            } catch(error) {


                console.error(
                    "Template load error",
                    error
                );


                toast.error(
                    "Failed to load template"
                );


            } finally {


                setLoading(false);


            }


        };



        loadTemplate();



    }, [templateId]);





    //=========================================
    // Loading
    //=========================================


    if (loading) {


        return (

            <div className="flex h-[70vh] items-center justify-center">


                <div className="text-center">


                    <FileText
                        className="
                            mx-auto
                            mb-3
                            h-12
                            w-12
                            animate-pulse
                            text-primary
                        "
                    />


                    <p className="text-muted-foreground">

                        Loading template...

                    </p>


                </div>


            </div>

        );


    }




    //=========================================
    // Not Found
    //=========================================


    if (!template) {


        return (

            <EmptyState

                icon={FileText}

                title="Template not found"

                description="Unable to find this template"

            />

        );


    }





    //=========================================
    // Statistics
    //=========================================



    const totalTopics =
        template.topics?.length ?? 0;



    const totalQuestions =

        template.topics?.reduce(

            (
                total:number,
                topic:any
            ) =>

                total +
                (
                    topic.questions?.length ?? 0
                ),

            0

        ) ?? 0;





    const mandatoryQuestions =

        template.topics?.reduce(

            (
                total:number,
                topic:any
            ) =>

                total +

                (
                    topic.questions?.filter(
                        (q:any)=>
                            q.mandatory
                    ).length ?? 0
                ),

            0

        ) ?? 0;


    return (

        <>

            <PageHeader


                title={template.name}


                description={
                    template.description ||
                    "Assessment Template"
                }



                breadcrumbs={[

                    {
                        label:"Templates",
                        to:"/templates"
                    },

                    {
                        label:template.name
                    }

                ]}



                actions={

                    <div className="flex gap-2">


                        <Button

                            variant="outline"

                            onClick={() =>
                                toast.success(
                                    "Template cloned"
                                )
                            }

                        >

                            <Copy
                                className="
                                    mr-2
                                    h-4
                                    w-4
                                "
                            />

                            Clone

                        </Button>




                        <Button

                            variant="outline"

                            onClick={() =>
                                navigate(
                                    `/templates/builder/${template.id}`
                                )
                            }

                        >

                            <Pencil
                                className="
                                    mr-2
                                    h-4
                                    w-4
                                "
                            />

                            Edit

                        </Button>




                        <Button

                            onClick={() =>
                                navigate(
                                    "/assessments/new"
                                )
                            }

                        >

                            <Send
                                className="
                                    mr-2
                                    h-4
                                    w-4
                                "
                            />

                            Use in Assessment

                        </Button>



                    </div>

                }


            />





            {/* ===========================
                Summary Cards
            ============================ */}


            <div
                className="
                    mb-6
                    grid
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-4
                "
            >



                {/* Topics */}

                <Card
                    className="
                        border-0
                        bg-gradient-to-r
                        from-blue-600
                        to-cyan-500
                        text-white
                        shadow-lg
                    "
                >

                    <CardContent className="p-5">


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >


                            <div>


                                <p className="text-sm opacity-80">

                                    Total Topics

                                </p>


                                <h2
                                    className="
                                        mt-2
                                        text-3xl
                                        font-bold
                                    "
                                >

                                    {totalTopics}

                                </h2>


                            </div>



                            <Layers
                                className="
                                    h-10
                                    w-10
                                    opacity-80
                                "
                            />


                        </div>


                    </CardContent>


                </Card>





                {/* Questions */}


                <Card

                    className="
                        border-0
                        bg-gradient-to-r
                        from-emerald-500
                        to-green-600
                        text-white
                        shadow-lg
                    "

                >

                    <CardContent className="p-5">


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >


                            <div>


                                <p className="text-sm opacity-80">

                                    Total Questions

                                </p>



                                <h2
                                    className="
                                        mt-2
                                        text-3xl
                                        font-bold
                                    "
                                >

                                    {totalQuestions}

                                </h2>


                            </div>



                            <FileText
                                className="
                                    h-10
                                    w-10
                                    opacity-80
                                "
                            />


                        </div>


                    </CardContent>


                </Card>





                {/* Mandatory */}


                <Card

                    className="
                        border-0
                        bg-gradient-to-r
                        from-orange-500
                        to-red-500
                        text-white
                        shadow-lg
                    "

                >

                    <CardContent className="p-5">


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >


                            <div>


                                <p className="text-sm opacity-80">

                                    Mandatory Questions

                                </p>



                                <h2
                                    className="
                                        mt-2
                                        text-3xl
                                        font-bold
                                    "
                                >

                                    {mandatoryQuestions}

                                </h2>


                            </div>



                            <ShieldCheck
                                className="
                                    h-10
                                    w-10
                                    opacity-80
                                "
                            />


                        </div>


                    </CardContent>


                </Card>





                {/* Version */}


                <Card

                    className="
                        border-0
                        bg-gradient-to-r
                        from-violet-600
                        to-fuchsia-500
                        text-white
                        shadow-lg
                    "

                >

                    <CardContent className="p-5">


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >


                            <div>


                                <p className="text-sm opacity-80">

                                    Version

                                </p>



                                <h2
                                    className="
                                        mt-2
                                        text-3xl
                                        font-bold
                                    "
                                >

                                    v{template.version ?? 1}

                                </h2>


                            </div>



                            <Hash
                                className="
                                    h-10
                                    w-10
                                    opacity-80
                                "
                            />


                        </div>


                    </CardContent>


                </Card>


            </div>
            {/* ===========================
                Template Information
            ============================ */}


            <Card className="mb-6 border-0 shadow-md">


                <CardHeader>


                    <CardTitle
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <FileText
                            className="
                                h-5
                                w-5
                                text-primary
                            "
                        />

                        Template Details


                    </CardTitle>


                </CardHeader>




                <CardContent>


                    <div
                        className="
                            grid
                            gap-6
                            md:grid-cols-2
                        "
                    >



                        <div>


                            <p
                                className="
                                    mb-1
                                    text-xs
                                    uppercase
                                    text-muted-foreground
                                "
                            >

                                Template Name

                            </p>


                            <h3 className="text-xl font-semibold">

                                {template.name}

                            </h3>


                        </div>





                        <div>


                            <p
                                className="
                                    mb-1
                                    text-xs
                                    uppercase
                                    text-muted-foreground
                                "
                            >

                                Category

                            </p>


                            <Badge variant="secondary">

                                {template.category || "General"}

                            </Badge>


                        </div>






                        <div>


                            <p
                                className="
                                    mb-1
                                    text-xs
                                    uppercase
                                    text-muted-foreground
                                "
                            >

                                Status

                            </p>


                            <StatusBadge

                                status={
                                    template.status
                                }

                            />


                        </div>





                        <div>


                            <p
                                className="
                                    mb-1
                                    text-xs
                                    uppercase
                                    text-muted-foreground
                                "
                            >

                                Usage Count

                            </p>



                            <div className="flex items-center gap-2">


                                <CheckCircle2
                                    className="
                                        h-4
                                        w-4
                                        text-green-600
                                    "
                                />


                                {template.usageCount ?? 0}


                            </div>


                        </div>





                        <div>


                            <p
                                className="
                                    mb-1
                                    text-xs
                                    uppercase
                                    text-muted-foreground
                                "
                            >

                                Created

                            </p>


                            <div className="flex items-center gap-2">


                                <CalendarDays
                                    className="
                                        h-4
                                        w-4
                                        text-blue-600
                                    "
                                />


                                {template.createdAt || "-"}


                            </div>


                        </div>





                        <div>


                            <p
                                className="
                                    mb-1
                                    text-xs
                                    uppercase
                                    text-muted-foreground
                                "
                            >

                                Updated

                            </p>


                            <div className="flex items-center gap-2">


                                <Clock
                                    className="
                                        h-4
                                        w-4
                                        text-orange-600
                                    "
                                />


                                {template.updatedAt || "-"}


                            </div>


                        </div>



                    </div>


                </CardContent>


            </Card>





            {/* ===========================
                Topics & Questions
            ============================ */}


            <div className="space-y-6">



                {
                    template.topics?.map(

                        (
                            topic:any,
                            topicIndex:number
                        ) => (



                            <Card

                                key={
                                    topic.id ??
                                    topicIndex
                                }

                                className="
                                    overflow-hidden
                                    border-0
                                    shadow-lg
                                "

                            >



                                {/* Topic Header */}


                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        bg-gradient-to-r
                                        from-slate-50
                                        to-blue-50
                                        px-6
                                        py-4
                                    "
                                >


                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >


                                        <div
                                            className="
                                                rounded-lg
                                                bg-blue-600
                                                p-2
                                                text-white
                                            "
                                        >

                                            <FolderOpen
                                                className="
                                                    h-5
                                                    w-5
                                                "
                                            />

                                        </div>




                                        <div>


                                            <h3
                                                className="
                                                    text-lg
                                                    font-semibold
                                                "
                                            >

                                                {
                                                    topic.topicName
                                                }

                                            </h3>


                                            <p
                                                className="
                                                    text-sm
                                                    text-muted-foreground
                                                "
                                            >

                                                Topic {topicIndex + 1}

                                            </p>


                                        </div>


                                    </div>





                                    <Badge variant="secondary">


                                        {
                                            topic.questions?.length ?? 0
                                        }

                                        {" "}
                                        Questions


                                    </Badge>



                                </div>
                                <CardContent
                                    className="
                                        space-y-4
                                        p-6
                                    "
                                >


                                    {
                                        topic.questions?.length === 0 ? (


                                            <div
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-dashed
                                                    p-6
                                                    text-center
                                                    text-muted-foreground
                                                "
                                            >

                                                No questions available.

                                            </div>


                                        ) : (


                                            topic.questions?.map(

                                                (
                                                    question:any,
                                                    questionIndex:number
                                                ) => (


                                                    <div

                                                        key={
                                                            question.id ??
                                                            questionIndex
                                                        }

                                                        className="
                                                            rounded-xl
                                                            border
                                                            bg-white
                                                            p-5
                                                            shadow-sm
                                                            transition
                                                            hover:shadow-md
                                                        "

                                                    >



                                                        <div
                                                            className="
                                                                flex
                                                                gap-4
                                                            "
                                                        >



                                                            {/* Question Number */}


                                                            <div

                                                                className="
                                                                    flex
                                                                    h-10
                                                                    w-10
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-blue-100
                                                                    font-bold
                                                                    text-blue-700
                                                                "

                                                            >

                                                                {
                                                                    questionIndex + 1
                                                                }

                                                            </div>






                                                            <div className="flex-1">



                                                                <div
                                                                    className="
                                                                        flex
                                                                        items-start
                                                                        gap-2
                                                                    "
                                                                >


                                                                    <FileText

                                                                        className="
                                                                            mt-1
                                                                            h-4
                                                                            w-4
                                                                            text-blue-600
                                                                        "

                                                                    />



                                                                    <h4
                                                                        className="
                                                                            font-semibold
                                                                        "
                                                                    >

                                                                        {
                                                                            question.questionText
                                                                        }


                                                                    </h4>


                                                                </div>







                                                                {
                                                                    question.helpText && (


                                                                        <p
                                                                            className="
                                                                                mt-2
                                                                                text-sm
                                                                                text-muted-foreground
                                                                            "
                                                                        >

                                                                            {
                                                                                question.helpText
                                                                            }

                                                                        </p>


                                                                    )
                                                                }







                                                                <div
                                                                    className="
                                                                        mt-4
                                                                        flex
                                                                        flex-wrap
                                                                        gap-2
                                                                    "
                                                                >




                                                                    <Badge
                                                                        variant="outline"
                                                                    >

                                                                        Code:
                                                                        {" "}
                                                                        {
                                                                            question.code
                                                                        }

                                                                    </Badge>






                                                                    <Badge
                                                                        variant="outline"
                                                                    >

                                                                        {
                                                                            question.questionType
                                                                        }

                                                                    </Badge>






                                                                    <Badge
                                                                        variant="outline"
                                                                    >

                                                                        Weight:
                                                                        {" "}
                                                                        {
                                                                            question.weight ?? 0
                                                                        }

                                                                    </Badge>







                                                                    {
                                                                        question.mandatory && (


                                                                            <Badge>


                                                                                Mandatory


                                                                            </Badge>


                                                                        )
                                                                    }






                                                                    <StatusBadge

                                                                        status={
                                                                            question.status
                                                                        }

                                                                    />





                                                                </div>



                                                            </div>



                                                        </div>



                                                    </div>



                                                )


                                            )


                                        )


                                    }




                                </CardContent>



                            </Card>



                        )


                    )


                }



            </div>



        </>

    );


}