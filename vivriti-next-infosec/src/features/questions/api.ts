import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const getQuestions = () => API.get("/questions");

export const getQuestion = (id: number) =>
    API.get(`/questions/${id}`);

export const createQuestion = (data: any) =>
    API.post("/questions", data);

export const updateQuestion = (id: number, body: any) =>
    API.put(`/questions/${id}`, body);

export const getQuestionById = (id: number) =>
    API.get(`/questions/${id}`);

export const deleteQuestion = (id: number) =>
    API.delete(`/questions/${id}`);