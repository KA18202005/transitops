from decimal import Decimal
from typing import Any

from sqlalchemy.orm import Session

from app.repositories.driver_repo import DriverRepository
from app.repositories.expense_repo import ExpenseRepository
from app.repositories.fuel_repo import FuelRepository
from app.repositories.maintenance_repo import MaintenanceRepository
from app.repositories.trip_repo import TripRepository
from app.repositories.vehicle_repo import VehicleRepository
from app.services.business_rules import calculate_roi


class DashboardService:
    """Business logic for dashboard summaries."""

    @staticmethod
    def _enum_value(value: Any) -> str:
        """Return a stable string value for enums and plain values."""
        return getattr(value, "value", str(value))

    @staticmethod
    def get_summary(db: Session, limit: int = 1000) -> dict[str, Any]:
        """Return high-level operational dashboard metrics."""
        vehicles = VehicleRepository.get_all(db, limit=limit)
        drivers = DriverRepository.get_all(db, limit=limit)
        trips = TripRepository.get_all(db, limit=limit)
        maintenance_logs = MaintenanceRepository.get_all(db, limit=limit)
        fuel_logs = FuelRepository.get_all(db, limit=limit)
        expenses = ExpenseRepository.get_all(db, limit=limit)

        total_revenue = sum((trip.revenue or Decimal("0")) for trip in trips)
        total_expenses = sum((expense.amount or Decimal("0")) for expense in expenses)
        total_fuel_cost = sum((fuel_log.cost or Decimal("0")) for fuel_log in fuel_logs)
        total_maintenance_cost = sum(
            (maintenance.maintenance_cost or Decimal("0"))
            for maintenance in maintenance_logs
        )
        total_cost = total_expenses + total_fuel_cost + total_maintenance_cost
        net_revenue = total_revenue - total_cost

        return {
            "vehicles": {
                "total": len(vehicles),
                "active": sum(1 for vehicle in vehicles if vehicle.is_active),
            },
            "drivers": {
                "total": len(drivers),
                "available": sum(
                    1
                    for driver in drivers
                    if DashboardService._enum_value(driver.status) == "Available"
                ),
            },
            "trips": {
                "total": len(trips),
                "completed": sum(
                    1
                    for trip in trips
                    if DashboardService._enum_value(trip.status) == "Completed"
                ),
            },
            "maintenance": {
                "total": len(maintenance_logs),
                "pending": sum(
                    1
                    for maintenance in maintenance_logs
                    if DashboardService._enum_value(maintenance.status) == "Pending"
                ),
            },
            "financials": {
                "total_revenue": total_revenue,
                "total_expenses": total_expenses,
                "total_fuel_cost": total_fuel_cost,
                "total_maintenance_cost": total_maintenance_cost,
                "total_cost": total_cost,
                "net_revenue": net_revenue,
                "roi_percentage": calculate_roi(total_revenue, total_cost),
            },
        }
