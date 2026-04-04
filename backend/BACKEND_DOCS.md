# GearGuard — Backend Documentation

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.5.4 (Java 17) |
| Database | MySQL 8 + Flyway migrations |
| ORM | Spring Data JPA / Hibernate |
| Build | Maven |
| Profile | `dev` (MySQL, port 8000) |

## Database Migrations (Flyway)
| Version | File | Description |
|---|---|---|
| V4 | `V4__Create_Maintenance_Teams_Table.sql` | maintenance_teams + team_members join table |
| V5 | `V5__Create_Equipment_Table.sql` | equipment with scrap fields, FK to team |
| V6 | `V6__Create_Maintenance_Requests_Table.sql` | maintenance_requests with status/type enums |
| V7 | `V7__Seed_Initial_Data.sql` | 4 teams, 8 equipment, 10 requests |

## Entities
### MaintenanceTeam
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | Auto-increment |
| name | String (unique) | e.g. "Mechanical" |
| members | List\<String\> | Technician usernames (join table) |

### Equipment
| Field | Type | Notes |
|---|---|---|
| id, name, serialNumber, category | - | Core identity |
| department, employeeName, location | - | Ownership |
| team | FK → MaintenanceTeam | Nullable |
| technicianDefault | String | Auto-fill tech |
| isScrapped, scrapNote, scrappedAt | - | Scrap lifecycle |

### MaintenanceRequest
| Field | Type | Notes |
|---|---|---|
| type | Enum | `CORRECTIVE` / `PREVENTIVE` |
| status | Enum | `NEW` → `IN_PROGRESS` → `REPAIRED` / `SCRAP` |
| equipment | FK | Nullable |
| team | FK | Nullable |
| scheduledDate | LocalDate | Drives Calendar view |

## REST API Reference
### Teams — `/api/teams`
`GET /` · `GET /:id` · `POST /` · `PUT /:id` · `DELETE /:id`

### Equipment — `/api/equipment`
`GET /` · `GET /active` · `GET /:id` · `GET /search?q=` · `GET /by-department?dept=` · `GET /by-employee?name=` · `GET /:id/request-count` · `POST /` · `PUT /:id` · `PATCH /:id/scrap` · `DELETE /:id`

### Maintenance — `/api/maintenance`
`GET /` · `GET /:id` · `GET /calendar?start=&end=` · `GET /overdue` · `GET /by-equipment/:id` · `GET /reports/by-team` · `GET /reports/by-category` · `POST /` · `PUT /:id` · `PATCH /:id/status` · `DELETE /:id`

## Business Logic
- **Auto-fill**: On request create, team + technician copied from equipment if not explicitly set
- **Scrap block**: Creating a request on scrapped equipment → HTTP 400
- **Scrap propagation**: Moving request to `SCRAP` → sets `equipment.isScrapped = true`
- **Overdue**: Dynamically computed: `scheduledDate < today AND status ∈ {NEW, IN_PROGRESS}`
- **JPQL safety**: All enum comparisons use named param binding — no string literals

## Running
```bash
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
# API: http://localhost:8000/api
# Swagger: http://localhost:8000/swagger-ui/index.html
```
