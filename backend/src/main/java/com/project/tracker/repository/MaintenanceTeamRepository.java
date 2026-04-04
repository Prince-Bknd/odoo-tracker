package com.project.tracker.repository;

import com.project.tracker.entity.MaintenanceTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaintenanceTeamRepository extends JpaRepository<MaintenanceTeam, Long> {
    Optional<MaintenanceTeam> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
