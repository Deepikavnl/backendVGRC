import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Questions
export const getQuestions = () =>
    API.get("/questions");

export const createQuestion = (data: any) =>
    API.post("/questions", data);

// Topics
export const getTopics = () =>
    API.get("/topics");

export const createTopic = (data: any) =>
    API.post("/topics", data);

// Import Topics
export const importTopics = (file: File) => {

    const formData = new FormData();

    formData.append("file", file);

    return API.post(
        "/topics/import",
        formData
    );
};

// Download Topic Template
export const downloadTopicTemplate = () =>
    API.get("/topics/import-template", {
        responseType: "blob",
    });

// Download Question Template
export const downloadQuestionTemplate = () =>
    API.get("/questions/import-template", {
        responseType: "blob",
    });