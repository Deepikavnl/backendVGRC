import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Download,
  Building2,
  MoreHorizontal,
  Eye,
  ClipboardList,
  LayoutGrid,
  List
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Toolbar, SearchInput } from "@/components/common/toolbar";

import {
  Card,
  CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

import { Pagination } from "@/components/ui/pagination";

import {
  RiskBadge,
  StatusBadge
} from "@/components/common/status-badge";

import {
  DropdownMenu,
  DropdownItem
} from "@/components/ui/dropdown-menu";

import { EmptyState } from "@/components/ui/empty-state";

import { exportToCSV } from "@/lib/export";
import { cn, pct } from "@/lib/utils";

import { getEntities } from "@/services/entityService";


const PAGE_SIZE = 10;


export function EntitiesPage() {

  const navigate = useNavigate();


  const [entities,setEntities] = useState<any[]>([]);

  const [search,setSearch] = useState("");

  const [type,setType] = useState("");

  const [risk,setRisk] = useState("");

  const [status,setStatus] = useState("");

  const [view,setView] =
      useState<"table"|"grid">("table");

  const [page,setPage] = useState(1);

    useEffect(()=>{

        getEntities()
            .then(res=>{

                console.log(
                    "Backend Entity Response:",
                    res.data
                );

                setEntities(
                    res.data.data || []
                );

            })
            .catch(err=>{

                console.log(
                    "Entity Fetch Error:",
                    err
                );

            });

    },[]);



  const filtered = useMemo(()=>{


    return entities.filter((e)=>

        (!search ||
            e.name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        )

        &&

        (!type ||
            e.type?.toLowerCase() === type.toLowerCase()
        )

        &&

        (!risk ||
            e.riskRating?.toLowerCase() === risk.toLowerCase()
        )

        &&

        (!status ||
            e.status?.toLowerCase() === status.toLowerCase()
        )

    );


  },[
    entities,
    search,
    type,
    risk,
    status
  ]);



  const pageData =
      filtered.slice(
          (page-1)*PAGE_SIZE,
          page*PAGE_SIZE
      );
  return (

      <>

        <PageHeader

            title="Entity Management"

            description=
                "Vendors, suppliers, partners and service providers under management."

            breadcrumbs={[
              {
                label:"Entities"
              }
            ]}


            actions={

              <>

                <Button
                    variant="outline"

                    onClick={()=>

                        exportToCSV(
                            "entities",

                            filtered.map((e)=>({

                              Name:e.name,

                              Type:e.type,

                              Category:e.category,

                              Country:e.country,

                              Risk:e.riskRating,

                              Compliance:e.complianceScore,

                              Status:e.status,

                              OpenFindings:e.openFindings

                            }))

                        )

                    }

                >

                  <Download className="h-4 w-4"/>

                  Export

                </Button>



                <Button
                    onClick={()=>
                        navigate("/entities/new")
                    }

                >

                  <Plus className="h-4 w-4"/>

                  Add Entity

                </Button>


              </>

            }


        />





        <Toolbar>


          <SearchInput

              value={search}

              onChange={(v)=>{

                setSearch(v);

                setPage(1);

              }}

              placeholder="Search entities…"

              className="w-full sm:max-w-xs"

          />




          <div className="flex flex-wrap items-center gap-2">



            <Select

                value={type}

                onValueChange={setType}

                placeholder="All Types"

                className="w-36"


                options={[

                  {
                    label:"All Types",
                    value:""
                  },


                  {
                    label:"Vendor",
                    value:"Vendor"
                  },


                  {
                    label:"Supplier",
                    value:"Supplier"
                  },


                  {
                    label:"Partner",
                    value:"Partner"
                  },


                  {
                    label:"Service Provider",
                    value:"Service Provider"
                  }


                ]}


            />





            <Select

                value={risk}

                onValueChange={setRisk}

                placeholder="All Risk"

                className="w-32"


                options={[

                  {
                    label:"All Risk",
                    value:""
                  },


                  {
                    label:"Critical",
                    value:"critical"
                  },


                  {
                    label:"High",
                    value:"high"
                  },


                  {
                    label:"Medium",
                    value:"medium"
                  },


                  {
                    label:"Low",
                    value:"low"
                  }


                ]}


            />






            <Select

                value={status}

                onValueChange={setStatus}

                placeholder="All Status"

                className="w-32"


                options={[

                  {
                    label:"All Status",
                    value:""
                  },


                  {
                    label:"Active",
                    value:"active"
                  },


                  {
                    label:"Inactive",
                    value:"inactive"
                  },


                  {
                    label:"Suspended",
                    value:"suspended"
                  }


                ]}


            />





            <div className="flex rounded-md border p-0.5">


              <button

                  onClick={()=>
                      setView("table")
                  }

                  className={cn(

                      "rounded p-1.5",

                      view==="table"
                          ?
                          "bg-muted text-foreground"
                          :
                          "text-muted-foreground"

                  )}

              >

                <List className="h-4 w-4"/>

              </button>





              <button

                  onClick={()=>
                      setView("grid")
                  }


                  className={cn(

                      "rounded p-1.5",

                      view==="grid"
                          ?
                          "bg-muted text-foreground"
                          :
                          "text-muted-foreground"

                  )}

              >

                <LayoutGrid className="h-4 w-4"/>

              </button>



            </div>


          </div>


        </Toolbar>
        {
          filtered.length === 0 ? (

                  <EmptyState

                      icon={Building2}

                      title="No entities found"

                      description="Adjust your filters or add a new entity."

                  />

              )

              :

              view === "table" ? (


                      <Card>


                        <Table>


                          <TableHeader>


                            <TableRow>


                              <TableHead>
                                Entity
                              </TableHead>


                              <TableHead>
                                Type
                              </TableHead>
                                <TableHead>
                                    Assessments
                                </TableHead>
                              <TableHead>
                                Criticality
                              </TableHead>


                              <TableHead>
                                Risk
                              </TableHead>


                              <TableHead>
                                Compliance
                              </TableHead>


                              <TableHead>
                                Findings
                              </TableHead>


                              <TableHead>
                                Status
                              </TableHead>


                              <TableHead className="w-10"/>


                            </TableRow>


                          </TableHeader>




                          <TableBody>


                            {

                              pageData.map((e)=>(


                                  <TableRow key={e.id}>


                                    <TableCell>


                                      <button

                                          onClick={()=>
                                              navigate(`/entities/${e.id}`)
                                          }

                                          className="flex items-center gap-3 text-left"

                                      >


                                        <Avatar

                                            name={e.name}

                                            className="h-9 w-9"

                                        />



                                        <div>


                                          <p className="font-medium">

                                            {e.name}

                                          </p>



                                          <p className="text-xs text-muted-foreground">

                                            {e.category} · {e.country}

                                          </p>


                                        </div>



                                      </button>


                                    </TableCell>





                                    <TableCell>

                                      {e.type}

                                    </TableCell>


                                      <TableCell>

                                          {e.assessmentCount || 0}

                                      </TableCell>


                                    <TableCell>


                                      <Badge variant="outline">

                                        {e.criticality}

                                      </Badge>


                                    </TableCell>





                                    <TableCell>


                                      <RiskBadge

                                          level={e.riskRating}

                                      />


                                    </TableCell>





                                    <TableCell>


                                      <div className="flex items-center gap-2">


                                        <Progress

                                            value={e.complianceScore}

                                            className="w-16"

                                        />


                                        <span className="text-xs">

                            {pct(e.complianceScore)}

                          </span>


                                      </div>


                                    </TableCell>





                                    <TableCell>


                                      {e.openFindings}


                                    </TableCell>





                                    <TableCell>


                                      <StatusBadge

                                          status={e.status}

                                      />


                                    </TableCell>





                                    <TableCell>


                                      <DropdownMenu


                                          trigger={

                                            <Button

                                                variant="ghost"

                                                size="icon"

                                            >

                                              <MoreHorizontal className="h-4 w-4"/>

                                            </Button>

                                          }


                                      >



                                        <DropdownItem

                                            onClick={()=>
                                                navigate(`/entities/${e.id}`)
                                            }

                                        >

                                          <Eye/>

                                          View profile

                                        </DropdownItem>




                                        <DropdownItem

                                            onClick={()=>
                                                navigate("/assessments/new")
                                            }

                                        >

                                          <ClipboardList/>

                                          New assessment

                                        </DropdownItem>



                                      </DropdownMenu>


                                    </TableCell>



                                  </TableRow>


                              ))

                            }


                          </TableBody>



                        </Table>




                        <div className="border-t px-4">


                          <Pagination

                              page={page}

                              pageSize={PAGE_SIZE}

                              total={filtered.length}

                              onPageChange={setPage}

                          />


                        </div>


                      </Card>



                  )



                  :



                  (


                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">


                        {

                          pageData.map((e)=>(


                              <Card

                                  key={e.id}

                                  className="cursor-pointer"

                                  onClick={()=>
                                      navigate(`/entities/${e.id}`)
                                  }

                              >


                                <CardContent className="p-5">


                                  <Avatar

                                      name={e.name}

                                      className="h-11 w-11"

                                  />


                                  <h3 className="mt-3 font-semibold">

                                    {e.name}

                                  </h3>



                                  <p className="text-xs text-muted-foreground">

                                    {e.category} · {e.country}

                                  </p>




                                  <Progress

                                      value={e.complianceScore}

                                      className="mt-4"

                                  />



                                  <div className="mt-3 text-xs">


                                    {e.assessmentCount} assessments


                                    <br/>


                                    {e.openFindings} findings


                                  </div>



                                </CardContent>



                              </Card>


                          ))

                        }


                      </div>


                  )

        }



      </>

  );

}