import pytest
from core.bola import detect_bola
import respx
import httpx

@pytest.mark.asyncio
@respx.mock
async def test_detect_bola_numeric():
    url = "https://api.example.com/users/123"
    
    # Mock original
    respx.get(url).respond(status_code=200, json={"user": "admin", "data": "secret"})
    # Mock mutation
    respx.get("https://api.example.com/users/124").respond(status_code=200, json={"user": "guest", "data": "public", "extra": "diff"})

    findings = await detect_bola(url, "token")
    assert len(findings) > 0
    assert findings[0]["title"] == "Potential Broken Object Level Authorization (BOLA)"
