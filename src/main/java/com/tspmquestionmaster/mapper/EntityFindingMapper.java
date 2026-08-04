package com.tspmquestionmaster.mapper;

import com.tspmquestionmaster.dto.request.CreateEntityFindingRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityFindingRequest;
import com.tspmquestionmaster.dto.response.EntityFindingResponse;
import com.tspmquestionmaster.entity.EntityFinding;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import org.springframework.stereotype.Component;

@Component
public class EntityFindingMapper {


    public EntityFinding toEntity(
            CreateEntityFindingRequest request,
            ThirdPartyEntity entity) {

        EntityFinding finding = new EntityFinding();

        finding.setCode(request.getCode());
        finding.setTitle(request.getTitle());
        finding.setDescription(request.getDescription());
        finding.setSeverity(request.getSeverity());
        finding.setStatus(request.getStatus());
        finding.setAssignedTo(request.getAssignedTo());
        finding.setDueDate(request.getDueDate());
        finding.setEntity(entity);

        return finding;
    }


    public void updateEntity(
            UpdateEntityFindingRequest request,
            EntityFinding finding,
            ThirdPartyEntity entity) {

        finding.setCode(request.getCode());
        finding.setEntity(entity);
        finding.setTitle(request.getTitle());
        finding.setDescription(request.getDescription());
        finding.setSeverity(request.getSeverity());
        finding.setStatus(request.getStatus());
        finding.setAssignedTo(request.getAssignedTo());
        finding.setDueDate(request.getDueDate());
    }


    public EntityFindingResponse toResponse(
            EntityFinding finding) {

        EntityFindingResponse response =
                new EntityFindingResponse();

        response.setId(finding.getId());

        if (finding.getEntity() != null) {
            response.setEntityId(
                    finding.getEntity().getId()
            );
        }

        response.setCode(finding.getCode());
        response.setTitle(finding.getTitle());
        response.setDescription(finding.getDescription());
        response.setSeverity(finding.getSeverity());
        response.setStatus(finding.getStatus());
        response.setAssignedTo(finding.getAssignedTo());
        response.setDueDate(finding.getDueDate());

        return response;
    }
}