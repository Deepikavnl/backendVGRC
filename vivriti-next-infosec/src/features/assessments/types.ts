export interface AssessmentRequest {

    assessmentName: string;

    entityId: number;

    templateId: number;

    dueDate: string;

    status: string;

}



export interface Assessment {

    id: number;

    assessmentName: string;

    entityId: number;

    templateId: number;

    entityName?: string;

    templateName?: string;

    reviewerName?: string;

    code?: string;

    riskLevel?: string;

    overdue?: boolean;

    dueDate: string;

    status: string;

    progress: number;

    assessmentLink?: string;

    accessToken?: string;

    createdAt?: string;

}



export interface AssessmentQuestion {

    id: number;

    sectionId: number;

    questionText: string;

    questionType: string;

    mandatory: boolean;

    weight: number;

}