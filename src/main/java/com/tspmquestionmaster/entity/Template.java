package com.tspmquestionmaster.entity;

import com.tspmquestionmaster.enums.TemplateStatus;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Template {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;


    private String description;


    private String category;


    @Enumerated(EnumType.STRING)
    private TemplateStatus status;


    private Integer version;


    private Integer usageCount;


    private LocalDateTime createdAt;


    private LocalDateTime updatedAt;



    @OneToMany(
            mappedBy = "template",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<TemplateTopicMapping> topics = new ArrayList<>();


    @PrePersist
    public void onCreate(){

        createdAt = LocalDateTime.now();

        updatedAt = LocalDateTime.now();


        if(version == null){

            version = 1;

        }


        if(usageCount == null){

            usageCount = 0;

        }


        if(status == null){

            status = TemplateStatus.DRAFT;

        }

    }



    @PreUpdate
    public void onUpdate(){

        updatedAt = LocalDateTime.now();

    }

}