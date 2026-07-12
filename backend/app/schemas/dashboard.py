from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class DashboardResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_vehicles": 25,
                "vehicles_available": 18,
                "drivers_available": 14,
                "trips_running": 6,
                "trips_completed": 120,
                "fuel_cost": "250000.00",
                "maintenance_cost": "75000.00",
                "revenue": "900000.00",
                "roi": "176.92",
            }
        }
    )

    total_vehicles: int = Field(
        ...,
        ge=0,
        description="Total number of vehicles in the fleet.",
    )
    vehicles_available: int = Field(
        ...,
        ge=0,
        description="Number of active vehicles currently available.",
    )
    drivers_available: int = Field(
        ...,
        ge=0,
        description="Number of drivers currently available.",
    )
    trips_running: int = Field(
        ...,
        ge=0,
        description="Number of trips currently dispatched and running.",
    )
    trips_completed: int = Field(
        ...,
        ge=0,
        description="Number of completed trips.",
    )
    fuel_cost: Decimal = Field(
        ...,
        ge=Decimal("0"),
        max_digits=14,
        decimal_places=2,
        description="Total fuel cost.",
    )
    maintenance_cost: Decimal = Field(
        ...,
        ge=Decimal("0"),
        max_digits=14,
        decimal_places=2,
        description="Total maintenance cost.",
    )
    revenue: Decimal = Field(
        ...,
        ge=Decimal("0"),
        max_digits=14,
        decimal_places=2,
        description="Total trip revenue.",
    )
    roi: Decimal | None = Field(
        default=None,
        max_digits=8,
        decimal_places=2,
        description="Return on investment percentage.",
    )
