package com.hrapp.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hrapp.model.Interns;
import com.hrapp.repository.InternRepository;

import java.util.List;
import java.util.Optional;
import java.util.function.LongSupplier;

@Service
public class InternService {

    @Autowired
    private InternRepository internRepository;

    public List<Interns> getAllInterns() {
        return internRepository.findAll();
    }

    public Optional<Interns> getInternById(String internId) {
        return internRepository.findByInternId(internId);
    }

    public Interns addIntern(Interns intern) {
        return internRepository.save(intern);
    }

    // public Interns updateIntern(String internId, Interns updatedIntern) {
    //     return internRepository.findByInternId(internId)
    //             .map(existingIntern -> {
    //                 existingIntern.setFullName(updatedIntern.getFullName());
    //                 existingIntern.setDepartment(updatedIntern.getDepartment());
    //                 existingIntern.setStatus(updatedIntern.getStatus());
    //                 existingIntern.setJoiningDate(updatedIntern.getJoiningDate());
    //                 existingIntern.setEmail(updatedIntern.getEmail());
    //                 existingIntern.setContactNo(updatedIntern.getContactNo());
    //                 return internRepository.save(existingIntern);
    //             }).orElseThrow(() -> new RuntimeException("Intern not found"));
    // }


    public Interns updateIntern(Long id, Interns updatedIntern) {
        return internRepository.findById(id).map(existingIntern -> {
            existingIntern.setInternId(updatedIntern.getInternId());
            existingIntern.setFullName(updatedIntern.getFullName());
            existingIntern.setDepartment(updatedIntern.getDepartment());
            existingIntern.setStatus(updatedIntern.getStatus());
            existingIntern.setJoiningDate(updatedIntern.getJoiningDate());
            existingIntern.setBirthDate(updatedIntern.getBirthDate());
            existingIntern.setEmail(updatedIntern.getEmail());
            existingIntern.setContactNo(updatedIntern.getContactNo());
            return internRepository.save(existingIntern);
        }).orElseThrow(() -> new RuntimeException("Intern not found"));
    }
    

    public void deleteIntern(Long id) {
        internRepository.findById(id).ifPresent(intern -> {
            intern.setPresence(1); // Mark presence as 1 instead of deleting
            internRepository.save(intern);
        });
    }
    

    public void markAttendance(String internId, boolean isPresent) {
        internRepository.findByInternId(internId).ifPresent(intern -> {
            if (isPresent) {
                intern.setPresence(intern.getPresence() + 1);
            } else {
                intern.setLopCount(intern.getLopCount() + 1);
            }
            internRepository.save(intern);
        });
    }
}
