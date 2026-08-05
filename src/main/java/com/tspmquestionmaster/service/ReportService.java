package com.tspmquestionmaster.service;


import com.tspmquestionmaster.dto.response.*;

import java.util.List;


public interface ReportService {


    List<RiskDistributionResponse> getRiskDistribution();


    List<SeverityReportResponse> getFindingsBySeverity();


    List<AssessmentStatusResponse> getAssessmentStatus();


    List<VendorReportResponse> getVendorReport();


    List<FindingReportResponse> getFindingReport();


    List<ComplianceTrendResponse> getComplianceTrend();

}