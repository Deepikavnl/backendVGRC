package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.request.CreateFindingRequest;
import com.tspmquestionmaster.dto.response.FindingResponse;
import com.tspmquestionmaster.service.FindingService;


import lombok.RequiredArgsConstructor;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;



@RestController
@RequestMapping("/api/findings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FindingController {



    private final FindingService findingService;



    /*
        Create new finding
    */
    @PostMapping
    public ResponseEntity<FindingResponse> createFinding(
            @RequestBody CreateFindingRequest request
    ){

        return new ResponseEntity<>(
                findingService.createFinding(request),
                HttpStatus.CREATED
        );

    }





    /*
        Get all findings
    */
    @GetMapping
    public ResponseEntity<List<FindingResponse>> getAllFindings(){


        return ResponseEntity.ok(
                findingService.getAllFindings()
        );

    }





    /*
        Get finding by id
    */
    @GetMapping("/{id}")
    public ResponseEntity<FindingResponse> getFindingById(
            @PathVariable Long id
    ){


        return ResponseEntity.ok(
                findingService.getFindingById(id)
        );

    }





    /*
        Update finding status
        Example:
        OPEN
        IN_REMEDIATION
        RESOLVED
        ACCEPTED_RISK
    */
    @PutMapping("/{id}/status")
    public ResponseEntity<FindingResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ){


        return ResponseEntity.ok(
                findingService.updateStatus(
                        id,
                        status
                )
        );

    }


}