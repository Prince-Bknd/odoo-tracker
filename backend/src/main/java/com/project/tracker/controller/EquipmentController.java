package com.project.tracker.controller;

import com.project.tracker.dto.EquipmentDTO;
import com.project.tracker.response.CustomApiResponse;
import com.project.tracker.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<CustomApiResponse<List<EquipmentDTO>>> getAll() {
        return ResponseEntity.ok(CustomApiResponse.success("Equipment retrieved", equipmentService.findAll()));
    }

    @GetMapping("/active")
    public ResponseEntity<CustomApiResponse<List<EquipmentDTO>>> getActive() {
        return ResponseEntity.ok(CustomApiResponse.success("Active equipment", equipmentService.findActive()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomApiResponse<EquipmentDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(CustomApiResponse.success("Equipment retrieved", equipmentService.findById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<CustomApiResponse<List<EquipmentDTO>>> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(CustomApiResponse.success("Search results", equipmentService.search(query)));
    }

    @GetMapping("/by-department")
    public ResponseEntity<CustomApiResponse<List<EquipmentDTO>>> byDepartment(@RequestParam("dept") String dept) {
        return ResponseEntity
                .ok(CustomApiResponse.success("Equipment by department", equipmentService.findByDepartment(dept)));
    }

    @GetMapping("/by-employee")
    public ResponseEntity<CustomApiResponse<List<EquipmentDTO>>> byEmployee(@RequestParam("name") String name) {
        return ResponseEntity
                .ok(CustomApiResponse.success("Equipment by employee", equipmentService.findByEmployee(name)));
    }

    @GetMapping("/{id}/request-count")
    public ResponseEntity<CustomApiResponse<Map<String, Long>>> requestCount(@PathVariable Long id) {
        return ResponseEntity.ok(
                CustomApiResponse.success("Open count", Map.of("openCount", equipmentService.getOpenRequestCount(id))));
    }

    @PostMapping
    public ResponseEntity<CustomApiResponse<EquipmentDTO>> create(@RequestBody EquipmentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CustomApiResponse.success("Equipment created", equipmentService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomApiResponse<EquipmentDTO>> update(@PathVariable Long id,
            @RequestBody EquipmentDTO dto) {
        return ResponseEntity.ok(CustomApiResponse.success("Equipment updated", equipmentService.update(id, dto)));
    }

    @PatchMapping("/{id}/scrap")
    public ResponseEntity<CustomApiResponse<EquipmentDTO>> scrap(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String note = body != null ? body.get("note") : null;
        return ResponseEntity.ok(CustomApiResponse.success("Equipment scrapped", equipmentService.scrap(id, note)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CustomApiResponse<Void>> delete(@PathVariable Long id) {
        equipmentService.delete(id);
        return ResponseEntity.ok(CustomApiResponse.success("Equipment deleted", null));
    }
}
