package com.university.app.controller;

import com.university.app.model.University;
import com.university.app.service.UniversityService;
import com.university.app.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;
import java.io.IOException;

@RestController
@RequestMapping("/api/universities")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}) // Allow both frontend origins
public class UniversityController {

    private final UniversityService universityService;
    private final Path fileStorageLocation;

    @Autowired
    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
        // Initialize file storage location based on the upload directory used in UniversityService
        this.fileStorageLocation = Paths.get("uploads/logos/").toAbsolutePath().normalize();
        try {
            java.nio.file.Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUniversities() {
        List<University> universities = universityService.getAllUniversities();
        // Log logo path for each university before mapping
        universities.forEach(u -> System.out.println("University " + u.getName() + " logo path before mapping: " + u.getLogo()));
        List<Map<String, Object>> simplifiedUniversities = universities.stream()
            .map(university -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", university.getId());
                simplified.put("name", university.getName());
                simplified.put("location", university.getLocation());
                simplified.put("logo", university.getLogo());
                simplified.put("description", university.getDescription());
                return simplified;
            })
            .collect(Collectors.toList());
        return new ResponseEntity<>(simplifiedUniversities, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUniversityById(@PathVariable Long id) {
        University university = universityService.getUniversityById(id);
        Map<String, Object> simplified = new HashMap<>();
        simplified.put("id", university.getId());
        simplified.put("name", university.getName());
        simplified.put("location", university.getLocation());
        simplified.put("logo", university.getLogo());
        simplified.put("description", university.getDescription());
        simplified.put("website", university.getWebsite());
        simplified.put("phoneNumber", university.getPhoneNumber());
        simplified.put("foundedYear", university.getFoundedYear());
        simplified.put("accreditation", university.getAccreditation());
        simplified.put("acceptanceRate", university.getAcceptanceRate());
        return ResponseEntity.ok(simplified);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUniversities(@RequestParam String query) {
        List<University> universities = universityService.searchUniversities(query);
        List<Map<String, Object>> simplifiedUniversities = universities.stream()
            .map(university -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", university.getId());
                simplified.put("name", university.getName());
                simplified.put("location", university.getLocation());
                simplified.put("logo", university.getLogo());
                simplified.put("description", university.getDescription());
                return simplified;
            })
            .collect(Collectors.toList());
        return new ResponseEntity<>(simplifiedUniversities, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createUniversity(@Valid @RequestBody University university) {
        University newUniversity = universityService.createUniversity(university);
        Map<String, Object> simplified = new HashMap<>();
        simplified.put("id", newUniversity.getId());
        simplified.put("name", newUniversity.getName());
        simplified.put("location", newUniversity.getLocation());
        simplified.put("logo", newUniversity.getLogo());
        simplified.put("description", newUniversity.getDescription());
        return new ResponseEntity<>(simplified, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUniversity(
            @PathVariable Long id,
            @Valid @RequestBody University universityDetails) {
        universityDetails.setId(id);
        University updatedUniversity = universityService.updateUniversity(universityDetails);
        Map<String, Object> simplified = new HashMap<>();
        simplified.put("id", updatedUniversity.getId());
        simplified.put("name", updatedUniversity.getName());
        simplified.put("location", updatedUniversity.getLocation());
        simplified.put("logo", updatedUniversity.getLogo());
        simplified.put("description", updatedUniversity.getDescription());
        simplified.put("website", updatedUniversity.getWebsite());
        simplified.put("phoneNumber", updatedUniversity.getPhoneNumber());
        simplified.put("foundedYear", updatedUniversity.getFoundedYear());
        simplified.put("accreditation", updatedUniversity.getAccreditation());
        simplified.put("acceptanceRate", updatedUniversity.getAcceptanceRate());
        return new ResponseEntity<>(simplified, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        universityService.deleteUniversity(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping(value = "/{id}/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUniversityProfile(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String website,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String foundedYear,
            @RequestParam(required = false) String accreditation,
            @RequestParam(required = false) String acceptanceRate,
            @RequestParam(required = false) MultipartFile logo) {
        
        try {
            University university = universityService.getUniversityById(id);
            
            if (name != null) university.setName(name);
            if (description != null) university.setDescription(description);
            if (location != null) university.setLocation(location);
            if (website != null) university.setWebsite(website);
            if (phoneNumber != null) university.setPhoneNumber(phoneNumber);
            if (foundedYear != null) {
                try {
                    university.setFoundedYear(Integer.parseInt(foundedYear));
                } catch (NumberFormatException e) {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Invalid founded year format. Please enter a valid year.");
                    return ResponseEntity.badRequest().body(error);
                }
            }
            if (accreditation != null) university.setAccreditation(accreditation);
            if (acceptanceRate != null) {
                try {
                    double rate = Double.parseDouble(acceptanceRate);
                    if (rate < 0 || rate > 100) {
                        Map<String, String> error = new HashMap<>();
                        error.put("message", "Acceptance rate must be between 0 and 100");
                        return ResponseEntity.badRequest().body(error);
                    }
                    university.setAcceptanceRate(rate);
                } catch (NumberFormatException e) {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Invalid acceptance rate format. Please enter a valid number.");
                    return ResponseEntity.badRequest().body(error);
                }
            }
            if (logo != null && !logo.isEmpty()) {
                try {
                    String logoUrl = universityService.uploadLogo(logo);
                    university.setLogo(logoUrl);
                } catch (Exception e) {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Failed to upload logo: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            University updatedUniversity = universityService.updateUniversity(university);
            Map<String, Object> simplified = new HashMap<>();
            simplified.put("id", updatedUniversity.getId());
            simplified.put("name", updatedUniversity.getName());
            simplified.put("location", updatedUniversity.getLocation());
            simplified.put("logo", updatedUniversity.getLogo());
            simplified.put("description", updatedUniversity.getDescription());
            simplified.put("website", updatedUniversity.getWebsite());
            simplified.put("phoneNumber", updatedUniversity.getPhoneNumber());
            simplified.put("foundedYear", updatedUniversity.getFoundedYear());
            simplified.put("accreditation", updatedUniversity.getAccreditation());
            simplified.put("acceptanceRate", updatedUniversity.getAcceptanceRate());
            return ResponseEntity.ok(simplified);
        } catch (ResourceNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "University not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update university profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Endpoint to serve university logo files
    @GetMapping("/uploads/logos/{filename:.+}")
    public ResponseEntity<Resource> serveUniversityLogo(@PathVariable String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = null;
                try {
                    contentType = java.nio.file.Files.probeContentType(filePath);
                } catch (IOException ex) {
                    // Fallback to the default content type if type could not be determined
                }

                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("File not found " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + filename, ex);
        }
    }
}
