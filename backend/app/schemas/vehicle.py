from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import VehicleStatus


class VehicleBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    registration_number: str = Field(
        ...,
        min_length=2,
        max_length=20,
        pattern=r"^[A-Za-z0-9][A-Za-z0-9 -]*[A-Za-z0-9]$",
        examples=["KA 01 AB 1234"],
        description="Unique vehicle registration number.",
    )
    vehicle_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        pattern=r"^[A-Za-z0-9][A-Za-z0-9 ._-]*[A-Za-z0-9]$",
        examples=["Truck 12"],
        description="Display name of the vehicle.",
    )
    vehicle_type_id: int = Field(
        ...,
        gt=0,
        examples=[1],
        description="Associated vehicle type identifier.",
    )
    region_id: int = Field(
        ...,
        gt=0,
        examples=[1],
        description="Associated region identifier.",
    )
    max_load_capacity: Decimal = Field(
        ...,
        gt=Decimal("0"),
        max_digits=10,
        decimal_places=2,
        examples=[Decimal("12500.00")],
        description="Maximum supported load capacity.",
    )
    current_odometer: Decimal = Field(
        default=Decimal("0.00"),
        ge=Decimal("0"),
        max_digits=12,
        decimal_places=2,
        examples=[Decimal("0.00")],
        description="Current odometer reading.",
    )
    acquisition_cost: Decimal = Field(
        default=Decimal("0.00"),
        ge=Decimal("0"),
        max_digits=12,
        decimal_places=2,
        examples=[Decimal("2500000.00")],
        description="Vehicle acquisition cost.",
    )
    purchase_date: date | None = Field(
        default=None,
        examples=["2025-01-15"],
        description="Date the vehicle was purchased.",
    )
    status: VehicleStatus = Field(
        default=VehicleStatus.AVAILABLE,
        examples=[VehicleStatus.AVAILABLE],
        description="Current operational status.",
    )
    is_active: bool = Field(
        default=True,
        examples=[True],
        description="Whether the vehicle is active.",
    )
    created_by: int | None = Field(
        default=None,
        gt=0,
        examples=[1],
        description="User who created the vehicle record.",
    )


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    registration_number: str | None = Field(
        default=None,
        min_length=2,
        max_length=20,
        pattern=r"^[A-Za-z0-9][A-Za-z0-9 -]*[A-Za-z0-9]$",
        examples=["KA 01 AB 1234"],
    )
    vehicle_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
        pattern=r"^[A-Za-z0-9][A-Za-z0-9 ._-]*[A-Za-z0-9]$",
        examples=["Truck 12"],
    )
    vehicle_type_id: int | None = Field(
        default=None,
        gt=0,
        examples=[1],
    )
    region_id: int | None = Field(
        default=None,
        gt=0,
        examples=[1],
    )
    max_load_capacity: Decimal | None = Field(
        default=None,
        gt=Decimal("0"),
        max_digits=10,
        decimal_places=2,
        examples=[Decimal("12500.00")],
    )
    current_odometer: Decimal | None = Field(
        default=None,
        ge=Decimal("0"),
        max_digits=12,
        decimal_places=2,
        examples=[Decimal("0.00")],
    )
    acquisition_cost: Decimal | None = Field(
        default=None,
        ge=Decimal("0"),
        max_digits=12,
        decimal_places=2,
        examples=[Decimal("2500000.00")],
    )
    purchase_date: date | None = Field(
        default=None,
        examples=["2025-01-15"],
    )
    status: VehicleStatus | None = Field(
        default=None,
        examples=[VehicleStatus.AVAILABLE],
    )
    is_active: bool | None = Field(
        default=None,
        examples=[True],
    )
    created_by: int | None = Field(
        default=None,
        gt=0,
        examples=[1],
    )


class VehicleResponse(VehicleBase):
    id: int = Field(
        ...,
        gt=0,
        examples=[1],
        description="Vehicle identifier.",
    )
    created_at: datetime | None = Field(
        default=None,
        description="Record creation timestamp.",
    )
    updated_at: datetime | None = Field(
        default=None,
        description="Record last update timestamp.",
    )
