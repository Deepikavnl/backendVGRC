package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;
import com.tspmquestionmaster.service.VendorService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {


    private final ThirdPartyEntityRepository thirdPartyEntityRepository;

    private final EntityAssessmentRepository assessmentRepository;



    @Override
    public List<ThirdPartyEntity> getAllVendors() {

        return thirdPartyEntityRepository.findAll();
    }



    @Override
    public ThirdPartyEntity getVendorById(Long id) {

        return thirdPartyEntityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vendor not found with id : " + id));
    }



    @Override
    public ThirdPartyEntity createVendor(ThirdPartyEntity vendor) {


        if(thirdPartyEntityRepository.existsByNameIgnoreCase(vendor.getName())) {

            throw new RuntimeException(
                    "Vendor already exists with name : "
                            + vendor.getName());
        }


        return thirdPartyEntityRepository.save(vendor);
    }



    @Override
    public ThirdPartyEntity updateVendor(Long id,
                                         ThirdPartyEntity vendor) {


        ThirdPartyEntity existingVendor =
                thirdPartyEntityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vendor not found with id : "
                                                + id));


        existingVendor.setName(vendor.getName());
        existingVendor.setType(vendor.getType());
        existingVendor.setCategory(vendor.getCategory());
        existingVendor.setCountry(vendor.getCountry());
        existingVendor.setWebsite(vendor.getWebsite());
        existingVendor.setCriticality(vendor.getCriticality());
        existingVendor.setRiskRating(vendor.getRiskRating());
        existingVendor.setStatus(vendor.getStatus());
        existingVendor.setSpend(vendor.getSpend());


        return thirdPartyEntityRepository.save(existingVendor);
    }



    @Override
    public void deleteVendor(Long id) {


        ThirdPartyEntity vendor =
                thirdPartyEntityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vendor not found with id : "
                                                + id));


        thirdPartyEntityRepository.delete(vendor);

    }




    @Override
    public List<VendorAssessmentResponse> getVendorAssessments(Long vendorId) {


        return assessmentRepository.findByEntityId(vendorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }





    @Override
    public List<VendorAssessmentResponse> getSubmissionHistory(Long vendorId) {


        return assessmentRepository.findByEntityId(vendorId)
                .stream()
                .filter(a ->
                        "SUBMITTED".equalsIgnoreCase(a.getStatus())
                                ||
                                "UNDER_REVIEW".equalsIgnoreCase(a.getStatus())
                                ||
                                "COMPLETED".equalsIgnoreCase(a.getStatus())
                )
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }





    private VendorAssessmentResponse mapToResponse(
            EntityAssessment assessment) {


        VendorAssessmentResponse response =
                new VendorAssessmentResponse();


        response.setId(assessment.getId());

        response.setCode(assessment.getCode());

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

}