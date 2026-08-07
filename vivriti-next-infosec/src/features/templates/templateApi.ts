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

    const res = await apiClient.post(
        "/templates",
        payload
    );

    return res.data;

};



const updateTemplate = async (
    id: number,
    payload: any
) => {

    const res = await apiClient.put(
        `/templates/${id}`,
        payload
    );

    return res.data;

};



const deleteTemplate = async (
    id: number
) => {

    const res = await apiClient.delete(
        `/templates/${id}`
    );

    return res.data;

};



const cloneTemplate = async (
    id: number
) => {

    const res = await apiClient.post(
        `/templates/${id}/clone`
    );

    return res.data;

};



const publishTemplate = async (
    id: number
) => {

    const res = await apiClient.put(
        `/templates/${id}/publish`
    );

    return res.data;

};


// Excel Export
const exportTemplate = async (
    id: number
) => {

    const res = await apiClient.get(
        `/templates/${id}/export`,
        {
            responseType: "blob"
        }
    );

    return res.data;

};



export const templateApi = {

    getTemplates,

    getTemplate,

    createTemplate,

    updateTemplate,

    deleteTemplate,

    cloneTemplate,

    publishTemplate,

    exportTemplate

};