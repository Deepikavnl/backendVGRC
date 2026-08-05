import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Pencil,
    Copy,
    FileText,
    Layers,
    Send
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

import { toast } from "@/store/toast";

import { templateApi } from "@/features/templates/templateApi";


const typeLabels: Record<string,string> = {

    text:"Short Text",
    paragraph:"Paragraph",
    yesno:"Yes / No",
    dropdown:"Dropdown",
    checkbox:"Checkbox",
    number:"Number",
    date:"Date",
    file:"File Upload"

};



export function TemplateDetailPage(){
    const { id } = useParams();

    const templateId = Number(id);

    const navigate=useNavigate();


    const [template,setTemplate]=useState<any>(null);

    const [loading,setLoading]=useState(true);



    useEffect(() => {
        if (!templateId || Number.isNaN(templateId)) {
            setLoading(false);
            toast.error("Invalid template id");
            return;
        }

        const loadTemplate = async () => {
            try {
                const template = await templateApi.getTemplate(templateId);

                console.log("Template:", template);

                setTemplate(template);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load template");
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, [id]);






    if(loading){


        return (

            <div className="p-5">

                Loading Template...

            </div>

        );


    }



    if(!template){


        return (

            <EmptyState

                icon={FileText}

                title="Template not found"

            />

        );


    }





    return (

        <>


            <PageHeader


                title={template.name}


                description={template.description}


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

                    <>


                        <Button

                            variant="outline"

                            onClick={()=>toast.success(
                                "Template cloned"
                            )}

                        >

                            <Copy className="h-4 w-4"/>

                            Clone

                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate(`/templates/edit/${template.id}`)}
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>


                        <Button

                            onClick={()=>navigate(
                                "/assessments/new"
                            )}

                        >

                            <Send className="h-4 w-4"/>

                            Use in Assessment

                        </Button>



                    </>

                }


            />





            <div className="mb-6 flex flex-wrap gap-6 rounded-lg border bg-card p-5 text-sm">


                <div>

                    <p className="text-xs text-muted-foreground">

                        Category

                    </p>

                    <p className="font-medium">

                        {template.category}

                    </p>

                </div>




                <div>

                    <p className="text-xs text-muted-foreground">

                        Sections

                    </p>

                    <p className="font-medium">

                        {template.sections?.length || 0}

                    </p>

                </div>



                <div>

                    <p className="text-xs text-muted-foreground">

                        Questions

                    </p>


                    <p className="font-medium">

                        {

                            template.sections?.reduce(

                                (sum:any,sec:any)=>

                                    sum + sec.questions.length,

                                0

                            )

                        }

                    </p>


                </div>



            </div>






            <div className="space-y-5">


                {

                    template.sections?.map(

                        (sec:any,index:number)=>(


                            <Card key={sec.orderNo}>


                                <CardHeader

                                    className="flex-row items-center justify-between"

                                >


                                    <div className="flex items-center gap-2">


<span

    className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold"

>

{index+1}

</span>



                                        <CardTitle className="text-base">

                                            {sec.title}

                                        </CardTitle>


                                    </div>



                                    <Badge variant="secondary">


                                        <Layers className="h-3 w-3"/>


                                        {sec.questions.length}

                                        Questions


                                    </Badge>


                                </CardHeader>





                                <CardContent className="space-y-3">


                                    {


                                        sec.questions.map(

                                            (q:any,qIndex:number)=>(


                                                <div

                                                    key={q.questionId}

                                                    className="flex gap-3 rounded-lg border p-3"

                                                >


<span className="text-xs text-muted-foreground">


{index+1}.{qIndex+1}


</span>



                                                    <div>


                                                        <p className="text-sm font-medium">
                                                            {q.questionText}
                                                        </p>

                                                        <Badge variant="outline">
                                                            {q.questionType}
                                                        </Badge>



                                                        <div className="mt-2 flex gap-2">


                                                            <Badge variant="outline">

                                                                Question

                                                            </Badge>


                                                            <Badge variant="secondary">

                                                                Order {q.orderNo}

                                                            </Badge>


                                                        </div>


                                                    </div>



                                                </div>



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