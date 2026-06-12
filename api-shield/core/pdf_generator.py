from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO

def generate_target_pdf(target, scan_results, findings) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=18)
    
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    h2_style = styles['Heading2']
    normal_style = styles['Normal']
    
    # Custom styles
    crit_style = ParagraphStyle('Critical', parent=normal_style, textColor=colors.red, spaceAfter=6)
    high_style = ParagraphStyle('High', parent=normal_style, textColor=colors.orange, spaceAfter=6)
    med_style = ParagraphStyle('Medium', parent=normal_style, textColor=colors.goldenrod, spaceAfter=6)
    low_style = ParagraphStyle('Low', parent=normal_style, textColor=colors.blue, spaceAfter=6)
    
    elements = []
    
    # Title
    elements.append(Paragraph(f"Security Report: {target.name}", title_style))
    elements.append(Spacer(1, 12))
    
    # Target Info
    elements.append(Paragraph(f"<b>URL:</b> {target.url}", normal_style))
    elements.append(Paragraph(f"<b>Security Score:</b> {target.security_score}/100", normal_style))
    elements.append(Spacer(1, 24))
    
    # Findings Summary
    elements.append(Paragraph("Security Findings", h2_style))
    elements.append(Spacer(1, 6))
    
    if not findings:
        elements.append(Paragraph("No vulnerabilities detected.", normal_style))
    else:
        table_data = [['Severity', 'Title', 'Endpoint']]
        for f in findings:
            severity = f.severity.upper()
            table_data.append([severity, f.title, f.endpoint or target.url])
            
        t = Table(table_data, colWidths=[60, 250, 200])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#2c3e50')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 10),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#f8f9fa')),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e0e0e0'))
        ]))
        elements.append(t)
    
    elements.append(Spacer(1, 24))
    
    # Recent Scan Results
    elements.append(Paragraph("Recent Scans", h2_style))
    elements.append(Spacer(1, 6))
    
    if not scan_results:
        elements.append(Paragraph("No scan results available.", normal_style))
    else:
        scan_data = [['Date', 'Status', 'Response Time (ms)', 'TLS Expiry']]
        for s in scan_results[-10:]: # last 10 scans
            date_str = s.created_at.strftime('%Y-%m-%d %H:%M:%S') if s.created_at else 'N/A'
            tls_str = s.tls_expiry_date.strftime('%Y-%m-%d') if s.tls_expiry_date else 'N/A'
            scan_data.append([date_str, s.uptime_status, str(s.response_time_ms), tls_str])
            
        st = Table(scan_data, colWidths=[120, 80, 120, 120])
        st.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#2c3e50')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 10),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#f8f9fa')),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e0e0e0'))
        ]))
        elements.append(st)

    doc.build(elements)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
