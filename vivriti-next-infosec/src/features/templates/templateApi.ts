import apiClient from "@/api/apiClient";

const getTemplates = async () => {
    const res = await apiClient.get("/templates");
    return res.data;
};

const getTemplate = async (id: number) => {
    const res = await apiClient.get(`/templates/${id}`);
    return res.data;
};

const createTemplate = async (payload: any) => {
    const res = await apiClient.post("/templates", payload);
    return res.data;
};

export const templateApi = {
    getTemplates,
    getTemplate,
    createTemplate,
};