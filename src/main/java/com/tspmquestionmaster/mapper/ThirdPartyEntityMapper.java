package com.tspmquestionmaster.mapper;

import com.tspmquestionmaster.dto.request.CreateEntityRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityRequest;
import com.tspmquestionmaster.dto.response.EntityResponse;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import org.springframework.stereotype.Component;

@Component
public class ThirdPartyEntityMapper {

    public ThirdPartyEntity toEntity(CreateEntityRequest request) {

        ThirdPartyEntity entity = new ThirdPartyEntity();

        entity.setName(request.getName());
        entity.setType(request.getType());
        entity.setCategory(request.getCategory());
        entity.setCountry(request.getCountry());
        entity.setWebsite(request.getWebsite());
        entity.setDescription(request.getDescription());
        entity.setCriticality(request.getCriticality());
        entity.setRiskRating(request.getRiskRating());
        entity.setStatus(request.getStatus());
        entity.setSpend(request.getSpend());

        return entity;
    }

    public void updateEntity(UpdateEntityRequest request,
                             ThirdPartyEntity entity) {

        entity.setName(request.getName());
        entity.setType(request.getType());
        entity.setCategory(request.getCategory());
        entity.setCountry(request.getCountry());
        entity.setWebsite(request.getWebsite());
        entity.setDescription(request.getDescription());
        entity.setCriticality(request.getCriticality());
        entity.setRiskRating(request.getRiskRating());
        entity.setStatus(request.getStatus());
        entity.setSpend(request.getSpend());
    }

    public EntityResponse toResponse(ThirdPartyEntity entity) {

        EntityResponse response = new EntityResponse();

        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setType(entity.getType());
        response.setCategory(entity.getCategory());
        response.setCountry(entity.getCountry());
        response.setWebsite(entity.getWebsite());
        response.setDescription(entity.getDescription());
        response.setCriticality(entity.getCriticality());
        response.setRiskRating(entity.getRiskRating());
        response.setComplianceScore(entity.getComplianceScore());
        response.setAssessmentCount(
                entity.getAssessments() != null
                        ? entity.getAssessments().size()
                        : 0
        ); response.setOpenFindings(
                entity.getFindings() != null
                        ? entity.getFindings().size()
                        : 0
        );
        response.setStatus(entity.getStatus());
        response.setSpend(entity.getSpend());

        return response;
    }
}