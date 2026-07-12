from typing import Any, Mapping

from sqlalchemy.orm import Session

from app.models.fuel_log import FuelLog


class FuelRepository:
    """Database access layer for fuel logs."""

    @staticmethod
    def get_by_id(db: Session, fuel_log_id: int) -> FuelLog | None:
        """Return a fuel log by primary key."""
        return db.query(FuelLog).filter(FuelLog.id == fuel_log_id).first()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[FuelLog]:
        """Return fuel logs with pagination."""
        return db.query(FuelLog).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_vehicle_id(
        db: Session,
        vehicle_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[FuelLog]:
        """Return fuel logs for a vehicle with pagination."""
        return (
            db.query(FuelLog)
            .filter(FuelLog.vehicle_id == vehicle_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_trip_id(
        db: Session,
        trip_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[FuelLog]:
        """Return fuel logs for a trip with pagination."""
        return (
            db.query(FuelLog)
            .filter(FuelLog.trip_id == trip_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def create(db: Session, data: Mapping[str, Any]) -> FuelLog:
        """Create and persist a fuel log."""
        fuel_log = FuelLog(**dict(data))
        db.add(fuel_log)
        db.commit()
        db.refresh(fuel_log)
        return fuel_log

    @staticmethod
    def update(
        db: Session,
        fuel_log_id: int,
        data: Mapping[str, Any],
    ) -> FuelLog | None:
        """Update a fuel log by primary key."""
        fuel_log = FuelRepository.get_by_id(db, fuel_log_id)
        if fuel_log is None:
            return None

        for field, value in data.items():
            setattr(fuel_log, field, value)

        db.commit()
        db.refresh(fuel_log)
        return fuel_log

    @staticmethod
    def delete(db: Session, fuel_log_id: int) -> bool:
        """Delete a fuel log by primary key."""
        fuel_log = FuelRepository.get_by_id(db, fuel_log_id)
        if fuel_log is None:
            return False

        db.delete(fuel_log)
        db.commit()
        return True
