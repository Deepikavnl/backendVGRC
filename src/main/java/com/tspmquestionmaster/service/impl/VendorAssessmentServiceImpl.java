package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.AssessmentQuestionResponse;
import com.tspmquestionmaster.dto.SubmitAnswerRequest;
import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;
import com.tspmquestionmaster.entity.AssessmentAnswer;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.repository.AssessmentAnswerRepository;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.QuestionRepository;
import com.tspmquestionmaster.service.VendorAssessmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class VendorAssessmentServiceImpl
        implements VendorAssessmentService {


    private final EntityAssessmentRepository entityAssessmentRepository;

    private final AssessmentAnswerRepository assessmentAnswerRepository;

    private final QuestionRepository questionRepository;



    @Override
    public List<VendorAssessmentResponse> getVendorAssessments() {

        return entityAssessmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }


    @Override
    public VendorAssessmentResponse getAssessmentById(Long assessmentId) {


        EntityAssessment assessment =
                entityAssessmentRepository.findById(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"
                                )
                        );


        return mapToResponse(assessment);

    }



    @Override
    public List<AssessmentQuestionResponse> getAssessmentQuestions(
            Long assessmentId
    ) {

        EntityAssessment assessment =
                entityAssessmentRepository.findById(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"
                                )
                        );


        return questionRepository.findAll()
                .stream()
                .map(question -> {


                    AssessmentQuestionResponse response =
                            new AssessmentQuestionResponse();


                    response.setQuestionId(
                            question.getId()
                    );


                    response.setQuestionText(
                            question.getQuestionText()
                    );


                    response.setHelpText(
                            question.getHelpText()
                    );


                    response.setQuestionType(
                            question.getQuestionType().name()
                    );


                    response.setWeight(
                            question.getWeight()
                    );


                    response.setMandatory(
                            question.getMandatory()
                    );


                    response.setAnswer(
                            null
                    );


                    return response;


                })
                .collect(Collectors.toList());

    }



    @Override
    public void submitAnswer(
            Long assessmentId,
            SubmitAnswerRequest request
    ) {


        EntityAssessment assessment =
                entityAssessmentRepository.findById(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"
                                )
                        );


        Question question =
                questionRepository.findById(
                                request.getQuestionId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Question not found"
                                )
                        );


        AssessmentAnswer answer =
                new AssessmentAnswer();

        answer.setAssessment(assessment);
        answer.setQuestion(question);
        answer.setAnswerValue(
                request.getAnswerValue()
        );


        assessmentAnswerRepository.save(answer);

    }




    @Override
    public void submitAssessment(Long assessmentId) {


        EntityAssessment assessment =
                entityAssessmentRepository.findById(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"
                                )
                        );


        assessment.setStatus("SUBMITTED");

        assessment.setProgress(100);


        entityAssessmentRepository.save(assessment);

    }





    private VendorAssessmentResponse mapToResponse(
            EntityAssessment assessment
    ){

        VendorAssessmentResponse response =
                new VendorAssessmentResponse();


        response.setId(
                assessment.getId()
        );

        response.setCode(
                assessment.getCode()
        );

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

        response.setScore(
                assessment.getScore()
        );



        response.setAssessmentToken(
                assessment.getAssessmentToken()
        );


        return response;

    }
    @Override
    public List<VendorAssessmentResponse> getVendorHistory() {

        List<String> historyStatuses = List.of(
                "SUBMITTED",
                "CORRECTION_SUBMITTED",
                "COMPLETED",
                "APPROVED"
        );

        return entityAssessmentRepository.findAll()
                .stream()
                .filter(a -> historyStatuses.contains(a.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }}