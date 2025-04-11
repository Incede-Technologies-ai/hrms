package com.hrapp.repository;




import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrapp.model.Interns;

import java.util.Optional;

@Repository
public interface InternRepository extends JpaRepository<Interns, Long> {
    Optional<Interns> findByInternId(String internId); // Keep for future use
}