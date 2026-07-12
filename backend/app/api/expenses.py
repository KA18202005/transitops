from typing import Any

from fastapi import APIRouter, Body, Depends, Response, status

from app.core.database import get_db
from app.services.expense_service import ExpenseService

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


@router.get(
    "/",
    response_model=list[Any],
    status_code=status.HTTP_200_OK,
    summary="List expenses",
    description="Return a paginated list of expenses.",
    responses={
        status.HTTP_200_OK: {"description": "Expenses retrieved successfully."},
    },
)
def list_expenses(
    skip: int = 0,
    limit: int = 100,
    db: Any = Depends(get_db),
):
    """List expenses using the service layer."""
    return ExpenseService.list_expenses(db=db, skip=skip, limit=limit)


@router.get(
    "/{expense_id}",
    response_model=Any,
    status_code=status.HTTP_200_OK,
    summary="Get expense",
    description="Return an expense by its unique identifier.",
    responses={
        status.HTTP_200_OK: {"description": "Expense retrieved successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "Expense not found.",
            "content": {
                "application/json": {"example": {"detail": "Expense not found"}},
            },
        },
    },
)
def get_expense(
    expense_id: int,
    db: Any = Depends(get_db),
):
    """Get an expense using the service layer."""
    return ExpenseService.get_expense(db=db, expense_id=expense_id)


@router.post(
    "/",
    response_model=Any,
    status_code=status.HTTP_201_CREATED,
    summary="Create expense",
    description="Create a new expense.",
    responses={
        status.HTTP_201_CREATED: {"description": "Expense created successfully."},
        status.HTTP_400_BAD_REQUEST: {
            "description": "Expense vehicle does not match trip vehicle.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Related vehicle or trip not found.",
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def create_expense(
    request: dict[str, Any] = Body(
        ...,
        openapi_examples={
            "expense": {
                "summary": "Create expense",
                "value": {
                    "trip_id": 1,
                    "vehicle_id": 1,
                    "type": "Toll",
                    "amount": "850.00",
                    "description": "Highway toll charge",
                    "expense_date": "2025-01-15",
                },
            }
        },
    ),
    db: Any = Depends(get_db),
):
    """Create an expense using the service layer."""
    return ExpenseService.create_expense(db=db, data=request)


@router.put(
    "/{expense_id}",
    response_model=Any,
    status_code=status.HTTP_200_OK,
    summary="Update expense",
    description="Update an existing expense.",
    responses={
        status.HTTP_200_OK: {"description": "Expense updated successfully."},
        status.HTTP_400_BAD_REQUEST: {
            "description": "Expense vehicle does not match trip vehicle.",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Expense or related record not found.",
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Request validation failed.",
        },
    },
)
def update_expense(
    expense_id: int,
    request: dict[str, Any],
    db: Any = Depends(get_db),
):
    """Update an expense using the service layer."""
    return ExpenseService.update_expense(
        db=db,
        expense_id=expense_id,
        data=request,
    )


@router.delete(
    "/{expense_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete expense",
    description="Delete an existing expense.",
    responses={
        status.HTTP_204_NO_CONTENT: {"description": "Expense deleted successfully."},
        status.HTTP_404_NOT_FOUND: {
            "description": "Expense not found.",
            "content": {
                "application/json": {"example": {"detail": "Expense not found"}},
            },
        },
    },
)
def delete_expense(
    expense_id: int,
    db: Any = Depends(get_db),
):
    """Delete an expense using the service layer."""
    ExpenseService.delete_expense(db=db, expense_id=expense_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
