package com.project.tracker.repository;

import com.project.tracker.entity.Equipment;
import com.project.tracker.entity.MaintenanceRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByDepartmentIgnoreCase(String department);

    List<Equipment> findByEmployeeNameIgnoreCase(String employeeName);

    List<Equipment> findByIsScrappedFalse();

    @Query("SELECT e FROM Equipment e WHERE " +
            "LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.serialNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Equipment> searchByNameOrSerial(@Param("query") String query);

    /**
     * Count of open (New or In-Progress) requests for a given equipment.
     * Used by the Smart Button badge. Uses enum param binding (not string
     * literals).
     */
    @Query("SELECT COUNT(r) FROM MaintenanceRequest r WHERE r.equipment.id = :equipmentId " +
            "AND r.status IN :statuses")
    long countOpenRequestsByEquipmentId(
            @Param("equipmentId") Long equipmentId,
            @Param("statuses") List<RequestStatus> statuses);
}
