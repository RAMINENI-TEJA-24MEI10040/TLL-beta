import pytest
from core.health import check_health

@pytest.mark.asyncio
async def test_check_health_valid_url():
    result = await check_health("https://example.com")
    assert result["status_code"] in [200, 301, 302]
    assert result["response_time_ms"] > 0
    assert result["error"] is None

@pytest.mark.asyncio
async def test_check_health_invalid_url():
    result = await check_health("http://invalid.url.that.does.not.exist.com")
    assert result["status_code"] is None
    assert result["error"] is not None
