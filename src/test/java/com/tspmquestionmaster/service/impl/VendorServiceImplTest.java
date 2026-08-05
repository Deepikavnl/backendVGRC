package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;

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
class VendorServiceImplTest {


    @Mock
    private ThirdPartyEntityRepository thirdPartyEntityRepository;


    @Mock
    private EntityAssessmentRepository assessmentRepository;


    @InjectMocks
    private VendorServiceImpl service;



    private ThirdPartyEntity vendor;

    private EntityAssessment assessment;



    @BeforeEach
    void setUp(){


        vendor = new ThirdPartyEntity();

        vendor.setId(1L);
        vendor.setName("ABC Vendor");
        vendor.setType("Vendor");
        vendor.setCategory("IT");
        vendor.setCountry("India");
        vendor.setWebsite("https://abc.com");
        vendor.setRiskRating("HIGH");
        vendor.setStatus("ACTIVE");



        assessment = new EntityAssessment();

        assessment.setId(1L);
        assessment.setCode("ASM001");
        assessment.setTemplateName(
                "Security Template"
        );
        assessment.setReviewerName(
                "Reviewer"
        );
        assessment.setStatus(
                "SUBMITTED"
        );
        assessment.setProgress(100);
        assessment.setScore(90);
        assessment.setAssessmentToken(
                "TOKEN123"
        );

    }




    @Test
    void getAllVendors_success(){


        when(thirdPartyEntityRepository.findAll())
                .thenReturn(
                        List.of(vendor)
                );


        List<ThirdPartyEntity> result =
                service.getAllVendors();



        assertEquals(
                1,
                result.size()
        );


        assertEquals(
                "ABC Vendor",
                result.get(0).getName()
        );


        verify(thirdPartyEntityRepository)
                .findAll();

    }





    @Test
    void getVendorById_success(){


        when(thirdPartyEntityRepository.findById(1L))
                .thenReturn(
                        Optional.of(vendor)
                );


        ThirdPartyEntity result =
                service.getVendorById(1L);



        assertNotNull(result);


        assertEquals(
                "ABC Vendor",
                result.getName()
        );

    }





    @Test
    void getVendorById_notFound(){


        when(thirdPartyEntityRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );


        assertThrows(
                RuntimeException.class,
                () ->
                        service.getVendorById(1L)
        );

    }





    @Test
    void createVendor_success(){


        when(thirdPartyEntityRepository
                .existsByNameIgnoreCase(
                        "ABC Vendor"
                ))
                .thenReturn(false);



        when(thirdPartyEntityRepository.save(vendor))
                .thenReturn(vendor);



        ThirdPartyEntity result =
                service.createVendor(vendor);



        assertNotNull(result);


        assertEquals(
                "ABC Vendor",
                result.getName()
        );


        verify(thirdPartyEntityRepository)
                .save(vendor);

    }





    @Test
    void createVendor_duplicate(){


        when(thirdPartyEntityRepository
                .existsByNameIgnoreCase(
                        "ABC Vendor"
                ))
                .thenReturn(true);



        assertThrows(
                RuntimeException.class,
                () ->
                        service.createVendor(vendor)
        );



        verify(
                thirdPartyEntityRepository,
                never()
        ).save(any());

    }





    @Test
    void updateVendor_success(){


        ThirdPartyEntity update =
                new ThirdPartyEntity();


        update.setName("Updated Vendor");
        update.setType("Vendor");
        update.setCategory("Finance");
        update.setCountry("USA");
        update.setRiskRating("LOW");
        update.setStatus("ACTIVE");



        when(thirdPartyEntityRepository.findById(1L))
                .thenReturn(
                        Optional.of(vendor)
                );



        when(thirdPartyEntityRepository.save(vendor))
                .thenReturn(vendor);



        ThirdPartyEntity result =
                service.updateVendor(
                        1L,
                        update
                );



        assertNotNull(result);


        verify(thirdPartyEntityRepository)
                .save(vendor);

    }





    @Test
    void updateVendor_notFound(){


        when(thirdPartyEntityRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () ->
                        service.updateVendor(
                                1L,
                                vendor
                        )
        );

    }





    @Test
    void deleteVendor_success(){


        when(thirdPartyEntityRepository.findById(1L))
                .thenReturn(
                        Optional.of(vendor)
                );



        service.deleteVendor(1L);



        verify(thirdPartyEntityRepository)
                .delete(vendor);

    }





    @Test
    void deleteVendor_notFound(){


        when(thirdPartyEntityRepository.findById(1L))
                .thenReturn(
                        Optional.empty()
                );



        assertThrows(
                RuntimeException.class,
                () ->
                        service.deleteVendor(1L)
        );


        verify(
                thirdPartyEntityRepository,
                never()
        ).delete(any());

    }





    @Test
    void getVendorAssessments_success(){


        when(assessmentRepository.findByEntityId(1L))
                .thenReturn(
                        List.of(assessment)
                );



        List<VendorAssessmentResponse> result =
                service.getVendorAssessments(1L);



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
    void getSubmissionHistory_success(){


        when(assessmentRepository.findByEntityId(1L))
                .thenReturn(
                        List.of(
                                assessment
                        )
                );



        List<VendorAssessmentResponse> result =
                service.getSubmissionHistory(1L);



        assertEquals(
                1,
                result.size()
        );


        assertEquals(
                "SUBMITTED",
                result.get(0).getStatus()
        );

    }





    @Test
    void getSubmissionHistory_ignoreDraft(){


        assessment.setStatus("DRAFT");


        when(assessmentRepository.findByEntityId(1L))
                .thenReturn(
                        List.of(assessment)
                );



        List<VendorAssessmentResponse> result =
                service.getSubmissionHistory(1L);



        assertTrue(
                result.isEmpty()
        );

    }


}