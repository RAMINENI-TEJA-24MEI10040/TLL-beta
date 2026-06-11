import os
from arq.connections import RedisSettings
from arq.cron import cron
from workers.engine import run_scan_pipeline, fetch_and_scan_targets

async def run_5m_scans(ctx):
    await fetch_and_scan_targets(ctx, "5m")

async def run_15m_scans(ctx):
    await fetch_and_scan_targets(ctx, "15m")

async def run_30m_scans(ctx):
    await fetch_and_scan_targets(ctx, "30m")

async def run_1h_scans(ctx):
    await fetch_and_scan_targets(ctx, "1h")

class WorkerSettings:
    redis_settings = RedisSettings.from_dsn(os.getenv("REDIS_URL", "redis://localhost:6379/0"))
    functions = [run_scan_pipeline, fetch_and_scan_targets]
    cron_jobs = [
        cron(run_5m_scans, minute=set(range(0, 60, 5))),
        cron(run_15m_scans, minute=set(range(0, 60, 15))),
        cron(run_30m_scans, minute=set(range(0, 60, 30))),
        cron(run_1h_scans, minute=0),
    ]
