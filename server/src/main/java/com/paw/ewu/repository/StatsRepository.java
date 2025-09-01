package com.paw.ewu.repository;

import com.paw.ewu.entity.Employee;
import com.paw.ewu.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StatsRepository extends JpaRepository<Employee, Long> {
    @Query("SELECT e.leaveDaysAvailable FROM Employee e WHERE e.uid = :uid")
    long findLeaveDaysAvailableByUid(String uid);

    @Query("SELECT COUNT(l) FROM Leave l INNER JOIN Employee e ON l.employeeUid = e.uid WHERE e.managerUid = :uid AND l.status = :status")
    long countLeavesByStatus(String uid, String status);

    @Query("SELECT l FROM Leave l " +
            "INNER JOIN Employee e ON l.employeeUid = e.uid " +
            "WHERE l.startDate BETWEEN :startDate AND :endDate AND l.status = 'APPROVED' AND (:uid IS NULL OR l.employeeUid = :uid OR e.managerUid = :uid) " +
            "ORDER BY l.startDate")
    List<Leave> findUpcomingLeaves(LocalDate startDate, LocalDate endDate, String uid);
}
