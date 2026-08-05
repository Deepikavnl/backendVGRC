package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.response.ReviewerDecisionResponse;
import com.tspmquestionmaster.dto.request.ReviewerQuestionDecisionRequest;

import com.tspmquestionmaster.dto.request.ReviewerAssessmentDecisionRequest;

import com.tspmquestionmaster.dto.response.AssessmentAnswerResponse;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.dto.response.VendorEvidenceResponse;

import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.ReviewerDecision;
import com.tspmquestionmaster.entity.VendorEvidence;
import com.tspmquestionmaster.entity.VendorQuestionnaireAnswer;

import com.tspmquestionmaster.enums.ReviewerDecisionType;

import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.ReviewerDecisionRepository;
import com.tspmquestionmaster.repository.VendorEvidenceRepository;
import com.tspmquestionmaster.repository.VendorQuestionnaireAnswerRepository;

import com.tspmquestionmaster.service.ReviewerService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;



@Service
@RequiredArgsConstructor
@Transactional
public class ReviewerServiceImpl implements ReviewerService {



    private final EntityAssessmentRepository assessmentRepository;


    private final ReviewerDecisionRepository decisionRepository;


    private final VendorQuestionnaireAnswerRepository answerRepository;


    private final VendorEvidenceRepository evidenceRepository;




    @Override
    public AssessmentResponse getWorkspace(
            Long assessmentId
    ) {



        EntityAssessment assessment =
                assessmentRepository.findById(
                                assessmentId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assessment not found : "
                                                + assessmentId
                                )
                        );



        /*
         * When vendor submits assessment,
         * reviewer opens workspace.
         * Change status automatically.
         */
        if ("SUBMITTED".equalsIgnoreCase(assessment.getStatus())
                || "CORRECTION_SUBMITTED".equalsIgnoreCase(assessment.getStatus())) {

            assessment.setStatus("UNDER_REVIEW");
            assessmentRepository.save(assessment);



        }




        AssessmentResponse response =
                new AssessmentResponse();



        response.setId(
                assessment.getId()
        );


        response.setCode(
                assessment.getCode()
        );



        if(
                assessment.getEntity()!=null
        ){

            response.setEntityId(
                    assessment.getEntity().getId()
            );


            response.setEntityName(
                    assessment.getEntity().getName()
            );


            response.setRiskLevel(
                    assessment.getEntity()
                            .getRiskRating()
            );

        }



        response.setTemplateName(
                assessment.getTemplateName()
        );


        response.setReviewerName(
                assessment.getReviewerName()
        );


        response.setStatus(
                assessment.getStatus()
        );


        response.setProgress(
                assessment.getProgress()
        );


        response.setDueDate(
                assessment.getDueDate()
        );


        response.setSubmittedAt(
                assessment.getSubmittedAt()
        );


        response.setCompletedAt(
                assessment.getCompletedAt()
        );


        response.setScore(
                assessment.getScore()
        );


        response.setAssessmentToken(
                assessment.getAssessmentToken()
        );



        response.setAssessmentLink(

                "http://localhost:5173/vendor-assessment/"
                        +
                        assessment.getAssessmentToken()

        );



        response.setCreatedAt(
                assessment.getCreatedAt()
        );



        response.setOverdue(

                assessment.getDueDate()!=null

                        &&
                        assessment.getDueDate()
                                .isBefore(
                                        LocalDate.now()
                                )

                        &&
                        !"APPROVED"
                                .equalsIgnoreCase(
                                        assessment.getStatus()
                                )

        );



        List<AssessmentAnswerResponse> answerResponses =
                new ArrayList<>();


        List<VendorQuestionnaireAnswer> answers =
                answerRepository.findByAssessment(
                        assessment
                );



        for(
                VendorQuestionnaireAnswer answer : answers
        ){

            if(
                    answer.getQuestion()==null
            ){
                continue;
            }



            AssessmentAnswerResponse dto =
                    new AssessmentAnswerResponse();



            dto.setQuestionId(
                    answer.getQuestion()
                            .getId()
            );



            dto.setQuestionCode(
                    answer.getQuestion()
                            .getCode()
            );



            dto.setQuestionText(
                    answer.getQuestion()
                            .getQuestionText()
            );


            dto.setAnswerValue(
                    answer.getAnswerValue()
            );



            dto.setWeight(
                    answer.getQuestion()
                            .getWeight()
            );



            dto.setMandatory(
                    answer.getQuestion()
                            .getMandatory()
            );
            dto.setMandatory(
                    answer.getQuestion()
                            .getMandatory()
            );



            ReviewerDecision existingDecision =
                    decisionRepository.findByAssessmentIdAndQuestionId(
                            assessment.getId(),
                            answer.getQuestion()
                                    .getId()
                    );



            if(
                    existingDecision != null
                            &&
                            existingDecision.getDecision()!=null
            ){

                dto.setReviewerDecision(
                        existingDecision.getDecision()
                                .name()
                );


                dto.setReviewerComment(
                        existingDecision.getComment()
                );


            }
            else{


                dto.setReviewerDecision(
                        null
                );


                dto.setReviewerComment(
                        null
                );

            }




            List<VendorEvidence> evidences =
                    evidenceRepository.findByAssessmentAndQuestion(
                            assessment,
                            answer.getQuestion()
                    );



            List<VendorEvidenceResponse> evidenceResponses =
                    evidences.stream()
                            .map(
                                    evidence -> {


                                        VendorEvidenceResponse evidenceDto =
                                                new VendorEvidenceResponse();



                                        evidenceDto.setId(
                                                evidence.getId()
                                        );


                                        evidenceDto.setFileName(
                                                evidence.getFileName()
                                        );


                                        evidenceDto.setFileType(
                                                evidence.getFileType()
                                        );


                                        evidenceDto.setFileSize(
                                                evidence.getFileSize()
                                        );



                                        evidenceDto.setViewUrl(

                                                "/api/vendor-evidence/"
                                                        +
                                                        evidence.getId()
                                                        +
                                                        "/view"

                                        );



                                        return evidenceDto;

                                    }
                            )
                            .toList();




            dto.setEvidence(
                    evidenceResponses
            );



            answerResponses.add(
                    dto
            );



        }



        response.setAnswers(
                answerResponses
        );



        return response;


    }







    @Override
    public ReviewerDecisionResponse saveDecision(
            ReviewerQuestionDecisionRequest request
    ) {



        EntityAssessment assessment =
                assessmentRepository.findById(
                                request.getAssessmentId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assessment not found : "
                                                +
                                                request.getAssessmentId()
                                )
                        );




        decisionRepository
                .deleteByAssessmentIdAndQuestionId(
                        request.getAssessmentId(),
                        request.getQuestionId()
                );




        ReviewerDecision decision =
                new ReviewerDecision();



        decision.setAssessment(
                assessment
        );



        decision.setQuestionId(
                request.getQuestionId()
        );



        decision.setDecision(

                ReviewerDecisionType.valueOf(
                        request.getDecision()
                )

        );



        decision.setComment(
                request.getComment()
        );



        decision.setReviewedAt(
                LocalDateTime.now()
        );



        ReviewerDecision saved =
                decisionRepository.save(
                        decision
                );




        ReviewerDecisionResponse response =
                new ReviewerDecisionResponse();



        response.setId(
                saved.getId()
        );



        response.setAssessmentId(
                saved.getAssessment()
                        .getId()
        );



        response.setQuestionId(
                saved.getQuestionId()
        );



        response.setDecision(
                saved.getDecision()
                        .name()
        );



        response.setComment(
                saved.getComment()
        );



        response.setReviewedAt(
                saved.getReviewedAt()
        );



        return response;


    }




    @Override
    public void approveAssessment(
            Long assessmentId
    ) {



        EntityAssessment assessment =
                assessmentRepository.findById(
                                assessmentId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assessment not found : "
                                                +
                                                assessmentId
                                )
                        );



        assessment.setStatus(
                "APPROVED"
        );



        assessment.setCompletedAt(
                LocalDate.now()
        );



        assessmentRepository.save(
                assessment
        );


    }







    @Override
    public void requestCorrection(
            Long assessmentId,
            ReviewerAssessmentDecisionRequest request
    ) {



        EntityAssessment assessment =
                assessmentRepository.findById(
                                assessmentId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assessment not found : "
                                                +
                                                assessmentId
                                )
                        );



        assessment.setStatus(
                "CORRECTION_REQUIRED"
        );



        assessment.setReviewerComment(
                request.getComment()
        );



        assessmentRepository.save(
                assessment
        );


    }
    @Override
    @Transactional
    public void submitReview(Long assessmentId){

        EntityAssessment assessment =
                assessmentRepository.findById(assessmentId)
                        .orElseThrow();


        boolean correctionExists =
                decisionRepository
                        .existsByAssessmentIdAndDecision(
                                assessmentId,
                                ReviewerDecisionType.CORRECTION
                        );


        if(correctionExists){

            assessment.setStatus(
                    "CORRECTION_REQUIRED"
            );

        }else{

            assessment.setStatus(
                    "COMPLETED"
            );
        }


        assessmentRepository.save(
                assessment
        );
    }
}