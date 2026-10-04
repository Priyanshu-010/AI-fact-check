from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.dependencies import get_current_user_id
from app.db.database import get_db
from app.models.fact_check import FactCheck
from app.models.source import Source
from app.schemas.fact_check import FactCheckCreate, FactCheckResponse
from app.services.fact_checker import fact_check_claim


router = APIRouter(
  prefix="/fact-checks",
  tags=["Fact Checks"],
)

# Create Fact Check Endpoint

@router.post(
  "",
  response_model=FactCheckResponse,
)
async def create_fact_check(
  data: FactCheckCreate,
  user_id: int = Depends(get_current_user_id),
  db: AsyncSession = Depends(get_db),
):
  # Run the AI fact-checking pipeline
  result = await fact_check_claim(data.claim)

  evidence_by_url = {
    item["source_url"]: item
    for item in result.get("evidence", [])
  }

  # Create the fact-check record
  fact_check = FactCheck(
    user_id=user_id,
    claim=data.claim,
    verdict=result["verdict"],
    explanation=result["explanation"],
  )

  db.add(fact_check)

  # We need the ID before creating Source records
  await db.flush()

  # Save the sources used by the AI
  for source in result["sources"]:
    evidence_item = evidence_by_url.get(source["url"])

    db.add(
      Source(
        fact_check_id=fact_check.id,
        title=source.get("title"),
        url=source["url"],
        snippet=source.get("content"),
        evidence=(
          evidence_item.get("evidence")
          if evidence_item
          else None
        ),
        source_relationship=(
          evidence_item.get("relationship")
          if evidence_item
          else None
        ),
      )
    )

  await db.commit()

  result = await db.execute(
    select(FactCheck)
    .options(selectinload(FactCheck.sources))
    .where(FactCheck.id == fact_check.id)
  )

  fact_check = result.scalar_one()

  return fact_check

# Get Fact Checks Endpoint
from sqlalchemy.orm import selectinload  # <-- Add this import

# Get Fact Checks Endpoint
@router.get(
  "",
  response_model=list[FactCheckResponse],
)
async def get_fact_checks(
  user_id: int = Depends(get_current_user_id),
  db: AsyncSession = Depends(get_db),
):
  result = await db.execute(
    select(FactCheck)
    .where(FactCheck.user_id == user_id)
    # Tell SQLAlchemy to fetch the related sources in the same execution block
    .options(selectinload(FactCheck.sources)) 
    .order_by(FactCheck.created_at.desc())
  )

  fact_checks = result.scalars().all()

  return fact_checks

@router.get(
    "/{fact_check_id}",
    response_model=FactCheckResponse,
)
async def get_fact_check(
  fact_check_id: int,
  user_id: int = Depends(get_current_user_id),
  db: AsyncSession = Depends(get_db),
):
  result = await db.execute(
    select(FactCheck)
    .where(
      FactCheck.id == fact_check_id,
      FactCheck.user_id == user_id,
    )
    .options(selectinload(FactCheck.sources))
  )

  fact_check = result.scalar_one_or_none()

  if fact_check is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Fact check not found",
    )

  return fact_check


@router.delete("/{fact_check_id}")
async def delete_fact_check(
  fact_check_id: int,
  user_id: int = Depends(get_current_user_id),
  db: AsyncSession = Depends(get_db),
):
  result = await db.execute(
    select(FactCheck).where(
      FactCheck.id == fact_check_id,
      FactCheck.user_id == user_id,
    )
  )

  fact_check = result.scalar_one_or_none()

  if fact_check is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Fact check not found",
    )

  await db.delete(fact_check)
  await db.commit()

  return {
    "message": "Fact check deleted successfully"
  }

