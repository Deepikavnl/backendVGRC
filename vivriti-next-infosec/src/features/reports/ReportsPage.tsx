import {
    FileBarChart,
    FileText,
    FileSpreadsheet,
    Building2,
    ClipboardList,
    ShieldAlert,
    TrendingUp
} from "lucide-react";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/common/page-header";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { ChartCard } from "@/components/charts/chart-card";
import { DonutChart } from "@/components/charts/donut-chart";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { TrendChart } from "@/components/charts/trend-chart";

import { exportToCSV } from "@/lib/export";
import { exportToPDF } from "@/lib/exportPdf";

import { toast } from "@/store/toast";

import { reportApi } from "@/features/reports/reportApi";



const riskColors: Record<string,string> = {

    critical:"#dc2626",
    high:"#f97316",
    medium:"#f59e0b",
    low:"#10b981",
    minimal:"#94a3b8"

};


const sevColors: Record<string,string> = {

    critical:"#dc2626",
    high:"#f97316",
    medium:"#f59e0b",
    low:"#10b981"

};



const reports = [

    {
        name:"Vendor Report",
        desc:"Full posture profile per vendor including risk, findings and history.",
        icon:Building2
    },

    {
        name:"Assessment Report",
        desc:"Detailed responses, scores and reviewer decisions for an assessment.",
        icon:ClipboardList
    },

    {
        name:"Findings Report",
        desc:"All findings with severity, ownership and remediation status.",
        icon:ShieldAlert
    },

    {
        name:"Risk Report",
        desc:"Portfolio risk distribution and trend across all third parties.",
        icon:TrendingUp
    },

    {
        name:"Executive Dashboard",
        desc:"Board-ready summary of program health and key metrics.",
        icon:FileBarChart
    }

];



export function ReportsPage(){


    const [risk,setRisk] = useState<any[]>([]);

    const [severity,setSeverity] = useState<any[]>([]);

    const [status,setStatus] = useState<any[]>([]);

    const [trend,setTrend] = useState<any[]>([]);


    const [vendors,setVendors] = useState<any[]>([]);

    const [assessments,setAssessments] = useState<any[]>([]);

    const [findings,setFindings] = useState<any[]>([]);



    useEffect(()=>{


        const loadReports = async()=>{


            try{


                const [

                    riskData,
                    severityData,
                    statusData,
                    trendData,
                    vendorData,
                    findingData

                ] = await Promise.all([


                    reportApi.getRiskDistribution(),


                    reportApi.getFindingsSeverity(),


                    reportApi.getAssessmentStatus(),


                    reportApi.getComplianceTrend(),


                    reportApi.getVendorReport(),


                    reportApi.getFindingReport()


                ]);



                setRisk(

                    riskData.map((r:any)=>({


                        name:
                            r.level
                                ?.replace("_"," ")
                                ?.toUpperCase(),


                        value:r.count,


                        color:
                            riskColors[
                                r.level?.toLowerCase()
                                ]


                    }))

                );


                setSeverity(

                    severityData.map((s:any)=>({


                        name:
                            s.severity
                                ?.replace("_"," ")
                                ?.toUpperCase(),


                        value:s.count,


                        color:
                            sevColors[
                                s.severity?.toLowerCase()
                                ]

                    }))

                );


                setStatus(

                    statusData.map((s:any)=>({


                        name:
                            s.status
                                ?.replace("_"," "),


                        value:s.count


                    }))

                );

                setTrend(trendData);


                setVendors(vendorData);


                setFindings(findingData);


                // assessment status summary for now
                setAssessments(statusData);



            }
            catch(error){


                console.error(
                    "Report loading failed",
                    error
                );


                toast.error(
                    "Failed to load reports"
                );


            }


        };


        loadReports();


    },[]);





    return (

        <>


            <PageHeader

                title="Reports"

                description="Generate and export governance, risk and compliance reports."

                breadcrumbs={[
                    {
                        label:"Reports"
                    }
                ]}

            />





            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


                {
                    reports.map((r)=>(


                        <Card

                            key={r.name}

                            className="group flex flex-col"

                        >


                            <CardContent className="flex flex-1 flex-col p-5">


                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">


                                    <r.icon className="h-5 w-5"/>


                                </div>



                                <h3 className="mt-3 font-semibold">

                                    {r.name}

                                </h3>



                                <p className="mt-1 flex-1 text-sm text-muted-foreground">

                                    {r.desc}

                                </p>





                                <div className="mt-4 flex gap-2">



                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"

                                        onClick={()=>{


                                            let data:any[]=[];


                                            if(r.name==="Findings Report"){

                                                data =
                                                    findings.map((f:any)=>({

                                                        Code:f.code,

                                                        Title:f.title,

                                                        Severity:f.severity,

                                                        Status:f.status

                                                    }));

                                            }



                                            else if(r.name==="Assessment Report"){

                                                data =
                                                    assessments.map((a:any)=>({

                                                        Status:a.status,

                                                        Count:a.count

                                                    }));

                                            }



                                            else {


                                                data =
                                                    vendors.map((v:any)=>({

                                                        Name:v.name,

                                                        Risk:v.riskRating,

                                                        Compliance:v.complianceScore

                                                    }));

                                            }



                                            exportToPDF(

                                                r.name,

                                                data

                                            );



                                        }}

                                    >

                                        <FileText className="h-3.5 w-3.5"/>

                                        PDF

                                    </Button>






                                    <Button

                                        variant="outline"

                                        size="sm"

                                        className="flex-1"


                                        onClick={()=>{


                                            let data:any[]=[];



                                            if(r.name==="Findings Report"){


                                                data =
                                                    findings.map(
                                                        (f:any)=>({


                                                            Code:f.code,

                                                            Title:f.title,

                                                            Severity:f.severity,

                                                            Status:f.status


                                                        })
                                                    );


                                            }



                                            else if(
                                                r.name==="Assessment Report"
                                            ){


                                                data =
                                                    assessments.map(
                                                        (a:any)=>({


                                                            Status:a.status,

                                                            Count:a.count


                                                        })
                                                    );


                                            }



                                            else{


                                                data =
                                                    vendors.map(
                                                        (e:any)=>({


                                                            Name:e.name,

                                                            Risk:e.riskRating,

                                                            Compliance:e.complianceScore


                                                        })
                                                    );


                                            }



                                            exportToCSV(

                                                r.name.replace(
                                                    /\s/g,
                                                    "_"
                                                ),

                                                data

                                            );


                                        }}


                                    >


                                        <FileSpreadsheet className="h-3.5 w-3.5"/>


                                        Excel


                                    </Button>




                                </div>



                            </CardContent>


                        </Card>


                    ))
                }


            </div>

            <div className="grid gap-6 lg:grid-cols-3">



                {/* Compliance Trend */}


                <div className="lg:col-span-2">


                    <ChartCard

                        title="Compliance Trend"

                        description="Portfolio compliance over time"

                    >


                        <TrendChart

                            data={trend}

                        />


                    </ChartCard>


                </div>





                {/* Risk Distribution */}


                <ChartCard

                    title="Risk Distribution"

                >


                    <DonutChart


                        data={risk}


                        centerValue={
                            vendors.length
                        }


                        centerLabel="Vendors"


                    />


                </ChartCard>





                {/* Findings Severity */}


                <ChartCard

                    title="Findings by Severity"

                >


                    <SimpleBarChart

                        data={severity}

                    />


                </ChartCard>







                {/* Assessment Status */}


                <div className="lg:col-span-2">


                    <ChartCard

                        title="Assessments by Status"

                    >


                        <SimpleBarChart


                            data={status}


                            color="#1f47d8"


                        />


                    </ChartCard>


                </div>




            </div>



        </>

    );


}