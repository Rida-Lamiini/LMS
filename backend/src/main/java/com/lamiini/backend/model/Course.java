package com.lamiini.backend.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "course")

@Getter
@Setter
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long courseId;
    @Column(name = "title", nullable = false) // Assuming title cannot be null
    private String title;

    @Column(name = "description", nullable = false) // Assuming description cannot be null
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "price")
    private Float price;


    @Column(name = "created_at", updatable = false) // created_at should not be updatable
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "is_published", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean published = false; // Changed variable name to make it more readable

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date(); // Set updatedAt also on create
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }


    @ManyToOne
    @JoinColumn(name = "fk_ctg_id")
    private Category category;


}
