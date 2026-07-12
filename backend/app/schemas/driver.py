from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import DriverStatus


class DriverResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "user_id": 1,
                "license_number": "DL-123456",
                "license_category": "HMV",
                "license_expiry": "2028-12-31",
                "safety_score": "100.00",
                "status": "Available",
                "created_at": "2025-01-15T09:00:00Z",
                "updated_at": "2025-01-15T09:00:00Z",
            }
        },
    )

    id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    license_number: str = Field(..., min_length=1, max_length=50)
    license_category: str = Field(..., min_length=1, max_length=20)
    license_expiry: date
    safety_score: Decimal = Field(..., ge=Decimal("0"), max_digits=5, decimal_places=2)
    status: DriverStatus
    full_name: str | None = None
    phone: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
