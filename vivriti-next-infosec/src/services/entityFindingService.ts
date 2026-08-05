import api from "@/api/axios";


// Get findings by entity id

export const getFindingsByEntity = (entityId:number) => {

    return api.get(
        `/entity-findings/entity/${entityId}`
    );

};