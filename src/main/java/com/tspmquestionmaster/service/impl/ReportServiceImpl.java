package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.response.*;
import com.tspmquestionmaster.entity.Finding;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.entity.EntityAssessment;

import com.tspmquestionmaster.repository.FindingRepository;
import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;

import com.tspmquestionmaster.service.ReportService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {


    private final FindingRepository findingRepository;

    private final ThirdPartyEntityRepository thirdPartyEntityRepository;

    private final EntityAssessmentRepository entityAssessmentRepository;



    // ============================================
    // Risk Distribution
    // ============================================

    @Override
    public List<RiskDistributionResponse> getRiskDistribution() {


        List<ThirdPartyEntity> entities =
                thirdPartyEntityRepository.findAll();


        Map<String, Long> result =
                entities.stream()
                        .collect(
                                Collectors.groupingBy(
                                        e -> e.getRiskRating() == null
                                                ? "UNKNOWN"
                                                : e.getRiskRating().toLowerCase(),
                                        Collectors.counting()
                                )
                        );


        return result.entrySet()
                .stream()
                .map(
                        e -> new RiskDistributionResponse(
                                e.getKey(),
                                e.getValue()
                        )
                )
                .toList();

    }





    // ============================================
    // Findings Severity
    // ============================================

    @Override
    public List<SeverityReportResponse> getFindingsBySeverity() {


        List<Finding> findings =
                findingRepository.findAll();



        Map<String, Long> result =
                findings.stream()
                        .collect(
                                Collectors.groupingBy(
                                        f -> f.getSeverity()
                                                .name()
                                                .toLowerCase(),
                                        Collectors.counting()
                                )
                        );



        return result.entrySet()
                .stream()
                .map(
                        e -> new SeverityReportResponse(
                                e.getKey(),
                                e.getValue()
                        )
                )
                .toList();

    }





    // ============================================
    // Assessment Status
    // ============================================

    @Override
    public List<AssessmentStatusResponse> getAssessmentStatus() {


        List<EntityAssessment> assessments =
                entityAssessmentRepository.findAll();



        Map<String, Long> result =
                assessments.stream()
                        .collect(
                                Collectors.groupingBy(
                                        a -> a.getStatus(),

                                        Collectors.counting()
                                )
                        );



        return result.entrySet()
                .stream()
                .map(
                        e -> new AssessmentStatusResponse(
                                e.getKey(),
                                e.getValue()
                        )
                )
                .toList();

    }





    // ============================================
    // Vendor Report
    // ============================================

    @Override
    public List<VendorReportResponse> getVendorReport() {


        return thirdPartyEntityRepository.findAll()
                .stream()
                .map(entity -> {


                    VendorReportResponse response =
                            new VendorReportResponse();


                    response.setId(entity.getId());

                    response.setName(
                            entity.getName()
                    );

                    response.setRiskRating(
                            entity.getRiskRating()
                    );


                    response.setComplianceScore(
                            entity.getComplianceScore()
                    );


                    return response;

                })
                .toList();

    }





    // ============================================
    // Findings Report
    // ============================================

    @Override
    public List<FindingReportResponse> getFindingReport() {


        return findingRepository.findAll()
                .stream()
                .map(finding -> {


                    FindingReportResponse response =
                            new FindingReportResponse();


                    response.setCode(
                            finding.getCode()
                    );


                    response.setTitle(
                            finding.getTitle()
                    );


                    response.setSeverity(
                            finding.getSeverity()
                                    .name()
                    );


                    response.setStatus(
                            finding.getStatus()
                                    .name()
                    );


                    return response;

                })
                .toList();

    }





    // ============================================
    // Compliance Trend
    // ============================================

    @Override
    public List<ComplianceTrendResponse> getComplianceTrend() {


        List<ComplianceTrendResponse> trend =
                new ArrayList<>();


        trend.add(
                new ComplianceTrendResponse(
                        "Jan",
                        72.0
                )
        );


        trend.add(
                new ComplianceTrendResponse(
                        "Feb",
                        76.0
                )
        );


        trend.add(
                new ComplianceTrendResponse(
                        "Mar",
                        81.0
                )
        );


        trend.add(
                new ComplianceTrendResponse(
                        "Apr",
                        85.0
                )
        );


        return trend;

    }

}