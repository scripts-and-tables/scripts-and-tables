/* Notification Center — Outlook-style notifications client (portal + reporting systems). */
const { useState: useStateE, useMemo, useRef: useRefE, useEffect: useEffectE } = React;

/* ---------- avatar color palette (Outlook-like, hashed by name) ---------- */
const AVA_COLORS = ['#0d6efd', '#1f9483', '#c0871f', '#c4554d', '#5b53c9', '#1f7a52', '#2a8aa6', '#b3508a', '#6b54b8', '#d4742a'];
function avaColor(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return AVA_COLORS[h % AVA_COLORS.length]; }
function initials(name) {
  const clean = name.replace(/@.*/, '').replace(/[._-]+/g, ' ').trim();
  const parts = clean.split(/\s+/);
  return ((parts[0] || '')[0] || '?').toUpperCase() + (parts[1] ? parts[1][0].toUpperCase() : '');
}
function MailAvatar({ name, size = 44 }) {
  return React.createElement('div', { style: {
    width: size, height: size, borderRadius: '50%', background: avaColor(name), color: '#fff',
    display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: size * .36, flex: 'none', letterSpacing: '.02em',
  } }, initials(name));
}
function nameFromEmail(addr) {
  return addr.replace(/@.*/, '').replace(/[._-].*$/, '').replace(/\b\w/g, c => c.toUpperCase());
}
function recipSummary(email) {
  const first = nameFromEmail(email.to[0] || '');
  const extra = email.to.length - 1;
  return extra > 0 ? first + ' +' + extra : first;
}

/* ---------- seed data ---------- */
const RECIPS = ['sara.l', 'john.c', 'omar.s', 'mia.a', 'arun.p', 'iris.t', 'oleks.t', 'karim.a', 'sami.n', 'mona.h'];
const SENDERS = [
  ['robot@company.com', 'Reporting Robot'], ['noreply@company.com', 'One'],
  ['targets@company.com', 'Targets System'],
  ['reports@company.com', 'Reports Service'], ['focus@company.com', 'Focus SKUs Service'],
];
const SUBJECTS_REP = [
  ['Excel Reports refresh — Completed', 'success'], ['Sell-out files ingested', 'success'], ['Catalog sync completed', 'success'],
  ['Excel Reports refresh — Completed', 'success'], ['Excel Reports refresh — 3 warnings', 'warn'],
  ['Data Pipeline run finished', 'success'], ['Reporting digest — Daily KPIs', 'info'],
  ['Pricing import failed', 'fail'], ['Collection sync completed', 'success'],
];
const SUBJECTS_PORTAL = [
  ['June Target Adjustments submitted', 'info'], ['Focus SKUs updated — Nordia', 'info'],
  ['Focus SKU distribution updated', 'info'], ['Distribution list changed', 'warn'],
  ['New staff discount published', 'info'], ['Targets locked for May-26', 'info'],
];
const PREVIEWS = {
  'Excel Reports refresh — Completed': 'All 14 source files ingested. 28,000 rows loaded into the warehouse with no rejects.',
  'Excel Reports refresh — 3 warnings': 'Refresh completed with 3 non-blocking warnings on price mismatches. Review when convenient.',
  'Sell-out files ingested': 'Sell-out workbooks for all categories were received and loaded successfully.',
  'Catalog sync completed': 'The item catalog finished syncing — 300 SKUs added or updated.',
  'Pricing import failed': 'Import stopped — 3 rows failed validation. See the attached error log for the affected line items.',
  'Data Pipeline run finished': 'Pipeline “commercial-daily” finished in 6m 12s. Downstream models refreshed.',
  'Reporting digest — Daily KPIs': 'Revenue 102% to target · Focus SKU compliance 88% · 6 managers below visit coverage.',
  'Collection sync completed': 'Collection efficiency figures synced from the ERP for all regions.',
  'June Target Adjustments submitted': 'Hi Gabriel, As discussed, the June adjustments for the Hair Care team are in for approval.',
  'Focus SKUs updated — Nordia': 'The focus SKU list for Nordia was updated — 300 SKUs now active.',
  'Focus SKU distribution updated': 'Distribution for 12 focus SKUs was updated across the customer list.',
  'Distribution list changed': 'Two recipients were added to the daily reporting distribution list.',
  'New staff discount published': 'A new corporate offer (FitZone, 30% off) is now live for all the team.',
  'Targets locked for May-26': 'The May-26 commercial targets are now locked and read-only for all teams.',
};
function hexId(seed) { let s = (seed * 2654435761) >>> 0; let out = ''; for (let i = 0; i < 32; i++) { s = (s * 1664525 + 1013904223) >>> 0; out += ((s >>> 24) & 15).toString(16); } return out; }
function buildEmails() {
  const out = []; const times = ['13:19', '12:17', '12:05', '11:54', '11:44', '11:43', '11:34', '10:58', '10:21', '09:47', '09:12', '08:50'];
  let id = 0;
  for (let i = 0; i < 34; i++) {
    const isRep = i % 3 !== 0;
    const [subj, status] = isRep ? SUBJECTS_REP[i % SUBJECTS_REP.length] : SUBJECTS_PORTAL[i % SUBJECTS_PORTAL.length];
    const sender = isRep ? SENDERS[0] : SENDERS[1 + (i % (SENDERS.length - 1))];
    const day = i < 7 ? 'Jun 09' : i < 16 ? 'Jun 08' : i < 26 ? 'Jun 06' : 'Jun 05';
    const nRecip = 2 + (i % 6);
    const to = RECIPS.slice(0, nRecip).map(r => r + '@company.com');
    const stamp = subj.startsWith('Excel Reports') ? ' | 2026-' + (day === 'Jun 09' ? '06-09' : '06-08') + ' ' + times[i % times.length] + ':30' : '';
    out.push({
      id: id++, system: isRep ? 'REPORTING' : 'PORTAL', status,
      sender: sender[0], senderName: sender[1],
      subject: subj + stamp, preview: PREVIEWS[subj] || 'Automated message from the One platform.',
      to, cc: i % 4 === 0 ? ['oleks.t@company.com'] : [],
      time: times[i % times.length], day, unread: i < 5 || i % 7 === 0,
      hasAttach: isRep || i % 3 === 0, attachName: '2026-06-09 result__SEND.txt, Robot Template.xlsx',
      eid: hexId(1000 + i * 37),
    });
  }
  return out;
}
const EMAILS = buildEmails();

const STATUS_PILL = {
  success: { bg: 'var(--success-bg)', fg: 'var(--success-ink)', label: 'Success' },
  fail: { bg: 'var(--danger-bg)', fg: 'var(--danger-ink)', label: 'Failure' },
  warn: { bg: 'var(--warning-bg)', fg: 'var(--warning-ink)', label: 'Warning' },
  info: { bg: 'var(--info-bg)', fg: 'var(--info-ink)', label: 'Info' },
};
function SystemPill({ system }) {
  const rep = system === 'REPORTING';
  return React.createElement('span', { style: {
    fontSize: 10.5, fontWeight: 700, letterSpacing: '.05em', padding: '2px 7px', borderRadius: 'var(--r-pill)',
    background: rep ? 'var(--success-bg)' : 'var(--info-bg)', color: rep ? 'var(--success-ink)' : 'var(--info-ink)',
  } }, system);
}

/* ---------- list row (outbox: lead with recipient, no body) ---------- */
function MailRow({ email, active, onClick, compact }) {
  const recip = recipSummary(email);
  const sp = STATUS_PILL[email.status] || STATUS_PILL.info;
  return React.createElement('div', {
    onClick, className: 'hv-row',
    style: {
      display: 'flex', gap: 12, padding: '13px 16px', cursor: 'pointer', alignItems: 'flex-start',
      borderLeft: '3px solid ' + (active ? 'var(--blue)' : 'transparent'),
      background: active ? 'var(--blue-050)' : 'transparent',
      borderBottom: '1px solid var(--border-2)',
    },
  },
    React.createElement(MailAvatar, { name: recip, size: 44 }),
    React.createElement('div', { style: { minWidth: 0, flex: 1 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 } },
        React.createElement('span', { style: { fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', flex: 'none' } }, 'To'),
        React.createElement('span', { style: { fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 } }, recip),
        React.createElement('span', { style: { fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap' } }, email.day === 'Jun 09' ? email.time : email.day)),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 } },
        React.createElement(SystemPill, { system: email.system }),
        React.createElement('span', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--body)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, email.subject)),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' } },
        React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: sp.fg } },
          React.createElement('span', { style: { width: 6, height: 6, borderRadius: '50%', background: sp.fg } }), sp.label),
        email.hasAttach && React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--muted)' } },
          React.createElement(Icon, { name: 'fileText', size: 13 }), '1 file'))
    )
  );
}

/* ---------- reading pane / detail ---------- */
function RecipChips({ label, list }) {
  if (!list.length) return null;
  return React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 8 } },
    React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: 'var(--muted)', width: 26, flex: 'none', paddingTop: 5 } }, label),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 7 } },
      list.map(r => React.createElement('span', { key: r, style: { fontSize: 13, color: 'var(--body)', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--r-pill)', padding: '4px 11px' } }, r))));
}
function MailDetail({ email, onBack, mobile }) {
  if (!email) return React.createElement('div', { style: { flex: 1, display: 'grid', placeItems: 'center', color: 'var(--faint)' } },
    React.createElement('div', { style: { textAlign: 'center' } },
      React.createElement(Icon, { name: 'mail', size: 46, style: { color: 'var(--gray-400)' } }),
      React.createElement('div', { style: { marginTop: 14, fontSize: 15.5 } }, 'Select a message to view its delivery details')));
  const sp = STATUS_PILL[email.status] || STATUS_PILL.info;
  return React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--surface)' } },
    React.createElement('div', { style: { padding: mobile ? '14px 16px' : '24px 28px', borderBottom: '1px solid var(--border-2)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12 } },
        mobile && React.createElement('button', { onClick: onBack, style: { width: 34, height: 34, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-700)', marginLeft: -6 } }, React.createElement(Icon, { name: 'arrowLeft', size: 22 })),
        React.createElement('h1', { style: { fontSize: mobile ? 19 : 23, fontWeight: 700, lineHeight: 1.25, flex: 1 } }, email.subject),
        React.createElement('span', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '.05em', padding: '4px 9px', borderRadius: 'var(--r-pill)', background: sp.bg, color: sp.fg, flex: 'none' } }, sp.label))
    ),
    React.createElement('div', { style: { padding: mobile ? '16px' : '24px 28px', overflowY: 'auto', flex: 1 } },
      React.createElement('div', { style: { display: 'flex', gap: 13, alignItems: 'flex-start' } },
        React.createElement(MailAvatar, { name: email.senderName, size: 46 }),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' } },
            React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)' } }, 'From'),
            React.createElement('span', { style: { fontSize: 16, fontWeight: 700, color: 'var(--ink)' } }, email.senderName),
            React.createElement('span', { style: { fontSize: 13.5, color: 'var(--muted)' } }, '<' + email.sender + '>')),
          React.createElement(RecipChips, { label: 'To', list: email.to }),
          React.createElement(RecipChips, { label: 'Cc', list: email.cc }),
          React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 10 } }, 'Sent  ·  2026-' + (email.day === 'Jun 09' ? '06-09' : '06-08') + ' ' + email.time)
        )
      ),
      React.createElement('div', { style: { height: 1, background: 'var(--border-2)', margin: '20px 0' } }),
      React.createElement('div', { style: { display: 'flex', gap: 11, alignItems: 'flex-start', padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--r)' } },
        React.createElement(Icon, { name: 'lock', size: 18, style: { color: 'var(--muted)', flex: 'none', marginTop: 1 } }),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: 'var(--ink)' } }, 'Message content is not retained'),
          React.createElement('div', { style: { fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, marginTop: 3 } }, 'For privacy, One stores only delivery metadata — recipients, subject, status and attachments. The email body is not logged or viewable here.'))),
      email.hasAttach && React.createElement('div', { style: { marginTop: 24 } },
        React.createElement('div', { className: 'uplabel', style: { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 } }, React.createElement(Icon, { name: 'fileText', size: 15 }), '1 attachment'),
        React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', maxWidth: '100%' } },
          React.createElement('span', { style: { fontSize: 11, fontWeight: 800, color: 'var(--green)', border: '1.5px solid var(--green)', borderRadius: 4, padding: '3px 5px', flex: 'none' } }, 'XLSX'),
          React.createElement('span', { style: { fontSize: 14, color: 'var(--body)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, email.attachName),
          React.createElement('button', { style: { marginLeft: 4, width: 32, height: 32, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-700)' } }, React.createElement(Icon, { name: 'download', size: 18 })))),
      React.createElement('div', { style: { marginTop: 26, display: 'flex', alignItems: 'center', gap: 10 } },
        React.createElement('span', { className: 'uplabel' }, 'Email ID'),
        React.createElement('code', { style: { fontSize: 12.5, color: 'var(--muted)', fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' } }, email.eid),
        React.createElement('button', { title: 'Copy', style: { width: 30, height: 30, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-600)' } }, React.createElement(Icon, { name: 'fileText', size: 16 })))
    )
  );
}

/* ---------- app shell ---------- */
function EmailsApp() {
  const [filter, setFilter] = useStateE('All');
  const [q, setQ] = useStateE('');
  const [selId, setSelId] = useStateE(null);
  const [mobile, setMobile] = useStateE(() => typeof window !== 'undefined' && window.innerWidth < 760);
  useEffectE(() => { const h = () => setMobile(window.innerWidth < 760); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);

  const counts = useMemo(() => ({ All: EMAILS.length, Portal: EMAILS.filter(e => e.system === 'PORTAL').length, Reporting: EMAILS.filter(e => e.system === 'REPORTING').length }), []);
  const list = useMemo(() => EMAILS.filter(e => {
    if (filter === 'Portal' && e.system !== 'PORTAL') return false;
    if (filter === 'Reporting' && e.system !== 'REPORTING') return false;
    if (q) { const t = (e.subject + e.senderName + e.sender + e.to.join(' ') + e.eid).toLowerCase(); if (!t.includes(q.toLowerCase())) return false; }
    return true;
  }), [filter, q]);
  const selected = EMAILS.find(e => e.id === selId) || null;

  const FilterTabs = React.createElement('div', { style: { display: 'flex', gap: 8 } },
    ['All', 'Portal', 'Reporting'].map(f => {
      const active = filter === f;
      return React.createElement('button', { key: f, onClick: () => setFilter(f), style: {
        display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 'var(--r-pill)', cursor: 'pointer',
        border: '1px solid ' + (active ? 'var(--blue)' : 'var(--border)'), background: active ? 'var(--blue)' : 'var(--surface)',
        color: active ? '#fff' : 'var(--gray-700)', fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
      } }, f, React.createElement('span', { style: { fontSize: 12, fontWeight: 700, opacity: active ? .85 : .6 } }, counts[f]));
    }));

  const SearchRow = React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 44, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)' } },
    React.createElement(Icon, { name: 'search', size: 18, style: { color: 'var(--faint)' } }),
    React.createElement('input', { value: q, onChange: e => setQ(e.target.value), placeholder: 'Search by ID, recipient, CC, or subject', style: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14.5, color: 'var(--ink)', fontFamily: 'inherit' } }));

  /* ----- MOBILE: list <-> full-screen detail ----- */
  if (mobile) {
    if (selected) return React.createElement('div', { className: 'fadein', style: { minHeight: '100vh', display: 'flex', flexDirection: 'column' } }, React.createElement(MailDetail, { email: selected, mobile: true, onBack: () => setSelId(null) }));
    return React.createElement('div', { className: 'fadein', style: { padding: '18px 0 0' } },
      React.createElement('div', { style: { padding: '0 16px 14px' } },
        React.createElement('h1', { style: { fontSize: 24, fontWeight: 800, marginBottom: 4 } }, 'Notifications'),
        React.createElement('p', { style: { fontSize: 13.5, color: 'var(--muted)', margin: '0 0 14px' } }, 'Showing ' + list.length + ' of ' + EMAILS.length + ' notifications'),
        React.createElement('div', { style: { marginBottom: 12, overflowX: 'auto', display: 'flex' } }, FilterTabs),
        SearchRow),
      React.createElement('div', { style: { background: 'var(--surface)', borderTop: '1px solid var(--border-2)' } },
        list.map(e => React.createElement(MailRow, { key: e.id, email: e, onClick: () => setSelId(e.id) }))));
  }

  /* ----- DESKTOP: two-pane (Outlook-style) ----- */
  return React.createElement('div', { className: 'fadein', style: { display: 'flex', height: 'calc(100vh - var(--nav-h))', minHeight: 0 } },
    React.createElement('div', { style: { width: 452, flex: 'none', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface)', minHeight: 0 } },
      React.createElement('div', { style: { padding: '20px 20px 14px', borderBottom: '1px solid var(--border-2)' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 } },
          React.createElement('h1', { style: { fontSize: 22, fontWeight: 800 } }, 'Notifications'),
          React.createElement('span', { style: { fontSize: 13, color: 'var(--muted)' } }, list.length + ' items')),
        React.createElement('p', { style: { fontSize: 13, color: 'var(--muted)', margin: '0 0 14px' } }, 'System notifications & alerts from across the portal'),
        React.createElement('div', { style: { marginBottom: 12 } }, FilterTabs),
        SearchRow),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', minHeight: 0 } },
        list.length === 0
          ? React.createElement('div', { style: { padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 14.5 } }, 'No messages match your filters.')
          : list.map(e => React.createElement(MailRow, { key: e.id, email: e, active: e.id === selId, onClick: () => setSelId(e.id), compact: true })))),
    React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', background: 'var(--canvas)' } }, React.createElement(MailDetail, { email: selected })));
}

window.EmailsApp = EmailsApp;
