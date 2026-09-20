from app.ai.llm import llm


response = llm.invoke(
  "In one sentence, explain why the sky appears blue."
)

print(response.content)