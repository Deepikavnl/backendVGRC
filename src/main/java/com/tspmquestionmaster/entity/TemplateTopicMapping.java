package com.tspmquestionmaster.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="template_topic_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateTopicMapping {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="template_id")
    private Template template;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="topic_id")
    private Topic topic;

}