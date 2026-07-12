from collections.abc import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, decode_access_token, verify_password
from app.models.user import User
from app.repositories.user_repo import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class AuthService:
    """Business logic for authentication workflows."""

    @staticmethod
    def _get_role_name(user: User) -> str:
        """Return the user's role name or raise a controlled auth error."""
        role_name = getattr(user.role, "name", None)
        if not isinstance(role_name, str) or not role_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User role is not assigned",
            )
        return role_name

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
                "role": AuthService._get_role_name(user),
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }

    @staticmethod
    def get_current_user(db: Session, token: str) -> User:
        """Validate a JWT and return the authenticated active user."""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        payload = decode_access_token(token)
        if payload is None:
            raise credentials_exception

        email = payload.get("sub")
        if not isinstance(email, str) or not email:
            raise credentials_exception

        user = UserRepository.get_by_email(db, email)
        if user is None:
            raise credentials_exception

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        return user

    @staticmethod
    def get_current_user_profile(user: User) -> dict[str, object]:
        """Return the authenticated user profile payload."""
        return {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "role": AuthService._get_role_name(user),
            "is_active": user.is_active,
        }

    @staticmethod
    def require_roles(user: User, allowed_roles: tuple[str, ...]) -> User:
        """Return the user when their role is authorized."""
        user_role = AuthService._get_role_name(user)
        normalized_allowed_roles = {role.lower() for role in allowed_roles}

        if user_role.lower() not in normalized_allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        return user


def login_user(db: Session, email: str, password: str) -> dict[str, str]:
    """Authenticate a user and return an access token payload."""
    return AuthService.login_user(db, email, password)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """FastAPI dependency that returns the authenticated active user."""
    return AuthService.get_current_user(db=db, token=token)


def require_roles(*roles: str) -> Callable[[User], User]:
    """Create a FastAPI dependency that enforces role-based access control."""

    def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        return AuthService.require_roles(
            user=current_user,
            allowed_roles=tuple(roles),
        )

    return role_checker
