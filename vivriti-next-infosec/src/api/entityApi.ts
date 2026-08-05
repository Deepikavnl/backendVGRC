import api from "./apiClient"; // use your actual axios file


export const entityApi = {

    getEntities: async () => {

        const response = await api.get("/entities");

        return response.data.data || response.data;

    }

};