import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTopics } from "@/features/topics/api";
import { templateApi } from "@/features/templates/templateApi";
import { toast } from "@/store/toast";

import {
    ArrowLeft,
    Save,
    Send,
    Layers,
    FolderOpen,
    Trash2,
    Search,
    Sparkles,
    LayoutTemplate,
    BookOpen,
    CheckCircle2,
    PlusCircle
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function TemplateBuilderPage() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    const [template, setTemplate] = useState({
        name: "",
        description: "",
        category: "Cyber Security"
    });

    const [topics, setTopics] = useState<any[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        getTopics()
            .then((res: any) => {

                setTopics(res.data.data ?? res.data);

            })
            .catch(() => {

                toast.error("Unable to load Topics");

            });

    }, []);

    useEffect(() => {

        if (!id) return;

        setLoading(true);

        templateApi.getTemplate(Number(id))
            .then((data: any) => {

                setTemplate({
                    name: data.name,
                    description: data.description,
                    category: data.category
                });

                setSelectedTopics(
                    data.topics?.map((t: any) => ({
                        id: t.topicId,
                        name: t.topicName,
                        status: t.status
                    })) ?? []
                );

            })
            .catch(() => {

                toast.error("Template not found");

            })
            .finally(() => setLoading(false));

    }, [id]);

    const addTopic = (topic: any) => {

        if (selectedTopics.some(t => t.id === topic.id)) {
            return;
        }

        setSelectedTopics(prev => [...prev, topic]);
    };

    const removeTopic = (id: number) => {

        setSelectedTopics(prev =>
            prev.filter(t => t.id !== id)
        );
    };

    const filteredTopics = useMemo(() => {

        return topics.filter((t: any) =>
            t.name.toLowerCase().includes(search.toLowerCase())
        );

    }, [topics, search]);

    const saveTemplate = async (status: string) => {

        const payload = {

            name: template.name,
            description: template.description,
            category: template.category,
            status,

            topics: selectedTopics.map(topic => ({
                topicId: topic.id
            }))

        };

        try {

            if (id) {

                await templateApi.updateTemplate(Number(id), payload);

            } else {

                await templateApi.createTemplate(payload);

            }

            toast.success(
                status === "PUBLISHED"
                    ? "Template Published Successfully"
                    : "Template Saved Successfully"
            );

            navigate("/templates");

        } catch {

            toast.error("Failed to save template");

        }
    };
    return (

        <>
            <PageHeader
                title={id ? "Edit Assessment Template" : "Create Assessment Template"}
                description="Design reusable enterprise questionnaires by organizing Topics into Templates."
                breadcrumbs={[
                    { label: "Templates" },
                    { label: id ? "Edit Template" : "Template Builder" }
                ]}
                actions={
                    <div className="flex gap-2">

                        <Button
                            variant="outline"
                            onClick={() => navigate("/templates")}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => saveTemplate("DRAFT")}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                        </Button>

                        <Button
                            onClick={() => saveTemplate("PUBLISHED")}
                        >
                            <Send className="mr-2 h-4 w-4" />
                            Publish
                        </Button>

                    </div>
                }
            />

            <div className="space-y-6">

                {/* HERO */}

                <Card className="overflow-hidden border-0 shadow-xl">

                    <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white">

                        <div className="flex items-center justify-between">

                            <div>

                                <div className="flex items-center gap-3">

                                    <LayoutTemplate className="h-8 w-8" />

                                    <div>

                                        <h2 className="text-3xl font-bold">

                                            {id
                                                ? "Edit Assessment Template"
                                                : "Enterprise Template Builder"}

                                        </h2>

                                        <p className="mt-2 text-blue-100">

                                            Build professional reusable assessment
                                            templates using Topics.

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <Sparkles className="h-14 w-14 opacity-70" />

                        </div>

                    </div>

                </Card>

                {/* STATISTICS */}

                <div className="grid gap-4 md:grid-cols-4">

                    <Card className="shadow-sm hover:shadow-lg transition-all">

                        <CardContent className="flex items-center justify-between p-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Selected Topics
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {selectedTopics.length}
                                </h2>

                            </div>

                            <Layers className="h-10 w-10 text-indigo-600" />

                        </CardContent>

                    </Card>

                    <Card className="shadow-sm hover:shadow-lg transition-all">

                        <CardContent className="flex items-center justify-between p-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Available Topics
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {topics.length}
                                </h2>

                            </div>

                            <BookOpen className="h-10 w-10 text-green-600" />

                        </CardContent>

                    </Card>

                    <Card className="shadow-sm hover:shadow-lg transition-all">

                        <CardContent className="flex items-center justify-between p-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Category
                                </p>

                                <h3 className="mt-2 font-semibold">
                                    {template.category}
                                </h3>

                            </div>

                            <FolderOpen className="h-10 w-10 text-orange-500" />

                        </CardContent>

                    </Card>

                    <Card className="shadow-sm hover:shadow-lg transition-all">

                        <CardContent className="flex items-center justify-between p-6">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>

                                <Badge className="mt-2 bg-amber-500">
                                    Draft
                                </Badge>

                            </div>

                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />

                        </CardContent>

                    </Card>

                </div>

                {/* MAIN GRID */}

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* LEFT */}

                    <div className="space-y-6 lg:col-span-2">

                        <Card className="shadow-lg">

                            <CardHeader>

                                <CardTitle className="flex items-center gap-2">

                                    <LayoutTemplate className="h-5 w-5 text-indigo-600" />

                                    Template Information

                                </CardTitle>

                            </CardHeader>

                            <CardContent className="space-y-5">

                                <div>

                                    <label className="mb-2 block text-sm font-medium">
                                        Template Name
                                    </label>

                                    <Input
                                        placeholder="ISO 27001 Vendor Assessment"
                                        value={template.name}
                                        onChange={(e) =>
                                            setTemplate({
                                                ...template,
                                                name: e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-medium">
                                        Description
                                    </label>

                                    <Textarea
                                        rows={5}
                                        placeholder="Describe the purpose of this assessment template..."
                                        value={template.description}
                                        onChange={(e) =>
                                            setTemplate({
                                                ...template,
                                                description: e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="flex items-center gap-3">

                            <span className="font-medium">
                                Category
                            </span>

                                    <Badge className="bg-indigo-600">

                                        {template.category}

                                    </Badge>

                                </div>

                            </CardContent>

                        </Card>
                        {/* SELECTED TOPICS */}

                        <Card className="shadow-lg">

                            <CardHeader>

                                <CardTitle className="flex items-center gap-2">

                                    <Layers className="h-5 w-5 text-indigo-600" />

                                    Selected Topics

                                    <Badge className="ml-auto">
                                        {selectedTopics.length}
                                    </Badge>

                                </CardTitle>

                            </CardHeader>

                            <CardContent>

                                {selectedTopics.length === 0 ? (

                                    <div className="rounded-lg border-2 border-dashed py-10 text-center">

                                        <Layers className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

                                        <p className="font-medium">
                                            No Topics Selected
                                        </p>

                                        <p className="text-sm text-muted-foreground mt-1">
                                            Choose topics from the Topic Bank.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-3">

                                        {selectedTopics.map((topic: any) => (

                                            <div
                                                key={topic.id}
                                                className="flex items-center justify-between rounded-xl border bg-gradient-to-r from-white to-slate-50 p-4 transition-all hover:shadow-md"
                                            >

                                                <div>

                                                    <h4 className="font-semibold">

                                                        {topic.name}

                                                    </h4>

                                                    <div className="mt-2 flex gap-2">

                                                        <Badge variant="outline">
                                                            Topic #{topic.id}
                                                        </Badge>

                                                        <Badge className="bg-green-600">
                                                            Selected
                                                        </Badge>

                                                    </div>

                                                </div>

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => removeTopic(topic.id)}
                                                >

                                                    <Trash2 className="h-4 w-4 text-red-600" />

                                                </Button>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </CardContent>

                        </Card>

                    </div>

                    {/* RIGHT PANEL */}

                    <div className="space-y-6">

                        {/* SUMMARY */}

                        <Card className="shadow-lg">

                            <CardHeader>

                                <CardTitle>

                                    Template Summary

                                </CardTitle>

                            </CardHeader>

                            <CardContent className="space-y-4">

                                <div className="flex justify-between">

                                    <span>Total Topics</span>

                                    <Badge>

                                        {selectedTopics.length}

                                    </Badge>

                                </div>

                                <div className="flex justify-between">

                                    <span>Category</span>

                                    <Badge variant="secondary">

                                        {template.category}

                                    </Badge>

                                </div>

                                <div className="flex justify-between">

                                    <span>Status</span>

                                    <Badge className="bg-yellow-500">

                                        Draft

                                    </Badge>

                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">

                                    <p className="text-sm text-muted-foreground">

                                        Templates become reusable assessments after publishing.

                                    </p>

                                </div>

                            </CardContent>

                        </Card>

                        {/* SEARCH */}

                        <Card className="shadow-lg">

                            <CardHeader>

                                <CardTitle>

                                    Topic Bank

                                </CardTitle>

                            </CardHeader>

                            <CardContent>

                                <div className="relative mb-4">

                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                                    <Input
                                        className="pl-10"
                                        placeholder="Search topics..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="space-y-3 max-h-[550px] overflow-auto">

                                    {filteredTopics.map((topic: any) => {

                                        const selected = selectedTopics.some(
                                            t => t.id === topic.id
                                        );

                                        return (

                                            <Card
                                                key={topic.id}
                                                className={`cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                                    selected
                                                        ? "border-indigo-500 bg-indigo-50"
                                                        : ""
                                                }`}
                                                onClick={() => addTopic(topic)}
                                            >

                                                <CardContent className="p-4">

                                                    <div className="flex items-start justify-between">

                                                        <div>

                                                            <h4 className="font-semibold">

                                                                {topic.name}

                                                            </h4>

                                                            <p className="mt-1 text-xs text-muted-foreground">

                                                                {topic.description}

                                                            </p>

                                                        </div>

                                                        {selected ? (

                                                            <CheckCircle2 className="h-5 w-5 text-green-600" />

                                                        ) : (

                                                            <PlusCircle className="h-5 w-5 text-indigo-600" />

                                                        )}

                                                    </div>

                                                    <div className="mt-3 flex gap-2">

                                                        <Badge variant="outline">

                                                            ID {topic.id}

                                                        </Badge>

                                                        <Badge>

                                                            {topic.status}

                                                        </Badge>

                                                    </div>

                                                </CardContent>

                                            </Card>

                                        );

                                    })}

                                </div>

                            </CardContent>

                        </Card>

                    </div>

                </div>

            </div>

        </>
    );}