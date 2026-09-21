from app.ai.llm import llm
from app.ai.schemas import ClaimAnalysis
from app.ai.state import FactCheckState
from app.ai.search import search_tool


structured_llm = llm.with_structured_output(ClaimAnalysis)


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

def search_web(state: FactCheckState) -> FactCheckState:
  all_sources = []

  for query in state["search_queries"]:
    result = search_tool.invoke(query)

    all_sources.extend(result["results"])

  return {
    **state,
    "sources": all_sources,
  }