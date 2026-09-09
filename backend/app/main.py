from fastapi import FastAPI
from sqlalchemy import text

from app.db.database import engine


app = FastAPI(title="FactCheck AI")


@app.get("/")
async def root():
  return {"message": "FactCheck AI API is running"}


@app.get("/health/db")
async def database_health():
  async with engine.connect() as connection:
    result = await connection.execute(text("SELECT 1"))

  return {"database": result.scalar()}