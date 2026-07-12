from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    role_id: int = Field(..., gt=0, description="Assigned role identifier.")
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str | None = Field(
        default=None,
        min_length=7,
        max_length=15,
        pattern=r"^[0-9+\- ]+$",
    )
    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    role_id: int | None = Field(default=None, gt=0)
    full_name: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)
    phone: str | None = Field(
        default=None,
        min_length=7,
        max_length=15,
        pattern=r"^[0-9+\- ]+$",
    )
    is_active: bool | None = None


class UserResponse(UserBase):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "role_id": 1,
                "full_name": "TransitOps Dispatcher",
                "email": "dispatcher@transitops.com",
                "phone": "9876543210",
                "is_active": True,
                "created_at": "2025-01-15T09:00:00Z",
                "updated_at": "2025-01-15T09:00:00Z",
            }
        },
    )

    id: int = Field(..., gt=0)
    created_at: datetime | None = None
    updated_at: datetime | None = None
