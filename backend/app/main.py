from fastapi import FastAPI, status

from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.drivers import router as drivers_router
from app.api.expenses import router as expenses_router
from app.api.fuel_logs import router as fuel_logs_router
from app.api.maintenance import router as maintenance_router
from app.api.reports import router as reports_router
from app.api.trips import router as trips_router
from app.api.users import router as users_router
from app.api.vehicles import router as vehicles_router
from app.schemas.health import HealthResponse

app = FastAPI(
    title="TransitOps API",
    description="Backend API for TransitOps Smart Transport Operations Platform",
    version="1.0.0"
)

# Register API routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(vehicles_router)
app.include_router(drivers_router)
app.include_router(trips_router)
app.include_router(maintenance_router)
app.include_router(fuel_logs_router)
app.include_router(expenses_router)
app.include_router(dashboard_router)
app.include_router(reports_router)


@app.get(
    "/",
    tags=["Health"],
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Check API health",
    description=(
        "Returns a simple health status confirming that the TransitOps backend "
        "is running."
    ),
    responses={
        status.HTTP_200_OK: {
            "description": "TransitOps backend is running.",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "message": "TransitOps Backend is Running",
                    }
                }
            },
        }
    },
)
def health_check():
    return {
        "status": "success",
        "message": "TransitOps Backend is Running 🚚"
    }
