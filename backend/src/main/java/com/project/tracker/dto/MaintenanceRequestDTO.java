package com.project.tracker.dto;

import com.project.tracker.entity.MaintenanceRequest.RequestStatus;
import com.project.tracker.entity.MaintenanceRequest.RequestType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequestDTO {
    private Long id;
    private String subject;
    private RequestType type;
    private RequestStatus status;
    private Long equipmentId;
    private String equipmentName;
    private Boolean equipmentScrapped;
    private Long teamId;
    private String teamName;
    private String technician;
    private LocalDate scheduledDate;
    private BigDecimal durationHours;
    private String notes;
    private Boolean isOverdue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
