from decimal import Decimal
from typing import Any

from sqlalchemy.orm import Session

from app.repositories.expense_repo import ExpenseRepository
from app.repositories.fuel_repo import FuelRepository
from app.repositories.maintenance_repo import MaintenanceRepository
from app.repositories.trip_repo import TripRepository
from app.repositories.vehicle_repo import VehicleRepository
from app.services.business_rules import calculate_roi


class ReportService:
    """Business logic for operational and financial reports."""

    @staticmethod
    def _enum_value(value: Any) -> str:
        """Return a stable string value for enums and plain values."""
        return getattr(value, "value", str(value))

    @staticmethod
    def get_vehicle_report(db: Session, limit: int = 1000) -> dict[str, Any]:
        """Return vehicle-level operational report data."""
        vehicles = VehicleRepository.get_all(db, limit=limit)
        trips = TripRepository.get_all(db, limit=limit)
        maintenance_logs = MaintenanceRepository.get_all(db, limit=limit)
        fuel_logs = FuelRepository.get_all(db, limit=limit)

        return {
            "total_vehicles": len(vehicles),
            "active_vehicles": sum(1 for vehicle in vehicles if vehicle.is_active),
            "inactive_vehicles": sum(1 for vehicle in vehicles if not vehicle.is_active),
            "total_trips": len(trips),
            "total_maintenance_logs": len(maintenance_logs),
            "total_fuel_logs": len(fuel_logs),
        }

    @staticmethod
    def get_trip_report(db: Session, limit: int = 1000) -> dict[str, Any]:
        """Return trip-level operational report data."""
        trips = TripRepository.get_all(db, limit=limit)
        total_distance = sum(
            (trip.actual_distance or trip.planned_distance or Decimal("0"))
            for trip in trips
        )
        total_fuel_used = sum((trip.fuel_used or Decimal("0")) for trip in trips)

        return {
            "total_trips": len(trips),
            "draft_trips": sum(
                1 for trip in trips if ReportService._enum_value(trip.status) == "Draft"
            ),
            "completed_trips": sum(
                1
                for trip in trips
                if ReportService._enum_value(trip.status) == "Completed"
            ),
            "cancelled_trips": sum(
                1
                for trip in trips
                if ReportService._enum_value(trip.status) == "Cancelled"
            ),
            "total_distance": total_distance,
            "total_fuel_used": total_fuel_used,
        }

    @staticmethod
    def get_financial_report(db: Session, limit: int = 1000) -> dict[str, Any]:
        """Return financial report data."""
        trips = TripRepository.get_all(db, limit=limit)
        expenses = ExpenseRepository.get_all(db, limit=limit)
        fuel_logs = FuelRepository.get_all(db, limit=limit)
        maintenance_logs = MaintenanceRepository.get_all(db, limit=limit)

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
            "total_revenue": total_revenue,
            "total_expenses": total_expenses,
            "total_fuel_cost": total_fuel_cost,
            "total_maintenance_cost": total_maintenance_cost,
            "total_cost": total_cost,
            "net_revenue": net_revenue,
            "roi_percentage": calculate_roi(total_revenue, total_cost),
        }
