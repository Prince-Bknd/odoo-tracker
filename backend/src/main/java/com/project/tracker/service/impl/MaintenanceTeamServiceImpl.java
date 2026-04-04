package com.project.tracker.service.impl;

import com.project.tracker.dto.MaintenanceTeamDTO;
import com.project.tracker.entity.MaintenanceTeam;
import com.project.tracker.repository.MaintenanceTeamRepository;
import com.project.tracker.service.MaintenanceTeamService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaintenanceTeamServiceImpl implements MaintenanceTeamService {

    private final MaintenanceTeamRepository teamRepo;

    @Override
    public List<MaintenanceTeamDTO> findAll() {
        return teamRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public MaintenanceTeamDTO findById(Long id) {
        return toDTO(getOrThrow(id));
    }

    @Override
    @Transactional
    public MaintenanceTeamDTO create(MaintenanceTeamDTO dto) {
        if (teamRepo.existsByNameIgnoreCase(dto.getName())) {
            throw new IllegalArgumentException("Team name already exists: " + dto.getName());
        }
        MaintenanceTeam team = MaintenanceTeam.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .members(dto.getMembers() != null ? dto.getMembers() : List.of())
                .build();
        return toDTO(teamRepo.save(team));
    }

    @Override
    @Transactional
    public MaintenanceTeamDTO update(Long id, MaintenanceTeamDTO dto) {
        MaintenanceTeam team = getOrThrow(id);
        if (dto.getName() != null)
            team.setName(dto.getName());
        if (dto.getDescription() != null)
            team.setDescription(dto.getDescription());
        if (dto.getMembers() != null)
            team.setMembers(dto.getMembers());
        return toDTO(teamRepo.save(team));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!teamRepo.existsById(id)) {
            throw new EntityNotFoundException("Team not found with id: " + id);
        }
        teamRepo.deleteById(id);
    }

    private MaintenanceTeam getOrThrow(Long id) {
        return teamRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + id));
    }

    private MaintenanceTeamDTO toDTO(MaintenanceTeam t) {
        return MaintenanceTeamDTO.builder()
                .id(t.getId())
                .name(t.getName())
                .description(t.getDescription())
                .members(t.getMembers())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
