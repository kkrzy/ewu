package com.paw.ewu.service;

import com.paw.ewu.entity.Employee;
import com.paw.ewu.model.EmployeeDto;
import com.paw.ewu.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public List<EmployeeDto> getEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapEmployeeDto)
                .collect(Collectors.toList());
    }
    public List<EmployeeDto> findByManagerId(String managerId) {
        return employeeRepository.findAll().stream()
                .filter(employee -> managerId == null ||
                        managerId.equals(employee.getManagerUid()))
                .map(this::mapEmployeeDto)
                .collect(Collectors.toList());
    }
    public List<EmployeeDto> findByRole(String role) {
        return employeeRepository.findAll().stream()
                .filter(employee -> role == null ||
                        employee.getRole().equals(role))
                .map(this::mapEmployeeDto)
                .collect(Collectors.toList());
    }
    public EmployeeDto getEmployeeByUid(String uid) {
        return employeeRepository.findAll().stream()
                .filter(employee -> uid == null ||
                        employee.getUid().equals(uid))
                .map(this::mapEmployeeDto)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nie znaleziono pracownika z uid: " + uid));
    }

    private EmployeeDto mapEmployeeDto(Employee employee) {
        EmployeeDto employeeDto = new EmployeeDto();
        employeeDto.setId(employee.getId());
        employeeDto.setUid(employee.getUid());
        employeeDto.setFirstName(employee.getFirstName());
        employeeDto.setLastName(employee.getLastName());
        employeeDto.setEmail(employee.getEmail());
        employeeDto.setPhoneNumber(employee.getPhoneNumber());
        employeeDto.setPosition(employee.getPosition());
        employeeDto.setDepartmentId(employee.getDepartmentId());
        employeeDto.setManagerUid(employee.getManagerUid());
        employeeDto.setEmploymentDate(employee.getEmploymentDate());
        employeeDto.setRole(employee.getRole());
        employeeDto.setLeaveDaysAvailable(employee.getLeaveDaysAvailable());
        return employeeDto;
    }

    public void addEmployee(EmployeeDto employeeDto) {
        Employee employee = new Employee();
        employee.setUid(employeeDto.getUid());
        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setEmail(employeeDto.getEmail());
        employee.setPhoneNumber(employeeDto.getPhoneNumber());
        employee.setPosition(employeeDto.getPosition());
        employee.setDepartmentId(employeeDto.getDepartmentId());
        employee.setManagerUid(employeeDto.getManagerUid());
        employee.setEmploymentDate(employeeDto.getEmploymentDate());
        employee.setRole(employeeDto.getRole());
        employee.setLeaveDaysAvailable(employeeDto.getLeaveDaysAvailable());
        employeeRepository.save(employee);
    }

    public void updateEmployee(Long id, EmployeeDto employeeDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employee.setUid(employeeDto.getUid());
        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setEmail(employeeDto.getEmail());
        employee.setPhoneNumber(employeeDto.getPhoneNumber());
        employee.setPosition(employeeDto.getPosition());
        employee.setDepartmentId(employeeDto.getDepartmentId());
        employee.setManagerUid(employeeDto.getManagerUid());
        employee.setEmploymentDate(employeeDto.getEmploymentDate());
        employee.setRole(employeeDto.getRole());
        employee.setLeaveDaysAvailable(employeeDto.getLeaveDaysAvailable());
        employeeRepository.save(employee);
    }
}