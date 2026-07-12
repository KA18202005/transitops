from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import verify_password, create_access_token
from app.repositories.user_repo import UserRepository


class AuthService:
    """Business logic for authentication workflows."""

    @staticmethod
    def login_user(db: Session, email: str, password: str) -> dict[str, str]:
        """Authenticate a user and return an access token payload."""
        user = UserRepository.get_by_email(db, email)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        token = create_access_token(
            {
                "sub": user.email,
                "role": user.role.name,
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }


def login_user(db: Session, email: str, password: str) -> dict[str, str]:
    """Authenticate a user and return an access token payload."""
    return AuthService.login_user(db, email, password)
