from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, hash_password, verify_password
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse


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

@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
  result = await db.execute(
    select(User).where(User.email == data.email)
  )

  user = result.scalar_one_or_none()

  if user is None:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password",
    )

  if not verify_password(data.password, user.password_hash):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password",
    )

  access_token = create_access_token(user.id)

  return {
    "access_token": access_token,
    "token_type": "bearer",
  }

# @router.get("/users")
# async def get_users(db: AsyncSession = Depends(get_db)):
#   result = await db.execute(select(User))
#   users = result.scalars().all()
#   return users
