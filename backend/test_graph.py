# from app.ai.graph import graph


# initial_state = {
#   "claim": "",
#   "search_queries": [],
#   "sources": [],
#   "evidence": [],
#   "verdict": None,
#   "explanation": None,
#   "search_round": 0,
#   "evidence_sufficient": False,
#   "evidence_sufficiency_reason": None,
# }


# result = graph.invoke(initial_state)

# print("\nFinal state:")
# print(result) 

import asyncio

from app.services.fact_checker import fact_check_claim


async def main():
  result = await fact_check_claim(
    "The Earth is flat."
  )

  print("Verdict:", result["verdict"])
  print("Explanation:", result["explanation"])
  print("Search round:", result["search_round"])
  print("Evidence sufficient:", result["evidence_sufficient"])
  print("\nFIRST SOURCE:")
  print(result["sources"][0])


asyncio.run(main())