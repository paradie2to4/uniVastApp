package com.university.app.controller;

import com.university.app.model.Program;
import com.university.app.model.University;
import com.university.app.service.ProgramService;
import com.university.app.service.UniversityService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api") // Optional: Helps group API routes
public class DashboardController {

    private final ProgramService programService;
    private final UniversityService universityService;

    public DashboardController(ProgramService programService, UniversityService universityService) {
        this.programService = programService;
        this.universityService = universityService;
    }

    @GetMapping("/student-dashboard")
    public Map<String, String> getStudentDashboardMessage() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Student dashboard data should be fetched from relevant endpoints.");
        return response;
    }

    @GetMapping("/university-dashboard")
    public Map<String, Object> getUniversityDashboardData() {
        List<Program> programs = programService.getAllPrograms();
        List<University> universities = universityService.getAllUniversities();

        Map<String, Object> response = new HashMap<>();
        response.put("programs", programs);
        response.put("universities", universities);
        return response;
    }
}
