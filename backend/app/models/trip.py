from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base
from sqlalchemy import CheckConstraint, Index
from app.models.enums import TripStatus


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    trip_number = Column(
        String(30),
        unique=True,
        nullable=False
    )

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=False
    )

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id"),
        nullable=False
    )

    source = Column(
        String(150),
        nullable=False
    )

    destination = Column(
        String(150),
        nullable=False
    )

    cargo_weight = Column(
        Numeric(10, 2),
        nullable=False
    )

    planned_distance = Column(
        Numeric(10, 2),
        nullable=False
    )

    actual_distance = Column(
        Numeric(10, 2),
        default=0
    )

    fuel_used = Column(
        Numeric(10, 2),
        default=0
    )

    revenue = Column(
        Numeric(12, 2),
        default=0
    )

    status = Column(
        Enum(TripStatus),
        default=TripStatus.DRAFT,
        nullable=False
    )

    departure_time = Column(DateTime)

    arrival_time = Column(DateTime)

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    vehicle = relationship(
        "Vehicle",
        back_populates="trips"
    )

    driver = relationship(
        "Driver",
        back_populates="trips"
    )

    fuel_logs = relationship(
        "FuelLog",
        back_populates="trip"
    )

    expenses = relationship(
        "Expense",
        back_populates="trip"
    )
    
    __table_args__ = (

        CheckConstraint(
            "cargo_weight > 0",
            name="ck_trip_weight"
        ),

        CheckConstraint(
            "planned_distance > 0",
            name="ck_trip_distance"
        ),

        CheckConstraint(
            "actual_distance >= 0",
            name="ck_actual_distance"
        ),

        CheckConstraint(
            "fuel_used >= 0",
            name="ck_trip_fuel"
        ),

        CheckConstraint(
            "revenue >= 0",
            name="ck_trip_revenue"
        ),

        Index("idx_trip_vehicle", "vehicle_id"),
        Index("idx_trip_driver", "driver_id"),
        Index("idx_trip_status", "status"),
    )

    def __repr__(self):
        return f"<Trip {self.trip_number}>"