package com.university.app;

import com.university.app.model.*;
import com.university.app.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@SpringBootApplication
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
            User studentUser = createStudentUser(userService);
            User universityUser = createUniversityUser(userService);
            createAdminUser(userService);

            // 2. Create Program for the university
            University university = universityUser.getUniversity();

            Program program = new Program();
            program.setName("Bachelor of Computer Science");
            program.setDescription("A program focused on software engineering and AI.");
            program.setUniversity(university);
            program.setDegree("Computer Science");
            program.setRequirements("Maths, Physics background required.");
            program.setDuration("4 years");
            Program savedProgram = programService.createProgram(1L,program);
            System.out.println("Created program: " + savedProgram.getName());

            // 3. Create an Application for the student to the program
            Student student = studentUser.getStudent();

            Application application = new Application();
            application.setStudent(student);
            application.setProgram(savedProgram);
            application.setPersonalStatement("I'm passionate about computing and solving problems.");
            application.setStatus(ApplicationStatus.PENDING);

            Application savedApplication = applicationService.createApplication(
                    student.getId(),
                    savedProgram.getId(),
                    application.getPersonalStatement()
            );
            System.out.println("Created application ID: " + savedApplication.getId());
        };
    }

    private User createStudentUser(UserService userService) {
        String username = "student1";
        if (!userService.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setEmail("student1@example.com");
            user.setPassword("password123");
            user.setRole(UserRole.STUDENT);

            Student student = new Student();
            student.setFirstName("SHAMI");
            student.setLastName("Paradie");
            student.setEmail("shami4real@example.com");
            student.setUser(user);

            user.setStudent(student);

            return userService.createUser(user);
        }
        return userService.getUserByUsername(username);
    }

    private User createUniversityUser(UserService userService) {
        String username = "university1";
        if (!userService.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setEmail("university1@example.com");
            user.setPassword("password123");
            user.setRole(UserRole.UNIVERSITY);

            University university = new University();
            university.setName("Springfield University");
            university.setLocation("Kigali, Rwanda");
            university.setAcceptanceRate(50);
            university.setUser(user);

            user.setUniversity(university);

            return userService.createUser(user);
        }
        return userService.getUserByUsername(username);
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

}
