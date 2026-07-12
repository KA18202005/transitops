from pydantic import BaseModel, ConfigDict, Field


class HealthResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "success",
                "message": "TransitOps Backend is Running",
            }
        }
    )

    status: str = Field(
        ...,
        min_length=2,
        max_length=20,
        pattern=r"^success$",
        examples=["success"],
        description="Current API health status.",
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=120,
        pattern=r"^.{1,120}$",
        examples=["TransitOps Backend is Running"],
        description="Human-readable health check message.",
    )
