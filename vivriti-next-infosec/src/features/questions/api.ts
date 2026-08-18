import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});


// ============================================================
// GET ALL QUESTIONS
// ============================================================

export const getQuestions = () =>
    API.get("/questions");


// ============================================================
// GET QUESTION BY ID
// ============================================================

export const getQuestion = (id: number) =>
    API.get(`/questions/${id}`);


// ============================================================
// GET QUESTION BY ID
// Alias
// ============================================================

export const getQuestionById = (id: number) =>
    API.get(`/questions/${id}`);


// ============================================================
// CREATE QUESTION
// ============================================================

export const createQuestion = (data: any) =>
    API.post("/questions", data);


// ============================================================
// UPDATE QUESTION
// ============================================================

export const updateQuestion = (
    id: number,
    body: any
) =>
    API.put(
        `/questions/${id}`,
        body
    );


// ============================================================
// DELETE QUESTION
// ============================================================

export const deleteQuestion = (id: number) =>
    API.delete(`/questions/${id}`);


// ============================================================
// IMPORT QUESTIONS FROM EXCEL
// ============================================================

export const importQuestions = (
    file: File
) => {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    return API.post(
        "/questions/import",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );
};


// ============================================================
// DOWNLOAD QUESTION EXCEL TEMPLATE
// ============================================================
//
// Sends the selected question type to backend.
//
// Example:
//
// /api/questions/import-template?questionType=YESNO
//
// If no type is selected:
//
// /api/questions/import-template
//
// ============================================================

export const downloadQuestionTemplate = (
    questionType?: string
) =>
    API.get(
        "/questions/import-template",
        {
            params: {
                questionType:
                    questionType || undefined,
            },

            responseType: "blob",
        }
    );