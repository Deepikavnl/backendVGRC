package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.CreateAssessmentRequest;
import com.tspmquestionmaster.dto.request.UpdateAssessmentRequest;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.exception.DuplicateResourceException;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.AssessmentMapper;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;
import com.tspmquestionmaster.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AssessmentServiceImpl implements AssessmentService {

    private final EntityAssessmentRepository entityAssessmentRepository;

    private final ThirdPartyEntityRepository entityRepository;

    private final AssessmentMapper mapper;


    @Override
    public AssessmentResponse createAssessment(
            CreateAssessmentRequest request) {

        if (entityAssessmentRepository.existsByCode(request.getCode())) {

            throw new DuplicateResourceException(
                    "Assessment code already exists : " + request.getCode()
            );
        }

        ThirdPartyEntity entity =
                entityRepository.findById(request.getEntityId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Entity not found : "
                                                + request.getEntityId()
                                ));


        EntityAssessment assessment =
                mapper.toEntity(request, entity);


        EntityAssessment saved =
                entityAssessmentRepository.save(assessment);


        return mapper.toResponse(saved);
    }

    @Override
    public AssessmentResponse updateAssessment(
            Long id,
            UpdateAssessmentRequest request) {


        EntityAssessment assessment =
                entityAssessmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assessment not found : " + id
                                ));



        if (!assessment.getCode().equals(request.getCode())
                && entityAssessmentRepository.existsByCode(request.getCode())) {


            throw new DuplicateResourceException(
                    "Assessment code already exists : "
                            + request.getCode()
            );
        }



        ThirdPartyEntity entity =
                entityRepository.findById(request.getEntityId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Entity not found : "
                                                + request.getEntityId()
                                ));



        mapper.updateEntity(
                request,
                assessment,
                entity
        );


        EntityAssessment updated =
                entityAssessmentRepository.save(assessment);


        return mapper.toResponse(updated);
    }




    @Override
    @Transactional(readOnly = true)
    public AssessmentResponse getAssessmentById(Long id) {


        EntityAssessment assessment =
                entityAssessmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assessment not found : " + id
                                ));


        return mapper.toResponse(assessment);
    }




    @Override
    @Transactional(readOnly = true)
    public List<AssessmentResponse> getAllAssessments() {


        return entityAssessmentRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }




    @Override
    @Transactional(readOnly = true)
    public List<AssessmentResponse> getAssessmentsByEntity(
            Long entityId) {


        return entityAssessmentRepository.findByEntityId(entityId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }





    @Override
    public void deleteAssessment(Long id) {


        EntityAssessment assessment =
                entityAssessmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assessment not found : " + id
                                ));


        entityAssessmentRepository.delete(assessment);
    }

}