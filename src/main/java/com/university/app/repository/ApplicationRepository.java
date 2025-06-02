package com.university.app.repository;

import com.university.app.model.Application;
import com.university.app.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByProgramUniversityId(Long universityId);
    List<Application> findByStatus(ApplicationStatus status);
    List<Application> findByProgramId(Long programId);
    long countByStatus(ApplicationStatus status);
}
