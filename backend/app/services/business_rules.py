from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Any, TypeVar

from fastapi import HTTPException, status

EnumType = TypeVar("EnumType", bound=Enum)


def coerce_enum(value: Any, enum_cls: type[EnumType], field_name: str) -> EnumType:
    """Convert raw API values into enum members."""
    if isinstance(value, enum_cls):
        return value

    if isinstance(value, str):
        try:
            return enum_cls(value)
        except ValueError:
            try:
                return enum_cls[value]
            except KeyError:
                pass

    allowed_values = ", ".join(member.value for member in enum_cls)
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Invalid {field_name}. Allowed values: {allowed_values}",
    )


def coerce_date(value: Any, field_name: str) -> date:
    """Convert date-like values into date objects."""
    if isinstance(value, datetime):
        return value.date()

    if isinstance(value, date):
        return value

    if isinstance(value, str):
        try:
            return date.fromisoformat(value)
        except ValueError:
            pass

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"{field_name} must be a valid ISO date",
    )


def decimal_or_zero(value: Any) -> Decimal:
    """Convert nullable numeric values into Decimal."""
    if value is None:
        return Decimal("0")

    return Decimal(str(value))


def calculate_roi(revenue: Any, cost: Any) -> Decimal | None:
    """Calculate ROI percentage from revenue and cost."""
    total_revenue = decimal_or_zero(revenue)
    total_cost = decimal_or_zero(cost)

    if total_cost <= 0:
        return None

    return ((total_revenue - total_cost) / total_cost * Decimal("100")).quantize(
        Decimal("0.01")
    )


def ensure_transition(
    current_status: Enum,
    target_status: Enum,
    allowed_transitions: dict[Enum, set[Enum]],
    entity_name: str,
) -> None:
    """Raise when a status change is not allowed."""
    if current_status == target_status:
        return

    allowed_targets = allowed_transitions.get(current_status, set())
    if target_status not in allowed_targets:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Invalid {entity_name} status transition from "
                f"{current_status.value} to {target_status.value}"
            ),
        )
