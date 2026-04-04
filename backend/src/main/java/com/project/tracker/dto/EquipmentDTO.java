package com.project.tracker.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentDTO {
    private Long id;
    private String name;
    private String serialNumber;
    private String category;
    private String department;
    private String employeeName;
    private String location;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;
    private Long teamId;
    private String teamName;
    private String technicianDefault;
    private Boolean isScrapped;
    private String scrapNote;
    private LocalDateTime scrappedAt;
    private Long openRequestCount; // Smart Button badge
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
