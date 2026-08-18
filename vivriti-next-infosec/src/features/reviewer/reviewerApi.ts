
import apiClient from "@/api/apiClient";

/* =========================================================
   TYPES
   ========================================================= */

export type ReviewerDecision =
    | "APPROVED"
    | "CORRECTION"
    | "FLAGGED"
    | null;


export type FindingStatus =
    | "OPEN"
    | "IN_REMEDIATION"
    | "REMEDIATION_SUBMITTED"
    | "RESOLVED"
    | "ACCEPTED_RISK";


/* =========================================================
   REVIEWER ANSWER
   ========================================================= */

export interface ReviewerAnswer {

    id?: number;

    questionId: number;

    questionText: string;

    questionType?: string;

    answerValue?: string;

    answer?: string;

    reviewerDecision?: ReviewerDecision;

    reviewerComment?: string;

    comment?: string;

    mandatory?: boolean;

    weight?: number;

    topic?: string;

    topicName?: string;

    sectionId?: number;

    sectionName?: string;

    evidence?: any[];

}


/* =========================================================
   REVIEWER ASSESSMENT
   ========================================================= */

export interface ReviewerAssessment {

    id: number;

    code?: string;

    entityId?: number;

    entityName?: string;

    templateId?: number;

    templateName?: string;

    reviewerId?: number;

    reviewerName?: string;

    status?: string;

    progress?: number;

    completionPercentage?: number;

    dueDate?: string;

    submittedAt?: string;

    completedAt?: string;

    createdAt?: string;

    updatedAt?: string;

    score?: number;

    riskLevel?: string;

    riskRating?: string;

    overdue?: boolean;

    assessmentToken?: string;

    assessmentLink?: string;

    answers: ReviewerAnswer[];

}


/* =========================================================
   REVIEWER WORKSPACE RESPONSE
   ========================================================= */

export interface ReviewerWorkspaceResponse
    extends ReviewerAssessment {

    answers: ReviewerAnswer[];

}


/* =========================================================
   FINDING
   ========================================================= */

export interface ReviewerFinding {

    id: number;

    code?: string;

    assessmentId?: number;

    questionId?: number;

    title?: string;

    description?: string;

    severity?: string;

    status?: FindingStatus;

    owner?: string;

    recommendation?: string;

    topic?: string;

    dueDate?: string;

    createdAt?: string;

    updatedAt?: string;

}


/* =========================================================
   FINDING EVIDENCE
   ========================================================= */

export interface FindingEvidence {

    id: number;

    findingId?: number;

    fileName?: string;

    filename?: string;

    fileType?: string;

    contentType?: string;

    fileSize?: number;

    uploadedAt?: string;

    createdAt?: string;

}


/* =========================================================
   SAVE REVIEW DECISION REQUEST
   ========================================================= */

export interface SaveDecisionRequest {

    assessmentId: number;

    questionId: number;

    decision:
        | "APPROVED"
        | "CORRECTION";

    comment?: string;

}


/* =========================================================
   REQUEST CORRECTION
   ========================================================= */

export interface RequestCorrectionRequest {

    comment: string;

}


/* =========================================================
   CREATE FINDING REQUEST
   ========================================================= */

export interface CreateFindingRequest {

    assessmentId: number;

    questionId?: number;

    title: string;

    description: string;

    severity: string;

    owner?: string;

    recommendation?: string;

    topic?: string;

    dueDate?: string | null;

}


/* =========================================================
   REVIEWER API
   ========================================================= */

export const reviewerApi = {

    /* =====================================================
       GET FULL REVIEW WORKSPACE
       ===================================================== */

    getWorkspace: async (
        id: number
    ): Promise<ReviewerWorkspaceResponse> => {

        const response =
            await apiClient.get(
                `/reviewer/workspace/${id}`
            );

        console.log(
            "FULL REVIEW WORKSPACE:",
            response.data
        );

        return response.data;
    },


    /* =====================================================
       GET ASSESSMENT FINDINGS
       ===================================================== */

    getAssessmentFindings: async (
        assessmentId: number
    ): Promise<ReviewerFinding[]> => {

        const response =
            await apiClient.get(
                `/findings/assessment/${assessmentId}`
            );

        console.log(
            "ASSESSMENT FINDINGS:",
            response.data
        );

        /*
         * Backend may return:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * OR:
         *
         * {
         *   content: [...]
         * }
         */

        if (Array.isArray(response.data)) {
            return response.data;
        }

        if (
            response.data &&
            Array.isArray(response.data.content)
        ) {
            return response.data.content;
        }

        if (
            response.data &&
            Array.isArray(response.data.data)
        ) {
            return response.data.data;
        }

        return [];
    },


    /* =====================================================
       GET FINDING EVIDENCE
       ===================================================== */

    getFindingEvidence: async (
        findingId: number
    ): Promise<FindingEvidence[]> => {

        const response =
            await apiClient.get(
                `/finding-evidence/finding/${findingId}`
            );

        console.log(
            `FINDING ${findingId} EVIDENCE:`,
            response.data
        );

        if (Array.isArray(response.data)) {
            return response.data;
        }

        if (
            response.data &&
            Array.isArray(response.data.content)
        ) {
            return response.data.content;
        }

        if (
            response.data &&
            Array.isArray(response.data.data)
        ) {
            return response.data.data;
        }

        return [];
    },


    /* =====================================================
       VIEW FINDING EVIDENCE
       ===================================================== */

    viewEvidence: (
        evidenceId: number
    ): string => {

        return (
            `${apiClient.defaults.baseURL}` +
            `/finding-evidence/${evidenceId}/view`
);
},


/* =====================================================
   UPDATE FINDING STATUS
   ===================================================== */

reviewFinding: async (
    findingId: number,
    status:
        | "RESOLVED"
        | "IN_REMEDIATION"
        | "ACCEPTED_RISK"
): Promise<ReviewerFinding> => {

    const response =
        await apiClient.put(
            `/findings/${findingId}/status`,
            null,
            {
                params: {
                    status,
                },
            }
        );

    console.log(
        `FINDING ${findingId} STATUS UPDATED:`,
        response.data
    );

    return response.data;
},


    /* =====================================================
       SAVE QUESTION REVIEW DECISION
       ===================================================== */

    saveDecision: async (
    data: SaveDecisionRequest
) => {

    console.log(
        "SAVING REVIEW DECISION:",
        data
    );

    const response =
        await apiClient.post(
            "/reviewer/decision",
            data
        );

    return response.data;
},


    /* =====================================================
       APPROVE ENTIRE ASSESSMENT
       ===================================================== */

    approveAssessment: async (
    assessmentId: number
) => {

    const response =
        await apiClient.put(
            `/reviewer/${assessmentId}/approve`
        );

    return response.data;
},


    /* =====================================================
       REQUEST ASSESSMENT CORRECTION
       ===================================================== */

    requestCorrection: async (
    assessmentId: number,
    data: RequestCorrectionRequest
) => {

    const response =
        await apiClient.put(
            `/reviewer/${assessmentId}/correction`,
            data
        );

    return response.data;
},


    /* =====================================================
       SUBMIT REVIEW
       ===================================================== */

    submitReview: async (
    assessmentId: number
) => {

    const response =
        await apiClient.put(
            `/reviewer/${assessmentId}/submit`
        );

    return response.data;
},


    /* =====================================================
       GET TEAMS
       ===================================================== */

    getTeams: async () => {

    const response =
        await apiClient.get(
            "/teams"
        );

    return response.data;
},


    /* =====================================================
       GET REVIEWERS BY TEAM
       ===================================================== */

    getReviewers: async (
    teamId: number
) => {

    const response =
        await apiClient.get(
            `/teams/${teamId}/reviewers`
        );

    return response.data;
},


    /* =====================================================
       CREATE FINDING
       ===================================================== */

    createFinding: async (
    data: CreateFindingRequest
) => {

    const response =
        await apiClient.post(
            "/findings",
            data
        );

    return response.data;
},


    /* =====================================================
       GET ASSESSMENT WORKSPACE AGAIN
       ===================================================== */

    reloadWorkspace: async (
    assessmentId: number
): Promise<ReviewerWorkspaceResponse> => {

    const response =
        await apiClient.get(
            `/reviewer/workspace/${assessmentId}`
        );

    return response.data;
},

};


/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default reviewerApi;

