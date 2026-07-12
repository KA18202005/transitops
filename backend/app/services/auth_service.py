from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.user_repo import get_user_by_email
from app.core.security import verify_password, create_access_token


def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role.name
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }