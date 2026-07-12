from typing import Any, Mapping

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.repositories.user_repo import UserRepository


class UserService:
    """Business logic for user workflows."""

    @staticmethod
    def _to_dict(data: Mapping[str, Any] | Any, exclude_unset: bool = False) -> dict[str, Any]:
        """Convert Pydantic or mapping input into a plain dictionary."""
        if hasattr(data, "model_dump"):
            return data.model_dump(exclude_unset=exclude_unset)
        return dict(data)

    @staticmethod
    def _apply_password_hash(payload: dict[str, Any]) -> None:
        """Convert a plain password field into password_hash."""
        password = payload.pop("password", None)
        if password:
            payload["password_hash"] = hash_password(password)

    @staticmethod
    def get_user(db: Session, user_id: int) -> User:
        """Return a user or raise a not-found error."""
        user = UserRepository.get_by_id(db, user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user

    @staticmethod
    def list_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Return users with pagination."""
        return UserRepository.get_all(db, skip=skip, limit=limit)

    @staticmethod
    def create_user(db: Session, data: Mapping[str, Any] | Any) -> User:
        """Create a user after enforcing user business rules."""
        payload = UserService._to_dict(data)
        existing_user = UserRepository.get_by_email(db, payload["email"])
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User email already exists",
            )

        UserService._apply_password_hash(payload)
        return UserRepository.create(db, payload)

    @staticmethod
    def update_user(db: Session, user_id: int, data: Mapping[str, Any] | Any) -> User:
        """Update a user after enforcing user business rules."""
        user = UserService.get_user(db, user_id)
        payload = UserService._to_dict(data, exclude_unset=True)
        email = payload.get("email")

        if email and email != user.email:
            existing_user = UserRepository.get_by_email(db, email)
            if existing_user is not None and existing_user.id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="User email already exists",
                )

        UserService._apply_password_hash(payload)
        updated_user = UserRepository.update(db, user_id, payload)
        if updated_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return updated_user

    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """Delete a user or raise a not-found error."""
        deleted = UserRepository.delete(db, user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return deleted
