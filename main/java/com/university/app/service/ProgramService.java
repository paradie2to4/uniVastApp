package com.university.app.service;

import com.university.app.model.Program;
import com.university.app.model.University;
import com.university.app.repository.ProgramRepository;
import com.university.app.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgramService {

    private final ProgramRepository programRepository;
    private final UniversityService universityService;

    @Autowired
    public ProgramService(ProgramRepository programRepository, UniversityService universityService) {
        this.programRepository = programRepository;
        this.universityService = universityService;
    }

    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    public List<Program> getProgramsByUniversityId(Long universityId) {
        return programRepository.findByUniversityId(universityId);
    }

    public Program getProgramById(Long id) {
        return programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program not found with id: " + id));
    }

    public Program createProgram(Long universityId, Program program) {
        University university = universityService.getUniversityById(universityId);
        program.setUniversity(university);
        return programRepository.save(program);
    }

    public Program updateProgram(Long id, Program programDetails) {
        Program program = getProgramById(id);
        
        program.setName(programDetails.getName());
        program.setDescription(programDetails.getDescription());
        program.setDegree(programDetails.getDegree());
        program.setDuration(programDetails.getDuration());
        program.setTuitionFee(programDetails.getTuitionFee());
        
        return programRepository.save(program);
    }

    public void deleteProgram(Long id) {
        Program program = getProgramById(id);
        programRepository.delete(program);
    }
    public long countAll() {
        return programRepository.count();
    }
}
