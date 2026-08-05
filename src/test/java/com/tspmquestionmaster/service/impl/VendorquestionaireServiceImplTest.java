package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.response.VendorQuestionnairePageResponse;
import com.tspmquestionmaster.dto.response.VendorQuestionnaireResponse;
import com.tspmquestionmaster.entity.*;
import com.tspmquestionmaster.enums.QuestionType;
import com.tspmquestionmaster.repository.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;



@ExtendWith(MockitoExtension.class)
class VendorQuestionnaireServiceImplTest {


    @Mock
    private EntityAssessmentRepository assessmentRepository;


    @Mock
    private TemplateRepository templateRepository;


    @Mock
    private ReviewerDecisionRepository decisionRepository;


    @Mock
    private VendorQuestionnaireAnswerRepository answerRepository;


    @Mock
    private QuestionRepository questionRepository;



    @InjectMocks
    private VendorQuestionnaireServiceImpl service;



    private EntityAssessment assessment;

    private Question question;

    private Template template;

    private Topic topic;





    @BeforeEach
    void setUp(){


        assessment = new EntityAssessment();

        assessment.setId(1L);
        assessment.setTemplateName("Security Template");
        assessment.setStatus("DRAFT");
        assessment.setAssessmentToken("TOKEN123");
        assessment.setProgress(0);



        topic = new Topic();

        topic.setId(1L);
        topic.setName("Security");



        question = new Question();

        question.setId(1L);
        question.setQuestionText(
                "Is security policy available?"
        );

        question.setHelpText(
                "Upload document"
        );

        question.setQuestionType(
                QuestionType.YESNO
        );

        question.setWeight(10);

        question.setMandatory(true);



        template = new Template();

        template.setName(
                "Security Template"
        );

    }





    @Test
    void getQuestionnaire_assessmentNotFound(){


        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.empty());


        assertThrows(
                RuntimeException.class,
                () -> service.getQuestionnaire(1L)
        );

    }






    @Test
    void getQuestionnaire_templateNotFound(){


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        when(templateRepository.findByNameWithTopics(
                "Security Template"))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () -> service.getQuestionnaire(1L)
        );

    }





    @Test
    void saveAnswer_success(){


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        when(questionRepository.findById(1L))
                .thenReturn(
                        Optional.of(question)
                );


        when(answerRepository
                .findByAssessmentAndQuestion(
                        assessment,
                        question
                ))
                .thenReturn(Optional.empty());



        service.saveAnswer(
                1L,
                1L,
                "YES"
        );



        verify(answerRepository)
                .save(any(VendorQuestionnaireAnswer.class));

    }





    @Test
    void saveAnswer_existingAnswer_success(){


        VendorQuestionnaireAnswer answer =
                new VendorQuestionnaireAnswer();


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        when(questionRepository.findById(1L))
                .thenReturn(
                        Optional.of(question)
                );


        when(answerRepository
                .findByAssessmentAndQuestion(
                        assessment,
                        question
                ))
                .thenReturn(
                        Optional.of(answer)
                );



        service.saveAnswer(
                1L,
                1L,
                "NO"
        );



        assertEquals(
                "NO",
                answer.getAnswerValue()
        );


        verify(answerRepository)
                .save(answer);

    }





    @Test
    void submitAssessment_draft_success(){


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        service.submitAssessment(1L);



        assertEquals(
                "SUBMITTED",
                assessment.getStatus()
        );


        assertEquals(
                100,
                assessment.getProgress()
        );


        verify(assessmentRepository)
                .save(assessment);

    }





    @Test
    void submitAssessment_correctionRequired_success(){


        assessment.setStatus(
                "CORRECTION_REQUIRED"
        );


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        service.submitAssessment(1L);



        assertEquals(
                "CORRECTION_SUBMITTED",
                assessment.getStatus()
        );

    }





    @Test
    void submitAssessment_notFound(){


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () -> service.submitAssessment(1L)
        );

    }





    @Test
    void getQuestionnaireByToken_success(){


        when(assessmentRepository
                .findByAssessmentToken("TOKEN123"))
                .thenReturn(
                        Optional.of(assessment)
                );


        VendorQuestionnaireServiceImpl spy =
                spy(service);



        doReturn(List.of())
                .when(spy)
                .getQuestionnaire(1L);



        VendorQuestionnairePageResponse result =
                spy.getQuestionnaireByToken(
                        "TOKEN123"
                );



        assertEquals(
                1L,
                result.getAssessmentId()
        );

    }





    @Test
    void getQuestionnairePage_success(){


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        VendorQuestionnaireServiceImpl spy =
                spy(service);


        doReturn(List.of())
                .when(spy)
                .getQuestionnaire(1L);



        VendorQuestionnairePageResponse result =
                spy.getQuestionnairePage(1L);



        assertEquals(
                "DRAFT",
                result.getStatus()
        );


    }





    @Test
    void getQuestionnaireByToken_invalidToken(){


        when(assessmentRepository
                .findByAssessmentToken("BAD"))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () ->
                        service.getQuestionnaireByToken(
                                "BAD"
                        )
        );

    }

}