package com.tspmquestionmaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
@Getter
@Setter
@Entity
@Table(name = "teams")
public class Team extends BaseEntity {


    @Column(name = "name", nullable = false, unique = true)
    private String name;
    @OneToMany(mappedBy = "team")
    private List<Reviewer> reviewers;
}