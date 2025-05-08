package com.university.app.controller;

import com.university.app.service.ApplicationService;
import com.university.app.service.StudentService;
import com.university.app.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:8080") // In production, restrict this to your frontend domain
public class AdminController {

    private final StudentService studentService;
    private final UniversityService universityService;
    private final ApplicationService applicationService;

    @Autowired
    public AdminController(
            StudentService studentService,
            UniversityService universityService,
            ApplicationService applicationService) {
        this.studentService = studentService;
        this.universityService = universityService;
        this.applicationService = applicationService;
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
}
