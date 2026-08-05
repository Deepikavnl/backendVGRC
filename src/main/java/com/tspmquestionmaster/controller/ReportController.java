package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.response.*;
import com.tspmquestionmaster.service.ReportService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {


    private final ReportService reportService;



    @GetMapping("/risk-distribution")
    public List<RiskDistributionResponse> getRiskDistribution(){

        return reportService.getRiskDistribution();

    }



    @GetMapping("/findings-severity")
    public List<SeverityReportResponse> getFindingsSeverity(){

        return reportService.getFindingsBySeverity();

    }



    @GetMapping("/assessment-status")
    public List<AssessmentStatusResponse> getAssessmentStatus(){

        return reportService.getAssessmentStatus();

    }



    @GetMapping("/vendor-report")
    public List<VendorReportResponse> getVendorReport(){

        return reportService.getVendorReport();

    }



    @GetMapping("/findings-report")
    public List<FindingReportResponse> getFindingReport(){

        return reportService.getFindingReport();

    }



    @GetMapping("/compliance-trend")
    public List<ComplianceTrendResponse> getComplianceTrend(){

        return reportService.getComplianceTrend();

    }

}