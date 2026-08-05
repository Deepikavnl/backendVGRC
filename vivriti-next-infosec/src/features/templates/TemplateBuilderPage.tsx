import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getTopics } from "@/features/topics/api";

import {
    ArrowLeft,
    Save,
    Send,
    Layers,
    FolderOpen,
    Trash2
} from "lucide-react";

import { templateApi } from "@/features/templates/templateApi";
import { toast } from "@/store/toast";

import { PageHeader } from "@/components/common/page-header";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";


export function TemplateBuilderPage() {


    const navigate = useNavigate();


    const { id } = useParams();

    useEffect(() => {

        if (!id) {
            return;
        }


        const loadTemplate = async () => {

            try {

                const data = await templateApi.getTemplate(Number(id));


                console.log(
                    "Loaded template:",
                    data
                );


                setTemplate({

                    name: data.name ?? "",

                    description: data.description ?? "",

                    category: data.category ?? "Cyber Security"

                });


                setSelectedTopics(
                    data.topics?.map((t:any)=>({

                        id:t.topicId,

                        name:t.topicName

                    })) ?? []
                );


            } catch(error) {


                console.error(
                    "Template loading failed",
                    error
                );


                toast.error(
                    "Template not found"
                );


            }

        };


        loadTemplate();


    },[id]);
    const [template,setTemplate] = useState({

        name:"",

        description:"",

        category:"Cyber Security"

    });



    // All topics from backend
    const [topics,setTopics] = useState<any[]>([]);



    // Selected topics for template
    const [selectedTopics,setSelectedTopics] = useState<any[]>([]);



    useEffect(()=>{


        getTopics()

            .then((res:any)=>{


                console.log(
                    "Topics Response:",
                    res.data
                );


                setTopics(
                    res.data.data ?? res.data
                );


            })

            .catch((err:any)=>{


                console.error(
                    "Topic loading failed",
                    err
                );


            });


    },[]);




    const addTopic = (topic:any)=>{


        setSelectedTopics(prev=>


            prev.some(
                t=>t.id === topic.id
            )


                ?

                prev


                :

                [
                    ...prev,
                    topic
                ]


        );


    };




    const removeTopic = (id:number)=>{


        setSelectedTopics(prev=>

            prev.filter(
                topic=>topic.id !== id
            )

        );


    };





    const saveTemplate = async(status:string)=>{


        const payload = {


            name: template.name,


            description: template.description,


            category: template.category,


            status: status,



            topics:

                selectedTopics.map(topic=>({


                    topicId: topic.id


                }))


        };



        console.log(
            "Template Payload:",
            payload
        );



        try{


            await templateApi.createTemplate(payload);



            toast.success(

                status === "PUBLISHED"

                    ?

                    "Template published successfully"

                    :

                    "Template saved successfully"

            );



            navigate("/templates");



        }

        catch(error){


            console.error(
                "Template save error",
                error
            );


            toast.error(
                "Failed to save template"
            );


        }


    };
    return (

        <>

            <PageHeader

                title="Create Assessment Template"

                description="Build reusable questionnaires using Topics."

                breadcrumbs={[
                    {
                        label:"Templates"
                    },
                    {
                        label:"Builder"
                    }
                ]}


                actions={

                    <div className="flex gap-2">


                        <Button

                            variant="outline"

                            onClick={() =>
                                navigate("/templates")
                            }

                        >

                            <ArrowLeft className="h-4 w-4 mr-2"/>

                            Back

                        </Button>



                        <Button

                            onClick={() =>
                                saveTemplate("DRAFT")
                            }

                        >

                            <Save className="h-4 w-4 mr-2"/>

                            Save Draft

                        </Button>




                        <Button

                            onClick={() =>
                                saveTemplate("PUBLISHED")
                            }

                        >

                            <Send className="h-4 w-4 mr-2"/>

                            Publish

                        </Button>


                    </div>

                }


            />




            <div className="grid gap-6 lg:grid-cols-3">



                {/* LEFT SIDE */}

                <div className="lg:col-span-2 space-y-6">



                    <Card>


                        <CardHeader>

                            <CardTitle>

                                Template Information

                            </CardTitle>

                        </CardHeader>



                        <CardContent className="space-y-4">


                            <Input

                                placeholder="Template Name"

                                value={template.name}

                                onChange={(e)=>

                                    setTemplate({

                                        ...template,

                                        name:e.target.value

                                    })

                                }

                            />



                            <Textarea

                                placeholder="Description"

                                value={template.description}

                                onChange={(e)=>

                                    setTemplate({

                                        ...template,

                                        description:e.target.value

                                    })

                                }

                            />



                            <Badge>

                                {template.category}

                            </Badge>


                        </CardContent>


                    </Card>






                    <Card>


                        <CardHeader>


                            <CardTitle className="flex gap-2 items-center">


                                <Layers className="h-5 w-5"/>


                                Selected Topics


                            </CardTitle>


                        </CardHeader>



                        <CardContent className="space-y-3">


                            {


                                selectedTopics.length === 0 ?


                                    (

                                        <div className="text-sm text-muted-foreground">

                                            No topics selected

                                        </div>

                                    )


                                    :


                                    selectedTopics.map((topic:any)=>(


                                        <div

                                            key={topic.id}

                                            className="border rounded-md p-3 flex justify-between items-center"

                                        >


                                            <div className="flex gap-2 items-center">


                                                <FolderOpen className="h-4 w-4"/>


                                                {topic.name}


                                            </div>



                                            <Button

                                                variant="ghost"

                                                size="icon"

                                                onClick={() =>
                                                    removeTopic(topic.id)
                                                }

                                            >

                                                <Trash2 className="h-4 w-4"/>


                                            </Button>



                                        </div>


                                    ))

                            }



                        </CardContent>


                    </Card>



                </div>







                {/* RIGHT SIDE */}



                <div className="space-y-6">



                    <Card>


                        <CardHeader>

                            <CardTitle>

                                Template Summary

                            </CardTitle>


                        </CardHeader>



                        <CardContent className="space-y-4">



                            <div className="flex justify-between">

                                <span>

                                    Topics

                                </span>


                                <b>

                                    {selectedTopics.length}

                                </b>


                            </div>




                            <div className="flex justify-between">


                                <span>

                                    Status

                                </span>


                                <Badge>

                                    Draft

                                </Badge>


                            </div>



                        </CardContent>


                    </Card>







                    <Card>


                        <CardHeader>


                            <CardTitle>

                                Topic Bank

                            </CardTitle>


                        </CardHeader>




                        <CardContent className="space-y-3">


                            {


                                topics.map((topic:any)=>(



                                    <Card


                                        key={topic.id}


                                        className="cursor-pointer hover:shadow-md"



                                        onClick={() =>
                                            addTopic(topic)
                                        }


                                    >


                                        <CardContent className="p-3">


                                            <div className="font-medium">


                                                {topic.name}


                                            </div>



                                            <div className="flex gap-2 mt-2">


                                                <Badge>


                                                    {topic.status}


                                                </Badge>



                                                <Badge variant="outline">


                                                    Topic ID: {topic.id}


                                                </Badge>



                                            </div>



                                        </CardContent>



                                    </Card>



                                ))



                            }



                        </CardContent>


                    </Card>



                </div>




            </div>



        </>

    );

}