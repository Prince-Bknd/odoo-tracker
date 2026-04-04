-- V5: Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name                 VARCHAR(200) NOT NULL,
    serial_number        VARCHAR(100),
    category             VARCHAR(100),
    department           VARCHAR(150),
    employee_name        VARCHAR(200),
    location             VARCHAR(200),
    purchase_date        DATE,
    warranty_expiry      DATE,
    team_id              BIGINT,
    technician_default   VARCHAR(150),
    is_scrapped          BOOLEAN NOT NULL DEFAULT FALSE,
    scrap_note           TEXT,
    scrapped_at          TIMESTAMP NULL,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_equipment_team FOREIGN KEY (team_id)
        REFERENCES maintenance_teams(id) ON DELETE SET NULL
);
