from typing import Any, Mapping

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.driver import Driver
from app.repositories.driver_repo import DriverRepository


class DriverService:
    """Business logic for driver workflows."""

    @staticmethod
    def _to_dict(data: Mapping[str, Any] | Any, exclude_unset: bool = False) -> dict[str, Any]:
        """Convert Pydantic or mapping input into a plain dictionary."""
        if hasattr(data, "model_dump"):
            return data.model_dump(exclude_unset=exclude_unset)
        return dict(data)

    @staticmethod
    def get_driver(db: Session, driver_id: int) -> Driver:
        """Return a driver or raise a not-found error."""
        driver = DriverRepository.get_by_id(db, driver_id)
        if driver is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driver not found",
            )
        return driver

    @staticmethod
    def list_drivers(db: Session, skip: int = 0, limit: int = 100) -> list[Driver]:
        """Return drivers with pagination."""
        return DriverRepository.get_all(db, skip=skip, limit=limit)

    @staticmethod
    def create_driver(db: Session, data: Mapping[str, Any] | Any) -> Driver:
        """Create a driver after enforcing driver business rules."""
        payload = DriverService._to_dict(data)
        user_id = payload.get("user_id")
        license_number = payload.get("license_number")

        if user_id and DriverRepository.get_by_user_id(db, user_id) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User is already assigned to a driver profile",
            )

        if license_number:
            existing = DriverRepository.get_by_license_number(db, license_number)
            if existing is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Driver license number already exists",
                )

        return DriverRepository.create(db, payload)

    @staticmethod
    def update_driver(
        db: Session,
        driver_id: int,
        data: Mapping[str, Any] | Any,
    ) -> Driver:
        """Update a driver after enforcing driver business rules."""
        driver = DriverService.get_driver(db, driver_id)
        payload = DriverService._to_dict(data, exclude_unset=True)
        user_id = payload.get("user_id")
        license_number = payload.get("license_number")

        if user_id and user_id != driver.user_id:
            existing = DriverRepository.get_by_user_id(db, user_id)
            if existing is not None and existing.id != driver_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="User is already assigned to a driver profile",
                )

        if license_number and license_number != driver.license_number:
            existing = DriverRepository.get_by_license_number(db, license_number)
            if existing is not None and existing.id != driver_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Driver license number already exists",
                )

        updated_driver = DriverRepository.update(db, driver_id, payload)
        if updated_driver is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driver not found",
            )
        return updated_driver

    @staticmethod
    def delete_driver(db: Session, driver_id: int) -> bool:
        """Delete a driver or raise a not-found error."""
        deleted = DriverRepository.delete(db, driver_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driver not found",
            )
        return deleted
