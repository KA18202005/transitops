from datetime import datetime
from decimal import Decimal
from typing import Any, Mapping

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enums import DriverStatus, TripStatus, VehicleStatus
from app.models.trip import Trip
from app.repositories.driver_repo import DriverRepository
from app.repositories.expense_repo import ExpenseRepository
from app.repositories.fuel_repo import FuelRepository
from app.repositories.trip_repo import TripRepository
from app.repositories.vehicle_repo import VehicleRepository
from app.services.business_rules import (
    calculate_roi,
    coerce_date,
    coerce_enum,
    decimal_or_zero,
    ensure_transition,
)


TRIP_STATUS_TRANSITIONS: dict[TripStatus, set[TripStatus]] = {
    TripStatus.DRAFT: {
        TripStatus.DISPATCHED,
        TripStatus.CANCELLED,
    },
    TripStatus.DISPATCHED: {
        TripStatus.COMPLETED,
        TripStatus.CANCELLED,
    },
    TripStatus.COMPLETED: set(),
    TripStatus.CANCELLED: set(),
}


class TripService:
    """Business logic for trip workflows."""

    @staticmethod
    def _to_dict(data: Mapping[str, Any] | Any, exclude_unset: bool = False) -> dict[str, Any]:
        """Convert Pydantic or mapping input into a plain dictionary."""
        if hasattr(data, "model_dump"):
            return data.model_dump(exclude_unset=exclude_unset)
        return dict(data)

    @staticmethod
    def _parse_datetime(value: Any, field_name: str) -> datetime | None:
        """Convert datetime-like values into datetime objects."""
        if value is None:
            return None

        if isinstance(value, datetime):
            return value

        if isinstance(value, str):
            try:
                return datetime.fromisoformat(value)
            except ValueError:
                pass

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name} must be a valid ISO datetime",
        )

    @staticmethod
    def _get_related_entities(db: Session, payload: Mapping[str, Any]) -> tuple[Any, Any]:
        """Return referenced vehicle and driver records."""
        vehicle_id = payload.get("vehicle_id")
        driver_id = payload.get("driver_id")

        if vehicle_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle is required for a trip",
            )

        if driver_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Driver is required for a trip",
            )

        vehicle = (
            VehicleRepository.get_by_id(db, vehicle_id)
            if vehicle_id is not None
            else None
        )
        driver = (
            DriverRepository.get_by_id(db, driver_id)
            if driver_id is not None
            else None
        )

        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )

        if driver is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driver not found",
            )

        return vehicle, driver

    @staticmethod
    def _validate_cargo_capacity(vehicle: Any, cargo_weight: Any) -> None:
        """Ensure trip cargo does not exceed vehicle capacity."""
        if vehicle is None or cargo_weight is None:
            return

        cargo = decimal_or_zero(cargo_weight)
        capacity = decimal_or_zero(vehicle.max_load_capacity)
        if cargo <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cargo weight must be greater than zero",
            )

        if cargo > capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Cargo weight exceeds vehicle maximum load capacity "
                    f"({cargo} > {capacity})"
                ),
            )

    @staticmethod
    def _validate_vehicle_availability(vehicle: Any) -> None:
        """Ensure a vehicle can be dispatched."""
        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle is required before dispatching a trip",
            )

        vehicle_status = coerce_enum(vehicle.status, VehicleStatus, "vehicle status")
        if not vehicle.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle is inactive and cannot be dispatched",
            )

        if vehicle_status != VehicleStatus.AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Vehicle must be Available before dispatch, found {vehicle_status.value}",
            )

    @staticmethod
    def _validate_driver_availability(driver: Any) -> None:
        """Ensure a driver can be dispatched."""
        if driver is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Driver is required before dispatching a trip",
            )

        driver_status = coerce_enum(driver.status, DriverStatus, "driver status")
        if driver_status != DriverStatus.AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Driver must be Available before dispatch, found {driver_status.value}",
            )

        expiry_date = coerce_date(driver.license_expiry, "license_expiry")
        if expiry_date < coerce_date(datetime.now(), "current date"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Driver license has expired and cannot be assigned to a trip",
            )

    @staticmethod
    def _validate_trip_timing(payload: dict[str, Any], target_status: TripStatus) -> None:
        """Validate lifecycle-specific trip timestamps."""
        departure_time = TripService._parse_datetime(
            payload.get("departure_time"),
            "departure_time",
        )
        arrival_time = TripService._parse_datetime(
            payload.get("arrival_time"),
            "arrival_time",
        )

        if departure_time is not None:
            payload["departure_time"] = departure_time

        if arrival_time is not None:
            payload["arrival_time"] = arrival_time

        if target_status == TripStatus.DISPATCHED and departure_time is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="departure_time is required before dispatching a trip",
            )

        if target_status == TripStatus.COMPLETED and arrival_time is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="arrival_time is required before completing a trip",
            )

        if departure_time is not None and arrival_time is not None:
            if arrival_time < departure_time:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="arrival_time cannot be earlier than departure_time",
                )

    @staticmethod
    def _validate_trip_rules(db: Session, payload: Mapping[str, Any]) -> tuple[Any, Any]:
        """Validate related entities, availability, license, and cargo capacity."""
        if payload.get("cargo_weight") is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cargo weight is required for a trip",
            )

        vehicle, driver = TripService._get_related_entities(db, payload)
        TripService._validate_cargo_capacity(vehicle, payload.get("cargo_weight"))
        return vehicle, driver

    @staticmethod
    def _dispatch_resources(db: Session, vehicle_id: int, driver_id: int) -> None:
        """Mark vehicle and driver as on trip."""
        VehicleRepository.update(
            db,
            vehicle_id,
            {"status": VehicleStatus.ON_TRIP},
        )
        DriverRepository.update(
            db,
            driver_id,
            {"status": DriverStatus.ON_TRIP},
        )

    @staticmethod
    def _release_resources(db: Session, vehicle_id: int, driver_id: int) -> None:
        """Mark vehicle and driver as available after trip closure."""
        VehicleRepository.update(
            db,
            vehicle_id,
            {"status": VehicleStatus.AVAILABLE},
        )
        DriverRepository.update(
            db,
            driver_id,
            {"status": DriverStatus.AVAILABLE},
        )

    @staticmethod
    def _calculate_total_cost(db: Session, trip_id: int) -> Decimal:
        """Calculate total trip cost from fuel logs and expenses."""
        fuel_logs = FuelRepository.get_by_trip_id(db, trip_id)
        expenses = ExpenseRepository.get_by_trip_id(db, trip_id)

        fuel_cost = sum((decimal_or_zero(fuel.cost) for fuel in fuel_logs), Decimal("0"))
        expense_cost = sum(
            (decimal_or_zero(expense.amount) for expense in expenses),
            Decimal("0"),
        )
        return fuel_cost + expense_cost

    @staticmethod
    def get_trip(db: Session, trip_id: int) -> Trip:
        """Return a trip or raise a not-found error."""
        trip = TripRepository.get_by_id(db, trip_id)
        if trip is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        return trip

    @staticmethod
    def list_trips(db: Session, skip: int = 0, limit: int = 100) -> list[Trip]:
        """Return trips with pagination."""
        return TripRepository.get_all(db, skip=skip, limit=limit)

    @staticmethod
    def create_trip(db: Session, data: Mapping[str, Any] | Any) -> Trip:
        """Create a trip after enforcing trip business rules."""
        payload = TripService._to_dict(data)
        trip_number = payload.get("trip_number")
        target_status = coerce_enum(
            payload.get("status", TripStatus.DRAFT),
            TripStatus,
            "trip status",
        )

        if trip_number and TripRepository.get_by_trip_number(db, trip_number) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Trip number already exists",
            )

        if target_status not in {TripStatus.DRAFT, TripStatus.DISPATCHED}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Trips can only be created as Draft or Dispatched",
            )

        payload["status"] = target_status
        vehicle, driver = TripService._validate_trip_rules(db, payload)
        TripService._validate_trip_timing(payload, target_status)

        if target_status == TripStatus.DISPATCHED:
            TripService._validate_vehicle_availability(vehicle)
            TripService._validate_driver_availability(driver)

        trip = TripRepository.create(db, payload)

        if target_status == TripStatus.DISPATCHED:
            TripService._dispatch_resources(db, trip.vehicle_id, trip.driver_id)

        return trip

    @staticmethod
    def update_trip(
        db: Session,
        trip_id: int,
        data: Mapping[str, Any] | Any,
    ) -> Trip:
        """Update a trip after enforcing trip business rules."""
        trip = TripService.get_trip(db, trip_id)
        payload = TripService._to_dict(data, exclude_unset=True)
        trip_number = payload.get("trip_number")
        current_status = coerce_enum(trip.status, TripStatus, "trip status")
        target_status = coerce_enum(
            payload.get("status", trip.status),
            TripStatus,
            "trip status",
        )

        if trip_number and trip_number != trip.trip_number:
            existing = TripRepository.get_by_trip_number(db, trip_number)
            if existing is not None and existing.id != trip_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Trip number already exists",
                )

        ensure_transition(
            current_status=current_status,
            target_status=target_status,
            allowed_transitions=TRIP_STATUS_TRANSITIONS,
            entity_name="trip",
        )

        merged_payload = {
            "vehicle_id": trip.vehicle_id,
            "driver_id": trip.driver_id,
            "cargo_weight": trip.cargo_weight,
            "departure_time": trip.departure_time,
            "arrival_time": trip.arrival_time,
            **payload,
            "status": target_status,
        }
        vehicle, driver = TripService._validate_trip_rules(db, merged_payload)

        if current_status != TripStatus.DISPATCHED and target_status == TripStatus.DISPATCHED:
            TripService._validate_vehicle_availability(vehicle)
            TripService._validate_driver_availability(driver)

        if target_status in {TripStatus.DISPATCHED, TripStatus.COMPLETED} or any(
            field in payload for field in ("departure_time", "arrival_time")
        ):
            TripService._validate_trip_timing(merged_payload, target_status)
            for field in ("departure_time", "arrival_time"):
                if field in payload:
                    payload[field] = merged_payload[field]

        payload["status"] = target_status
        updated_trip = TripRepository.update(db, trip_id, payload)
        if updated_trip is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )

        if current_status != TripStatus.DISPATCHED and target_status == TripStatus.DISPATCHED:
            TripService._dispatch_resources(db, updated_trip.vehicle_id, updated_trip.driver_id)

        if current_status == TripStatus.DISPATCHED and target_status in {
            TripStatus.COMPLETED,
            TripStatus.CANCELLED,
        }:
            TripService._release_resources(db, trip.vehicle_id, trip.driver_id)

        return updated_trip

    @staticmethod
    def delete_trip(db: Session, trip_id: int) -> bool:
        """Delete a trip or raise a not-found error."""
        trip = TripService.get_trip(db, trip_id)
        trip_status = coerce_enum(trip.status, TripStatus, "trip status")
        if trip_status == TripStatus.DISPATCHED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dispatched trips must be completed or cancelled before deletion",
            )

        deleted = TripRepository.delete(db, trip_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        return deleted

    @staticmethod
    def calculate_trip_cost(db: Session, trip_id: int) -> dict[str, Any]:
        """Return calculated cost components for a trip."""
        trip = TripService.get_trip(db, trip_id)
        total_cost = TripService._calculate_total_cost(db, trip.id)

        return {
            "trip_id": trip.id,
            "revenue": decimal_or_zero(trip.revenue),
            "total_cost": total_cost,
            "profit": decimal_or_zero(trip.revenue) - total_cost,
        }

    @staticmethod
    def calculate_trip_roi(db: Session, trip_id: int) -> dict[str, Any]:
        """Return calculated ROI metrics for a trip."""
        cost_summary = TripService.calculate_trip_cost(db, trip_id)
        roi_percentage = calculate_roi(
            cost_summary["revenue"],
            cost_summary["total_cost"],
        )

        return {
            **cost_summary,
            "roi_percentage": roi_percentage,
        }
