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

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

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
        application.setSubmissionDate(LocalDateTime.now());
        application.setLastUpdated(LocalDateTime.now());
        
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
    public String saveFile(Long applicationId, MultipartFile file) throws IOException {
        Application app = getApplicationById(applicationId);

        String uploadDir = "uploads/applications/" + applicationId;
        String filePath = uploadDir + "/" + file.getOriginalFilename();

        File directory = new File(uploadDir);
        if (!directory.exists()) directory.mkdirs();

        File destinationFile = new File(filePath);
        file.transferTo(destinationFile);

        app.setUploadedFilePath(filePath);
        applicationRepository.save(app);

        return filePath;
    }

}
