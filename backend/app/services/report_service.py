from collections import defaultdict
from decimal import Decimal
from typing import Any

from sqlalchemy.orm import Session

from app.repositories.driver_repo import DriverRepository
from app.repositories.expense_repo import ExpenseRepository
from app.repositories.fuel_repo import FuelRepository
from app.repositories.maintenance_repo import MaintenanceRepository
from app.repositories.trip_repo import TripRepository
from app.repositories.vehicle_repo import VehicleRepository
from app.services.business_rules import decimal_or_zero


class ReportService:
    """Business logic for operational and financial reports."""

    @staticmethod
    def _enum_value(value: Any) -> str:
        """Return a stable string value for enums and plain values."""
        return getattr(value, "value", str(value))

    @staticmethod
    def _percentage(numerator: int | Decimal, denominator: int | Decimal) -> Decimal | None:
        """Return a percentage rounded to two decimals."""
        if denominator == 0:
            return None

        return (Decimal(str(numerator)) / Decimal(str(denominator)) * Decimal("100")).quantize(
            Decimal("0.01")
        )

    @staticmethod
    def _month_key(value: Any) -> str:
        """Return a YYYY-MM grouping key for date-like values."""
        return f"{value.year:04d}-{value.month:02d}"

    @staticmethod
    def get_vehicle_utilization(
        db: Session,
        limit: int = 1000,
    ) -> dict[str, list[dict[str, Any]]]:
        """Return vehicle utilization report data."""
        vehicles = VehicleRepository.get_all(db, limit=limit)
        trips = TripRepository.get_all(db, limit=limit)

        items: list[dict[str, Any]] = []
        for vehicle in vehicles:
            vehicle_trips = [
                trip for trip in trips if trip.vehicle_id == vehicle.id
            ]
            planned_distance = sum(
                (decimal_or_zero(trip.planned_distance) for trip in vehicle_trips),
                Decimal("0"),
            )
            actual_distance = sum(
                (
                    decimal_or_zero(trip.actual_distance)
                    if trip.actual_distance is not None
                    else decimal_or_zero(trip.planned_distance)
                    for trip in vehicle_trips
                ),
                Decimal("0"),
            )

            items.append(
                {
                    "vehicle_id": vehicle.id,
                    "registration_number": vehicle.registration_number,
                    "vehicle_name": vehicle.vehicle_name,
                    "status": ReportService._enum_value(vehicle.status),
                    "total_trips": len(vehicle_trips),
                    "completed_trips": sum(
                        1
                        for trip in vehicle_trips
                        if ReportService._enum_value(trip.status) == "Completed"
                    ),
                    "running_trips": sum(
                        1
                        for trip in vehicle_trips
                        if ReportService._enum_value(trip.status) == "Dispatched"
                    ),
                    "planned_distance": planned_distance,
                    "actual_distance": actual_distance,
                    "utilization_percentage": ReportService._percentage(
                        actual_distance,
                        planned_distance,
                    ),
                }
            )

        return {"items": items}

    @staticmethod
    def get_driver_performance(
        db: Session,
        limit: int = 1000,
    ) -> dict[str, list[dict[str, Any]]]:
        """Return driver performance report data."""
        drivers = DriverRepository.get_all(db, limit=limit)
        trips = TripRepository.get_all(db, limit=limit)

        items: list[dict[str, Any]] = []
        for driver in drivers:
            driver_trips = [
                trip for trip in trips if trip.driver_id == driver.id
            ]
            total_trips = len(driver_trips)
            completed_trips = sum(
                1
                for trip in driver_trips
                if ReportService._enum_value(trip.status) == "Completed"
            )
            total_distance = sum(
                (
                    decimal_or_zero(trip.actual_distance)
                    if trip.actual_distance is not None
                    else decimal_or_zero(trip.planned_distance)
                    for trip in driver_trips
                ),
                Decimal("0"),
            )
            total_revenue = sum(
                (decimal_or_zero(trip.revenue) for trip in driver_trips),
                Decimal("0"),
            )

            items.append(
                {
                    "driver_id": driver.id,
                    "user_id": driver.user_id,
                    "license_number": driver.license_number,
                    "status": ReportService._enum_value(driver.status),
                    "safety_score": decimal_or_zero(driver.safety_score),
                    "total_trips": total_trips,
                    "completed_trips": completed_trips,
                    "cancelled_trips": sum(
                        1
                        for trip in driver_trips
                        if ReportService._enum_value(trip.status) == "Cancelled"
                    ),
                    "total_distance": total_distance,
                    "total_revenue": total_revenue,
                    "completion_rate": ReportService._percentage(
                        completed_trips,
                        total_trips,
                    ),
                }
            )

        return {"items": items}

    @staticmethod
    def get_monthly_expenses(
        db: Session,
        limit: int = 1000,
    ) -> dict[str, list[dict[str, Any]]]:
        """Return monthly expense report data."""
        fuel_logs = FuelRepository.get_all(db, limit=limit)
        maintenance_logs = MaintenanceRepository.get_all(db, limit=limit)
        expenses = ExpenseRepository.get_all(db, limit=limit)
        monthly_totals: dict[str, dict[str, Decimal]] = defaultdict(
            lambda: {
                "fuel_cost": Decimal("0"),
                "maintenance_cost": Decimal("0"),
                "other_expenses": Decimal("0"),
            }
        )

        for fuel_log in fuel_logs:
            month = ReportService._month_key(fuel_log.date)
            monthly_totals[month]["fuel_cost"] += decimal_or_zero(fuel_log.cost)

        for maintenance in maintenance_logs:
            month_source = maintenance.start_date or maintenance.created_at.date()
            month = ReportService._month_key(month_source)
            monthly_totals[month]["maintenance_cost"] += decimal_or_zero(
                maintenance.maintenance_cost
            )

        for expense in expenses:
            month = ReportService._month_key(expense.expense_date)
            monthly_totals[month]["other_expenses"] += decimal_or_zero(expense.amount)

        items = []
        for month, totals in sorted(monthly_totals.items()):
            total_expenses = (
                totals["fuel_cost"]
                + totals["maintenance_cost"]
                + totals["other_expenses"]
            )
            items.append(
                {
                    "month": month,
                    "fuel_cost": totals["fuel_cost"],
                    "maintenance_cost": totals["maintenance_cost"],
                    "other_expenses": totals["other_expenses"],
                    "total_expenses": total_expenses,
                }
            )

        return {"items": items}

    @staticmethod
    def get_fuel_consumption(
        db: Session,
        limit: int = 1000,
    ) -> dict[str, list[dict[str, Any]]]:
        """Return vehicle-level fuel consumption report data."""
        vehicles = VehicleRepository.get_all(db, limit=limit)
        fuel_logs = FuelRepository.get_all(db, limit=limit)

        items: list[dict[str, Any]] = []
        for vehicle in vehicles:
            vehicle_fuel_logs = [
                fuel_log for fuel_log in fuel_logs if fuel_log.vehicle_id == vehicle.id
            ]
            total_liters = sum(
                (decimal_or_zero(fuel_log.liters) for fuel_log in vehicle_fuel_logs),
                Decimal("0"),
            )
            total_cost = sum(
                (decimal_or_zero(fuel_log.cost) for fuel_log in vehicle_fuel_logs),
                Decimal("0"),
            )

            items.append(
                {
                    "vehicle_id": vehicle.id,
                    "registration_number": vehicle.registration_number,
                    "total_liters": total_liters,
                    "total_cost": total_cost,
                    "fuel_log_count": len(vehicle_fuel_logs),
                    "average_cost_per_liter": (
                        (total_cost / total_liters).quantize(Decimal("0.01"))
                        if total_liters > 0
                        else None
                    ),
                }
            )

        return {"items": items}

    @staticmethod
    def get_maintenance_history(
        db: Session,
        limit: int = 1000,
    ) -> dict[str, list[dict[str, Any]]]:
        """Return maintenance history report data."""
        maintenance_logs = MaintenanceRepository.get_all(db, limit=limit)

        return {
            "items": [
                {
                    "maintenance_id": maintenance.id,
                    "vehicle_id": maintenance.vehicle_id,
                    "issue": maintenance.issue,
                    "status": ReportService._enum_value(maintenance.status),
                    "maintenance_cost": decimal_or_zero(
                        maintenance.maintenance_cost
                    ),
                    "start_date": maintenance.start_date,
                    "end_date": maintenance.end_date,
                    "created_by": maintenance.created_by,
                }
                for maintenance in maintenance_logs
            ]
        }
