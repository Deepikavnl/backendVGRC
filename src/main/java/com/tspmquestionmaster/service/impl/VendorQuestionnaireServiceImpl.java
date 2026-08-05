package com.tspmquestionmaster.service.impl;
import com.tspmquestionmaster.repository.QuestionRepository;
import com.tspmquestionmaster.repository.ReviewerDecisionRepository;
import com.tspmquestionmaster.dto.response.VendorQuestionnairePageResponse;
import com.tspmquestionmaster.dto.response.VendorQuestionnaireResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.Template;
import com.tspmquestionmaster.entity.VendorQuestionnaireAnswer;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.TemplateRepository;
import com.tspmquestionmaster.repository.VendorQuestionnaireAnswerRepository;
import com.tspmquestionmaster.entity.ReviewerDecision;
import com.tspmquestionmaster.service.VendorQuestionnaireService;
import com.tspmquestionmaster.entity.TemplateTopicMapping;
import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import com.tspmquestionmaster.entity.Topic;

import java.util.ArrayList;
import java.util.List;



@Service
@RequiredArgsConstructor
public class VendorQuestionnaireServiceImpl
        implements VendorQuestionnaireService {


    private final EntityAssessmentRepository assessmentRepository;

    private final TemplateRepository templateRepository;
    private final ReviewerDecisionRepository decisionRepository;

    private final VendorQuestionnaireAnswerRepository answerRepository;

    private final QuestionRepository questionRepository;


    @Override
    public List<VendorQuestionnaireResponse> getQuestionnaire(
            Long assessmentId
    ) {


        EntityAssessment assessment =
                assessmentRepository.findById(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"
                                )
                        );



        Template template =
                templateRepository.findByNameWithTopics(
                                assessment.getTemplateName()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Template not found : "
                                                + assessment.getTemplateName()
                                )
                        );



        List<VendorQuestionnaireResponse> responses = new ArrayList<>();
        for (TemplateTopicMapping topicMapping : template.getTopics()) {


            Topic topic = topicMapping.getTopic();


            List<Question> questions =
                    questionRepository.findByTopicId(topic.getId());


            for (Question question : questions) {


                VendorQuestionnaireResponse dto =
                        new VendorQuestionnaireResponse();



                dto.setQuestionId(question.getId());

                dto.setQuestionText(
                        question.getQuestionText()
                );

                dto.setHelpText(
                        question.getHelpText()
                );

                dto.setQuestionType(
                        question.getQuestionType().name()
                );

                dto.setWeight(
                        question.getWeight()
                );


                dto.setMandatory(
                        question.getMandatory()
                );



                answerRepository
                        .findByAssessmentAndQuestion(
                                assessment,
                                question
                        )
                        .ifPresent(answer -> {

                            dto.setAnswer(
                                    answer.getAnswerValue()
                            );

                        });
                ReviewerDecision reviewerDecision =
                        decisionRepository.findByAssessmentIdAndQuestionId(
                                assessment.getId(),
                                question.getId()
                        );

                if (reviewerDecision != null &&
                        (
                                "CORRECTION_REQUIRED".equalsIgnoreCase(assessment.getStatus()) ||
                                        "CORRECTION_SUBMITTED".equalsIgnoreCase(assessment.getStatus()) ||
                                        "UNDER_REVIEW".equalsIgnoreCase(assessment.getStatus())
                        )) {

                    dto.setReviewerDecision(reviewerDecision.getDecision().name());
                    dto.setReviewerComment(reviewerDecision.getComment());
                }

                responses.add(dto);

            }

        }
        return responses;

    }






    @Override
    public void saveAnswer(
            Long assessmentId,
            Long questionId,
            String answerText
    ) {



        EntityAssessment assessment =
                assessmentRepository.findById(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"
                                )
                        );



        Question question =
                questionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Question not found"
                                )
                        );



        VendorQuestionnaireAnswer answer =
                answerRepository
                        .findByAssessmentAndQuestion(
                                assessment,
                                question
                        )
                        .orElse(
                                new VendorQuestionnaireAnswer()
                        );



        answer.setAssessment(
                assessment
        );


        answer.setQuestion(
                question
        );


        answer.setAnswerValue(
                answerText
        );



        answerRepository.save(
                answer
        );

    }





    @Override
    public void submitAssessment(Long assessmentId) {

        EntityAssessment assessment =
                assessmentRepository.findById(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Assessment not found")
                        );


        if ("ASSIGNED".equalsIgnoreCase(assessment.getStatus())
                ||
                "DRAFT".equalsIgnoreCase(assessment.getStatus())) {


            assessment.setStatus("SUBMITTED");


        }
        else if ("CORRECTION_REQUIRED".equalsIgnoreCase(
                assessment.getStatus()
        )) {


            assessment.setStatus("CORRECTION_SUBMITTED");


        }


        assessment.setProgress(100);

        assessmentRepository.save(assessment);

    }






    @Override
    public VendorQuestionnairePageResponse getQuestionnaireByToken(
            String token
    ) {



        EntityAssessment assessment =
                assessmentRepository
                        .findByAssessmentToken(token)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Invalid assessment token"
                                )
                        );



        List<VendorQuestionnaireResponse> questions =
                getQuestionnaire(
                        assessment.getId()
                );



        VendorQuestionnairePageResponse response =
                new VendorQuestionnairePageResponse();



        response.setAssessmentId(
                assessment.getId()
        );



        response.setQuestions(
                questions
        );



        return response;

    }
    @Override
    public VendorQuestionnairePageResponse getQuestionnairePage(
            Long assessmentId
    ) {


        EntityAssessment assessment =
                assessmentRepository.findById(assessmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found"
                                )
                        );


        List<VendorQuestionnaireResponse> questions =
                getQuestionnaire(assessmentId);



        VendorQuestionnairePageResponse response =
                new VendorQuestionnairePageResponse();


        response.setAssessmentId(
                assessment.getId()
        );


        response.setStatus(
                assessment.getStatus()
        );


        response.setReviewerComment(
                assessment.getReviewerComment()
        );
        response.setAssessmentToken(
                assessment.getAssessmentToken()
        );

        response.setQuestions(
                questions
        );


        return response;

    }

}