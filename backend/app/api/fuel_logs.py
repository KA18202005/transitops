from typing import Any

from fastapi import APIRouter, Body, Depends, Response, status

from app.core.database import get_db
from app.schemas.fuel_log import FuelLogResponse
from app.services.fuel_service import FuelService

router = APIRouter(
    prefix="/fuel",
    tags=["Fuel Logs"],
)


@router.get(
    "/",
    response_model=list[FuelLogResponse],
    status_code=status.HTTP_200_OK,
    summary="List fuel logs",
    description="Return a paginated list of fuel logs.",
    responses={
        status.HTTP_200_OK: {"description": "Fuel logs retrieved successfully."},
    },
)
def list_fuel_logs(
    skip: int = 0,
    limit: int = 100,
    db: Any = Depends(get_db),
):
    """List fuel logs using the service layer."""
    return FuelService.list_fuel_logs(db=db, skip=skip, limit=limit)


@router.get(
    "/{fuel_log_id}",
    response_model=FuelLogResponse,
    status_code=status.HTTP_200_OK,
    summary="Get fuel log",
    description="Return a fuel log by its unique identifier.",
    responses={
        status.HTTP_200_OK: {"description": "Fuel log retrieved successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "Fuel log not found.",
            "content": {
                "application/json": {"example": {"detail": "Fuel log not found"}},
            },
        },
    },
)
def get_fuel_log(
    fuel_log_id: int,
    db: Any = Depends(get_db),
):
    """Get a fuel log using the service layer."""
    return FuelService.get_fuel_log(db=db, fuel_log_id=fuel_log_id)


@router.post(
    "/",
    response_model=FuelLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create fuel log",
    description="Create a new fuel log.",
    responses={
        status.HTTP_201_CREATED: {"description": "Fuel log created successfully."},
        status.HTTP_400_BAD_REQUEST: {
            "description": "Fuel log business validation failed.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Fuel log vehicle must match the trip vehicle",
                    },
                }
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Related vehicle or trip not found.",
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def create_fuel_log(
    request: dict[str, Any] = Body(
        ...,
        openapi_examples={
            "fuelLog": {
                "summary": "Create fuel log",
                "value": {
                    "vehicle_id": 1,
                    "trip_id": 1,
                    "liters": "120.50",
                    "cost": "11500.00",
                    "fuel_station": "TransitOps Fuel Hub",
                    "date": "2025-01-15",
                },
            }
        },
    ),
    db: Any = Depends(get_db),
):
    """Create a fuel log using the service layer."""
    return FuelService.create_fuel_log(db=db, data=request)


@router.put(
    "/{fuel_log_id}",
    response_model=FuelLogResponse,
    status_code=status.HTTP_200_OK,
    summary="Update fuel log",
    description="Update an existing fuel log.",
    responses={
        status.HTTP_200_OK: {"description": "Fuel log updated successfully."},
        status.HTTP_400_BAD_REQUEST: {
            "description": "Fuel log business validation failed.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Fuel cost must be greater than zero",
                    },
                }
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Fuel log or related record not found.",
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def update_fuel_log(
    fuel_log_id: int,
    request: dict[str, Any],
    db: Any = Depends(get_db),
):
    """Update a fuel log using the service layer."""
    return FuelService.update_fuel_log(
        db=db,
        fuel_log_id=fuel_log_id,
        data=request,
    )


@router.delete(
    "/{fuel_log_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete fuel log",
    description="Delete an existing fuel log.",
    responses={
        status.HTTP_204_NO_CONTENT: {"description": "Fuel log deleted successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "Fuel log not found.",
            "content": {
                "application/json": {"example": {"detail": "Fuel log not found"}},
            },
        },
    },
)
def delete_fuel_log(
    fuel_log_id: int,
    db: Any = Depends(get_db),
):
    """Delete a fuel log using the service layer."""
    FuelService.delete_fuel_log(db=db, fuel_log_id=fuel_log_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
