from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
# from app.models.fact_check import FactCheck
if TYPE_CHECKING:
  from app.models.fact_check import FactCheck


class Source(Base):
  __tablename__ = "sources"

  id: Mapped[int] = mapped_column(primary_key=True)

  fact_check_id: Mapped[int] = mapped_column(
    ForeignKey("fact_checks.id"),
    nullable=False,
    index=True,
  )

  title: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
  )

  url: Mapped[str] = mapped_column(
    Text,
    nullable=False,
  )

  snippet: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )

  fact_check: Mapped["FactCheck"] = relationship(
    back_populates="sources"
  )