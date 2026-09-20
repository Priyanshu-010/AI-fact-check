from typing import TypedDict


class FactCheckState(TypedDict):
  claim: str
  search_queries: list[str]
  sources: list[dict]
  evidence: list[dict]
  verdict: str | None
  explanation: str | None