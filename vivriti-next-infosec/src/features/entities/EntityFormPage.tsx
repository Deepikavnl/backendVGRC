import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { createEntity } from "@/services/entityService";


export function EntityFormPage() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        name: "",
        type: "",
        category: "",
        country: "",
        website: "",
        criticality: "",
        riskRating: "",
        complianceScore: 0,
        assessmentCount: 0,
        openFindings: 0,
        status: "",
        spend: 0

    });



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        try {

            await createEntity(formData);


            alert("Entity created successfully");


            navigate("/entities");


        } catch(error) {

            console.log(
                "Create Entity Error:",
                error
            );

            alert("Failed to create entity");

        }

    };



    return (

        <>

            <PageHeader

                title="Create Entity"

                description="Add new third party entity"

                breadcrumbs={[
                    {
                        label:"Entities"
                    },
                    {
                        label:"Create"
                    }
                ]}

            />



            <Card className="max-w-3xl">

                <CardContent className="p-6">


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >


                        <input
                            name="name"
                            placeholder="Entity Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <input
                            name="type"
                            placeholder="Type (Vendor/Supplier)"
                            value={formData.type}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <input
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <input
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <input
                            name="website"
                            placeholder="Website"
                            value={formData.website}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <input
                            name="criticality"
                            placeholder="Criticality"
                            value={formData.criticality}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <input
                            name="riskRating"
                            placeholder="Risk Rating"
                            value={formData.riskRating}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <input
                            name="status"
                            placeholder="Status"
                            value={formData.status}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <input
                            name="complianceScore"
                            type="number"
                            placeholder="Compliance Score"
                            value={formData.complianceScore}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <input
                            name="spend"
                            type="number"
                            placeholder="Annual Spend"
                            value={formData.spend}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        />



                        <div className="flex gap-3">


                            <Button
                                type="submit"
                            >
                                Save Entity
                            </Button>



                            <Button

                                type="button"

                                variant="outline"

                                onClick={() =>
                                    navigate("/entities")
                                }

                            >
                                Cancel
                            </Button>


                        </div>


                    </form>


                </CardContent>

            </Card>


        </>

    );

}