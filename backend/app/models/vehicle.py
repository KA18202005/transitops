from sqlalchemy import (
    Boolean,
    Column,
    Date,
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
from app.models.enums import VehicleStatus


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    registration_number = Column(
        String(20),
        unique=True,
        nullable=False
    )

    vehicle_name = Column(
        String(100),
        nullable=False
    )

    vehicle_type_id = Column(
        Integer,
        ForeignKey("vehicle_types.id"),
        nullable=False
    )

    region_id = Column(
        Integer,
        ForeignKey("regions.id"),
        nullable=False
    )

    max_load_capacity = Column(
        Numeric(10, 2),
        nullable=False
    )

    current_odometer = Column(
        Numeric(12, 2),
        default=0
    )

    acquisition_cost = Column(
        Numeric(12, 2),
        default=0
    )

    purchase_date = Column(Date)

    status = Column(
        Enum(VehicleStatus),
        default=VehicleStatus.AVAILABLE,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

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

    vehicle_type = relationship(
        "VehicleType",
        back_populates="vehicles"
    )

    region = relationship(
        "Region",
        back_populates="vehicles"
    )

    trips = relationship(
        "Trip",
        back_populates="vehicle"
    )

    maintenance_logs = relationship(
        "MaintenanceLog",
        back_populates="vehicle"
    )

    fuel_logs = relationship(
        "FuelLog",
        back_populates="vehicle"
    )

    expenses = relationship(
        "Expense",
        back_populates="vehicle"
    )

    def __repr__(self):
        return f"<Vehicle {self.registration_number}>"
