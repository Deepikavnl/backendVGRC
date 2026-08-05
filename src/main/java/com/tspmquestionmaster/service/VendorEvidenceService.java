package com.tspmquestionmaster.service;


import com.tspmquestionmaster.dto.response.VendorEvidenceResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface VendorEvidenceService {


    VendorEvidenceResponse uploadEvidence(
            Long assessmentId,
            Long questionId,
            MultipartFile file
    );


    VendorEvidenceResponse getEvidence(
            Long evidenceId
    );
    List<VendorEvidenceResponse> getEvidenceByQuestion(
            Long assessmentId,
            Long questionId
    );
}