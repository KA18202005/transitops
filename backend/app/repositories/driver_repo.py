from typing import Any, Mapping

from sqlalchemy.orm import Session

from app.models.driver import Driver


class DriverRepository:
    """Database access layer for drivers."""

    @staticmethod
    def get_by_id(db: Session, driver_id: int) -> Driver | None:
        """Return a driver by primary key."""
        return db.query(Driver).filter(Driver.id == driver_id).first()

    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Driver | None:
        """Return a driver by related user ID."""
        return db.query(Driver).filter(Driver.user_id == user_id).first()

    @staticmethod
    def get_by_license_number(
        db: Session,
        license_number: str,
    ) -> Driver | None:
        """Return a driver by license number."""
        return (
            db.query(Driver)
            .filter(Driver.license_number == license_number)
            .first()
        )

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Driver]:
        """Return drivers with pagination."""
        return db.query(Driver).offset(skip).limit(limit).all()

    @staticmethod
    def create(db: Session, data: Mapping[str, Any]) -> Driver:
        """Create and persist a driver."""
        driver = Driver(**dict(data))
        db.add(driver)
        db.commit()
        db.refresh(driver)
        return driver

    @staticmethod
    def update(
        db: Session,
        driver_id: int,
        data: Mapping[str, Any],
    ) -> Driver | None:
        """Update a driver by primary key."""
        driver = DriverRepository.get_by_id(db, driver_id)
        if driver is None:
            return None

        for field, value in data.items():
            setattr(driver, field, value)

        db.commit()
        db.refresh(driver)
        return driver

    @staticmethod
    def delete(db: Session, driver_id: int) -> bool:
        """Delete a driver by primary key."""
        driver = DriverRepository.get_by_id(db, driver_id)
        if driver is None:
            return False

        db.delete(driver)
        db.commit()
        return True
