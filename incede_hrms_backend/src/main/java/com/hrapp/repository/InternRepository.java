package com.hrapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrapp.model.Interns;

@Repository
public interface InternRepository extends JpaRepository<Interns, Long> {
    Optional<Interns> findByInternId(String internId); 
    List<Interns> findByPresence(Integer presence);
}