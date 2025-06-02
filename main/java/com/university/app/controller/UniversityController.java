package com.university.app.controller;

import com.university.app.model.University;
import com.university.app.service.UniversityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
@CrossOrigin(origins = "http://localhost:8080") // In production, restrict this to your frontend domain
public class UniversityController {

    private final UniversityService universityService;

    @Autowired
    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }

    @GetMapping
    public ResponseEntity<List<University>> getAllUniversities() {
        List<University> universities = universityService.getAllUniversities();
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<University> getUniversityById(@PathVariable Long id) {
        University university = universityService.getUniversityById(id);
        return new ResponseEntity<>(university, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<University>> searchUniversities(@RequestParam String query) {
        List<University> universities = universityService.searchUniversities(query);
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<University> createUniversity(@Valid @RequestBody University university) {
        University newUniversity = universityService.createUniversity(university);
        return new ResponseEntity<>(newUniversity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<University> updateUniversity(
            @PathVariable Long id,
            @Valid @RequestBody University universityDetails) {
        University updatedUniversity = universityService.updateUniversity(id, universityDetails);
        return new ResponseEntity<>(updatedUniversity, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        universityService.deleteUniversity(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
