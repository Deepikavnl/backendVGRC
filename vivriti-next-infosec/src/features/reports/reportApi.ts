import apiClient from "@/api/apiClient";


export const reportApi = {


    getRiskDistribution: async () => {

        const res = await apiClient.get(
            "/reports/risk-distribution"
        );

        return res.data;

    },


    getFindingsSeverity: async () => {

        const res = await apiClient.get(
            "/reports/findings-severity"
        );

        return res.data;

    },


    getAssessmentStatus: async () => {

        const res = await apiClient.get(
            "/reports/assessment-status"
        );

        return res.data;

    },


    getComplianceTrend: async () => {

        const res = await apiClient.get(
            "/reports/compliance-trend"
        );

        return res.data;

    },
    getVendorReport: async () => {

        const res = await apiClient.get(
            "/reports/vendor-report"
        );

        return res.data;

    },


    getFindingReport: async () => {

        const res = await apiClient.get(
            "/reports/findings-report"
        );

        return res.data;

    }
};