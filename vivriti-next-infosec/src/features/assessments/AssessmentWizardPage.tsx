import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { templateApi } from "@/features/templates/templateApi";
import { entityApi } from "@/api/entityApi";
import assessmentApi, {
    AssessmentRequest,
    Assessment
} from "./assessment";

import { reviewerApi} from "@/features/reviewer/reviewerApi";

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
    Label
} from "@/components/ui/label";





import {
    ArrowLeft,
    Save,
    CheckCircle,
    Copy
} from "lucide-react";


import {
    toast
} from "@/store/toast";






export function AssessmentWizardPage(){



    const navigate =
        useNavigate();

    const [templates, setTemplates] = useState<any[]>([]);

    useEffect(()=>{

        const loadTemplates = async()=>{

            const data = await templateApi.getTemplates();

            setTemplates(data);

        };


        loadTemplates();

    },[]);
    const [form,setForm]
        = useState<AssessmentRequest>({

        code:"",

        entityId:0,

        templateName:"",

        reviewerName:"",

        status:"DRAFT",

        progress:0,

        dueDate:""

    });






    const [created,setCreated]
        = useState<Assessment | null>(
        null
    );



    const [loading,setLoading]
        = useState(false);

    const [entities,setEntities] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [reviewers, setReviewers] = useState<any[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<number>(0);
    useEffect(() => {

        const loadTeams = async () => {

            try {

                const data = await reviewerApi.getTeams();

                setTeams(data);

            } catch (error) {

                console.error(error);

            }

        };

        loadTeams();

    }, []);
    useEffect(() => {

        if (!selectedTeam) {

            setReviewers([]);

            return;

        }

        const loadReviewers = async () => {

            try {

                const data =
                    await reviewerApi.getReviewers(selectedTeam);

                setReviewers(data);

            } catch (error) {

                console.error(error);

            }

        };

        loadReviewers();

    }, [selectedTeam]);
    useEffect(()=>{

        const loadEntities = async()=>{

            try {

                const data = await entityApi.getEntities();

                setEntities(data.data || data);
            } catch(error){

                console.error(error);

            }

        };


        loadEntities();

    },[]);




    const changeValue = (
        field:keyof AssessmentRequest,
        value:any
    )=>{


        setForm({

            ...form,

            [field]:value

        });


    };









    const submit = async()=>{


        try{


            setLoading(true);



            const response =
                await assessmentApi
                    .createAssessment(
                        form
                    );



            setCreated(response);



            toast.success(
                "Assessment created successfully"
            );


        }
        catch(error){


            console.error(
                error
            );


            toast.error(
                "Assessment creation failed"
            );


        }
        finally{


            setLoading(false);


        }


    };









    if(created){


        return (

            <div className="space-y-6">


                <PageHeader

                    title="Assessment Created"

                    description="Vendor assessment generated"

                />





                <Card>


                    <CardContent className="p-6 space-y-5">



                        <div className="flex items-center gap-3 text-green-600">


                            <CheckCircle/>


                            <h2 className="text-xl font-semibold">

                                Successfully Created

                            </h2>


                        </div>







                        <div>


                            <Label>

                                Vendor Link

                            </Label>



                            <div className="flex gap-2 mt-2">


                                <Input

                                    readOnly

                                    value={
                                        created.assessmentLink ??
                                        ""
                                    }

                                />



                                <Button

                                    variant="outline"

                                    onClick={()=>{


                                        navigator.clipboard
                                            .writeText(
                                                created.assessmentLink ?? ""
                                            );


                                        toast.success(
                                            "Copied"
                                        );


                                    }}

                                >

                                    <Copy/>

                                </Button>



                            </div>



                        </div>







                        <Button

                            onClick={()=>
                                navigate(
                                    "/assessments"
                                )
                            }

                        >

                            View Assessments


                        </Button>




                    </CardContent>


                </Card>


            </div>

        );


    }









    return (

        <div className="space-y-6">



            <PageHeader

                title="Create Assessment"

                description="Create third party security assessment"

            />








            <Card>


                <CardContent className="p-6 space-y-5">







                    <div>


                        <Label>
                            Assessment Code
                        </Label>



                        <Input

                            placeholder="ASSESS-001"

                            value={
                                form.code
                            }


                            onChange={
                                e=>
                                    changeValue(
                                        "code",
                                        e.target.value
                                    )
                            }


                        />


                    </div>









                    <div>


                        <Label>
                            Entity ID
                        </Label>


                        <select

                            value={form.entityId || ""}

                            onChange={(e)=>
                                setForm({
                                    ...form,
                                    entityId:Number(e.target.value)
                                })
                            }

                        >

                            <option value="">
                                Select Entity
                            </option>


                            {
                                entities.map(entity=>(

                                    <option
                                        key={entity.id}
                                        value={entity.id}
                                    >

                                        {entity.name}

                                    </option>

                                ))
                            }

                        </select>


                    </div>









                    <div>


                        <Label>
                            Template Name
                        </Label>



                        <select
                            value={form.templateName}
                            onChange={
                                e =>
                                    changeValue(
                                        "templateName",
                                        e.target.value
                                    )
                            }
                            className="border rounded-md p-2 w-full"
                        >

                            <option value="">
                                Select Template
                            </option>


                            {
                                templates.map((template)=>(
                                    <option
                                        key={template.id}
                                        value={template.name}
                                    >
                                        {template.name}
                                    </option>
                                ))
                            }


                        </select>


                    </div>












                        <div>

                            <Label>Team</Label>

                            <select
                                className="border rounded-md p-2 w-full"
                                value={selectedTeam}
                                onChange={(e) => {

                                    const teamId = Number(e.target.value);

                                    setSelectedTeam(teamId);

                                    changeValue("reviewerName", "");

                                }}
                            >

                                <option value={0}>
                                    Select Team
                                </option>

                                {teams.map((team:any) => (

                                    <option
                                        key={team.id}
                                        value={team.id}
                                    >

                                        {team.name}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <div>

                            <Label>Reviewer</Label>

                            <select
                                className="border rounded-md p-2 w-full"
                                value={form.reviewerName}
                                onChange={(e) =>
                                    changeValue(
                                        "reviewerName",
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Reviewer
                                </option>

                                {reviewers.map((reviewer: any) => (

                                    <option
                                        key={reviewer.id}
                                        value={reviewer.reviewerName}
                                    >
                                        {reviewer.reviewerName}
                                    </option>

                                ))}

                            </select>

                        </div>








                    <div>


                        <Label>
                            Due Date
                        </Label>



                        <Input

                            type="date"


                            value={
                                form.dueDate
                            }


                            onChange={
                                e=>
                                    changeValue(
                                        "dueDate",
                                        e.target.value
                                    )
                            }


                        />


                    </div>









                    <div>


                        <Label>
                            Status
                        </Label>



                        <select

                            className="w-full rounded border p-2"


                            value={
                                form.status
                            }


                            onChange={
                                e=>
                                    changeValue(
                                        "status",
                                        e.target.value
                                    )
                            }

                        >


                            <option>
                                DRAFT
                            </option>


                            <option>
                                ASSIGNED
                            </option>


                            <option>
                                IN_PROGRESS
                            </option>


                            <option>
                                SUBMITTED
                            </option>


                            <option>
                                UNDER_REVIEW
                            </option>


                            <option>
                                APPROVED
                            </option>


                            <option>
                                COMPLETED
                            </option>


                        </select>



                    </div>









                    <div className="flex justify-between">


                        <Button

                            variant="outline"

                            onClick={()=>
                                navigate(
                                    "/assessments"
                                )
                            }

                        >

                            <ArrowLeft className="mr-2 h-4 w-4"/>

                            Cancel


                        </Button>






                        <Button

                            disabled={loading}

                            onClick={submit}

                        >

                            <Save className="mr-2 h-4 w-4"/>


                            {
                                loading
                                    ?
                                    "Creating..."
                                    :
                                    "Create Assessment"
                            }


                        </Button>



                    </div>





                </CardContent>


            </Card>



        </div>

    );


}