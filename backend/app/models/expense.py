from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base
from app.models.enums import ExpenseType


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    trip_id = Column(
        Integer,
        ForeignKey("trips.id"),
        nullable=False
    )

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=False
    )

    type = Column(
        Enum(ExpenseType),
        nullable=False
    )

    amount = Column(
        Numeric(12,2),
        nullable=False
    )

    description = Column(Text)

    expense_date = Column(
        Date,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    trip = relationship(
        "Trip",
        back_populates="expenses"
    )

    vehicle = relationship(
        "Vehicle",
        back_populates="expenses"
    )

    def __repr__(self):
        return f"<Expense {self.id}>"