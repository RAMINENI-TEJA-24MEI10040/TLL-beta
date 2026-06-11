from fastapi import APIRouter
from schemas.jwt import JWTAnalyzeRequest, JWTAnalyzeResponse
from core.jwt_analyzer import analyze_jwt

router = APIRouter()

@router.post("/analyze", response_model=JWTAnalyzeResponse)
async def analyze_jwt_token(request: JWTAnalyzeRequest):
    return analyze_jwt(request.token)
