from pydantic import BaseModel, Field


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

  relationship: str = Field(
    description=(
      "Relationship of the evidence to the claim. "
      "Must be one of: supports, contradicts, or insufficient."
    )
  )


class EvidenceExtraction(BaseModel):
  evidence: list[EvidenceItem] = Field(
    description="Relevant evidence extracted from the provided sources."
  )

class VerdictResult(BaseModel):
  verdict: str = Field(
    description=(
      "Final verdict for the claim. "
      "Must be one of: true, false, partially_true, or insufficient_evidence."
    )
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