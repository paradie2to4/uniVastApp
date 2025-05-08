package com.university.app.controller;

import com.university.app.model.Program;
import com.university.app.model.University;
import com.university.app.service.UniversityService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import com.university.app.service.ProgramService;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
@Controller
public class DashboardController {
    private final ProgramService programService;
    private final UniversityService universityService;
    // Constructor injection (required for final fields)
    public DashboardController(ProgramService programService, UniversityService universityService) {
        this.programService = programService;
        this.universityService = universityService;
    }
    @GetMapping("/student-dashboard")
    public String showStudentDashboard() {
        return "student-dashboard"; // Renders student-dashboard.html
    }

    @GetMapping("/university-dashboard")
    public String showUniversityDashboard(Model model) {
        // Fetch the list of programs (replace with your actual logic)
        List<Program> programs = programService.getAllPrograms();
        List<University> universities = universityService.getAllUniversities();
        // Add to model
        model.addAttribute("programs", programs);
        model.addAttribute("universities", universities);

        return "university-dashboard";
    }

}
