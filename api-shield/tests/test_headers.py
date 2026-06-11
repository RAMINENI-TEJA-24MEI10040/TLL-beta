from core.headers import analyze_headers

def test_analyze_headers_missing_all():
    findings = analyze_headers({})
    titles = [f["title"] for f in findings]
    assert "Missing Strict-Transport-Security (HSTS)" in titles
    assert "Missing Content-Security-Policy" in titles
    assert "Missing X-Frame-Options" in titles

def test_analyze_headers_secure():
    secure_headers = {
        "strict-transport-security": "max-age=31536000",
        "content-security-policy": "default-src 'self'",
        "x-frame-options": "DENY",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
        "permissions-policy": "geolocation=()"
    }
    findings = analyze_headers(secure_headers)
    assert len(findings) == 0
