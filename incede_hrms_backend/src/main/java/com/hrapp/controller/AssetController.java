package com.hrapp.controller;

import com.hrapp.model.Asset;
import com.hrapp.service.AssetService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    @Autowired
    private AssetService assetService;

    @PostMapping("/save")
    @Operation(summary = "Save or update asset")
    public ResponseEntity<?> saveOrUpdateAsset(@RequestBody Asset asset) {
        try {
            Asset savedAsset = assetService.saveOrUpdateAsset(asset);
            return ResponseEntity.ok(Map.of("message", "Asset saved successfully", "asset", savedAsset));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{assetId}")
    @Operation(summary = "Update asset by ID")
public ResponseEntity<?> updateAsset(@PathVariable String assetId, @RequestBody Asset updatedAsset) {
    try {
        Asset asset = assetService.updateAsset(assetId, updatedAsset);
        return ResponseEntity.ok(Map.of("message", "Asset updated successfully", "asset", asset));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

    @GetMapping
    @Operation(summary = "Get all assets")
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/lookup/{assetId}")
    @Operation(summary = "Get asset by asset ID")
    public ResponseEntity<?> getAssetByAssetId(@PathVariable String assetId) {
        Optional<Asset> asset = assetService.getAssetByAssetId(assetId);
        if (asset.isPresent()) {
            return ResponseEntity.ok(asset.get());
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Asset not found"));
        }
    }
    
    @PutMapping("/{assetId}/update-status")
    @Operation(summary = "Update asset status and remarks")
    public ResponseEntity<String> updateAssetStatus(@PathVariable String assetId, @RequestBody Map<String, Object> payload) {
        try {
            assetService.updateAssetStatus(assetId, payload);
            return ResponseEntity.ok("Asset status and remarks updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    
    @GetMapping("/available")
    @Operation(summary = "Get all available assets")
    public ResponseEntity<List<Asset>> getAvailableAssets() {
        List<Asset> availableAssets = assetService.getAvailableAssets();
        return ResponseEntity.ok(availableAssets);
    }
}
