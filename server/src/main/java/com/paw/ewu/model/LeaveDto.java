package com.paw.ewu.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveDto {
    private Long id;
    private String employeeUid;
    private LocalDate startDate;
    private LocalDate endDate;
    private String type;
    private String status;
    private String description;
    private LocalDateTime createdAt;
}
