package com.tspmquestionmaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Getter
@Setter
@Entity
@Table(name = "reviewers")
public class Reviewer extends BaseEntity {


    @Column(name = "name", nullable = false)
    private String reviewerName;


    @Column(name = "email")
    private String email;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    @JsonIgnore
    private Team team;

}