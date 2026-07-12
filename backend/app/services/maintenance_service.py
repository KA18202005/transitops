from typing import Any, Mapping

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.maintenance import MaintenanceLog
from app.repositories.maintenance_repo import MaintenanceRepository
from app.repositories.user_repo import UserRepository
from app.repositories.vehicle_repo import VehicleRepository


class MaintenanceService:
    """Business logic for maintenance workflows."""

    @staticmethod
    def _to_dict(data: Mapping[str, Any] | Any, exclude_unset: bool = False) -> dict[str, Any]:
        """Convert Pydantic or mapping input into a plain dictionary."""
        if hasattr(data, "model_dump"):
            return data.model_dump(exclude_unset=exclude_unset)
        return dict(data)

    @staticmethod
    def _validate_related_entities(db: Session, payload: Mapping[str, Any]) -> None:
        """Validate referenced vehicle and user records."""
        vehicle_id = payload.get("vehicle_id")
        created_by = payload.get("created_by")

        if vehicle_id and VehicleRepository.get_by_id(db, vehicle_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )

        if created_by and UserRepository.get_by_id(db, created_by) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Created by user not found",
            )

    @staticmethod
    def get_maintenance(db: Session, maintenance_id: int) -> MaintenanceLog:
        """Return a maintenance log or raise a not-found error."""
        maintenance = MaintenanceRepository.get_by_id(db, maintenance_id)
        if maintenance is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Maintenance log not found",
            )
        return maintenance

    @staticmethod
    def list_maintenance(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ) -> list[MaintenanceLog]:
        """Return maintenance logs with pagination."""
        return MaintenanceRepository.get_all(db, skip=skip, limit=limit)

    @staticmethod
    def create_maintenance(
        db: Session,
        data: Mapping[str, Any] | Any,
    ) -> MaintenanceLog:
        """Create a maintenance log after enforcing business rules."""
        payload = MaintenanceService._to_dict(data)
        MaintenanceService._validate_related_entities(db, payload)
        return MaintenanceRepository.create(db, payload)

    @staticmethod
    def update_maintenance(
        db: Session,
        maintenance_id: int,
        data: Mapping[str, Any] | Any,
    ) -> MaintenanceLog:
        """Update a maintenance log after enforcing business rules."""
        MaintenanceService.get_maintenance(db, maintenance_id)
        payload = MaintenanceService._to_dict(data, exclude_unset=True)
        MaintenanceService._validate_related_entities(db, payload)

        updated_maintenance = MaintenanceRepository.update(
            db,
            maintenance_id,
            payload,
        )
        if updated_maintenance is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Maintenance log not found",
            )
        return updated_maintenance

    @staticmethod
    def delete_maintenance(db: Session, maintenance_id: int) -> bool:
        """Delete a maintenance log or raise a not-found error."""
        deleted = MaintenanceRepository.delete(db, maintenance_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Maintenance log not found",
            )
        return deleted
