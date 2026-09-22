from app.ai.llm import llm
from app.ai.schemas import (
  ClaimAnalysis,
  EvidenceExtraction,
  EvidenceSufficiency,
  VerdictResult,
)
from app.ai.state import FactCheckState
from app.ai.search import search_tool


structured_llm = llm.with_structured_output(ClaimAnalysis)
evidence_llm = llm.with_structured_output(EvidenceExtraction)
verdict_llm = llm.with_structured_output(VerdictResult)
sufficiency_llm = llm.with_structured_output(EvidenceSufficiency)

# Analyzing claim and generating search queries Node

def analyze_claim(state: FactCheckState) -> FactCheckState:
  claim = state["claim"]

  prompt = f"""
You are an AI fact-checking assistant.

Analyze the following claim and generate useful web search queries
that can help verify whether the claim is true or false.

Claim:
{claim}

Generate several focused search queries.
Prefer queries that can find reliable, authoritative evidence.
"""

  result = structured_llm.invoke(prompt)

  return {
    **state,
    "search_queries": result.search_queries,
  }

# Search web Node (Tavily)

def search_web(state: FactCheckState) -> FactCheckState:
  all_sources = []

  for query in state["search_queries"]:
    result = search_tool.invoke(query)

    all_sources.extend(result["results"])

  return {
    **state,
    "sources": all_sources,
    "search_round": state["search_round"] + 1,
  }

# Extracting evidence Node and based on that deciding should search again or not

def should_search_again(state: FactCheckState) -> str:

  if (
    not state["evidence_sufficient"]
    and state["search_round"] < 2
  ):
    return "search_again"

  return "evaluate"

# Check evidence sufficiency Node

def check_evidence_sufficiency(
    state: FactCheckState,
) -> FactCheckState:

  claim = state["claim"]
  evidence = state["evidence"]

  prompt = f"""
You are evaluating whether the evidence collected by an AI
fact-checking system is sufficient to determine the truth of a claim.

Claim:
{claim}

Evidence:
{evidence}

Determine whether the evidence is sufficient.

Consider:

1. Does the evidence directly address the claim?
2. Is there enough relevant evidence to make a reasonable determination?
3. Are there multiple pieces of evidence or independent sources?
4. Is the evidence consistent, or is there significant conflict?
5. Would another search likely provide important missing information?

Set sufficient to true only when the available evidence is
strong enough to proceed to the final verdict.

Set sufficient to false when important evidence is missing,
the evidence is weak, or significant uncertainty remains.

Do not determine the final truth of the claim here.
Only determine whether the evidence is sufficient for evaluation.

Explain your decision briefly.
"""

  result = sufficiency_llm.invoke(prompt)

  return {
    **state,
    "evidence_sufficient": result.sufficient,
    "evidence_sufficiency_reason": result.reason,
  }

# If searching again refine search queries Node

def refine_search_queries(state: FactCheckState) -> FactCheckState:
  claim = state["claim"]
  evidence = state["evidence"]

  prompt = f"""
You are helping an AI fact-checking system find additional evidence.

Claim:
{claim}

Evidence found so far:
{evidence}

The current evidence is not sufficient to confidently evaluate the claim.

Generate 3 new, focused web search queries that could find
additional reliable evidence.

Avoid repeating the existing searches.
Prefer authoritative sources such as:
- universities
- government organizations
- scientific organizations
- established research institutions

Return only useful search queries.
"""

  result = structured_llm.invoke(prompt)

  return {
    **state,
    "search_queries": result.search_queries,
  }

# Extracting evidence Node from those searches/sources

def extract_evidence(state: FactCheckState) -> FactCheckState:
  claim = state["claim"]
  sources = state["sources"]
  prompt = f"""
You are an AI fact-checking assistant.

Your task is to extract relevant evidence from the provided web sources.

Claim:
{claim}

Web sources:
{sources}

For each useful source:
1. Identify the specific information relevant to the claim.
2. Extract or accurately summarize the relevant evidence.
3. Determine the relationship between the evidence and the claim.

Use exactly one of these relationships:
- supports: the evidence supports the claim
- contradicts: the evidence contradicts the claim
- insufficient: the evidence does not provide enough information to determine whether the claim is true or false

Do not make up information that is not present in the sources.

Only include evidence that is relevant to evaluating the claim.
"""

  result = evidence_llm.invoke(prompt)

  return {
    **state,
    "evidence": [
      item.model_dump()
      for item in result.evidence
    ],
  }

# Evaluating evidence Node

def evaluate_evidence(state: FactCheckState) -> FactCheckState:
  claim = state["claim"]
  evidence = state["evidence"]

  prompt = f"""
You are the final evaluator in an AI fact-checking system.

Evaluate the claim using ONLY the evidence provided below.

Claim:
{claim}

Evidence:
{evidence}

Choose exactly one verdict:

- true
  The evidence supports the claim and does not contain meaningful contradictory evidence.

- false
  The evidence clearly contradicts the claim.

- partially_true
  The claim contains some truth but is incomplete, exaggerated, or misleading.

- insufficient_evidence
  The available evidence is not sufficient to reliably determine whether the claim is true or false.

Important rules:
1. Base the verdict only on the provided evidence.
2. Do not invent facts.
3. Do not rely on your own outside knowledge.
4. If the evidence is conflicting or inadequate, use partially_true or insufficient_evidence as appropriate.
5. Explain the reasoning clearly and concisely.
"""

  result = verdict_llm.invoke(prompt)

  return {
    **state,
    "verdict": result.verdict,
    "explanation": result.explanation,
  }