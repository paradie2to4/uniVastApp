package com.university.app;

import com.university.app.model.*;
import com.university.app.model.User;
import com.university.app.model.UserRole;
import com.university.app.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import com.university.app.service.UserService;
import com.university.app.service.StudentService;
import com.university.app.service.UniversityService;
import com.university.app.service.ProgramService;
import com.university.app.service.ApplicationService;

import java.util.List;
import java.time.LocalDate;

@SpringBootApplication
@EnableScheduling
public class UniversityApplication {

    public static void main(String[] args) {
        SpringApplication.run(UniversityApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(
            UserService userService,
            StudentService studentService,
            UniversityService universityService,
            ProgramService programService,
            ApplicationService applicationService
    ) {
        return args -> {
            // 1. Create and link users
            createAdminUser(userService);
            // Add calls to create initial data for students, universities, programs, applications if needed
            // Example:
            // createInitialStudents(studentService);
            // createInitialUniversities(universityService);
        };
    }

    private void createAdminUser(UserService userService) {
        String username = "admin";
        if (!userService.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setEmail("admin@example.com");
            user.setPassword("adminpass");
            user.setRole(UserRole.ADMIN);

            userService.createUser(user);
            System.out.println("Admin user created: " + username);
        }
    }
    
    // You can add other methods here for creating initial students, universities, etc.
    // private void createInitialStudents(StudentService studentService) { ... }
    // private void createInitialUniversities(UniversityService universityService) { ... }
}
