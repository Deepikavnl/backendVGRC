package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.request.CreateFindingRequest;
import com.tspmquestionmaster.dto.response.FindingResponse;

import java.util.List;

public interface FindingService {

    FindingResponse createFinding(CreateFindingRequest request);

    List<FindingResponse> getAllFindings();

    FindingResponse getFindingById(Long id);

    FindingResponse updateStatus(Long id, String status);

    List<FindingResponse> getFindingsByAssessment(Long assessmentId);
}