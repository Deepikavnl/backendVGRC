import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Globe,
  Mail,
  Phone,
  FileText,
  Download,
  ClipboardList,
  Building2,
  MapPin,
  Star,
  Plus,
  ShieldAlert,
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
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";


import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";


import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";


import {
  RiskBadge,
  StatusBadge
} from "@/components/common/status-badge";


import { EmptyState } from "@/components/ui/empty-state";


import { getEntityById } from "@/services/entityService";

import { getFindingsByEntity } from "@/services/entityFindingService";


import {
  formatDate,
  pct,
  currencyINR
} from "@/lib/utils";



export function EntityDetailPage() {


  const { id } = useParams();

  const navigate = useNavigate();



  const [tab,setTab] = useState("overview");



  const [e,setEntity] = useState<any>(null);



  const [entityFindings,setEntityFindings] =
      useState<any[]>([]);



  const [entityAssessments,setEntityAssessments] =
      useState<any[]>([]);




  useEffect(()=>{


    if(id){


      getEntityById(Number(id))

          .then(res=>{


            console.log(
                "Entity Detail Response:",
                res.data
            );


            setEntity(
                res.data.data
            );


          })


          .catch(err=>{


            console.log(
                "Entity Detail Error:",
                err
            );


          });




      getFindingsByEntity(Number(id))


          .then(res=>{


            console.log(
                "Finding Response:",
                res.data
            );



            setEntityFindings(
                res.data.data || []
            );


          })


          .catch(err=>{


            console.log(
                "Finding Error:",
                err
            );


          });



    }


  },[id]);





  if(!e){

    return (

        <EmptyState

            icon={Building2}

            title="Entity not found"

        />

    );

  }
  return (
      <>
        <PageHeader

            title={e.name}

            breadcrumbs={[
              {
                label:"Entities",
                to:"/entities"
              },
              {
                label:e.name
              }
            ]}


            actions={

              <Button

                  onClick={() =>
                      navigate(`/assessments/new?entityId=${e.id}`)
                  }

              >

                <ClipboardList className="h-4 w-4"/>

                New Assessment

              </Button>

            }

        />



        <div className="mb-6 grid gap-4 lg:grid-cols-4">



          <Card className="lg:col-span-3">


            <CardContent className="flex flex-wrap items-start gap-5 p-5">


              <Avatar

                  name={e.name}

                  className="h-16 w-16 text-xl"

              />



              <div className="flex-1">


                <div className="flex flex-wrap items-center gap-2">


                  <h2 className="text-lg font-bold">

                    {e.name}

                  </h2>



                  <RiskBadge

                      level={e.riskRating}

                  />



                  <StatusBadge

                      status={e.status}

                  />



                  <Badge variant="outline">

                    {e.criticality}

                  </Badge>


                </div>





                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">


                <span className="flex items-center gap-1.5">

                  <Building2 className="h-4 w-4"/>

                  {e.type} · {e.category}

                </span>




                  <span className="flex items-center gap-1.5">

                  <MapPin className="h-4 w-4"/>

                    {e.country}

                </span>




                  <span className="flex items-center gap-1.5">

                  <Globe className="h-4 w-4"/>

                    {e.website}

                </span>


                </div>





                <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">


                  <div>

                  <span className="text-muted-foreground">

                    Annual spend

                  </span>


                    <span className="font-medium ml-2">

                    {currencyINR(e.spend)}

                  </span>


                  </div>


                </div>



              </div>



            </CardContent>


          </Card>





          <Card>


            <CardContent className="p-5">


              <p className="text-sm text-muted-foreground">

                Compliance Score

              </p>



              <p className="mt-1 text-3xl font-bold">

                {pct(e.complianceScore)}

              </p>




              <Progress

                  value={e.complianceScore}

                  className="mt-2"

              />




              <div className="mt-4 flex items-center justify-between text-sm">


              <span className="text-muted-foreground">

                Open findings

              </span>



                <span className="font-medium text-destructive">

                {e.openFindings}

              </span>


              </div>



            </CardContent>


          </Card>



        </div>
        <Tabs

            value={tab}

            onValueChange={setTab}

        >


          <TabsList className="mb-4">


            <TabsTrigger value="overview">

              Overview

            </TabsTrigger>



            <TabsTrigger value="contacts">

              Contacts

            </TabsTrigger>



            <TabsTrigger value="assessments">

              Assessments ({entityAssessments.length})

            </TabsTrigger>



            <TabsTrigger value="findings">

              Findings ({entityFindings.length})

            </TabsTrigger>



            <TabsTrigger value="documents">

              Documents

            </TabsTrigger>


          </TabsList>





          <TabsContent value="overview">


            <div className="grid gap-4 md:grid-cols-2">



              <Card>


                <CardHeader>

                  <CardTitle className="text-base">

                    Company Profile

                  </CardTitle>

                </CardHeader>



                <CardContent className="grid grid-cols-2 gap-4 text-sm">


                  {[

                    ["Name",e.name],

                    ["Type",e.type],

                    ["Category",e.category],

                    ["Country",e.country],

                    ["Criticality",e.criticality],

                    ["Website",e.website]

                  ].map(([key,value])=>(


                      <div key={key}>


                        <p className="text-xs uppercase text-muted-foreground">

                          {key}

                        </p>


                        <p className="mt-1 font-medium">

                          {value}

                        </p>


                      </div>


                  ))}


                </CardContent>


              </Card>





              <Card>


                <CardHeader>


                  <CardTitle className="text-base">

                    Risk Summary

                  </CardTitle>


                </CardHeader>




                <CardContent className="space-y-3">


                  <div className="flex items-center justify-between rounded-lg border p-3">


                  <span className="flex items-center gap-2 text-sm">


                    <ShieldAlert className="h-4 w-4"/>


                    Inherent Risk


                  </span>



                    <RiskBadge

                        level={e.riskRating}

                    />



                  </div>





                  <div className="flex justify-between rounded-lg border p-3">


                  <span className="text-sm">

                    Compliance Score

                  </span>


                    <span className="font-medium">

                    {pct(e.complianceScore)}

                  </span>


                  </div>





                  <div className="flex justify-between rounded-lg border p-3">


                  <span className="text-sm">

                    Open Findings

                  </span>


                    <span className="font-medium text-destructive">

                    {e.openFindings}

                  </span>


                  </div>



                </CardContent>


              </Card>



            </div>


          </TabsContent>






          <TabsContent value="assessments">


            <EmptyState

                icon={ClipboardList}

                title="No assessments yet"

                description="Assessment API will be connected next."

            />


          </TabsContent>






          <TabsContent value="findings">


            {

              entityFindings.length === 0 ?


                  (

                      <EmptyState

                          icon={ShieldAlert}

                          title="No findings"

                          description="This entity has no recorded findings."

                      />

                  )


                  :


                  (

                      <Card>


                        <Table>


                          <TableHeader>


                            <TableRow>


                              <TableHead>

                                Title

                              </TableHead>



                              <TableHead>

                                Severity

                              </TableHead>



                              <TableHead>

                                Status

                              </TableHead>



                              <TableHead>

                                Assigned To

                              </TableHead>



                              <TableHead>

                                Due Date

                              </TableHead>



                            </TableRow>


                          </TableHeader>




                          <TableBody>


                            {


                              entityFindings.map((f)=>(


                                  <TableRow key={f.id}>


                                    <TableCell className="font-medium">


                                      {f.title}


                                    </TableCell>




                                    <TableCell>


                                      <RiskBadge

                                          level={f.severity}

                                      />


                                    </TableCell>




                                    <TableCell>


                                      <StatusBadge

                                          status={f.status}

                                      />


                                    </TableCell>




                                    <TableCell>


                                      {f.assignedTo}


                                    </TableCell>




                                    <TableCell>


                                      {formatDate(f.dueDate)}


                                    </TableCell>



                                  </TableRow>


                              ))


                            }



                          </TableBody>



                        </Table>



                      </Card>


                  )


            }


          </TabsContent>
          <TabsContent value="contacts">


            <EmptyState

                icon={Mail}

                title="No contacts"

                description="Entity contacts API will be connected next."

            />


          </TabsContent>





          <TabsContent value="documents">


            <EmptyState

                icon={FileText}

                title="No documents"

                description="Entity documents API will be connected next."

            />


          </TabsContent>



        </Tabs>


      </>
  );

}