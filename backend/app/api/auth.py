from fastapi import APIRouter, Body, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import CurrentUserResponse, LoginRequest, TokenResponse
from app.services.auth_service import AuthService, get_current_user, login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user",
    description=(
        "Validates a user's email and password, then returns a bearer access "
        "token for authenticated TransitOps API requests."
    ),
    responses={
        status.HTTP_200_OK: {
            "description": "Authentication succeeded.",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": (
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        ),
                        "token_type": "bearer",
                    }
                }
            },
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Invalid email or password.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invalid email or password",
                    }
                }
            },
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Authenticated user account is inactive.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "User account is inactive",
                    }
                }
            },
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {
                                "type": "missing",
                                "loc": ["body", "password"],
                                "msg": "Field required",
                                "input": {
                                    "email": "dispatcher@transitops.com",
                                },
                            }
                        ]
                    }
                }
            },
        },
    },
)
def login(
    request: LoginRequest = Body(
        ...,
        openapi_examples={
            "validCredentials": {
                "summary": "Valid credentials",
                "description": "Credentials for a registered TransitOps user.",
                "value": {
                    "email": "dispatcher@transitops.com",
                    "password": "StrongPassword123",
                },
            }
        },
    ),
    db: Session = Depends(get_db)
):
    return login_user(
        db=db,
        email=request.email,
        password=request.password
    )


@router.get(
    "/me",
    response_model=CurrentUserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user",
    description=(
        "Validates the bearer JWT and returns the authenticated user's profile "
        "and role details."
    ),
    responses={
        status.HTTP_200_OK: {
            "description": "Authenticated user profile retrieved successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "full_name": "TransitOps Dispatcher",
                        "email": "dispatcher@transitops.com",
                        "phone": "9876543210",
                        "role": "Dispatcher",
                        "is_active": True,
                    }
                }
            },
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Missing, expired, or invalid bearer token.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Could not validate credentials",
                    }
                }
            },
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Authenticated user account is inactive.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "User account is inactive",
                    }
                }
            },
        },
    },
)
def me(
    current_user=Depends(get_current_user),
):
    """Return the authenticated user profile."""
    return AuthService.get_current_user_profile(current_user)
