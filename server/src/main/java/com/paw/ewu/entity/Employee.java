package com.paw.ewu.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uid", unique = true)
    private String uid;

    @Column (name = "first_name")
    private String firstName;

    @Column (name = "last_name")
    private String lastName;

    @Column (name = "email", unique = true)
    private String email;

    @Column (name = "phone_number")
    private String phoneNumber;

    @Column (name = "position")
    private String position;

    @Column (name = "department_id")
    private Long departmentId;

    @Column (name = "manager_uid")
    private String managerUid;

    @Column (name = "employment_date")
    private Date employmentDate;

    @Column (name = "role")
    private String role;

    @Column (name = "leave_days_available")
    private Long leaveDaysAvailable;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

