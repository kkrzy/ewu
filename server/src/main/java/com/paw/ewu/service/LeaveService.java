package com.paw.ewu.service;

import com.paw.ewu.entity.Leave;
import com.paw.ewu.exception.LeaveNotFoundException;
import com.paw.ewu.exception.LeaveValidationException;
import com.paw.ewu.model.LeaveDto;
import com.paw.ewu.repository.EmployeeRepository;
import com.paw.ewu.repository.LeaveRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveService {
    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveDto getLeaveById(Long id) {
        return leaveRepository.findById(id)
                .map(this::mapLeaveDto)
                .orElseThrow(() -> new LeaveNotFoundException("Nie znaleziono wniosku o id: " + id));
    }
    public List<LeaveDto> findByEmployeeId(String employeeId) {
        return leaveRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::mapLeaveDto)
                .collect(Collectors.toList());
    }
    public List<LeaveDto> findByManagerId(String managerId) {
        return leaveRepository.findByManagerId(managerId)
                .stream()
                .map(this::mapLeaveDto)
                .collect(Collectors.toList());
    }
    private LeaveDto mapLeaveDto(Leave leave) {
        LeaveDto leaveDto = new LeaveDto();
        leaveDto.setId(leave.getId());
        leaveDto.setEmployeeUid(leave.getEmployeeUid());
        leaveDto.setStartDate(leave.getStartDate());
        leaveDto.setEndDate(leave.getEndDate());
        leaveDto.setType(leave.getType());
        leaveDto.setStatus(leave.getStatus());
        leaveDto.setDescription(leave.getDescription());
        leaveDto.setCreatedAt(leave.getCreatedAt());
        return leaveDto;
    }
    public void addLeave(LeaveDto leaveDto) {
        Leave leave;
        boolean isNew = leaveDto.getId() == null;
        Leave oldLeave = null;

        // Jeśli istniejący wniosek
        if (!isNew) {
            oldLeave = leaveRepository.findById(leaveDto.getId())
                    .orElseThrow(() -> new LeaveNotFoundException("Nie znaleziono wniosku o id: " + leaveDto.getId()));
            leave = oldLeave;

            // Jeśli zmieniono status na APPROVED ze statusu PENDING
            if (leaveDto.getStatus().equals("APPROVED") && oldLeave.getStatus().equals("PENDING")) {
                // Sprawdzenie dostępnych dni przed zatwierdzeniem
                checkAvailableDays(leaveDto);
                // Zmniejszenie dostępnych dni
                long days = getWorkingDaysBetween(oldLeave.getStartDate(), oldLeave.getEndDate());
                employeeRepository.decreaseLeaveDaysAvailable(leaveDto.getEmployeeUid(), days);
            }
            // Jeśli zmieniono status na REJECTED lub APPROVED
            if (leaveDto.getStatus().equals("APPROVED") || leaveDto.getStatus().equals("REJECTED")) {
                updateLeaveFields(leave, leaveDto);
                leaveRepository.save(leave);
                return;
            }
        } else { // Nowy wniosek lub edycja wniosku bez zmiany statusu
            leave = new Leave();
        }

        // Walidacje
        Long leaveId = leaveDto.getId() != null ? leaveDto.getId() : 0L;
        // Sprawdzenie pokrywania się urlopów
        checkOverlappingLeave(leaveDto, leaveId);
        // Sprawdzenie dostępnych dni jeśli status wniosku to APPROVED
        if (leaveDto.getStatus() != null && leaveDto.getStatus().equals("APPROVED")) {
            checkAvailableDays(leaveDto);
        }

        updateLeaveFields(leave, leaveDto);
        leaveRepository.save(leave);
    }

    private void updateLeaveFields(Leave leave, LeaveDto leaveDto) {
        leave.setEmployeeUid(leaveDto.getEmployeeUid());
        leave.setStartDate(leaveDto.getStartDate());
        leave.setEndDate(leaveDto.getEndDate());
        leave.setType(leaveDto.getType());
        leave.setStatus(leaveDto.getStatus());
        leave.setDescription(leaveDto.getDescription());
    }

    private void checkOverlappingLeave(LeaveDto leaveDto, Long leaveId) {
        boolean overlap = leaveRepository.existsOverlappingLeave(
                leaveDto.getEmployeeUid(),
                leaveDto.getStartDate(),
                leaveDto.getEndDate(),
                leaveId
        );
        if (overlap) {
            throw new LeaveValidationException("Wniosek urlopowy pokrywa się z istniejącym urlopem");
        }
    }

    private void checkAvailableDays(LeaveDto leaveDto) {
        long availableDays = employeeRepository.findLeaveDaysAvailableByUid(leaveDto.getEmployeeUid());
        long requestedDays = getWorkingDaysBetween(leaveDto.getStartDate(), leaveDto.getEndDate());

        if (requestedDays > availableDays) {
            throw new LeaveValidationException(
                    String.format("Przekroczono limit dni urlopu. Dostępne: %d, wnioskowane: %d",
                            availableDays, requestedDays));
        }
    }

    public void deleteLeave(Long id) {
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono wniosku z id: " + id));
        if (leave.getStatus().equals("APPROVED")) {
            long days = getWorkingDaysBetween(leave.getStartDate(), leave.getEndDate());
            employeeRepository.increaseLeaveDaysAvailable(leave.getEmployeeUid(), days);
        }
        leaveRepository.deleteById(id);
    }

    private long getWorkingDaysBetween(LocalDate startDate, LocalDate endDate) {
        long totalDays = 0L;
        LocalDate date = startDate;

        while (!date.isAfter(endDate)) {
            if (date.getDayOfWeek() != DayOfWeek.SATURDAY && date.getDayOfWeek() != DayOfWeek.SUNDAY) {
                totalDays++;
            }
            date = date.plusDays(1);
        }

        return totalDays;
    }
}
