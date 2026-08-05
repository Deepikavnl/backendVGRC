import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, Plus, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import {
  createQuestion,
  getQuestionById,
  updateQuestion,
} from "./api";

import { getTopics } from "../topics/api";

const typeOptions = [
  { label: "Short Text", value: "text" },
  { label: "Paragraph", value: "paragraph" },
  { label: "Yes / No", value: "yesno" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "File Upload", value: "file" },
];

const frameworks = [
  "ISO 27001",
  "SOC 2",
  "NIST CSF",
  "PCI DSS",
  "GDPR",
  "DPDP",
  "CIS",
];

export function QuestionFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const editing = !!id;

  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [help, setHelp] = useState("");

  const [topics, setTopics] = useState<any[]>([]);
  const [topic, setTopic] = useState("");

  const [type, setType] = useState("yesno");
  const [weight, setWeight] = useState("3");
  const [mandatory, setMandatory] = useState(true);

  const [options, setOptions] = useState([
    "Option 1",
    "Option 2",
  ]);

  const [tags, setTags] = useState(["ISO 27001"]);

  const showOptions =
      type === "dropdown" || type === "checkbox";

  // ------------------------
  // Load Topics
  // ------------------------

  useEffect(() => {
    loadTopics();
  }, []);

  // ------------------------
  // Load Question when Editing
  // ------------------------

  useEffect(() => {
    if (editing && id) {
      loadQuestion(Number(id));
    }
  }, [editing, id]);

  const loadTopics = async () => {
    try {
      const res = await getTopics();

      if (Array.isArray(res.data)) {
        setTopics(res.data);
      } else if (Array.isArray(res.data.data)) {
        setTopics(res.data.data);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadQuestion = async (questionId: number) => {
    try {
      const res = await getQuestionById(questionId);

      const q = res.data.data ?? res.data;

      console.log("Question Response:", q);

      setCode(q.code);
      setText(q.questionText);
      setHelp(q.helpText ?? "");

      setType(q.questionType.toLowerCase());

      setWeight(String(q.weight));

      setMandatory(q.mandatory);

      if (q.topicId) {
        setTopic(String(q.topicId));
      } else if (q.topic) {
        setTopic(String(q.topic.id));
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load Question");
    }
  };

  // ------------------------
  // Save
  // ------------------------

  const save = async () => {
    if (!code.trim()) {
      alert("Please enter Question Code");
      return;
    }

    if (!text.trim()) {
      alert("Please enter Question Text");
      return;
    }

    if (!topic) {
      alert("Please select Topic");
      return;
    }

    const body = {
      code: code.trim(),
      questionText: text,
      helpText: help,
      questionType: type.toUpperCase(),
      weight: Number(weight),
      mandatory,
      status: "DRAFT",
      topicId: Number(topic),
    };

    console.log(body);

    try {

      if (editing && id) {

        await updateQuestion(Number(id), body);

        alert("Question Updated Successfully");

      } else {

        await createQuestion(body);

        alert("Question Created Successfully");

      }

      navigate("/questions");

    } catch (error: any) {

      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Unable to connect to backend.");
      }
    }
  };

  return (
      <>
        <PageHeader
            title={editing ? "Edit Question" : "New Question"}
            description="Add a new question to the Question Bank"
            breadcrumbs={[
              { label: "Question Master", to: "/questions" },
              { label: "Question Bank", to: "/questions" },
              { label: editing ? "Edit" : "New" },
            ]}
        />

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT SIDE */}

          <div className="space-y-6 lg:col-span-2">

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Question Details
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                {/* Question Code */}

                <div className="space-y-1.5">
                  <Label>
                    Question Code
                    <span className="text-destructive">*</span>
                  </Label>

                  <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Example : Q002"
                  />
                </div>

                {/* Question Text */}

                <div className="space-y-1.5">
                  <Label>
                    Question Text
                    <span className="text-destructive">*</span>
                  </Label>

                  <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={4}
                      placeholder="Enter Question"
                  />
                </div>

                {/* Help Text */}

                <div className="space-y-1.5">
                  <Label>Help Text</Label>

                  <Input
                      value={help}
                      onChange={(e) => setHelp(e.target.value)}
                      placeholder="Optional Help Text"
                  />
                </div>

                {/* Topic */}

                <div className="space-y-1.5">
                  <Label>Topic</Label>

                  <Select
                      value={topic}
                      onValueChange={setTopic}
                      options={[
                        {
                          label: "Select Topic",
                          value: "",
                        },

                        ...topics.map((t) => ({
                          label: t.name,
                          value: String(t.id),
                        })),
                      ]}
                  />
                </div>

                {/* Answer Options */}

                {showOptions && (

                    <div className="space-y-2">

                      <Label>Answer Options</Label>

                      {options.map((option, index) => (

                          <div
                              key={index}
                              className="flex gap-2"
                          >

                            <Input
                                value={option}
                                onChange={(e) =>
                                    setOptions(
                                        options.map((o, i) =>
                                            i === index ? e.target.value : o
                                        )
                                    )
                                }
                            />

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setOptions(
                                        options.filter((_, i) => i !== index)
                                    )
                                }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                          </div>

                      ))}

                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                              setOptions([
                                ...options,
                                `Option ${options.length + 1}`,
                              ])
                          }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>

                    </div>

                )}

              </CardContent>
            </Card>

            {/* Compliance Mapping */}

            <Card>

              <CardHeader>
                <CardTitle className="text-base">
                  Compliance Mapping
                </CardTitle>
              </CardHeader>

              <CardContent>

                <Label>Frameworks</Label>

                <div className="mt-2 flex flex-wrap gap-2">

                  {frameworks.map((framework) => (

                      <button
                          key={framework}
                          type="button"
                          onClick={() =>
                              setTags(
                                  tags.includes(framework)
                                      ? tags.filter((x) => x !== framework)
                                      : [...tags, framework]
                              )
                          }
                      >

                        <Badge
                            variant={
                              tags.includes(framework)
                                  ? "default"
                                  : "outline"
                            }
                        >
                          {framework}
                        </Badge>

                      </button>

                  ))}

                </div>

              </CardContent>

            </Card>


            {/* RIGHT SIDE */}

            <div className="space-y-6">

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Configuration
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  <div className="space-y-1.5">
                    <Label>Answer Type</Label>

                    <Select
                        value={type}
                        onValueChange={setType}
                        options={typeOptions}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Weight (Risk Impact)</Label>

                    <Select
                        value={weight}
                        onValueChange={setWeight}
                        options={[
                          { label: "1 - Low", value: "1" },
                          { label: "2 - Low", value: "2" },
                          { label: "3 - Medium", value: "3" },
                          { label: "5 - High", value: "5" },
                          { label: "8 - Critical", value: "8" },
                        ]}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">

                    <div>
                      <p className="text-sm font-medium">
                        Mandatory
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Vendor must answer this question
                      </p>
                    </div>

                    <Switch
                        checked={mandatory}
                        onCheckedChange={setMandatory}
                    />

                  </div>

                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">

                <Button onClick={save}>
                  <Save className="mr-2 h-4 w-4" />
                  {editing ? "Save Changes" : "Create Question"}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => navigate("/questions")}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>

              </div>
            </div>
          </div>
        </div>
      </>
  );
}
