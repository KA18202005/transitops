from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base
from app.models.enums import MaintenanceStatus


class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=False
    )

    issue = Column(
        String(200),
        nullable=False
    )

    description = Column(Text)

    maintenance_cost = Column(
        Numeric(12,2),
        default=0
    )

    start_date = Column(Date)

    end_date = Column(Date)

    status = Column(
        Enum(MaintenanceStatus),
        default=MaintenanceStatus.PENDING,
        nullable=False
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

    vehicle = relationship(
        "Vehicle",
        back_populates="maintenance_logs"
    )

    def __repr__(self):
        return f"<Maintenance {self.id}>"