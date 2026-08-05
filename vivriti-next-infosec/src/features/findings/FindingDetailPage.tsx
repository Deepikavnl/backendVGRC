import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    AlertTriangle,
    Calendar,
    User,
    ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import {
    RiskBadge,
    StatusBadge,
} from "@/components/common/status-badge";

import { formatDate } from "@/lib/utils";
import * as findingApi from "./findingApi";

export function FindingDetailPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [finding, setFinding] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!id) return;

        findingApi
            .getFindingById(Number(id))
            .then((response: any) => {

                setFinding(response.data);

            })
            .catch((error) => {

                console.error(error);

            })
            .finally(() => {

                setLoading(false);

            });

    }, [id]);

    if (loading) {

        return (
            <div className="p-6">
                Loading finding...
            </div>
        );

    }

    if (!finding) {

        return (
            <div className="p-6">

                <Button
                    variant="ghost"
                    onClick={() => navigate("/findings")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <div className="mt-6">
                    Finding not found.
                </div>

            </div>
        );

    }

    return (

        <>

            <PageHeader
                title={finding.title}
                description={finding.code}
                actions={
                    <Button
                        variant="outline"
                        onClick={() => navigate("/findings")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-2">

                <Card className="p-6 space-y-4">

                    <h2 className="text-lg font-semibold">
                        Finding Information
                    </h2>

                    <div className="space-y-3">

                        <div>

                            <p className="text-xs text-muted-foreground">
                                Finding Code
                            </p>

                            <p className="font-medium">
                                {finding.code}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-muted-foreground">
                                Entity
                            </p>

                            <p>
                                {finding.entityName}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-muted-foreground">
                                Topic
                            </p>

                            <p>
                                {finding.topic}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-muted-foreground">
                                Severity
                            </p>

                            <RiskBadge
                                level={finding.severity}
                            />

                        </div>

                        <div>

                            <p className="text-xs text-muted-foreground">
                                Status
                            </p>

                            <StatusBadge
                                status={finding.status}
                            />

                        </div>

                    </div>

                </Card>

                <Card className="p-6 space-y-4">

                    <h2 className="text-lg font-semibold">
                        Assignment
                    </h2>

                    <div className="flex items-center gap-3">

                        <User className="h-5 w-5 text-muted-foreground" />

                        <div>

                            <p className="text-xs text-muted-foreground">
                                Owner
                            </p>

                            <p>
                                {finding.owner}
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <Calendar className="h-5 w-5 text-muted-foreground" />

                        <div>

                            <p className="text-xs text-muted-foreground">
                                Due Date
                            </p>

                            <p>
                                {formatDate(finding.dueDate)}
                            </p>

                        </div>

                    </div>

                </Card>

                <Card className="p-6 lg:col-span-2">

                    <h2 className="mb-4 text-lg font-semibold">
                        Recommendation
                    </h2>

                    <p className="text-sm leading-6">
                        {finding.recommendation || "No recommendation available."}
                    </p>

                </Card>

                <Card className="p-6 lg:col-span-2">

                    <h2 className="mb-4 text-lg font-semibold">
                        Description
                    </h2>

                    <p className="text-sm leading-6">
                        {finding.description || "No description available."}
                    </p>

                </Card>

            </div>

        </>

    );

}