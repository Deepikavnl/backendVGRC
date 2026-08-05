import { useEffect, useMemo, useState } from "react";
import { templateApi } from "@/features/templates/templateApi";
import { useNavigate } from "react-router-dom";

import {
    Plus,
    LayoutTemplate,
    Copy,
    MoreHorizontal,
    Eye,
    Pencil,
    Layers,
    FileText,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Toolbar, SearchInput } from "@/components/common/toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/status-badge";
import { DropdownMenu, DropdownItem } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/store/toast";


export function TemplatesPage() {

    const navigate = useNavigate();


    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [cat, setCat] = useState("");

    const [templates, setTemplates] = useState<any[]>([]);



    useEffect(() => {

        templateApi.getTemplates()
            .then((res) => {

                console.log("Templates API Response:", res);

                setTemplates(res.data ?? res);

            })
            .catch((err) => {

                console.log("Template API Error:", err);

            });

    }, []);



    const cats = Array.from(
        new Set(
            templates.map((t) => t.category)
        )
    );



    const filtered = useMemo(() => {

        return templates.filter((t) =>

            (!search ||
                t.name?.toLowerCase()
                    .includes(search.toLowerCase()))

            &&

            (!status ||
                t.status?.toLowerCase() === status.toLowerCase())

            &&

            (!cat ||
                t.category === cat)

        );

    }, [templates, search, status, cat]);




    return (

        <>

            <PageHeader

                title="Assessment Templates"

                description="Reusable questionnaires assembled from the question bank."

                breadcrumbs={[
                    { label: "Templates" }
                ]}

                actions={

                    <Button
                        onClick={() =>
                            navigate("/templates/builder")
                        }
                    >

                        <Plus className="h-4 w-4" />

                        New Template

                    </Button>

                }

            />



            <Toolbar>


                <SearchInput

                    value={search}

                    onChange={setSearch}

                    placeholder="Search templates…"

                    className="w-full sm:max-w-xs"

                />



                <div className="flex flex-wrap gap-2">


                    <Select

                        value={cat}

                        onValueChange={setCat}

                        placeholder="All Categories"

                        className="w-44"

                        options={[

                            {
                                label:"All Categories",
                                value:""
                            },

                            ...cats.map((c)=>({

                                label:c,

                                value:c

                            }))

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
                                label:"Published",
                                value:"PUBLISHED"
                            },

                            {
                                label:"Draft",
                                value:"DRAFT"
                            },

                            {
                                label:"Archived",
                                value:"ARCHIVED"
                            }

                        ]}

                    />


                </div>


            </Toolbar>

            {
                filtered.length === 0 ?

                    (

                        <EmptyState

                            icon={LayoutTemplate}

                            title="No templates found"

                            description="Adjust filters or build a new template."

                            action={

                                <Button
                                    onClick={() =>
                                        navigate("/templates/builder")
                                    }
                                >

                                    <Plus className="h-4 w-4"/>

                                    New Template

                                </Button>

                            }

                        />

                    )

                    :

                    (

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">


                            {
                                filtered.map((t)=>(


                                    <Card

                                        key={t.id}

                                        className="group flex flex-col transition-shadow hover:shadow-elevated"

                                    >


                                        <CardContent className="flex flex-1 flex-col p-5">


                                            <div className="flex items-start justify-between">


                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">

                                                    <LayoutTemplate className="h-5 w-5"/>

                                                </div>



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
                                                        onClick={() =>
                                                            navigate(`/templates/${t.id}`)
                                                        }
                                                    >

                                                        <Eye/>

                                                        View

                                                    </DropdownItem>



                                                    <DropdownItem
                                                        onClick={() =>
                                                            navigate(`/templates/builder/${t.id}`)
                                                        }
                                                    >

                                                        <Pencil/>

                                                        Edit

                                                    </DropdownItem>



                                                    <DropdownItem

                                                        onClick={() =>
                                                            toast.success("Template cloned")
                                                        }

                                                    >

                                                        <Copy/>

                                                        Clone

                                                    </DropdownItem>


                                                </DropdownMenu>


                                            </div>




                                            <button

                                                onClick={() =>
                                                    navigate(`/templates/${t.id}`)
                                                }

                                                className="mt-3 text-left"

                                            >

                                                <h3 className="font-semibold">

                                                    {t.name}

                                                </h3>


                                            </button>




                                            <p className="mt-1 flex-1 text-sm text-muted-foreground">

                                                {t.description}

                                            </p>




                                            <div className="mt-4 flex flex-wrap gap-2">


                                                <Badge variant="secondary">

                                                    {t.category}

                                                </Badge>



                                                <StatusBadge status={t.status}/>



                                                <Badge variant="outline">

                                                    v{t.version}

                                                </Badge>


                                            </div>




                                            <div className="mt-4 flex justify-between border-t pt-3 text-xs text-muted-foreground">


                    <span className="flex gap-1">

    <Layers className="h-3.5 w-3.5"/>

                        {t.topics?.length ?? 0} topics

</span>


                                                <span className="flex gap-1">

    <FileText className="h-3.5 w-3.5"/>

                                                    {
                                                        t.topics?.reduce(
                                                            (total:any, topic:any) =>
                                                                total + (topic.questions?.length ?? 0),
                                                            0
                                                        ) ?? 0
                                                    }

                                                    questions

</span>
                                                <span>

                      {t.usageCount ?? 0} uses

                    </span>


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