package com.paw.ewu.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private Long id;
    private String uid;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String position;
    private Long departmentId;
    private String managerUid;
    private Date employmentDate;
    private String role;
    private Long leaveDaysAvailable;
}
