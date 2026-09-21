from langchain_tavily import TavilySearch

from app.core.config import settings


search_tool = TavilySearch(
  tavily_api_key=settings.tavily_api_key,
  max_results=3,
)