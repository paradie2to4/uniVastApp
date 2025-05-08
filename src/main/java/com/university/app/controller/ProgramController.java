package com.university.app.controller;

import com.university.app.model.Program;
import com.university.app.service.ProgramService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // In production, restrict this to your frontend domain
public class ProgramController {

    private final ProgramService programService;

    @Autowired
    public ProgramController(ProgramService programService) {
        this.programService = programService;
    }

    // Endpoint to fetch all programs
    @GetMapping("/programs")
    public ResponseEntity<List<Program>> getAllPrograms() {
        List<Program> programs = programService.getAllPrograms();
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }

    // Endpoint to fetch programs by university ID
    @GetMapping("/universities/{universityId}/programs")
    public ResponseEntity<List<Program>> getProgramsByUniversityId(@PathVariable Long universityId) {
        List<Program> programs = programService.getProgramsByUniversityId(universityId);
        return new ResponseEntity<>(programs, HttpStatus.OK);
    }

    // Endpoint to fetch a specific program by its ID
    @GetMapping("/programs/{id}")
    public ResponseEntity<Program> getProgramById(@PathVariable Long id) {
        Program program = programService.getProgramById(id);
        return new ResponseEntity<>(program, HttpStatus.OK);
    }

    // POST endpoint to create a new program under a specific university
    @PostMapping("/universities/{universityId}/programs")
    public ResponseEntity<Program> createProgram(
            @PathVariable Long universityId,
            @Valid @RequestBody Program program) {
        // Create a new program and associate it with the university
        Program newProgram = programService.createProgram(universityId, program);
        return new ResponseEntity<>(newProgram, HttpStatus.CREATED); // Respond with the newly created program
    }

    // PUT endpoint to update a program's details by ID
    @PutMapping("/programs/{id}")
    public ResponseEntity<Program> updateProgram(
            @PathVariable Long id,
            @Valid @RequestBody Program programDetails) {
        Program updatedProgram = programService.updateProgram(id, programDetails);
        return new ResponseEntity<>(updatedProgram, HttpStatus.OK);
    }

    // DELETE endpoint to remove a program by its ID
    @DeleteMapping("/programs/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        programService.deleteProgram(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
