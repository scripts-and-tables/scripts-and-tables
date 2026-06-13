/* Excel Reports — report library with download + refresh status. */
const { useState: useStateEp, useMemo: useMemoEp, useEffect: useEffectEp } = React;

const EPOS_CUSTOMERS = ['Sales', 'Inventory', 'Pricing', 'Promotions', 'Forecast', 'Finance', 'Logistics', 'Returns', 'Marketing'];
const EPOS_LOC = { Sales: 'reports/Sales', Inventory: 'reports/Inventory', Pricing: 'reports/Pricing', Promotions: 'reports/Promotions', Forecast: 'reports/Forecast', Finance: 'reports/Finance', Logistics: 'reports/Logistics', Returns: 'reports/Returns', Marketing: 'reports/Marketing' };
const STAGE_DEFS = [
  ['Read', 'download', 'File opened and parsed from the source workbook.'],
  ['Validate', 'check', 'Schema, columns and totals checked against the customer template.'],
  ['Transform', 'refresh', 'Rows normalised and mapped to the warehouse model.'],
  ['Load', 'upload', 'Records written to the sell-out warehouse.'],
  ['Archive', 'box', 'Original file archived to cold storage.'],
];

function hex(seed, n) { let s = (seed * 2654435761) >>> 0; let o = ''; for (let i = 0; i < n; i++) { s = (s * 1664525 + 1013904223) >>> 0; o += ((s >>> 24) & 15).toString(16); } return o; }
function pad(n) { return String(n).padStart(2, '0'); }

const EPOS_FILES = (() => {
  const out = []; let id = 300;
  const monthsByCust = { Sales: 12, Inventory: 10, Pricing: 9, Promotions: 8, Forecast: 7, Finance: 6, Logistics: 5, Returns: 4, Marketing: 5 };
  for (const cust of EPOS_CUSTOMERS) {
    for (let yi = 0; yi < 3; yi++) {
      const year = 2024 + yi;
      const months = Math.max(2, monthsByCust[cust] - yi * 2);
      for (let m = 1; m <= months; m++) {
        id += 1;
        const r = (id * 97 + m * 13 + yi * 7) % 100;
        let status = 'success';
        if (r < 6) status = 'failed'; else if (r < 16) status = 'warning'; else if (r < 20) status = 'processing';
        const mod = (id % 3 === 0);
        const sizeBytes = 1500000 + (id * 9173 % 1900000);
        out.push({
          id, customer: cust, year,
          name: cust + '_Report_' + year + '-' + pad(m) + (mod ? '_v2' : '') + '.xlsx',
          sizeBytes, status,
          created: year + '-' + pad(m) + '-01 00:00:00',
          modified: year + '-' + pad(m) + '-' + pad(2 + (id % 26)) + ' ' + pad(8 + (id % 10)) + ':' + pad(id % 60) + ':' + pad((id * 7) % 60),
          sha: hex(id, 8) + '…' + hex(id + 9, 12),
          loc: EPOS_LOC[cust],
        });
      }
    }
  }
  return out.sort((a, b) => b.year - a.year || a.customer.localeCompare(b.customer) || b.id - a.id);
})();
const EPOS_TOTAL = 1673;

function fmtMB(b) { return (b / 1048576).toFixed(1) + ' MB'; }
function fmtBytes(b) { return b.toLocaleString('en-US') + ' bytes'; }
const EPOS_STATUS = {
  success: { kind: 'success', label: 'All clear', short: 'OK' },
  warning: { kind: 'warning', label: 'Warnings', short: 'Warn' },
  failed: { kind: 'danger', label: 'Failed', short: 'Failed' },
  processing: { kind: 'info', label: 'Processing', short: 'Running' },
};
function stagesFor(file) {
  const st = file.status;
  return STAGE_DEFS.map((d, i) => {
    let s = 'success';
    if (st === 'failed') s = i < 3 ? 'success' : (i === 3 ? 'failed' : 'skipped');
    else if (st === 'warning') s = i === 1 ? 'warning' : 'success';
    else if (st === 'processing') s = i < 2 ? 'success' : (i === 2 ? 'running' : 'pending');
    const base = new Date(file.modified.replace(' ', 'T'));
    base.setMinutes(base.getMinutes() + i * 2);
    const ts = (s === 'pending' || s === 'skipped') ? null : base.toISOString().slice(0, 19).replace('T', ' ');
    return { name: d[0], icon: d[1], desc: d[2], status: s, ts };
  });
}

/* ---------- XLSX glyph ---------- */
function XlsxIcon({ size = 38 }) {
  return React.createElement('div', { style: { width: size, height: size, borderRadius: 10, flex: 'none', background: 'color-mix(in srgb, var(--green) 12%, var(--surface))', border: '1px solid color-mix(in srgb, var(--green) 22%, transparent)', display: 'grid', placeItems: 'center', position: 'relative' } },
    React.createElement(Icon, { name: 'fileText', size: Math.round(size * 0.5), stroke: 1.8, style: { color: 'var(--green)' } }),
    React.createElement('span', { style: { position: 'absolute', bottom: 4, fontSize: 7, fontWeight: 800, letterSpacing: '.04em', color: 'var(--green)' } }, 'XLSX'));
}

/* ---------- list row ---------- */
function EposRow({ file, onOpen, onDownload, onEmail, active }) {
  const sp = EPOS_STATUS[file.status];
  return React.createElement('div', {
    onClick: onOpen, className: 'epos-row',
    style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 150px 92px 120px 96px', alignItems: 'center', gap: 16, padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid var(--border-2)', background: active ? 'var(--blue-050)' : 'transparent' },
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 } },
      React.createElement(XlsxIcon, { size: 36 }),
      React.createElement('span', { style: { fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, file.name)),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, color: 'var(--body)', fontSize: 13.5, minWidth: 0 } },
      React.createElement(Icon, { name: 'folder', size: 15, style: { color: 'var(--muted)', flex: 'none' } }),
      React.createElement('span', { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, file.customer)),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13.5 } },
      React.createElement(Icon, { name: 'database', size: 14 }), fmtMB(file.sizeBytes)),
    React.createElement('div', null, React.createElement(StatusPill, { kind: sp.kind }, sp.label)),
    React.createElement('div', { className: 'epos-actions', style: { display: 'flex', justifyContent: 'flex-end', gap: 6 } },
      React.createElement('button', { onClick: e => { e.stopPropagation(); onDownload(file); }, title: 'Download', style: actBtn(true) }, React.createElement(Icon, { name: 'download', size: 16 })),
      React.createElement('button', { onClick: e => { e.stopPropagation(); onEmail(file); }, title: 'Email link', style: actBtn(false) }, React.createElement(Icon, { name: 'mail', size: 16 })))
  );
}
function actBtn(primary) {
  return { width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 'var(--r)', cursor: 'pointer', flex: 'none',
    border: '1px solid ' + (primary ? 'transparent' : 'var(--border)'), background: primary ? 'var(--blue)' : 'var(--surface)', color: primary ? '#fff' : 'var(--gray-700)' };
}

/* ---------- detail drawer ---------- */
function DetailRow({ icon, label, children, hint }) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 0', borderTop: '1px solid var(--border-2)' } },
    React.createElement(Icon, { name: icon, size: 17, style: { color: 'var(--muted)', flex: 'none', marginTop: 2 } }),
    React.createElement('div', { style: { width: 96, flex: 'none', fontSize: 13.5, color: 'var(--muted)', marginTop: 1 } }, label),
    React.createElement('div', { style: { flex: 1, minWidth: 0, fontSize: 14.5, color: 'var(--ink)', fontWeight: 500, wordBreak: 'break-word' } }, children));
}
function stageVisual(s) {
  return {
    success: { color: 'var(--success-fg)', bg: 'var(--success-bg)', icon: 'check', label: 'success' },
    warning: { color: 'var(--warning-ink)', bg: 'var(--warning-bg)', icon: 'alert', label: 'warning' },
    failed: { color: 'var(--danger-fg)', bg: 'var(--danger-bg)', icon: 'x', label: 'failed' },
    running: { color: 'var(--blue)', bg: 'var(--blue-050)', icon: 'refresh', label: 'running' },
    pending: { color: 'var(--faint)', bg: 'var(--surface-2)', icon: 'clock', label: 'pending' },
    skipped: { color: 'var(--faint)', bg: 'var(--surface-2)', icon: 'dot', label: 'skipped' },
  }[s];
}
function EposDetail({ file, onClose, onDownload, onEmail, mobile }) {
  const sp = EPOS_STATUS[file.status];
  const stages = useMemoEp(() => stagesFor(file), [file.id]);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid var(--border-2)' } },
      React.createElement(XlsxIcon, { size: 40 }),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: 'var(--ink)', wordBreak: 'break-word', lineHeight: 1.3 } }, file.name),
        React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 2 } }, file.customer + '  ·  #' + file.id)),
      React.createElement('button', { onClick: onClose, style: { width: 34, height: 34, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-700)' } }, React.createElement(Icon, { name: 'x', size: 20 }))),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '8px 22px 22px' } },
      React.createElement('div', { className: 'uplabel', style: { padding: '16px 0 4px' } }, 'File details'),
      React.createElement(DetailRow, { icon: 'folder', label: 'Category' }, file.customer),
      React.createElement(DetailRow, { icon: 'database', label: 'Size' }, fmtMB(file.sizeBytes) + ' ', React.createElement('span', { style: { color: 'var(--muted)', fontWeight: 400 } }, '(' + fmtBytes(file.sizeBytes) + ')')),
      React.createElement(DetailRow, { icon: 'calendarPlus', label: 'Created' }, file.created),
      React.createElement(DetailRow, { icon: 'calendarCheck', label: 'Modified' }, file.modified),
      React.createElement(DetailRow, { icon: 'folder', label: 'Location' }, React.createElement('code', { style: { fontSize: 13, fontFamily: 'ui-monospace, monospace', color: 'var(--body)' } }, file.loc)),
      React.createElement(DetailRow, { icon: 'fingerprint', label: 'SHA-256' },
        React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8 } },
          React.createElement('code', { style: { fontSize: 13, fontFamily: 'ui-monospace, monospace', color: 'var(--body)' } }, file.sha),
          React.createElement('button', { title: 'Copy', style: { width: 26, height: 26, display: 'grid', placeItems: 'center', borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-600)' } }, React.createElement(Icon, { name: 'copy', size: 14 })))),
      React.createElement(DetailRow, { icon: 'trending', label: 'Pipeline' }, React.createElement(StatusPill, { kind: sp.kind }, sp.label)),

      React.createElement('div', { className: 'uplabel', style: { padding: '26px 0 16px' } }, 'Pipeline stages'),
      React.createElement('div', { style: { position: 'relative', paddingLeft: 6 } },
        stages.map((s, i) => {
          const v = stageVisual(s.status);
          const last = i === stages.length - 1;
          return React.createElement('div', { key: s.name, style: { display: 'flex', gap: 14, paddingBottom: last ? 0 : 20, position: 'relative' } },
            !last && React.createElement('div', { style: { position: 'absolute', left: 15, top: 32, bottom: 0, width: 2, background: 'var(--border)' } }),
            React.createElement('div', { style: { width: 32, height: 32, flex: 'none', borderRadius: '50%', background: v.bg, color: v.color, display: 'grid', placeItems: 'center', zIndex: 1 } },
              React.createElement(Icon, { name: v.icon, size: 16, stroke: 2.4 })),
            React.createElement('div', { style: { flex: 1, minWidth: 0, paddingTop: 2 } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
                React.createElement('span', { style: { fontSize: 15, fontWeight: 700, color: 'var(--ink)' } }, s.name),
                React.createElement('span', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: v.color } }, v.label)),
              React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 3, lineHeight: 1.45 } }, s.desc),
              s.ts && React.createElement('div', { style: { fontSize: 12.5, color: 'var(--faint)', marginTop: 4, fontVariantNumeric: 'tabular-nums' } }, s.ts)));
        })
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, padding: '16px 22px', borderTop: '1px solid var(--border)' } },
      React.createElement(Button, { icon: 'download', onClick: () => onDownload(file), style: { flex: 1, justifyContent: 'center' } }, 'Download'),
      React.createElement(Button, { icon: 'mail', variant: 'outline', onClick: () => onEmail(file), style: { flex: 1, justifyContent: 'center' } }, 'Email link'))
  );
}

/* ---------- toast ---------- */
function useToast() {
  const [msg, setMsg] = useStateEp(null);
  const show = m => { setMsg(m); clearTimeout(window.__eposT); window.__eposT = setTimeout(() => setMsg(null), 2600); };
  const node = msg && React.createElement('div', { className: 'fadein', style: { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink)', color: 'var(--bg)', padding: '12px 20px', borderRadius: 'var(--r-pill)', boxShadow: 'var(--sh-lg)', fontSize: 14.5, fontWeight: 600, zIndex: 200, display: 'flex', alignItems: 'center', gap: 9 } },
    React.createElement(Icon, { name: 'check', size: 17 }), msg);
  return [node, show];
}

/* ---------- main ---------- */
function EposApp() {
  const [q, setQ] = useStateEp('');
  const [cust, setCust] = useStateEp('All categories');
  const [year, setYear] = useStateEp('All years');
  const [status, setStatus] = useStateEp('All statuses');
  const [sel, setSel] = useStateEp(null);
  const [mobile, setMobile] = useStateEp(() => typeof window !== 'undefined' && window.innerWidth < 760);
  const [toast, showToast] = useToast();
  useEffectEp(() => { const h = () => setMobile(window.innerWidth < 760); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);

  const years = useMemoEp(() => ['All years', ...Array.from(new Set(EPOS_FILES.map(f => f.year))).sort((a, b) => b - a).map(String)], []);
  const statuses = ['All statuses', 'All clear', 'Warnings', 'Failed', 'Processing'];
  const statusMap = { 'All clear': 'success', 'Warnings': 'warning', 'Failed': 'failed', 'Processing': 'processing' };

  const list = useMemoEp(() => EPOS_FILES.filter(f => {
    if (cust !== 'All categories' && f.customer !== cust) return false;
    if (year !== 'All years' && String(f.year) !== year) return false;
    if (status !== 'All statuses' && f.status !== statusMap[status]) return false;
    if (q && !(f.name + ' ' + f.customer).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, cust, year, status]);
  const shown = list.slice(0, 200);

  const onDownload = f => showToast('Downloading ' + f.name.slice(0, 28) + '…');
  const onEmail = f => showToast('Download link emailed to you');

  const filters = React.createElement('div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 } },
    React.createElement('div', { style: { flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 46, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)' } },
      React.createElement(Icon, { name: 'search', size: 18, style: { color: 'var(--faint)' } }),
      React.createElement('input', { value: q, onChange: e => setQ(e.target.value), placeholder: 'Search by report name or category…', style: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit' } })),
    EposSelect(cust, setCust, ['All categories', ...EPOS_CUSTOMERS]),
    EposSelect(year, setYear, years),
    EposSelect(status, setStatus, statuses));

  return React.createElement('div', { className: 'fadein' },
    React.createElement(Page, { max: 1240 },
      React.createElement('h1', { style: { fontSize: 30, fontWeight: 700, marginBottom: 6 } }, 'Excel Reports'),
      React.createElement('p', { style: { fontSize: 17, color: 'var(--muted)', margin: '0 0 24px' } }, 'Browse and download the latest Excel reports. Open a report to see its refresh status, or get a download link by email.'),
      filters,
      React.createElement('div', { style: { fontSize: 14, color: 'var(--muted)', marginBottom: 12 } },
        'Showing ', React.createElement('strong', { style: { color: 'var(--body)' } }, list.length.toLocaleString('en-US')), ' of ' + EPOS_TOTAL.toLocaleString('en-US') + ' files'),
      React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
        !mobile && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 150px 92px 120px 96px', gap: 16, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' } },
          ['File', 'Category', 'Size', 'Status', ''].map((h, i) => React.createElement('div', { key: i, className: 'uplabel', style: { textAlign: i === 4 ? 'right' : 'left', fontSize: 11.5 } }, h))),
        shown.length === 0
          ? React.createElement('div', { style: { padding: '48px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 15.5 } }, 'No files match your filters.')
          : (mobile
            ? shown.map(f => React.createElement(EposCardMobile, { key: f.id, file: f, onOpen: () => setSel(f), onDownload, onEmail }))
            : shown.map(f => React.createElement(EposRow, { key: f.id, file: f, active: sel && sel.id === f.id, onOpen: () => setSel(f), onDownload, onEmail })))),
      list.length > shown.length && React.createElement('div', { style: { textAlign: 'center', padding: '18px 0', color: 'var(--muted)', fontSize: 13.5 } }, 'Showing first 200 — refine filters to narrow down.')
    ),
    /* drawer */
    sel && React.createElement('div', { onClick: () => setSel(null), style: { position: 'fixed', inset: 0, background: 'rgba(16,24,40,.42)', zIndex: 120, display: 'flex', justifyContent: 'flex-end' } },
      React.createElement('div', { onClick: e => e.stopPropagation(), className: 'epos-drawer', style: { width: mobile ? '100%' : 480, maxWidth: '100%', height: '100%', boxShadow: 'var(--sh-lg)' } },
        React.createElement(EposDetail, { file: sel, mobile, onClose: () => setSel(null), onDownload, onEmail }))),
    toast
  );
}
function EposSelect(value, onChange, options) {
  return React.createElement('div', { style: { position: 'relative' } },
    React.createElement('select', { value, onChange: e => onChange(e.target.value),
      style: { appearance: 'none', height: 46, padding: '0 38px 0 14px', borderRadius: 'var(--r)', border: '1px solid var(--border)', background: 'var(--surface)', boxShadow: 'var(--sh-sm)', fontSize: 14.5, color: 'var(--ink)', fontFamily: 'inherit', cursor: 'pointer', minWidth: 150 } },
      options.map(o => React.createElement('option', { key: o, value: o }, o))),
    React.createElement(Icon, { name: 'chevDown', size: 17, style: { position: 'absolute', right: 13, top: 15, color: 'var(--muted)', pointerEvents: 'none' } }));
}
function EposCardMobile({ file, onOpen, onDownload, onEmail }) {
  const sp = EPOS_STATUS[file.status];
  return React.createElement('div', { onClick: onOpen, style: { display: 'flex', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border-2)', cursor: 'pointer', alignItems: 'flex-start' } },
    React.createElement(XlsxIcon, { size: 38 }),
    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
      React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--ink)', wordBreak: 'break-word', lineHeight: 1.35 } }, file.name),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' } },
        React.createElement('span', { style: { fontSize: 12.5, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 5 } }, React.createElement(Icon, { name: 'folder', size: 13 }), file.customer),
        React.createElement('span', { style: { fontSize: 12.5, color: 'var(--muted)' } }, fmtMB(file.sizeBytes)),
        React.createElement(StatusPill, { kind: sp.kind }, sp.label))),
    React.createElement('button', { onClick: e => { e.stopPropagation(); onDownload(file); }, title: 'Download', style: actBtn(true) }, React.createElement(Icon, { name: 'download', size: 16 })));
}

window.EposApp = EposApp;
