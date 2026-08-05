import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import assessmentApi, {
    Assessment
} from "./assessment";


import {
    PageHeader
} from "@/components/common/page-header";


import {
    Card,
    CardContent
} from "@/components/ui/card";


import {
    Button
} from "@/components/ui/button";


import {
    Input
} from "@/components/ui/input";


import {
    Badge
} from "@/components/ui/badge";


import {
    Plus,
    Search,
    Eye,
    Trash2
} from "lucide-react";




export function AssessmentPage(){


    const navigate = useNavigate();



    const [assessments,setAssessments]
        = useState<Assessment[]>([]);



    const [loading,setLoading]
        = useState<boolean>(true);



    const [search,setSearch]
        = useState<string>("");






    const loadAssessments = async()=>{


        try{


            const data =
                await assessmentApi.getAllAssessments();



            setAssessments(
                Array.isArray(data)
                    ? data
                    : []
            );


        }
        catch(error){


            console.error(
                "Assessment loading failed",
                error
            );


            setAssessments([]);


        }
        finally{


            setLoading(false);


        }


    };






    useEffect(()=>{


        const load = async()=>{

            await loadAssessments();

        };


        load();


    },[]);







    const filteredAssessments = useMemo<Assessment[]>(()=>{


        return assessments.filter(
            (assessment: Assessment)=>{


                const text =
                    `${assessment.code ?? ""}
${assessment.entityName ?? ""}
${assessment.templateName ?? ""}
${assessment.status ?? ""}`.toLowerCase();



                return text.includes(
                    search.toLowerCase()
                );



            });


    },[
        assessments,
        search
    ]);








    const deleteAssessment = async(
        id:number
    )=>{


        try{


            await assessmentApi.deleteAssessment(
                id
            );


            await loadAssessments();



        }
        catch(error){


            console.error(
                "Delete failed",
                error
            );


        }


    };








    return (

        <div className="space-y-6">


            <PageHeader

                title="Assessments"

                description="Manage third party security assessments"


                actions={

                    <Button

                        onClick={()=>{

                            navigate(
                                "/assessments/new"
                            );

                        }}

                    >

                        <Plus className="mr-2 h-4 w-4"/>

                        New Assessment


                    </Button>

                }

            />









            <Card>


                <CardContent className="p-6">



                    <div className="mb-5 flex gap-3">


                        <div className="relative flex-1">


                            <Search

                                className="absolute left-3 top-3 h-4 w-4"

                            />



                            <Input


                                className="pl-9"


                                placeholder="Search assessments..."


                                value={search}


                                onChange={(event)=>{

                                    setSearch(
                                        event.target.value
                                    );

                                }}

                            />


                        </div>


                    </div>









                    {
                        loading ?


                            (

                                <p>
                                    Loading assessments...
                                </p>

                            )


                            :


                            filteredAssessments.length === 0 ?


                                (

                                    <p>
                                        No assessments found
                                    </p>

                                )


                                :


                                (

                                    <div className="space-y-4">



                                        {
                                            filteredAssessments.map(
                                                (assessment)=>(


                                                    <div

                                                        key={
                                                            assessment.id
                                                        }

                                                        className="rounded-lg border p-4"

                                                    >



                                                        <div className="flex justify-between">


                                                            <div>


                                                                <h3 className="font-semibold">

                                                                    {
                                                                        assessment.code
                                                                    }

                                                                </h3>


                                                                <p className="text-sm">

                                                                    {
                                                                        assessment.entityName
                                                                    }

                                                                </p>


                                                            </div>



                                                            <Badge>

                                                                {
                                                                    assessment.status
                                                                }

                                                            </Badge>


                                                        </div>









                                                        <div className="mt-4 grid gap-4 md:grid-cols-4">


                                                            <div>

                                                                <p className="text-xs">

                                                                    Template

                                                                </p>


                                                                <p>

                                                                    {
                                                                        assessment.templateName
                                                                    }

                                                                </p>


                                                            </div>






                                                            <div>

                                                                <p className="text-xs">

                                                                    Reviewer

                                                                </p>


                                                                <p>

                                                                    {
                                                                        assessment.reviewerName
                                                                    }

                                                                </p>


                                                            </div>






                                                            <div>

                                                                <p className="text-xs">

                                                                    Progress

                                                                </p>


                                                                <p>

                                                                    {
                                                                        assessment.progress
                                                                    }%

                                                                </p>


                                                            </div>







                                                            <div>

                                                                <p className="text-xs">

                                                                    Due Date

                                                                </p>


                                                                <p>

                                                                    {
                                                                        assessment.dueDate
                                                                    }

                                                                </p>


                                                            </div>


                                                        </div>









                                                        <div className="mt-4 flex gap-3">


                                                            <Button

                                                                onClick={()=>{

                                                                    navigate(
                                                                        `/assessments/${assessment.id}`
                                                                    );

                                                                }}

                                                            >

                                                                <Eye className="mr-2 h-4 w-4"/>

                                                                View


                                                            </Button>






                                                            <Button


                                                                onClick={()=>{

                                                                    deleteAssessment(
                                                                        assessment.id
                                                                    );

                                                                }}

                                                            >

                                                                <Trash2 className="mr-2 h-4 w-4"/>

                                                                Delete


                                                            </Button>



                                                        </div>





                                                    </div>


                                                ))

                                        }



                                    </div>

                                )

                    }




                </CardContent>


            </Card>


        </div>

    );


}