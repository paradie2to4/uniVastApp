package com.university.app.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "programs")
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Program name is required")
    @Size(max = 100, message = "Program name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Degree type is required")
    @Size(max = 50, message = "Degree type cannot exceed 50 characters")
    private String degree;

    @NotBlank(message = "Duration is required")
    @Size(max = 50, message = "Duration cannot exceed 50 characters")
    private String duration;

    @NotNull(message = "Tuition fee is required")
    @Positive(message = "Tuition fee must be positive")
    private Double tuitionFee;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(length = 1000)
    private String description;

    @Size(max = 1000, message = "Requirements cannot exceed 1000 characters")
    @Column(length = 1000)
    private String requirements;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "university_id")
    @JsonBackReference(value = "program-university")
    private University university;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "program-applications")
    private List<Application> applications = new ArrayList<>();

    private int applicationCount = 0;

    // Constructors
    public Program() {
    }

    public Program(String name, String degree, String duration, Double tuitionFee, String description, String requirements) {
        this.name = name;
        this.degree = degree;
        this.duration = duration;
        this.tuitionFee = tuitionFee;
        this.description = description;
        this.requirements = requirements;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Double getTuitionFee() {
        return tuitionFee;
    }

    public void setTuitionFee(Double tuitionFee) {
        this.tuitionFee = tuitionFee;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public University getUniversity() {
        return university;
    }

    public void setUniversity(University university) {
        this.university = university;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public void setApplications(List<Application> applications) {
        this.applications = applications;
    }

    public int getApplicationCount() {
        return applicationCount;
    }

    public void setApplicationCount(int applicationCount) {
        this.applicationCount = applicationCount;
    }

    // Helper methods
    public void addApplication(Application application) {
        applications.add(application);
        application.setProgram(this);
        this.applicationCount++;
    }

    public void removeApplication(Application application) {
        applications.remove(application);
        application.setProgram(null);
        this.applicationCount--;
    }
}
