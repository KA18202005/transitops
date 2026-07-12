from typing import Any, Mapping

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enums import VehicleStatus
from app.models.vehicle import Vehicle
from app.repositories.vehicle_repo import VehicleRepository
from app.services.business_rules import coerce_enum, ensure_transition


VEHICLE_STATUS_TRANSITIONS: dict[VehicleStatus, set[VehicleStatus]] = {
    VehicleStatus.AVAILABLE: {
        VehicleStatus.ON_TRIP,
        VehicleStatus.IN_SHOP,
        VehicleStatus.RETIRED,
    },
    VehicleStatus.ON_TRIP: {VehicleStatus.AVAILABLE},
    VehicleStatus.IN_SHOP: {
        VehicleStatus.AVAILABLE,
        VehicleStatus.RETIRED,
    },
    VehicleStatus.RETIRED: set(),
}


class VehicleService:
    """Business logic for vehicle workflows."""

    @staticmethod
    def _to_dict(data: Mapping[str, Any] | Any, exclude_unset: bool = False) -> dict[str, Any]:
        """Convert Pydantic or mapping input into a plain dictionary."""
        if hasattr(data, "model_dump"):
            return data.model_dump(exclude_unset=exclude_unset)
        return dict(data)

    @staticmethod
    def _validate_create_status(payload: dict[str, Any]) -> None:
        """Validate vehicle status during creation."""
        if "status" not in payload or payload["status"] is None:
            return

        target_status = coerce_enum(payload["status"], VehicleStatus, "vehicle status")
        if target_status == VehicleStatus.ON_TRIP:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle cannot be created with On Trip status",
            )

        if target_status == VehicleStatus.RETIRED:
            payload["is_active"] = False

        payload["status"] = target_status

    @staticmethod
    def _validate_status_transition(vehicle: Vehicle, payload: dict[str, Any]) -> None:
        """Validate and normalize vehicle status changes."""
        if "status" in payload and payload["status"] is not None:
            current_status = coerce_enum(
                vehicle.status,
                VehicleStatus,
                "vehicle status",
            )
            target_status = coerce_enum(
                payload["status"],
                VehicleStatus,
                "vehicle status",
            )
            ensure_transition(
                current_status=current_status,
                target_status=target_status,
                allowed_transitions=VEHICLE_STATUS_TRANSITIONS,
                entity_name="vehicle",
            )

            if target_status == VehicleStatus.RETIRED:
                payload["is_active"] = False

            payload["status"] = target_status

        target_status = payload.get("status", vehicle.status)
        target_status = coerce_enum(target_status, VehicleStatus, "vehicle status")
        if target_status == VehicleStatus.RETIRED and payload.get("is_active") is True:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Retired vehicles cannot be marked active",
            )

    @staticmethod
    def get_vehicle(db: Session, vehicle_id: int) -> Vehicle:
        """Return a vehicle or raise a not-found error."""
        vehicle = VehicleRepository.get_by_id(db, vehicle_id)
        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )
        return vehicle

    @staticmethod
    def list_vehicles(db: Session, skip: int = 0, limit: int = 100) -> list[Vehicle]:
        """Return vehicles with pagination."""
        return VehicleRepository.get_all(db, skip=skip, limit=limit)

    @staticmethod
    def create_vehicle(db: Session, data: Mapping[str, Any] | Any) -> Vehicle:
        """Create a vehicle after enforcing vehicle business rules."""
        payload = VehicleService._to_dict(data)
        registration_number = payload.get("registration_number")

        if registration_number:
            existing = VehicleRepository.get_by_registration_number(
                db,
                registration_number,
            )
            if existing is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Vehicle registration number already exists",
                )

        VehicleService._validate_create_status(payload)
        return VehicleRepository.create(db, payload)

    @staticmethod
    def update_vehicle(
        db: Session,
        vehicle_id: int,
        data: Mapping[str, Any] | Any,
    ) -> Vehicle:
        """Update a vehicle after enforcing vehicle business rules."""
        vehicle = VehicleService.get_vehicle(db, vehicle_id)
        payload = VehicleService._to_dict(data, exclude_unset=True)
        registration_number = payload.get("registration_number")

        if registration_number and registration_number != vehicle.registration_number:
            existing = VehicleRepository.get_by_registration_number(
                db,
                registration_number,
            )
            if existing is not None and existing.id != vehicle_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Vehicle registration number already exists",
                )

        VehicleService._validate_status_transition(vehicle, payload)
        updated_vehicle = VehicleRepository.update(db, vehicle_id, payload)
        if updated_vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )
        return updated_vehicle

    @staticmethod
    def delete_vehicle(db: Session, vehicle_id: int) -> bool:
        """Delete a vehicle or raise a not-found error."""
        deleted = VehicleRepository.delete(db, vehicle_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )
        return deleted
