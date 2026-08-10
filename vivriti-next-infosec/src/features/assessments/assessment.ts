import axios from "@/api/axios";

/* =========================================================
   ASSESSMENT RESPONSE
   ========================================================= */

export interface Assessment {
    id: number;

    // Generated automatically by backend
    code: string;

    entityId: number;
    entityName: string;

    templateName: string;

    reviewerName: string;

    status: string;

    progress: number;

    dueDate: string;

    submittedAt?: string;

    completedAt?: string;

    score?: number;

    riskLevel?: string;

    overdue?: boolean;

    createdAt?: string;

    assessmentToken?: string;

    assessmentLink?: string;

    answers?: any[];
}


/* =========================================================
   CREATE / UPDATE ASSESSMENT REQUEST
   =========================================================
   NOTE:
   `code` is intentionally NOT included.
   Backend generates the assessment code automatically.
   ========================================================= */

export interface AssessmentRequest {

    entityId: number;

    templateName: string;

    reviewerName: string;

    status: string;

    progress: number;

    dueDate: string;
}


/* =========================================================
   ASSESSMENT QUESTION
   ========================================================= */

export interface AssessmentQuestion {

    id: number;

    sectionId: number;

    questionText: string;

    questionType: string;

    mandatory: boolean;

    weight: number;
}


/* =========================================================
   ASSESSMENT API
   ========================================================= */

const assessmentApi = {

    /* =====================================================
       GET ALL ASSESSMENTS
       ===================================================== */

    getAllAssessments: async (): Promise<Assessment[]> => {

        const response = await axios.get(
            "/assessments"
        );

        return response.data;
    },


    /* =====================================================
       GET ASSESSMENT BY ID
       ===================================================== */

    getAssessmentById: async (
        id: number
    ): Promise<Assessment> => {

        const response = await axios.get(
            `/assessments/${id}`
        );

        return response.data;
    },


    /* =====================================================
       CREATE ASSESSMENT
       ===================================================== */

    createAssessment: async (
        data: AssessmentRequest
    ): Promise<Assessment> => {

        const response = await axios.post(
            "/assessments",
            data
        );

        return response.data;
    },


    /* =====================================================
       UPDATE ASSESSMENT
       ===================================================== */

    updateAssessment: async (
        id: number,
        data: AssessmentRequest
    ): Promise<Assessment> => {

        const response = await axios.put(
            `/assessments/${id}`,
            data
        );

        return response.data;
    },


    /* =====================================================
       DELETE ASSESSMENT
       ===================================================== */

    deleteAssessment: async (
        id: number
    ): Promise<void> => {

        await axios.delete(
            `/assessments/${id}`
        );
    },


    /* =====================================================
       GET QUESTIONS FOR ASSESSMENT
       ===================================================== */

    getQuestions: async (
        assessmentId: number
    ): Promise<AssessmentQuestion[]> => {

        const response = await axios.get(
            `/assessments/${assessmentId}/questions`
        );

        return response.data;
    },


    /* =====================================================
       GET ASSESSMENT BY TOKEN
       ===================================================== */

    getAssessmentByToken: async (
        token: string
    ): Promise<Assessment> => {

        const response = await axios.get(
            `/assessments/token/${token}`
        );

        return response.data;
    }

};


/* =========================================================
   EXPORT
   ========================================================= */

export default assessmentApi;