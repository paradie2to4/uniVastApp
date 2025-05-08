package com.university.app.controller;

import com.university.app.model.Application;
import com.university.app.model.ApplicationStatus;
import com.university.app.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.io.FileNotFoundException;
import java.nio.file.Path;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000") // In production, restrict this to your frontend domain
public class ApplicationController {

    private final ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        Application application = applicationService.getApplicationById(id);
        return new ResponseEntity<>(application, HttpStatus.OK);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getApplicationsByStudentId(@PathVariable Long studentId) {
        List<Application> applications = applicationService.getApplicationsByStudentId(studentId);
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<Application>> getApplicationsByUniversityId(@PathVariable Long universityId) {
        List<Application> applications = applicationService.getApplicationsByUniversityId(universityId);
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @GetMapping("/program/{programId}")
    public ResponseEntity<List<Application>> getApplicationsByProgramId(@PathVariable Long programId) {
        List<Application> applications = applicationService.getApplicationsByProgramId(programId);
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Application>> getApplicationsByStatus(@PathVariable ApplicationStatus status) {
        List<Application> applications = applicationService.getApplicationsByStatus(status);
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@Valid @RequestBody Map<String, Object> request) {
        Long studentId = Long.valueOf(request.get("studentId").toString());
        Long programId = Long.valueOf(request.get("programId").toString());
        String personalStatement = (String) request.get("personalStatement");
        
        Application newApplication = applicationService.createApplication(studentId, programId, personalStatement);
        return new ResponseEntity<>(newApplication, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        ApplicationStatus status = ApplicationStatus.valueOf((String) request.get("status"));
        String feedback = (String) request.get("feedback");
        
        Application updatedApplication = applicationService.updateApplicationStatus(id, status, feedback);
        return new ResponseEntity<>(updatedApplication, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody Application applicationDetails) {
        Application updatedApplication = applicationService.updateApplication(id, applicationDetails);
        return new ResponseEntity<>(updatedApplication, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @PostMapping("/{applicationId}/upload")
    public ResponseEntity<String> uploadFile(
            @PathVariable Long applicationId,
            @RequestParam("file") MultipartFile file) {
        try {
            String savedFilePath = applicationService.saveFile(applicationId, file);
            return ResponseEntity.ok("File uploaded successfully: " + savedFilePath);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }
    @GetMapping("/files/{applicationId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long applicationId) throws IOException {
        Application app = applicationService.getApplicationById(applicationId);
        Path file = Paths.get(app.getUploadedFilePath());
        Resource resource = new UrlResource(file.toUri());

        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                    .body(resource);
        } else {
            throw new FileNotFoundException("File not found");
        }
    }

}
