package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.service.VendorService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VendorController {


    private final VendorService vendorService;



    @GetMapping
    public ResponseEntity<List<ThirdPartyEntity>> getAllVendors() {

        return ResponseEntity.ok(
                vendorService.getAllVendors()
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<ThirdPartyEntity> getVendorById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                vendorService.getVendorById(id)
        );
    }



    @PostMapping
    public ResponseEntity<ThirdPartyEntity> createVendor(
            @RequestBody ThirdPartyEntity vendor
    ) {

        return ResponseEntity.ok(
                vendorService.createVendor(vendor)
        );
    }



    @PutMapping("/{id}")
    public ResponseEntity<ThirdPartyEntity> updateVendor(
            @PathVariable Long id,
            @RequestBody ThirdPartyEntity vendor
    ) {

        return ResponseEntity.ok(
                vendorService.updateVendor(id, vendor)
        );
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(
            @PathVariable Long id
    ) {

        vendorService.deleteVendor(id);

        return ResponseEntity.noContent().build();
    }




    @GetMapping("/{entityId}/assessments")
    public ResponseEntity<List<VendorAssessmentResponse>> getVendorAssessments(
            @PathVariable Long entityId
    ) {

        return ResponseEntity.ok(
                vendorService.getVendorAssessments(entityId)
        );
    }



    @GetMapping("/{entityId}/history")
    public ResponseEntity<List<VendorAssessmentResponse>> getSubmissionHistory(
            @PathVariable Long entityId
    ) {

        return ResponseEntity.ok(
                vendorService.getSubmissionHistory(entityId)
        );
    }

}