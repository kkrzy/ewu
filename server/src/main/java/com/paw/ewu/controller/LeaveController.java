package com.paw.ewu.controller;

import com.paw.ewu.model.LeaveDto;
import com.paw.ewu.service.LeaveService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path="/leaves")
public class LeaveController {
    @Autowired
    private LeaveService leaveService;

    @GetMapping("/{id}")
    public ResponseEntity<LeaveDto> getLeaveById(@PathVariable Long id) {
        LeaveDto leave = leaveService.getLeaveById(id);
        return ResponseEntity.ok(leave);
    }

    @GetMapping("")
    public List<LeaveDto> getLeaves(
            @RequestParam(required = false) String managerId,
            @RequestParam(required = false) String employeeId) {
        if (managerId != null) {
            return leaveService.findByManagerId(managerId);
        } else if (employeeId != null) {
            return leaveService.findByEmployeeId(employeeId);
        }
        return List.of();
    }

    @PostMapping("")
    public ResponseEntity<?> addLeave(@RequestBody LeaveDto leaveDto) {
        leaveService.addLeave(leaveDto);
        return ResponseEntity.status(201).body(leaveDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLeave(@PathVariable Long id, @RequestBody LeaveDto leaveDto) {
        leaveDto.setId(id);
        leaveService.addLeave(leaveDto);
        return ResponseEntity.ok(leaveDto);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLeaveStatus(@PathVariable Long id, @RequestBody StatusRequest status) {
        if (status == null || status.getStatus() == null) {
            return ResponseEntity.badRequest().body("Status nie może być pusty");
        }
        LeaveDto leaveDto = leaveService.getLeaveById(id);
        leaveDto.setStatus(status.getStatus());
        leaveService.addLeave(leaveDto);
        return ResponseEntity.ok(leaveDto);
    }
    @Getter
    public static class StatusRequest {
        private String status;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLeave(@PathVariable Long id) {
        leaveService.deleteLeave(id);
        return ResponseEntity.noContent().build();
    }
}
