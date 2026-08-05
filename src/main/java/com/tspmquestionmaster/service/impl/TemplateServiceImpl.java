package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.TemplateRequest;

import com.tspmquestionmaster.dto.response.TemplateResponse;

import com.tspmquestionmaster.entity.Template;

import com.tspmquestionmaster.enums.TemplateStatus;
import com.tspmquestionmaster.mapper.TemplateMapper;
import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.entity.TemplateTopicMapping;

import com.tspmquestionmaster.dto.request.TemplateTopicRequest;

import com.tspmquestionmaster.repository.TopicRepository;
import com.tspmquestionmaster.repository.TemplateTopicMappingRepository;
import com.tspmquestionmaster.repository.TemplateRepository;
import com.tspmquestionmaster.service.TemplateService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TemplateServiceImpl implements TemplateService {

    private final TemplateRepository templateRepository;




    private final TopicRepository topicRepository;

    private final TemplateTopicMappingRepository templateTopicMappingRepository;

    private final TemplateMapper templateMapper;



    @Override
    public TemplateResponse createTemplate(TemplateRequest request) {


        Template template = Template.builder()

                .name(request.getName())

                .description(request.getDescription())

                .category(request.getCategory())

                .status(TemplateStatus.DRAFT)

                .version(1)

                .usageCount(0)

                .build();


        template = templateRepository.save(template);



        List<TemplateTopicMapping> mappings = new ArrayList<>();


        if(request.getTopics()!=null){


            for(TemplateTopicRequest topicRequest : request.getTopics()){


                Topic topic =
                        topicRepository.findById(topicRequest.getTopicId())

                                .orElseThrow(() ->
                                        new EntityNotFoundException(
                                                "Topic not found"
                                        )
                                );


                TemplateTopicMapping mapping =
                        TemplateTopicMapping.builder()

                                .template(template)

                                .topic(topic)

                                .build();



                mappings.add(
                        templateTopicMappingRepository.save(mapping)
                );

            }

        }


        template.setTopics(mappings);


        return templateMapper.toResponse(template);

    }
    @Override
    @Transactional(readOnly = true)
    public List<TemplateResponse> getAllTemplates() {

        return templateRepository.findAll()
                .stream()
                .map(templateMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TemplateResponse getTemplateById(Long id) {

        Template template = templateRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Template not found with id : " + id
                        )
                );

        return templateMapper.toResponse(template);
    }

    @Override
    public TemplateResponse updateTemplate(
            Long id,
            TemplateRequest request
    ) {


        Template template =
                templateRepository.findById(id)

                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Template not found"
                                )
                        );



        template.setName(request.getName());

        template.setDescription(request.getDescription());

        template.setCategory(request.getCategory());



        template.getTopics().clear();



        List<TemplateTopicMapping> mappings =
                new ArrayList<>();



        if(request.getTopics()!=null){


            for(TemplateTopicRequest topicRequest:
                    request.getTopics()){


                Topic topic =
                        topicRepository.findById(
                                        topicRequest.getTopicId()
                                )

                                .orElseThrow(() ->
                                        new EntityNotFoundException(
                                                "Topic not found"
                                        )
                                );



                TemplateTopicMapping mapping =
                        TemplateTopicMapping.builder()

                                .template(template)

                                .topic(topic)

                                .build();



                mappings.add(mapping);


            }

        }



        template.setTopics(mappings);



        Template updated =
                templateRepository.save(template);



        return templateMapper.toResponse(updated);

    }
    @Override
    public void deleteTemplate(Long id) {

        Template template = templateRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Template not found with id : " + id
                        )
                );

        templateRepository.delete(template);
    }

}