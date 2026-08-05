package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.VendorEvidenceResponse;
import com.tspmquestionmaster.entity.VendorEvidence;
import com.tspmquestionmaster.repository.VendorEvidenceRepository;
import com.tspmquestionmaster.service.VendorEvidenceService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.mock.web.MockMultipartFile;

import org.springframework.test.context.bean.override.mockito.MockitoBean;

import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import org.springframework.security.test.context.support.WithMockUser;



@WebMvcTest(VendorEvidenceController.class)
@WithMockUser(
        username = "admin",
        roles = {"ADMIN"}
)
class VendorEvidenceControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private VendorEvidenceService evidenceService;


    @MockitoBean
    private VendorEvidenceRepository evidenceRepository;




    @Test
    void upload_success() throws Exception {


        VendorEvidenceResponse response =
                new VendorEvidenceResponse();


        when(
                evidenceService.uploadEvidence(
                        eq(1L),
                        eq(2L),
                        any()
                )
        )
                .thenReturn(response);



        MockMultipartFile file =
                new MockMultipartFile(
                        "file",
                        "test.pdf",
                        "application/pdf",
                        "dummy content".getBytes()
                );



        mockMvc.perform(
                        multipart(
                                "/api/vendor-evidence/upload/1/2"
                        )
                                .file(file)
                                .with(csrf())
                )
                .andExpect(status().isOk());



        verify(evidenceService)
                .uploadEvidence(
                        eq(1L),
                        eq(2L),
                        any()
                );

    }







    @Test
    void getEvidenceByQuestion_success() throws Exception {


        when(
                evidenceService.getEvidenceByQuestion(
                        1L,
                        2L
                )
        )
                .thenReturn(
                        List.of(
                                new VendorEvidenceResponse()
                        )
                );



        mockMvc.perform(
                        get(
                                "/api/vendor-evidence/assessment/1/question/2"
                        )
                )
                .andExpect(status().isOk());



        verify(evidenceService)
                .getEvidenceByQuestion(
                        1L,
                        2L
                );

    }








    @Test
    void viewEvidence_success() throws Exception {


        java.nio.file.Path tempFile =
                java.nio.file.Files.createTempFile(
                        "evidence",
                        ".pdf"
                );


        java.nio.file.Files.write(
                tempFile,
                "dummy pdf content".getBytes()
        );


        VendorEvidence evidence =
                new VendorEvidence();


        evidence.setFilePath(
                tempFile.toString()
        );


        evidence.setFileType(
                "application/pdf"
        );


        evidence.setFileName(
                "evidence.pdf"
        );


        when(
                evidenceRepository.findById(1L)
        )
                .thenReturn(
                        Optional.of(evidence)
                );



        mockMvc.perform(
                        get(
                                "/api/vendor-evidence/1/view"
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        header().string(
                                "Content-Disposition",
                                "inline; filename=\"evidence.pdf\""
                        )
                );



        verify(evidenceRepository)
                .findById(1L);


        java.nio.file.Files.deleteIfExists(tempFile);

    }



    @Test
    void viewEvidence_notFound() throws Exception {


        when(
                evidenceRepository.findById(1L)
        )
                .thenReturn(
                        Optional.empty()
                );



        mockMvc.perform(
                        get(
                                "/api/vendor-evidence/1/view"
                        )
                )
                .andExpect(
                        status().isNotFound()
                );

    }



}