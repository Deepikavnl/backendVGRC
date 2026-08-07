import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    ArrowLeft,
    Pencil,
    FolderOpen,
    FileText,
    ShieldCheck,
    CalendarDays,
    Clock,
    Hash,
    Search,
    Download,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
import { toast } from "@/store/toast";

interface TopicQuestion {
    id: number;
    code: string;
    questionText: string;
    questionType: string;
    weight: number;
    mandatory: boolean;
    status: string;
}

interface Topic {
    id: number;
    name: string;
    description: string;
    color: string;
    status: string;
    questionCount: number;
    createdAt: string;
    updatedAt: string;
    questions: TopicQuestion[];
}

export function TopicDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const topicId = Number(id);

    const [topic, setTopic] = useState<Topic | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!topicId || Number.isNaN(topicId)) {
            toast.error("Invalid Topic Id");
            setLoading(false);
            return;
        }

        const loadTopic = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    `http://localhost:8080/api/topics/${topicId}`
                );

                setTopic(response.data.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load topic");
            } finally {
                setLoading(false);
            }
        };

        loadTopic();
    }, [topicId]);

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="text-center">
                    <FolderOpen className="mx-auto mb-3 h-12 w-12 animate-pulse text-primary" />
                    <p className="text-muted-foreground">Loading Topic...</p>
                </div>
            </div>
        );
    }

    if (!topic) {
        return (
            <EmptyState
                icon={FolderOpen}
                title="Topic not found"
                description="Unable to find this topic."
            />
        );
    }

    const mandatoryQuestions = topic.questions.filter(
        (q) => q.mandatory
    ).length;

    const filteredQuestions = topic.questions.filter(
        (q) =>
            q.questionText.toLowerCase().includes(search.toLowerCase()) ||
            q.code.toLowerCase().includes(search.toLowerCase())
    );

    const exportQuestions = () => {
        const csv = [
            [
                "Code",
                "Question",
                "Type",
                "Weight",
                "Mandatory",
                "Status",
            ],
            ...topic.questions.map((q) => [
                q.code,
                q.questionText,
                q.questionType,
                q.weight,
                q.mandatory ? "Yes" : "No",
                q.status,
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${topic.name}-questions.csv`;
        link.click();
    };
    return (
        <>
            <PageHeader
                title={topic.name}
                description={topic.description || "Topic Details"}
                breadcrumbs={[
                    {
                        label: "Topics",
                        to: "/topics",
                    },
                    {
                        label: topic.name,
                    },
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>

                        <Button
                            variant="outline"
                            onClick={exportQuestions}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>

                        <Button
                            onClick={() =>
                                navigate(`/topics/edit/${topic.id}`)
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Topic
                        </Button>
                    </div>
                }
            />

            {/* Summary Cards */}

            <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                <Card className="border-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">
                                    Total Questions
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {topic.questionCount}
                                </h2>
                            </div>

                            <FileText className="h-10 w-10 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">
                                    Mandatory
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {mandatoryQuestions}
                                </h2>
                            </div>

                            <ShieldCheck className="h-10 w-10 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">
                                    Status
                                </p>

                                <h2 className="mt-2 text-2xl font-bold">
                                    {topic.status}
                                </h2>
                            </div>

                            <Hash className="h-10 w-10 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">
                                    Created
                                </p>

                                <h2 className="mt-2 text-lg font-semibold">
                                    {new Date(topic.createdAt).toLocaleDateString()}
                                </h2>
                            </div>

                            <CalendarDays className="h-10 w-10 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

            </div>
            {/* ==========================================
          Topic Details
      ========================================== */}

            <Card className="mb-6 border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        Topic Information
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">

                        <div>
                            <p className="mb-1 text-xs uppercase text-muted-foreground">
                                Topic Name
                            </p>

                            <h3 className="text-xl font-semibold">
                                {topic.name}
                            </h3>
                        </div>

                        <div>
                            <p className="mb-1 text-xs uppercase text-muted-foreground">
                                Status
                            </p>

                            <StatusBadge status={topic.status} />
                        </div>

                        <div>
                            <p className="mb-1 text-xs uppercase text-muted-foreground">
                                Description
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {topic.description || "No description available"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-xs uppercase text-muted-foreground">
                                Topic Color
                            </p>

                            <div className="flex items-center gap-3">
                                <div
                                    className="h-6 w-6 rounded-full border shadow-sm"
                                    style={{
                                        backgroundColor: topic.color,
                                    }}
                                />

                                <span className="font-medium">
                  {topic.color}
                </span>
                            </div>
                        </div>

                        <div>
                            <p className="mb-1 text-xs uppercase text-muted-foreground">
                                Total Questions
                            </p>

                            <Badge variant="secondary">
                                {topic.questionCount}
                            </Badge>
                        </div>

                        <div>
                            <p className="mb-1 text-xs uppercase text-muted-foreground">
                                Mandatory Questions
                            </p>

                            <Badge>
                                {mandatoryQuestions}
                            </Badge>
                        </div>

                        <div>
                            <p className="mb-1 text-xs uppercase text-muted-foreground">
                                Created On
                            </p>

                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-blue-600" />

                                {new Date(topic.createdAt).toLocaleString()}
                            </div>
                        </div>

                        <div>
                            <p className="mb-1 text-xs uppercase text-muted-foreground">
                                Last Updated
                            </p>

                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-600" />

                                {new Date(topic.updatedAt).toLocaleString()}
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            {/* ==========================================
          Questions Section Header
      ========================================== */}

            <Card className="border-0 shadow-md">
                <CardHeader>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />

                            Topic Questions

                            <Badge variant="secondary">
                                {filteredQuestions.length}
                            </Badge>
                        </CardTitle>

                        <div className="relative w-full md:w-80">

                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                            <Input
                                placeholder="Search question..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                    </div>

                </CardHeader>

                <CardContent>
                    {filteredQuestions.length === 0 ? (

                        <EmptyState
                            icon={FileText}
                            title="No Questions Found"
                            description="No questions match your search."
                        />

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                <tr className="border-b bg-slate-100">

                                    <th className="p-3 text-left w-16">#</th>

                                    <th className="p-3 text-left">Question</th>

                                    <th className="p-3 text-center">Code</th>

                                    <th className="p-3 text-center">Type</th>

                                    <th className="p-3 text-center">Weight</th>

                                    <th className="p-3 text-center">Mandatory</th>

                                    <th className="p-3 text-center">Status</th>

                                </tr>

                                </thead>

                                <tbody>

                                {filteredQuestions.map((question, index) => (

                                    <tr
                                        key={question.id}
                                        className="border-b transition hover:bg-slate-50"
                                    >

                                        <td className="p-4">

                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                                {index + 1}
                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="font-medium">
                                                {question.questionText}
                                            </div>

                                        </td>

                                        <td className="text-center">

                                            <Badge variant="outline">
                                                {question.code}
                                            </Badge>

                                        </td>

                                        <td className="text-center">

                                            <Badge variant="secondary">
                                                {question.questionType}
                                            </Badge>

                                        </td>

                                        <td className="text-center">

                                            <Badge variant="outline">
                                                {question.weight}
                                            </Badge>

                                        </td>

                                        <td className="text-center">

                                            {question.mandatory ? (

                                                <Badge>
                                                    Mandatory
                                                </Badge>

                                            ) : (

                                                <Badge variant="outline">
                                                    Optional
                                                </Badge>

                                            )}

                                        </td>

                                        <td className="text-center">

                                            <StatusBadge
                                                status={question.status}
                                            />

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </CardContent>

            </Card>

        </>

    );

}