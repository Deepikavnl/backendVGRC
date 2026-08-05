package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.ReviewerQuestionDecisionRequest;
import com.tspmquestionmaster.dto.response.ReviewerDecisionResponse;
import com.tspmquestionmaster.dto.request.ReviewerAssessmentDecisionRequest;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.service.ReviewerService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviewer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewerController {


    private final ReviewerService reviewerService;



    @GetMapping("/workspace/{assessmentId}")
    public ResponseEntity<AssessmentResponse> getWorkspace(
            @PathVariable Long assessmentId
    ){

        return ResponseEntity.ok(
                reviewerService.getWorkspace(assessmentId)
        );
    }



    @PostMapping("/decision")
    public ResponseEntity<ReviewerDecisionResponse> saveDecision(
            @RequestBody ReviewerQuestionDecisionRequest request
    ){

        return ResponseEntity.ok(
                reviewerService.saveDecision(request)
        );
    }



    @PutMapping("/{assessmentId}/approve")
    public ResponseEntity<String> approveAssessment(
            @PathVariable Long assessmentId
    ){

        reviewerService.approveAssessment(assessmentId);

        return ResponseEntity.ok(
                "Assessment approved"
        );
    }




    @PutMapping("/{assessmentId}/correction")
    public ResponseEntity<String> requestCorrection(
            @PathVariable Long assessmentId,
            @RequestBody ReviewerAssessmentDecisionRequest request
    ){

        reviewerService.requestCorrection(
                assessmentId,
                request
        );

        return ResponseEntity.ok(
                "Correction requested"
        );
    }
    @PutMapping("/{assessmentId}/submit")
    public ResponseEntity<String> submitReview(
            @PathVariable Long assessmentId
    ){

        reviewerService.submitReview(
                assessmentId
        );


        return ResponseEntity.ok(
                "Review submitted successfully"
        );

    }

}