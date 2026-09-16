from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# from app.models.fact_check import FactCheck


class User(Base):
  __tablename__ = "users"

  id: Mapped[int] = mapped_column(primary_key=True)

  email: Mapped[str] = mapped_column(
    String(255),
    unique=True,
    index=True,
  )

  password_hash: Mapped[str] = mapped_column(
    String(255)
  )

  created_at: Mapped[datetime] = mapped_column(
    DateTime,
    default=datetime.utcnow,
  )

  fact_checks: Mapped[list["FactCheck"]] = relationship(
    back_populates="user"
  )