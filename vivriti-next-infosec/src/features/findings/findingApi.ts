import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const getAllFindings = () =>
    API.get("/findings");

export const getFindingById = (id: number) =>
    API.get(`/findings/${id}`);

export const createFinding = (data: any) =>
    API.post("/findings", data);

export const updateFindingStatus = (
    id: number,
    status: string
) =>
    API.put(`/findings/${id}/status`, null, {
        params: {
            status,
        },
    });