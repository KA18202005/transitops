from typing import Any

from fastapi import APIRouter, Depends, status

from app.core.database import get_db
from app.schemas.report import (
    DriverPerformanceReport,
    FuelConsumptionReport,
    MaintenanceHistoryReport,
    MonthlyExpensesReport,
    VehicleUtilizationReport,
)
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get(
    "/vehicle-utilization",
    response_model=VehicleUtilizationReport,
    status_code=status.HTTP_200_OK,
    summary="Get vehicle utilization report",
    description="Return vehicle-level utilization metrics based on trips and distance.",
    responses={status.HTTP_200_OK: {"description": "Vehicle utilization report retrieved successfully."}},
)
def get_vehicle_utilization(
    limit: int = 1000,
    db: Any = Depends(get_db),
):
    """Get vehicle utilization report using the service layer."""
    return ReportService.get_vehicle_utilization(db=db, limit=limit)


@router.get(
    "/driver-performance",
    response_model=DriverPerformanceReport,
    status_code=status.HTTP_200_OK,
    summary="Get driver performance report",
    description="Return driver performance metrics based on trip outcomes, distance, revenue, and safety score.",
    responses={status.HTTP_200_OK: {"description": "Driver performance report retrieved successfully."}},
)
def get_driver_performance(
    limit: int = 1000,
    db: Any = Depends(get_db),
):
    """Get driver performance report using the service layer."""
    return ReportService.get_driver_performance(db=db, limit=limit)


@router.get(
    "/monthly-expenses",
    response_model=MonthlyExpensesReport,
    status_code=status.HTTP_200_OK,
    summary="Get monthly expenses report",
    description="Return monthly grouped fuel, maintenance, and other expense totals.",
    responses={status.HTTP_200_OK: {"description": "Monthly expenses report retrieved successfully."}},
)
def get_monthly_expenses(
    limit: int = 1000,
    db: Any = Depends(get_db),
):
    """Get monthly expenses report using the service layer."""
    return ReportService.get_monthly_expenses(db=db, limit=limit)


@router.get(
    "/fuel-consumption",
    response_model=FuelConsumptionReport,
    status_code=status.HTTP_200_OK,
    summary="Get fuel consumption report",
    description="Return vehicle-level fuel consumption, fuel cost, and average cost per liter.",
    responses={status.HTTP_200_OK: {"description": "Fuel consumption report retrieved successfully."}},
)
def get_fuel_consumption(
    limit: int = 1000,
    db: Any = Depends(get_db),
):
    """Get fuel consumption report using the service layer."""
    return ReportService.get_fuel_consumption(db=db, limit=limit)


@router.get(
    "/maintenance-history",
    response_model=MaintenanceHistoryReport,
    status_code=status.HTTP_200_OK,
    summary="Get maintenance history report",
    description="Return maintenance history entries with costs, dates, status, and vehicle references.",
    responses={status.HTTP_200_OK: {"description": "Maintenance history report retrieved successfully."}},
)
def get_maintenance_history(
    limit: int = 1000,
    db: Any = Depends(get_db),
):
    """Get maintenance history report using the service layer."""
    return ReportService.get_maintenance_history(db=db, limit=limit)
