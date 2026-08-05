package com.tspmquestionmaster.repository;


import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Finding;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.enums.FindingSeverity;
import com.tspmquestionmaster.enums.FindingStatus;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
class FindingRepositoryTest {


    @Autowired
    private FindingRepository findingRepository;


    @Autowired
    private ThirdPartyEntityRepository thirdPartyEntityRepository;


    @Autowired
    private EntityAssessmentRepository entityAssessmentRepository;


    private ThirdPartyEntity createEntity() {

        ThirdPartyEntity entity =
                new ThirdPartyEntity();

        entity.setName("ABC Vendor");
        entity.setType("VENDOR");
        entity.setCategory("IT");
        entity.setCountry("India");
        entity.setCriticality("HIGH");
        entity.setRiskRating("MEDIUM");
        entity.setStatus("ACTIVE");

        return entity;
    }


    private EntityAssessment createAssessment(
            ThirdPartyEntity entity
    ) {

        EntityAssessment assessment =
                new EntityAssessment();

        assessment.setCode("ASM-001");
        assessment.setTemplateName(
                "Security Assessment"
        );
        assessment.setStatus(
                "IN_PROGRESS"
        );
        assessment.setProgress(50);

        assessment.setEntity(entity);

        return assessment;
    }


    private Finding createFinding() {


        ThirdPartyEntity entity =
                thirdPartyEntityRepository.save(
                        createEntity()
                );


        EntityAssessment assessment =
                entityAssessmentRepository.save(
                        createAssessment(entity)
                );


        Finding finding =
                new Finding();


        finding.setCode(
                "FND-001"
        );


        finding.setTitle(
                "Weak Password Policy"
        );


        finding.setDescription(
                "Password complexity issue"
        );


        finding.setSeverity(
                FindingSeverity.HIGH
        );


        finding.setStatus(
                FindingStatus.OPEN
        );


        finding.setOwner(
                "Security Team"
        );


        finding.setAssessment(
                assessment
        );


        return finding;
    }


    @Test
    void saveFinding_success() {


        Finding saved =
                findingRepository.save(
                        createFinding()
                );


        findingRepository.flush();


        assertNotNull(
                saved.getId()
        );


        assertEquals(
                "Weak Password Policy",
                saved.getTitle()
        );

    }


    @Test
    void findByStatus_success() {


        findingRepository.save(
                createFinding()
        );


        findingRepository.flush();


        List<Finding> result =
                findingRepository.findByStatus(
                        FindingStatus.OPEN
                );


        assertTrue(
                result.size() >= 1
        );


        assertEquals(
                FindingStatus.OPEN,
                result.get(0).getStatus()
        );

    }


    @Test
    void findBySeverity_success() {


        findingRepository.save(
                createFinding()
        );


        findingRepository.flush();


        List<Finding> result =
                findingRepository.findBySeverity(
                        FindingSeverity.HIGH
                );


        assertTrue(
                result.size() >= 1
        );


        assertEquals(
                FindingSeverity.HIGH,
                result.get(0).getSeverity()
        );

    }


    @Test
    void findById_success() {


        Finding saved =
                findingRepository.save(
                        createFinding()
                );


        findingRepository.flush();


        Finding result =
                findingRepository.findById(
                        saved.getId()
                ).orElse(null);


        assertNotNull(
                result
        );


        assertEquals(
                saved.getCode(),
                result.getCode()
        );

    }


    @Test
    void deleteFinding_success() {


        Finding saved =
                findingRepository.save(
                        createFinding()
                );


        findingRepository.flush();


        findingRepository.deleteById(
                saved.getId()
        );


        findingRepository.flush();


        assertFalse(
                findingRepository
                        .findById(
                                saved.getId()
                        )
                        .isPresent()
        );

    }

}