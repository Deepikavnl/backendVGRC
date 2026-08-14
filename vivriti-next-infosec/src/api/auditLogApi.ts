import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export interface AuditLog {
    id: number;
    timestamp: string;
    user: string;
    userRole: string;
    action: string;
    module: string;
    entity: string;
    previousValue?: string | null;
    newValue?: string | null;
    ip: string;
}

export interface AuditLogPage {
    content: AuditLog[];

    totalElements: number;
    totalPages: number;
    size: number;
    number: number;

    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface AuditLogParams {
    search?: string;
    module?: string;
    page?: number;
    size?: number;
}

const auditLogApi = {

    getAuditLogs: async (
        params: AuditLogParams = {}
    ): Promise<AuditLogPage> => {

        const response = await axios.get<AuditLogPage>(
            `${API_BASE_URL}/audit-logs`,
            {
                params: {
                    search: params.search || "",
                    module: params.module || "",
                    page: params.page ?? 0,
                    size: params.size ?? 15
                }
            }
        );

        return response.data;
    },

    createAuditLog: async (
        data: Omit<AuditLog, "id" | "timestamp">
    ): Promise<AuditLog> => {

        const response = await axios.post<AuditLog>(
            `${API_BASE_URL}/audit-logs`,
            data
        );

        return response.data;
    }
};

export default auditLogApi;