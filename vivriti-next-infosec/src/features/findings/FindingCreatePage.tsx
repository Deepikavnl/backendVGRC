import { useEffect, useState } from "react";
import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import { PageHeader } from "@/components/common/page-header";

import * as findingApi from "./findingApi";

import { toast } from "@/store/toast";



export function FindingCreatePage(){


    const navigate = useNavigate();

    const [searchParams] = useSearchParams();



    const [form,setForm] = useState({

        assessmentId:"",

        entityId:"",

        entityName:"",

        templateName:"",

        questionId:"",

        question:"",

        topic:"",

        severity:"HIGH",

        owner:"",

        recommendation:"",

        description:"",

        dueDate:""

    });



    useEffect(()=>{


        setForm({

            assessmentId:
                searchParams.get("assessmentId") || "",


            entityId:
                searchParams.get("entityId") || "",


            entityName:
                searchParams.get("entityName") || "",


            templateName:
                searchParams.get("templateName") || "",


            questionId:
                searchParams.get("questionId") || "",


            question:
                searchParams.get("question") || "",


            topic:
                searchParams.get("topic") || "",


            severity:"HIGH",


            owner:"",


            recommendation:"",


            description:"",


            dueDate:""

        });


    },[]);





    const handleChange = (
        key:string,
        value:string
    )=>{

        setForm(prev=>({

            ...prev,

            [key]:value

        }));

    };





    const handleSubmit = async()=>{


        try{


            await findingApi.createFinding({

                assessmentId:
                    Number(form.assessmentId),


                questionId:
                    Number(form.questionId),


                title:
                form.question,


                description:
                form.description,


                severity:
                form.severity,


                owner:
                form.owner,


                recommendation:
                form.recommendation,


                topic:
                form.topic,


                dueDate:
                    form.dueDate || null


            });



            toast.success(
                "Finding created successfully"
            );


            navigate("/findings");


        }
        catch(error){


            console.error(error);


            toast.error(
                "Failed to create finding"
            );

        }


    };





    return (

        <>


            <PageHeader

                title="Create Finding"

                description="Create finding from assessment"

                actions={

                    <Button

                        variant="outline"

                        onClick={()=>navigate("/findings")}

                    >

                        <ArrowLeft className="mr-2 h-4 w-4"/>

                        Back

                    </Button>

                }

            />



            <Card className="max-w-3xl p-6 space-y-5">



                <div>

                    <Label>Entity Name</Label>

                    <Input

                        value={form.entityName}

                        disabled

                    />

                </div>




                <div>

                    <Label>Entity ID</Label>

                    <Input

                        value={form.entityId}

                        disabled

                    />

                </div>




                <div>

                    <Label>Assessment ID</Label>

                    <Input

                        value={form.assessmentId}

                        disabled

                    />

                </div>




                <div>

                    <Label>Template</Label>

                    <Input

                        value={form.templateName}

                        disabled

                    />

                </div>




                <div>

                    <Label>Question</Label>

                    <Textarea

                        value={form.question}

                        disabled

                        rows={4}

                    />

                </div>




                <div>

                    <Label>Topic</Label>

                    <Input

                        value={form.topic}

                        disabled

                    />

                </div>




                <div>

                    <Label>Finding Description</Label>

                    <Textarea

                        value={form.description}

                        onChange={(e)=>

                            handleChange(
                                "description",
                                e.target.value
                            )

                        }

                    />

                </div>




                <div>

                    <Label>Severity</Label>


                    <Select

                        value={form.severity}

                        onValueChange={(v)=>

                            handleChange(
                                "severity",
                                v
                            )

                        }

                        options={[

                            {
                                label:"Critical",
                                value:"CRITICAL"
                            },

                            {
                                label:"High",
                                value:"HIGH"
                            },

                            {
                                label:"Medium",
                                value:"MEDIUM"
                            },

                            {
                                label:"Low",
                                value:"LOW"
                            }

                        ]}

                    />

                </div>




                <div>

                    <Label>Assign Risk Team</Label>

                    <Select
                        value={form.owner}
                        onValueChange={(value) =>
                            handleChange("owner", value)
                        }
                        options={[
                            {
                                label: "Risk Team",
                                value: "RISK_TEAM",
                            },
                        ]}
                    />

                </div>




                <div>

                    <Label>Recommendation</Label>

                    <Textarea

                        value={form.recommendation}

                        onChange={(e)=>

                            handleChange(
                                "recommendation",
                                e.target.value
                            )

                        }

                    />

                </div>




                <div>

                    <Label>Due Date (Optional)</Label>

                    <Input

                        type="date"

                        value={form.dueDate}

                        onChange={(e)=>

                            handleChange(
                                "dueDate",
                                e.target.value
                            )

                        }

                    />

                </div>




                <Button

                    onClick={handleSubmit}

                >

                    Create Finding

                </Button>


            </Card>


        </>

    );


}