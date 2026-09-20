from app.ai.graph import graph


initial_state = {
  "claim": "The Earth is flat.",
  "search_queries": [],
  "sources": [],
  "evidence": [],
  "verdict": None,
  "explanation": None,
}


result = graph.invoke(initial_state)

print("\nFinal state:")
print(result) 