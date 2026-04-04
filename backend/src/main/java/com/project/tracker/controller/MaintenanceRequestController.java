package com.project.tracker.controller;

import com.project.tracker.dto.MaintenanceRequestDTO;
import com.project.tracker.entity.MaintenanceRequest.RequestStatus;
import com.project.tracker.entity.MaintenanceRequest.RequestType;
import com.project.tracker.response.CustomApiResponse;
import com.project.tracker.service.MaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MaintenanceRequestController {

    private final MaintenanceRequestService requestService;

    @GetMapping
    public ResponseEntity<CustomApiResponse<List<MaintenanceRequestDTO>>> getAll(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) RequestType type) {
        List<MaintenanceRequestDTO> result;
        if (status != null)
            result = requestService.findByStatus(status);
        else if (type != null)
            result = requestService.findByType(type);
        else
            result = requestService.findAll();
        return ResponseEntity.ok(CustomApiResponse.success("Requests retrieved", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomApiResponse<MaintenanceRequestDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(CustomApiResponse.success("Request retrieved", requestService.findById(id)));
    }

    @GetMapping("/calendar")
    public ResponseEntity<CustomApiResponse<List<MaintenanceRequestDTO>>> calendar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity
                .ok(CustomApiResponse.success("Calendar events", requestService.findPreventiveInRange(start, end)));
    }

    @GetMapping("/overdue")
    public ResponseEntity<CustomApiResponse<List<MaintenanceRequestDTO>>> overdue() {
        return ResponseEntity.ok(CustomApiResponse.success("Overdue requests", requestService.findOverdue()));
    }

    @GetMapping("/by-equipment/{equipmentId}")
    public ResponseEntity<CustomApiResponse<List<MaintenanceRequestDTO>>> byEquipment(@PathVariable Long equipmentId) {
        return ResponseEntity
                .ok(CustomApiResponse.success("Requests for equipment", requestService.findByEquipmentId(equipmentId)));
    }

    @GetMapping("/reports/by-team")
    public ResponseEntity<CustomApiResponse<Map<String, Long>>> reportByTeam() {
        return ResponseEntity.ok(CustomApiResponse.success("Report by team", requestService.reportByTeam()));
    }

    @GetMapping("/reports/by-category")
    public ResponseEntity<CustomApiResponse<Map<String, Long>>> reportByCategory() {
        return ResponseEntity.ok(CustomApiResponse.success("Report by category", requestService.reportByCategory()));
    }

    @PostMapping
    public ResponseEntity<CustomApiResponse<MaintenanceRequestDTO>> create(@RequestBody MaintenanceRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CustomApiResponse.success("Request created", requestService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomApiResponse<MaintenanceRequestDTO>> update(@PathVariable Long id,
            @RequestBody MaintenanceRequestDTO dto) {
        return ResponseEntity.ok(CustomApiResponse.success("Request updated", requestService.update(id, dto)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CustomApiResponse<MaintenanceRequestDTO>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        RequestStatus newStatus = RequestStatus.valueOf(body.get("status").toUpperCase());
        String notes = body.get("notes");
        return ResponseEntity
                .ok(CustomApiResponse.success("Status updated", requestService.updateStatus(id, newStatus, notes)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CustomApiResponse<Void>> delete(@PathVariable Long id) {
        requestService.delete(id);
        return ResponseEntity.ok(CustomApiResponse.success("Request deleted", null));
    }
}
