import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Plus,
    Download,
    Copy,
    Archive,
    MoreHorizontal,
    HelpCircle,
    Filter,
    Pencil,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Toolbar, SearchInput } from "@/components/common/toolbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
import { DropdownMenu, DropdownItem } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Drawer } from "@/components/ui/drawer";

import { exportToCSV } from "@/lib/export";
import { toast } from "@/store/toast";
import { formatDate } from "@/lib/utils";

import { topics } from "@/data/mock";
import { getQuestions } from "./api";

const typeLabels: Record<string, string> = {
    TEXT: "Short Text",
    PARAGRAPH: "Paragraph",
    YESNO: "Yes / No",
    DROPDOWN: "Dropdown",
    CHECKBOX: "Checkbox",
    NUMBER: "Number",
    DATE: "Date",
    FILE: "File Upload",
};

const PAGE_SIZE = 12;

export function QuestionBankPage() {
    const navigate = useNavigate();

    const [allQuestions, setAllQuestions] = useState<any[]>([]);

    const [search, setSearch] = useState("");
    const [topic, setTopic] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);

    const [selected, setSelected] = useState<Set<number>>(new Set());

    const [preview, setPreview] = useState<any>(null);

    const [confirmArchive, setConfirmArchive] = useState(false);

    useEffect(() => {
        loadQuestions();
    }, []);
    const loadQuestions = async () => {
        try {
            const res = await getQuestions();

            console.log("Backend Response:", res.data);
            console.log("Is Array:", Array.isArray(res.data));

            setAllQuestions(res.data.data);

        } catch (err) {
            console.error(err);
        }
    };
    const filtered = useMemo(() => {
        if (!Array.isArray(allQuestions)) {
            return [];
        }

        return allQuestions.filter((q: any) => {
            const matchesSearch =
                !search ||
                q.questionText?.toLowerCase().includes(search.toLowerCase()) ||
                q.code?.toLowerCase().includes(search.toLowerCase());

            const matchesTopic =
                !topic || String(q.topicId) === topic;

            const matchesType =
                !type || q.questionType === type;

            const matchesStatus =
                !status || q.status === status;

            return (
                matchesSearch &&
                matchesTopic &&
                matchesType &&
                matchesStatus
            );
        });
    }, [allQuestions, search, topic, type, status]);

    const pageData = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const allSelected =
        pageData.length > 0 &&
        pageData.every((q: any) => selected.has(q.id));

    const toggleAll = () => {
        const next = new Set(selected);

        if (allSelected) {
            pageData.forEach((q: any) => next.delete(q.id));
        } else {
            pageData.forEach((q: any) => next.add(q.id));
        }

        setSelected(next);
    };

    const toggle = (id: number) => {
        const next = new Set(selected);

        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }

        setSelected(next);
    };

    return (
        <>
            <PageHeader
                title="Question Master"
                description="Central repository of all assessment questions."
                breadcrumbs={[
                    { label: "Question Master" },
                    { label: "Question Bank" },
                ]}
                actions={
                    <>
                        <Button
                            variant="outline"
                            onClick={() =>
                                exportToCSV(
                                    "questions",
                                    filtered.map((q: any) => ({
                                        Code: q.code,
                                        Question: q.questionText,
                                        Type: q.questionType,
                                        Weight: q.weight,
                                        Mandatory: q.mandatory,
                                        Status: q.status,
                                    }))
                                )
                            }
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>

                        <Button onClick={() => navigate("/questions/new")}>
                            <Plus className="h-4 w-4" />
                            New Question
                        </Button>
                    </>
                }
            />

            <Toolbar>
                <SearchInput
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        setPage(1);
                    }}
                    placeholder="Search Questions..."
                    className="w-full sm:max-w-xs"
                />

                <div className="flex flex-wrap gap-2">
                    <Select
                        value={topic}
                        onValueChange={(v) => {
                            setTopic(v);
                            setPage(1);
                        }}
                        placeholder="All Topics"
                        className="w-40"
                        options={[
                            { label: "All Topics", value: "" },
                            ...topics.map((t) => ({
                                label: t.name,
                                value: String(t.id),
                            })),
                        ]}
                    />

                    <Select
                        value={type}
                        onValueChange={(v) => {
                            setType(v);
                            setPage(1);
                        }}
                        placeholder="All Types"
                        className="w-40"
                        options={[
                            { label: "All Types", value: "" },
                            { label: "Short Text", value: "TEXT" },
                            { label: "Paragraph", value: "PARAGRAPH" },
                            { label: "Yes / No", value: "YESNO" },
                            { label: "Dropdown", value: "DROPDOWN" },
                            { label: "Checkbox", value: "CHECKBOX" },
                            { label: "Number", value: "NUMBER" },
                            { label: "Date", value: "DATE" },
                            { label: "File Upload", value: "FILE" },
                        ]}
                    />

                    <Select
                        value={status}
                        onValueChange={(v) => {
                            setStatus(v);
                            setPage(1);
                        }}
                        placeholder="Status"
                        className="w-36"
                        options={[
                            { label: "All", value: "" },
                            { label: "Draft", value: "DRAFT" },
                            { label: "Published", value: "PUBLISHED" },
                            { label: "Archived", value: "ARCHIVED" },
                        ]}
                    />
                </div>
            </Toolbar>

            <Card>
                {filtered.length === 0 ? (
                    <EmptyState
                        icon={HelpCircle}
                        title="No Questions Found"
                        description="Create your first question."
                        action={
                            <Button onClick={() => navigate("/questions/new")}>
                                <Plus className="h-4 w-4" />
                                New Question
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10">
                                        <Checkbox
                                            checked={allSelected}
                                            onCheckedChange={toggleAll}
                                        />
                                    </TableHead>

                                    <TableHead>Code</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {pageData.map((q: any) => (
                                    <TableRow key={q.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selected.has(q.id)}
                                                onCheckedChange={() => toggle(q.id)}
                                            />
                                        </TableCell>

                                        <TableCell>{q.code}</TableCell>

                                        <TableCell>
                                            <button
                                                onClick={() => setPreview(q)}
                                                className="font-medium hover:text-primary"
                                            >
                                                {q.questionText}
                                            </button>

                                            {q.mandatory && (
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2"
                                                >
                                                    Required
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {typeLabels[q.questionType]}
                                        </TableCell>

                                        <TableCell>
                                            <Badge>{q.weight}</Badge>
                                        </TableCell>

                                        <TableCell>
                                            <StatusBadge status={q.status} />
                                        </TableCell>

                                        <TableCell>
                                            {formatDate(q.updatedAt)}
                                        </TableCell>

                                        <TableCell>
                                            <DropdownMenu
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                }
                                            >
                                                <DropdownItem
                                                    onClick={() => setPreview(q)}
                                                >
                                                    <Filter />
                                                    Preview
                                                </DropdownItem>

                                                <DropdownItem
                                                    onClick={() =>
                                                        navigate(`/questions/${q.id}/edit`)
                                                    }
                                                >
                                                    <Pencil />
                                                    Edit
                                                </DropdownItem>

                                                <DropdownItem
                                                    onClick={() =>
                                                        toast.success("Question cloned")
                                                    }
                                                >
                                                    <Copy />
                                                    Clone
                                                </DropdownItem>

                                                <DropdownItem
                                                    destructive
                                                    onClick={() =>
                                                        toast.warning("Question archived")
                                                    }
                                                >
                                                    <Archive />
                                                    Archive
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                    </>
                )}
            </Card>
            <Drawer
                open={!!preview}
                onOpenChange={(open) => {
                    if (!open) setPreview(null);
                }}
                title={preview?.code}
                description="Question Preview"
                width="max-w-md"
            >
                {preview && (
                    <div className="space-y-5 p-5">

                        <div>
                            <p className="text-xs font-medium uppercase text-muted-foreground">
                                Question
                            </p>

                            <p className="mt-1 font-medium">
                                {preview.questionText}
                            </p>

                            {preview.helpText && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {preview.helpText}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <p className="text-xs uppercase text-muted-foreground">
                                    Code
                                </p>
                                <p>{preview.code}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-muted-foreground">
                                    Type
                                </p>
                                <p>{typeLabels[preview.questionType]}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-muted-foreground">
                                    Weight
                                </p>
                                <p>{preview.weight}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-muted-foreground">
                                    Mandatory
                                </p>
                                <p>{preview.mandatory ? "Yes" : "No"}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-muted-foreground">
                                    Status
                                </p>
                                <StatusBadge status={preview.status} />
                            </div>

                            <div>
                                <p className="text-xs uppercase text-muted-foreground">
                                    Updated
                                </p>
                                <p>{formatDate(preview.updatedAt)}</p>
                            </div>

                        </div>

                        <Button
                            className="w-full"
                            onClick={() =>
                                navigate(`/questions/${preview.id}/edit`)
                            }
                        >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Question
                        </Button>

                    </div>
                )}
            </Drawer>

            <ConfirmDialog
                open={confirmArchive}
                onOpenChange={setConfirmArchive}
                title="Archive Questions?"
                description={`${selected.size} question(s) will be archived.`}
                confirmLabel="Archive"
                onConfirm={() => {
                    toast.warning("Questions archived");
                    setSelected(new Set());
                    setConfirmArchive(false);
                }}
            />
        </>
    );
}