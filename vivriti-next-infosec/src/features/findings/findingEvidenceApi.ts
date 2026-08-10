
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const uploadEvidence = (
    findingId: number,
    file: File
) => {

    const formData = new FormData();

    formData.append("file", file);

    return API.post(
        `/finding-evidence/upload/${findingId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};


export const getEvidenceByFinding = (
    findingId: number
) =>
    API.get(
        `/finding-evidence/finding/${findingId}`
    );


export const viewEvidence = (
    evidenceId: number
) =>
    `${API.defaults.baseURL}/finding-evidence/${evidenceId}/view`;

