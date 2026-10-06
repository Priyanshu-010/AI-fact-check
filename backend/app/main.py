from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine
from app.routes.auth import router as auth_router
from app.routes.fact_checks import router as fact_checks_router


app = FastAPI(title="FactCheck AI")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["https://ai-fact-check-92dv.vercel.app"], # Front-end URL
  allow_credentials=False, # Cookie Authentication
  allow_methods=["*"], # Get, Post, Put, Delete
  allow_headers=["*"], # Headers
)

app.include_router(auth_router)
app.include_router(fact_checks_router)


@app.get("/")
async def root():
  return {"message": "FactCheck AI API is running"}


@app.get("/health/db")
async def database_health():
  async with engine.connect() as connection:
    result = await connection.execute(text("SELECT 1"))

  return {"database": result.scalar()}