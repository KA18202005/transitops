-- ==========================
-- Roles
-- ==========================

INSERT INTO roles (name, description)
VALUES
('Admin','System Administrator'),
('Fleet Manager','Fleet Operations Manager'),
('Driver','Vehicle Driver'),
('Safety Officer','Safety Compliance'),
('Financial Analyst','Finance Department')
ON CONFLICT (name) DO NOTHING;

-- ==========================
-- Regions
-- ==========================

INSERT INTO regions (name, code)
VALUES
('North','NR'),
('South','SR'),
('East','ER'),
('West','WR'),
('Central','CR')
ON CONFLICT (name) DO NOTHING;

-- ==========================
-- Vehicle Types
-- ==========================

INSERT INTO vehicle_types (name, description)
VALUES
('Truck','Heavy Goods Vehicle'),
('Mini Truck','Small Cargo Vehicle'),
('Van','Delivery Van'),
('Pickup','Pickup Truck'),
('Trailer','Long-haul trailer')
ON CONFLICT (name) DO NOTHING;
