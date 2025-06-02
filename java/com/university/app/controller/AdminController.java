package com.university.app.controller;

import com.university.app.service.ApplicationService;
import com.university.app.service.StudentService;
import com.university.app.service.UniversityService;
import com.university.app.service.ProgramService;
import com.university.app.model.Student;
import com.university.app.model.University;
import com.university.app.model.Program;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Updated to match Next.js default port
public class AdminController {

    private final StudentService studentService;
    private final UniversityService universityService;
    private final ApplicationService applicationService;
    private final ProgramService programService;

    @Autowired
    public AdminController(
            StudentService studentService,
            UniversityService universityService,
            ApplicationService applicationService,
            ProgramService programService) {
        this.studentService = studentService;
        this.universityService = universityService;
        this.applicationService = applicationService;
        this.programService = programService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get counts from services
        long totalStudents = studentService.countStudents();
        long totalUniversities = universityService.countUniversities();
        long totalApplications = applicationService.countApplications();
        long pendingApplications = applicationService.countApplicationsByStatus("PENDING");
        
        stats.put("totalStudents", totalStudents);
        stats.put("totalUniversities", totalUniversities);
        stats.put("totalApplications", totalApplications);
        stats.put("pendingApplications", pendingApplications);
        
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @GetMapping("/universities")
    public ResponseEntity<List<University>> getAllUniversities() {
        List<University> universities = universityService.getAllUniversities();
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }

    @GetMapping("/programs")
    public ResponseEntity<List<Program>> getAllPrograms() {
        List<Program> programs = programService.getAllPrograms();
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }
}
