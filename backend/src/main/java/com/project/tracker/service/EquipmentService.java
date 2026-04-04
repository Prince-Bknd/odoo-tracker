package com.project.tracker.service;

import com.project.tracker.dto.EquipmentDTO;
import java.util.List;

public interface EquipmentService {
    List<EquipmentDTO> findAll();

    List<EquipmentDTO> findActive();

    EquipmentDTO findById(Long id);

    List<EquipmentDTO> search(String query);

    List<EquipmentDTO> findByDepartment(String department);

    List<EquipmentDTO> findByEmployee(String employeeName);

    long getOpenRequestCount(Long id);

    EquipmentDTO create(EquipmentDTO dto);

    EquipmentDTO update(Long id, EquipmentDTO dto);

    EquipmentDTO scrap(Long id, String scrapNote);

    void delete(Long id);
}
