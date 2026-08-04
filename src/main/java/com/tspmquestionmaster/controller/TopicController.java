package com.tspmquestionmaster.controller;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
import com.tspmquestionmaster.dto.request.CreateTopicRequest;
import com.tspmquestionmaster.dto.request.TopicFilterRequest;
import com.tspmquestionmaster.dto.request.TopicSearchRequest;
import com.tspmquestionmaster.dto.request.UpdateTopicRequest;
import com.tspmquestionmaster.dto.response.ApiResponse;
import com.tspmquestionmaster.dto.response.TopicResponse;
import com.tspmquestionmaster.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    public ApiResponse<TopicResponse> createTopic(
            @Valid @RequestBody CreateTopicRequest request) {

        TopicResponse response = topicService.createTopic(request);

        return new ApiResponse<>(
                true,
                "Topic created successfully",
                response
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<TopicResponse> updateTopic(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTopicRequest request) {

        TopicResponse response = topicService.updateTopic(id, request);

        return new ApiResponse<>(
                true,
                "Topic updated successfully",
                response
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<TopicResponse> getTopicById(
            @PathVariable Long id) {

        TopicResponse response = topicService.getTopicById(id);

        return new ApiResponse<>(
                true,
                "Topic fetched successfully",
                response
        );
    }
    @GetMapping("/page")
    public ApiResponse<Page<TopicResponse>> getTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Page<TopicResponse> response =
                topicService.getTopics(page, size, sortBy, direction);

        return new ApiResponse<>(
                true,
                "Topics fetched successfully",
                response
        );
    }
    @GetMapping
    public ApiResponse<List<TopicResponse>> getAllTopics() {

        List<TopicResponse> response = topicService.getAllTopics();

        return new ApiResponse<>(
                true,
                "Topics fetched successfully",
                response
        );
    }

    @PostMapping("/search")
    public ApiResponse<List<TopicResponse>> searchTopics(
            @RequestBody TopicSearchRequest request) {

        System.out.println("SEARCH API HIT");

        List<TopicResponse> response = topicService.searchTopics(request);

        return new ApiResponse<>(
                true,
                "Search completed",
                response
        );
    }

    @PostMapping("/filter")
    public ApiResponse<List<TopicResponse>> filterTopics(
            @RequestBody TopicFilterRequest request) {

        List<TopicResponse> response = topicService.filterTopics(request);

        return new ApiResponse<>(
                true,
                "Filter completed",
                response
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteTopic(
            @PathVariable Long id) {

        topicService.deleteTopic(id);

        return new ApiResponse<>(
                true,
                "Topic deleted successfully",
                null
        );
    }

}