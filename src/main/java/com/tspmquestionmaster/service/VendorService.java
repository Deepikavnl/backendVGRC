package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;
import com.tspmquestionmaster.entity.ThirdPartyEntity;

import java.util.List;

public interface VendorService {


    List<ThirdPartyEntity> getAllVendors();


    ThirdPartyEntity getVendorById(Long id);


    ThirdPartyEntity createVendor(ThirdPartyEntity vendor);


    ThirdPartyEntity updateVendor(Long id, ThirdPartyEntity vendor);


    void deleteVendor(Long id);


    List<VendorAssessmentResponse> getVendorAssessments(Long vendorId);


    List<VendorAssessmentResponse> getSubmissionHistory(Long vendorId);

}