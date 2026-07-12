from sqlalchemy import (
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
from sqlalchemy import CheckConstraint, Index
from app.core.database import Base
from app.models.enums import DriverStatus


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    license_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    license_category = Column(
        String(20),
        nullable=False
    )

    license_expiry = Column(
        Date,
        nullable=False
    )

    safety_score = Column(
        Numeric(5, 2),
        default=100
    )

    status = Column(
        Enum(DriverStatus),
        default=DriverStatus.AVAILABLE,
        nullable=False
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

    user = relationship(
        "User",
        back_populates="driver"
    )

    trips = relationship(
        "Trip",
        back_populates="driver"
    )
    __table_args__ = (

        CheckConstraint(
            "safety_score >= 0",
            name="ck_driver_score_min"
        ),

        CheckConstraint(
            "safety_score <= 100",
            name="ck_driver_score_max"
        ),

        Index("idx_driver_status", "status"),
    )

    def __repr__(self):
        return f"<Driver {self.license_number}>"

    @property
    def full_name(self):
        return self.user.full_name if self.user else None

    @property
    def phone(self):
        return self.user.phone if self.user else None
