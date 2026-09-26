from pydantic import BaseModel, Field
from typing import Literal


class ClaimAnalysis(BaseModel):
  search_queries: list[str] = Field(
    description="Search queries that can be used to find reliable evidence for the claim."
  )

class EvidenceItem(BaseModel):
  source_url: str = Field(
    description="URL of the source containing the evidence."
  )

  evidence: str = Field(
    description="The specific evidence from the source that is relevant to the claim."
  )

  relationship: Literal[
    "supports",
    "contradicts",
    "insufficient",
  ] = Field(
    description="Relationship of the evidence to the claim."
  )


class EvidenceExtraction(BaseModel):
  evidence: list[EvidenceItem] = Field(
    description="Relevant evidence extracted from the provided sources."
  )

class VerdictResult(BaseModel):
  verdict: Literal[
    "true",
    "false",
    "partially_true",
    "insufficient_evidence",
  ] = Field(
    description="Final verdict for the claim."
  )

  explanation: str = Field(
    description="A clear explanation of the verdict based only on the provided evidence."
  )

class EvidenceSufficiency(BaseModel):
  sufficient: bool = Field(
    description=(
      "Whether the available evidence is sufficient to make "
      "a reliable fact-checking decision."
    )
  )

  reason: str = Field(
    description=(
      "Brief explanation of why the evidence is or is not sufficient."
    )
  )