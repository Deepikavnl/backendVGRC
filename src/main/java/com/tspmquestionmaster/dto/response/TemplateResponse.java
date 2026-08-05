package com.tspmquestionmaster.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;


@Data
@Builder
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class TemplateResponse {


    private Long id;

    private String name;

    private String description;

    private String category;

    private String status;

    private Integer version;

    private Integer usageCount;


    private List<TemplateTopicResponse> topics;

}