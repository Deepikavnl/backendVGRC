
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { templateApi } from "@/features/templates/templateApi";
import { entityApi } from "@/api/entityApi";
import assessmentApi, {
    AssessmentRequest,
    Assessment
} from "./assessment";

import { reviewerApi } from "@/features/reviewer/reviewerApi";

import {
    PageHeader
} from "@/components/common/page-header";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import {
    Button
} from "@/components/ui/button";

import {
    Input
} from "@/components/ui/input";

import {
    Label
} from "@/components/ui/label";

import {
    ArrowLeft,
    Save,
    CheckCircle,
    Copy
} from "lucide-react";

import {
    toast
} from "@/store/toast";


export function AssessmentWizardPage() {

    const navigate = useNavigate();


    // =========================================================
    // DATA
    // =========================================================

    const [templates, setTemplates] = useState<any[]>([]);
    const [entities, setEntities] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [reviewers, setReviewers] = useState<any[]>([]);


    // =========================================================
    // FORM
    // IMPORTANT:
    // code is intentionally removed.
    // Backend will generate the Assessment Code automatically.
    // =========================================================

    const [form, setForm] = useState<AssessmentRequest>({
        entityId: 0,
        templateName: "",
        reviewerName: "",
        status: "DRAFT",
        progress: 0,
        dueDate: ""
    });


    const [selectedTeam, setSelectedTeam] =
        useState<number>(0);


    const [created, setCreated] =
        useState<Assessment | null>(null);


    const [loading, setLoading] =
        useState<boolean>(false);


    // =========================================================
    // LOAD TEMPLATES
    // =========================================================

    useEffect(() => {

        const loadTemplates = async () => {

            try {

                const data =
                    await templateApi.getTemplates();

                setTemplates(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load templates",
                    error
                );

                toast.error(
                    "Failed to load templates"
                );

            }

        };


        loadTemplates();

    }, []);


    // =========================================================
    // LOAD ENTITIES
    // =========================================================

    useEffect(() => {

        const loadEntities = async () => {

            try {

                const data =
                    await entityApi.getEntities();

                setEntities(
                    data?.data || data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load entities",
                    error
                );

                toast.error(
                    "Failed to load entities"
                );

            }

        };


        loadEntities();

    }, []);


    // =========================================================
    // LOAD TEAMS
    // =========================================================

    useEffect(() => {

        const loadTeams = async () => {

            try {

                const data =
                    await reviewerApi.getTeams();

                setTeams(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load teams",
                    error
                );

            }

        };


        loadTeams();

    }, []);


    // =========================================================
    // LOAD REVIEWERS WHEN TEAM CHANGES
    // =========================================================

    useEffect(() => {

        if (!selectedTeam) {

            setReviewers([]);

            return;

        }


        const loadReviewers = async () => {

            try {

                const data =
                    await reviewerApi.getReviewers(
                        selectedTeam
                    );

                setReviewers(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load reviewers",
                    error
                );

                setReviewers([]);

            }

        };


        loadReviewers();

    }, [selectedTeam]);


    // =========================================================
    // FORM VALUE CHANGE
    // =========================================================

    const changeValue = (
        field: keyof AssessmentRequest,
        value: any
    ) => {

        setForm((previous) => ({
            ...previous,
            [field]: value
        }));

    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const submit = async () => {

        // -----------------------------------------
        // Basic validation
        // -----------------------------------------

        if (!form.entityId) {

            toast.error(
                "Please select an entity"
            );

            return;

        }


        if (!form.templateName) {

            toast.error(
                "Please select a template"
            );

            return;

        }


        if (!selectedTeam) {

            toast.error(
                "Please select a team"
            );

            return;

        }


        if (!form.reviewerName) {

            toast.error(
                "Please select a reviewer"
            );

            return;

        }


        if (!form.dueDate) {

            toast.error(
                "Please select a due date"
            );

            return;

        }


        try {

            setLoading(true);


            // -----------------------------------------
            // Create assessment
            //
            // NO CODE IS SENT.
            // Backend generates it automatically.
            // -----------------------------------------

            const response =
                await assessmentApi.createAssessment(
                    form
                );


            setCreated(response);


            toast.success(
                "Assessment created successfully"
            );


        } catch (error) {

            console.error(
                "Assessment creation failed",
                error
            );


            toast.error(
                "Assessment creation failed"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // CREATED SCREEN
    // =========================================================

    if (created) {

        return (

            <div className="space-y-6">

                <PageHeader
                    title="Assessment Created"
                    description="Vendor assessment generated successfully"
                />


                <Card>

                    <CardContent className="space-y-6 p-6">

                        {/* SUCCESS */}

                        <div className="flex items-center gap-3 text-green-600">

                            <CheckCircle className="h-6 w-6" />

                            <h2 className="text-xl font-semibold">
                                Successfully Created
                            </h2>

                        </div>


                        {/* GENERATED ASSESSMENT CODE */}

                        <div>

                            <Label>
                                Assessment ID
                            </Label>

                            <div className="mt-2">

                                <Input
                                    readOnly
                                    value={
                                        created.code || ""
                                    }
                                />

                            </div>

                            <p className="mt-1 text-xs text-muted-foreground">
                                This Assessment ID was generated automatically.
                            </p>

                        </div>


                        {/* ENTITY */}

                        {created.entityName && (

                            <div>

                                <Label>
                                    Entity
                                </Label>

                                <Input
                                    readOnly
                                    value={
                                        created.entityName
                                    }
                                    className="mt-2"
                                />

                            </div>

                        )}


                        {/* TEMPLATE */}

                        {created.templateName && (

                            <div>

                                <Label>
                                    Template
                                </Label>

                                <Input
                                    readOnly
                                    value={
                                        created.templateName
                                    }
                                    className="mt-2"
                                />

                            </div>

                        )}


                        {/* VENDOR LINK */}

                        {created.assessmentLink && (

                            <div>

                                <Label>
                                    Vendor Assessment Link
                                </Label>


                                <div className="mt-2 flex gap-2">

                                    <Input
                                        readOnly
                                        value={
                                            created.assessmentLink
                                        }
                                    />


                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {

                                            navigator.clipboard.writeText(
                                                created.assessmentLink || ""
                                            );

                                            toast.success(
                                                "Vendor assessment link copied"
                                            );

                                        }}
                                    >

                                        <Copy className="h-4 w-4" />

                                    </Button>

                                </div>

                            </div>

                        )}


                        {/* ACTIONS */}

                        <div className="flex gap-3">

                            <Button
                                onClick={() =>
                                    navigate(
                                        "/assessments"
                                    )
                                }
                            >
                                View Assessments
                            </Button>


                            <Button
                                variant="outline"
                                onClick={() => {

                                    setCreated(null);

                                    setForm({
                                        entityId: 0,
                                        templateName: "",
                                        reviewerName: "",
                                        status: "DRAFT",
                                        progress: 0,
                                        dueDate: ""
                                    });

                                    setSelectedTeam(0);

                                }}
                            >
                                Create Another
                            </Button>

                        </div>

                    </CardContent>

                </Card>

            </div>

        );

    }


    // =========================================================
    // CREATE FORM
    // =========================================================

    return (

        <div className="space-y-6">

            <PageHeader
                title="Create Assessment"
                description="Create a third party security assessment"
            />


            <Card>

                <CardContent className="space-y-6 p-6">


                    {/* =================================================
                        ENTITY
                    ================================================= */}

                    <div className="space-y-2">

                        <Label>
                            Entity
                        </Label>


                        <select
                            value={
                                form.entityId || ""
                            }
                            onChange={(e) =>
                                changeValue(
                                    "entityId",
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="w-full rounded-md border p-2"
                        >

                            <option value="">
                                Select Entity
                            </option>


                            {entities.map(
                                (entity: any) => (

                                    <option
                                        key={entity.id}
                                        value={entity.id}
                                    >
                                        {entity.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* =================================================
                        TEMPLATE
                    ================================================= */}

                    <div className="space-y-2">

                        <Label>
                            Template
                        </Label>


                        <select
                            value={
                                form.templateName
                            }
                            onChange={(e) =>
                                changeValue(
                                    "templateName",
                                    e.target.value
                                )
                            }
                            className="w-full rounded-md border p-2"
                        >

                            <option value="">
                                Select Template
                            </option>


                            {templates.map(
                                (template: any) => (

                                    <option
                                        key={template.id}
                                        value={template.name}
                                    >
                                        {template.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* =================================================
                        TEAM
                    ================================================= */}

                    <div className="space-y-2">

                        <Label>
                            Team
                        </Label>


                        <select
                            className="w-full rounded-md border p-2"
                            value={selectedTeam}
                            onChange={(e) => {

                                const teamId =
                                    Number(
                                        e.target.value
                                    );

                                setSelectedTeam(
                                    teamId
                                );

                                changeValue(
                                    "reviewerName",
                                    ""
                                );

                            }}
                        >

                            <option value={0}>
                                Select Team
                            </option>


                            {teams.map(
                                (team: any) => (

                                    <option
                                        key={team.id}
                                        value={team.id}
                                    >
                                        {team.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* =================================================
                        REVIEWER
                    ================================================= */}

                    <div className="space-y-2">

                        <Label>
                            Reviewer
                        </Label>


                        <select
                            className="w-full rounded-md border p-2"
                            value={
                                form.reviewerName
                            }
                            disabled={
                                !selectedTeam
                            }
                            onChange={(e) =>
                                changeValue(
                                    "reviewerName",
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Reviewer
                            </option>


                            {reviewers.map(
                                (reviewer: any) => (

                                    <option
                                        key={reviewer.id}
                                        value={
                                            reviewer.reviewerName
                                        }
                                    >
                                        {
                                            reviewer.reviewerName
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* =================================================
                        DUE DATE
                    ================================================= */}

                    <div className="space-y-2">

                        <Label>
                            Due Date
                        </Label>


                        <Input
                            type="date"
                            value={
                                form.dueDate
                            }
                            onChange={(e) =>
                                changeValue(
                                    "dueDate",
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div className="space-y-2">

                        <Label>
                            Status
                        </Label>


                        <select
                            className="w-full rounded-md border p-2"
                            value={
                                form.status
                            }
                            onChange={(e) =>
                                changeValue(
                                    "status",
                                    e.target.value
                                )
                            }
                        >

                            <option value="DRAFT">
                                DRAFT
                            </option>

                            <option value="ASSIGNED">
                                ASSIGNED
                            </option>

                            <option value="IN_PROGRESS">
                                IN_PROGRESS
                            </option>

                            <option value="SUBMITTED">
                                SUBMITTED
                            </option>

                            <option value="UNDER_REVIEW">
                                UNDER_REVIEW
                            </option>

                            <option value="APPROVED">
                                APPROVED
                            </option>

                            <option value="COMPLETED">
                                COMPLETED
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="flex justify-between pt-4">

                        <Button
                            variant="outline"
                            onClick={() =>
                                navigate(
                                    "/assessments"
                                )
                            }
                        >

                            <ArrowLeft className="mr-2 h-4 w-4" />

                            Cancel

                        </Button>


                        <Button
                            disabled={
                                loading
                            }
                            onClick={
                                submit
                            }
                        >

                            <Save className="mr-2 h-4 w-4" />

                            {loading
                                ? "Creating..."
                                : "Create Assessment"
                            }

                        </Button>

                    </div>

                </CardContent>

            </Card>

        </div>

    );

}

