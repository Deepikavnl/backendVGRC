import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


import {
    Plus,
    LayoutTemplate,
    Copy,
    MoreHorizontal,
    Eye,
    Pencil,
    Upload,
    Trash2,
    Layers,
    FileText,
    TrendingUp
} from "lucide-react";


import { templateApi } from "@/features/templates/templateApi";


import {
    Card,
    CardContent
} from "@/components/ui/card";


import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";


import { Select } from "@/components/ui/select";


import {
    DropdownMenu,
    DropdownItem
} from "@/components/ui/dropdown-menu";


import { EmptyState } from "@/components/ui/empty-state";


import { StatusBadge } from "@/components/common/status-badge";


import { toast } from "@/store/toast";



export function TemplatesPage(){


    const navigate = useNavigate();



    const [
        templates,
        setTemplates
    ] = useState<any[]>([]);



    const [
        loading,
        setLoading
    ] = useState(true);



    const [
        search,
        setSearch
    ] = useState("");



    const [
        status,
        setStatus
    ] = useState("");



    const [
        category,
        setCategory
    ] = useState("");



    const loadTemplates = async()=>{


        try{


            setLoading(true);



            const response =
                await templateApi.getTemplates();



            console.log(
                "Templates API:",
                response
            );



            setTemplates(
                response.data ?? response
            );


        }
        catch(error){


            console.error(
                "Template loading error",
                error
            );


            toast.error(
                "Failed to load templates"
            );


        }
        finally{


            setLoading(false);


        }


    };



    useEffect(()=>{


        loadTemplates();


    },[]);



    const categories =
        Array.from(
            new Set(
                templates
                    .map(
                        t=>t.category
                    )
                    .filter(Boolean)
            )
        );



    const filteredTemplates =
        useMemo(()=>{


            return templates.filter(
                template=>{


                    const nameMatch =
                        !search ||
                        template.name
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );



                    const statusMatch =
                        !status ||
                        template.status === status;



                    const categoryMatch =
                        !category ||
                        template.category === category;



                    return (
                        nameMatch &&
                        statusMatch &&
                        categoryMatch
                    );


                }
            );


        },[
            templates,
            search,
            status,
            category
        ]);



    const handleClone = async(id:number)=>{


        try{


            await templateApi.cloneTemplate(id);


            toast.success(
                "Template cloned"
            );


            loadTemplates();


        }
        catch{


            toast.error(
                "Clone failed"
            );


        }


    };
    const handlePublish = async(id:number)=>{


        try{


            await templateApi.publishTemplate(id);


            toast.success(
                "Template published"
            );


            loadTemplates();


        }
        catch{


            toast.error(
                "Publish failed"
            );


        }


    };



    const handleDelete = async(id:number)=>{


        const confirmDelete =
            window.confirm(
                "Delete this template?"
            );



        if(!confirmDelete)
            return;



        try{


            await templateApi.deleteTemplate(id);



            toast.success(
                "Template deleted"
            );



            loadTemplates();


        }
        catch{


            toast.error(
                "Delete failed"
            );


        }


    };



    if(loading){


        return (

            <div className="
                flex
                h-[70vh]
                items-center
                justify-center
            ">

                <div className="
                    text-center
                    space-y-3
                ">

                    <LayoutTemplate
                        className="
                            mx-auto
                            h-12
                            w-12
                            animate-pulse
                        "
                    />


                    <p className="
                        text-muted-foreground
                    ">
                        Loading templates...
                    </p>


                </div>


            </div>

        );


    }



    return (

        <div className="space-y-6">


            {/* HEADER */}

            <div className="
                flex
                items-center
                justify-between
            ">


                <div>


                    <h1 className="
                        text-3xl
                        font-bold
                    ">
                        Templates
                    </h1>


                    <p className="
                        text-muted-foreground
                    ">
                        Manage assessment templates
                    </p>


                </div>



                <Button
                    onClick={()=>
                        navigate("/templates/builder")
                    }
                >

                    <Plus className="
                        mr-2
                        h-4
                        w-4
                    "/>

                    Create Template

                </Button>


            </div>



            {/* SUMMARY CARDS */}


            <div className="
                grid
                gap-4
                md:grid-cols-4
            ">


                <Card>

                    <CardContent className="p-5">


                        <p className="text-sm text-muted-foreground">
                            Total Templates
                        </p>


                        <h2 className="
                            text-3xl
                            font-bold
                        ">
                            {templates.length}
                        </h2>


                    </CardContent>


                </Card>




                <Card>

                    <CardContent className="p-5">


                        <p className="text-sm text-muted-foreground">
                            Published
                        </p>


                        <h2 className="
                            text-3xl
                            font-bold
                        ">

                            {
                                templates.filter(
                                    t =>
                                        t.status==="PUBLISHED"
                                ).length
                            }

                        </h2>


                    </CardContent>


                </Card>




                <Card>

                    <CardContent className="p-5">


                        <p className="text-sm text-muted-foreground">
                            Draft
                        </p>


                        <h2 className="
                            text-3xl
                            font-bold
                        ">

                            {
                                templates.filter(
                                    t =>
                                        t.status==="DRAFT"
                                ).length
                            }

                        </h2>


                    </CardContent>


                </Card>




                <Card>

                    <CardContent className="p-5">


                        <p className="text-sm text-muted-foreground">
                            Categories
                        </p>


                        <h2 className="
                            text-3xl
                            font-bold
                        ">
                            {categories.length}
                        </h2>


                    </CardContent>


                </Card>



            </div>
            {/* FILTER AREA */}


            <Card>


                <CardContent className="
                    p-5
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-center
                    md:justify-between
                ">



                    <input

                        value={search}

                        onChange={
                            e =>
                                setSearch(
                                    e.target.value
                                )
                        }

                        placeholder="
                            Search template...
                        "

                        className="
                            border
                            rounded-md
                            px-3
                            py-2
                            w-full
                            md:w-80
                        "

                    />



                    <div className="
                        flex
                        gap-3
                    ">


                        <Select

                            value={status}

                            onValueChange={
                                setStatus
                            }

                            placeholder="Status"

                            options={[
                                {
                                    label:"All",
                                    value:""
                                },
                                {
                                    label:"Draft",
                                    value:"DRAFT"
                                },
                                {
                                    label:"Published",
                                    value:"PUBLISHED"
                                },
                                {
                                    label:"Archived",
                                    value:"ARCHIVED"
                                }
                            ]}

                        />



                        <Select

                            value={category}

                            onValueChange={
                                setCategory
                            }

                            placeholder="Category"


                            options={[
                                {
                                    label:"All",
                                    value:""
                                },

                                ...categories.map(
                                    c=>({
                                        label:c,
                                        value:c
                                    })
                                )
                            ]}

                        />


                    </div>


                </CardContent>


            </Card>





            {/* TEMPLATE LIST */}



            {
                filteredTemplates.length === 0 ?


                    (

                        <EmptyState

                            icon={LayoutTemplate}

                            title="No Templates"

                            description="
                            Create your first assessment template
                        "

                            action={

                                <Button

                                    onClick={()=>
                                        navigate(
                                            "/templates/builder"
                                        )
                                    }

                                >

                                    <Plus className="
                                    mr-2
                                    h-4
                                    w-4
                                "/>

                                    Create Template


                                </Button>

                            }

                        />

                    )


                    :

                    (

                        <div className="
                    grid
                    gap-6
                    md:grid-cols-2
                    xl:grid-cols-3
                ">


                            {

                                filteredTemplates.map(
                                    template=>(


                                        <Card

                                            key={
                                                template.id
                                            }

                                            className="
                                overflow-hidden
                                hover:shadow-lg
                                transition
                            "

                                        >



                                            <CardContent
                                                className="
                                    p-5
                                "
                                            >



                                                {/* TOP */}


                                                <div className="
                                    flex
                                    justify-between
                                ">



                                                    <div>


                                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                        ">


                                                            <LayoutTemplate
                                                                className="
                                                    h-6
                                                    w-6
                                                "
                                                            />


                                                            <h2 className="
                                                font-bold
                                                text-lg
                                            ">

                                                                {
                                                                    template.name
                                                                }


                                                            </h2>


                                                        </div>



                                                        <StatusBadge

                                                            status={
                                                                template.status
                                                            }

                                                        />


                                                    </div>





                                                    <DropdownMenu


                                                        trigger={

                                                            <Button

                                                                size="icon"

                                                                variant="ghost"

                                                            >

                                                                <MoreHorizontal
                                                                    className="
                                                        h-4
                                                        w-4
                                                    "
                                                                />


                                                            </Button>

                                                        }


                                                    >



                                                        <DropdownItem

                                                            onClick={()=>

                                                                navigate(
                                                                    `/templates/${template.id}`
                                                                )

                                                            }

                                                        >

                                                            <Eye className="h-4 w-4"/>

                                                            View

                                                        </DropdownItem>



                                                        <DropdownItem

                                                            onClick={()=>

                                                                navigate(
                                                                    `/templates/builder/${template.id}`
                                                                )

                                                            }

                                                        >

                                                            <Pencil className="h-4 w-4"/>

                                                            Edit

                                                        </DropdownItem>

                                                        <DropdownItem

                                                            onClick={()=>

                                                                handleClone(
                                                                    template.id
                                                                )

                                                            }

                                                        >

                                                            <Copy className="h-4 w-4"/>

                                                            Clone

                                                        </DropdownItem>




                                                        {
                                                            template.status !== "PUBLISHED" &&


                                                            (

                                                                <DropdownItem

                                                                    onClick={()=>

                                                                        handlePublish(
                                                                            template.id
                                                                        )

                                                                    }

                                                                >

                                                                    <Upload className="h-4 w-4"/>

                                                                    Publish


                                                                </DropdownItem>

                                                            )

                                                        }



                                                        <DropdownItem

                                                            className="
                                                text-red-600
                                            "

                                                            onClick={()=>

                                                                handleDelete(
                                                                    template.id
                                                                )

                                                            }

                                                        >

                                                            <Trash2 className="h-4 w-4"/>

                                                            Delete


                                                        </DropdownItem>



                                                    </DropdownMenu>


                                                </div>





                                                <p className="
                                    mt-4
                                    text-sm
                                    text-muted-foreground
                                ">

                                                    {
                                                        template.description ||
                                                        "No description available"
                                                    }

                                                </p>





                                                <div className="
                                    mt-4
                                    flex
                                    gap-2
                                ">


                                                    <Badge>

                                                        {
                                                            template.category ||
                                                            "General"
                                                        }

                                                    </Badge>



                                                    <Badge variant="outline">

                                                        Version {
                                                        template.version ?? 1
                                                    }

                                                    </Badge>



                                                </div>





                                                {/* COUNTS */}


                                                <div className="
                                    mt-5
                                    grid
                                    grid-cols-3
                                    gap-3
                                ">


                                                    <div className="
                                        border
                                        rounded-lg
                                        p-3
                                        text-center
                                    ">

                                                        <Layers className="
                                            mx-auto
                                            h-5
                                            w-5
                                        "/>


                                                        <p className="
                                            font-bold
                                        ">

                                                            {
                                                                template.topics?.length ?? 0
                                                            }

                                                        </p>


                                                        <span className="
                                            text-xs
                                            text-muted-foreground
                                        ">
                                            Topics
                                        </span>


                                                    </div>





                                                    <div className="
                                        border
                                        rounded-lg
                                        p-3
                                        text-center
                                    ">


                                                        <FileText className="
                                            mx-auto
                                            h-5
                                            w-5
                                        "/>


                                                        <p className="
                                            font-bold
                                        ">


                                                            {
                                                                template.topics?.reduce(

                                                                    (
                                                                        total:number,
                                                                        topic:any
                                                                    )=>

                                                                        total +
                                                                        (
                                                                            topic.questions?.length ?? 0
                                                                        ),

                                                                    0

                                                                ) ?? 0
                                                            }


                                                        </p>



                                                        <span className="
                                            text-xs
                                            text-muted-foreground
                                        ">

                                            Questions

                                        </span>


                                                    </div>





                                                    <div className="
                                        border
                                        rounded-lg
                                        p-3
                                        text-center
                                    ">


                                                        <TrendingUp className="
                                            mx-auto
                                            h-5
                                            w-5
                                        "/>


                                                        <p className="
                                            font-bold
                                        ">

                                                            {
                                                                template.usageCount ?? 0
                                                            }

                                                        </p>


                                                        <span className="
                                            text-xs
                                            text-muted-foreground
                                        ">

                                            Uses

                                        </span>


                                                    </div>


                                                </div>





                                                {/* ACTIONS */}



                                                <div className="
                                    mt-6
                                    flex
                                    justify-between
                                ">



                                                    <Button

                                                        variant="outline"

                                                        onClick={()=>

                                                            navigate(
                                                                `/templates/${template.id}`
                                                            )

                                                        }

                                                    >

                                                        <Eye className="
                                            mr-2
                                            h-4
                                            w-4
                                        "/>

                                                        View


                                                    </Button>





                                                    <Button

                                                        onClick={()=>

                                                            navigate(
                                                                `/templates/builder/${template.id}`
                                                            )

                                                        }

                                                    >

                                                        <Pencil className="
                                            mr-2
                                            h-4
                                            w-4
                                        "/>

                                                        Edit


                                                    </Button>


                                                </div>



                                            </CardContent>



                                        </Card>


                                    )

                                )


                            }



                        </div>


                    )

            }



        </div>

    );


}