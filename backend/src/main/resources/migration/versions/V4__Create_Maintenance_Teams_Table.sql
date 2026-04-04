-- V4: Create maintenance_teams and team_members tables
CREATE TABLE IF NOT EXISTS maintenance_teams (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    team_id     BIGINT       NOT NULL,
    member_name VARCHAR(150) NOT NULL,
    CONSTRAINT fk_team_members_team FOREIGN KEY (team_id)
        REFERENCES maintenance_teams(id) ON DELETE CASCADE
);
