package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.ReviewerAssessmentDecisionRequest;
import com.tspmquestionmaster.dto.request.ReviewerQuestionDecisionRequest;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.dto.response.ReviewerDecisionResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.ReviewerDecision;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.entity.VendorEvidence;
import com.tspmquestionmaster.entity.VendorQuestionnaireAnswer;
import com.tspmquestionmaster.enums.ReviewerDecisionType;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.ReviewerDecisionRepository;
import com.tspmquestionmaster.repository.VendorEvidenceRepository;
import com.tspmquestionmaster.repository.VendorQuestionnaireAnswerRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewerServiceImplTest {

    @Mock
    private EntityAssessmentRepository assessmentRepository;

    @Mock
    private ReviewerDecisionRepository decisionRepository;

    @Mock
    private VendorQuestionnaireAnswerRepository answerRepository;

    @Mock
    private VendorEvidenceRepository evidenceRepository;

    @InjectMocks
    private ReviewerServiceImpl reviewerService;

    private EntityAssessment assessment;
    private ThirdPartyEntity entity;
    private Question question;
    private VendorQuestionnaireAnswer answer;
    private VendorEvidence evidence;
    private ReviewerDecision decision;

    @BeforeEach
    void setUp() {

        entity = new ThirdPartyEntity();
        entity.setId(1L);
        entity.setName("ABC Vendor");
        entity.setRiskRating("HIGH");

        assessment = new EntityAssessment();
        assessment.setId(1L);
        assessment.setCode("ASM-001");
        assessment.setStatus("SUBMITTED");
        assessment.setTemplateName("Security Template");
        assessment.setReviewerName("John");
        assessment.setProgress(80);
        assessment.setAssessmentToken("TOKEN123");
        assessment.setEntity(entity);
        assessment.setDueDate(LocalDate.now().plusDays(2));
        assessment.setSubmittedAt(LocalDate.now());
        assessment.setCreatedAt(LocalDateTime.now());

        question = new Question();
        question.setId(10L);
        question.setCode("Q001");
        question.setQuestionText("Is MFA enabled?");
        question.setWeight(5);
        question.setMandatory(true);

        answer = new VendorQuestionnaireAnswer();
        answer.setAssessment(assessment);
        answer.setQuestion(question);
        answer.setAnswerValue("Yes");

        evidence = new VendorEvidence();
        evidence.setId(100L);
        evidence.setFileName("evidence.pdf");
        evidence.setFileType("application/pdf");
        evidence.setFileSize(2048L);

        decision = new ReviewerDecision();
        decision.setId(20L);
        decision.setAssessment(assessment);
        decision.setQuestionId(10L);
        decision.setDecision(ReviewerDecisionType.APPROVED);
        decision.setComment("Looks good");
        decision.setReviewedAt(LocalDateTime.now());
    }
    @Test
    void getWorkspace_success() {

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        when(assessmentRepository.save(any(EntityAssessment.class)))
                .thenReturn(assessment);

        when(answerRepository.findByAssessment(assessment))
                .thenReturn(List.of(answer));

        when(decisionRepository.findByAssessmentIdAndQuestionId(
                1L,
                10L
        )).thenReturn(decision);

        when(evidenceRepository.findByAssessmentAndQuestion(
                assessment,
                question
        )).thenReturn(List.of(evidence));

        AssessmentResponse response =
                reviewerService.getWorkspace(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("ASM-001", response.getCode());
        assertEquals("UNDER_REVIEW", response.getStatus());
        assertEquals(1, response.getAnswers().size());

        verify(assessmentRepository).save(assessment);
    }


    @Test
    void getWorkspace_assessmentNotFound() {

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> reviewerService.getWorkspace(1L)
                );

        assertTrue(
                ex.getMessage().contains("Assessment not found")
        );

        verify(answerRepository, never())
                .findByAssessment(any());
    }


    @Test
    void getWorkspace_noAnswers() {

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        when(assessmentRepository.save(any(EntityAssessment.class)))
                .thenReturn(assessment);

        when(answerRepository.findByAssessment(assessment))
                .thenReturn(List.of());

        AssessmentResponse response =
                reviewerService.getWorkspace(1L);

        assertNotNull(response);
        assertTrue(response.getAnswers().isEmpty());

        verify(answerRepository)
                .findByAssessment(assessment);
    }


    @Test
    void getWorkspace_answerWithoutQuestion() {

        VendorQuestionnaireAnswer invalid =
                new VendorQuestionnaireAnswer();

        invalid.setAssessment(assessment);
        invalid.setQuestion(null);

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        when(assessmentRepository.save(any(EntityAssessment.class)))
                .thenReturn(assessment);

        when(answerRepository.findByAssessment(assessment))
                .thenReturn(List.of(invalid));

        AssessmentResponse response =
                reviewerService.getWorkspace(1L);

        assertNotNull(response);
        assertEquals(0, response.getAnswers().size());
    }
    @Test
    void saveDecision_success() {

        ReviewerQuestionDecisionRequest request =
                new ReviewerQuestionDecisionRequest();

        request.setAssessmentId(1L);
        request.setQuestionId(10L);
        request.setDecision("APPROVED");
        request.setComment("Approved");

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        doNothing().when(decisionRepository)
                .deleteByAssessmentIdAndQuestionId(1L, 10L);

        when(decisionRepository.save(any(ReviewerDecision.class)))
                .thenReturn(decision);

        ReviewerDecisionResponse response =
                reviewerService.saveDecision(request);

        assertNotNull(response);
        assertEquals(20L, response.getId());
        assertEquals(1L, response.getAssessmentId());
        assertEquals(10L, response.getQuestionId());
        assertEquals("APPROVED", response.getDecision());
        assertEquals("Looks good", response.getComment());

        verify(decisionRepository)
                .deleteByAssessmentIdAndQuestionId(1L, 10L);

        verify(decisionRepository)
                .save(any(ReviewerDecision.class));
    }


    @Test
    void saveDecision_assessmentNotFound() {

        ReviewerQuestionDecisionRequest request =
                new ReviewerQuestionDecisionRequest();

        request.setAssessmentId(1L);
        request.setQuestionId(10L);
        request.setDecision("APPROVED");

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> reviewerService.saveDecision(request)
                );

        assertTrue(ex.getMessage().contains("Assessment not found"));

        verify(decisionRepository, never())
                .save(any());
    }


    @Test
    void saveDecision_replacesExistingDecision() {

        ReviewerQuestionDecisionRequest request =
                new ReviewerQuestionDecisionRequest();

        request.setAssessmentId(1L);
        request.setQuestionId(10L);
        request.setDecision("APPROVED");
        request.setComment("Updated");

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        doNothing().when(decisionRepository)
                .deleteByAssessmentIdAndQuestionId(1L, 10L);

        when(decisionRepository.save(any(ReviewerDecision.class)))
                .thenReturn(decision);

        reviewerService.saveDecision(request);

        verify(decisionRepository)
                .deleteByAssessmentIdAndQuestionId(1L, 10L);

        verify(decisionRepository)
                .save(any(ReviewerDecision.class));
    }


    @Test
    void saveDecision_invalidDecision() {

        ReviewerQuestionDecisionRequest request =
                new ReviewerQuestionDecisionRequest();

        request.setAssessmentId(1L);
        request.setQuestionId(10L);
        request.setDecision("INVALID");

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        assertThrows(
                IllegalArgumentException.class,
                () -> reviewerService.saveDecision(request)
        );

        verify(decisionRepository, never())
                .save(any());
    }
    @Test
    void approveAssessment_success() {

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        when(assessmentRepository.save(any(EntityAssessment.class)))
                .thenReturn(assessment);

        reviewerService.approveAssessment(1L);

        assertEquals(
                "APPROVED",
                assessment.getStatus()
        );

        assertNotNull(
                assessment.getCompletedAt()
        );

        verify(assessmentRepository)
                .save(assessment);
    }


    @Test
    void approveAssessment_assessmentNotFound() {

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> reviewerService.approveAssessment(1L)
                );

        assertTrue(
                ex.getMessage().contains("Assessment not found")
        );

        verify(assessmentRepository, never())
                .save(any());
    }


    @Test
    void requestCorrection_success() {

        ReviewerAssessmentDecisionRequest request =
                new ReviewerAssessmentDecisionRequest();

        request.setComment(
                "Please upload valid evidence."
        );

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        when(assessmentRepository.save(any(EntityAssessment.class)))
                .thenReturn(assessment);

        reviewerService.requestCorrection(
                1L,
                request
        );

        assertEquals(
                "CORRECTION_REQUIRED",
                assessment.getStatus()
        );

        assertEquals(
                "Please upload valid evidence.",
                assessment.getReviewerComment()
        );

        verify(assessmentRepository)
                .save(assessment);
    }


    @Test
    void requestCorrection_assessmentNotFound() {

        ReviewerAssessmentDecisionRequest request =
                new ReviewerAssessmentDecisionRequest();

        request.setComment("Need correction");

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> reviewerService.requestCorrection(
                                1L,
                                request
                        )
                );

        assertTrue(
                ex.getMessage().contains("Assessment not found")
        );

        verify(assessmentRepository, never())
                .save(any());
    }
    @Test
    void submitReview_correctionExists() {

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        when(decisionRepository.existsByAssessmentIdAndDecision(
                1L,
                ReviewerDecisionType.CORRECTION
        )).thenReturn(true);

        when(assessmentRepository.save(any(EntityAssessment.class)))
                .thenReturn(assessment);

        reviewerService.submitReview(1L);

        assertEquals(
                "CORRECTION_REQUIRED",
                assessment.getStatus()
        );

        verify(assessmentRepository)
                .save(assessment);
    }



    @Test
    void submitReview_noCorrection() {

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.of(assessment));

        when(decisionRepository.existsByAssessmentIdAndDecision(
                1L,
                ReviewerDecisionType.CORRECTION
        )).thenReturn(false);

        when(assessmentRepository.save(any(EntityAssessment.class)))
                .thenReturn(assessment);

        reviewerService.submitReview(1L);

        assertEquals(
                "COMPLETED",
                assessment.getStatus()
        );

        verify(assessmentRepository)
                .save(assessment);
    }


    @Test
    void submitReview_assessmentNotFound() {

        when(assessmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> reviewerService.submitReview(1L)
        );

        verify(assessmentRepository, never())
                .save(any());
    }}
