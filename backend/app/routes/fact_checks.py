from fastapi import APIRouter, Depends
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
    source_record = Source(
      fact_check_id=fact_check.id,
      title=source.get("title"),
      url=source["url"],
      snippet=source.get("content"),
    )

    db.add(source_record)

  await db.commit()

  result = await db.execute(
    select(FactCheck)
    .options(selectinload(FactCheck.sources))
    .where(FactCheck.id == fact_check.id)
  )

  fact_check = result.scalar_one()

  return fact_check