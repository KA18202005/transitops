# 📊 TransitOps Sample Test Data Guide

Use these realistic sample datasets to test forms, validation rules, and E2E database relations on each page of the TransitOps platform.

---

## 🔐 1. Signup / Register Page
*For registering new user accounts.*

| Field | Example Value | Validation Rules & Constraints |
|:---|:---|:---|
| **Full Name** | `Aarav Sharma` | Minimum 2 characters. |
| **Email** | `aarav.sharma@transitops.com` | Must be a valid email. **Do not use `.local` TLD.** |
| **Phone Number** | `9876543210` | Optional, must be 10 digits if provided. |
| **Operational Role** | `Fleet Manager` | Select from dropdown. |
| **Password** | `SecurePass123!` | Minimum 8 characters. |
| **Confirm Password** | `SecurePass123!` | Must match password. |

---

## 🚛 2. Vehicles Page
*To register vehicles in the fleet inventory.*

| Field | Example Value | Validation Rules & Constraints |
|:---|:---|:---|
| **Registration Number** | `MH-12-QW-8765` | **Must be unique** in the database. |
| **Vehicle Name** | `TATA Prima 4925.S` | e.g. Manufacturer & Model. |
| **Vehicle Type** | `Truck` | Select from: `Truck`, `Mini Truck`, `Van`, `Pickup`, `Trailer`. |
| **Region** | `West` | Select from: `North`, `South`, `East`, `West`, `Central`. |
| **Max Load Capacity** | `25000` | In kilograms. Must be greater than 0. |
| **Current Odometer** | `12450.70` | In kilometers. Cannot be negative. |
| **Acquisition Cost** | `3400000` | Cost in INR. Cannot be negative. |
| **Purchase Date** | `2025-08-15` | Date format (YYYY-MM-DD). |
| **Status** | `Available` | Select from: `Available`, `On Trip`, `In Shop`, `Retired`. |

---

## 👨‍✈️ 3. Drivers Page
*For managing driver profiles. Note: Adding a driver automatically spins up a corresponding driver-role user account.*

| Field | Example Value | Validation Rules & Constraints |
|:---|:---|:---|
| **Full Name** | `Devendra Singh` | Minimum 2 characters. |
| **Phone Number** | `9812345678` | **Must be exactly 10 digits**. |
| **Licence Number** | `DL-1420250089` | **Must be unique**. |
| **Licence Category** | `HMV` | e.g., `HMV` (Heavy Motor), `LMV` (Light Motor), `MCWG`. |
| **Licence Expiry Date** | `2029-12-31` | **Must be a future date** to be eligible for trips. |
| **Safety Score** | `98` | Range: 0 to 100. |
| **Status** | `Available` | Select from: `Available`, `Off Duty`, `Suspended`. |

---

## 🗺️ 4. Trips Page
*For creating dispatch routes. Ensure you have an **Available** vehicle and an **Available** driver selected.*

| Field | Example Value | Validation Rules & Constraints |
|:---|:---|:---|
| **Trip Number** | `TRIP-2026-101` | **Must be unique** in database. |
| **Vehicle** | `MH-12-QW-8765` | Select an **Available** vehicle from dropdown. |
| **Driver** | `Devendra Singh` | Select an **Available** driver from dropdown. |
| **Source** | `Nhava Sheva Port, Mumbai` | Source location address. |
| **Destination** | `ICD Tughlakabad, Delhi` | Destination location address. |
| **Cargo Weight** | `18500` | In kilograms. Must be greater than 0. |
| **Planned Distance** | `1420.50` | In kilometers. Must be greater than 0. |
| **Status** | `Dispatched` | Select from: `Draft`, `Dispatched`, `Completed`, `Cancelled`. |

---

## 🔧 5. Maintenance Page
*To schedule repairs or service logs.*

| Field | Example Value | Validation Rules & Constraints |
|:---|:---|:---|
| **Vehicle** | `MH-12-QW-8765` | Select any registered vehicle. |
| **Issue** | `Coolant Leakage & Overheating` | Summary of the maintenance issue. |
| **Description** | `Radiator hose damaged. Coolant level dropped to zero.` | Detailed maintenance notes. |
| **Maintenance Cost** | `8500` | Cost in INR. Cannot be negative. |
| **Start Date** | `2026-07-10` | Date maintenance began (YYYY-MM-DD). |
| **End Date** | `2026-07-12` | Date completed. Leave blank if status is `In Progress`. |
| **Status** | `Completed` | Select from: `Pending`, `In Progress`, `Completed`. |

---

## ⛽ 6. Fuel Logs Page
*To record fuel refills.*

| Field | Example Value | Validation Rules & Constraints |
|:---|:---|:---|
| **Vehicle** | `MH-12-QW-8765` | Select vehicle that was refuelled. |
| **Trip (Optional)** | `TRIP-2026-101` | Select active trip linked to this vehicle (if any). |
| **Litres** | `180.50` | Quantity in Litres. Must be greater than 0. |
| **Total Cost (INR)** | `17250` | Refuel cost in INR. Cannot be negative. |
| **Fuel Station** | `HP Plaza, NH-48` | Name/Location of the fuel station. |
| **Date** | `2026-07-12` | **Cannot be a future date**. |

---

## 💰 7. Expenses Page
*To capture trip-specific expenditures.*

| Field | Example Value | Validation Rules & Constraints |
|:---|:---|:---|
| **Vehicle** | `MH-12-QW-8765` | Select vehicle. |
| **Trip** | `TRIP-2026-101` | Select trip context. |
| **Expense Type** | `Toll` | Select from: `Fuel`, `Maintenance`, `Toll`, `Parking`, `Miscellaneous`. |
| **Amount** | `3200` | In INR. Cannot be negative. |
| **Description** | `FASTag NH-48 Toll charges (Return)` | Purpose details. |
| **Expense Date** | `2026-07-11` | Date incurred. |
