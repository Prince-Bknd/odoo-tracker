-- V6: Create maintenance_requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject        VARCHAR(500) NOT NULL,
    type           ENUM('CORRECTIVE','PREVENTIVE') NOT NULL DEFAULT 'CORRECTIVE',
    status         ENUM('NEW','IN_PROGRESS','REPAIRED','SCRAP') NOT NULL DEFAULT 'NEW',
    equipment_id   BIGINT,
    team_id        BIGINT,
    technician     VARCHAR(150),
    scheduled_date DATE,
    duration_hours DECIMAL(6,2),
    notes          TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_req_equipment FOREIGN KEY (equipment_id)
        REFERENCES equipment(id) ON DELETE SET NULL,
    CONSTRAINT fk_req_team FOREIGN KEY (team_id)
        REFERENCES maintenance_teams(id) ON DELETE SET NULL
);
