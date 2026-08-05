package com.tspmquestionmaster.mapper;

import com.tspmquestionmaster.dto.response.TemplateResponse;
import com.tspmquestionmaster.dto.response.TemplateTopicResponse;
import com.tspmquestionmaster.entity.Template;
import com.tspmquestionmaster.entity.TemplateTopicMapping;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TemplateMapper {


    private final TemplateTopicMapper topicMapper;


    public TemplateResponse toResponse(Template template) {


        return TemplateResponse.builder()

                .id(template.getId())

                .name(template.getName())

                .description(template.getDescription())

                .category(template.getCategory())

                .status(
                        template.getStatus().name()
                )

                .version(template.getVersion())

                .usageCount(template.getUsageCount())


                .topics(
                        template.getTopics()
                                .stream()
                                .map(topicMapper::toResponse)
                                .collect(Collectors.toList())
                )


                .build();

    }

}