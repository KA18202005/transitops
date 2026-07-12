from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(50),
        unique=True,
        nullable=False
    )

    code = Column(
        String(10),
        unique=True,
        nullable=False
    )

    vehicles = relationship(
        "Vehicle",
        back_populates="region"
    )

    def __repr__(self):
        return f"<Region {self.name}>"