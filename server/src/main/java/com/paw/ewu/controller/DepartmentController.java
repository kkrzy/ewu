package com.paw.ewu.controller;

import com.paw.ewu.model.DepartmentDto;
import com.paw.ewu.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path="/departments")
public class DepartmentController {
    @Autowired
    private DepartmentService departmentService;

    @GetMapping("")
    public List<DepartmentDto> getDepartments() {
        return departmentService.getDepartments();
    }
}
