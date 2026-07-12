from fastapi import FastAPI, status

from app.api.auth import router as auth_router
from app.schemas.health import HealthResponse

app = FastAPI(
    title="TransitOps API",
    description="Backend API for TransitOps Smart Transport Operations Platform",
    version="1.0.0"
)

# Register API routers
app.include_router(auth_router)


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
