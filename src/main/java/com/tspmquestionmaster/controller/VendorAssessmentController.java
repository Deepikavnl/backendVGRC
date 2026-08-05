package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.AssessmentQuestionResponse;
import com.tspmquestionmaster.dto.SubmitAnswerRequest;
import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;
import com.tspmquestionmaster.service.VendorAssessmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/vendor-assessments")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173"
)
public class VendorAssessmentController {


    private final VendorAssessmentService vendorAssessmentService;



    @GetMapping("/vendor")
    public List<VendorAssessmentResponse> getVendorAssessments(){

        return vendorAssessmentService
                .getVendorAssessments();

    }



    @GetMapping("/{assessmentId}")
    public VendorAssessmentResponse getAssessmentById(
            @PathVariable Long assessmentId
    ){

        return vendorAssessmentService
                .getAssessmentById(assessmentId);

    }



    @GetMapping("/{assessmentId}/questionnaire")
    public List<AssessmentQuestionResponse> getQuestions(
            @PathVariable Long assessmentId
    ){

        return vendorAssessmentService
                .getAssessmentQuestions(assessmentId);

    }



    @PostMapping("/{assessmentId}/submit")
    public void submitAssessment(
            @PathVariable Long assessmentId,
            @RequestBody SubmitAnswerRequest request
    ){

        vendorAssessmentService
                .submitAssessment(
                        assessmentId
                );

    }
    @GetMapping("/vendor/history")
    public List<VendorAssessmentResponse> getVendorHistory(){

        return vendorAssessmentService
                .getVendorHistory();

    }
    @GetMapping("/test")
    public String test(){

        return "Vendor Controller Working";

    }

}