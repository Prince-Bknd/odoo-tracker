# GearGuard — Frontend Documentation

## Tech Stack
| Technology | Purpose |
|---|---|
| React 19 + Vite 7 | UI framework & dev server |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Axios | HTTP client |
| dnd-kit | Drag-and-drop (Kanban) |
| FullCalendar 6 | Calendar view |
| Recharts 3 | Charts (Reports) |
| Lucide React | Icons |

## Routing
| Path | Component | Description |
|---|---|---|
| `/` | → `/equipment` | Default redirect |
| `/equipment` | Equipment | Asset list |
| `/equipment/new` | EquipmentForm | Create equipment |
| `/equipment/:id/edit` | EquipmentForm | Edit equipment |
| `/equipment/:id` | EquipmentDetail | Detail + smart button |
| `/teams` | Teams | Team management |
| `/maintenance` | Maintenance | Request list |
| `/maintenance/board` | MaintenanceBoard | Kanban board |
| `/maintenance/new` | MaintenanceForm | Create request |
| `/maintenance/:id` | MaintenanceForm | Edit request |
| `/calendar` | CalendarView | Preventive schedule |
| `/reports` | Reports | Analytics charts |

## API Modules (`src/api/`)
- **equipmentApi.js** — 11 functions (getAllEquipment, search, scrap, etc.)
- **teamsApi.js** — 5 functions (CRUD)
- **maintenanceApi.js** — 12 functions (requests, calendar, overdue, reports)

## Page Features
| Page | Key Features |
|---|---|
| Equipment | Search, group-by dept/employee, status badges |
| EquipmentDetail | Smart button (badge = open count), inline request list, scrap modal |
| EquipmentForm | Create/edit with team dropdown |
| Teams | Expand members, modal create/edit/delete |
| Maintenance | Filter status/type, overdue toggle, red row highlight |
| MaintenanceForm | Auto-fill team+tech from equipment, scrapped equipment block |
| MaintenanceBoard | dnd-kit drag-drop, 4 columns, optimistic updates + rollback |
| CalendarView | FullCalendar dayGrid, live API events, click date → new PREVENTIVE |
| Reports | Bar by team, Bar by category, Pie by status |

## Running
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5000
```
