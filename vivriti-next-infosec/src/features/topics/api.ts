import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const getQuestions = () => API.get("/questions");

export const createQuestion = (data: any) =>
    API.post("/questions", data);

export const getTopics = () =>
    API.get("/topics");

export const createTopic = (data: any) =>
    API.post("/topics", data);