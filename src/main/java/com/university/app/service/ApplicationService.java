package com.university.app.service;

import com.university.app.model.Application;
import com.university.app.model.ApplicationStatus;
import com.university.app.model.Program;
import com.university.app.model.Student;
import com.university.app.repository.ApplicationRepository;
import com.university.app.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ApplicationService {

    @Value("${app.upload.dir:./uploads}") // Define base upload directory, default to ./uploads
    private String baseUploadDir;

    private final ApplicationRepository applicationRepository;
    private final StudentService studentService;
    private final ProgramService programService;

    @Autowired
    public ApplicationService(
            ApplicationRepository applicationRepository,
            StudentService studentService,
            ProgramService programService) {
        this.applicationRepository = applicationRepository;
        this.studentService = studentService;
        this.programService = programService;
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }

    public List<Application> getApplicationsByStudentId(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> getApplicationsByUniversityId(Long universityId) {
        return applicationRepository.findByProgramUniversityId(universityId);
    }

    public List<Application> getApplicationsByStatus(ApplicationStatus status) {
        return applicationRepository.findByStatus(status);
    }

    public List<Application> getApplicationsByProgramId(Long programId) {
        return applicationRepository.findByProgramId(programId);
    }

    public Application createApplication(Long studentId, Long programId, String personalStatement) {
        Student student = studentService.getStudentById(studentId);
        Program program = programService.getProgramById(programId);
        
        Application application = new Application();
        application.setStudent(student);
        application.setProgram(program);
        application.setUniversity(program.getUniversity());
        application.setPersonalStatement(personalStatement);
        application.setStatus(ApplicationStatus.PENDING);
        
        // Set submission and last updated dates to the current time
        application.setSubmissionDate(java.time.LocalDateTime.now());
        application.setLastUpdated(java.time.LocalDateTime.now());
        
        return applicationRepository.save(application);
    }

    public Application updateApplicationStatus(Long id, ApplicationStatus status, String feedback) {
        Application application = getApplicationById(id);
        application.setStatus(status);
        application.setFeedback(feedback);
        application.setLastUpdated(LocalDateTime.now());
        
        return applicationRepository.save(application);
    }

    public Application updateApplication(Long id, Application applicationDetails) {
        Application application = getApplicationById(id);
        
        application.setPersonalStatement(applicationDetails.getPersonalStatement());
        application.setLastUpdated(LocalDateTime.now());
        
        return applicationRepository.save(application);
    }

    public void deleteApplication(Long id) {
        Application application = getApplicationById(id);
        applicationRepository.delete(application);
    }

    public long countApplications() {
        return applicationRepository.count();
    }

    public long countApplicationsByStatus(String status) {
        return applicationRepository.countByStatus(ApplicationStatus.valueOf(status));
    }

    public void uploadFile(Long applicationId, MultipartFile file) throws IOException {
        // Fetch the application by ID to ensure we have the latest entity state
        Application application = getApplicationById(applicationId);

        // Get the application's current working directory
        String currentWorkingDir = System.getProperty("user.dir");
        
        // Define the base upload directory (relative to the working directory)
        String baseUploadDirName = "uploads"; 

        // Construct the full upload directory path
        String uploadDir = Paths.get(currentWorkingDir, baseUploadDirName, "applications", applicationId.toString()).toString();
        Path uploadPath = Paths.get(uploadDir);
        
        // Create the directory if it doesn't exist
        if (!java.nio.file.Files.exists(uploadPath)) {
            java.nio.file.Files.createDirectories(uploadPath);
        }
        
        // Generate a unique filename or use the original filename
        String fileName = file.getOriginalFilename();
        // Sanitize filename to avoid issues (optional but recommended)
        fileName = fileName.replaceAll("[^a-zA-Z0-9.-]", "_");
        
        Path filePath = uploadPath.resolve(fileName);
        
        // Transfer the file to the target location
        file.transferTo(filePath.toFile());

        // Store the file path relative to the base upload directory in the database
        application.setUploadedFilePath(baseUploadDirName + "/applications/" + applicationId + "/" + fileName);
        
        // Save the updated application entity
        applicationRepository.save(application);
    }

}
