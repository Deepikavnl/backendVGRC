package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.response.AssessmentAnswerResponse;
import com.tspmquestionmaster.service.AssessmentAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessment-answers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AssessmentAnswerController {

    private final AssessmentAnswerService service;

    @GetMapping("/assessment/{assessmentId}")
    public List<AssessmentAnswerResponse> getAnswersByAssessment(
            @PathVariable Long assessmentId
    ) {

        return service.getAnswersByAssessment(assessmentId);
    }

}