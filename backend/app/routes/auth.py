from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(
  data: RegisterRequest,
  db: AsyncSession = Depends(get_db),
):
  hashed_password = hash_password(data.password)

  user = User(
    email=data.email,
    password_hash=hashed_password,
  )

  db.add(user)
  await db.commit()
  await db.refresh(user)

  return {
    "message": "User registered successfully",
    "user_id": user.id,
    "email": user.email,
  }