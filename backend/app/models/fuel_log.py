from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class FuelLog(Base):
    __tablename__ = "fuel_logs"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=False
    )

    trip_id = Column(
        Integer,
        ForeignKey("trips.id"),
        nullable=False
    )

    liters = Column(
        Numeric(10,2),
        nullable=False
    )

    cost = Column(
        Numeric(10,2),
        nullable=False
    )

    fuel_station = Column(
        String(100)
    )

    date = Column(
        Date,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    vehicle = relationship(
        "Vehicle",
        back_populates="fuel_logs"
    )

    trip = relationship(
        "Trip",
        back_populates="fuel_logs"
    )

    def __repr__(self):
        return f"<FuelLog {self.id}>"