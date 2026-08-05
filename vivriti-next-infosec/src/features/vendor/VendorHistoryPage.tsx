import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Download } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/ui/empty-state";

import { formatDate } from "@/lib/utils";
import { vendorApi } from "@/api/vendorApi";


export function VendorHistoryPage() {


    const navigate = useNavigate();




    const [history, setHistory] = useState<any[]>([]);


    const [loading, setLoading] = useState(true);






    useEffect(() => {





        const loadHistory = async () => {


            try {


                const data =
                    await vendorApi.getVendorHistory();


                setHistory(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch(error) {


                console.error(
                    "Failed to load history",
                    error
                );


                setHistory([]);


            } finally {


                setLoading(false);


            }


        };


        loadHistory();


    }, []);




  if(loading){

    return (
        <div>
          Loading history...
        </div>
    );

  }




  return (

      <>


        <PageHeader

            title="Submission History"

            description="Your past assessment submissions and their outcomes."

        />




        {
          history.length === 0 ?


              <EmptyState

                  icon={History}

                  title="No submissions yet"

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
                        Submitted
                      </TableHead>


                      <TableHead>
                        Status
                      </TableHead>


                      <TableHead>
                        Score
                      </TableHead>


                      <TableHead className="w-20" />


                    </TableRow>


                  </TableHeader>




                  <TableBody>


                    {
                      history.map(
                          (a) => (


                              <TableRow


                                  key={a.id}


                                  className="cursor-pointer"


                                  onClick={() =>
                                      navigate(
                                          `/vendor/assessments/${a.id}`
                                      )
                                  }


                              >


                                <TableCell className="font-mono text-xs">


                                  {a.code}


                                </TableCell>




                                <TableCell className="text-sm font-medium">


                                  {a.templateName}


                                </TableCell>




                                <TableCell className="text-sm text-muted-foreground">


                                  {
                                    a.submittedAt
                                        ?
                                        formatDate(
                                            a.submittedAt
                                        )
                                        :
                                        "—"
                                  }


                                </TableCell>




                                <TableCell>


                                  <StatusBadge

                                      status={a.status}

                                  />


                                </TableCell>




                                <TableCell className="text-sm">


                                  {
                                    a.score
                                        ?
                                        `${a.score}%`
                                        :
                                        "—"
                                  }


                                </TableCell>




                                <TableCell

                                    onClick={(e)=>
                                        e.stopPropagation()
                                    }

                                >


                                  <Button

                                      variant="ghost"

                                      size="icon"

                                  >

                                    <Download className="h-4 w-4"/>


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