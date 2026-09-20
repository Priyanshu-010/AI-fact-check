from app.ai.state import FactCheckState


def analyze_claim(state: FactCheckState) -> FactCheckState:
  claim = state["claim"]

  print(f"Analyzing claim: {claim}")

  return {
    **state,
    "search_queries": [
      f"{claim} scientific evidence",
      f"{claim} fact check",
    ],
  }