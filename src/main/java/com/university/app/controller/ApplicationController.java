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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.university.app.exception.ResourceNotFoundException;

import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.ArrayList;

import com.university.app.dto.ApplicationResponseDTO;
import com.university.app.dto.ApplicationResponseDTO.ProgramDTO;
import com.university.app.dto.ApplicationResponseDTO.UniversityDTO;
import com.university.app.dto.ApplicationResponseDTO.StudentDTO;

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
    public ResponseEntity<?> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        List<Map<String, Object>> simplifiedApplications = applications.stream()
            .map(application -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", application.getId());
                simplified.put("status", application.getStatus());
                simplified.put("personalStatement", application.getPersonalStatement());
                simplified.put("feedback", application.getFeedback());
                simplified.put("uploadedFilePath", application.getUploadedFilePath());
                simplified.put("studentId", application.getStudent().getId());
                simplified.put("studentName", application.getStudent().getFirstName() + " " + application.getStudent().getLastName());
                simplified.put("programId", application.getProgram().getId());
                simplified.put("programName", application.getProgram().getName());
                simplified.put("universityId", application.getProgram().getUniversity().getId());
                simplified.put("universityName", application.getProgram().getUniversity().getName());
                return simplified;
            })
            .collect(Collectors.toList());
        return new ResponseEntity<>(simplifiedApplications, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        Application application = applicationService.getApplicationById(id);
        Map<String, Object> simplified = new HashMap<>();
        simplified.put("id", application.getId());
        simplified.put("status", application.getStatus());
        simplified.put("personalStatement", application.getPersonalStatement());
        simplified.put("feedback", application.getFeedback());
        simplified.put("uploadedFilePath", application.getUploadedFilePath());
        simplified.put("studentId", application.getStudent().getId());
        simplified.put("studentName", application.getStudent().getFirstName() + " " + application.getStudent().getLastName());
        simplified.put("programId", application.getProgram().getId());
        simplified.put("programName", application.getProgram().getName());
        simplified.put("universityId", application.getProgram().getUniversity().getId());
        simplified.put("universityName", application.getProgram().getUniversity().getName());
        return ResponseEntity.ok(simplified);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getApplicationsByStudentId(@PathVariable Long studentId) {
        List<Application> applications = applicationService.getApplicationsByStudentId(studentId);
        
        // Create a simplified response with nested program and university information
        List<Map<String, Object>> simplifiedApplications = applications.stream()
            .map(application -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", application.getId());
                simplified.put("status", application.getStatus());
                simplified.put("personalStatement", application.getPersonalStatement());
                simplified.put("feedback", application.getFeedback());
                simplified.put("uploadedFilePath", application.getUploadedFilePath());
                simplified.put("studentId", application.getStudent().getId());
                simplified.put("studentName", application.getStudent().getFirstName() + " " + application.getStudent().getLastName());

                // Format dates as ISO strings using UTC timezone
                simplified.put("submissionDate", application.getSubmissionDate() != null ? 
                    application.getSubmissionDate().atOffset(java.time.ZoneOffset.UTC).toString() : null);
                simplified.put("lastUpdated", application.getLastUpdated() != null ? 
                    application.getLastUpdated().atOffset(java.time.ZoneOffset.UTC).toString() : null);
                
                // Add nested program information
                if (application.getProgram() != null) {
                    Map<String, Object> programInfo = new HashMap<>();
                    programInfo.put("id", application.getProgram().getId());
                    programInfo.put("name", application.getProgram().getName());
                    programInfo.put("description", application.getProgram().getDescription());
                    programInfo.put("degree", application.getProgram().getDegree());
                    programInfo.put("duration", application.getProgram().getDuration());
                    programInfo.put("tuitionFee", application.getProgram().getTuitionFee());
                    
                    // Add nested university information within the program
                    if (application.getProgram().getUniversity() != null) {
                        Map<String, Object> universityInfo = new HashMap<>();
                        universityInfo.put("id", application.getProgram().getUniversity().getId());
                        universityInfo.put("name", application.getProgram().getUniversity().getName());
                        universityInfo.put("location", application.getProgram().getUniversity().getLocation());
                        universityInfo.put("logo", application.getProgram().getUniversity().getLogo());
                        programInfo.put("university", universityInfo);
                    }

                    simplified.put("program", programInfo); // Nest the program object
                }
                
                return simplified;
            })
            .collect(Collectors.toList());
            
        // Return the list of simplified applications directly
        return ResponseEntity.ok(simplifiedApplications);
    }

    @GetMapping("/university/{universityId}")
    public ResponseEntity<?> getApplicationsByUniversityId(@PathVariable Long universityId) {
        try {
            List<Application> applications = applicationService.getApplicationsByUniversityId(universityId);
            
            // Map Application entities to ApplicationResponseDTOs
            List<ApplicationResponseDTO> responseDTOs = applications.stream()
                .map(application -> {
                    ApplicationResponseDTO dto = new ApplicationResponseDTO();
                    dto.setId(application.getId());
                    dto.setStatus(application.getStatus().toString());
                    dto.setPersonalStatement(application.getPersonalStatement());
                    dto.setFeedback(application.getFeedback());
                    dto.setUploadedFilePath(application.getUploadedFilePath());

                    // Map related entities to their DTOs and nest them
                    if (application.getStudent() != null) {
                        ApplicationResponseDTO.StudentDTO studentDTO = new ApplicationResponseDTO.StudentDTO();
                        studentDTO.setId(application.getStudent().getId());
                        studentDTO.setFirstName(application.getStudent().getFirstName());
                        studentDTO.setLastName(application.getStudent().getLastName());
                        studentDTO.setEmail(application.getStudent().getEmail());
                        // Include other student fields if needed in the DTO
                        dto.setStudent(studentDTO);
                    }

                    if (application.getProgram() != null) {
                        ApplicationResponseDTO.ProgramDTO programDTO = new ApplicationResponseDTO.ProgramDTO();
                        programDTO.setId(application.getProgram().getId());
                        programDTO.setName(application.getProgram().getName());
                        // Include other program fields if needed in the DTO
                        
                        // Nest UniversityDTO within ProgramDTO if university is available
                         if (application.getProgram().getUniversity() != null) {
                            ApplicationResponseDTO.UniversityDTO universityDTO = new ApplicationResponseDTO.UniversityDTO();
                            universityDTO.setId(application.getProgram().getUniversity().getId());
                            universityDTO.setName(application.getProgram().getUniversity().getName());
                             // Include other university fields if needed
                            programDTO.setUniversity(universityDTO);
                         }
                        
                        dto.setProgram(programDTO);
                    }
                    
                     // Explicitly set the university at the top level as well if needed by frontend
                     if (application.getUniversity() != null) {
                        ApplicationResponseDTO.UniversityDTO universityDTO = new ApplicationResponseDTO.UniversityDTO();
                        universityDTO.setId(application.getUniversity().getId());
                        universityDTO.setName(application.getUniversity().getName());
                         // Include other university fields if needed
                        dto.setUniversity(universityDTO);
                     }

                    // Format dates as ISO strings using UTC timezone
                    if (application.getSubmissionDate() != null) {
                         dto.setSubmissionDate(application.getSubmissionDate().atOffset(java.time.ZoneOffset.UTC).toString());
                    }
                    if (application.getLastUpdated() != null) {
                         dto.setLastUpdated(application.getLastUpdated().atOffset(java.time.ZoneOffset.UTC).toString());
                    }

                    return dto;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(responseDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving applications: " + e.getMessage());
        }
    }

    @GetMapping("/program/{programId}")
    public ResponseEntity<?> getApplicationsByProgramId(@PathVariable Long programId) {
        List<Application> applications = applicationService.getApplicationsByProgramId(programId);
        List<Map<String, Object>> simplifiedApplications = applications.stream()
            .map(application -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", application.getId());
                simplified.put("status", application.getStatus());
                simplified.put("personalStatement", application.getPersonalStatement());
                simplified.put("feedback", application.getFeedback());
                simplified.put("uploadedFilePath", application.getUploadedFilePath());
                simplified.put("studentId", application.getStudent().getId());
                simplified.put("studentName", application.getStudent().getFirstName() + " " + application.getStudent().getLastName());
                simplified.put("programId", application.getProgram().getId());
                simplified.put("programName", application.getProgram().getName());
                simplified.put("universityId", application.getProgram().getUniversity().getId());
                simplified.put("universityName", application.getProgram().getUniversity().getName());
                return simplified;
            })
            .collect(Collectors.toList());
        return new ResponseEntity<>(simplifiedApplications, HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getApplicationsByStatus(@PathVariable ApplicationStatus status) {
        List<Application> applications = applicationService.getApplicationsByStatus(status);
        List<Map<String, Object>> simplifiedApplications = applications.stream()
            .map(application -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", application.getId());
                simplified.put("status", application.getStatus());
                simplified.put("personalStatement", application.getPersonalStatement());
                simplified.put("feedback", application.getFeedback());
                simplified.put("uploadedFilePath", application.getUploadedFilePath());
                simplified.put("studentId", application.getStudent().getId());
                simplified.put("studentName", application.getStudent().getFirstName() + " " + application.getStudent().getLastName());
                simplified.put("programId", application.getProgram().getId());
                simplified.put("programName", application.getProgram().getName());
                simplified.put("universityId", application.getProgram().getUniversity().getId());
                simplified.put("universityName", application.getProgram().getUniversity().getName());
                return simplified;
            })
            .collect(Collectors.toList());
        return new ResponseEntity<>(simplifiedApplications, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createApplication(
            @RequestParam("studentId") Long studentId,
            @RequestParam("programId") Long programId,
            @RequestParam("personalStatement") String personalStatement,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
        Application newApplication = applicationService.createApplication(studentId, programId, personalStatement);
            
            // If a file is provided, upload it
            if (file != null && !file.isEmpty()) {
                applicationService.uploadFile(newApplication.getId(), file);
            }

            // Fetch the newly created application with full details to return
            Application createdAppWithDetails = applicationService.getApplicationById(newApplication.getId());

            // Map the Application entity to the DTO for the response
            ApplicationResponseDTO responseDTO = new ApplicationResponseDTO();
            responseDTO.setId(createdAppWithDetails.getId());
            responseDTO.setStatus(createdAppWithDetails.getStatus().toString());
            responseDTO.setPersonalStatement(createdAppWithDetails.getPersonalStatement());
            responseDTO.setUploadedFilePath(createdAppWithDetails.getUploadedFilePath());

            // Map related entities to their DTOs
            if (createdAppWithDetails.getProgram() != null) {
                ProgramDTO programDTO = new ProgramDTO();
                programDTO.setId(createdAppWithDetails.getProgram().getId());
                programDTO.setName(createdAppWithDetails.getProgram().getName());
                
                if (createdAppWithDetails.getProgram().getUniversity() != null) {
                    UniversityDTO universityDTO = new UniversityDTO();
                    universityDTO.setId(createdAppWithDetails.getProgram().getUniversity().getId());
                    universityDTO.setName(createdAppWithDetails.getProgram().getUniversity().getName());
                    universityDTO.setLocation(createdAppWithDetails.getProgram().getUniversity().getLocation());
                    universityDTO.setLogo(createdAppWithDetails.getProgram().getUniversity().getLogo());
                    programDTO.setUniversity(universityDTO);
                }
                responseDTO.setProgram(programDTO);
            }

            if (createdAppWithDetails.getStudent() != null) {
                StudentDTO studentDTO = new StudentDTO();
                studentDTO.setId(createdAppWithDetails.getStudent().getId());
                studentDTO.setFirstName(createdAppWithDetails.getStudent().getFirstName());
                studentDTO.setLastName(createdAppWithDetails.getStudent().getLastName());
                studentDTO.setEmail(createdAppWithDetails.getStudent().getEmail());
                responseDTO.setStudent(studentDTO);
            }

            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating application: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        ApplicationStatus status = ApplicationStatus.valueOf((String) request.get("status"));
        String feedback = (String) request.get("feedback");
        
        Application updatedApplication = applicationService.updateApplicationStatus(id, status, feedback);
        Map<String, Object> simplified = new HashMap<>();
        simplified.put("id", updatedApplication.getId());
        simplified.put("status", updatedApplication.getStatus());
        simplified.put("personalStatement", updatedApplication.getPersonalStatement());
        simplified.put("feedback", updatedApplication.getFeedback());
        simplified.put("uploadedFilePath", updatedApplication.getUploadedFilePath());
        simplified.put("studentId", updatedApplication.getStudent().getId());
        simplified.put("studentName", updatedApplication.getStudent().getFirstName() + " " + updatedApplication.getStudent().getLastName());
        simplified.put("programId", updatedApplication.getProgram().getId());
        simplified.put("programName", updatedApplication.getProgram().getName());
        simplified.put("universityId", updatedApplication.getProgram().getUniversity().getId());
        simplified.put("universityName", updatedApplication.getProgram().getUniversity().getName());
        return new ResponseEntity<>(simplified, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody Application applicationDetails) {
        Application updatedApplication = applicationService.updateApplication(id, applicationDetails);
        Map<String, Object> simplified = new HashMap<>();
        simplified.put("id", updatedApplication.getId());
        simplified.put("status", updatedApplication.getStatus());
        simplified.put("personalStatement", updatedApplication.getPersonalStatement());
        simplified.put("feedback", updatedApplication.getFeedback());
        simplified.put("uploadedFilePath", updatedApplication.getUploadedFilePath());
        simplified.put("studentId", updatedApplication.getStudent().getId());
        simplified.put("studentName", updatedApplication.getStudent().getFirstName() + " " + updatedApplication.getStudent().getLastName());
        simplified.put("programId", updatedApplication.getProgram().getId());
        simplified.put("programName", updatedApplication.getProgram().getName());
        simplified.put("universityId", updatedApplication.getProgram().getUniversity().getId());
        simplified.put("universityName", updatedApplication.getProgram().getUniversity().getName());
        return new ResponseEntity<>(simplified, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{applicationId}/upload")
    public ResponseEntity<?> uploadFile(
            @PathVariable Long applicationId,
            @RequestParam("file") MultipartFile file) {
        try {
            applicationService.uploadFile(applicationId, file);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "File uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
             Map<String, Object> error = new HashMap<>();
             error.put("error", "Upload failed: Application not found with id " + applicationId);
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (IOException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Upload failed: Could not save file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
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
