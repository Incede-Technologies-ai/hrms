package com.hrapp.service;

import com.hrapp.model.Asset;
import com.hrapp.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    public Asset saveOrUpdateAsset(Asset asset) {
        if (asset.getId() != null) {
            // Update existing asset
            Optional<Asset> existingAsset = assetRepository.findById(asset.getId());
            if (existingAsset.isPresent()) {
                Asset updatedAsset = existingAsset.get();
                updatedAsset.setAssetId(asset.getAssetId());
                updatedAsset.setAssetType(asset.getAssetType());
                updatedAsset.setAssetSpecification(asset.getAssetSpecification());
                updatedAsset.setAssetSerialNo(asset.getAssetSerialNo());
                updatedAsset.setRemarks(asset.getRemarks());
                return assetRepository.save(updatedAsset);
            } else {
                throw new RuntimeException("Asset with ID " + asset.getId() + " not found.");
            }
        } else {
            // Create new asset
            return assetRepository.save(asset);
        }
    }
    
    public void updateAssetStatus(String assetId, Map<String, Object> payload) {
        // Convert status safely
        Integer newStatus;
        try {
            newStatus = Integer.parseInt(payload.get("status").toString()); // Ensure correct type
        } catch (NumberFormatException | NullPointerException e) {
            throw new RuntimeException("Invalid status value");
        }

        // Get remarks, allowing null values
        String newRemarks = (payload.get("remarks") != null) ? payload.get("remarks").toString() : null;

        // Fetch asset
        Asset asset = assetRepository.findByAssetId(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        // Update asset details
        asset.setStatus(newStatus);

        // Only update remarks if provided
        if (newRemarks != null && !newRemarks.trim().isEmpty()) {
            asset.setRemarks(newRemarks);
        }

        assetRepository.save(asset);
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Asset updateAsset(String assetId, Asset updatedAsset) {
        Optional<Asset> existingAssetOptional = assetRepository.findByAssetId(assetId);

        if (existingAssetOptional.isPresent()) {
            Asset existingAsset = existingAssetOptional.get();
            // Update the fields of the existing asset
            existingAsset.setAssetType(updatedAsset.getAssetType());
            existingAsset.setAssetSpecification(updatedAsset.getAssetSpecification());
            existingAsset.setAssetSerialNo(updatedAsset.getAssetSerialNo());
            existingAsset.setRemarks(updatedAsset.getRemarks());
            // Save the updated asset
            return assetRepository.save(existingAsset);
        } else {
            throw new RuntimeException("Asset with ID " + assetId + " not found");
        }
    }

    public Optional<Asset> getAssetByAssetId(String assetId) {
        return assetRepository.findByAssetId(assetId);
    }
    
    public List<Asset> getAvailableAssets() {
        return assetRepository.findAllAvailableAssets();
    }
}
