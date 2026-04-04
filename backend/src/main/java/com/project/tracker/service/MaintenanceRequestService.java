package com.project.tracker.service;

import com.project.tracker.dto.MaintenanceRequestDTO;
import com.project.tracker.entity.MaintenanceRequest.RequestStatus;
import com.project.tracker.entity.MaintenanceRequest.RequestType;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface MaintenanceRequestService {
    List<MaintenanceRequestDTO> findAll();

    MaintenanceRequestDTO findById(Long id);

    List<MaintenanceRequestDTO> findByStatus(RequestStatus status);

    List<MaintenanceRequestDTO> findByType(RequestType type);

    List<MaintenanceRequestDTO> findByEquipmentId(Long equipmentId);

    List<MaintenanceRequestDTO> findPreventiveInRange(LocalDate start, LocalDate end);

    List<MaintenanceRequestDTO> findOverdue();

    Map<String, Long> reportByTeam();

    Map<String, Long> reportByCategory();

    MaintenanceRequestDTO create(MaintenanceRequestDTO dto);

    MaintenanceRequestDTO update(Long id, MaintenanceRequestDTO dto);

    MaintenanceRequestDTO updateStatus(Long id, RequestStatus newStatus, String notes);

    void delete(Long id);
}
