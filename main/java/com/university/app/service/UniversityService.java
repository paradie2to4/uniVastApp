package com.university.app.service;

import com.university.app.model.University;
import com.university.app.repository.UniversityRepository;
import com.university.app.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UniversityService {

    private final UniversityRepository universityRepository;

    @Autowired
    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
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

    public University updateUniversity(Long id, University universityDetails) {
        University university = getUniversityById(id);
        
        university.setName(universityDetails.getName());
        university.setLocation(universityDetails.getLocation());
        university.setDescription(universityDetails.getDescription());
        university.setAcceptanceRate(universityDetails.getAcceptanceRate());
        university.setLogo(universityDetails.getLogo());
        
        return universityRepository.save(university);
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
    public University getFeaturedUniversities(){
        return universityRepository.findAll().stream().findFirst().get();
    }

    public List<University> getAllLocations() {
        return universityRepository.findAll();
    }
}
