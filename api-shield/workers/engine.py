import asyncio
from arq.connections import RedisSettings
from arq.cron import cron
from database import AsyncSessionLocal
from sqlalchemy.future import select
from models.target import Target, MonitorInterval
from models.scan_result import ScanResult
from models.finding import Finding
from core.health import check_health, check_tls
from core.headers import analyze_headers
from core.leakage import scan_for_leakage
import httpx
from urllib.parse import urlparse

async def run_scan_pipeline(ctx, target_id: int):
    async with AsyncSessionLocal() as db:
        target = await db.get(Target, target_id)
        if not target:
            return

        headers = {}
        if target.auth_token:
            headers["Authorization"] = target.auth_token if target.auth_token.lower().startswith("bearer") else f"Bearer {target.auth_token}"

        health_info = await check_health(target.url)
        
        parsed_url = urlparse(target.url)
        hostname = parsed_url.hostname or target.url
        port = parsed_url.port or (443 if parsed_url.scheme == "https" else 80)
        tls_info = await check_tls(hostname, port)

        new_findings = []
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(target.url, headers=headers)
                resp_headers = dict(resp.headers)
                header_findings = analyze_headers(resp_headers)
                new_findings.extend(header_findings)
                
                leak_findings = scan_for_leakage(resp.text)
                new_findings.extend(leak_findings)
        except Exception:
            pass

        for f in new_findings:
            finding = Finding(target_id=target.id, endpoint=target.url, **f)
            db.add(finding)

        scan_res = ScanResult(
            target_id=target.id,
            status_code=health_info.get("status_code"),
            response_time_ms=health_info.get("response_time_ms"),
            tls_expiry_date=tls_info.get("tls_expiry_date") if tls_info.get("tls_expiry_date") else None,
            uptime_status="healthy" if health_info.get("status_code") == 200 else "down"
        )
        db.add(scan_res)
        
        # Simple security score calculation
        score = 100
        for f in new_findings:
            if f["severity"] == "critical": score -= 25
            elif f["severity"] == "high": score -= 15
            elif f["severity"] == "medium": score -= 5
            elif f["severity"] == "low": score -= 1
        target.security_score = max(0, score)
        
        await db.commit()

async def fetch_and_scan_targets(ctx, interval: str):
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Target).where(Target.monitor_interval == interval))
        targets = result.scalars().all()
        for t in targets:
            await ctx['redis'].enqueue_job('run_scan_pipeline', t.id)
