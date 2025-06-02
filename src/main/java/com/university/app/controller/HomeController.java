package com.university.app.controller;

import com.university.app.service.ProgramService;
import com.university.app.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController  // Note: Use @RestController instead of @Controller
@RequestMapping("/api") // Prefix all endpoints with /api for clarity
public class HomeController {

    @Autowired
    private UniversityService universityService;

    @Autowired
    private ProgramService programService;

    @GetMapping("/stats")
    public Map<String, Object> getStatistics() {
        Map<String, Object> response = new HashMap<>();
        response.put("universitiesCount", universityService.countAll());
        response.put("programsCount", programService.countAll());
        response.put("studentsCount", 5000); // Replace with dynamic data if needed
        response.put("successRate", 92); // Replace with dynamic data if needed
        return response;
    }

    @GetMapping("/featured-universities")
    public Map<String, Object> getFeaturedUniversities() {
        Map<String, Object> response = new HashMap<>();
        response.put("featuredUniversities", universityService.getFeaturedUniversities());
        return response;
    }

    @GetMapping("/signup")
    public Map<String, String> getSignupMessage() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Signup endpoint reached. Use POST to create account.");
        return response;
    }
}
