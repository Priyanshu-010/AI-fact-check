from langgraph.graph import StateGraph, START, END

from app.ai.state import FactCheckState
from app.ai.nodes import analyze_claim


builder = StateGraph(FactCheckState)

builder.add_node("analyze_claim", analyze_claim)

builder.add_edge(START, "analyze_claim")
builder.add_edge("analyze_claim", END)

graph = builder.compile()