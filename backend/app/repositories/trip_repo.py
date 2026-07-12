from typing import Any, Mapping

from sqlalchemy.orm import Session

from app.models.trip import Trip


class TripRepository:
    """Database access layer for trips."""

    @staticmethod
    def get_by_id(db: Session, trip_id: int) -> Trip | None:
        """Return a trip by primary key."""
        return db.query(Trip).filter(Trip.id == trip_id).first()

    @staticmethod
    def get_by_trip_number(db: Session, trip_number: str) -> Trip | None:
        """Return a trip by trip number."""
        return db.query(Trip).filter(Trip.trip_number == trip_number).first()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Trip]:
        """Return trips with pagination."""
        return db.query(Trip).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_vehicle_id(
        db: Session,
        vehicle_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Trip]:
        """Return trips for a vehicle with pagination."""
        return (
            db.query(Trip)
            .filter(Trip.vehicle_id == vehicle_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_driver_id(
        db: Session,
        driver_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Trip]:
        """Return trips for a driver with pagination."""
        return (
            db.query(Trip)
            .filter(Trip.driver_id == driver_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def create(db: Session, data: Mapping[str, Any]) -> Trip:
        """Create and persist a trip."""
        trip = Trip(**dict(data))
        db.add(trip)
        db.commit()
        db.refresh(trip)
        return trip

    @staticmethod
    def update(
        db: Session,
        trip_id: int,
        data: Mapping[str, Any],
    ) -> Trip | None:
        """Update a trip by primary key."""
        trip = TripRepository.get_by_id(db, trip_id)
        if trip is None:
            return None

        for field, value in data.items():
            setattr(trip, field, value)

        db.commit()
        db.refresh(trip)
        return trip

    @staticmethod
    def delete(db: Session, trip_id: int) -> bool:
        """Delete a trip by primary key."""
        trip = TripRepository.get_by_id(db, trip_id)
        if trip is None:
            return False

        db.delete(trip)
        db.commit()
        return True
