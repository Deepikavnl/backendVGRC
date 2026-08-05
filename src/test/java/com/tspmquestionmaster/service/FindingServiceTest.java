package com.tspmquestionmaster.service;


import com.tspmquestionmaster.dto.request.CreateFindingRequest;
import com.tspmquestionmaster.dto.response.FindingResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Finding;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.enums.FindingSeverity;
import com.tspmquestionmaster.enums.FindingStatus;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.FindingRepository;
import com.tspmquestionmaster.service.impl.FindingServiceImpl;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;


import java.util.List;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;



class FindingServiceTest {


    @Mock
    private FindingRepository findingRepository;


    @Mock
    private EntityAssessmentRepository assessmentRepository;


    @InjectMocks
    private FindingServiceImpl findingService;


    @BeforeEach
    void setup() {

        MockitoAnnotations.openMocks(this);

    }


    @Test
    void createFinding_success() {


        CreateFindingRequest request =
                new CreateFindingRequest();


        request.setAssessmentId(1L);
        request.setTitle("SQL Injection");
        request.setDescription("Database vulnerability");
        request.setSeverity("HIGH");
        request.setOwner("Security Team");


        EntityAssessment assessment =
                new EntityAssessment();

        assessment.setId(1L);


        when(
                assessmentRepository.findById(1L)
        )
                .thenReturn(Optional.of(assessment));


        Finding savedFinding =
                new Finding();


        savedFinding.setId(10L);
        savedFinding.setTitle("SQL Injection");
        savedFinding.setSeverity(FindingSeverity.HIGH);
        savedFinding.setStatus(FindingStatus.OPEN);
        savedFinding.setAssessment(assessment);


        when(
                findingRepository.save(any(Finding.class))
        )
                .thenReturn(savedFinding);


        FindingResponse response =
                findingService.createFinding(request);


        assertNotNull(response);


        assertEquals(
                "SQL Injection",
                response.getTitle()
        );


        assertEquals(
                "HIGH",
                response.getSeverity()
        );


        assertEquals(
                "OPEN",
                response.getStatus()
        );


    }


    @Test
    void createFinding_assessmentNotFound() {


        CreateFindingRequest request =
                new CreateFindingRequest();


        request.setAssessmentId(99L);


        when(
                assessmentRepository.findById(99L)
        )
                .thenReturn(Optional.empty());


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                findingService.createFinding(request)
                );


        assertEquals(
                "Assessment not found",
                exception.getMessage()
        );


    }


    @Test
    void getAllFindings_success() {


        Finding finding =
                new Finding();


        finding.setId(1L);
        finding.setTitle("Weak Password Policy");
        finding.setSeverity(FindingSeverity.MEDIUM);
        finding.setStatus(FindingStatus.OPEN);


        when(
                findingRepository.findAll()
        )
                .thenReturn(List.of(finding));


        List<FindingResponse> response =
                findingService.getAllFindings();


        assertEquals(
                1,
                response.size()
        );


        assertEquals(
                "Weak Password Policy",
                response.get(0).getTitle()
        );


    }


    @Test
    void getFindingById_success() {


        Finding finding =
                new Finding();


        finding.setId(5L);
        finding.setTitle("Missing Encryption");
        finding.setSeverity(FindingSeverity.CRITICAL);
        finding.setStatus(FindingStatus.OPEN);


        when(
                findingRepository.findById(5L)
        )
                .thenReturn(Optional.of(finding));


        FindingResponse response =
                findingService.getFindingById(5L);


        assertEquals(
                "Missing Encryption",
                response.getTitle()
        );


    }


    @Test
    void getFindingById_notFound() {


        when(
                findingRepository.findById(100L)
        )
                .thenReturn(Optional.empty());


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                findingService.getFindingById(100L)
                );


        assertEquals(
                "Finding not found",
                exception.getMessage()
        );


    }


    @Test
    void updateStatus_success(){


        Finding finding = new Finding();

        finding.setId(1L);
        finding.setCode("FND-001");
        finding.setTitle("Security Issue");
        finding.setDescription("Test Finding");

        finding.setSeverity(
                FindingSeverity.HIGH
        );

        finding.setStatus(
                FindingStatus.OPEN
        );

        finding.setOwner(
                "Security Team"
        );



        ThirdPartyEntity entity =
                new ThirdPartyEntity();

        entity.setId(1L);
        entity.setName("Test Vendor");



        EntityAssessment assessment =
                new EntityAssessment();

        assessment.setId(1L);
        assessment.setEntity(entity);



        finding.setAssessment(assessment);



        when(
                findingRepository.findById(1L)
        )
                .thenReturn(
                        Optional.of(finding)
                );



        when(
                findingRepository.save(any(Finding.class))
        )
                .thenAnswer(
                        invocation ->
                                invocation.getArgument(0)
                );



        FindingResponse response =
                findingService.updateStatus(
                        1L,
                        "RESOLVED"
                );



        assertNotNull(response);


        assertEquals(
                "RESOLVED",
                response.getStatus()
        );


        verify(findingRepository)
                .save(finding);

    }}
