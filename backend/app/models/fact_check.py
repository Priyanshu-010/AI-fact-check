from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
# from app.models.source import Source
# from app.models.user import User

if TYPE_CHECKING:
  from app.models.source import Source
  from app.models.user import User

class FactCheck(Base):
  __tablename__ = "fact_checks"

  id: Mapped[int] = mapped_column(primary_key=True)

  user_id: Mapped[int] = mapped_column(
    ForeignKey("users.id"),
    nullable=False,
    index=True,
  )

  claim: Mapped[str] = mapped_column(Text, nullable=False)

  verdict: Mapped[str | None] = mapped_column(
    String(50),
    nullable=True,
  )

  explanation: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )

  created_at: Mapped[datetime] = mapped_column(
    DateTime,
    default=datetime.utcnow,
  )

  user: Mapped["User"] = relationship(
    back_populates="fact_checks"
  )
  sources: Mapped[list["Source"]] = relationship(
    back_populates="fact_check",
    cascade="all, delete-orphan",
  )