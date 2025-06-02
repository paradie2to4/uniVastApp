package com.university.app.controller;

import com.university.app.model.Program;
import com.university.app.service.ProgramService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
<<<<<<< HEAD
=======
import org.springframework.http.MediaType;
>>>>>>> 47f4fab (Updated with new features)
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
<<<<<<< HEAD

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // In production, restrict this to your frontend domain
=======
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Updated to match frontend origin
>>>>>>> 47f4fab (Updated with new features)
public class ProgramController {

    private final ProgramService programService;

    @Autowired
    public ProgramController(ProgramService programService) {
        this.programService = programService;
    }

    // Endpoint to fetch all programs
    @GetMapping("/programs")
<<<<<<< HEAD
    public ResponseEntity<List<Program>> getAllPrograms() {
        List<Program> programs = programService.getAllPrograms();
        return new ResponseEntity<>(programs, HttpStatus.OK);
=======
    public ResponseEntity<?> getAllPrograms() {
        List<Program> programs = programService.getAllPrograms();
        List<Map<String, Object>> simplifiedPrograms = programs.stream()
            .map(program -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", program.getId());
                simplified.put("name", program.getName());
                simplified.put("description", program.getDescription());
                simplified.put("degree", program.getDegree());
                simplified.put("requirements", program.getRequirements());
                simplified.put("duration", program.getDuration());
                simplified.put("tuitionFee", program.getTuitionFee());
                
                // Add university information
                if (program.getUniversity() != null) {
                    Map<String, Object> universityInfo = new HashMap<>();
                    universityInfo.put("id", program.getUniversity().getId());
                    universityInfo.put("name", program.getUniversity().getName());
                    universityInfo.put("location", program.getUniversity().getLocation());
                    universityInfo.put("logo", program.getUniversity().getLogo());
                    simplified.put("university", universityInfo);
                }
                
                return simplified;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(simplifiedPrograms);
>>>>>>> 47f4fab (Updated with new features)
    }

    // Endpoint to fetch programs by university ID
    @GetMapping("/universities/{universityId}/programs")
<<<<<<< HEAD
    public ResponseEntity<List<Program>> getProgramsByUniversityId(@PathVariable Long universityId) {
        List<Program> programs = programService.getProgramsByUniversityId(universityId);
        return new ResponseEntity<>(programs, HttpStatus.OK);
=======
    public ResponseEntity<?> getProgramsByUniversityId(@PathVariable Long universityId) {
        List<Program> programs = programService.getProgramsByUniversityId(universityId);
        List<Map<String, Object>> simplifiedPrograms = programs.stream()
            .map(program -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", program.getId());
                simplified.put("name", program.getName());
                simplified.put("description", program.getDescription());
                simplified.put("degree", program.getDegree());
                simplified.put("requirements", program.getRequirements());
                simplified.put("duration", program.getDuration());
                simplified.put("tuitionFee", program.getTuitionFee());
                
                // Add university information (including location)
                if (program.getUniversity() != null) {
                    Map<String, Object> universityInfo = new HashMap<>();
                    universityInfo.put("id", program.getUniversity().getId());
                    universityInfo.put("name", program.getUniversity().getName());
                    universityInfo.put("location", program.getUniversity().getLocation());
                    universityInfo.put("logo", program.getUniversity().getLogo());
                    simplified.put("university", universityInfo);
                }
                
                return simplified;
            })
            .collect(Collectors.toList());
        return new ResponseEntity<>(simplifiedPrograms, HttpStatus.OK);
>>>>>>> 47f4fab (Updated with new features)
    }

    // Endpoint to fetch a specific program by its ID
    @GetMapping("/programs/{id}")
<<<<<<< HEAD
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
=======
    public ResponseEntity<?> getProgramById(@PathVariable Long id) {
        Program program = programService.getProgramById(id);
        Map<String, Object> simplified = new HashMap<>();
        simplified.put("id", program.getId());
        simplified.put("name", program.getName());
        simplified.put("description", program.getDescription());
        simplified.put("degree", program.getDegree());
        simplified.put("requirements", program.getRequirements());
        simplified.put("duration", program.getDuration());
        simplified.put("tuitionFee", program.getTuitionFee());
        simplified.put("universityId", program.getUniversity().getId());
        simplified.put("universityName", program.getUniversity().getName());
        return ResponseEntity.ok(simplified);
    }

    // POST endpoint to create a new program under a specific university
    @PostMapping(value = "/universities/{universityId}/programs", 
                consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE},
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createProgram(
            @PathVariable Long universityId,
            @Valid @ModelAttribute Program program) {
        Program newProgram = programService.createProgram(universityId, program);
        Map<String, Object> simplified = new HashMap<>();
        simplified.put("id", newProgram.getId());
        simplified.put("name", newProgram.getName());
        simplified.put("description", newProgram.getDescription());
        simplified.put("degree", newProgram.getDegree());
        simplified.put("requirements", newProgram.getRequirements());
        simplified.put("duration", newProgram.getDuration());
        simplified.put("tuitionFee", newProgram.getTuitionFee());
        simplified.put("universityId", newProgram.getUniversity().getId());
        simplified.put("universityName", newProgram.getUniversity().getName());
        return new ResponseEntity<>(simplified, HttpStatus.CREATED);
    }

    // PUT endpoint to update a program's details by ID
    @PutMapping(value = "/programs/{id}",
                consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE},
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateProgram(
            @PathVariable Long id,
            @Valid @ModelAttribute Program programDetails) {
        Program updatedProgram = programService.updateProgram(id, programDetails);
        Map<String, Object> simplified = new HashMap<>();
        simplified.put("id", updatedProgram.getId());
        simplified.put("name", updatedProgram.getName());
        simplified.put("description", updatedProgram.getDescription());
        simplified.put("degree", updatedProgram.getDegree());
        simplified.put("requirements", updatedProgram.getRequirements());
        simplified.put("duration", updatedProgram.getDuration());
        simplified.put("tuitionFee", updatedProgram.getTuitionFee());
        simplified.put("universityId", updatedProgram.getUniversity().getId());
        simplified.put("universityName", updatedProgram.getUniversity().getName());
        return new ResponseEntity<>(simplified, HttpStatus.OK);
>>>>>>> 47f4fab (Updated with new features)
    }

    // DELETE endpoint to remove a program by its ID
    @DeleteMapping("/programs/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        programService.deleteProgram(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
