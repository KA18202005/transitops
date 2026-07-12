from typing import Any

from fastapi import APIRouter, Depends, status

from app.core.database import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/",
    response_model=DashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard summary",
    description="Return operational dashboard metrics for vehicles, drivers, trips, costs, revenue, and ROI.",
    responses={
        status.HTTP_200_OK: {
            "description": "Dashboard summary retrieved successfully.",
        },
    },
)
def get_dashboard_summary(
    limit: int = 1000,
    db: Any = Depends(get_db),
):
    """Get dashboard metrics using the service layer."""
    return DashboardService.get_summary(db=db, limit=limit)
