package com.tspmquestionmaster.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TemplateTopicResponse {


    private Long id;


    private Long topicId;


    private String topicName;


    private List<QuestionResponse> questions;

}