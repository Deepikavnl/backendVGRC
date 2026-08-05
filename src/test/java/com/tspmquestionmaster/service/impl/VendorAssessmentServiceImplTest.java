package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.AssessmentQuestionResponse;
import com.tspmquestionmaster.dto.SubmitAnswerRequest;
import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;
import com.tspmquestionmaster.entity.AssessmentAnswer;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.enums.QuestionType;
import com.tspmquestionmaster.repository.AssessmentAnswerRepository;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.QuestionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class VendorAssessmentServiceImplTest {


    @Mock
    private EntityAssessmentRepository entityAssessmentRepository;


    @Mock
    private AssessmentAnswerRepository assessmentAnswerRepository;


    @Mock
    private QuestionRepository questionRepository;


    @InjectMocks
    private VendorAssessmentServiceImpl service;


    private EntityAssessment assessment;

    private Question question;



    @BeforeEach
    void setUp() {


        assessment = new EntityAssessment();

        assessment.setId(1L);
        assessment.setCode("ASM001");
        assessment.setTemplateName("Security Template");
        assessment.setReviewerName("Reviewer");
        assessment.setStatus("DRAFT");
        assessment.setProgress(50);
        assessment.setScore(80);
        assessment.setAssessmentToken("TOKEN123");



        question = new Question();

        question.setId(1L);
        question.setQuestionText(
                "Is security policy available?"
        );

        question.setHelpText(
                "Upload security policy"
        );

        question.setQuestionType(
                QuestionType.YESNO
        );

        question.setWeight(10);
        question.setMandatory(true);

    }




    @Test
    void getVendorAssessments_success() {


        when(entityAssessmentRepository.findAll())
                .thenReturn(
                        List.of(assessment)
                );


        List<VendorAssessmentResponse> result =
                service.getVendorAssessments();



        assertEquals(
                1,
                result.size()
        );


        assertEquals(
                "ASM001",
                result.get(0).getCode()
        );

    }





    @Test
    void getAssessmentById_success() {


        when(entityAssessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        VendorAssessmentResponse result =
                service.getAssessmentById(1L);



        assertNotNull(result);

        assertEquals(
                1L,
                result.getId()
        );

    }





    @Test
    void getAssessmentById_notFound() {


        when(entityAssessmentRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () -> service.getAssessmentById(1L)
        );

    }





    @Test
    void getAssessmentQuestions_success() {


        when(entityAssessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        when(questionRepository.findAll())
                .thenReturn(
                        List.of(question)
                );



        List<AssessmentQuestionResponse> result =
                service.getAssessmentQuestions(1L);



        assertEquals(
                1,
                result.size()
        );


        assertEquals(
                "Is security policy available?",
                result.get(0).getQuestionText()
        );


        assertNull(
                result.get(0).getAnswer()
        );

    }





    @Test
    void getAssessmentQuestions_assessmentNotFound() {


        when(entityAssessmentRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );


        assertThrows(
                RuntimeException.class,
                () -> service.getAssessmentQuestions(1L)
        );

    }





    @Test
    void submitAnswer_success() {


        SubmitAnswerRequest request =
                new SubmitAnswerRequest();


        request.setQuestionId(1L);

        request.setAnswerValue(
                "YES"
        );



        when(entityAssessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        when(questionRepository.findById(1L))
                .thenReturn(
                        Optional.of(question)
                );



        service.submitAnswer(
                1L,
                request
        );



        verify(assessmentAnswerRepository)
                .save(any(AssessmentAnswer.class));

    }





    @Test
    void submitAnswer_assessmentNotFound() {


        SubmitAnswerRequest request =
                new SubmitAnswerRequest();


        request.setQuestionId(1L);



        when(entityAssessmentRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () -> service.submitAnswer(1L, request)
        );


        verify(
                assessmentAnswerRepository,
                never()
        ).save(any());

    }





    @Test
    void submitAnswer_questionNotFound() {


        SubmitAnswerRequest request =
                new SubmitAnswerRequest();


        request.setQuestionId(1L);



        when(entityAssessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        when(questionRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () -> service.submitAnswer(1L, request)
        );

    }





    @Test
    void submitAssessment_success() {


        when(entityAssessmentRepository.findById(1L))
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



        verify(entityAssessmentRepository)
                .save(assessment);

    }





    @Test
    void submitAssessment_notFound() {


        when(entityAssessmentRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () -> service.submitAssessment(1L)
        );

    }





    @Test
    void getVendorHistory_success() {


        EntityAssessment submitted =
                new EntityAssessment();


        submitted.setId(2L);
        submitted.setStatus("SUBMITTED");
        submitted.setCode("ASM002");



        EntityAssessment draft =
                new EntityAssessment();


        draft.setId(3L);
        draft.setStatus("DRAFT");
        draft.setCode("ASM003");



        when(entityAssessmentRepository.findAll())
                .thenReturn(
                        List.of(
                                submitted,
                                draft
                        )
                );



        List<VendorAssessmentResponse> result =
                service.getVendorHistory();



        assertEquals(
                1,
                result.size()
        );


        assertEquals(
                "ASM002",
                result.get(0).getCode()
        );

    }

}