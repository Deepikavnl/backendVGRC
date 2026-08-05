import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { templateApi } from "@/features/templates/templateApi";

import {
    ArrowLeft,
    FolderOpen,
    FileText
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


export function TemplateViewPage(){

    const {id}=useParams();

    const navigate=useNavigate();


    const [template,setTemplate]=useState<any>(null);



    useEffect(()=>{


        if(!id)
            return;


        templateApi
            .getTemplate(Number(id))

            .then((res:any)=>{

                console.log(
                    "Template View:",
                    res
                );


                setTemplate(
                    res.data ?? res
                );


            })

            .catch(err=>{

                console.error(err);

            });



    },[id]);



    if(!template){

        return (

            <div className="p-5">

                Loading Template...

            </div>

        );

    }



    return (

        <>


            <PageHeader

                title={template.name}

                description={template.description}

                breadcrumbs={[
                    {
                        label:"Templates"
                    },
                    {
                        label:"View"
                    }
                ]}


                actions={

                    <Button

                        variant="outline"

                        onClick={()=>navigate("/templates")}

                    >

                        <ArrowLeft className="h-4 w-4 mr-2"/>

                        Back

                    </Button>

                }


            />



            <div className="space-y-6">


                {

                    template.topics?.map((topic:any)=>(


                        <Card key={topic.topicId}>


                            <CardHeader>


                                <CardTitle className="flex gap-2 items-center">


                                    <FolderOpen className="h-5 w-5"/>


                                    {topic.topicName}


                                </CardTitle>


                            </CardHeader>



                            <CardContent className="space-y-3">


                                {

                                    topic.questions?.length === 0 ?

                                        (

                                            <p className="text-muted-foreground">

                                                No Questions

                                            </p>

                                        )

                                        :

                                        topic.questions.map((q:any)=>(


                                            <div

                                                key={q.id}

                                                className="border rounded-md p-4 flex justify-between"

                                            >


                                                <div>


                                                    <div className="flex gap-2">


                                                        <FileText className="h-4 w-4"/>


                                                        <span>

                                        {q.questionText}

                                    </span>


                                                    </div>



                                                    <p className="text-sm text-muted-foreground mt-2">

                                                        Type : {q.questionType}

                                                    </p>


                                                </div>



                                                {

                                                    q.mandatory &&

                                                    <Badge>

                                                        Mandatory

                                                    </Badge>

                                                }


                                            </div>


                                        ))

                                }


                            </CardContent>



                        </Card>


                    ))

                }


            </div>


        </>

    );

}