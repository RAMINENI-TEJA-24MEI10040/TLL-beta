import jwt
from core.jwt_analyzer import analyze_jwt

def test_analyze_jwt_alg_none():
    # Construct a JWT with alg=none
    header = '{"alg":"none","typ":"JWT"}'
    payload = '{"user":"test"}'
    import base64
    def b64url(s): return base64.urlsafe_b64encode(s.encode()).decode().rstrip("=")
    token = f"{b64url(header)}.{b64url(payload)}."
    
    res = analyze_jwt(token)
    titles = [f["title"] for f in res["findings"]]
    assert "Insecure Algorithm (alg=none)" in titles
    assert res["risk_score"] < 100

def test_analyze_jwt_missing_exp():
    token = jwt.encode({"user": "test"}, "secret", algorithm="HS256")
    res = analyze_jwt(token)
    titles = [f["title"] for f in res["findings"]]
    assert "Missing 'exp' Claim" in titles
