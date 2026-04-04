package com.project.tracker.controller;

import com.project.tracker.dto.MaintenanceTeamDTO;
import com.project.tracker.response.CustomApiResponse;
import com.project.tracker.service.MaintenanceTeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MaintenanceTeamController {

    private final MaintenanceTeamService teamService;

    @GetMapping
    public ResponseEntity<CustomApiResponse<List<MaintenanceTeamDTO>>> getAll() {
        return ResponseEntity.ok(CustomApiResponse.success("Teams retrieved", teamService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomApiResponse<MaintenanceTeamDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(CustomApiResponse.success("Team retrieved", teamService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<CustomApiResponse<MaintenanceTeamDTO>> create(@RequestBody MaintenanceTeamDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CustomApiResponse.success("Team created", teamService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomApiResponse<MaintenanceTeamDTO>> update(@PathVariable Long id,
            @RequestBody MaintenanceTeamDTO dto) {
        return ResponseEntity.ok(CustomApiResponse.success("Team updated", teamService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CustomApiResponse<Void>> delete(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.ok(CustomApiResponse.success("Team deleted", null));
    }
}
