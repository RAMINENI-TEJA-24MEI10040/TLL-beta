import asyncio
import httpx
import time
from typing import Dict, Any

async def run_load_test(url: str, rps: int, duration_sec: int) -> Dict[str, Any]:
    # Enforce hard limits
    rps = min(rps, 50)
    duration_sec = min(duration_sec, 30)
    
    total_requests = rps * duration_sec
    success_count = 0
    fail_count = 0
    latencies = []
    
    async def fetch(client):
        nonlocal success_count, fail_count
        start_t = time.time()
        try:
            resp = await client.get(url)
            lat = (time.time() - start_t) * 1000
            latencies.append(lat)
            if resp.status_code < 400:
                success_count += 1
            else:
                fail_count += 1
        except Exception:
            fail_count += 1
            latencies.append(0)

    async def worker_batch(client, batch_size):
        tasks = [fetch(client) for _ in range(batch_size)]
        await asyncio.gather(*tasks)
        
    start_time = time.time()
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        for _ in range(duration_sec):
            batch_start = time.time()
            await worker_batch(client, rps)
            elapsed = time.time() - batch_start
            if elapsed < 1.0:
                await asyncio.sleep(1.0 - elapsed)
                
    total_duration = time.time() - start_time
    valid_lats = [l for l in latencies if l > 0]
    valid_lats.sort()
    
    p50 = valid_lats[int(len(valid_lats)*0.5)] if valid_lats else 0
    p95 = valid_lats[int(len(valid_lats)*0.95)] if valid_lats else 0
    
    return {
        "total_requests": len(latencies),
        "successful": success_count,
        "failed": fail_count,
        "p50_latency_ms": round(p50, 2),
        "p95_latency_ms": round(p95, 2),
        "duration_sec": round(total_duration, 2)
    }
