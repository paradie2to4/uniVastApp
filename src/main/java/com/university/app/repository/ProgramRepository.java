package com.university.app.repository;

import com.university.app.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByUniversityId(Long universityId);
    List<Program> findByNameContainingIgnoreCase(String name);
    List<Program> findByDegreeContainingIgnoreCase(String degree);

}
