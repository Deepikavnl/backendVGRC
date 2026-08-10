import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

/*
 * =========================================================
 * FINDING STATUS
 * =========================================================
 */

export type FindingStatus =
    | "OPEN"
    | "IN_REMEDIATION"
    | "REMEDIATION_SUBMITTED"
    | "RESOLVED"
    | "ACCEPTED_RISK";


/*
 * =========================================================
 * GET ALL FINDINGS
 * =========================================================
 */

export const getAllFindings = () =>
    API.get("/findings");


/*
 * =========================================================
 * GET FINDING BY ID
 * =========================================================
 */

export const getFindingById = (
    id: number
) =>
    API.get(`/findings/${id}`);


/*
 * =========================================================
 * CREATE FINDING
 * =========================================================
 */

export const createFinding = (
    data: any
) =>
    API.post(
        "/findings",
        data
    );


/*
 * =========================================================
 * UPDATE FINDING STATUS
 *
 * Used for:
 *
 * OPEN
 *      -> IN_REMEDIATION
 *
 * Reviewer:
 *
 * REMEDIATION_SUBMITTED
 *      -> RESOLVED
 *
 * REMEDIATION_SUBMITTED
 *      -> IN_REMEDIATION
 *
 * REMEDIATION_SUBMITTED
 *      -> ACCEPTED_RISK
 * =========================================================
 */

export const updateFindingStatus = (
    id: number,
    status: FindingStatus
) =>
    API.put(
        `/findings/${id}/status`,
        null,
        {
            params: {
                status,
            },
        }
    );


/*
 * =========================================================
 * UPDATE REMEDIATION
 * =========================================================
 */

export const updateFindingRemediation = (
    id: number,
    remediation: string
) =>
    API.put(
        `/findings/${id}/remediation`,
        remediation,
        {
            headers: {
                "Content-Type": "text/plain",
            },
        }
    );


/*
 * =========================================================
 * SUBMIT FINDING FOR REVIEW
 *
 * Risk Team:
 *
 * IN_REMEDIATION
 *      -> REMEDIATION_SUBMITTED
 * =========================================================
 */

export const submitForReview = (
    id: number
) =>
    API.put(
        `/findings/${id}/submit-review`
    );


/*
 * =========================================================
 * GET FINDING EVIDENCE
 * =========================================================
 */

export const getFindingEvidence = (
    findingId: number
) =>
    API.get(
        `/finding-evidence/finding/${findingId}`
    );