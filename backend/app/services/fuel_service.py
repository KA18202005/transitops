from typing import Any, Mapping

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enums import TripStatus
from app.models.fuel_log import FuelLog
from app.repositories.fuel_repo import FuelRepository
from app.repositories.trip_repo import TripRepository
from app.repositories.vehicle_repo import VehicleRepository
from app.services.business_rules import coerce_date, coerce_enum, decimal_or_zero


class FuelService:
    """Business logic for fuel log workflows."""

    @staticmethod
    def _to_dict(data: Mapping[str, Any] | Any, exclude_unset: bool = False) -> dict[str, Any]:
        """Convert Pydantic or mapping input into a plain dictionary."""
        if hasattr(data, "model_dump"):
            return data.model_dump(exclude_unset=exclude_unset)
        return dict(data)

    @staticmethod
    def _validate_related_entities(db: Session, payload: Mapping[str, Any]) -> None:
        """Validate referenced vehicle and trip records."""
        vehicle_id = payload.get("vehicle_id")
        trip_id = payload.get("trip_id")

        if vehicle_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle is required for a fuel log",
            )

        if trip_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Trip is required for a fuel log",
            )

        vehicle = None
        trip = None

        if vehicle_id is not None:
            vehicle = VehicleRepository.get_by_id(db, vehicle_id)
            if vehicle is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Vehicle not found",
                )

        if trip_id is not None:
            trip = TripRepository.get_by_id(db, trip_id)
            if trip is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Trip not found",
                )

        if vehicle is not None and trip is not None and trip.vehicle_id != vehicle.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fuel log vehicle must match the trip vehicle",
            )

        if trip is not None:
            trip_status = coerce_enum(trip.status, TripStatus, "trip status")
            if trip_status in {TripStatus.DRAFT, TripStatus.CANCELLED}:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Fuel logs can only be added to dispatched or completed trips",
                )

    @staticmethod
    def _validate_payload(payload: dict[str, Any]) -> None:
        """Validate and normalize fuel log payload values."""
        if "date" in payload and payload["date"] is not None:
            payload["date"] = coerce_date(payload["date"], "date")

        if "liters" in payload and decimal_or_zero(payload["liters"]) <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fuel liters must be greater than zero",
            )

        if "cost" in payload and decimal_or_zero(payload["cost"]) <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fuel cost must be greater than zero",
            )

    @staticmethod
    def get_fuel_log(db: Session, fuel_log_id: int) -> FuelLog:
        """Return a fuel log or raise a not-found error."""
        fuel_log = FuelRepository.get_by_id(db, fuel_log_id)
        if fuel_log is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fuel log not found",
            )
        return fuel_log

    @staticmethod
    def list_fuel_logs(db: Session, skip: int = 0, limit: int = 100) -> list[FuelLog]:
        """Return fuel logs with pagination."""
        return FuelRepository.get_all(db, skip=skip, limit=limit)

    @staticmethod
    def create_fuel_log(db: Session, data: Mapping[str, Any] | Any) -> FuelLog:
        """Create a fuel log after enforcing business rules."""
        payload = FuelService._to_dict(data)
        FuelService._validate_related_entities(db, payload)
        FuelService._validate_payload(payload)
        return FuelRepository.create(db, payload)

    @staticmethod
    def update_fuel_log(
        db: Session,
        fuel_log_id: int,
        data: Mapping[str, Any] | Any,
    ) -> FuelLog:
        """Update a fuel log after enforcing business rules."""
        fuel_log = FuelService.get_fuel_log(db, fuel_log_id)
        payload = FuelService._to_dict(data, exclude_unset=True)
        merged_payload = {
            "vehicle_id": fuel_log.vehicle_id,
            "trip_id": fuel_log.trip_id,
            **payload,
        }

        FuelService._validate_related_entities(db, merged_payload)
        FuelService._validate_payload(payload)
        updated_fuel_log = FuelRepository.update(db, fuel_log_id, payload)
        if updated_fuel_log is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fuel log not found",
            )
        return updated_fuel_log

    @staticmethod
    def delete_fuel_log(db: Session, fuel_log_id: int) -> bool:
        """Delete a fuel log or raise a not-found error."""
        deleted = FuelRepository.delete(db, fuel_log_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fuel log not found",
            )
        return deleted
