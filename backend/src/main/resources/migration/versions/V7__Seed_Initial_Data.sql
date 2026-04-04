-- V7: Seed realistic demo data
-- Teams
INSERT INTO maintenance_teams (name, description) VALUES
  ('Mechanical',  'Handles mechanical equipment like presses, conveyors, pumps'),
  ('Electrical',  'Electrical wiring, motors, and control panels'),
  ('IT Support',  'Computers, servers, and networking infrastructure'),
  ('Fleet',       'Vehicles, forklifts, and mobile equipment');

-- Team members
INSERT INTO team_members (team_id, member_name) VALUES
  (1, 'rahul.sharma'), (1, 'suresh.kumar'),
  (2, 'amit.verma'),   (2, 'priya.singh'),
  (3, 'kiran.reddy'),  (3, 'neha.gupta'),
  (4, 'vijay.patel'),  (4, 'anita.thomas');

-- Equipment
INSERT INTO equipment (name, serial_number, category, department, employee_name, location, team_id, technician_default, purchase_date, warranty_expiry) VALUES
  ('Hydraulic Press #1',  'HP-2021-001', 'Machine',  'Production',   NULL,            'Block A, Floor 1', 1, 'rahul.sharma', '2021-03-15', '2026-03-15'),
  ('CNC Milling Machine', 'CNC-2022-001','Machine',  'Production',   NULL,            'Block A, Floor 2', 1, 'suresh.kumar', '2022-01-10', '2027-01-10'),
  ('Diesel Generator',    'DG-2020-002', 'Machine',  'Facility',     NULL,            'Generator Room',   2, 'amit.verma',  '2020-06-01', '2025-06-01'),
  ('Employee Laptop #42', 'DEL-2023-042','Computer', 'HR',           'Sneha Kapoor',  'HR Office',        3, 'kiran.reddy', '2023-08-20', '2026-08-20'),
  ('Server Rack A',       'SRV-2022-A',  'Computer', 'IT',           NULL,            'Data Centre',      3, 'neha.gupta',  '2022-11-05', '2027-11-05'),
  ('Forklift #3',         'FL-2019-003', 'Vehicle',  'Warehouse',    NULL,            'Warehouse Bay 3',  4, 'vijay.patel', '2019-04-12', '2024-04-12'),
  ('Delivery Van KA-05',  'VAN-2021-05', 'Vehicle',  'Logistics',    NULL,            'Parking Bay 1',    4, 'anita.thomas','2021-09-18', '2026-09-18'),
  ('Air Compressor B',    'AC-2020-B',   'Machine',  'Production',   NULL,            'Block B, Floor 1', 1, 'suresh.kumar', '2020-02-28', '2025-02-28');

-- Maintenance Requests (mix of statuses and types)
INSERT INTO maintenance_requests (subject, type, status, equipment_id, team_id, technician, scheduled_date, duration_hours, notes) VALUES
  ('Hydraulic oil leak detected',         'CORRECTIVE', 'IN_PROGRESS', 1, 1, 'rahul.sharma', '2026-04-02', 3.0,  'Oil pooling under press unit A. Seal replacement in progress.'),
  ('Monthly lubrication service',         'PREVENTIVE', 'NEW',         2, 1, 'suresh.kumar', '2026-04-10', 1.5,  'Scheduled monthly PM for CNC spindle and ways.'),
  ('Generator battery failure',           'CORRECTIVE', 'REPAIRED',    3, 2, 'amit.verma',  '2026-03-25', 4.0,  'Replaced battery bank and tested load transfer.'),
  ('Laptop screen flickering',            'CORRECTIVE', 'NEW',         4, 3, 'kiran.reddy', '2026-04-04', 1.0,  'Display connection loose. Requires inspection.'),
  ('Quarterly server health check',       'PREVENTIVE', 'NEW',         5, 3, 'neha.gupta',  '2026-04-15', 2.0,  'Disk health, RAID, cooling, and patch check.'),
  ('Forklift brake pads worn out',        'CORRECTIVE', 'SCRAP',       6, 4, 'vijay.patel', '2026-03-20', NULL, 'Frame corrosion beyond repair. Recommended scrap.'),
  ('Van AC system not cooling',           'CORRECTIVE', 'IN_PROGRESS', 7, 4, 'anita.thomas','2026-04-01', 2.5,  'Refrigerant low. Compressor bearing noise noted.'),
  ('Compressor belt replacement',         'PREVENTIVE', 'REPAIRED',    8, 1, 'rahul.sharma', '2026-03-28', 1.0,  'Replaced drive belt as per PM schedule.'),
  ('CNC spindle vibration issue',         'CORRECTIVE', 'NEW',         2, 1, 'suresh.kumar', '2026-03-30', NULL, 'Abnormal vibration during high-speed operation.'),
  ('Annual electrical safety audit',      'PREVENTIVE', 'NEW',         3, 2, 'amit.verma',  '2026-04-20', 5.0,  'Full electrical audit per compliance requirement.');

-- Mark forklift as scrapped (its request moved to SCRAP)
UPDATE equipment SET is_scrapped = TRUE, scrap_note = 'Frame corrosion beyond repair — scrapped via request #6', scrapped_at = NOW() WHERE id = 6;
