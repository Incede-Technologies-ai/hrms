package com.hrapp.repository;

import com.hrapp.model.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long> {

    List<AssetAssignment> findByAssetId(String assetId);
    List<AssetAssignment> findByUserId(String userId);
    Optional<AssetAssignment> findByAssetIdAndUserIdAndStatus(String assetId, String userId, int status);
    Optional<AssetAssignment> findTopByAssetIdAndStatusOrderByIssueDateDesc(String assetId, int status);
    List<AssetAssignment> findByUserIdAndStatus(String userId, int status);
	@Query("""
    SELECT a FROM AssetAssignment a
    WHERE a.userId = :userId 
    AND a.status = 4 
    AND a.id = (
        SELECT MAX(r.id) FROM AssetAssignment r 
        WHERE r.assetId = a.assetId 
        AND r.userId = a.userId 
    )
""")
List<AssetAssignment> findLatestActiveAssignments(@Param("userId") String userId);

}
