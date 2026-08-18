import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createEntity } from "@/services/entityService";

export function EntityFormPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        category: "",
        country: "",
        website: "",
        description: "",
        criticality: "",
        riskRating: "",
        status: "",
        businessInformation: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createEntity(formData);

            alert("Entity created successfully");

            navigate("/entities");
        } catch (error) {
            console.error(error);

            alert("Failed to create entity");
        }
    };

    return (
        <>
            <PageHeader
                title="Create Entity"
                description="Register a new Third-Party Vendor / Supplier"
                breadcrumbs={[
                    { label: "Entities" },
                    { label: "Create" },
                ]}
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* =====================================================
                    GENERAL INFORMATION
                ====================================================== */}

                <Card className="shadow-lg border">
                    <CardHeader className="border-b bg-slate-50">
                        <CardTitle className="text-xl font-bold text-blue-700">
                            General Information
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Entity Name */}
                            <div>
                                <Label className="font-semibold text-blue-700">
                                    Entity Name{" "}
                                    <span className="text-red-500">*</span>
                                </Label>

                                <Input
                                    name="name"
                                    placeholder="Enter entity name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-2"
                                    required
                                />
                            </div>

                            {/* Entity Type */}
                            <div>
                                <Label className="font-semibold text-blue-700">
                                    Entity Type{" "}
                                    <span className="text-red-500">*</span>
                                </Label>

                                <Input
                                    name="type"
                                    placeholder="Vendor / Supplier / Partner"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="mt-2"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <Label className="font-semibold text-blue-700">
                                    Category
                                </Label>

                                <Input
                                    name="category"
                                    placeholder="Cloud, Banking, Logistics..."
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-2"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <Label className="font-semibold text-blue-700">
                                    Country
                                </Label>

                                <Input
                                    name="country"
                                    placeholder="India"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="mt-2"
                                />
                            </div>

                            {/* Website */}
                            <div className="md:col-span-2">
                                <Label className="font-semibold text-blue-700">
                                    Website
                                </Label>

                                <Input
                                    name="website"
                                    placeholder="https://example.com"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="mt-2"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <Label className="font-semibold text-blue-700">
                                    Description
                                </Label>

                                <Textarea
                                    name="description"
                                    rows={4}
                                    placeholder="Brief description about the third-party organization..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-2 resize-none"
                                />
                            </div>

                        </div>
                    </CardContent>
                </Card>


                {/* =====================================================
                    RISK INFORMATION
                ====================================================== */}

                <Card className="shadow-lg border">
                    <CardHeader className="border-b bg-slate-50">
                        <CardTitle className="text-xl font-bold text-blue-700">
                            Risk Information
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Criticality */}
                            <div>
                                <Label className="font-semibold text-blue-700">
                                    Criticality{" "}
                                    <span className="text-red-500">*</span>
                                </Label>

                                <Input
                                    name="criticality"
                                    placeholder="High / Medium / Low"
                                    value={formData.criticality}
                                    onChange={handleChange}
                                    className="mt-2"
                                    required
                                />
                            </div>

                            {/* Risk Rating */}
                            <div>
                                <Label className="font-semibold text-blue-700">
                                    Risk Rating{" "}
                                    <span className="text-red-500">*</span>
                                </Label>

                                <Input
                                    name="riskRating"
                                    placeholder="Critical / High / Medium / Low"
                                    value={formData.riskRating}
                                    onChange={handleChange}
                                    className="mt-2"
                                    required
                                />
                            </div>

                            {/* Entity Status */}
                            <div className="md:col-span-2">
                                <Label className="font-semibold text-blue-700">
                                    Entity Status{" "}
                                    <span className="text-red-500">*</span>
                                </Label>

                                <Input
                                    name="status"
                                    placeholder="Active / Inactive / Suspended"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="mt-2"
                                    required
                                />
                            </div>

                        </div>
                    </CardContent>
                </Card>


                {/* =====================================================
                    BUSINESS INFORMATION
                ====================================================== */}

                <Card className="shadow-lg border">
                    <CardHeader className="border-b bg-slate-50">
                        <CardTitle className="text-xl font-bold text-blue-700">
                            Business Information
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">

                        <div>
                            <Label className="font-semibold text-blue-700">
                                Company Information
                            </Label>

                            <Textarea
                                name="businessInformation"
                                rows={5}
                                placeholder=""
                                value={formData.businessInformation || ""}
                                onChange={handleChange}
                                className="mt-2 resize-none"
                            />
                        </div>

                    </CardContent>
                </Card>


                {/* =====================================================
                    ACTION BUTTONS
                ====================================================== */}

                <Card className="shadow-lg border">
                    <CardContent className="flex items-center justify-between p-6">

                        <div>
                            <h3 className="font-semibold text-slate-800">
                                Ready to Create?
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Verify the information before creating the entity.
                            </p>
                        </div>

                        <div className="flex gap-3">

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/entities")}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Save Entity
                            </Button>

                        </div>

                    </CardContent>
                </Card>

            </form>
        </>
    );
}