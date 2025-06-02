package com.university.app.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @JsonIgnore
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "program_id")
    private Program program;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "university_id")
    private University university;

    public University getUniversity() {
        return university;
    }

    public void setUniversity(University university) {
        this.university = university;
    }

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Size(max = 1000, message = "Personal statement cannot exceed 1000 characters")
    @Column(length = 1000)
    private String personalStatement;

    private LocalDateTime submissionDate;

    private LocalDateTime lastUpdated;

    @Size(max = 500, message = "Feedback cannot exceed 500 characters")
    @Column(length = 500)
    private String feedback;

    @Column(name = "uploaded_file_path")
    private String uploadedFilePath;

    public String getUploadedFilePath() {
        return uploadedFilePath;
    }

    public void setUploadedFilePath(String uploadedFilePath) {
        this.uploadedFilePath = uploadedFilePath;
    }

    // Constructors
    public Application() {
        this.status = ApplicationStatus.PENDING;
        this.submissionDate = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    public Application(Student student, Program program, String personalStatement) {
        this.student = student;
        this.program = program;
        this.personalStatement = personalStatement;
        this.status = ApplicationStatus.PENDING;
        this.submissionDate = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
        this.lastUpdated = LocalDateTime.now();
    }

    public String getPersonalStatement() {
        return personalStatement;
    }

    public void setPersonalStatement(String personalStatement) {
        this.personalStatement = personalStatement;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    // Helper methods
    public void updateStatus(ApplicationStatus newStatus, String feedback) {
        this.status = newStatus;
        this.feedback = feedback;
        this.lastUpdated = LocalDateTime.now();
    }
}
