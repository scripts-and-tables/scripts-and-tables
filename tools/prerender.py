#!/usr/bin/env python3
"""Prerender static project pages from data/projects.json so crawlers and AI
engines (which don't run JS) can read the content. Re-run after editing data."""
import json, re, os, html

DOCS = os.path.join(os.path.dirname(__file__), '..', 'docs')
DOCS = os.path.abspath(DOCS)
BASE = "https://oleks.devapp24.com/"
AVATAR = "https://avatars.githubusercontent.com/u/43398608?v=4"

def esc(s):
    return html.escape(str(s), quote=True).replace("&#x27;", "&#39;")

STATUS_MAP = {"opensource":("live","Open source"),"private":("internal","Private"),"soon":("ship","Coming soon")}
ACTION_META = {"github":("btn-ghost","GitHub"),"pages":("btn-soft","Case study"),"live":("btn-dark","Live demo")}

def chips(arr): return "".join(f'<span class="tag">{esc(c)}</span>' for c in (arr or []))

def actions(lst):
    if not lst: return ""
    out=[]
    for a in lst:
        cls,label = ACTION_META.get(a.get("type"), ACTION_META["pages"])
        out.append(f'<a class="btn {cls}" href="{esc(a.get("url",""))}" target="_blank" rel="noopener">{esc(a.get("label") or label)} ↗</a>')
    return f'<div class="pd-actions">{"".join(out)}</div>'

def pipeline(stages):
    return '<div class="d-pipe">'+"".join(
        f'<div class="d-stage"><div class="si"><i class="bi {esc(st.get("icon","bi-box"))}"></i></div><h3>{esc(st.get("title",""))}</h3><ul>'
        + "".join(f"<li>{esc(i)}</li>" for i in st.get("items",[])) + "</ul></div>"
        for st in (stages or []))+"</div>"

def console_(runs):
    head='<div class="d-crow"><span>Pipeline</span><span>Schedule</span><span>Last run</span><span>Duration</span><span>Status</span></div>'
    rows=""
    for r in (runs or []):
        st=(r.get("status") or "queued").lower()
        rows+=(f'<div class="d-crow"><span class="nm">{esc(r.get("name",""))}</span>'
               f'<span class="mut">{esc(r.get("schedule",""))}</span>'
               f'<span class="mut">{esc(r.get("lastRun","—"))}</span>'
               f'<span class="mut">{esc(r.get("duration","—"))}</span>'
               f'<span><span class="run {st}">{esc(r.get("statusLabel",st))}</span></span></div>')
    return f'<div class="d-console">{head}{rows}</div>'

def emails(lst):
    out=""
    for m in (lst or []):
        alert=" alert" if m.get("variant")=="alert" else ""
        body="".join(f"<p>{esc(l)}</p>" for l in m.get("body",[]))
        att=""
        if m.get("attachments"):
            att='<div class="d-matt">'+"".join(f'<span><i class="bi bi-paperclip"></i> {esc(a)}</span>' for a in m["attachments"])+"</div>"
        out+=(f'<div class="d-mailc{alert}"><div class="d-mh"><span class="av"><i class="bi {esc(m.get("icon","bi-envelope-fill"))}"></i></span>'
              f'<span class="who"><span class="sn">{esc(m.get("from",""))}</span><span class="to">to {esc(m.get("to",""))}</span></span>'
              f'<span class="tm">{esc(m.get("time",""))}</span></div>'
              f'<div class="d-msub">{esc(m.get("subject",""))}</div>{body}{att}</div>')
    return f'<div class="d-mail">{out}</div>'

def board(cols):
    out=""
    for col in (cols or []):
        cards="".join(
            f'<div class="d-bcard"><div class="t">{esc(c.get("title",""))}</div>'
            + ((f'<div class="d-bfoot">'+(f'<span class="kt">{esc(c["tag"])}</span>' if c.get("tag") else "")
                +(f'<span class="km">{esc(c["meta"])}</span>' if c.get("meta") else "")+"</div>") if (c.get("tag") or c.get("meta")) else "")
            + "</div>" for c in col.get("cards",[]))
        out+=f'<div class="d-bcol"><div class="d-bhead"><span>{esc(col.get("title",""))}</span><span class="ct">{len(col.get("cards",[]))}</span></div>{cards}</div>'
    return f'<div class="d-board">{out}</div>'

def stats(items):
    return '<div class="d-stats">'+"".join(f'<div class="d-stat"><div class="v">{esc(h.get("value",""))}</div><div class="l">{esc(h.get("label",""))}</div></div>' for h in (items or []))+"</div>"

def gallery(imgs):
    return '<div class="d-gal">'+"".join(f'<figure><img src="{esc(im.get("src",""))}" alt="{esc(im.get("alt",""))}" loading="lazy" />'+(f'<figcaption>{esc(im.get("caption"))}</figcaption>' if im.get("caption") else "")+"</figure>" for im in (imgs or []))+"</div>"

def clamp(v):
    try: v=float(v)
    except: v=8
    return max(8,min(100,v))

def uimock(s):
    k=s.get("kind")
    if k=="search":
        def result(r):
            best = '<span class="mk-best">Best</span>' if r.get("best") else ""
            cls = " best" if r.get("best") else ""
            return (f'<div class="mk-result{cls}"><div><div class="mk-rname">{esc(r.get("store",""))}</div>'
                    f'<div class="mk-rmeta">{esc(r.get("meta",""))}</div></div>'
                    f'<div class="mk-rprice">{esc(r.get("price",""))}{best}</div></div>')
        res="".join(result(r) for r in s.get("results",[]))
        inner=f'<div class="mk-search"><div class="mk-sbar"><i class="bi bi-search"></i><span class="q">{esc(s.get("query",""))}</span><span class="go">Search</span></div><div class="mk-results">{res}</div></div>'
    elif k=="dashboard":
        st="".join(f'<div class="mk-stat"><b>{esc(x.get("v"))}</b><span>{esc(x.get("l"))}</span></div>' for x in s.get("stats",[]))
        rows="".join(f'<div class="mk-li"><div><b>{esc(r.get("title"))}</b><span class="s">{esc(r.get("meta",""))}</span></div><span class="mk-pill {esc(r.get("tagKind","ok"))}">{esc(r.get("tag",""))}</span></div>' for r in s.get("rows",[]))
        inner=f'<div class="mk-dash"><div class="mk-stats">{st}</div><div class="mk-list">{rows}</div></div>'
    elif k=="inbox":
        acc="".join(f'<div class="mk-acct{" on" if i==0 else ""}"><span class="mk-dot" style="background:{esc(a.get("color","#2459d6"))}"></span>{esc(a.get("name"))}</div>' for i,a in enumerate(s.get("accounts",[])))
        msg="".join(f'<div class="mk-msg{" unread" if x.get("unread") else ""}"><div class="mk-mtop"><b>{esc(x.get("from"))}</b><span>{esc(x.get("time",""))}</span></div><div class="mk-msub">{esc(x.get("subject",""))}</div><div class="mk-mprev">{esc(x.get("preview",""))}</div></div>' for x in s.get("messages",[]))
        inner=f'<div class="mk-inbox"><div class="mk-accts">{acc}</div><div class="mk-msgs">{msg}</div></div>'
    elif k=="analytics":
        kpis="".join(f'<div class="mk-kpi"><b>{esc(x.get("v"))}</b><span>{esc(x.get("l"))}</span></div>' for x in s.get("kpis",[]))
        bars="".join(f'<i style="height:{clamp(b)}%"></i>' for b in s.get("bars",[]))
        seg="".join(f'<span class="mk-seg"><i style="background:{esc(x.get("color","#2459d6"))}"></i>{esc(x.get("name"))}</span>' for x in s.get("segments",[]))
        inner=f'<div class="mk-an"><div class="mk-kpis">{kpis}</div><div class="mk-chart">{bars}</div><div class="mk-segs">{seg}</div></div>'
    else:
        return ""
    cap=f'<p class="mock-cap">{esc(s["caption"])}</p>' if s.get("caption") else ""
    return f'<div class="mock"><div class="mock-bar"><span class="mock-dots"><i></i><i></i><i></i></span><span class="mock-url">{esc(s.get("url",""))}</span></div><div class="mock-body">{inner}</div></div>{cap}'

def section(s):
    inner=""
    isLead = s.get("variant")=="lead"
    if isinstance(s.get("body"),list):
        lead_cls=' class="d-lead"' if isLead else ''
        inner+="".join(f'<p{lead_cls}>{esc(p)}</p>' for p in s["body"])
    if isinstance(s.get("list"),list):
        is_obj=any(isinstance(x,dict) for x in s["list"])
        items=""
        for it in s["list"]:
            if isinstance(it,dict): items+=f'<li><span class="ft">{esc(it.get("title",""))}</span><span class="fx">{esc(it.get("text",""))}</span></li>'
            else: items+=f"<li>{esc(it)}</li>"
        inner+=f'<ul class="{"d-flist" if is_obj else "pd-ul"}">{items}</ul>'
    t=s.get("type")
    if t=="pipeline" and isinstance(s.get("stages"),list): inner+=pipeline(s["stages"])
    if t=="console" and isinstance(s.get("runs"),list): inner+=console_(s["runs"])
    if t=="email" and isinstance(s.get("emails"),list): inner+=emails(s["emails"])
    if t=="board" and isinstance(s.get("columns"),list): inner+=board(s["columns"])
    if t=="stats" and isinstance(s.get("stats"),list): inner+=stats(s["stats"])
    if t=="gallery" and isinstance(s.get("images"),list): inner+=gallery(s["images"])
    if t=="uimock" and s.get("kind"): inner+=uimock(s)
    if isinstance(s.get("chips"),list): inner+=f'<div class="pd-stack">{chips(s["chips"])}</div>'
    if s.get("caption") and t!="uimock": inner+=f'<p class="d-cap">{esc(s["caption"])}</p>'
    return f'<div class="pd-block"><h2>{esc(s.get("heading",""))}</h2>{inner}</div>'

def subprojects(subs, heading, ids):
    if not subs: return ""
    out=""
    for sp in subs:
        internal = (sp.get("id")+".html") if (sp.get("id") in ids) else None
        link = internal or sp.get("url")
        ext = (not internal) and bool(sp.get("url"))
        title = (f'<a href="{esc(link)}"'+(' target="_blank" rel="noopener"' if ext else '')+f'>{esc(sp.get("title"))}</a>') if link else esc(sp.get("title"))
        pill = '<span class="d-pill">Coming soon</span>' if sp.get("soon") else (f'<span class="d-pill">{"Visit ↗" if ext else "View →"}</span>' if link else "")
        out+=f'<div class="d-sub"><div class="si"><i class="bi {esc(sp.get("icon","bi-box"))}"></i></div><div><h3>{title}</h3><p>{esc(sp.get("description",""))}</p><div class="pd-stack">{chips(sp.get("stack"))}</div>{pill}</div></div>'
    return f'<div class="pd-block"><h2>{esc(heading or "Inside this project")}</h2><div class="d-subs">{out}</div></div>'

NAV = '''  <header class="nav">
    <div class="nav-in">
      <a class="nav-brand" href="../index.html"><img src="{AV}" alt="" />Oleksandr&nbsp;Tverdokhlieb</a>
      <div class="nav-spacer"></div>
      <nav class="nav-links">
        <a href="../index.html">Home</a>
        <a href="../projects.html" class="active">Projects</a>
        <a href="../blog/">Blog</a>
        <a href="../about.html">About</a>
        <a href="../cv.html">CV</a>
        <a href="../ai.html">AI</a>
        <a href="../training.html">Training</a>
        <a href="../credentials.html">Learning</a>
        <a href="../game/">Games</a>
      </nav>
      <a class="nav-cta" href="../contact.html">Contact</a>
      <button class="nav-burger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
    <nav class="nav-mobile">
      <a href="../index.html">Home</a><a href="../projects.html">Projects</a><a href="../blog/">Blog</a><a href="../about.html">About</a><a href="../cv.html">CV</a><a href="../ai.html">AI</a><a href="../training.html">Training</a><a href="../credentials.html">Learning</a><a href="../game/">Games</a><a href="../contact.html">Contact</a>
    </nav>
  </header>'''.replace("{AV}",AVATAR)

FOOT = '''  <footer class="foot">
    <div class="foot-in">
      <div class="c">© <span data-year></span> Oleksandr Tverdokhlieb · Dubai, UAE</div>
      <div class="foot-links">
        <a href="https://www.linkedin.com/in/tverd" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6 1.12 6 0 4.88 0 3.5 0 2.12 1.12 1 2.49 1c1.38 0 2.49 1.12 2.49 2.5zM.24 8h4.5v14H.24V8zm7.5 0h4.31v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.5v-6.6c0-1.57-.03-3.6-2.19-3.6-2.2 0-2.53 1.71-2.53 3.48V22h-4.5V8z"/></svg></a>
        <a href="https://github.com/scripts-and-tables" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"/></svg></a>
      </div>
    </div>
  </footer>'''

def page(p, prev, nxt, ids):
    d=p.get("detail") or {}
    pid=p["id"]; url=BASE+"p/"+pid+".html"
    title=f'{p["title"]} — Oleksandr Tverdokhlieb'
    desc=d.get("tagline") or p.get("description") or ""
    k,label = STATUS_MAP.get((p.get("status") or {}).get("variant"), ("arch",""))
    statusLabel=(p.get("status") or {}).get("label") or ""
    stack=p.get("stack") or []
    meta=""
    if statusLabel: meta+=f'<span class="badge {k}"><span class="d"></span>{esc(statusLabel)}</span>'
    if p.get("category"): meta+=f'<span class="mono">{esc(p["category"])}</span>'
    facts=""
    if statusLabel: facts+=f'<div class="pd-fact"><span class="k">Status</span><span class="v">{esc(statusLabel)}</span></div>'
    if p.get("category"): facts+=f'<div class="pd-fact"><span class="k">Category</span><span class="v">{esc(p["category"])}</span></div>'
    if d.get("role"): facts+=f'<div class="pd-fact"><span class="k">Role</span><span class="v">{esc(d["role"])}</span></div>'
    if stack: facts+=f'<div class="pd-fact"><span class="k">Stack</span><span class="v">{esc(", ".join(stack))}</span></div>'
    secs="".join(section(s) for s in (d.get("sections") or []))
    metrics=""
    if d.get("highlights"):
        metrics='<div class="pd-metrics">'+"".join(f'<div class="m"><div class="v">{esc(h.get("value",""))}</div><div class="l">{esc(h.get("label",""))}</div></div>' for h in d["highlights"])+"</div>"
    nav=""
    if prev or nxt:
        nav='<nav class="pd-nav">'
        nav+= (f'<a class="prev" href="{prev["id"]}.html"><div class="dir">← Previous</div><div class="t">{esc(prev["title"])}</div></a>' if prev else "<span></span>")
        nav+= (f'<a class="next" href="{nxt["id"]}.html"><div class="dir">Next →</div><div class="t">{esc(nxt["title"])}</div></a>' if nxt else "<span></span>")
        nav+="</nav>"
    content=f'''
      <header class="pd-hero">
        <div class="pd-meta">{meta}</div>
        <h1>{esc(p["title"])}</h1>
        <p class="pd-sum">{esc(desc)}</p>
        {f'<div class="pd-stack">{chips(stack)}</div>' if stack else ""}
        {f'<p class="pd-role"><span><b>My role:</b> {esc(d["role"])}</span></p>' if d.get("role") else ""}
        {actions(p.get("actions"))}
      </header>
      <div class="pd-grid">
        <div class="pd-main">{secs}{subprojects(d.get("subprojects"), d.get("subprojectsHeading"), ids)}</div>
        <aside class="pd-side">{metrics}{f'<div class="pd-facts"><h3>At a glance</h3>{facts}</div>' if facts else ""}</aside>
      </div>
      {nav}'''
    ld={"@context":"https://schema.org","@graph":[
        {"@type":"Person","@id":BASE+"#person","name":"Oleksandr Tverdokhlieb","jobTitle":"Data Analytics Manager",
         "worksFor":{"@type":"Organization","name":"Transmed"},"url":BASE,"image":AVATAR,
         "sameAs":["https://www.linkedin.com/in/tverd","https://github.com/scripts-and-tables"]},
        {"@type":"CreativeWork","@id":url+"#work","name":p["title"],"headline":p["title"],
         "description":desc,"url":url,"author":{"@id":BASE+"#person"},"creator":{"@id":BASE+"#person"},
         "keywords":", ".join(stack),"about":p.get("category","")},
    ]}
    ldj=json.dumps(ld,ensure_ascii=False,separators=(',',':'))
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}" />
<meta name="theme-color" content="#11161f" />
<link rel="icon" href="{AVATAR}" />
<link rel="stylesheet" href="../assets/site.css?v=12" />
<link rel="canonical" href="{url}" />
<meta name="author" content="Oleksandr Tverdokhlieb" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Oleksandr Tverdokhlieb" />
<meta property="og:title" content="{esc(title)}" />
<meta property="og:description" content="{esc(desc)}" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{AVATAR}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{esc(title)}" />
<meta name="twitter:description" content="{esc(desc)}" />
<meta name="twitter:image" content="{AVATAR}" />
<script type="application/ld+json">{ldj}</script>
</head>
<body>
{NAV}
  <main class="wrap page">
    <a class="pd-back" href="../projects.html">← All projects</a>
    <div id="projectContent">{content}</div>
  </main>
{FOOT}
  <script src="../assets/site.js"></script>
</body>
</html>
'''

def list_rows(withdetail):
    """Rebuild the static projects-list rows (mirrors projects.html renderList, incl. live pills)."""
    SQ = "'"
    rows = []
    for i, p in enumerate(withdetail):
        st = p.get("status") or {}
        variant = st.get("variant", "")
        k, deflabel = STATUS_MAP.get(variant, ("arch", st.get("label") or "Other"))
        statusLabel = st.get("label") or deflabel
        stack = p.get("stack") or []
        tg = "".join(f'<span class="tag">{esc(s)}</span>' for s in stack[:4])
        if len(stack) > 4: tg += f'<span class="tag">+{len(stack)-4}</span>'
        role = f'<span class="pl-role"><i class="bi bi-person-workspace"></i>{esc(p.get("roleTag",""))}</span>' if p.get("roleTag") else ""
        hls = (p.get("detail") or {}).get("highlights") or []
        hl = hls[0] if hls else None
        metric = f'<b>{esc(hl.get("value",""))}</b><i>{esc(hl.get("label",""))}</i>' if hl else ""
        live = ""
        la = next((a for a in (p.get("actions") or []) if a.get("type") == "live"), None)
        if la:
            url = esc(la.get("url", "")); lbl = esc(la.get("label") or "Open demo")
            live = '<a class="pl-live" href="' + url + '" target="_blank" rel="noopener">' + lbl + ' ↗</a>'
        rows.append(
            '<div class="pl-row"><span class="pl-n mono">' + str(i + 1).zfill(2) + '</span>'
            + '<span class="pl-status"><span class="badge ' + k + '"><span class="d"></span>' + esc(statusLabel) + '</span></span>'
            + '<span class="pl-main"><span class="pl-title">' + esc(p.get("title", "")) + '</span>' + role
            + '<span class="pl-blurb">' + esc(p.get("description", "")) + '</span>'
            + '<span class="pl-tags">' + tg + '</span>'
            + '<span class="pl-actions"><a class="pl-btn" href="p/' + esc(p["id"]) + '.html">About</a>' + live + '</span></span>'
            + '<span class="pl-metric">' + metric + '</span></div>')
    return "".join(rows)


def main():
    data=json.load(open(os.path.join(DOCS,"data","projects.json"), encoding="utf-8"))
    withdetail=[p for p in data if p.get("id") and p.get("detail")]
    ids={p["id"] for p in withdetail}
    outdir=os.path.join(DOCS,"p"); os.makedirs(outdir,exist_ok=True)
    for i,p in enumerate(withdetail):
        prev=withdetail[i-1] if i>0 else None
        nxt=withdetail[i+1] if i<len(withdetail)-1 else None
        open(os.path.join(outdir,p["id"]+".html"),"w",encoding="utf-8").write(page(p,prev,nxt,ids))
    print("generated",len(withdetail),"static project pages in docs/p/")
    # Rebuild the static projects list in projects.html so it stays in sync (incl. live pills)
    ph=os.path.join(DOCS,"projects.html")
    if os.path.exists(ph):
        htmltxt=open(ph,encoding="utf-8").read()
        block="<!--PRERENDER-->"+list_rows(withdetail)+"<!--/PRERENDER-->"
        htmltxt=re.sub(r"<!--PRERENDER-->.*?<!--/PRERENDER-->", lambda m: block, htmltxt, flags=re.S)
        open(ph,"w",encoding="utf-8").write(htmltxt)
        print("rebuilt static projects list in projects.html")
    return [p["id"] for p in withdetail]

if __name__=="__main__":
    main()
