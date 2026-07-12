from typing import Any, Mapping

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enums import MaintenanceStatus, VehicleStatus
from app.models.maintenance import MaintenanceLog
from app.repositories.maintenance_repo import MaintenanceRepository
from app.repositories.user_repo import UserRepository
from app.repositories.vehicle_repo import VehicleRepository
from app.services.business_rules import coerce_date, coerce_enum, ensure_transition


MAINTENANCE_STATUS_TRANSITIONS: dict[MaintenanceStatus, set[MaintenanceStatus]] = {
    MaintenanceStatus.PENDING: {
        MaintenanceStatus.IN_PROGRESS,
        MaintenanceStatus.COMPLETED,
    },
    MaintenanceStatus.IN_PROGRESS: {MaintenanceStatus.COMPLETED},
    MaintenanceStatus.COMPLETED: set(),
}


class MaintenanceService:
    """Business logic for maintenance workflows."""

    @staticmethod
    def _to_dict(data: Mapping[str, Any] | Any, exclude_unset: bool = False) -> dict[str, Any]:
        """Convert Pydantic or mapping input into a plain dictionary."""
        if hasattr(data, "model_dump"):
            return data.model_dump(exclude_unset=exclude_unset)
        return dict(data)

    @staticmethod
    def _validate_related_entities(db: Session, payload: Mapping[str, Any]) -> Any:
        """Validate referenced vehicle and user records."""
        vehicle_id = payload.get("vehicle_id")
        created_by = payload.get("created_by")
        vehicle = None

        if vehicle_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle is required for a maintenance log",
            )

        if vehicle_id is not None:
            vehicle = VehicleRepository.get_by_id(db, vehicle_id)

        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )

        if created_by and UserRepository.get_by_id(db, created_by) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Created by user not found",
            )

        return vehicle

    @staticmethod
    def _validate_dates(payload: dict[str, Any], target_status: MaintenanceStatus) -> None:
        """Validate maintenance date workflow rules."""
        start_date = payload.get("start_date")
        end_date = payload.get("end_date")

        parsed_start_date = coerce_date(start_date, "start_date") if start_date else None
        parsed_end_date = coerce_date(end_date, "end_date") if end_date else None

        if parsed_start_date is not None:
            payload["start_date"] = parsed_start_date

        if parsed_end_date is not None:
            payload["end_date"] = parsed_end_date

        if target_status == MaintenanceStatus.IN_PROGRESS and parsed_start_date is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="start_date is required before starting maintenance",
            )

        if target_status == MaintenanceStatus.COMPLETED and parsed_end_date is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="end_date is required before completing maintenance",
            )

        if parsed_start_date and parsed_end_date and parsed_end_date < parsed_start_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="end_date cannot be earlier than start_date",
            )

    @staticmethod
    def _validate_vehicle_for_work(vehicle: Any) -> None:
        """Ensure a vehicle can enter maintenance."""
        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle is required before maintenance can start",
            )

        vehicle_status = coerce_enum(vehicle.status, VehicleStatus, "vehicle status")
        if not vehicle.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive vehicles cannot start maintenance",
            )

        if vehicle_status != VehicleStatus.AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Vehicle must be Available before maintenance can start, "
                    f"found {vehicle_status.value}"
                ),
            )

    @staticmethod
    def _sync_vehicle_status(
        db: Session,
        vehicle_id: int,
        target_status: MaintenanceStatus,
    ) -> None:
        """Update vehicle status for maintenance lifecycle changes."""
        vehicle = VehicleRepository.get_by_id(db, vehicle_id)
        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )

        if target_status == MaintenanceStatus.IN_PROGRESS:
            VehicleRepository.update(
                db,
                vehicle_id,
                {"status": VehicleStatus.IN_SHOP},
            )

        if target_status == MaintenanceStatus.COMPLETED:
            vehicle_status = coerce_enum(vehicle.status, VehicleStatus, "vehicle status")
            if vehicle_status == VehicleStatus.IN_SHOP:
                VehicleRepository.update(
                    db,
                    vehicle_id,
                    {"status": VehicleStatus.AVAILABLE},
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
        target_status = coerce_enum(
            payload.get("status", MaintenanceStatus.PENDING),
            MaintenanceStatus,
            "maintenance status",
        )
        payload["status"] = target_status

        vehicle = MaintenanceService._validate_related_entities(db, payload)
        MaintenanceService._validate_dates(payload, target_status)

        if target_status == MaintenanceStatus.IN_PROGRESS:
            MaintenanceService._validate_vehicle_for_work(vehicle)

        maintenance = MaintenanceRepository.create(db, payload)

        if target_status in {
            MaintenanceStatus.IN_PROGRESS,
            MaintenanceStatus.COMPLETED,
        }:
            MaintenanceService._sync_vehicle_status(
                db,
                maintenance.vehicle_id,
                target_status,
            )

        return maintenance

    @staticmethod
    def update_maintenance(
        db: Session,
        maintenance_id: int,
        data: Mapping[str, Any] | Any,
    ) -> MaintenanceLog:
        """Update a maintenance log after enforcing business rules."""
        maintenance = MaintenanceService.get_maintenance(db, maintenance_id)
        payload = MaintenanceService._to_dict(data, exclude_unset=True)
        current_status = coerce_enum(
            maintenance.status,
            MaintenanceStatus,
            "maintenance status",
        )
        target_status = coerce_enum(
            payload.get("status", maintenance.status),
            MaintenanceStatus,
            "maintenance status",
        )
        ensure_transition(
            current_status=current_status,
            target_status=target_status,
            allowed_transitions=MAINTENANCE_STATUS_TRANSITIONS,
            entity_name="maintenance",
        )

        merged_payload = {
            "vehicle_id": maintenance.vehicle_id,
            "start_date": maintenance.start_date,
            "end_date": maintenance.end_date,
            **payload,
            "status": target_status,
        }
        vehicle = MaintenanceService._validate_related_entities(db, merged_payload)
        MaintenanceService._validate_dates(merged_payload, target_status)
        for field in ("start_date", "end_date"):
            if field in payload:
                payload[field] = merged_payload[field]

        if (
            current_status != MaintenanceStatus.IN_PROGRESS
            and target_status == MaintenanceStatus.IN_PROGRESS
        ):
            MaintenanceService._validate_vehicle_for_work(vehicle)

        payload["status"] = target_status

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

        if current_status != target_status and target_status in {
            MaintenanceStatus.IN_PROGRESS,
            MaintenanceStatus.COMPLETED,
        }:
            MaintenanceService._sync_vehicle_status(
                db,
                updated_maintenance.vehicle_id,
                target_status,
            )

        return updated_maintenance

    @staticmethod
    def delete_maintenance(db: Session, maintenance_id: int) -> bool:
        """Delete a maintenance log or raise a not-found error."""
        maintenance = MaintenanceService.get_maintenance(db, maintenance_id)
        maintenance_status = coerce_enum(
            maintenance.status,
            MaintenanceStatus,
            "maintenance status",
        )
        if maintenance_status == MaintenanceStatus.IN_PROGRESS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="In-progress maintenance must be completed before deletion",
            )

        deleted = MaintenanceRepository.delete(db, maintenance_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Maintenance log not found",
            )
        return deleted
