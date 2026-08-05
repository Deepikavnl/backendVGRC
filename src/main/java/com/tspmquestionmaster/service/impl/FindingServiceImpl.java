package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.request.CreateFindingRequest;
import com.tspmquestionmaster.dto.response.FindingResponse;
import com.tspmquestionmaster.enums.FindingSeverity;
import com.tspmquestionmaster.repository.FindingRepository;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.service.FindingService;
import com.tspmquestionmaster.entity.Finding;
import com.tspmquestionmaster.enums.FindingStatus;
import com.tspmquestionmaster.entity.EntityAssessment;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
@Transactional
public class FindingServiceImpl implements FindingService {



    private final FindingRepository findingRepository;


    private final EntityAssessmentRepository assessmentRepository;



    @Override
    public FindingResponse createFinding(CreateFindingRequest request) {



        EntityAssessment assessment =
                assessmentRepository.findById(request.getAssessmentId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assessment not found"
                                )
                        );



        Finding finding = new Finding();



        finding.setCode(
                "FND-" + UUID.randomUUID()
                        .toString()
                        .substring(0,8)
                        .toUpperCase()
        );



        finding.setTitle(
                request.getTitle()
        );


        finding.setDescription(
                request.getDescription()
        );


        finding.setRecommendation(
                request.getRecommendation()
        );


        finding.setOwner(
                request.getOwner()
        );


        finding.setDueDate(
                request.getDueDate()
        );


        finding.setTopic(
                request.getTopic()
        );


        finding.setQuestionId(
                request.getQuestionId()
        );


        finding.setAssessment(
                assessment
        );



        finding.setSeverity(
                FindingSeverity.valueOf(
                        request.getSeverity()
                                .toUpperCase()
                )
        );



        finding.setStatus(
                FindingStatus.OPEN
        );



        Finding saved =
                findingRepository.save(finding);



        return mapToResponse(saved);

    }




    @Override
    public List<FindingResponse> getAllFindings() {


        return findingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }





    @Override
    public FindingResponse getFindingById(Long id) {


        Finding finding =
                findingRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Finding not found"
                                )
                        );


        return mapToResponse(finding);

    }





    @Override
    public FindingResponse updateStatus(
            Long id,
            String status
    ) {


        Finding finding =
                findingRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Finding not found"
                                )
                        );



        finding.setStatus(
                FindingStatus.valueOf(
                        status.toUpperCase()
                )
        );


        return mapToResponse(
                findingRepository.save(finding)
        );

    }






    private FindingResponse mapToResponse(
            Finding finding
    ){


        FindingResponse response =
                new FindingResponse();



        response.setId(
                finding.getId()
        );


        response.setCode(
                finding.getCode()
        );


        response.setTitle(
                finding.getTitle()
        );


        response.setDescription(
                finding.getDescription()
        );


        response.setSeverity(
                finding.getSeverity()
                        .name()
        );


        response.setStatus(
                finding.getStatus()
                        .name()
        );


        response.setOwner(
                finding.getOwner()
        );


        response.setDueDate(
                finding.getDueDate()
        );


        response.setRecommendation(
                finding.getRecommendation()
        );


        response.setTopic(
                finding.getTopic()
        );


        response.setQuestionId(
                finding.getQuestionId()
        );



        if(finding.getAssessment()!=null){


            response.setAssessmentId(
                    finding.getAssessment()
                            .getId()
            );


            if(finding.getAssessment().getEntity()!=null){

                response.setEntityId(
                        finding.getAssessment()
                                .getEntity()
                                .getId()
                );


                response.setEntityName(
                        finding.getAssessment()
                                .getEntity()
                                .getName()
                );

            }

        }



        response.setCreatedAt(
                finding.getCreatedAt()
        );


        return response;

    }


}