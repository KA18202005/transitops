from typing import Any, Mapping

from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    """Database access layer for users."""

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> User | None:
        """Return a user by primary key."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        """Return a user by email address."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Return users with pagination."""
        return db.query(User).offset(skip).limit(limit).all()

    @staticmethod
    def create(db: Session, data: Mapping[str, Any]) -> User:
        """Create and persist a user."""
        user = User(**dict(data))
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update(
        db: Session,
        user_id: int,
        data: Mapping[str, Any],
    ) -> User | None:
        """Update a user by primary key."""
        user = UserRepository.get_by_id(db, user_id)
        if user is None:
            return None

        for field, value in data.items():
            setattr(user, field, value)

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete(db: Session, user_id: int) -> bool:
        """Delete a user by primary key."""
        user = UserRepository.get_by_id(db, user_id)
        if user is None:
            return False

        db.delete(user)
        db.commit()
        return True


def get_user_by_email(db: Session, email: str) -> User | None:
    """Return a user by email address."""
    return UserRepository.get_by_email(db, email)
