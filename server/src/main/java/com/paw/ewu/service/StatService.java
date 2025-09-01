package com.paw.ewu.service;

import com.paw.ewu.entity.Leave;
import com.paw.ewu.model.StatsDto;
import com.paw.ewu.model.LeaveDto;
import com.paw.ewu.repository.StatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatService {
    private final StatsRepository dashboardRepository;

    public StatsDto getStats(String uid) {
        try{
            //Liczba dni urlopu dostępnych
            Long daysAvailable = dashboardRepository.findLeaveDaysAvailableByUid(uid);
            //Liczba wniosków o urlop oczekujących na decyzję
            Long pendingLeavesCount = dashboardRepository.countLeavesByStatus(uid, "PENDING");
            //Nadchodzące urlopy w ciągu najbliższych 30 dni
            List<LeaveDto> upcomingLeaves = dashboardRepository.findUpcomingLeaves(LocalDate.now(), LocalDate.now().plusDays(30), uid)
                    .stream()
                    .map(this::mapToLeaveDto)
                    .collect(Collectors.toList());

            StatsDto stats = new StatsDto();
            stats.setLeaveDaysAvailable(daysAvailable);
            stats.setPendingLeaves(pendingLeavesCount);
            stats.setUpcomingLeaves(upcomingLeaves);

            return stats;
        }
        catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }
    private LeaveDto mapToLeaveDto(Leave leave) {
        LeaveDto leaveDto = new LeaveDto();
        leaveDto.setId(leave.getId());
        leaveDto.setEmployeeUid(leave.getEmployeeUid());
        leaveDto.setStartDate(leave.getStartDate());
        leaveDto.setEndDate(leave.getEndDate());
        leaveDto.setType(leave.getType());
        leaveDto.setStatus(leave.getStatus());
        leaveDto.setDescription(leave.getDescription());
        return leaveDto;
    }
}
