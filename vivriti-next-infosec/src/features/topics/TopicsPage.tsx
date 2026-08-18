
import { useEffect, useState } from "react";
import {
    createTopic,
    getTopics,
    importTopics,
    downloadTopicTemplate,
} from "./api";

import {
    Plus,
    FolderTree,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    Download,
    Upload,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/common/page-header";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";

import { toast } from "@/store/toast";


export function TopicsPage() {

    // =========================================================
    // STATE
    // =========================================================

    const [open, setOpen] = useState(false);

    const [topics, setTopics] = useState<any[]>([]);

    const [topicFile, setTopicFile] =
        useState<File | null>(null);

    const [name, setName] = useState("");

    const [description, setDescription] =
        useState("");

    const [color, setColor] =
        useState("#1f47d8");

    const [selectedTopic, setSelectedTopic] =
        useState<any>(null);

    const navigate = useNavigate();


    // =========================================================
    // LOAD TOPICS
    // =========================================================

    const loadTopics = async () => {

        try {

            const res = await getTopics();

            console.log(
                "TOPICS RESPONSE:",
                res.data
            );


            /*
             * Backend may return:
             *
             * [
             *   {...},
             *   {...}
             * ]
             *
             * OR:
             *
             * {
             *   data: [...]
             * }
             */

            if (Array.isArray(res.data)) {

                setTopics(res.data);

            } else if (
                res.data &&
                Array.isArray(res.data.data)
            ) {

                setTopics(res.data.data);

            } else {

                setTopics([]);

            }

        } catch (err) {

            console.error(
                "Failed to load topics:",
                err
            );

            setTopics([]);

            toast.error(
                "Failed to load topics"
            );
        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadTopics();

    }, []);


    // =========================================================
    // CREATE TOPIC
    // =========================================================

    const handleCreateTopic = async () => {

        if (!name.trim()) {

            toast.error(
                "Topic name is required"
            );

            return;
        }


        try {

            await createTopic({

                name,

                description,

                color,

            });


            toast.success(
                "Topic created"
            );


            setOpen(false);

            setName("");

            setDescription("");

            setColor("#1f47d8");


            await loadTopics();

        } catch (err) {

            console.error(
                "Create topic error:",
                err
            );

            toast.error(
                "Failed to create topic"
            );
        }
    };


    // =========================================================
    // DOWNLOAD TOPIC EXCEL TEMPLATE
    // =========================================================

    const handleDownloadTopicTemplate =
        async () => {

            try {

                const response =
                    await downloadTopicTemplate();


                const url =
                    window.URL.createObjectURL(
                        response.data
                    );


                const link =
                    document.createElement("a");


                link.href = url;

                link.download =
                    "Topic_Import_Template.xlsx";


                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);


                window.URL.revokeObjectURL(
                    url
                );

            } catch (error) {

                console.error(
                    "Download template error:",
                    error
                );

                toast.error(
                    "Failed to download template"
                );
            }
        };


    // =========================================================
    // TOPIC EXCEL IMPORT
    // =========================================================

    const handleTopicImport = async () => {

        if (!topicFile) {

            toast.error(
                "Please select Excel file"
            );

            return;
        }


        try {

            await importTopics(
                topicFile
            );


            toast.success(
                "Topics imported successfully"
            );


            setTopicFile(null);


            /*
             * Reset file input so the same file
             * can be selected again if required.
             */

            const input =
                document.getElementById(
                    "excel-upload"
                ) as HTMLInputElement | null;


            if (input) {

                input.value = "";

            }


            await loadTopics();

        } catch (error) {

            console.error(
                "Topic import error:",
                error
            );

            toast.error(
                "Topic import failed"
            );
        }
    };


    // =========================================================
    // OPEN TOPIC MENU
    // =========================================================

    const handleOpenMenu = (
        topic: any
    ) => {

        setSelectedTopic(topic);

    };


    // =========================================================
    // CLOSE TOPIC MENU
    // =========================================================

    const handleCloseMenu = () => {

        setSelectedTopic(null);

    };


    // =========================================================
    // VIEW TOPIC
    // =========================================================

    const handleViewTopic = () => {

        if (!selectedTopic?.id) {

            return;
        }


        navigate(
            `/topics/${selectedTopic.id}`
        );


        setSelectedTopic(null);
    };


    // =========================================================
    // EDIT TOPIC
    // =========================================================

    const handleEditTopic = () => {

        if (!selectedTopic?.id) {

            return;
        }


        navigate(
            `/topics/edit/${selectedTopic.id}`
        );


        setSelectedTopic(null);
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <>

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <PageHeader

                title="Topics"

                description={
                    "Control domains used to categorise " +
                    "questions and structure assessments."
                }

                breadcrumbs={[
                    {
                        label: "Question Master",
                        to: "/questions",
                    },
                    {
                        label: "Topics",
                    },
                ]}

                actions={

                    <>

                        {/* =====================================
                            EXCEL ACTIONS
                        ===================================== */}

                        <div className="flex gap-2">

                            {/* Hidden file input */}

                            <input
                                id="excel-upload"
                                type="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                onChange={(e) => {

                                    const file =
                                        e.target.files?.[0];


                                    if (file) {

                                        setTopicFile(
                                            file
                                        );


                                        toast.success(
                                            `${file.name} selected`
                                        );
                                    }

                                }}
                            />


                            {/* Download Template */}

                            <Button
                                variant="outline"
                                onClick={
                                    handleDownloadTopicTemplate
                                }
                            >

                                <Download
                                    className="h-4 w-4 mr-2"
                                />

                                Download Template

                            </Button>


                            {/* Choose Excel */}

                            <Button
                                variant="outline"
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "excel-upload"
                                        )
                                        ?.click()
                                }
                            >

                                <Upload
                                    className="h-4 w-4 mr-2"
                                />

                                Choose Excel

                            </Button>

                        </div>


                        {/* =====================================
                            IMPORT TOPICS
                        ===================================== */}

                        <Button
                            variant="outline"
                            onClick={
                                handleTopicImport
                            }
                        >

                            Import Topics

                        </Button>


                        {/* =====================================
                            NEW TOPIC
                        ===================================== */}

                        <Button
                            onClick={() =>
                                setOpen(true)
                            }
                        >

                            <Plus
                                className="h-4 w-4"
                            />

                            New Topic

                        </Button>

                    </>
                }
            />


            {/* =================================================
                TOPIC CARDS
            ================================================= */}

            <div
                className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                "
            >

                {(topics ?? []).map(
                    (t) => (

                        <Card
                            key={t.id}
                            className="
                                group
                                transition-shadow
                                hover:shadow-elevated
                            "
                        >

                            <CardContent
                                className="p-5"
                            >

                                {/* =================================
                                    TOP SECTION
                                ================================= */}

                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                    "
                                >

                                    {/* Topic icon */}

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-lg
                                        "
                                        style={{
                                            background:
                                                `${t.color || "#1f47d8"}18`,
                                            color:
                                                t.color ||
                                                "#1f47d8",
                                        }}
                                    >

                                        <FolderTree
                                            className="h-5 w-5"
                                        />

                                    </div>


                                    {/* Menu button */}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleOpenMenu(
                                                t
                                            )
                                        }
                                    >

                                        <MoreVertical
                                            className="h-4 w-4"
                                        />

                                    </Button>

                                </div>


                                {/* =================================
                                    TOPIC NAME
                                ================================= */}

                                <h3
                                    className="
                                        mt-3
                                        font-semibold
                                    "
                                >

                                    {t.name}

                                </h3>


                                {/* =================================
                                    DESCRIPTION
                                ================================= */}

                                <p
                                    className="
                                        mt-1
                                        line-clamp-2
                                        text-sm
                                        text-muted-foreground
                                    "
                                >

                                    {t.description ||
                                        "No description available"}

                                </p>


                                {/* =================================
                                    FOOTER
                                ================================= */}

                                <div
                                    className="
                                        mt-4
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <Badge
                                        variant="secondary"
                                    >

                                        {t.questionCount ??
                                            0}

                                        {" "}
                                        Questions

                                    </Badge>


                                    <span
                                        className="
                                            font-mono
                                            text-xs
                                            text-muted-foreground
                                        "
                                    >

                                        {t.id}

                                    </span>

                                </div>

                            </CardContent>

                        </Card>

                    )
                )}

            </div>


            {/* =================================================
                TOPIC MENU
            ================================================= */}

            {selectedTopic && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                    "
                >

                    {/* Overlay */}

                    <div
                        className="
                            absolute
                            inset-0
                        "
                        onClick={
                            handleCloseMenu
                        }
                    />


                    {/* Menu */}

                    <div
                        className="
                            absolute
                            right-10
                            top-20
                            w-40
                            rounded-lg
                            border
                            bg-white
                            shadow-lg
                        "
                    >

                        {/* View */}

                        <button
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                px-4
                                py-2
                                hover:bg-gray-100
                            "
                            onClick={
                                handleViewTopic
                            }
                        >

                            <Eye
                                className="h-4 w-4"
                            />

                            View

                        </button>


                        {/* Edit */}

                        <button
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                px-4
                                py-2
                                hover:bg-gray-100
                            "
                            onClick={
                                handleEditTopic
                            }
                        >

                            <Pencil
                                className="h-4 w-4"
                            />

                            Edit

                        </button>


                        {/* Delete */}

                        <button
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                px-4
                                py-2
                                text-red-600
                                hover:bg-gray-100
                            "
                            onClick={() => {

                                toast.error(
                                    "Delete functionality is not implemented yet"
                                );

                                setSelectedTopic(
                                    null
                                );

                            }}
                        >

                            <Trash2
                                className="h-4 w-4"
                            />

                            Delete

                        </button>

                    </div>

                </div>

            )}


            {/* =================================================
                CREATE TOPIC DIALOG
            ================================================= */}

            <Dialog
                open={open}
                onOpenChange={setOpen}
            >

                <DialogHeader>

                    <DialogTitle>
                        New Topic
                    </DialogTitle>

                </DialogHeader>


                <DialogBody
                    className="space-y-4"
                >

                    {/* Name */}

                    <div
                        className="space-y-2"
                    >

                        <Label>
                            Name
                        </Label>


                        <Input
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="Application Security"
                        />

                    </div>


                    {/* Description */}

                    <div
                        className="space-y-2"
                    >

                        <Label>
                            Description
                        </Label>


                        <Textarea
                            rows={3}
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Describe this topic..."
                        />

                    </div>


                    {/* Colour */}

                    <div
                        className="space-y-2"
                    >

                        <Label>
                            Colour
                        </Label>


                        <div
                            className="
                                flex
                                gap-2
                                flex-wrap
                            "
                        >

                            {[
                                "#1f47d8",
                                "#0ea5e9",
                                "#8b5cf6",
                                "#ec4899",
                                "#10b981",
                                "#f59e0b",
                            ].map(
                                (c) => (

                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() =>
                                            setColor(c)
                                        }
                                        className={`
h-8
w-8
rounded-full
border-2
${
    color === c
        ? "border-black"
        : "border-transparent"
}
`}
                                        style={{
                                            background: c,
                                        }}
                                    />

                                )
                            )}

                        </div>

                    </div>

                </DialogBody>


                {/* =============================================
                    DIALOG FOOTER
                ============================================= */}

                <DialogFooter>

                    <Button
                        variant="outline"
                        onClick={() =>
                            setOpen(false)
                        }
                    >

                        Cancel

                    </Button>


                    <Button
                        onClick={
                            handleCreateTopic
                        }
                    >

                        Create Topic

                    </Button>

                </DialogFooter>

            </Dialog>

        </>
    );
}

