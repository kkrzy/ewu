package com.paw.ewu.repository;

import com.paw.ewu.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Query("SELECT e.leaveDaysAvailable FROM Employee e WHERE e.uid = :uid")
    long findLeaveDaysAvailableByUid(String uid);

    @Modifying
    @Query("UPDATE Employee e SET e.leaveDaysAvailable = e.leaveDaysAvailable - :days WHERE e.uid = :uid")
    void decreaseLeaveDaysAvailable(String uid, Long days);

    @Modifying
    @Query("UPDATE Employee e SET e.leaveDaysAvailable = e.leaveDaysAvailable + :days WHERE e.uid = :uid")
    void increaseLeaveDaysAvailable(String uid, Long days);
}
