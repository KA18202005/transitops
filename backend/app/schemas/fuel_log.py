from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class FuelLogResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "vehicle_id": 1,
                "trip_id": 1,
                "liters": "120.50",
                "cost": "11500.00",
                "fuel_station": "TransitOps Fuel Hub",
                "date": "2025-01-15",
                "created_at": "2025-01-15T09:00:00Z",
            }
        },
    )

    id: int = Field(..., gt=0)
    vehicle_id: int = Field(..., gt=0)
    trip_id: int = Field(..., gt=0)
    liters: Decimal = Field(..., gt=Decimal("0"), max_digits=10, decimal_places=2)
    cost: Decimal = Field(..., gt=Decimal("0"), max_digits=10, decimal_places=2)
    fuel_station: str | None = Field(default=None, max_length=100)
    date: date
    created_at: datetime | None = None
