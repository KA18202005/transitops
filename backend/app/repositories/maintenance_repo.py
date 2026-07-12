from typing import Any, Mapping

from sqlalchemy.orm import Session

from app.models.maintenance import MaintenanceLog


class MaintenanceRepository:
    """Database access layer for maintenance logs."""

    @staticmethod
    def get_by_id(db: Session, maintenance_id: int) -> MaintenanceLog | None:
        """Return a maintenance log by primary key."""
        return (
            db.query(MaintenanceLog)
            .filter(MaintenanceLog.id == maintenance_id)
            .first()
        )

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
    ) -> list[MaintenanceLog]:
        """Return maintenance logs with pagination."""
        return db.query(MaintenanceLog).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_vehicle_id(
        db: Session,
        vehicle_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[MaintenanceLog]:
        """Return maintenance logs for a vehicle with pagination."""
        return (
            db.query(MaintenanceLog)
            .filter(MaintenanceLog.vehicle_id == vehicle_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def create(db: Session, data: Mapping[str, Any]) -> MaintenanceLog:
        """Create and persist a maintenance log."""
        maintenance = MaintenanceLog(**dict(data))
        db.add(maintenance)
        db.commit()
        db.refresh(maintenance)
        return maintenance

    @staticmethod
    def update(
        db: Session,
        maintenance_id: int,
        data: Mapping[str, Any],
    ) -> MaintenanceLog | None:
        """Update a maintenance log by primary key."""
        maintenance = MaintenanceRepository.get_by_id(db, maintenance_id)
        if maintenance is None:
            return None

        for field, value in data.items():
            setattr(maintenance, field, value)

        db.commit()
        db.refresh(maintenance)
        return maintenance

    @staticmethod
    def delete(db: Session, maintenance_id: int) -> bool:
        """Delete a maintenance log by primary key."""
        maintenance = MaintenanceRepository.get_by_id(db, maintenance_id)
        if maintenance is None:
            return False

        db.delete(maintenance)
        db.commit()
        return True
