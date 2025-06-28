package com.university.app.service;

import com.university.app.model.University;
import com.university.app.repository.UniversityRepository;
import com.university.app.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UniversityService {

    private final UniversityRepository universityRepository;
    private final String UPLOAD_DIR = "uploads/logos/";

    @Autowired
    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
        // Create upload directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<University> getAllUniversities() {
        return universityRepository.findAll();
    }

    public University getUniversityById(Long id) {
        return universityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found with id: " + id));
    }

    public List<University> searchUniversities(String query) {
        return universityRepository.findByNameContainingIgnoreCase(query);
    }

    public University createUniversity(University university) {
        return universityRepository.save(university);
    }

    public University updateUniversity(University university) {
        if (!universityRepository.existsById(university.getId())) {
            throw new ResourceNotFoundException("University not found with id: " + university.getId());
        }
        
        University existingUniversity = getUniversityById(university.getId());
        
        // Update all fields
        if (university.getName() != null) {
        existingUniversity.setName(university.getName());
        }
        if (university.getLocation() != null) {
        existingUniversity.setLocation(university.getLocation());
        }
        if (university.getDescription() != null) {
        existingUniversity.setDescription(university.getDescription());
        }
        if (university.getAcceptanceRate() >= 0 && university.getAcceptanceRate() <= 100) {
        existingUniversity.setAcceptanceRate(university.getAcceptanceRate());
        }
        // Only update the logo if a new logo is provided in the update request
        if (university.getLogo() != null && !university.getLogo().isEmpty()) {
        existingUniversity.setLogo(university.getLogo());
        }
        if (university.getWebsite() != null) {
        existingUniversity.setWebsite(university.getWebsite());
        }
        if (university.getPhoneNumber() != null) {
        existingUniversity.setPhoneNumber(university.getPhoneNumber());
        }
        if (university.getFoundedYear() != null) {
        existingUniversity.setFoundedYear(university.getFoundedYear());
        }
        if (university.getAccreditation() != null) {
        existingUniversity.setAccreditation(university.getAccreditation());
        }
        
        return universityRepository.save(existingUniversity);
    }

    public void deleteUniversity(Long id) {
        University university = getUniversityById(id);
        universityRepository.delete(university);
    }
    
    public long countUniversities() {
        return universityRepository.count();
    }
    
    public Map<String, Object> getUniversityStats(Long universityId) {
        // Get the university
        University university = getUniversityById(universityId);
        
        // Count applications by status
        int totalApplications = 0;
        int pendingReview = 0;
        int accepted = 0;
        int rejected = 0;
        
        // For each program in the university, count its applications
        for (var program : university.getPrograms()) {
            for (var application : program.getApplications()) {
                totalApplications++;
                
                switch (application.getStatus().name()) {
                    case "PENDING":
                        pendingReview++;
                        break;
                    case "ACCEPTED":
                        accepted++;
                        break;
                    case "REJECTED":
                        rejected++;
                        break;
                }
            }
        }
        
        // Create stats map
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", totalApplications);
        stats.put("pendingReview", pendingReview);
        stats.put("accepted", accepted);
        stats.put("rejected", rejected);
        
        return stats;
    }

    public long countAll() {
        return universityRepository.count();
    }

    public University getFeaturedUniversities() {
        return universityRepository.findAll().stream()
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("No universities found"));
    }

    public List<University> getAllLocations() {
        return universityRepository.findAll();
    }

    public List<University> getUniversitiesByName(String name) {
        return universityRepository.findByNameContainingIgnoreCase(name);
    }

    public List<University> getUniversitiesByLocation(String location) {
        return universityRepository.findByLocationContainingIgnoreCase(location);
    }

    public String uploadLogo(MultipartFile file) {
        try {
            // Validate file
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File cannot be empty");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Only image files are allowed");
            }

            // Validate file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("File size cannot exceed 5MB");
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                throw new IllegalArgumentException("Invalid filename");
            }
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filepath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), filepath);
            
            // Return the URL path to the file
            return "/api/universities/uploads/logos/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload logo", e);
        }
    }
}
