package com.tspmquestionmaster.controller;
import com.tspmquestionmaster.dto.request.EntitySearchRequest;
import com.tspmquestionmaster.dto.request.EntityFilterRequest;
import org.springframework.data.domain.Page;
import com.tspmquestionmaster.dto.request.CreateEntityRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityRequest;
import com.tspmquestionmaster.dto.response.ApiResponse;
import com.tspmquestionmaster.dto.response.EntityResponse;
import com.tspmquestionmaster.service.ThirdPartyEntityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entities")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ThirdPartyEntityController {

    private final ThirdPartyEntityService entityService;

    @PostMapping
    public ApiResponse<EntityResponse> createEntity(
            @Valid @RequestBody CreateEntityRequest request) {

        EntityResponse response = entityService.createEntity(request);

        return new ApiResponse<>(
                true,
                "Entity created successfully",
                response
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<EntityResponse> updateEntity(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEntityRequest request) {

        EntityResponse response =
                entityService.updateEntity(id, request);

        return new ApiResponse<>(
                true,
                "Entity updated successfully",
                response
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<EntityResponse> getEntityById(
            @PathVariable Long id) {

        EntityResponse response =
                entityService.getEntityById(id);

        return new ApiResponse<>(
                true,
                "Entity fetched successfully",
                response
        );
    }

    @GetMapping
    public ApiResponse<List<EntityResponse>> getAllEntities() {

        List<EntityResponse> response =
                entityService.getAllEntities();

        return new ApiResponse<>(
                true,
                "Entities fetched successfully",
                response
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteEntity(
            @PathVariable Long id) {

        entityService.deleteEntity(id);

        return new ApiResponse<>(
                true,
                "Entity deleted successfully",
                null
        );
    }
    @PostMapping("/search")
    public ApiResponse<List<EntityResponse>> searchEntities(
            @RequestBody EntitySearchRequest request) {

        List<EntityResponse> response =
                entityService.searchEntities(request);

        return new ApiResponse<>(
                true,
                "Search completed",
                response
        );
    }
    @GetMapping("/page")
    public ApiResponse<Page<EntityResponse>> getEntities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Page<EntityResponse> response =
                entityService.getEntities(
                        page,
                        size,
                        sortBy,
                        direction);

        return new ApiResponse<>(
                true,
                "Entities fetched successfully",
                response
        );
    }
    @PostMapping("/filter")
    public ApiResponse<List<EntityResponse>> filterEntities(
            @RequestBody EntityFilterRequest request) {

        List<EntityResponse> response =
                entityService.filterEntities(request);

        return new ApiResponse<>(
                true,
                "Filter completed",
                response
        );
    }
}