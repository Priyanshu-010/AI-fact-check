from typing import TypedDict


class FactCheckState(TypedDict):
    claim: str
    search_queries: list[str]
    sources: list[dict]
    evidence: list[dict]
    verdict: str | None
    explanation: str | None
    search_round: int
    evidence_sufficient: bool
    evidence_sufficiency_reason: str | None