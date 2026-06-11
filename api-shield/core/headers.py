from models.finding import Severity

def analyze_headers(headers: dict) -> list[dict]:
    findings = []
    
    # Normalize headers for case-insensitive lookup
    headers_lower = {k.lower(): v for k, v in headers.items()}
    
    if "strict-transport-security" not in headers_lower:
        findings.append({
            "severity": Severity.HIGH,
            "title": "Missing Strict-Transport-Security (HSTS)",
            "description": "The HSTS header is missing, leaving the application vulnerable to downgrade attacks.",
            "remediation": "Add Strict-Transport-Security: max-age=31536000; includeSubDomains"
        })
        
    if "content-security-policy" not in headers_lower:
        findings.append({
            "severity": Severity.MEDIUM,
            "title": "Missing Content-Security-Policy",
            "description": "CSP header is missing, which could allow XSS and data injection attacks.",
            "remediation": "Add a strict Content-Security-Policy header."
        })
        
    if "x-frame-options" not in headers_lower and "frame-ancestors" not in headers_lower.get("content-security-policy", ""):
        findings.append({
            "severity": Severity.MEDIUM,
            "title": "Missing X-Frame-Options",
            "description": "Application could be vulnerable to clickjacking.",
            "remediation": "Add X-Frame-Options: DENY or SAMEORIGIN"
        })
        
    if "x-content-type-options" not in headers_lower:
        findings.append({
            "severity": Severity.LOW,
            "title": "Missing X-Content-Type-Options",
            "description": "MIME-sniffing vulnerabilities could occur.",
            "remediation": "Add X-Content-Type-Options: nosniff"
        })
        
    if "referrer-policy" not in headers_lower:
        findings.append({
            "severity": Severity.LOW,
            "title": "Missing Referrer-Policy",
            "description": "Information leakage may occur via the Referer header.",
            "remediation": "Add Referrer-Policy: strict-origin-when-cross-origin"
        })
        
    if "permissions-policy" not in headers_lower:
        findings.append({
            "severity": Severity.INFO,
            "title": "Missing Permissions-Policy",
            "description": "Browser features are not explicitly restricted.",
            "remediation": "Add Permissions-Policy header to restrict powerful browser features."
        })
        
    return findings
