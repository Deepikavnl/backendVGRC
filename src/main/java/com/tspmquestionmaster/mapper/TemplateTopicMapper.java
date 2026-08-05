package com.tspmquestionmaster.mapper;


import com.tspmquestionmaster.dto.response.QuestionResponse;
import com.tspmquestionmaster.dto.response.TemplateTopicResponse;
import com.tspmquestionmaster.entity.TemplateTopicMapping;
import com.tspmquestionmaster.repository.QuestionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;


import java.util.List;



@Component
@RequiredArgsConstructor
public class TemplateTopicMapper {


    private final QuestionRepository questionRepository;



    public TemplateTopicResponse toResponse(
            TemplateTopicMapping mapping
    ) {


        List<QuestionResponse> questions =

                questionRepository
                        .findByTopicId(
                                mapping.getTopic().getId()
                        )

                        .stream()

                        .map(question -> {


                            QuestionResponse response =
                                    new QuestionResponse();


                            response.setId(
                                    question.getId()
                            );


                            response.setCode(
                                    question.getCode()
                            );


                            response.setQuestionText(
                                    question.getQuestionText()
                            );


                            response.setHelpText(
                                    question.getHelpText()
                            );


                            response.setQuestionType(
                                    question.getQuestionType()
                            );


                            response.setWeight(
                                    question.getWeight()
                            );


                            response.setMandatory(
                                    question.getMandatory()
                            );


                            response.setStatus(
                                    question.getStatus()
                            );


                            return response;


                        })

                        .toList();



        return TemplateTopicResponse.builder()

                .id(
                        mapping.getId()
                )

                .topicId(
                        mapping.getTopic().getId()
                )

                .topicName(
                        mapping.getTopic().getName()
                )

                .questions(
                        questions
                )

                .build();


    }

}