from core.leakage import scan_for_leakage

def test_scan_for_leakage_aws_key():
    body = '{"error": "Access denied for AKIAIOSFODNN7EXAMPLE"}'
    findings = scan_for_leakage(body)
    titles = [f["title"] for f in findings]
    assert "Sensitive Data Leakage: AWS Access Key" in titles

def test_scan_for_leakage_pan():
    # Valid test PAN (Luhn valid)
    body = "Your card 4532015112830364 has been charged."
    findings = scan_for_leakage(body)
    titles = [f["title"] for f in findings]
    assert "Sensitive Data Leakage: PAN" in titles

def test_scan_for_leakage_private_key():
    body = "Here is your key: -----BEGIN RSA PRIVATE KEY-----\nMIIE...-----END RSA PRIVATE KEY-----"
    findings = scan_for_leakage(body)
    titles = [f["title"] for f in findings]
    assert "Sensitive Data Leakage: Private Key" in titles
