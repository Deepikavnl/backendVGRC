import { useEffect, useState } from "react";
import { createTopic, getTopics } from "./api";
import { Plus, FolderTree, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
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
    const [open, setOpen] = useState(false);

    const [topics, setTopics] = useState<any[]>([]);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#1f47d8");
    const [selectedTopic, setSelectedTopic] = useState<any>(null);
    const loadTopics = async () => {
        try {
            const res = await getTopics();

            console.log(res.data);

            if (Array.isArray(res.data)) {
                setTopics(res.data);
            } else if (Array.isArray(res.data.data)) {
                setTopics(res.data.data);
            } else {
                setTopics([]);
            }

            setTopics(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadTopics();
    }, []);

    const handleCreateTopic = async () => {
        if (!name.trim()) {
            toast.error("Topic name is required");
            return;
        }

        try {
            await createTopic({
                name,
                description,
                color,
            });

            toast.success("Topic created");

            setOpen(false);

            setName("");
            setDescription("");
            setColor("#1f47d8");

            loadTopics();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create topic");
        }
    };

    return (
        <>
            <PageHeader
                title="Topics"
                description="Control domains used to categorise questions and structure assessments."
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
                    <Button onClick={() => setOpen(true)}>
                        <Plus className="h-4 w-4" />
                        New Topic
                    </Button>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((t) => (
                    <Card
                        key={t.id}
                        className="group transition-shadow hover:shadow-elevated"
                    >
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                                    style={{
                                        background: `${t.color}18`,
                                        color: t.color,
                                    }}
                                >
                                    <FolderTree className="h-5 w-5" />
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedTopic(t)}
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                                {selectedTopic && (
                                    <div className="fixed inset-0 z-50">

                                        <div
                                            className="absolute inset-0"
                                            onClick={() => setSelectedTopic(null)}
                                        />

                                        <div className="absolute right-10 top-20 w-40 rounded-lg border bg-white shadow-lg">

                                            <button
                                                className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                                onClick={() =>
                                                    navigate(`/topics/${selectedTopic.id}`)
                                                }
                                            >
                                                <Eye className="h-4 w-4"/>
                                                View
                                            </button>


                                            <button
                                                className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                                onClick={() =>
                                                    navigate(`/topics/edit/${selectedTopic.id}`)
                                                }
                                            >
                                                <Pencil className="h-4 w-4"/>
                                                Edit
                                            </button>


                                            <button
                                                className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                )}
                            </div>

                            <h3 className="mt-3 font-semibold">
                                {t.name}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                {t.description}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <Badge variant="secondary">
                                    {t.questionCount ?? 0} Questions
                                </Badge>

                                <span className="font-mono text-xs text-muted-foreground">
                  {t.id}
                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog
                open={open}
                onOpenChange={setOpen}
            >
                <DialogHeader>
                    <DialogTitle>
                        New Topic
                    </DialogTitle>
                </DialogHeader>

                <DialogBody className="space-y-4">

                    <div className="space-y-2">
                        <Label>Name</Label>

                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Application Security"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>

                        <Textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe this topic..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Colour</Label>

                        <div className="flex gap-2 flex-wrap">
                            {[
                                "#1f47d8",
                                "#0ea5e9",
                                "#8b5cf6",
                                "#ec4899",
                                "#10b981",
                                "#f59e0b",
                            ].map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`h-8 w-8 rounded-full border-2 ${
                                        color === c
                                            ? "border-black"
                                            : "border-transparent"
                                    }`}
                                    style={{
                                        background: c,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </DialogBody>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleCreateTopic}
                    >
                        Create Topic
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}