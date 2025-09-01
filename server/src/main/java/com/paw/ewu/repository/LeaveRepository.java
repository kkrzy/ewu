package com.paw.ewu.repository;

import com.paw.ewu.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    @Query("SELECT l " +
            "FROM Leave l " +
            "INNER JOIN Employee e ON l.employeeUid = e.uid " +
            "WHERE (:managerId IS NULL OR e.managerUid = :managerId) " +
            "ORDER BY l.startDate DESC")
    List<Leave> findByManagerId(String managerId);

    @Query("SELECT l FROM Leave l WHERE (:employeeId IS NULL OR l.employeeUid = :employeeId) ORDER BY l.startDate DESC")
    List<Leave> findByEmployeeId(String employeeId);

    @Query("SELECT COUNT(l) > 0 FROM Leave l " +
            "WHERE l.employeeUid = :employeeUid AND l.id <> :leaveId AND l.status != 'REJECTED' AND " +
            "(:startDate >= l.startDate AND :startDate <= l.endDate OR " +
            ":endDate >= l.startDate AND :endDate <= l.endDate OR " +
            ":startDate <= l.startDate AND :endDate >= l.endDate)")
    boolean existsOverlappingLeave(String employeeUid, LocalDate startDate, LocalDate endDate, Long leaveId);
}
