package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.response.VendorQuestionnairePageResponse;
import com.tspmquestionmaster.dto.response.ApiResponse;
import com.tspmquestionmaster.dto.response.VendorQuestionnaireResponse;
import com.tspmquestionmaster.service.VendorQuestionnaireService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.tspmquestionmaster.dto.response.VendorQuestionnairePageResponse;

@RestController
@RequestMapping("/api/vendor-questionnaires")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VendorQuestionnaireController {


    private final VendorQuestionnaireService vendorQuestionnaireService;



    @GetMapping("/{assessmentId}")
    public ApiResponse<VendorQuestionnairePageResponse> getQuestionnaire(
            @PathVariable Long assessmentId
    ) {


        VendorQuestionnairePageResponse response =
                vendorQuestionnaireService.getQuestionnairePage(
                        assessmentId
                );


        return new ApiResponse<>(
                true,
                "Questionnaire fetched successfully",
                response
        );

    }




    @PostMapping("/{assessmentId}/answers")
    public ApiResponse<String> saveAnswer(
            @PathVariable Long assessmentId,
            @RequestParam Long questionId,
            @RequestParam String answer
    ) {


        vendorQuestionnaireService.saveAnswer(
                assessmentId,
                questionId,
                answer
        );


        return new ApiResponse<>(
                true,
                "Answer saved successfully",
                null
        );

    }





    @PostMapping("/{assessmentId}/submit")
    public ApiResponse<String> submitAssessment(
            @PathVariable Long assessmentId
    ){


        vendorQuestionnaireService.submitAssessment(
                assessmentId
        );


        return new ApiResponse<>(
                true,
                "Assessment submitted successfully",
                null
        );

    }
    @GetMapping("/token/{token}")
    public ApiResponse<VendorQuestionnairePageResponse> getQuestionnaireByToken(
            @PathVariable String token
    ) {

        VendorQuestionnairePageResponse response =
                vendorQuestionnaireService.getQuestionnaireByToken(token);


        return new ApiResponse<>(
                true,
                "Questionnaire fetched successfully",
                response
        );
    }
}