package com.university.app.controller;

import com.university.app.model.Student;
<<<<<<< HEAD
import com.university.app.service.StudentService;
=======
import com.university.app.dto.StudentProfileDTO;
import com.university.app.service.StudentService;
import com.university.app.exception.ResourceNotFoundException;
>>>>>>> 47f4fab (Updated with new features)
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
<<<<<<< HEAD

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000") // In production, restrict this to your frontend domain
=======
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}) // Allow both frontend origins
>>>>>>> 47f4fab (Updated with new features)
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @GetMapping("/{id}")
<<<<<<< HEAD
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return new ResponseEntity<>(student, HttpStatus.OK);
=======
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        
        // Create a simplified response without circular references
        Map<String, Object> response = new HashMap<>();
        response.put("id", student.getId());
        response.put("firstName", student.getFirstName());
        response.put("lastName", student.getLastName());
        response.put("email", student.getEmail());
        response.put("profilePicture", student.getProfilePicture());
        response.put("bio", student.getBio());
        response.put("gpa", student.getGpa());
        response.put("dateOfBirth", student.getDateOfBirth());
        response.put("location", student.getLocation());
        response.put("educationBackground", student.getEducationBackground());
        
        // Add user ID if available
        if (student.getUser() != null) {
            response.put("userId", student.getUser().getId());
        }
        
        // Add application IDs without the full objects
        if (student.getApplications() != null) {
            List<Long> applicationIds = student.getApplications().stream()
                .map(app -> app.getId())
                .collect(Collectors.toList());
            response.put("applicationIds", applicationIds);
        }
        
        return ResponseEntity.ok(response);
>>>>>>> 47f4fab (Updated with new features)
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        Student student = studentService.getStudentByEmail(email);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Student> getStudentByUserId(@PathVariable Long userId) {
        Student student = studentService.getStudentByUserId(userId);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student newStudent = studentService.createStudent(student);
        return new ResponseEntity<>(newStudent, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student studentDetails) {
        Student updatedStudent = studentService.updateStudent(id, studentDetails);
        return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
<<<<<<< HEAD
=======

    // Endpoint for updating student profile
    @PutMapping("/{studentId}/profile")
    public ResponseEntity<?> updateStudentProfile(
            @PathVariable Long studentId,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String email, // Email might not be updated via this form
            @RequestParam(required = false) Double gpa,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profilePicture, // For profile picture upload
            @RequestParam(required = false) String dateOfBirth,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String educationBackground) {

        try {
            // Fetch the existing student
            Student existingStudent = studentService.getStudentById(studentId);

            // Update fields if provided in the request parameters
            if (firstName != null) existingStudent.setFirstName(firstName);
            if (lastName != null) existingStudent.setLastName(lastName);
            // Decide if email should be updatable here or elsewhere
            // if (email != null) existingStudent.setEmail(email);
            if (gpa != null) existingStudent.setGpa(gpa);
            if (bio != null) existingStudent.setBio(bio);
            if (location != null) existingStudent.setLocation(location);
            if (educationBackground != null) existingStudent.setEducationBackground(educationBackground);

            // Handle date of birth string to LocalDate conversion
            if (dateOfBirth != null && !dateOfBirth.isEmpty()) {
                try {
                    LocalDate dob = LocalDate.parse(dateOfBirth);
                    // Backend validation: Date of birth cannot be in the future
                    if (dob.isAfter(LocalDate.now())) {
                        return ResponseEntity.badRequest().body("Date of birth cannot be in the future.");
                    }
                    existingStudent.setDateOfBirth(dob);
                } catch (Exception e) {
                    // Handle parsing error
                    return ResponseEntity.badRequest().body("Invalid date of birth format. Please use YYYY-MM-DD.");
                }
            }

            // Handle profile picture upload
            if (profilePicture != null && !profilePicture.isEmpty()) {
                try {
                    // Assuming a service method to handle file upload and return the path
                    String profilePicturePath = studentService.uploadProfilePicture(profilePicture); // You'll need to implement this service method
                    existingStudent.setProfilePicture(profilePicturePath);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload profile picture: " + e.getMessage());
                }
            }

            // Save the updated student entity
            Student updatedStudent = studentService.updateStudent(studentId, existingStudent);

            // Return the updated student data (you might want to return a simplified DTO)
            // For now, returning the entity, but be mindful of circular references if any
             Map<String, Object> response = new HashMap<>();
            response.put("id", updatedStudent.getId());
            response.put("firstName", updatedStudent.getFirstName());
            response.put("lastName", updatedStudent.getLastName());
            response.put("email", updatedStudent.getEmail());
            response.put("profilePicture", updatedStudent.getProfilePicture());
            response.put("bio", updatedStudent.getBio());
            response.put("gpa", updatedStudent.getGpa()); // Add GPA
            response.put("dateOfBirth", updatedStudent.getDateOfBirth()); // Add dateOfBirth
            response.put("location", updatedStudent.getLocation()); // Add location
            response.put("educationBackground", updatedStudent.getEducationBackground()); // Add educationBackground

            // Add user ID if available
            if (updatedStudent.getUser() != null) {
                response.put("userId", updatedStudent.getUser().getId());
            }

            // Add application IDs without the full objects
            if (updatedStudent.getApplications() != null) {
                List<Long> applicationIds = updatedStudent.getApplications().stream()
                        .map(app -> app.getId())
                        .collect(Collectors.toList());
                response.put("applicationIds", applicationIds);
            }

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            // Log the exception details on the server side
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update student profile: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getStudentProfile(@PathVariable Long id) {
        try {
            Student student = studentService.getStudentById(id);
            if (student == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Map Student entity to StudentProfileDTO
            StudentProfileDTO studentProfileDTO = new StudentProfileDTO();
            studentProfileDTO.setId(student.getId());
            studentProfileDTO.setFirstName(student.getFirstName());
            studentProfileDTO.setLastName(student.getLastName());
            studentProfileDTO.setEmail(student.getEmail());
            studentProfileDTO.setProfilePicture(student.getProfilePicture());
            studentProfileDTO.setBio(student.getBio());
            studentProfileDTO.setGpa(student.getGpa());
            studentProfileDTO.setDateOfBirth(student.getDateOfBirth());
            studentProfileDTO.setLocation(student.getLocation());
            studentProfileDTO.setEducationBackground(student.getEducationBackground());

            return ResponseEntity.ok(studentProfileDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching student profile: " + e.getMessage());
        }
    }
>>>>>>> 47f4fab (Updated with new features)
}
