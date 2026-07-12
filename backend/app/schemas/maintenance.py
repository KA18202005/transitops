from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import MaintenanceStatus


class MaintenanceResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "vehicle_id": 1,
                "issue": "Brake inspection",
                "description": "Routine brake pad inspection",
                "maintenance_cost": "1500.00",
                "start_date": "2025-01-15",
                "end_date": "2025-01-16",
                "status": "Completed",
                "created_by": 1,
                "created_at": "2025-01-15T09:00:00Z",
                "updated_at": "2025-01-16T09:00:00Z",
            }
        },
    )

    id: int = Field(..., gt=0)
    vehicle_id: int = Field(..., gt=0)
    issue: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    maintenance_cost: Decimal = Field(..., ge=Decimal("0"), max_digits=12, decimal_places=2)
    start_date: date | None = None
    end_date: date | None = None
    status: MaintenanceStatus
    created_by: int | None = Field(default=None, gt=0)
    created_at: datetime | None = None
    updated_at: datetime | None = None
