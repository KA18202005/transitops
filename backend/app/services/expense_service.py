from typing import Any, Mapping

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.repositories.expense_repo import ExpenseRepository
from app.repositories.trip_repo import TripRepository
from app.repositories.vehicle_repo import VehicleRepository


class ExpenseService:
    """Business logic for expense workflows."""

    @staticmethod
    def _to_dict(data: Mapping[str, Any] | Any, exclude_unset: bool = False) -> dict[str, Any]:
        """Convert Pydantic or mapping input into a plain dictionary."""
        if hasattr(data, "model_dump"):
            return data.model_dump(exclude_unset=exclude_unset)
        return dict(data)

    @staticmethod
    def _validate_related_entities(db: Session, payload: Mapping[str, Any]) -> None:
        """Validate referenced vehicle and trip records."""
        vehicle_id = payload.get("vehicle_id")
        trip_id = payload.get("trip_id")

        vehicle = None
        trip = None

        if vehicle_id:
            vehicle = VehicleRepository.get_by_id(db, vehicle_id)
            if vehicle is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Vehicle not found",
                )

        if trip_id:
            trip = TripRepository.get_by_id(db, trip_id)
            if trip is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Trip not found",
                )

        if vehicle is not None and trip is not None and trip.vehicle_id != vehicle.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Expense vehicle must match the trip vehicle",
            )

    @staticmethod
    def get_expense(db: Session, expense_id: int) -> Expense:
        """Return an expense or raise a not-found error."""
        expense = ExpenseRepository.get_by_id(db, expense_id)
        if expense is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found",
            )
        return expense

    @staticmethod
    def list_expenses(db: Session, skip: int = 0, limit: int = 100) -> list[Expense]:
        """Return expenses with pagination."""
        return ExpenseRepository.get_all(db, skip=skip, limit=limit)

    @staticmethod
    def create_expense(db: Session, data: Mapping[str, Any] | Any) -> Expense:
        """Create an expense after enforcing business rules."""
        payload = ExpenseService._to_dict(data)
        ExpenseService._validate_related_entities(db, payload)
        return ExpenseRepository.create(db, payload)

    @staticmethod
    def update_expense(
        db: Session,
        expense_id: int,
        data: Mapping[str, Any] | Any,
    ) -> Expense:
        """Update an expense after enforcing business rules."""
        expense = ExpenseService.get_expense(db, expense_id)
        payload = ExpenseService._to_dict(data, exclude_unset=True)
        merged_payload = {
            "vehicle_id": expense.vehicle_id,
            "trip_id": expense.trip_id,
            **payload,
        }

        ExpenseService._validate_related_entities(db, merged_payload)
        updated_expense = ExpenseRepository.update(db, expense_id, payload)
        if updated_expense is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found",
            )
        return updated_expense

    @staticmethod
    def delete_expense(db: Session, expense_id: int) -> bool:
        """Delete an expense or raise a not-found error."""
        deleted = ExpenseRepository.delete(db, expense_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found",
            )
        return deleted
