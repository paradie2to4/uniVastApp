package com.university.app.controller;
import com.university.app.service.ProgramService;
import com.university.app.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @Autowired
    private UniversityService universityService;

    @Autowired
    private ProgramService programService;

    @GetMapping("/")
    public String home(Model model) {
        // Add statistics for the homepage
        model.addAttribute("universitiesCount", universityService.countAll());
        model.addAttribute("programsCount", programService.countAll());
        model.addAttribute("studentsCount", 5000); // Example static number, replace with actual count
        model.addAttribute("successRate", 92); // Example static number

        // Add featured universities
        model.addAttribute("featuredUniversities", universityService.getFeaturedUniversities());

        return "index";
    }

    @GetMapping("/signup")
    public String signup() {
        return "auth";
    }
}