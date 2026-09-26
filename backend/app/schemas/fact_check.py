from datetime import datetime

from pydantic import BaseModel


class FactCheckCreate(BaseModel):
  claim: str

class SourceResponse(BaseModel):
  id: int
  title: str | None
  url: str
  snippet: str | None

  model_config = {
    "from_attributes": True
  }

class FactCheckResponse(BaseModel):
  id: int
  claim: str
  verdict: str | None
  explanation: str | None
  created_at: datetime
  sources: list[SourceResponse] = []

  model_config = {
    "from_attributes": True
  }
