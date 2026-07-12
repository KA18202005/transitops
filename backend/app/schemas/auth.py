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
