from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import create_access_token, hash_password, verify_password
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.api.dependencies import get_current_user_id


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
    # 2. Change 'data: LoginRequest' to form_data
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db),
):
  # 3. OAuth2PasswordRequestForm uses '.username' even if it's an email address
  result = await db.execute(
    select(User).where(User.email == form_data.username) 
  )

  user = result.scalar_one_or_none()

  if user is None:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password",
    )

  # 4. Use form_data.password here
  if not verify_password(form_data.password, user.password_hash):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password",
    )

  access_token = create_access_token(user.id)

  return {
    "access_token": access_token,
    "token_type": "bearer",
  }

@router.get("/users")
async def get_users(db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(User))
  users = result.scalars().all()
  return users

@router.get("/me")
async def get_me(
  user_id: int = Depends(get_current_user_id),
  db: AsyncSession = Depends(get_db),
):
  result = await db.execute(
    select(User).where(User.id == user_id)
  )

  user = result.scalar_one_or_none()

  if user is None:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="User not found",
    )

  return {
    "id": user.id,
    "email": user.email,
  }
