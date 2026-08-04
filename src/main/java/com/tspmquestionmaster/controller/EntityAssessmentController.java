package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.CreateAssessmentRequest;
import com.tspmquestionmaster.dto.request.UpdateAssessmentRequest;
import com.tspmquestionmaster.dto.response.ApiResponse;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.service.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entity-assessments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EntityAssessmentController {


    private final AssessmentService assessmentService;



    @PostMapping
    public ApiResponse<AssessmentResponse> createAssessment(
            @Valid @RequestBody CreateAssessmentRequest request) {


        AssessmentResponse response =
                assessmentService.createAssessment(request);


        return new ApiResponse<>(
                true,
                "Assessment created successfully",
                response
        );
    }




    @PutMapping("/{id}")
    public ApiResponse<AssessmentResponse> updateAssessment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAssessmentRequest request) {


        AssessmentResponse response =
                assessmentService.updateAssessment(id, request);


        return new ApiResponse<>(
                true,
                "Assessment updated successfully",
                response
        );
    }





    @GetMapping("/{id}")
    public ApiResponse<AssessmentResponse> getAssessmentById(
            @PathVariable Long id) {


        AssessmentResponse response =
                assessmentService.getAssessmentById(id);


        return new ApiResponse<>(
                true,
                "Assessment fetched successfully",
                response
        );
    }





    @GetMapping
    public ApiResponse<List<AssessmentResponse>> getAllAssessments() {


        List<AssessmentResponse> response =
                assessmentService.getAllAssessments();


        return new ApiResponse<>(
                true,
                "Assessments fetched successfully",
                response
        );
    }





    @GetMapping("/entity/{entityId}")
    public ApiResponse<List<AssessmentResponse>> getAssessmentsByEntity(
            @PathVariable Long entityId) {


        List<AssessmentResponse> response =
                assessmentService.getAssessmentsByEntity(entityId);


        return new ApiResponse<>(
                true,
                "Entity assessments fetched successfully",
                response
        );
    }





    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteAssessment(
            @PathVariable Long id) {


        assessmentService.deleteAssessment(id);


        return new ApiResponse<>(
                true,
                "Assessment deleted successfully",
                null
        );
    }

}