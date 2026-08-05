package com.tspmquestionmaster.dto.request;

import lombok.Data;

import java.util.List;


@Data
public class TemplateRequest {


    private String name;


    private String description;


    private String category;


    private List<TemplateTopicRequest> topics;


}