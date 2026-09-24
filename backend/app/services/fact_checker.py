from app.ai.graph import graph


async def fact_check_claim(claim: str) -> dict:
  initial_state = {
    "claim": claim,
    "search_queries": [],
    "sources": [],
    "evidence": [],
    "verdict": None,
    "explanation": None,
    "search_round": 0,
    "evidence_sufficient": False,
    "evidence_sufficiency_reason": None,
  }

  result = graph.invoke(initial_state)

  return result