import apiClient from "./apiClient";

export const vendorApi = {


    // Vendors
    getAllVendors: async () => {
        const response = await apiClient.get("/vendors");
        return response.data;
    },


    getVendorById: async (id:number) => {
        const response = await apiClient.get(`/vendors/${id}`);
        return response.data;
    },

    getVendorAssessments: async () => {
        const response = await apiClient.get(
            "/vendor-assessments/vendor"
        );

        return response.data;
    },


    // Vendor submission history
    getVendorHistory: async ()=>{

        const response = await apiClient.get(
            "/vendor-assessments/vendor/history"
        );

        return response.data;
    },



    // Questionnaire
    getVendorQuestionnaire: async (assessmentId:number)=>{

        const response = await apiClient.get(
            `/vendor-questionnaires/${assessmentId}`
        );

        return response.data;
    },


    getVendorQuestionnaireByToken: async(token:string)=>{

        const response = await apiClient.get(
            `/vendor-questionnaires/token/${token}`
        );

        return response.data;
    },



    saveAnswer: async(
        assessmentId:number,
        questionId:number,
        answer:string
    )=>{

        const response = await apiClient.post(
            `/vendor-questionnaires/${assessmentId}/answers`,
            null,
            {
                params:{
                    questionId,
                    answer
                }
            }
        );

        return response.data;
    },



    submitAssessment: async(assessmentId:number)=>{

        const response = await apiClient.post(
            `/vendor-questionnaires/${assessmentId}/submit`
        );

        return response.data;
    },



    getVendorMessages: async(vendorId:number)=>{

        const response = await apiClient.get(
            `/vendor/messages/${vendorId}`
        );

        return response.data;
    },



    getEvidenceByQuestion: async(
        assessmentId:number,
        questionId:number
    )=>{

        const response = await apiClient.get(
            `/vendor-evidence/assessment/${assessmentId}/question/${questionId}`
        );

        return response.data;
    },



    getAllAssessments: async()=>{

        const response = await apiClient.get(
            "/assessments"
        );

        return response.data;
    }

};