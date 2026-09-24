from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user_id
from app.db.database import get_db
from app.models.fact_check import FactCheck
from app.schemas.fact_check import FactCheckCreate, FactCheckResponse
from app.services.fact_checker import fact_check_claim


router = APIRouter(
  prefix="/fact-checks",
  tags=["Fact Checks"],
)




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

  # Save the result to the database
  fact_check = FactCheck(
    user_id=user_id,
    claim=data.claim,
    verdict=result["verdict"],
    explanation=result["explanation"],
  )

  db.add(fact_check)

  await db.commit()
  await db.refresh(fact_check)

  return fact_check