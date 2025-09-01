package com.paw.ewu.controller;

import com.paw.ewu.model.EmployeeDto;
import com.paw.ewu.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path="/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping("")
    public List<EmployeeDto> getEmployees(
            @RequestParam(required = false) String uid,
            @RequestParam(required = false) String managerId,
            @RequestParam(required = false) String role) {
        if (uid != null) {
            EmployeeDto employee = employeeService.getEmployeeByUid(uid);
            return List.of(employee);
        } else if (managerId != null) {
            return employeeService.findByManagerId(managerId);
        } else if (role != null) {
            return employeeService.findByRole(role);
        } else
            return employeeService.getEmployees();
    }

    @PostMapping("")
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeDto employeeDto) {
        employeeService.addEmployee(employeeDto);
        return ResponseEntity.status(201).body(employeeDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDto employeeDto) {
        employeeService.updateEmployee(id, employeeDto);
        return ResponseEntity.ok(employeeDto);
    }
}
