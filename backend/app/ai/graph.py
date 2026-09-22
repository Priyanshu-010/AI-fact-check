from langgraph.graph import StateGraph, START, END

from app.ai.state import FactCheckState
from app.ai.nodes import (
    analyze_claim,
    search_web,
    extract_evidence,
    evaluate_evidence,
    should_search_again,
    refine_search_queries,
)


builder = StateGraph(FactCheckState)

builder.add_node("analyze_claim", analyze_claim)
builder.add_node("search_web", search_web)
builder.add_node("extract_evidence", extract_evidence)
builder.add_node("evaluate_evidence", evaluate_evidence)
builder.add_node("refine_search_queries", refine_search_queries)

builder.add_edge(START, "analyze_claim")
builder.add_edge("analyze_claim", "search_web")
builder.add_edge("search_web", "extract_evidence")
builder.add_conditional_edges(
  "extract_evidence",
  should_search_again,
  {
    "search_again": "refine_search_queries",
    "evaluate": "evaluate_evidence",
  },
)
builder.add_edge(
  "refine_search_queries",
  "search_web",
)
builder.add_edge("evaluate_evidence", END)

graph = builder.compile()