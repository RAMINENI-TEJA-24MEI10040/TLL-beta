from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from database import get_db
from models.target import Target
from models.scan_result import ScanResult
from models.finding import Finding
from schemas.target import TargetCreate, TargetResponse
from core.health import check_health, check_tls
import httpx
from core.headers import analyze_headers
from urllib.parse import urlparse
from core.pdf_generator import generate_target_pdf
from fastapi.responses import Response

router = APIRouter()

@router.post("/targets", response_model=TargetResponse)
async def create_target(target: TargetCreate, db: AsyncSession = Depends(get_db)):
    db_target = Target(**target.model_dump())
    db.add(db_target)
    await db.commit()
    await db.refresh(db_target)

    # Initial scan
    headers = {}
    if db_target.auth_token:
        headers["Authorization"] = db_target.auth_token if db_target.auth_token.lower().startswith("bearer") else f"Bearer {db_target.auth_token}"

    health_info = await check_health(db_target.url)
    
    parsed_url = urlparse(db_target.url)
    hostname = parsed_url.hostname or db_target.url
    port = parsed_url.port or (443 if parsed_url.scheme == "https" else 80)
    tls_info = await check_tls(hostname, port)

    # Get headers for analysis
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.head(db_target.url, headers=headers)
            resp_headers = dict(resp.headers)
            header_findings = analyze_headers(resp_headers)
            for f in header_findings:
                new_finding = Finding(target_id=db_target.id, endpoint=db_target.url, **f)
                db.add(new_finding)
    except Exception:
        pass

    scan_res = ScanResult(
        target_id=db_target.id,
        status_code=health_info.get("status_code"),
        response_time_ms=health_info.get("response_time_ms"),
        tls_expiry_date=tls_info.get("tls_expiry_date") if tls_info.get("tls_expiry_date") else None,
        uptime_status="healthy" if health_info.get("status_code") == 200 else "down"
    )
    db.add(scan_res)
    await db.commit()

    return db_target

@router.get("/targets", response_model=List[TargetResponse])
async def list_targets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Target))
    return result.scalars().all()

@router.get("/targets/{target_id}", response_model=TargetResponse)
async def get_target(target_id: int, db: AsyncSession = Depends(get_db)):
    target = await db.get(Target, target_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    return target

@router.post("/targets/{target_id}/scan")
async def trigger_scan(target_id: int, db: AsyncSession = Depends(get_db)):
    # This will trigger an immediate full scan on the target
    # In a full implementation, this could enqueue a job via ARQ.
    target = await db.get(Target, target_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    return {"status": "scan triggered", "target_id": target_id}

@router.delete("/targets/{target_id}")
async def delete_target(target_id: int, db: AsyncSession = Depends(get_db)):
    target = await db.get(Target, target_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    await db.delete(target)
    await db.commit()
    return {"status": "deleted"}

@router.get("/targets/{target_id}/report/pdf")
async def get_target_pdf_report(target_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Target).options(
        selectinload(Target.scan_results),
        selectinload(Target.findings)
    ).where(Target.id == target_id)
    result = await db.execute(stmt)
    target = result.scalar_one_or_none()
    
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
        
    pdf_bytes = generate_target_pdf(target, target.scan_results, target.findings)
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="report_{target_id}.pdf"'})
