package com.university.app.repository;

import com.university.app.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    List<University> findByNameContainingIgnoreCase(String name);
}
