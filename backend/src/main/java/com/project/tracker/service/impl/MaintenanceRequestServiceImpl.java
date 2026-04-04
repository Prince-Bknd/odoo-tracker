package com.project.tracker.service.impl;

import com.project.tracker.dto.MaintenanceRequestDTO;
import com.project.tracker.entity.Equipment;
import com.project.tracker.entity.MaintenanceRequest;
import com.project.tracker.entity.MaintenanceRequest.RequestStatus;
import com.project.tracker.entity.MaintenanceRequest.RequestType;
import com.project.tracker.entity.MaintenanceTeam;
import com.project.tracker.repository.EquipmentRepository;
import com.project.tracker.repository.MaintenanceRequestRepository;
import com.project.tracker.repository.MaintenanceTeamRepository;
import com.project.tracker.service.MaintenanceRequestService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaintenanceRequestServiceImpl implements MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepo;
    private final EquipmentRepository equipmentRepo;
    private final MaintenanceTeamRepository teamRepo;

    private static final List<RequestStatus> OPEN_STATUSES = List.of(RequestStatus.NEW, RequestStatus.IN_PROGRESS);

    // ── Reads ────────────────────────────────────────────────────────────────

    @Override
    public List<MaintenanceRequestDTO> findAll() {
        return requestRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public MaintenanceRequestDTO findById(Long id) {
        return toDTO(getOrThrow(id));
    }

    @Override
    public List<MaintenanceRequestDTO> findByStatus(RequestStatus status) {
        return requestRepo.findByStatus(status).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceRequestDTO> findByType(RequestType type) {
        return requestRepo.findByType(type).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceRequestDTO> findByEquipmentId(Long equipmentId) {
        return requestRepo.findByEquipmentId(equipmentId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceRequestDTO> findPreventiveInRange(LocalDate start, LocalDate end) {
        return requestRepo.findPreventiveInDateRange(RequestType.PREVENTIVE, start, end)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceRequestDTO> findOverdue() {
        return requestRepo.findOverdue(LocalDate.now(), OPEN_STATUSES)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Writes ───────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public MaintenanceRequestDTO create(MaintenanceRequestDTO dto) {
        MaintenanceRequest req = new MaintenanceRequest();
        req.setSubject(dto.getSubject());
        req.setType(dto.getType() != null ? dto.getType() : RequestType.CORRECTIVE);
        req.setStatus(RequestStatus.NEW);
        req.setTechnician(dto.getTechnician());
        req.setScheduledDate(dto.getScheduledDate());
        req.setDurationHours(dto.getDurationHours());
        req.setNotes(dto.getNotes());

        if (dto.getEquipmentId() != null) {
            Equipment eq = equipmentRepo.findById(dto.getEquipmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Equipment not found: " + dto.getEquipmentId()));
            if (Boolean.TRUE.equals(eq.getIsScrapped())) {
                throw new IllegalStateException(
                        "Cannot create maintenance request for scrapped equipment: " + eq.getName());
            }
            req.setEquipment(eq);
            // Auto-fill from equipment if not explicitly provided
            if (dto.getTeamId() == null && eq.getTeam() != null)
                req.setTeam(eq.getTeam());
            if ((dto.getTechnician() == null || dto.getTechnician().isBlank()) && eq.getTechnicianDefault() != null)
                req.setTechnician(eq.getTechnicianDefault());
        }

        if (dto.getTeamId() != null) {
            req.setTeam(teamRepo.findById(dto.getTeamId())
                    .orElseThrow(() -> new EntityNotFoundException("Team not found: " + dto.getTeamId())));
        }

        return toDTO(requestRepo.save(req));
    }

    @Override
    @Transactional
    public MaintenanceRequestDTO update(Long id, MaintenanceRequestDTO dto) {
        MaintenanceRequest req = getOrThrow(id);
        if (dto.getSubject() != null)
            req.setSubject(dto.getSubject());
        if (dto.getType() != null)
            req.setType(dto.getType());
        if (dto.getTechnician() != null)
            req.setTechnician(dto.getTechnician());
        if (dto.getScheduledDate() != null)
            req.setScheduledDate(dto.getScheduledDate());
        if (dto.getDurationHours() != null)
            req.setDurationHours(dto.getDurationHours());
        if (dto.getNotes() != null)
            req.setNotes(dto.getNotes());
        if (dto.getEquipmentId() != null)
            req.setEquipment(equipmentRepo.findById(dto.getEquipmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Equipment not found: " + dto.getEquipmentId())));
        if (dto.getTeamId() != null)
            req.setTeam(teamRepo.findById(dto.getTeamId())
                    .orElseThrow(() -> new EntityNotFoundException("Team not found: " + dto.getTeamId())));
        return toDTO(requestRepo.save(req));
    }

    @Override
    @Transactional
    public MaintenanceRequestDTO updateStatus(Long id, RequestStatus newStatus, String notes) {
        MaintenanceRequest req = getOrThrow(id);
        req.setStatus(newStatus);
        if (notes != null && !notes.isBlank())
            req.setNotes(notes);

        // Scrap propagation: moving request to SCRAP → scrap the equipment
        if (newStatus == RequestStatus.SCRAP && req.getEquipment() != null) {
            Equipment eq = req.getEquipment();
            if (!Boolean.TRUE.equals(eq.getIsScrapped())) {
                eq.setIsScrapped(true);
                eq.setScrapNote("Auto-scrapped via maintenance request #" + id + (notes != null ? ": " + notes : ""));
                eq.setScrappedAt(LocalDateTime.now());
                equipmentRepo.save(eq);
            }
        }
        return toDTO(requestRepo.save(req));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!requestRepo.existsById(id))
            throw new EntityNotFoundException("Request not found: " + id);
        requestRepo.deleteById(id);
    }

    // ── Reports ───────────────────────────────────────────────────────────────

    @Override
    public Map<String, Long> reportByTeam() {
        Map<String, Long> result = new LinkedHashMap<>();
        requestRepo.countByTeam().forEach(row -> result.put((String) row[0], (Long) row[1]));
        return result;
    }

    @Override
    public Map<String, Long> reportByCategory() {
        Map<String, Long> result = new LinkedHashMap<>();
        requestRepo.countByEquipmentCategory().forEach(row -> result.put((String) row[0], (Long) row[1]));
        return result;
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    private MaintenanceRequest getOrThrow(Long id) {
        return requestRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Maintenance request not found: " + id));
    }

    private MaintenanceRequestDTO toDTO(MaintenanceRequest r) {
        boolean overdue = r.getScheduledDate() != null
                && r.getScheduledDate().isBefore(LocalDate.now())
                && (r.getStatus() == RequestStatus.NEW || r.getStatus() == RequestStatus.IN_PROGRESS);

        return MaintenanceRequestDTO.builder()
                .id(r.getId())
                .subject(r.getSubject())
                .type(r.getType())
                .status(r.getStatus())
                .equipmentId(r.getEquipment() != null ? r.getEquipment().getId() : null)
                .equipmentName(r.getEquipment() != null ? r.getEquipment().getName() : null)
                .equipmentScrapped(r.getEquipment() != null ? r.getEquipment().getIsScrapped() : null)
                .teamId(r.getTeam() != null ? r.getTeam().getId() : null)
                .teamName(r.getTeam() != null ? r.getTeam().getName() : null)
                .technician(r.getTechnician())
                .scheduledDate(r.getScheduledDate())
                .durationHours(r.getDurationHours())
                .notes(r.getNotes())
                .isOverdue(overdue)
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
