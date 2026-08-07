import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const getQuestions = () =>
    API.get("/questions");

export const getQuestion = (id: number) =>
    API.get(`/questions/${id}`);

export const getQuestionById = (id: number) =>
    API.get(`/questions/${id}`);

export const createQuestion = (data: any) =>
    API.post("/questions", data);

export const updateQuestion = (
    id: number,
    body: any
) =>
    API.put(`/questions/${id}`, body);

export const deleteQuestion = (id: number) =>
    API.delete(`/questions/${id}`);

export const importQuestions = (file: File) => {

    const formData = new FormData();

    formData.append("file", file);

    return API.post(
        "/questions/import",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const downloadQuestionTemplate = () =>
    API.get("/questions/import-template", {
        responseType: "blob",
    });