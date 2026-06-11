import httpx
import ssl
import socket
from datetime import datetime
import asyncio
from urllib.parse import urlparse

async def check_health(url: str) -> dict:
    start_time = datetime.now()
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            elapsed = (datetime.now() - start_time).total_seconds() * 1000
            return {
                "status_code": response.status_code,
                "response_time_ms": elapsed,
                "error": None
            }
    except Exception as e:
        return {
            "status_code": None,
            "response_time_ms": None,
            "error": str(e)
        }

async def check_tls(hostname: str, port: int = 443) -> dict:
    loop = asyncio.get_running_loop()
    
    def fetch_cert():
        context = ssl.create_default_context()
        try:
            with socket.create_connection((hostname, port), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    return ssock.getpeercert()
        except Exception as e:
            return str(e)

    cert_info = await loop.run_in_executor(None, fetch_cert)
    
    if isinstance(cert_info, str) or not cert_info:
        return {"error": cert_info if isinstance(cert_info, str) else "No cert"}
        
    try:
        expire_date_str = cert_info.get("notAfter")
        expire_date = datetime.strptime(expire_date_str, "%b %d %H:%M:%S %Y %Z")
        days_until_expiry = (expire_date - datetime.utcnow()).days
        issuer = dict(x[0] for x in cert_info.get("issuer", []))
        return {
            "tls_expiry_date": expire_date.isoformat(),
            "days_until_expiry": days_until_expiry,
            "issuer": issuer.get("organizationName", "Unknown")
        }
    except Exception as e:
        return {"error": f"Cert parse error: {e}"}

async def check_dns(hostname: str) -> dict:
    loop = asyncio.get_running_loop()
    try:
        info = await loop.getaddrinfo(hostname, None, family=socket.AF_INET)
        ips = list(set([res[4][0] for res in info]))
        return {"resolved_ips": ips}
    except Exception as e:
        return {"error": str(e)}
