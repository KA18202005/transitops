# TransitOps Database Dictionary

---

# Table: Roles

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique Role ID |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Role Name |
| description | TEXT | NULL | Role Description |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last Updated |

---

# Table: Users

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique User ID |
| role_id | INT | FOREIGN KEY REFERENCES roles(id) | User Role |
| full_name | VARCHAR(100) | NOT NULL | Full Name |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Login Email |
| password_hash | TEXT | NOT NULL | Encrypted Password |
| phone | VARCHAR(15) | NULL | Contact Number |
| is_active | BOOLEAN | DEFAULT TRUE | User Status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last Updated |

---

# Table: Regions

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Region ID |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Region Name |
| code | VARCHAR(10) | UNIQUE, NOT NULL | Region Code |

---

# Table: Vehicle Types

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Vehicle Type ID |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Vehicle Type |
| description | TEXT | NULL | Description |

---

# Table: Vehicles

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Vehicle ID |
| registration_number | VARCHAR(20) | UNIQUE, NOT NULL | Registration Number |
| vehicle_name | VARCHAR(100) | NOT NULL | Vehicle Name |
| vehicle_type_id | INT | FOREIGN KEY REFERENCES vehicle_types(id) | Vehicle Type |
| region_id | INT | FOREIGN KEY REFERENCES regions(id) | Assigned Region |
| max_load_capacity | DECIMAL(10,2) | CHECK (>0) | Max Capacity (kg) |
| current_odometer | DECIMAL(12,2) | CHECK (>=0) | Current Odometer |
| acquisition_cost | DECIMAL(12,2) | CHECK (>=0) | Purchase Cost |
| purchase_date | DATE | NULL | Purchase Date |
| status | vehicle_status | NOT NULL | Vehicle Status |
| is_active | BOOLEAN | DEFAULT TRUE | Active Status |
| created_by | INT | FOREIGN KEY REFERENCES users(id) | Created By |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last Updated |

---

# Table: Drivers

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Driver ID |
| user_id | INT | FOREIGN KEY REFERENCES users(id) | User Account |
| license_number | VARCHAR(50) | UNIQUE, NOT NULL | Driving License |
| license_category | VARCHAR(20) | NOT NULL | License Category |
| license_expiry | DATE | NOT NULL | Expiry Date |
| safety_score | DECIMAL(5,2) | DEFAULT 100 | Safety Rating |
| status | driver_status | NOT NULL | Driver Status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last Updated |

---

# Table: Trips

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Trip ID |
| trip_number | VARCHAR(30) | UNIQUE, NOT NULL | Trip Number |
| vehicle_id | INT | FOREIGN KEY REFERENCES vehicles(id) | Assigned Vehicle |
| driver_id | INT | FOREIGN KEY REFERENCES drivers(id) | Assigned Driver |
| source | VARCHAR(150) | NOT NULL | Source Location |
| destination | VARCHAR(150) | NOT NULL | Destination |
| cargo_weight | DECIMAL(10,2) | CHECK (>0) | Cargo Weight |
| planned_distance | DECIMAL(10,2) | CHECK (>0) | Planned Distance |
| actual_distance | DECIMAL(10,2) | NULL | Actual Distance |
| fuel_used | DECIMAL(10,2) | NULL | Fuel Consumed |
| revenue | DECIMAL(12,2) | DEFAULT 0 | Trip Revenue |
| status | trip_status | NOT NULL | Trip Status |
| departure_time | TIMESTAMP | NULL | Departure Time |
| arrival_time | TIMESTAMP | NULL | Arrival Time |
| created_by | INT | FOREIGN KEY REFERENCES users(id) | Created By |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last Updated |

---

# Table: Maintenance Logs

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Maintenance ID |
| vehicle_id | INT | FOREIGN KEY REFERENCES vehicles(id) | Vehicle |
| issue | VARCHAR(200) | NOT NULL | Maintenance Issue |
| description | TEXT | NULL | Issue Description |
| maintenance_cost | DECIMAL(12,2) | DEFAULT 0 | Repair Cost |
| start_date | DATE | NOT NULL | Start Date |
| end_date | DATE | NULL | Completion Date |
| status | maintenance_status | NOT NULL | Maintenance Status |
| created_by | INT | FOREIGN KEY REFERENCES users(id) | Created By |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last Updated |

---

# Table: Fuel Logs

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Fuel Log ID |
| vehicle_id | INT | FOREIGN KEY REFERENCES vehicles(id) | Vehicle |
| trip_id | INT | FOREIGN KEY REFERENCES trips(id) | Trip |
| liters | DECIMAL(10,2) | CHECK (>0) | Fuel Quantity |
| cost | DECIMAL(10,2) | CHECK (>=0) | Fuel Cost |
| fuel_station | VARCHAR(100) | NULL | Fuel Station |
| date | DATE | NOT NULL | Fuel Date |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |

---

# Table: Expenses

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Expense ID |
| trip_id | INT | FOREIGN KEY REFERENCES trips(id) | Trip |
| vehicle_id | INT | FOREIGN KEY REFERENCES vehicles(id) | Vehicle |
| type | expense_type | NOT NULL | Expense Type |
| amount | DECIMAL(12,2) | CHECK (>=0) | Expense Amount |
| description | TEXT | NULL | Expense Description |
| expense_date | DATE | NOT NULL | Expense Date |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |

---

# Table: Notifications

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Notification ID |
| user_id | INT | FOREIGN KEY REFERENCES users(id) | Recipient |
| title | VARCHAR(150) | NOT NULL | Notification Title |
| message | TEXT | NOT NULL | Notification Message |
| is_read | BOOLEAN | DEFAULT FALSE | Read Status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |

---

# Table: Activity Logs

| Column | Data Type | Constraints | Description |
|---------|----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Activity ID |
| user_id | INT | FOREIGN KEY REFERENCES users(id) | User |
| module | VARCHAR(50) | NOT NULL | Module Name |
| action | VARCHAR(100) | NOT NULL | Performed Action |
| reference_id | INT | NULL | Related Record ID |
| created_at | TIMESTAMP | DEFAULT NOW() | Record Creation Time |