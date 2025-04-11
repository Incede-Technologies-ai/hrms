package com.hrapp.repository;

import com.hrapp.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByAssetId(String assetId);
    
    @Query("SELECT a FROM Asset a WHERE a.status = 1")
    List<Asset> findAllAvailableAssets();
}
