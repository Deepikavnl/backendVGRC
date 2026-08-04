package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.CreateAssessmentRequest;
import com.tspmquestionmaster.dto.request.UpdateAssessmentRequest;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.service.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentResponse createAssessment(
            @Valid @RequestBody CreateAssessmentRequest request) {

        return assessmentService.createAssessment(request);
    }

    @GetMapping
    public List<AssessmentResponse> getAllAssessments() {

        return assessmentService.getAllAssessments();
    }

    @GetMapping("/{id}")
    public AssessmentResponse getAssessmentById(
            @PathVariable Long id) {

        return assessmentService.getAssessmentById(id);
    }

    @GetMapping("/entity/{entityId}")
    public List<AssessmentResponse> getAssessmentsByEntity(
            @PathVariable Long entityId) {

        return assessmentService.getAssessmentsByEntity(entityId);
    }

    @PutMapping("/{id}")
    public AssessmentResponse updateAssessment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAssessmentRequest request) {

        return assessmentService.updateAssessment(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAssessment(
            @PathVariable Long id) {

        assessmentService.deleteAssessment(id);
    }
}