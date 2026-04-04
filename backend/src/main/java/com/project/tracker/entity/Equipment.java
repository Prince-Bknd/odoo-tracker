package com.project.tracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String serialNumber;

    @Column(length = 100)
    private String category;

    @Column(length = 150)
    private String department;

    @Column(length = 200)
    private String employeeName;

    @Column(length = 200)
    private String location;

    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private MaintenanceTeam team;

    @Column(length = 150)
    private String technicianDefault;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isScrapped = false;

    @Column(columnDefinition = "TEXT")
    private String scrapNote;

    private LocalDateTime scrappedAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
