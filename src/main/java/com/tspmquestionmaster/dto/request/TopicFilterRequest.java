package com.tspmquestionmaster.dto.request;

import com.tspmquestionmaster.enums.TopicStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopicFilterRequest {

    private TopicStatus status;

    private Integer page = 0;

    private Integer size = 10;

    private String sortBy = "createdAt";

    private String sortDirection = "DESC";

}