import re
from models.finding import Severity

def scan_for_leakage(body: str) -> list[dict]:
    findings = []
    if not body:
        return findings

    patterns = {
        "AWS Access Key": (r"AKIA[0-9A-Z]{16}", Severity.CRITICAL),
        "Generic API Key": (r"(?i)(api[_-]?key|secret[_-]?key)['\"]?\s*[:=]\s*['\"]?[a-zA-Z0-9\-_]{20,}['\"]?", Severity.HIGH),
        "JWT Leak": (r"eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*", Severity.HIGH),
        "SSN": (r"\b\d{3}-\d{2}-\d{4}\b", Severity.MEDIUM),
        "Email": (r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", Severity.INFO),
        "Private Key": (r"-----BEGIN [A-Z ]+PRIVATE KEY-----", Severity.CRITICAL)
    }
    
    # PAN regex for Visa/Mastercard/Amex, etc.
    pan_pattern = re.compile(r"\b(?:\d[ -]*?){13,16}\b")
    
    for name, (pattern, severity) in patterns.items():
        if re.search(pattern, body):
            findings.append({
                "severity": severity,
                "title": f"Sensitive Data Leakage: {name}",
                "description": f"Detected a pattern matching {name} in the response body.",
                "remediation": "Redact or remove sensitive information before returning responses."
            })
            
    for match in pan_pattern.finditer(body):
        digits = re.sub(r"\D", "", match.group(0))
        if len(digits) >= 13 and len(digits) <= 19 and luhn_check(digits):
            findings.append({
                "severity": Severity.CRITICAL,
                "title": "Sensitive Data Leakage: PAN",
                "description": "Detected a valid Primary Account Number (Credit Card) in the response.",
                "remediation": "Mask PAN data (e.g., ****-****-****-1234)."
            })
            break # Avoid spamming multiple PAN findings

    return findings

def luhn_check(card_number: str) -> bool:
    digits = [int(x) for x in str(card_number)]
    odd_digits = digits[-1::-2]
    even_digits = [sum(divmod(2 * d, 10)) for d in digits[-2::-2]]
    checksum = sum(odd_digits) + sum(even_digits)
    return checksum % 10 == 0
