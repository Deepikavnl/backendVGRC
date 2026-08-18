package com.tspmquestionmaster.dto.response;

import com.tspmquestionmaster.enums.TopicStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TopicResponse {

    private Long id;

    private String name;

    private String description;

    private String color;

    private TopicStatus status;

    private Long questionCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<TopicQuestionResponse> questions;
}