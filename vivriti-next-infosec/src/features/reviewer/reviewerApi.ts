import apiClient from "@/api/apiClient";


export const reviewerApi = {


    getWorkspace: async (id:number) => {

        const response = await apiClient.get(
            `/reviewer/workspace/${id}`
        );

        return response.data;
    },



    saveDecision: async (
        data: any
    ) => {

        const response =
            await apiClient.post(
                "/reviewer/decision",
                data
            );

        return response.data;

    },



    approveAssessment : async (
        assessmentId: number
    ) => {

        const response =
            await apiClient.put(
                `/reviewer/${assessmentId}/approve`
            );

        return response.data;

    },



    requestCorrection: async (
        assessmentId: number,
        data: {
            comment:string
        }
    ) => {

        const response =
            await apiClient.put(
                `/reviewer/${assessmentId}/correction`,
                data
            );

        return response.data;

    },



    getTeams: async () => {

        const response =
            await apiClient.get(
                "/teams"
            );

        return response.data;

    },



    getReviewers: async (
        teamId:number
    ) => {

        const response =
            await apiClient.get(
                `/teams/${teamId}/reviewers`
            );

        return response.data;

    },



    createFinding: async (
        data:any
    ) => {

        const response =
            await apiClient.post(
                "/findings",
                data
            );

        return response.data;

    },
    submitReview: async(
        assessmentId:number
    )=>{

        const response =
            await apiClient.put(
                `/reviewer/${assessmentId}/submit`
            );

        return response.data;

    },

};