package com.paw.ewu.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDto {
    private Long leaveDaysAvailable;
    private Long pendingLeaves;
    private List<LeaveDto> upcomingLeaves;
}
