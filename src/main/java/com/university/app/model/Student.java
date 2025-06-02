package com.university.app.model;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
=======
>>>>>>> 47f4fab (Updated with new features)
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

<<<<<<< HEAD
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
=======
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.university.app.config.LocalDateSerializer;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "students")
>>>>>>> 47f4fab (Updated with new features)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    @Column(unique = true)
    private String email;

    private String password;

    private String profilePicture;

    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    @Column(length = 500)
    private String bio;

<<<<<<< HEAD
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
=======
    @Column(name = "gpa")
    private Double gpa;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
>>>>>>> 47f4fab (Updated with new features)
    private List<Application> applications = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_id")
<<<<<<< HEAD
    @JsonIgnore
    private User user;

=======
    @JsonManagedReference
    private User user;

    // Add new fields for student profile
    @Column(name = "date_of_birth")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String location;

    @Column(columnDefinition = "TEXT") // Use TEXT for potentially longer education descriptions
    private String educationBackground;

>>>>>>> 47f4fab (Updated with new features)
    // Constructors
    public Student() {
    }

    public Student(String firstName, String lastName, String email, String password,String profilePicture, String bio) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.profilePicture = profilePicture;
        this.bio = bio;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

<<<<<<< HEAD
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

=======
>>>>>>> 47f4fab (Updated with new features)
    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public void setApplications(List<Application> applications) {
        this.applications = applications;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

<<<<<<< HEAD
=======
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Double getGpa() {
        return gpa;
    }

    public void setGpa(Double gpa) {
        this.gpa = gpa;
    }

    // Getters and Setters for new fields
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEducationBackground() {
        return educationBackground;
    }

    public void setEducationBackground(String educationBackground) {
        this.educationBackground = educationBackground;
    }

>>>>>>> 47f4fab (Updated with new features)
    // Helper methods
    public void addApplication(Application application) {
        applications.add(application);
        application.setStudent(this);
    }

    public void removeApplication(Application application) {
        applications.remove(application);
        application.setStudent(null);
    }

    // Full name utility method
<<<<<<< HEAD
    @JsonProperty("fullName")
=======
>>>>>>> 47f4fab (Updated with new features)
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
