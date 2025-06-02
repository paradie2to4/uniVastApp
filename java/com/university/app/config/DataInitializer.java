//package com.university.app.config;
//
//import com.university.app.model.*;
//import com.university.app.repository.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Profile;
//
//import java.time.LocalDateTime;
//import java.util.Arrays;
//
//@Configuration
//public class DataInitializer {
//
//    @Bean
//    @Profile("!prod")
//    CommandLineRunner initDatabase(
//            UniversityRepository universityRepository,
//            ProgramRepository programRepository,
//            StudentRepository studentRepository,
//            ApplicationRepository applicationRepository,
//            UserRepository userRepository) {
//        return args -> {
//            // Create users
//            User adminUser = new User("admin", "admin@example.com", "admin123", UserRole.ADMIN);
//            User studentUser = new User("student", "student@example.com", "student123", UserRole.STUDENT);
//            User universityUser = new User("university", "university@example.com", "university123", UserRole.UNIVERSITY);
//
//            userRepository.saveAll(Arrays.asList(adminUser, studentUser, universityUser));
//
//            // Create universities
//            University harvard = new University(
//                    "Harvard University",
//                    "Cambridge, MA",
//                    "Harvard University is a private Ivy League research university in Cambridge, Massachusetts.",
//                    5.0,
//                    "https://www.harvard.edu/wp-content/uploads/2020/10/harvard-shield-logo-1.png"
//            );
//
//            University mit = new University(
//                    "Massachusetts Institute of Technology",
//                    "Cambridge, MA",
//                    "MIT is a private research university in Cambridge, Massachusetts, founded in 1861.",
//                    7.3,
//                    "https://web.mit.edu/graphicidentity/images/examples/mit-logo-full-black.svg"
//            );
//
//            University stanford = new University(
//                    "Stanford University",
//                    "Stanford, CA",
//                    "Stanford University is a private research university in Stanford, California.",
//                    4.8,
//                    "https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/stanford-university-logo.png"
//            );
//
//            universityRepository.saveAll(Arrays.asList(harvard, mit, stanford));
//
//            // Create programs
//            Program harvardCS = new Program(
//                    "Computer Science",
//                    "The Harvard Computer Science program focuses on the theoretical and practical aspects of computation.",
//                    "Bachelor of Science",
//                    "4 years",
//                    52000.0
//            );
//            harvardCS.setUniversity(harvard);
//
//            Program harvardBusiness = new Program(
//                    "Business Administration",
//                    "Harvard Business School's undergraduate program in business administration.",
//                    "Bachelor of Business Administration",
//                    "4 years",
//                    54000.0
//            );
//            harvardBusiness.setUniversity(harvard);
//
//            Program mitCS = new Program(
//                    "Computer Science and Engineering",
//                    "MIT's program in computer science and engineering focuses on computational thinking and hands-on learning.",
//                    "Bachelor of Science",
//                    "4 years",
//                    53400.0
//            );
//            mitCS.setUniversity(mit);
//
//            Program stanfordEngineering = new Program(
//                    "Engineering",
//                    "Stanford's engineering program is one of the top-ranked in the world.",
//                    "Bachelor of Science",
//                    "4 years",
//                    56000.0
//            );
//            stanfordEngineering.setUniversity(stanford);
//
//            programRepository.saveAll(Arrays.asList(harvardCS, harvardBusiness, mitCS, stanfordEngineering));
//
//            // Create students
////            Student john = new Student(
////                    "John",
////                    "Doe",
////                    "john.doe@example.com",
////                    "https://randomuser.me/api/portraits/men/1.jpg",
////                    "Computer Science enthusiast with a passion for AI and machine learning."
////            );
////
////            Student jane = new Student(
////                    "Jane",
////                    "Smith",
////                    "jane.smith@example.com",
////                    "https://randomuser.me/api/portraits/women/1.jpg",
////                    "Aspiring business leader with a focus on sustainable business practices."
////            );
//
//            studentRepository.saveAll(Arrays.asList(john, jane));
//
//            // Create applications
//            Application app1 = new Application(
//                    john,
//                    harvardCS,
//                    "I am passionate about computer science and have been coding since I was 12 years old."
//            );
//            app1.setStatus(ApplicationStatus.UNDER_REVIEW);
//
//            Application app2 = new Application(
//                    john,
//                    mitCS,
//                    "MIT has always been my dream school, and I believe I can contribute to the vibrant tech community."
//            );
//            app2.setStatus(ApplicationStatus.PENDING);
//
//            Application app3 = new Application(
//                    jane,
//                    harvardBusiness,
//                    "I have started two small businesses during high school and want to expand my knowledge."
//            );
//            app3.setStatus(ApplicationStatus.ACCEPTED);
//            app3.setFeedback("Impressive entrepreneurial background. Welcome to Harvard!");
//
//            applicationRepository.saveAll(Arrays.asList(app1, app2, app3));
//
//            // Update application counts for universities
//            harvard.setApplicationCount(2);
//            mit.setApplicationCount(1);
//            universityRepository.saveAll(Arrays.asList(harvard, mit));
//        };
//    }
//}
