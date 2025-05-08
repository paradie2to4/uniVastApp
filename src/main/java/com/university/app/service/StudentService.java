package com.university.app.service;

import com.university.app.model.Student;
import com.university.app.repository.StudentRepository;
import com.university.app.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

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
        
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        student.setBio(studentDetails.getBio());
        student.setProfilePicture(studentDetails.getProfilePicture());
        
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

}
