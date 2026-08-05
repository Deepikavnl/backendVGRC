import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Pencil } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { toast } from "@/store/toast";


export function TopicEditPage() {

    const { id } = useParams();
    const navigate = useNavigate();


    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#1f47d8");


    useEffect(() => {

        // temporary data loading
        // API connection will be added next

        setName("Cyber Security");
        setDescription("Security related questions");
        setColor("#1f47d8");

    }, [id]);


    const handleUpdate = () => {

        toast.success("Topic updated successfully");

        navigate("/topics");

    };


    return (
        <>
            <PageHeader
                title="Edit Topic"
                description="Update topic details and configuration."
                breadcrumbs={[
                    {
                        label: "Question Master",
                        to: "/questions",
                    },
                    {
                        label: "Topics",
                        to: "/topics",
                    },
                    {
                        label: "Edit Topic",
                    },
                ]}
            />


            <Card className="max-w-3xl">

                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Pencil className="h-5 w-5"/>
                        Topic Details
                    </CardTitle>
                </CardHeader>


                <CardContent className="space-y-5">


                    <div className="space-y-2">
                        <Label>
                            Topic Name
                        </Label>

                        <Input
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>



                    <div className="space-y-2">
                        <Label>
                            Description
                        </Label>

                        <Textarea
                            rows={4}
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                        />
                    </div>



                    <div className="space-y-2">
                        <Label>
                            Color
                        </Label>

                        <Input
                            type="color"
                            value={color}
                            onChange={(e)=>setColor(e.target.value)}
                        />
                    </div>



                    <div className="flex justify-end gap-3">

                        <Button
                            variant="outline"
                            onClick={()=>navigate("/topics")}
                        >
                            Cancel
                        </Button>


                        <Button
                            onClick={handleUpdate}
                        >
                            Update Topic
                        </Button>

                    </div>


                </CardContent>

            </Card>
        </>
    );
}