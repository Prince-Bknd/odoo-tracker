package com.project.tracker.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceTeamDTO {
    private Long id;
    private String name;
    private String description;
    private List<String> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
