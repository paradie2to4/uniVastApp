package com.university.app.dto;

// DTO for sending application data in responses
public class ApplicationResponseDTO {

    private Long id;
    private String status;
    private String personalStatement;
    private String uploadedFilePath;
    private String feedback;
    private String submissionDate;
    private String lastUpdated;

    // Include simplified program info
    private ProgramDTO program;

    // Include simplified student info
    private StudentDTO student;
    
    // Include simplified university info at the top level
    private UniversityDTO university;

    // Getters and Setters for ApplicationResponseDTO
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPersonalStatement() {
        return personalStatement;
    }

    public void setPersonalStatement(String personalStatement) {
        this.personalStatement = personalStatement;
    }

    public String getUploadedFilePath() {
        return uploadedFilePath;
    }

    public void setUploadedFilePath(String uploadedFilePath) {
        this.uploadedFilePath = uploadedFilePath;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(String submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public ProgramDTO getProgram() {
        return program;
    }

    public void setProgram(ProgramDTO program) {
        this.program = program;
    }

    public StudentDTO getStudent() {
        return student;
    }

    public void setStudent(StudentDTO student) {
        this.student = student;
    }

    public UniversityDTO getUniversity() {
        return university;
    }

    public void setUniversity(UniversityDTO university) {
        this.university = university;
    }

    // Inner DTOs for related entities (only include necessary fields)
    public static class ProgramDTO {
        private Long id;
        private String name;
        // Include simplified university info within program
        private UniversityDTO university;

        // Getters and Setters for ProgramDTO
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

        public UniversityDTO getUniversity() {
            return university;
        }

        public void setUniversity(UniversityDTO university) {
            this.university = university;
        }
    }

    public static class UniversityDTO {
        private Long id;
        private String name;
        private String location;
        private String logo;

        // Getters and Setters for UniversityDTO
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

        public String getLogo() {
            return logo;
        }

        public void setLogo(String logo) {
            this.logo = logo;
        }
    }
    
    public static class StudentDTO {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;

        // Getters and Setters for StudentDTO
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
    }

} 