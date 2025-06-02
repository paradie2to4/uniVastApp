package com.university.app.service;

import com.university.app.model.Student;
import com.university.app.repository.StudentRepository;
import com.university.app.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
<<<<<<< HEAD
=======
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
>>>>>>> 47f4fab (Updated with new features)

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found for user id: " + userId));
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);
<<<<<<< HEAD
        
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        student.setBio(studentDetails.getBio());
        student.setProfilePicture(studentDetails.getProfilePicture());
        
=======

        // Update fields based on studentDetails, ensure existing values are kept if not provided
        if (studentDetails.getFirstName() != null && !studentDetails.getFirstName().isEmpty()) {
            student.setFirstName(studentDetails.getFirstName());
        }
        if (studentDetails.getLastName() != null && !studentDetails.getLastName().isEmpty()) {
            student.setLastName(studentDetails.getLastName());
        }
        // Email is typically not updated via profile form, but uncomment if needed
        // if (studentDetails.getEmail() != null && !studentDetails.getEmail().isEmpty()) {
        //     student.setEmail(studentDetails.getEmail());
        // }
        if (studentDetails.getBio() != null) { // Allow setting bio to empty string
            student.setBio(studentDetails.getBio());
        }
        // GPA can be set to null or updated
        student.setGpa(studentDetails.getGpa());

        // Only update profile picture if a new one is provided
        if (studentDetails.getProfilePicture() != null && !studentDetails.getProfilePicture().isEmpty()) {
             student.setProfilePicture(studentDetails.getProfilePicture());
        } else if (studentDetails.getProfilePicture() == null) { // If explicitly set to null from frontend, remove it
             student.setProfilePicture(null);
        }

        // Update new fields, checking if they are provided
        if (studentDetails.getDateOfBirth() != null) {
             student.setDateOfBirth(studentDetails.getDateOfBirth());
        }
        if (studentDetails.getLocation() != null) { // Allow setting location to empty string
             student.setLocation(studentDetails.getLocation());
        }
         if (studentDetails.getEducationBackground() != null) { // Allow setting educationBackground to empty string
             student.setEducationBackground(studentDetails.getEducationBackground());
        }

>>>>>>> 47f4fab (Updated with new features)
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }
    
    public long countStudents() {
        return studentRepository.count();
    }
    
    public Map<String, Object> getStudentStats(Long studentId) {
        // Get the student
        Student student = getStudentById(studentId);
        
        // Count applications by status
        int totalApplications = student.getApplications().size();
        int pendingApplications = (int) student.getApplications().stream()
                .filter(app -> app.getStatus().name().equals("PENDING"))
                .count();
        int acceptedApplications = (int) student.getApplications().stream()
                .filter(app -> app.getStatus().name().equals("ACCEPTED"))
                .count();
        int rejectedApplications = (int) student.getApplications().stream()
                .filter(app -> app.getStatus().name().equals("REJECTED"))
                .count();
        
        // Create stats map
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", totalApplications);
        stats.put("pendingApplications", pendingApplications);
        stats.put("acceptedApplications", acceptedApplications);
        stats.put("rejectedApplications", rejectedApplications);
        
        return stats;
    }

    public List<Student> searchStudentsByName(String name) {
        return studentRepository.searchByName(name); // This should call the custom @Query method
    }

<<<<<<< HEAD
=======
    // Add method to upload profile picture
    public String uploadProfilePicture(MultipartFile file) {
        try {
            // Define upload directory
            String UPLOAD_DIR = "uploads/profile_pictures/";
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Files.createDirectories(uploadPath); // Create directory if it doesn't exist

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filepath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filepath);

            // Return the URL path to the file
            return "/api/students/uploads/profile_pictures/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile picture", e);
        }
    }

>>>>>>> 47f4fab (Updated with new features)
}
