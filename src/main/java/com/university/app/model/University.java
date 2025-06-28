package com.university.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Entity
@Table(name = "universities")
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "University name is required")
    @Size(max = 100, message = "University name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(length = 1000)
    private String description;

    @Min(value = 0, message = "Acceptance rate must be at least 0")
    @Max(value = 100, message = "Acceptance rate cannot exceed 100")
    private double acceptanceRate;

    private String logo;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference(value = "program-university")
    private List<Program> programs = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private User user;

    @Column
    private String website;

    @Column
    private String phoneNumber;

    @Column
    private Integer foundedYear;

    @Column
    private String accreditation;

    private int applicationCount = 0;
    private int programCount = 0;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference(value = "university-applications")
    private List<Application> applications = new ArrayList<>();

    // Constructors
    public University() {
    }

    public University(String name, String location, String description, double acceptanceRate, String logo) {
        this.name = name;
        this.location = location;
        this.description = description;
        this.acceptanceRate = acceptanceRate;
        this.logo = logo;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAcceptanceRate() {
        return acceptanceRate;
    }

    public void setAcceptanceRate(double acceptanceRate) {
        this.acceptanceRate = acceptanceRate;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    @JsonProperty("programs")
    public List<Program> getProgramsData() {
        return programs;
    }

    @JsonProperty("applications")
    public List<Application> getApplicationsData() {
        return applications;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getFoundedYear() {
        return foundedYear;
    }

    public void setFoundedYear(Integer foundedYear) {
        this.foundedYear = foundedYear;
    }

    public String getAccreditation() {
        return accreditation;
    }

    public void setAccreditation(String accreditation) {
        this.accreditation = accreditation;
    }

    public List<Program> getPrograms() {
        return programs;
    }

    public void setPrograms(List<Program> programs) {
        this.programs = programs;
    }

    public int getApplicationCount() {
        return applicationCount;
    }

    public void setApplicationCount(int applicationCount) {
        this.applicationCount = applicationCount;
    }

    public int getProgramCount() {
        return programCount;
    }

    public void setProgramCount(int programCount) {
        this.programCount = programCount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Helper methods
    public void addProgram(Program program) {
        programs.add(program);
        program.setUniversity(this);
        this.programCount++;
    }

    public void removeProgram(Program program) {
        programs.remove(program);
        program.setUniversity(null);
        this.programCount--;
    }

    // Add a method to get basic university info for JSON
    @JsonProperty("basicInfo")
    public Map<String, Object> getBasicInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("id", id);
        info.put("name", name);
        info.put("location", location);
        info.put("acceptanceRate", acceptanceRate);
        info.put("logo", logo);
        return info;
    }
}
