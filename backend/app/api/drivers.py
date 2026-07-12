from typing import Any

from fastapi import APIRouter, Body, Depends, Response, status

from app.core.database import get_db
from app.schemas.driver import DriverResponse
from app.services.driver_service import DriverService

router = APIRouter(
    prefix="/drivers",
    tags=["Drivers"],
)


@router.get(
    "/",
    response_model=list[DriverResponse],
    status_code=status.HTTP_200_OK,
    summary="List drivers",
    description="Return a paginated list of drivers.",
    responses={status.HTTP_200_OK: {"description": "Drivers retrieved successfully."}},
)
def list_drivers(
    skip: int = 0,
    limit: int = 100,
    db: Any = Depends(get_db),
):
    """List drivers using the service layer."""
    return DriverService.list_drivers(db=db, skip=skip, limit=limit)


@router.get(
    "/{driver_id}",
    response_model=DriverResponse,
    status_code=status.HTTP_200_OK,
    summary="Get driver",
    description="Return a driver by its unique identifier.",
    responses={
        status.HTTP_200_OK: {"description": "Driver retrieved successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "Driver not found.",
            "content": {
                "application/json": {"example": {"detail": "Driver not found"}},
            },
        },
    },
)
def get_driver(
    driver_id: int,
    db: Any = Depends(get_db),
):
    """Get a driver using the service layer."""
    return DriverService.get_driver(db=db, driver_id=driver_id)


@router.post(
    "/",
    response_model=DriverResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create driver",
    description="Create a new driver profile.",
    responses={
        status.HTTP_201_CREATED: {"description": "Driver created successfully."},
        status.HTTP_400_BAD_REQUEST: {
            "description": "Driver validation failed.",
            "content": {
                "application/json": {
                    "example": {"detail": "Driver license has expired"},
                }
            },
        },
        status.HTTP_409_CONFLICT: {
            "description": "Driver user or license number already exists.",
            "content": {
                "application/json": {
                    "example": {"detail": "Driver license number already exists"},
                }
            },
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def create_driver(
    request: dict[str, Any] = Body(
        ...,
        openapi_examples={
            "driver": {
                "summary": "Create driver",
                "value": {
                    "user_id": 1,
                    "license_number": "DL-123456",
                    "license_category": "HMV",
                    "license_expiry": "2028-12-31",
                    "safety_score": "100.00",
                    "status": "Available",
                },
            }
        },
    ),
    db: Any = Depends(get_db),
):
    """Create a driver using the service layer."""
    return DriverService.create_driver(db=db, data=request)


@router.put(
    "/{driver_id}",
    response_model=DriverResponse,
    status_code=status.HTTP_200_OK,
    summary="Update driver",
    description="Update an existing driver profile.",
    responses={
        status.HTTP_200_OK: {"description": "Driver updated successfully."},
        status.HTTP_400_BAD_REQUEST: {
            "description": "Driver validation failed.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invalid driver status transition from Available to On Trip",
                    },
                }
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Driver not found.",
            "content": {
                "application/json": {"example": {"detail": "Driver not found"}},
            },
        },
        status.HTTP_409_CONFLICT: {
            "description": "Driver user or license number already exists.",
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def update_driver(
    driver_id: int,
    request: dict[str, Any],
    db: Any = Depends(get_db),
):
    """Update a driver using the service layer."""
    return DriverService.update_driver(db=db, driver_id=driver_id, data=request)


@router.delete(
    "/{driver_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete driver",
    description="Delete an existing driver profile.",
    responses={
        status.HTTP_204_NO_CONTENT: {"description": "Driver deleted successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "Driver not found.",
            "content": {
                "application/json": {"example": {"detail": "Driver not found"}},
            },
        },
    },
)
def delete_driver(
    driver_id: int,
    db: Any = Depends(get_db),
):
    """Delete a driver using the service layer."""
    DriverService.delete_driver(db=db, driver_id=driver_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
