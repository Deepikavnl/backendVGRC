package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.request.CreateEntityFindingRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityFindingRequest;
import com.tspmquestionmaster.dto.response.EntityFindingResponse;

import java.util.List;

public interface EntityFindingService {

    EntityFindingResponse createFinding(CreateEntityFindingRequest request);

    EntityFindingResponse updateFinding(
            Long id,
            UpdateEntityFindingRequest request
    );

    EntityFindingResponse getFindingById(Long id);

    List<EntityFindingResponse> getAllFindings();

    List<EntityFindingResponse> getFindingsByEntity(Long entityId);

    void deleteFinding(Long id);
}