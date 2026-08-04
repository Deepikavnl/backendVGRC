package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.CreateEntityFindingRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityFindingRequest;
import com.tspmquestionmaster.dto.response.ApiResponse;
import com.tspmquestionmaster.dto.response.EntityFindingResponse;
import com.tspmquestionmaster.service.EntityFindingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/entity-findings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EntityFindingController {


    private final EntityFindingService service;



    @PostMapping
    public ApiResponse<EntityFindingResponse> create(
            @Valid @RequestBody CreateEntityFindingRequest request) {


        return new ApiResponse<>(
                true,
                "Finding created successfully",
                service.createFinding(request)
        );
    }



    @PutMapping("/{id}")
    public ApiResponse<EntityFindingResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEntityFindingRequest request) {


        return new ApiResponse<>(
                true,
                "Finding updated successfully",
                service.updateFinding(id, request)
        );
    }



    @GetMapping("/{id}")
    public ApiResponse<EntityFindingResponse> getById(
            @PathVariable Long id) {


        return new ApiResponse<>(
                true,
                "Finding fetched successfully",
                service.getFindingById(id)
        );
    }



    @GetMapping
    public ApiResponse<List<EntityFindingResponse>> getAll() {


        return new ApiResponse<>(
                true,
                "Findings fetched successfully",
                service.getAllFindings()
        );
    }



    @GetMapping("/entity/{entityId}")
    public ApiResponse<List<EntityFindingResponse>> getByEntity(
            @PathVariable Long entityId) {


        return new ApiResponse<>(
                true,
                "Entity findings fetched successfully",
                service.getFindingsByEntity(entityId)
        );
    }



    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(
            @PathVariable Long id) {


        service.deleteFinding(id);


        return new ApiResponse<>(
                true,
                "Finding deleted successfully",
                null
        );
    }
}