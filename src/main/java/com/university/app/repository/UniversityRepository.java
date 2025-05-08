package com.university.app.repository;

import com.university.app.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    List<University> findByNameContainingIgnoreCase(String name);
    List<University> findByLocationContainingIgnoreCase(String location);
    Optional<University> findByUserId(Long userId);
}
