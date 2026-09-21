from langchain_tavily import TavilySearch
from app.core.config import settings 

search = TavilySearch(
  tavily_api_key=settings.tavily_api_key,
  max_results=3,
)

results = search.invoke(
  "scientific evidence that Earth is a sphere"
)

print("\nSearch results:")
print(results)