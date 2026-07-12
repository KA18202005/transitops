from typing import Any

from fastapi import APIRouter, Body, Depends, Response, status

from app.core.database import get_db
from app.services.maintenance_service import MaintenanceService

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"],
)


@router.get(
    "/",
    response_model=list[Any],
    status_code=status.HTTP_200_OK,
    summary="List maintenance logs",
    description="Return a paginated list of maintenance logs.",
    responses={
        status.HTTP_200_OK: {
            "description": "Maintenance logs retrieved successfully.",
        },
    },
)
def list_maintenance(
    skip: int = 0,
    limit: int = 100,
    db: Any = Depends(get_db),
):
    """List maintenance logs using the service layer."""
    return MaintenanceService.list_maintenance(db=db, skip=skip, limit=limit)


@router.get(
    "/{maintenance_id}",
    response_model=Any,
    status_code=status.HTTP_200_OK,
    summary="Get maintenance log",
    description="Return a maintenance log by its unique identifier.",
    responses={
        status.HTTP_200_OK: {
            "description": "Maintenance log retrieved successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Maintenance log not found.",
            "content": {
                "application/json": {
                    "example": {"detail": "Maintenance log not found"},
                }
            },
        },
    },
)
def get_maintenance(
    maintenance_id: int,
    db: Any = Depends(get_db),
):
    """Get a maintenance log using the service layer."""
    return MaintenanceService.get_maintenance(
        db=db,
        maintenance_id=maintenance_id,
    )


@router.post(
    "/",
    response_model=Any,
    status_code=status.HTTP_201_CREATED,
    summary="Create maintenance log",
    description="Create a new maintenance log.",
    responses={
        status.HTTP_201_CREATED: {
            "description": "Maintenance log created successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Related vehicle or user not found.",
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def create_maintenance(
    request: dict[str, Any] = Body(
        ...,
        openapi_examples={
            "maintenance": {
                "summary": "Create maintenance log",
                "value": {
                    "vehicle_id": 1,
                    "issue": "Brake inspection",
                    "description": "Routine brake pad inspection",
                    "maintenance_cost": "1500.00",
                    "start_date": "2025-01-15",
                    "end_date": None,
                    "status": "Pending",
                    "created_by": 1,
                },
            }
        },
    ),
    db: Any = Depends(get_db),
):
    """Create a maintenance log using the service layer."""
    return MaintenanceService.create_maintenance(db=db, data=request)


@router.put(
    "/{maintenance_id}",
    response_model=Any,
    status_code=status.HTTP_200_OK,
    summary="Update maintenance log",
    description="Update an existing maintenance log.",
    responses={
        status.HTTP_200_OK: {
            "description": "Maintenance log updated successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Maintenance log or related record not found.",
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def update_maintenance(
    maintenance_id: int,
    request: dict[str, Any],
    db: Any = Depends(get_db),
):
    """Update a maintenance log using the service layer."""
    return MaintenanceService.update_maintenance(
        db=db,
        maintenance_id=maintenance_id,
        data=request,
    )


@router.delete(
    "/{maintenance_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete maintenance log",
    description="Delete an existing maintenance log.",
    responses={
        status.HTTP_204_NO_CONTENT: {
            "description": "Maintenance log deleted successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Maintenance log not found.",
            "content": {
                "application/json": {
                    "example": {"detail": "Maintenance log not found"},
                }
            },
        },
    },
)
def delete_maintenance(
    maintenance_id: int,
    db: Any = Depends(get_db),
):
    """Delete a maintenance log using the service layer."""
    MaintenanceService.delete_maintenance(db=db, maintenance_id=maintenance_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
