from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import TripStatus


class TripResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "trip_number": "TRIP-2025-001",
                "vehicle_id": 1,
                "driver_id": 1,
                "source": "Bengaluru",
                "destination": "Chennai",
                "cargo_weight": "7500.00",
                "planned_distance": "350.00",
                "actual_distance": "340.00",
                "fuel_used": "120.50",
                "revenue": "45000.00",
                "status": "Completed",
                "departure_time": "2025-01-15T09:00:00",
                "arrival_time": "2025-01-15T18:00:00",
                "created_by": 1,
                "created_at": "2025-01-15T09:00:00Z",
                "updated_at": "2025-01-15T18:00:00Z",
            }
        },
    )

    id: int = Field(..., gt=0)
    trip_number: str = Field(..., min_length=1, max_length=30)
    vehicle_id: int = Field(..., gt=0)
    driver_id: int = Field(..., gt=0)
    source: str = Field(..., min_length=1, max_length=150)
    destination: str = Field(..., min_length=1, max_length=150)
    cargo_weight: Decimal = Field(..., ge=Decimal("0"), max_digits=10, decimal_places=2)
    planned_distance: Decimal = Field(..., ge=Decimal("0"), max_digits=10, decimal_places=2)
    actual_distance: Decimal = Field(..., ge=Decimal("0"), max_digits=10, decimal_places=2)
    fuel_used: Decimal = Field(..., ge=Decimal("0"), max_digits=10, decimal_places=2)
    revenue: Decimal = Field(..., ge=Decimal("0"), max_digits=12, decimal_places=2)
    status: TripStatus
    departure_time: datetime | None = None
    arrival_time: datetime | None = None
    created_by: int | None = Field(default=None, gt=0)
    created_at: datetime | None = None
    updated_at: datetime | None = None
