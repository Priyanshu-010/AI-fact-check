from app.ai.graph import graph


initial_state = {
  "claim": "The Earth is flat.",
  "search_queries": [],
  "sources": [],
  "evidence": [],
  "verdict": None,
  "explanation": None,
  "search_round": 0,
}


result = graph.invoke(initial_state)

print("\nFinal state:")
print(result) 