import jwt
from models.finding import Severity
from datetime import datetime, timezone

def analyze_jwt(token: str) -> dict:
    findings = []
    risk_score = 100
    
    try:
        header = jwt.get_unverified_header(token)
    except Exception as e:
        return {"risk_score": 0, "findings": [{"severity": Severity.CRITICAL, "title": "Invalid JWT Format", "description": str(e)}]}
        
    alg = header.get("alg", "").lower()
    if alg == "none":
        findings.append({
            "severity": Severity.CRITICAL,
            "title": "Insecure Algorithm (alg=none)",
            "description": "The JWT accepts unsigned tokens, allowing authentication bypass.",
            "remediation": "Reject tokens with alg=none."
        })
        risk_score -= 50
    elif alg in ["hs256", "hs384", "hs512"]:
        findings.append({
            "severity": Severity.MEDIUM,
            "title": "Symmetric Algorithm in Use",
            "description": f"Using {alg.upper()} is safe only if the secret is strong and not shared broadly.",
            "remediation": "Consider using asymmetric algorithms like RS256 or ES256."
        })
        risk_score -= 10
        
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
    except Exception as e:
        findings.append({"severity": Severity.HIGH, "title": "JWT Decode Error", "description": str(e)})
        return {"risk_score": max(0, risk_score - 30), "findings": findings}
        
    if "exp" not in payload:
        findings.append({
            "severity": Severity.HIGH,
            "title": "Missing 'exp' Claim",
            "description": "Token does not expire, which is dangerous if stolen.",
            "remediation": "Always include an 'exp' claim with a short lifespan."
        })
        risk_score -= 20
    else:
        try:
            exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
            if exp_time < datetime.now(timezone.utc):
                findings.append({
                    "severity": Severity.HIGH,
                    "title": "Expired Token",
                    "description": "Token is already expired.",
                    "remediation": "Ensure backend rejects expired tokens."
                })
                risk_score -= 20
            elif (exp_time - datetime.now(timezone.utc)).days > 30:
                findings.append({
                    "severity": Severity.MEDIUM,
                    "title": "Long-lived Token",
                    "description": "Token lifespan exceeds 30 days.",
                    "remediation": "Shorten the token lifespan to reduce the window of exposure."
                })
                risk_score -= 10
        except Exception:
            pass
            
    if "aud" not in payload:
        findings.append({
            "severity": Severity.LOW,
            "title": "Missing 'aud' Claim",
            "description": "No audience specified. Token could be misused across different services."
        })
        risk_score -= 5
        
    if "iss" not in payload:
        findings.append({
            "severity": Severity.LOW,
            "title": "Missing 'iss' Claim",
            "description": "Issuer is missing, making it harder to verify token origin."
        })
        risk_score -= 5
        
    for claim in ["role", "roles", "scope", "scopes"]:
        val = payload.get(claim)
        if val and (val == "*" or "admin" in str(val).lower()):
            findings.append({
                "severity": Severity.MEDIUM,
                "title": "Excessive Privileges Detected",
                "description": f"The '{claim}' claim contains broad privileges ('{val}').",
                "remediation": "Ensure authorization is strictly enforced on the backend, not just trusting the JWT."
            })
            risk_score -= 10

    return {"risk_score": max(0, risk_score), "findings": findings}
