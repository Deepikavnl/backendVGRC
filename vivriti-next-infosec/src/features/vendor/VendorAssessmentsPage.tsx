import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Toolbar, SearchInput } from "@/components/common/toolbar";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from "@/components/ui/table";

import { StatusBadge } from "@/components/common/status-badge";
import {
    Tabs,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

import { EmptyState } from "@/components/ui/empty-state";

import { formatDate } from "@/lib/utils";

import { vendorApi } from "@/api/vendorApi";




export function VendorAssessmentsPage() {


    const navigate = useNavigate();



    const [search,setSearch] =
        useState("");



    const [tab,setTab] =
        useState("all");



    const [assessments,setAssessments] =
        useState<any[]>([]);



    const [loading,setLoading] =
        useState(true);









    useEffect(()=>{





        const loadAssessments = async()=>{


            try{


                const data =
                    await vendorApi.getVendorAssessments(

                    );



                setAssessments(
                    Array.isArray(data)
                        ?
                        data
                        :
                        []
                );


            }
            catch(error){


                console.error(
                    "Failed to load assessments",
                    error
                );


                setAssessments([]);


            }
            finally{


                setLoading(false);


            }


        };



        loadAssessments();


    },[]);








    const filteredAssessments =
        assessments.filter(
            (assessment)=>{


                const searchMatch =
                    !search ||
                    assessment.templateName
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );




                const tabMatch =

                    tab === "all"

                    ||

                    (
                        tab === "drafts" &&
                        assessment.status === "DRAFT"
                    )


                    ||

                    (
                        tab === "submitted" &&
                        assessment.status === "SUBMITTED"
                    )


                    ||


                        (
                            tab === "corrections" &&
                            (
                                tab === "corrections" &&
                                assessment.status === "NEEDS_CORRECTION"
                            )
                        );





                return (
                    searchMatch &&
                    tabMatch
                );


            }
        );







    if(loading){


        return (

            <div>
                Loading assessments...
            </div>

        );


    }







    return (

        <>


            <PageHeader

                title="My Assessments"

                description="Security assessments assigned to your organisation."

            />






            <Tabs

                value={tab}

                onValueChange={setTab}

                className="mb-4"

            >


                <TabsList>


                    <TabsTrigger value="all">

                        All

                    </TabsTrigger>



                    <TabsTrigger value="drafts">

                        Drafts

                    </TabsTrigger>




                    <TabsTrigger value="submitted">

                        Submitted

                    </TabsTrigger>




                    <TabsTrigger value="corrections">

                        Corrections

                    </TabsTrigger>



                </TabsList>



            </Tabs>








            <Toolbar>


                <SearchInput

                    value={search}

                    onChange={setSearch}

                    placeholder="Search assessments..."

                    className="w-full sm:max-w-xs"

                />


            </Toolbar>









            {
                filteredAssessments.length === 0 ?


                    <EmptyState

                        title="No assessments found"

                    />



                    :



                    <Card>



                        <Table>



                            <TableHeader>


                                <TableRow>


                                    <TableHead>

                                        Code

                                    </TableHead>



                                    <TableHead>

                                        Assessment

                                    </TableHead>



                                    <TableHead>

                                        Progress

                                    </TableHead>



                                    <TableHead>

                                        Status

                                    </TableHead>



                                    <TableHead>

                                        Due

                                    </TableHead>



                                    <TableHead />



                                </TableRow>


                            </TableHeader>







                            <TableBody>


                                {
                                    filteredAssessments.map(
                                        (assessment)=>(


                                            <TableRow


                                                key={
                                                    assessment.id
                                                }



                                                className="cursor-pointer"



                                                onClick={()=>


                                                    navigate(

                                                        `/vendor/assessments/${assessment.id}`

                                                    )

                                                }


                                            >



                                                <TableCell

                                                    className="font-mono text-xs"

                                                >

                                                    {
                                                        assessment.code
                                                    }


                                                </TableCell>







                                                <TableCell

                                                    className="font-medium"

                                                >


                                                    {
                                                        assessment.templateName
                                                    }


                                                </TableCell>







                                                <TableCell>


                                                    <div className="flex items-center gap-2">


                                                        <Progress


                                                            value={
                                                                assessment.progress ?? 0
                                                            }


                                                            className="w-24"


                                                        />



                                                        <span className="text-xs">


                                                        {
                                                            assessment.progress ?? 0
                                                        }%


                                                    </span>


                                                    </div>



                                                </TableCell>








                                                <TableCell>


                                                    <StatusBadge

                                                        status={
                                                            assessment.status
                                                        }

                                                    />



                                                </TableCell>








                                                <TableCell

                                                    className="text-sm text-muted-foreground"

                                                >


                                                    {
                                                        assessment.dueDate

                                                            ?

                                                            formatDate(
                                                                assessment.dueDate
                                                            )

                                                            :

                                                            "-"
                                                    }



                                                </TableCell>








                                                <TableCell>


                                                    <Button


                                                        variant="ghost"


                                                        size="icon"



                                                        onClick={
                                                            (e)=>{


                                                                e.stopPropagation();



                                                                navigate(

                                                                    `/vendor/assessments/${assessment.id}`

                                                                );


                                                            }
                                                        }


                                                    >


                                                        <ArrowRight

                                                            className="h-4 w-4"

                                                        />


                                                    </Button>



                                                </TableCell>





                                            </TableRow>



                                        )
                                    )
                                }




                            </TableBody>




                        </Table>



                    </Card>


            }



        </>


    );


}