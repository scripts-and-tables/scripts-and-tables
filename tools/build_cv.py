#!/usr/bin/env python3
"""Generate a designed 2-page PDF CV with reportlab."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, Table, TableStyle, HRFlowable, KeepTogether)
from reportlab.lib.enums import TA_LEFT, TA_RIGHT

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs", "assets",
                                   "Oleksandr-Tverdokhlieb-CV.pdf"))

NAVY = colors.HexColor("#11161F")
BLUE = colors.HexColor("#2459D6")
INK  = colors.HexColor("#15181D")
INK2 = colors.HexColor("#2C313A")
SLATE= colors.HexColor("#5B626C")
LINE = colors.HexColor("#E6E4DF")
SOFT = colors.HexColor("#EAF0FD")

PAGE_W, PAGE_H = A4
MX = 16*mm
CW = PAGE_W - 2*MX

def S(name, **kw):
    base = dict(fontName="Helvetica", fontSize=9.5, leading=13.5, textColor=INK2)
    base.update(kw); return ParagraphStyle(name, **base)

st_name   = S("name", fontName="Helvetica-Bold", fontSize=21, leading=23, textColor=colors.white)
st_title  = S("title", fontName="Helvetica", fontSize=11, leading=15, textColor=colors.HexColor("#AEB6C2"))
st_contact= S("contact", fontSize=8.5, leading=12, textColor=colors.HexColor("#C7CDd6"))
st_h2     = S("h2", fontName="Helvetica-Bold", fontSize=11.5, leading=14, textColor=INK, spaceBefore=2, spaceAfter=2)
st_role   = S("role", fontName="Helvetica-Bold", fontSize=10.5, leading=13, textColor=INK)
st_co     = S("co", fontSize=9.5, leading=12.5, textColor=BLUE)
st_when   = S("when", fontSize=8.5, leading=11, textColor=SLATE, alignment=TA_RIGHT)
st_bullet = S("bullet", fontSize=9.3, leading=12.3, textColor=INK2, leftIndent=10, bulletIndent=0)
st_body   = S("body", fontSize=9.6, leading=13.2, textColor=INK2)
st_sg     = S("sg", fontName="Helvetica-Bold", fontSize=8.5, leading=12, textColor=SLATE)
st_sk     = S("sk", fontSize=9.2, leading=13.5, textColor=INK2)
st_metric = S("metric", fontName="Helvetica-Bold", fontSize=12.5, leading=14, textColor=BLUE, alignment=1)
st_mlbl   = S("mlbl", fontSize=6.8, leading=9, textColor=SLATE, alignment=1)
st_proj   = S("proj", fontSize=9.3, leading=13, textColor=INK2)

def rule():
    return HRFlowable(width="100%", thickness=1.4, color=BLUE, spaceBefore=2, spaceAfter=4, lineCap="round")

def heading(txt):
    return KeepTogether([Spacer(1,5), Paragraph(txt, st_h2), rule()])

def role_block(title, co, when):
    head = Table([[Paragraph(f"{title}", st_role), Paragraph(when, st_when)]],
                 colWidths=[CW-34*mm, 34*mm])
    head.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"BOTTOM"),("LEFTPADDING",(0,0),(-1,-1),0),
                              ("RIGHTPADDING",(0,0),(-1,-1),0),("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    return KeepTogether([head, Paragraph(co, st_co), Spacer(1,8)])

def header_band():
    name = Paragraph("Oleksandr Tverdokhlieb", st_name)
    title= Paragraph("Data Analytics Manager &nbsp;·&nbsp; Dubai, UAE", st_title)
    contact = Paragraph(
        "linkedin.com/in/tverd &nbsp;•&nbsp; github.com/scripts-and-tables &nbsp;•&nbsp; "
        "oleks.devapp24.com &nbsp;•&nbsp; Dubai, UAE", st_contact)
    inner = Table([[name],[Spacer(1,3)],[title],[Spacer(1,6)],[contact]], colWidths=[CW-20*mm])
    inner.setStyle(TableStyle([("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
                               ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    band = Table([[inner]], colWidths=[CW])
    band.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),NAVY),
                              ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
                              ("TOPPADDING",(0,0),(-1,-1),13),("BOTTOMPADDING",(0,0),(-1,-1),13),
                              ("ROUNDEDCORNERS",[6,6,6,6])]))
    return band

def metric_strip():
    cells=[]
    data=[("13+","Years in analytics"),("~100","Sources / day"),("~500","Runs / day"),("60+","Hrs/week saved")]
    row=[]
    for v,l in data:
        c=Table([[Paragraph(v,st_metric)],[Paragraph(l,st_mlbl)]], colWidths=[(CW-0)/4-6])
        c.setStyle(TableStyle([("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
                               ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
                               ("BACKGROUND",(0,0),(-1,-1),SOFT),("ROUNDEDCORNERS",[5,5,5,5])]))
        row.append(c)
    t=Table([row], colWidths=[CW/4]*4)
    t.setStyle(TableStyle([("LEFTPADDING",(0,0),(-1,-1),3),("RIGHTPADDING",(0,0),(-1,-1),3),
                           ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0),
                           ("VALIGN",(0,0),(-1,-1),"MIDDLE")]))
    return t

def skill_col(groups):
    fl=[]
    for g,items in groups:
        fl.append(Paragraph(g.upper(), st_sg))
        fl.append(Paragraph(" · ".join(items), st_sk))
        fl.append(Spacer(1,5))
    return fl

def build():
    doc=BaseDocTemplate(OUT, pagesize=A4, leftMargin=MX, rightMargin=MX, topMargin=11*mm, bottomMargin=10*mm,
                        title="Oleksandr Tverdokhlieb — CV", author="Oleksandr Tverdokhlieb")
    frame=Frame(MX, 10*mm, CW, PAGE_H-21*mm, id="main", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    pages={"n":0}
    def onpage(canv,d): pages["n"]=canv.getPageNumber()
    doc.addPageTemplates([PageTemplate(id="cv", frames=[frame], onPage=onpage)])
    F=[]
    F.append(header_band()); F.append(Spacer(1,7))
    F.append(metric_strip()); F.append(Spacer(1,5))
    F.append(Paragraph(
        "Data Analytics Manager with 13+ years turning manual reporting and fragmented processes into "
        "automated, governed data products. I lead an analytics function end to end — from raw files and APIs to "
        "a governed warehouse, BI and decision-ready reporting — and build the production tooling behind it in "
        "Python and Django, pairing hands-on engineering with analytics leadership.", st_body))

    F.append(heading("Experience"))
    F.append(Paragraph("<font color='#5B626C'>Highlights of this work are in <b>Selected projects</b> below.</font>", st_proj))
    F.append(Spacer(1,7))
    for title,co,when in [
        ("Data Analytics Manager","Transmed · Dubai, UAE","Nov 2024 — Present"),
        ("Sales Data Analyst","Transmed · Dubai, UAE","Dec 2020 — Nov 2024"),
        ("Data Analyst","Perfetto Trading (Nespresso Distributor) · Dubai, UAE","Dec 2016 — Nov 2020"),
        ("Customer Service Specialist","Al Tayer Group · Dubai, UAE","Oct 2015 — Nov 2016"),
        ("Customer Data Specialist","Galereya Mobile · Kharkiv, Ukraine","Feb 2013 — Oct 2015"),
        ("Intern — Transport Coordinator","AB InBev Ukraine (SUN InBev) · Kharkiv","Aug 2012 — Feb 2013"),
    ]:
        F.append(role_block(title, co, when))

    F.append(heading("Selected projects"))
    projs=[("Automated Data Analytics Platform","end-to-end ingestion, governed warehouse, scheduled delivery — ~100 sources/day"),
           ("Internal Operations Platform (Django)","in-house suite: workflow automation, project management, role-based apps"),
           ("CRM Analytics","RFMT segmentation turning millions of transactions into monthly decisions"),
           ("Salesforce Promo Automation","supplier files → validated, Salesforce-ready promos — 60+ hrs/week saved"),
           ("Leaflet Analyzer","vision-AI pipeline: promotional PDFs/images → structured price &amp; discount data"),
           ("WordPress Content Manager","review-first post refresh — ~106% lift in organic leads")]
    for n,d in projs:
        F.append(Paragraph(f"<b>{n}</b> &nbsp;—&nbsp; {d}", st_proj))
        F.append(Spacer(1,1.4))

    
    left=skill_col([
        ("Languages & data",["Python","SQL","pandas","PostgreSQL"]),
        ("BI & automation",["Power BI / DAX","Power Apps","Excel","Report automation","Django","REST APIs"]),
        ("ML & AI",["scikit-learn","Machine learning","NLP","Claude / LLMs"]),
        ("Leadership",["Analytics leadership","Coaching","Data governance","Stakeholder management"]),
    ])
    right=[]
    right.append(Paragraph("EDUCATION", st_sg))
    right.append(Paragraph("<b>MSc, International Economics</b> — V. N. Karazin Kharkiv National University (2011–12), with honors", st_sk))
    right.append(Paragraph("<b>BSc, International Economics</b> — Simon Kuznets KhNUE (2007–11)", st_sk))
    right.append(Spacer(1,6))
    right.append(Paragraph("CERTIFICATIONS", st_sg))
    for c in ["Microsoft Certified — Power BI Data Analyst Associate (PL-300), 2026",
              "Anthropic — Claude Code 101, AI Fluency, Claude 101, Cowork (2026)",
              "Stanford — Machine Learning (Andrew Ng)",
              "U. Michigan — Applied ML · Data Science · Text Mining; Python &amp; PostgreSQL for Everybody",
              "IBM — Databases &amp; SQL for Data Science · PwC — Data Analysis &amp; Presentation · Udemy — Power BI"]:
        right.append(Paragraph(c, st_sk))
    grid=Table([[left,right]], colWidths=[CW*0.46, CW*0.54])
    grid.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(0,0),0),
                              ("LEFTPADDING",(1,0),(1,0),12),("RIGHTPADDING",(0,0),(-1,-1),0),
                              ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    F.append(KeepTogether([Spacer(1,5), Paragraph("Skills, education &amp; certifications", st_h2), rule(), grid]))

    doc.build(F)
    print("wrote", OUT, "| pages:", pages["n"])

if __name__=="__main__":
    build()
