package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.response.VendorEvidenceResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.VendorEvidence;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.QuestionRepository;
import com.tspmquestionmaster.repository.VendorEvidenceRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class VendorEvidenceServiceImplTest {


    @Mock
    private EntityAssessmentRepository assessmentRepository;


    @Mock
    private QuestionRepository questionRepository;


    @Mock
    private VendorEvidenceRepository evidenceRepository;


    @InjectMocks
    private VendorEvidenceServiceImpl service;



    private EntityAssessment assessment;

    private Question question;

    private VendorEvidence evidence;



    @BeforeEach
    void setUp(){


        assessment = new EntityAssessment();

        assessment.setId(1L);



        question = new Question();

        question.setId(1L);



        evidence = new VendorEvidence();

        evidence.setId(1L);
        evidence.setFileName("security.pdf");
        evidence.setFileType("application/pdf");
        evidence.setFileSize(1000L);

    }





    @Test
    void uploadEvidence_success() throws Exception {


        MultipartFile file =
                new MockMultipartFile(
                        "file",
                        "security.pdf",
                        "application/pdf",
                        "test content".getBytes()
                );



        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        when(questionRepository.findById(1L))
                .thenReturn(
                        Optional.of(question)
                );


        when(evidenceRepository.save(any(VendorEvidence.class)))
                .thenReturn(evidence);



        VendorEvidenceResponse result =
                service.uploadEvidence(
                        1L,
                        1L,
                        file
                );



        assertNotNull(result);

        assertEquals(
                "security.pdf",
                result.getFileName()
        );


        verify(evidenceRepository)
                .save(any(VendorEvidence.class));

    }





    @Test
    void uploadEvidence_assessmentNotFound(){


        MultipartFile file =
                new MockMultipartFile(
                        "file",
                        "test.pdf",
                        "application/pdf",
                        "data".getBytes()
                );


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () ->
                        service.uploadEvidence(
                                1L,
                                1L,
                                file
                        )
        );

    }





    @Test
    void uploadEvidence_questionNotFound(){


        MultipartFile file =
                new MockMultipartFile(
                        "file",
                        "test.pdf",
                        "application/pdf",
                        "data".getBytes()
                );



        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );



        when(questionRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () ->
                        service.uploadEvidence(
                                1L,
                                1L,
                                file
                        )
        );

    }





    @Test
    void getEvidence_success(){


        when(evidenceRepository.findById(1L))
                .thenReturn(
                        Optional.of(evidence)
                );



        VendorEvidenceResponse result =
                service.getEvidence(1L);



        assertNotNull(result);


        assertEquals(
                "security.pdf",
                result.getFileName()
        );

    }





    @Test
    void getEvidence_notFound(){


        when(evidenceRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () ->
                        service.getEvidence(1L)
        );

    }





    @Test
    void getEvidenceByQuestion_success(){


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        when(questionRepository.findById(1L))
                .thenReturn(
                        Optional.of(question)
                );


        when(evidenceRepository
                .findByAssessmentAndQuestion(
                        assessment,
                        question
                ))
                .thenReturn(
                        List.of(evidence)
                );



        List<VendorEvidenceResponse> result =
                service.getEvidenceByQuestion(
                        1L,
                        1L
                );



        assertEquals(
                1,
                result.size()
        );


        assertEquals(
                "security.pdf",
                result.get(0).getFileName()
        );


    }





    @Test
    void getEvidenceByQuestion_assessmentNotFound(){


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () ->
                        service.getEvidenceByQuestion(
                                1L,
                                1L
                        )
        );

    }





    @Test
    void getEvidenceByQuestion_questionNotFound(){


        when(assessmentRepository.findById(1L))
                .thenReturn(
                        Optional.of(assessment)
                );


        when(questionRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () ->
                        service.getEvidenceByQuestion(
                                1L,
                                1L
                        )
        );

    }

}