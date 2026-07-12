from typing import Any

from fastapi import APIRouter, Body, Depends, Response, status

from app.core.database import get_db
from app.schemas.trip import TripResponse
from app.services.trip_service import TripService

router = APIRouter(
    prefix="/trips",
    tags=["Trips"],
)


@router.get(
    "/",
    response_model=list[TripResponse],
    status_code=status.HTTP_200_OK,
    summary="List trips",
    description="Return a paginated list of trips.",
    responses={status.HTTP_200_OK: {"description": "Trips retrieved successfully."}},
)
def list_trips(
    skip: int = 0,
    limit: int = 100,
    db: Any = Depends(get_db),
):
    """List trips using the service layer."""
    return TripService.list_trips(db=db, skip=skip, limit=limit)


@router.get(
    "/{trip_id}",
    response_model=TripResponse,
    status_code=status.HTTP_200_OK,
    summary="Get trip",
    description="Return a trip by its unique identifier.",
    responses={
        status.HTTP_200_OK: {"description": "Trip retrieved successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "Trip not found.",
            "content": {
                "application/json": {"example": {"detail": "Trip not found"}},
            },
        },
    },
)
def get_trip(
    trip_id: int,
    db: Any = Depends(get_db),
):
    """Get a trip using the service layer."""
    return TripService.get_trip(db=db, trip_id=trip_id)


@router.post(
    "/",
    response_model=TripResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create trip",
    description="Create a new trip.",
    responses={
        status.HTTP_201_CREATED: {"description": "Trip created successfully."},
        status.HTTP_400_BAD_REQUEST: {
            "description": "Trip business validation failed.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Cargo weight exceeds vehicle maximum load capacity (15000.00 > 12500.00)",
                    },
                }
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Related vehicle or driver not found.",
        },
        status.HTTP_409_CONFLICT: {
            "description": "Trip number already exists.",
            "content": {
                "application/json": {
                    "example": {"detail": "Trip number already exists"},
                }
            },
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def create_trip(
    request: dict[str, Any] = Body(
        ...,
        openapi_examples={
            "trip": {
                "summary": "Create trip",
                "value": {
                    "trip_number": "TRIP-2025-001",
                    "vehicle_id": 1,
                    "driver_id": 1,
                    "source": "Bengaluru",
                    "destination": "Chennai",
                    "cargo_weight": "7500.00",
                    "planned_distance": "350.00",
                    "actual_distance": "0.00",
                    "fuel_used": "0.00",
                    "revenue": "45000.00",
                    "status": "Draft",
                    "departure_time": "2025-01-15T09:00:00",
                    "arrival_time": None,
                    "created_by": 1,
                },
            }
        },
    ),
    db: Any = Depends(get_db),
):
    """Create a trip using the service layer."""
    return TripService.create_trip(db=db, data=request)


@router.put(
    "/{trip_id}",
    response_model=TripResponse,
    status_code=status.HTTP_200_OK,
    summary="Update trip",
    description="Update an existing trip.",
    responses={
        status.HTTP_200_OK: {"description": "Trip updated successfully."},
        status.HTTP_400_BAD_REQUEST: {
            "description": "Trip business validation failed.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invalid trip status transition from Completed to Dispatched",
                    },
                }
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Trip or related record not found.",
        },
        status.HTTP_409_CONFLICT: {"description": "Trip number already exists."},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def update_trip(
    trip_id: int,
    request: dict[str, Any],
    db: Any = Depends(get_db),
):
    """Update a trip using the service layer."""
    return TripService.update_trip(db=db, trip_id=trip_id, data=request)


@router.delete(
    "/{trip_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete trip",
    description="Delete an existing trip.",
    responses={
        status.HTTP_204_NO_CONTENT: {"description": "Trip deleted successfully."},
        status.HTTP_400_BAD_REQUEST: {
            "description": "Trip cannot be deleted in its current lifecycle state.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Dispatched trips must be completed or cancelled before deletion",
                    },
                }
            },
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Trip not found.",
            "content": {
                "application/json": {"example": {"detail": "Trip not found"}},
            },
        },
    },
)
def delete_trip(
    trip_id: int,
    db: Any = Depends(get_db),
):
    """Delete a trip using the service layer."""
    TripService.delete_trip(db=db, trip_id=trip_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
