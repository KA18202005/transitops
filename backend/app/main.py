from fastapi import FastAPI

app = FastAPI(
    title="TransitOps API",
    description="Backend API for TransitOps Smart Transport Operations Platform",
    version="1.0.0"
)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "success",
        "message": "TransitOps Backend is Running 🚚"
    }