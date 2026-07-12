from typing import Any

from fastapi import APIRouter, Body, Depends, Response, status

from app.core.database import get_db
from app.schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate
from app.services.vehicle_service import VehicleService

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"],
)


@router.get(
    "/",
    response_model=list[VehicleResponse],
    status_code=status.HTTP_200_OK,
    summary="List vehicles",
    description="Return a paginated list of vehicles.",
    responses={
        status.HTTP_200_OK: {
            "description": "Vehicles retrieved successfully.",
        },
    },
)
def list_vehicles(
    skip: int = 0,
    limit: int = 100,
    db: Any = Depends(get_db),
):
    """List vehicles using the service layer."""
    return VehicleService.list_vehicles(db=db, skip=skip, limit=limit)


@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse,
    status_code=status.HTTP_200_OK,
    summary="Get vehicle",
    description="Return a vehicle by its unique identifier.",
    responses={
        status.HTTP_200_OK: {
            "description": "Vehicle retrieved successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Vehicle not found.",
            "content": {
                "application/json": {
                    "example": {"detail": "Vehicle not found"},
                }
            },
        },
    },
)
def get_vehicle(
    vehicle_id: int,
    db: Any = Depends(get_db),
):
    """Get a vehicle using the service layer."""
    return VehicleService.get_vehicle(db=db, vehicle_id=vehicle_id)


@router.post(
    "/",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create vehicle",
    description="Create a new vehicle record.",
    responses={
        status.HTTP_201_CREATED: {
            "description": "Vehicle created successfully.",
        },
        status.HTTP_409_CONFLICT: {
            "description": "Vehicle registration number already exists.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Vehicle registration number already exists",
                    },
                }
            },
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def create_vehicle(
    request: VehicleCreate = Body(
        ...,
        openapi_examples={
            "vehicle": {
                "summary": "Create vehicle",
                "value": {
                    "registration_number": "KA 01 AB 1234",
                    "vehicle_name": "Truck 12",
                    "vehicle_type_id": 1,
                    "region_id": 1,
                    "max_load_capacity": "12500.00",
                    "current_odometer": "0.00",
                    "acquisition_cost": "2500000.00",
                    "purchase_date": "2025-01-15",
                    "status": "Available",
                    "is_active": True,
                    "created_by": 1,
                },
            }
        },
    ),
    db: Any = Depends(get_db),
):
    """Create a vehicle using the service layer."""
    return VehicleService.create_vehicle(db=db, data=request)


@router.put(
    "/{vehicle_id}",
    response_model=VehicleResponse,
    status_code=status.HTTP_200_OK,
    summary="Update vehicle",
    description="Update an existing vehicle record.",
    responses={
        status.HTTP_200_OK: {
            "description": "Vehicle updated successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Vehicle not found.",
            "content": {
                "application/json": {
                    "example": {"detail": "Vehicle not found"},
                }
            },
        },
        status.HTTP_409_CONFLICT: {
            "description": "Vehicle registration number already exists.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Vehicle registration number already exists",
                    },
                }
            },
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def update_vehicle(
    vehicle_id: int,
    request: VehicleUpdate,
    db: Any = Depends(get_db),
):
    """Update a vehicle using the service layer."""
    return VehicleService.update_vehicle(
        db=db,
        vehicle_id=vehicle_id,
        data=request,
    )


@router.delete(
    "/{vehicle_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete vehicle",
    description="Delete an existing vehicle record.",
    responses={
        status.HTTP_204_NO_CONTENT: {
            "description": "Vehicle deleted successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Vehicle not found.",
            "content": {
                "application/json": {
                    "example": {"detail": "Vehicle not found"},
                }
            },
        },
    },
)
def delete_vehicle(
    vehicle_id: int,
    db: Any = Depends(get_db),
):
    """Delete a vehicle using the service layer."""
    VehicleService.delete_vehicle(db=db, vehicle_id=vehicle_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
