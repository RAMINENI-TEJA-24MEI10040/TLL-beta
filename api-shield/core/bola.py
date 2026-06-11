import re
import uuid
import json
import httpx
from models.finding import Severity

async def detect_bola(url: str, auth_token: str | None) -> list[dict]:
    findings = []
    
    # Simple regex to find numeric IDs or UUIDs in the URL path
    # e.g. /users/123 or /items/550e8400-e29b-41d4-a716-446655440000
    numeric_pattern = re.compile(r'/(\d+)(/|$)')
    uuid_pattern = re.compile(r'/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(/|$)')
    
    mutations = []
    
    for match in numeric_pattern.finditer(url):
        original_id = match.group(1)
        mutated_id = str(int(original_id) + 1)
        mutated_url = url[:match.start(1)] + mutated_id + url[match.end(1):]
        mutations.append({"type": "numeric", "mutated_url": mutated_url})
        
    for match in uuid_pattern.finditer(url):
        original_id = match.group(1)
        mutated_id = str(uuid.uuid4())
        mutated_url = url[:match.start(1)] + mutated_id + url[match.end(1):]
        mutations.append({"type": "uuid", "mutated_url": mutated_url})
        
    if not mutations:
        return findings

    headers = {}
    if auth_token:
        headers["Authorization"] = auth_token if auth_token.lower().startswith("bearer") else f"Bearer {auth_token}"
        
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            orig_resp = await client.get(url, headers=headers)
        except Exception:
            return findings
            
        for mutation in mutations[:2]:  # Test max 2 mutations to avoid spam
            try:
                mut_resp = await client.get(mutation["mutated_url"], headers=headers)
                
                # Check for BOLA
                # If original was 200, and mutated is 200, and lengths are different -> potential BOLA
                if orig_resp.status_code == 200 and mut_resp.status_code == 200:
                    orig_len = len(orig_resp.content)
                    mut_len = len(mut_resp.content)
                    
                    if abs(orig_len - mut_len) > 0 or mut_len > 50:
                        # Further structural hash check could be done here
                        findings.append({
                            "severity": Severity.HIGH,
                            "title": "Potential Broken Object Level Authorization (BOLA)",
                            "description": f"Mutated URL {mutation['mutated_url']} returned a 200 OK with distinct content, suggesting unauthorized cross-object access.",
                            "remediation": "Implement object-level ownership checks before returning data.",
                            "endpoint": url
                        })
            except Exception:
                continue

    return findings
