package com.hrapp.service;


import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hrapp.model.InternLeaveTransaction;
import com.hrapp.model.Interns;
import com.hrapp.repository.InternLeaveRepository;
import com.hrapp.repository.InternRepository;

@Service
public class InternLeaveManagementService {

    @Autowired
    private InternLeaveRepository internLeaveRepository;

    @Autowired
    private InternRepository internrepository;

    

    public List<InternLeaveTransaction> getInternLeaves(String internId) {
        return internLeaveRepository.findByInternId(internId);
    }

    public InternLeaveTransaction applyInternLeave(String internId, String leaveType, LocalDate startDate, LocalDate endDate, 
                                                   int noOfLeaves, boolean isHalfDay, LocalDate leaveDate, String reason) {
        InternLeaveTransaction leave = new InternLeaveTransaction();
        leave.setInternId(internId);
        leave.setLeaveType(leaveType);
        leave.setStartDate(startDate);
        leave.setEndDate(endDate);
        leave.setLeaveDate(leaveDate);
        leave.setNoOfLeaves(noOfLeaves);
        leave.setHalfDay(isHalfDay);
        leave.setReason(reason);
        InternLeaveTransaction intern_Saved =  internLeaveRepository.save(leave);
        if(intern_Saved != null){
            update_intern_table(internId,noOfLeaves,isHalfDay);
        }
        return intern_Saved;
    }

    public void update_intern_table(String internId, int noOfLeaves, boolean isHalfDay) {
        Interns interns = internrepository.findByInternId(internId)
            .orElseThrow(() -> new RuntimeException("Intern not found with ID: " + internId));
    
        System.out.println("Intern Name: " + interns.getFullName());
        System.out.println("Intern Email: " + interns.getEmail());
    
        double lopCount = interns.getLopCount();
    
        // ✅ Update the LOP count (reduce only if it's not a half-day leave)
        if (!isHalfDay) {
            lopCount += noOfLeaves;
        } else {
            lopCount += 0.5; // Assuming half-day leaves count as 0.5
        }
    
        interns.setLopCount(lopCount);
        internrepository.save(interns);  // ✅ Save updated data
    
        System.out.println("LOP Updated Successfully: " + lopCount);
    }
    

}
