import api from "@/api/axios";


export const getEntities = () => {
    return api.get("/entities");
};


export const getEntityById = (id:number) => {
    return api.get(`/entities/${id}`);
};
export const getFindingsByEntity = (entityId:number) => {

    return api.get(`/entity-findings/entity/${entityId}`);
};
export const createEntity = (data:any) => {
    return api.post("/entities", data);
};


export const updateEntity = (id:number,data:any) => {
    return api.put(`/entities/${id}`, data);
};


export const deleteEntity = (id:number) => {
    return api.delete(`/entities/${id}`);
};