from typing import Any, Mapping

from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle


class VehicleRepository:
    """Database access layer for vehicles."""

    @staticmethod
    def get_by_id(db: Session, vehicle_id: int) -> Vehicle | None:
        """Return a vehicle by primary key."""
        return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    @staticmethod
    def get_by_registration_number(
        db: Session,
        registration_number: str,
    ) -> Vehicle | None:
        """Return a vehicle by registration number."""
        return (
            db.query(Vehicle)
            .filter(Vehicle.registration_number == registration_number)
            .first()
        )

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Vehicle]:
        """Return vehicles with pagination."""
        return db.query(Vehicle).offset(skip).limit(limit).all()

    @staticmethod
    def create(db: Session, data: Mapping[str, Any]) -> Vehicle:
        """Create and persist a vehicle."""
        vehicle = Vehicle(**dict(data))
        db.add(vehicle)
        db.commit()
        db.refresh(vehicle)
        return vehicle

    @staticmethod
    def update(
        db: Session,
        vehicle_id: int,
        data: Mapping[str, Any],
    ) -> Vehicle | None:
        """Update a vehicle by primary key."""
        vehicle = VehicleRepository.get_by_id(db, vehicle_id)
        if vehicle is None:
            return None

        for field, value in data.items():
            setattr(vehicle, field, value)

        db.commit()
        db.refresh(vehicle)
        return vehicle

    @staticmethod
    def delete(db: Session, vehicle_id: int) -> bool:
        """Delete a vehicle by primary key."""
        vehicle = VehicleRepository.get_by_id(db, vehicle_id)
        if vehicle is None:
            return False

        db.delete(vehicle)
        db.commit()
        return True
