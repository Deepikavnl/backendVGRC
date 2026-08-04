package com.tspmquestionmaster.dto.request;

import com.tspmquestionmaster.enums.TopicStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTopicRequest {

    @NotBlank(message = "Topic name is required")
    private String name;

    private String description;

    private String color;

    @NotNull(message = "Status is required")
    private TopicStatus status;

}