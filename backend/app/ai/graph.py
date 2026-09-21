from langgraph.graph import StateGraph, START, END

from app.ai.state import FactCheckState
from app.ai.nodes import analyze_claim, search_web


builder = StateGraph(FactCheckState)

builder.add_node("analyze_claim", analyze_claim)
builder.add_node("search_web", search_web)

builder.add_edge(START, "analyze_claim")
builder.add_edge("analyze_claim", "search_web")
builder.add_edge("search_web", END)

graph = builder.compile()