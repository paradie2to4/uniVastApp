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
            UserService userService
    ) {
        return args -> {
            createAdminUser(userService);
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
}
