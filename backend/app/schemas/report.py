from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class VehicleUtilizationItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    vehicle_id: int = Field(..., gt=0)
    registration_number: str = Field(..., min_length=1, max_length=20)
    vehicle_name: str = Field(..., min_length=1, max_length=100)
    status: str = Field(..., min_length=1, max_length=50)
    total_trips: int = Field(..., ge=0)
    completed_trips: int = Field(..., ge=0)
    running_trips: int = Field(..., ge=0)
    planned_distance: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    actual_distance: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    utilization_percentage: Decimal | None = Field(default=None, max_digits=8, decimal_places=2)


class VehicleUtilizationReport(BaseModel):
    items: list[VehicleUtilizationItem]


class DriverPerformanceItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    driver_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    license_number: str = Field(..., min_length=1, max_length=50)
    status: str = Field(..., min_length=1, max_length=50)
    safety_score: Decimal = Field(..., ge=Decimal("0"), max_digits=5, decimal_places=2)
    total_trips: int = Field(..., ge=0)
    completed_trips: int = Field(..., ge=0)
    cancelled_trips: int = Field(..., ge=0)
    total_distance: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    total_revenue: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    completion_rate: Decimal | None = Field(default=None, max_digits=8, decimal_places=2)


class DriverPerformanceReport(BaseModel):
    items: list[DriverPerformanceItem]


class MonthlyExpenseItem(BaseModel):
    month: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    fuel_cost: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    maintenance_cost: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    other_expenses: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    total_expenses: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)


class MonthlyExpensesReport(BaseModel):
    items: list[MonthlyExpenseItem]


class FuelConsumptionItem(BaseModel):
    vehicle_id: int = Field(..., gt=0)
    registration_number: str = Field(..., min_length=1, max_length=20)
    total_liters: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    total_cost: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    fuel_log_count: int = Field(..., ge=0)
    average_cost_per_liter: Decimal | None = Field(default=None, max_digits=10, decimal_places=2)


class FuelConsumptionReport(BaseModel):
    items: list[FuelConsumptionItem]


class MaintenanceHistoryItem(BaseModel):
    maintenance_id: int = Field(..., gt=0)
    vehicle_id: int = Field(..., gt=0)
    issue: str = Field(..., min_length=1, max_length=200)
    status: str = Field(..., min_length=1, max_length=50)
    maintenance_cost: Decimal = Field(..., ge=Decimal("0"), max_digits=14, decimal_places=2)
    start_date: date | None = None
    end_date: date | None = None
    created_by: int | None = Field(default=None, gt=0)


class MaintenanceHistoryReport(BaseModel):
    items: list[MaintenanceHistoryItem]
