import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

// =========================================================
// ANSWER TYPES
// =========================================================

const typeOptions = [
  {
    label: "Short Text",
    value: "text",
  },
  {
    label: "Paragraph",
    value: "paragraph",
  },
  {
    label: "Yes / No",
    value: "yesno",
  },
  {
    label: "Dropdown",
    value: "dropdown",
  },
  {
    label: "Checkbox",
    value: "checkbox",
  },
  {
    label: "Number",
    value: "number",
  },
  {
    label: "Date",
    value: "date",
  },
  {
    label: "File Upload",
    value: "file",
  },
];

// =========================================================
// FRAMEWORKS
// =========================================================

const frameworks = [
  "ISO 27001",
  "SOC 2",
  "NIST CSF",
  "PCI DSS",
  "GDPR",
  "DPDP",
  "CIS",
];

// =========================================================
// COMPONENT
// =========================================================

export function QuestionFormPage() {

  const navigate = useNavigate();

  const { id } = useParams();

  const editing = Boolean(id);

  // =======================================================
  // FORM STATE
  // =======================================================

  // Code is only populated during edit.
  // During create, backend generates it automatically.
  const [code, setCode] = useState("");

  const [text, setText] = useState("");

  const [help, setHelp] = useState("");

  const [topics, setTopics] = useState<any[]>([]);

  const [topic, setTopic] = useState("");

  const [type, setType] = useState("yesno");

  const [weight, setWeight] = useState("3");

  const [mandatory, setMandatory] =
      useState(true);

  const [options, setOptions] = useState([
    "Option 1",
    "Option 2",
  ]);

  const [tags, setTags] = useState([
    "ISO 27001",
  ]);

  const showOptions =
      type === "dropdown" ||
      type === "checkbox";

  // =======================================================
  // LOAD TOPICS
  // =======================================================

  useEffect(() => {

    loadTopics();

  }, []);

  // =======================================================
  // LOAD QUESTION FOR EDIT
  // =======================================================

  useEffect(() => {

    if (editing && id) {

      loadQuestion(
          Number(id)
      );

    }

  }, [editing, id]);

  // =======================================================
  // LOAD TOPICS
  // =======================================================

  const loadTopics = async () => {

    try {

      const response =
          await getTopics();

      const data =
          response.data;

      if (Array.isArray(data)) {

        setTopics(data);

      } else if (
          Array.isArray(data?.data)
      ) {

        setTopics(data.data);

      } else {

        setTopics([]);

      }

    } catch (error) {

      console.error(
          "Failed to load topics:",
          error
      );

      setTopics([]);

    }

  };

  // =======================================================
  // LOAD QUESTION
  // =======================================================

  const loadQuestion = async (
      questionId: number
  ) => {

    try {

      const response =
          await getQuestionById(
              questionId
          );

      const q =
          response.data?.data ??
          response.data;

      console.log(
          "Question Response:",
          q
      );

      // Existing generated code
      setCode(
          q.code ?? ""
      );

      setText(
          q.questionText ?? ""
      );

      setHelp(
          q.helpText ?? ""
      );

      if (q.questionType) {

        setType(
            q.questionType.toLowerCase()
        );

      }

      if (
          q.weight !== undefined &&
          q.weight !== null
      ) {

        setWeight(
            String(q.weight)
        );

      }

      setMandatory(
          q.mandatory ?? true
      );

      if (q.topicId) {

        setTopic(
            String(q.topicId)
        );

      } else if (q.topic?.id) {

        setTopic(
            String(q.topic.id)
        );

      }

      if (
          Array.isArray(q.options) &&
          q.options.length > 0
      ) {

        setOptions(
            q.options
        );

      }

    } catch (error) {

      console.error(
          "Failed to load question:",
          error
      );

      alert(
          "Unable to load Question"
      );

    }

  };

  // =======================================================
  // ADD OPTION
  // =======================================================

  const addOption = () => {

    setOptions(
        [
          ...options,
          `Option ${options.length + 1}`,
        ]
    );

  };

  // =======================================================
  // UPDATE OPTION
  // =======================================================

  const updateOption = (
      index: number,
      value: string
  ) => {

    setOptions(
        options.map(
            (option, i) =>
                i === index
                    ? value
                    : option
        )
    );

  };

  // =======================================================
  // DELETE OPTION
  // =======================================================

  const deleteOption = (
      index: number
  ) => {

    setOptions(
        options.filter(
            (_, i) =>
                i !== index
        )
    );

  };

  // =======================================================
  // FRAMEWORK TOGGLE
  // =======================================================

  const toggleFramework = (
      framework: string
  ) => {

    setTags(
        currentTags =>
            currentTags.includes(
                framework
            )
                ? currentTags.filter(
                    tag =>
                        tag !== framework
                )
                : [
                  ...currentTags,
                  framework,
                ]
    );

  };

  // =======================================================
  // SAVE
  // =======================================================

  const save = async () => {

    // -----------------------------------------------------
    // VALIDATE QUESTION TEXT
    // -----------------------------------------------------

    if (!text.trim()) {

      alert(
          "Please enter Question Text"
      );

      return;

    }

    // -----------------------------------------------------
    // VALIDATE TOPIC
    // -----------------------------------------------------

    if (!topic) {

      alert(
          "Please select Topic"
      );

      return;

    }

    // -----------------------------------------------------
    // VALIDATE OPTIONS
    // -----------------------------------------------------

    if (showOptions) {

      const hasEmptyOption =
          options.some(
              option =>
                  !option.trim()
          );

      if (hasEmptyOption) {

        alert(
            "Please fill all answer options"
        );

        return;

      }

    }

    // =====================================================
    // CREATE
    // =====================================================

    if (!editing) {

      const body = {

        questionText:
            text.trim(),

        helpText:
            help.trim(),

        questionType:
            type.toUpperCase(),

        weight:
            Number(weight),

        mandatory:
        mandatory,

        status:
            "DRAFT",

        topicId:
            Number(topic),

      };

      console.log(
          "Create Question Request:",
          body
      );

      try {

        const response =
            await createQuestion(
                body
            );

        console.log(
            "Create Question Response:",
            response
        );

        alert(
            "Question Created Successfully"
        );

        navigate(
            "/questions"
        );

      } catch (error: any) {

        console.error(
            "Create Question Error:",
            error
        );

        if (error.response) {

          console.error(
              "Backend Error:",
              error.response.data
          );

          alert(
              error.response.data?.message ||
              "Unable to create question."
          );

        } else {

          alert(
              "Unable to connect to backend."
          );

        }

      }

      return;
    }

    // =====================================================
    // UPDATE
    // =====================================================

    if (editing && id) {

      const body = {

        // Existing generated code
        // is preserved during update.
        code:
        code,

        questionText:
            text.trim(),

        helpText:
            help.trim(),

        questionType:
            type.toUpperCase(),

        weight:
            Number(weight),

        mandatory:
        mandatory,

        status:
            "DRAFT",

        topicId:
            Number(topic),

      };

      console.log(
          "Update Question Request:",
          body
      );

      try {

        await updateQuestion(
            Number(id),
            body
        );

        alert(
            "Question Updated Successfully"
        );

        navigate(
            "/questions"
        );

      } catch (error: any) {

        console.error(
            "Update Question Error:",
            error
        );

        if (error.response) {

          alert(
              error.response.data?.message ||
              "Unable to update question."
          );

        } else {

          alert(
              "Unable to connect to backend."
          );

        }

      }

    }

  };

  // =======================================================
  // UI
  // =======================================================

  return (
      <>
        <PageHeader
            title={
              editing
                  ? "Edit Question"
                  : "New Question"
            }
            description={
              editing
                  ? "Update question details"
                  : "Add a new question to the Question Bank"
            }
            breadcrumbs={[
              {
                label:
                    "Question Master",
                to:
                    "/questions",
              },
              {
                label:
                    "Question Bank",
                to:
                    "/questions",
              },
              {
                label:
                    editing
                        ? "Edit"
                        : "New",
              },
            ]}
        />

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================================
                QUESTION DETAILS
            ================================================= */}

            <Card>

              <CardHeader>

                <CardTitle className="text-base">
                  Question Details
                </CardTitle>

              </CardHeader>

              <CardContent className="space-y-4">

                {/* =================================================
                    QUESTION CODE
                ================================================= */}

                {editing && (

                    <div className="space-y-1.5">

                      <Label>
                        Question Code
                      </Label>

                      <Input
                          value={code}
                          readOnly
                          className="bg-muted"
                      />

                      <p className="text-xs text-muted-foreground">
                        Question code is generated
                        by the system and cannot
                        be changed.
                      </p>

                    </div>

                )}

                {/* =================================================
                    QUESTION TEXT
                ================================================= */}

                <div className="space-y-1.5">

                  <Label>

                    Question Text

                    <span className="text-destructive">
                      *
                    </span>

                  </Label>

                  <Textarea
                      value={text}
                      onChange={
                        e =>
                            setText(
                                e.target.value
                            )
                      }
                      rows={4}
                      placeholder="Enter Question"
                  />

                </div>

                {/* =================================================
                    HELP TEXT
                ================================================= */}

                <div className="space-y-1.5">

                  <Label>
                    Help Text
                  </Label>

                  <Input
                      value={help}
                      onChange={
                        e =>
                            setHelp(
                                e.target.value
                            )
                      }
                      placeholder="Optional Help Text"
                  />

                </div>

                {/* =================================================
                    TOPIC
                ================================================= */}

                <div className="space-y-1.5">

                  <Label>

                    Topic

                    <span className="text-destructive">
                      *
                    </span>

                  </Label>

                  <Select
                      value={topic}
                      onValueChange={
                        setTopic
                      }
                      options={[
                        {
                          label:
                              "Select Topic",
                          value:
                              "",
                        },

                        ...topics.map(
                            t => ({
                              label:
                              t.name,
                              value:
                                  String(
                                      t.id
                                  ),
                            })
                        ),
                      ]}
                  />

                </div>

                {/* =================================================
                    OPTIONS
                ================================================= */}

                {showOptions && (

                    <div className="space-y-2">

                      <Label>
                        Answer Options
                      </Label>

                      {options.map(
                          (
                              option,
                              index
                          ) => (

                              <div
                                  key={index}
                                  className="flex gap-2"
                              >

                                <Input
                                    value={
                                      option
                                    }
                                    onChange={
                                      e =>
                                          updateOption(
                                              index,
                                              e.target.value
                                          )
                                    }
                                    placeholder={
                                      `Option ${
                                          index + 1
                                      }`
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        deleteOption(
                                            index
                                        )
                                    }
                                >

                                  <Trash2
                                      className="h-4 w-4"
                                  />

                                </Button>

                              </div>

                          )
                      )}

                      <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={
                            addOption
                          }
                      >

                        <Plus
                            className="mr-2 h-4 w-4"
                        />

                        Add Option

                      </Button>

                    </div>

                )}

              </CardContent>

            </Card>

            {/* =================================================
                COMPLIANCE MAPPING
            ================================================= */}

            <Card>

              <CardHeader>

                <CardTitle className="text-base">
                  Compliance Mapping
                </CardTitle>

              </CardHeader>

              <CardContent>

                <Label>
                  Frameworks
                </Label>

                <div className="mt-2 flex flex-wrap gap-2">

                  {frameworks.map(
                      framework => (

                          <button
                              key={framework}
                              type="button"
                              onClick={() =>
                                  toggleFramework(
                                      framework
                                  )
                              }
                          >

                            <Badge
                                variant={
                                  tags.includes(
                                      framework
                                  )
                                      ? "default"
                                      : "outline"
                                }
                            >
                              {framework}
                            </Badge>

                          </button>

                      )
                  )}

                </div>

              </CardContent>

            </Card>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="space-y-6">

            {/* =================================================
                CONFIGURATION
            ================================================= */}

            <Card>

              <CardHeader>

                <CardTitle className="text-base">
                  Configuration
                </CardTitle>

              </CardHeader>

              <CardContent className="space-y-4">

                {/* =================================================
                    ANSWER TYPE
                ================================================= */}

                <div className="space-y-1.5">

                  <Label>
                    Answer Type
                  </Label>

                  <Select
                      value={type}
                      onValueChange={
                        setType
                      }
                      options={
                        typeOptions
                      }
                  />

                </div>

                {/* =================================================
                    WEIGHT
                ================================================= */}

                <div className="space-y-1.5">

                  <Label>
                    Weight (Risk Impact)
                  </Label>

                  <Select
                      value={weight}
                      onValueChange={
                        setWeight
                      }
                      options={[
                        {
                          label:
                              "1 - Low",
                          value:
                              "1",
                        },
                        {
                          label:
                              "2 - Low",
                          value:
                              "2",
                        },
                        {
                          label:
                              "3 - Medium",
                          value:
                              "3",
                        },
                        {
                          label:
                              "5 - High",
                          value:
                              "5",
                        },
                        {
                          label:
                              "8 - Critical",
                          value:
                              "8",
                        },
                      ]}
                  />

                </div>

                {/* =================================================
                    MANDATORY
                ================================================= */}

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
                      checked={
                        mandatory
                      }
                      onCheckedChange={
                        setMandatory
                      }
                  />

                </div>

              </CardContent>

            </Card>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex flex-col gap-2">

              <Button
                  type="button"
                  onClick={
                    save
                  }
              >

                <Save
                    className="mr-2 h-4 w-4"
                />

                {editing
                    ? "Save Changes"
                    : "Create Question"}

              </Button>

              <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                      navigate(
                          "/questions"
                      )
                  }
              >

                <X
                    className="mr-2 h-4 w-4"
                />

                Cancel

              </Button>

            </div>

          </div>

        </div>
      </>
  );
}