from typing import Any

from fastapi import APIRouter, Body, Depends, Response, status

from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/",
    response_model=list[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="List users",
    description="Return a paginated list of TransitOps users.",
    responses={status.HTTP_200_OK: {"description": "Users retrieved successfully."}},
)
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Any = Depends(get_db),
):
    """List users using the service layer."""
    return UserService.list_users(db=db, skip=skip, limit=limit)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get user",
    description="Return a user by unique identifier.",
    responses={
        status.HTTP_200_OK: {"description": "User retrieved successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found.",
            "content": {"application/json": {"example": {"detail": "User not found"}}},
        },
    },
)
def get_user(
    user_id: int,
    db: Any = Depends(get_db),
):
    """Get a user using the service layer."""
    return UserService.get_user(db=db, user_id=user_id)


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create user",
    description="Create a new TransitOps user account.",
    responses={
        status.HTTP_201_CREATED: {"description": "User created successfully."},
        status.HTTP_409_CONFLICT: {
            "description": "User email already exists.",
            "content": {
                "application/json": {"example": {"detail": "User email already exists"}},
            },
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def create_user(
    request: UserCreate = Body(
        ...,
        openapi_examples={
            "user": {
                "summary": "Create user",
                "value": {
                    "role_id": 1,
                    "full_name": "TransitOps Dispatcher",
                    "email": "dispatcher@transitops.com",
                    "password": "StrongPassword123",
                    "phone": "9876543210",
                    "is_active": True,
                },
            }
        },
    ),
    db: Any = Depends(get_db),
):
    """Create a user using the service layer."""
    return UserService.create_user(db=db, data=request)


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update user",
    description="Update an existing TransitOps user account.",
    responses={
        status.HTTP_200_OK: {"description": "User updated successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found.",
            "content": {"application/json": {"example": {"detail": "User not found"}}},
        },
        status.HTTP_409_CONFLICT: {
            "description": "User email already exists.",
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def update_user(
    user_id: int,
    request: UserUpdate,
    db: Any = Depends(get_db),
):
    """Update a user using the service layer."""
    return UserService.update_user(db=db, user_id=user_id, data=request)


@router.delete(
    "/{user_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user",
    description="Delete an existing TransitOps user account.",
    responses={
        status.HTTP_204_NO_CONTENT: {"description": "User deleted successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found.",
            "content": {"application/json": {"example": {"detail": "User not found"}}},
        },
    },
)
def delete_user(
    user_id: int,
    db: Any = Depends(get_db),
):
    """Delete a user using the service layer."""
    UserService.delete_user(db=db, user_id=user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
