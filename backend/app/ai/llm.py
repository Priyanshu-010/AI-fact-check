from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_groq import ChatGroq

from app.core.config import settings


llm = ChatGoogleGenerativeAI(
  model="gemini-3.5-flash",
  google_api_key=settings.gemini_api_key,
  temperature=0,
)

# llm = ChatGroq(model="meta-llama/llama-prompt-guard-2-22m", groq_api_key=settings.groq_api_key, temperature=0.5)

