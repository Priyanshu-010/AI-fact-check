from pydantic import BaseModel, Field


class ClaimAnalysis(BaseModel):
  search_queries: list[str] = Field(
    description="Search queries that can be used to find reliable evidence for the claim."
  )