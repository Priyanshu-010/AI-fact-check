from datetime import datetime

from pydantic import BaseModel


class FactCheckCreate(BaseModel):
  claim: str


class FactCheckResponse(BaseModel):
  id: int
  claim: str
  verdict: str | None
  explanation: str | None
  created_at: datetime

  model_config = {
    "from_attributes": True
  }