package com.university.app.service;

import com.university.app.model.User;
import com.university.app.model.UserRole;
import com.university.app.repository.UserRepository;
import com.university.app.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final StudentService studentService;
    private final UniversityService universityService;

    @Autowired
    public UserService(UserRepository userRepository, StudentService studentService, UniversityService universityService) {
        this.userRepository = userRepository;
        this.studentService = studentService;
        this.universityService = universityService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    @Transactional
    public User createUser(User user) {
        // In a real application, you would hash the password here
        User savedUser = userRepository.save(user);
        
        // Save related entities if they exist
        if (user.getStudent() != null) {
            user.getStudent().setUser(savedUser);
            studentService.createStudent(user.getStudent());
        }
        
        if (user.getUniversity() != null) {
            user.getUniversity().setUser(savedUser);
            universityService.createUniversity(user.getUniversity());
        }
        
        return savedUser;
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        // Only update password if it's provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            // In a real application, you would hash the password here
            user.setPassword(userDetails.getPassword());
        }
        user.setRole(userDetails.getRole());
        user.setActive(userDetails.isActive());
        
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public User updateLastLogin(Long id) {
        User user = getUserById(id);
        user.setLastLogin(LocalDateTime.now());
        return userRepository.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

}
