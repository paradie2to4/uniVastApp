package com.university.app.controller;

import com.university.app.dto.SignupRequest;
import com.university.app.model.*;
import com.university.app.repository.UniversityRepository;
import com.university.app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final UniversityRepository universityRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, UniversityRepository universityRepository) {
        this.userService = userService;
        this.universityRepository = universityRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable UserRole role) {
        List<User> users = userService.getUsersByRole(role);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            logger.info("Received signup request: {}", signupRequest);
            logger.info("Username: {}, Email: {}, Role: {}", 
                signupRequest.getUsername(), 
                signupRequest.getEmail(), 
                signupRequest.getRole());

            // Check if username or email already exists
            if (userService.existsByUsername(signupRequest.getUsername())) {
                logger.warn("Username already taken: {}", signupRequest.getUsername());
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username already taken"));
            }
            if (userService.existsByEmail(signupRequest.getEmail())) {
                logger.warn("Email already registered: {}", signupRequest.getEmail());
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already registered"));
            }

            User user = new User();
            user.setUsername(signupRequest.getUsername());
            user.setEmail(signupRequest.getEmail());
            // Encrypt password before saving
            user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
            user.setRole(signupRequest.getRole());

            if (signupRequest.getRole() == UserRole.STUDENT) {
                logger.info("Creating student account for: {}", signupRequest.getUsername());
                if (signupRequest.getFirstName() == null || signupRequest.getLastName() == null) {
                    logger.warn("Missing first name or last name for student: {}", signupRequest.getUsername());
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "First name and last name are required for students"));
                }
                Student student = new Student();
                student.setFirstName(signupRequest.getFirstName());
                student.setLastName(signupRequest.getLastName());
                student.setEmail(signupRequest.getEmail());
                student.setUser(user);
                user.setStudent(student);
            } else if (signupRequest.getRole() == UserRole.UNIVERSITY) {
                logger.info("Creating university account for: {}", signupRequest.getUsername());
                if (signupRequest.getUniversityName() == null || signupRequest.getUniversityLocation() == null) {
                    logger.warn("Missing university name or location for: {}", signupRequest.getUsername());
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "University name and location are required for universities"));
                }
                University university = new University();
                university.setName(signupRequest.getUniversityName());
                university.setLocation(signupRequest.getUniversityLocation());
                university.setUser(user);
                user.setUniversity(university);
            }

            logger.info("Attempting to save user: {}", user.getUsername());
            User savedUser = userService.createUser(user);
            logger.info("Successfully created user with ID: {}", savedUser.getId());
            
            // Don't return the password in the response
            savedUser.setPassword(null);
            
            // Create a response map with only the necessary fields
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedUser.getId());
            response.put("username", savedUser.getUsername());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole());
            
            if (savedUser.getStudent() != null) {
                Map<String, String> studentInfo = new HashMap<>();
                studentInfo.put("firstName", savedUser.getStudent().getFirstName());
                studentInfo.put("lastName", savedUser.getStudent().getLastName());
                response.put("student", studentInfo);
            }
            
            if (savedUser.getUniversity() != null) {
                Map<String, String> universityInfo = new HashMap<>();
                universityInfo.put("name", savedUser.getUniversity().getName());
                universityInfo.put("location", savedUser.getUniversity().getLocation());
                response.put("university", universityInfo);
            }
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid role value: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid role value: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error during signup: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error creating user: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PatchMapping("/{id}/login")
    public ResponseEntity<User> updateLastLogin(@PathVariable Long id) {
        User user = userService.updateLastLogin(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String usernameOrEmail = credentials.get("username");
            String password = credentials.get("password");

            logger.info("Login attempt for username/email: {}", usernameOrEmail);

            User user = userService.getUserByUsername(usernameOrEmail);
            if (user == null) {
                user = userService.getUserByEmail(usernameOrEmail);
            }

            if (user == null) {
                logger.warn("Login failed: User not found for username/email: {}", usernameOrEmail);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or email"));
            }

            boolean passwordMatches = false;
            
            // First try BCrypt matching
            if (user.getPassword().startsWith("$2a$")) {
                passwordMatches = passwordEncoder.matches(password, user.getPassword());
            } else {
                // If password is not BCrypt encoded, compare plain text
                passwordMatches = password.equals(user.getPassword());
                
                // If plain text matches, update to BCrypt
                if (passwordMatches) {
                    user.setPassword(passwordEncoder.encode(password));
                    userService.updateUser(user.getId(), user);
                }
            }

            if (!passwordMatches) {
                logger.warn("Login failed: Invalid password for user: {}", usernameOrEmail);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid password"));
            }

            userService.updateLastLogin(user.getId());

            // Create a minimal response with only essential data
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().toString());
            
            if (user.getStudent() != null) {
                response.put("studentId", user.getStudent().getId());
            }
            
            if (user.getUniversity() != null) {
                response.put("universityId", user.getUniversity().getId());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error during login: " + e.getMessage()));
        }
    }
}
