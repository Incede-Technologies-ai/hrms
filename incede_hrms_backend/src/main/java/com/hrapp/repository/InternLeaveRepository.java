package com.hrapp.repository;



import com.hrapp.model.InternLeaveTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternLeaveRepository extends JpaRepository<InternLeaveTransaction, Long> {
    List<InternLeaveTransaction> findByInternId(String internId);
}

