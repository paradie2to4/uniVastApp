package com.university.app.controller;

import com.university.app.repository.StudentRepository;
import com.university.app.service.ApplicationService;
import com.university.app.service.ProgramService;
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
@CrossOrigin(origins = "http://localhost:3000") // In production, restrict this to your frontend domain
public class AdminController {

    private final StudentService studentService;
    private final UniversityService universityService;
    private final ApplicationService applicationService;
    private final ProgramService programService;
    private final StudentRepository studentRepository;

    @Autowired
    public AdminController(
            StudentService studentService,
            UniversityService universityService,
            ApplicationService applicationService,
            ProgramService programService, StudentRepository studentRepository) {
        this.studentService = studentService;
        this.universityService = universityService;
        this.applicationService = applicationService;
        this.programService = programService;
        this.studentRepository = studentRepository;
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
    @GetMapping("/universities")
    public ResponseEntity<?> getUniversitiesByNameOrLocation(@RequestParam(required = false) String name,
                                                             @RequestParam(required = false) String location) {
        if (name != null) {
            return ResponseEntity.ok(universityService.getUniversitiesByName(name));
        } else if (location != null) {
            return ResponseEntity.ok(universityService.getUniversitiesByLocation(location));
        } else {
            return ResponseEntity.badRequest().body("Please provide a 'name' or 'location' parameter");
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getStudentsByNameOrEmail(@RequestParam(required = false) String name,
                                                      @RequestParam(required = false) String email) {
        if (email != null) {
            return ResponseEntity.ok(studentService.getStudentByEmail(email));
        } else if (name != null) {
            return ResponseEntity.ok(studentService.searchStudentsByName(name));
        } else {
            return ResponseEntity.badRequest().body("Please provide a 'name' or 'email' parameter");
        }
    }

    @GetMapping("/programs")
    public ResponseEntity<?> getProgramsByNameOrDegree(@RequestParam(required = false) String name,
                                                       @RequestParam(required = false) String degree) {
        if (name != null) {
            return ResponseEntity.ok(programService.getProgramsByName(name));
        } else if (degree != null) {
            return ResponseEntity.ok(programService.getProgramsByDegree(degree));
        } else {
            return ResponseEntity.badRequest().body("Please provide a 'name' or 'degree' parameter");
        }
    }

}
