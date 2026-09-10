from fastapi import FastAPI
from sqlalchemy import text

from app.db.database import engine
from app.routes.auth import router as auth_router


app = FastAPI(title="FactCheck AI")


app.include_router(auth_router)


@app.get("/")
async def root():
  return {"message": "FactCheck AI API is running"}


@app.get("/health/db")
async def database_health():
  async with engine.connect() as connection:
    result = await connection.execute(text("SELECT 1"))

  return {"database": result.scalar()}