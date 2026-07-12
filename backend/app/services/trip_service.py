from typing import Any, Mapping

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.repositories.driver_repo import DriverRepository
from app.repositories.trip_repo import TripRepository
from app.repositories.vehicle_repo import VehicleRepository


class TripService:
    """Business logic for trip workflows."""

    @staticmethod
    def _to_dict(data: Mapping[str, Any] | Any, exclude_unset: bool = False) -> dict[str, Any]:
        """Convert Pydantic or mapping input into a plain dictionary."""
        if hasattr(data, "model_dump"):
            return data.model_dump(exclude_unset=exclude_unset)
        return dict(data)

    @staticmethod
    def _validate_related_entities(db: Session, payload: Mapping[str, Any]) -> None:
        """Validate referenced vehicle and driver records."""
        vehicle_id = payload.get("vehicle_id")
        driver_id = payload.get("driver_id")

        if vehicle_id and VehicleRepository.get_by_id(db, vehicle_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )

        if driver_id and DriverRepository.get_by_id(db, driver_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driver not found",
            )

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

        if trip_number and TripRepository.get_by_trip_number(db, trip_number) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Trip number already exists",
            )

        TripService._validate_related_entities(db, payload)
        return TripRepository.create(db, payload)

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

        if trip_number and trip_number != trip.trip_number:
            existing = TripRepository.get_by_trip_number(db, trip_number)
            if existing is not None and existing.id != trip_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Trip number already exists",
                )

        TripService._validate_related_entities(db, payload)
        updated_trip = TripRepository.update(db, trip_id, payload)
        if updated_trip is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        return updated_trip

    @staticmethod
    def delete_trip(db: Session, trip_id: int) -> bool:
        """Delete a trip or raise a not-found error."""
        deleted = TripRepository.delete(db, trip_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        return deleted
