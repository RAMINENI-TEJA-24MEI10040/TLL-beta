import httpx
from models.finding import Severity

async def test_rbac(url: str, tokens: dict[str, str]) -> list[dict]:
    findings = []
    
    admin_token = tokens.get("admin")
    user_token = tokens.get("user")
    anon_token = tokens.get("anonymous", "")
    
    if not admin_token:
        return findings

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            admin_resp = await client.get(url, headers={"Authorization": f"Bearer {admin_token}"})
            if admin_resp.status_code not in [200, 201]:
                return findings  # If admin can't access it, RBAC logic is harder to infer
                
            if user_token:
                user_resp = await client.get(url, headers={"Authorization": f"Bearer {user_token}"})
                if user_resp.status_code == admin_resp.status_code and len(user_resp.content) == len(admin_resp.content):
                    findings.append({
                        "severity": Severity.HIGH,
                        "title": "Broken Function Level Authorization (BFLA)",
                        "description": "Standard user token achieved identical access to the endpoint as the admin token.",
                        "endpoint": url
                    })
                    
            if anon_token is not None:
                anon_resp = await client.get(url, headers={"Authorization": f"Bearer {anon_token}"} if anon_token else {})
                if anon_resp.status_code == admin_resp.status_code:
                    findings.append({
                        "severity": Severity.CRITICAL,
                        "title": "Unauthenticated Access Allowed",
                        "description": "Anonymous request achieved identical access to the endpoint as the admin token.",
                        "endpoint": url
                    })
        except Exception:
            pass

    return findings
