package com.project.tracker.repository;

import com.project.tracker.entity.MaintenanceRequest;
import com.project.tracker.entity.MaintenanceRequest.RequestStatus;
import com.project.tracker.entity.MaintenanceRequest.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    List<MaintenanceRequest> findByEquipmentId(Long equipmentId);

    List<MaintenanceRequest> findByTeamId(Long teamId);

    List<MaintenanceRequest> findByStatus(RequestStatus status);

    List<MaintenanceRequest> findByType(RequestType type);

    /** Preventive requests within a date range — powers the Calendar view. */
    @Query("SELECT r FROM MaintenanceRequest r WHERE r.type = :type " +
            "AND r.scheduledDate BETWEEN :startDate AND :endDate")
    List<MaintenanceRequest> findPreventiveInDateRange(
            @Param("type") RequestType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /** Overdue: past scheduled date, still open. Uses enum param binding. */
    @Query("SELECT r FROM MaintenanceRequest r WHERE r.scheduledDate < :today " +
            "AND r.status IN :statuses")
    List<MaintenanceRequest> findOverdue(
            @Param("today") LocalDate today,
            @Param("statuses") List<RequestStatus> statuses);

    /** Count grouped by team name — for Reports bar chart. */
    @Query("SELECT r.team.name, COUNT(r) FROM MaintenanceRequest r " +
            "WHERE r.team IS NOT NULL GROUP BY r.team.name ORDER BY COUNT(r) DESC")
    List<Object[]> countByTeam();

    /** Count grouped by equipment category — for Reports bar chart. */
    @Query("SELECT r.equipment.category, COUNT(r) FROM MaintenanceRequest r " +
            "WHERE r.equipment IS NOT NULL AND r.equipment.category IS NOT NULL " +
            "GROUP BY r.equipment.category ORDER BY COUNT(r) DESC")
    List<Object[]> countByEquipmentCategory();
}
