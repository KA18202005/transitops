from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LoginRequest(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "dispatcher@transitops.com",
                "password": "StrongPassword123",
            }
        }
    )

    email: EmailStr = Field(
        ...,
        examples=["dispatcher@transitops.com"],
        description="Registered user email address.",
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        pattern=r"^\S.*\S$|^\S$",
        examples=["StrongPassword123"],
        description="Registered user password.",
    )


class TokenResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
            }
        }
    )

    access_token: str = Field(
        ...,
        min_length=20,
        pattern=r"^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$",
        examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
        description="JWT access token for authenticated API requests.",
    )
    token_type: str = Field(
        default="bearer",
        pattern=r"^bearer$",
        examples=["bearer"],
        description="Authentication token type.",
    )


class TokenData(BaseModel):
    email: EmailStr | None = Field(
        default=None,
        description="Email address encoded in the access token.",
    )
    role: str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
        pattern=r"^[A-Za-z][A-Za-z0-9 _-]*$",
        description="User role encoded in the access token.",
    )


class CurrentUserResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "full_name": "TransitOps Dispatcher",
                "email": "dispatcher@transitops.com",
                "phone": "9876543210",
                "role": "Dispatcher",
                "is_active": True,
            }
        },
    )

    id: int = Field(
        ...,
        gt=0,
        examples=[1],
        description="Authenticated user identifier.",
    )
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        examples=["TransitOps Dispatcher"],
        description="Authenticated user's full name.",
    )
    email: EmailStr = Field(
        ...,
        examples=["dispatcher@transitops.com"],
        description="Authenticated user's email address.",
    )
    phone: str | None = Field(
        default=None,
        min_length=7,
        max_length=15,
        pattern=r"^[0-9+\- ]+$",
        examples=["9876543210"],
        description="Authenticated user's phone number.",
    )
    role: str = Field(
        ...,
        min_length=1,
        max_length=50,
        pattern=r"^[A-Za-z][A-Za-z0-9 _-]*$",
        examples=["Dispatcher"],
        description="Authenticated user's role.",
    )
    is_active: bool = Field(
        ...,
        examples=[True],
        description="Whether the authenticated user account is active.",
    )
