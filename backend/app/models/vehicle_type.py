from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class VehicleType(Base):
    __tablename__ = "vehicle_types"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(50),
        unique=True,
        nullable=False
    )

    description = Column(Text)

    vehicles = relationship(
        "Vehicle",
        back_populates="vehicle_type"
    )

    def __repr__(self):
        return f"<VehicleType {self.name}>"