package com.project.tracker.service.impl;

import com.project.tracker.dto.EquipmentDTO;
import com.project.tracker.entity.Equipment;
import com.project.tracker.entity.MaintenanceRequest.RequestStatus;
import com.project.tracker.entity.MaintenanceTeam;
import com.project.tracker.repository.EquipmentRepository;
import com.project.tracker.repository.MaintenanceTeamRepository;
import com.project.tracker.service.EquipmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepo;
    private final MaintenanceTeamRepository teamRepo;

    private static final List<RequestStatus> OPEN_STATUSES = List.of(RequestStatus.NEW, RequestStatus.IN_PROGRESS);

    @Override
    public List<EquipmentDTO> findAll() {
        return equipmentRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<EquipmentDTO> findActive() {
        return equipmentRepo.findByIsScrappedFalse().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public EquipmentDTO findById(Long id) {
        Equipment eq = getOrThrow(id);
        EquipmentDTO dto = toDTO(eq);
        dto.setOpenRequestCount(equipmentRepo.countOpenRequestsByEquipmentId(id, OPEN_STATUSES));
        return dto;
    }

    @Override
    public List<EquipmentDTO> search(String query) {
        return equipmentRepo.searchByNameOrSerial(query).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<EquipmentDTO> findByDepartment(String department) {
        return equipmentRepo.findByDepartmentIgnoreCase(department).stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EquipmentDTO> findByEmployee(String employeeName) {
        return equipmentRepo.findByEmployeeNameIgnoreCase(employeeName).stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public long getOpenRequestCount(Long id) {
        getOrThrow(id);
        return equipmentRepo.countOpenRequestsByEquipmentId(id, OPEN_STATUSES);
    }

    @Override
    @Transactional
    public EquipmentDTO create(EquipmentDTO dto) {
        Equipment eq = Equipment.builder()
                .name(dto.getName())
                .serialNumber(dto.getSerialNumber())
                .category(dto.getCategory())
                .department(dto.getDepartment())
                .employeeName(dto.getEmployeeName())
                .location(dto.getLocation())
                .purchaseDate(dto.getPurchaseDate())
                .warrantyExpiry(dto.getWarrantyExpiry())
                .technicianDefault(dto.getTechnicianDefault())
                .isScrapped(false)
                .build();
        if (dto.getTeamId() != null) {
            eq.setTeam(teamRepo.findById(dto.getTeamId())
                    .orElseThrow(() -> new EntityNotFoundException("Team not found: " + dto.getTeamId())));
        }
        return toDTO(equipmentRepo.save(eq));
    }

    @Override
    @Transactional
    public EquipmentDTO update(Long id, EquipmentDTO dto) {
        Equipment eq = getOrThrow(id);
        if (dto.getName() != null)
            eq.setName(dto.getName());
        if (dto.getSerialNumber() != null)
            eq.setSerialNumber(dto.getSerialNumber());
        if (dto.getCategory() != null)
            eq.setCategory(dto.getCategory());
        if (dto.getDepartment() != null)
            eq.setDepartment(dto.getDepartment());
        if (dto.getEmployeeName() != null)
            eq.setEmployeeName(dto.getEmployeeName());
        if (dto.getLocation() != null)
            eq.setLocation(dto.getLocation());
        if (dto.getPurchaseDate() != null)
            eq.setPurchaseDate(dto.getPurchaseDate());
        if (dto.getWarrantyExpiry() != null)
            eq.setWarrantyExpiry(dto.getWarrantyExpiry());
        if (dto.getTechnicianDefault() != null)
            eq.setTechnicianDefault(dto.getTechnicianDefault());
        if (dto.getTeamId() != null) {
            eq.setTeam(teamRepo.findById(dto.getTeamId())
                    .orElseThrow(() -> new EntityNotFoundException("Team not found: " + dto.getTeamId())));
        }
        return toDTO(equipmentRepo.save(eq));
    }

    @Override
    @Transactional
    public EquipmentDTO scrap(Long id, String scrapNote) {
        Equipment eq = getOrThrow(id);
        if (Boolean.TRUE.equals(eq.getIsScrapped())) {
            throw new IllegalStateException("Equipment is already scrapped.");
        }
        eq.setIsScrapped(true);
        eq.setScrapNote(scrapNote != null ? scrapNote : "Equipment decommissioned.");
        eq.setScrappedAt(LocalDateTime.now());
        return toDTO(equipmentRepo.save(eq));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!equipmentRepo.existsById(id)) {
            throw new EntityNotFoundException("Equipment not found with id: " + id);
        }
        equipmentRepo.deleteById(id);
    }

    private Equipment getOrThrow(Long id) {
        return equipmentRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Equipment not found with id: " + id));
    }

    EquipmentDTO toDTO(Equipment e) {
        return EquipmentDTO.builder()
                .id(e.getId())
                .name(e.getName())
                .serialNumber(e.getSerialNumber())
                .category(e.getCategory())
                .department(e.getDepartment())
                .employeeName(e.getEmployeeName())
                .location(e.getLocation())
                .purchaseDate(e.getPurchaseDate())
                .warrantyExpiry(e.getWarrantyExpiry())
                .teamId(e.getTeam() != null ? e.getTeam().getId() : null)
                .teamName(e.getTeam() != null ? e.getTeam().getName() : null)
                .technicianDefault(e.getTechnicianDefault())
                .isScrapped(e.getIsScrapped())
                .scrapNote(e.getScrapNote())
                .scrappedAt(e.getScrappedAt())
                .openRequestCount(0L)
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
