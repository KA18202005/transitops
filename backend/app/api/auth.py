from fastapi import APIRouter, Body, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import login_user

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
