package com.paw.ewu.service;

import com.paw.ewu.entity.Department;
import com.paw.ewu.model.DepartmentDto;
import com.paw.ewu.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public List<DepartmentDto> getDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(this::mapDepartmentDto)
                .collect(Collectors.toList());
    }

    private DepartmentDto mapDepartmentDto(Department department) {
        DepartmentDto departmentDto = new DepartmentDto();
        departmentDto.setId(department.getId());
        departmentDto.setDescription(department.getDescription());
        return departmentDto;
    }
}
