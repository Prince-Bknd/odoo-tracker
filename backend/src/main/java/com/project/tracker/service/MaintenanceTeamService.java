package com.project.tracker.service;

import com.project.tracker.dto.MaintenanceTeamDTO;
import java.util.List;

public interface MaintenanceTeamService {
    List<MaintenanceTeamDTO> findAll();

    MaintenanceTeamDTO findById(Long id);

    MaintenanceTeamDTO create(MaintenanceTeamDTO dto);

    MaintenanceTeamDTO update(Long id, MaintenanceTeamDTO dto);

    void delete(Long id);
}
