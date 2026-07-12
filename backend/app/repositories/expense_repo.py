from typing import Any, Mapping

from sqlalchemy.orm import Session

from app.models.expense import Expense


class ExpenseRepository:
    """Database access layer for expenses."""

    @staticmethod
    def get_by_id(db: Session, expense_id: int) -> Expense | None:
        """Return an expense by primary key."""
        return db.query(Expense).filter(Expense.id == expense_id).first()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Expense]:
        """Return expenses with pagination."""
        return db.query(Expense).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_vehicle_id(
        db: Session,
        vehicle_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Expense]:
        """Return expenses for a vehicle with pagination."""
        return (
            db.query(Expense)
            .filter(Expense.vehicle_id == vehicle_id)
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
    ) -> list[Expense]:
        """Return expenses for a trip with pagination."""
        return (
            db.query(Expense)
            .filter(Expense.trip_id == trip_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def create(db: Session, data: Mapping[str, Any]) -> Expense:
        """Create and persist an expense."""
        expense = Expense(**dict(data))
        db.add(expense)
        db.commit()
        db.refresh(expense)
        return expense

    @staticmethod
    def update(
        db: Session,
        expense_id: int,
        data: Mapping[str, Any],
    ) -> Expense | None:
        """Update an expense by primary key."""
        expense = ExpenseRepository.get_by_id(db, expense_id)
        if expense is None:
            return None

        for field, value in data.items():
            setattr(expense, field, value)

        db.commit()
        db.refresh(expense)
        return expense

    @staticmethod
    def delete(db: Session, expense_id: int) -> bool:
        """Delete an expense by primary key."""
        expense = ExpenseRepository.get_by_id(db, expense_id)
        if expense is None:
            return False

        db.delete(expense)
        db.commit()
        return True
