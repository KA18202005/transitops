from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ExpenseType


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "trip_id": 1,
                "vehicle_id": 1,
                "type": "Toll",
                "amount": "850.00",
                "description": "Highway toll charge",
                "expense_date": "2025-01-15",
                "created_at": "2025-01-15T09:00:00Z",
            }
        },
    )

    id: int = Field(..., gt=0)
    trip_id: int = Field(..., gt=0)
    vehicle_id: int = Field(..., gt=0)
    type: ExpenseType
    amount: Decimal = Field(..., gt=Decimal("0"), max_digits=12, decimal_places=2)
    description: str | None = None
    expense_date: date
    created_at: datetime | None = None
