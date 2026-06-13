/* API — internal API reference (endpoint-by-endpoint, with examples). */
const { useState: useStateAPI, useMemo: useMemoAPI, useEffect: useEffectAPI } = React;

const METHOD_COLORS = {
  GET: { fg: 'var(--blue)', bg: 'var(--blue-050)' },
  POST: { fg: 'var(--success-fg)', bg: 'var(--success-bg)' },
  PUT: { fg: 'var(--warning-ink)', bg: 'var(--warning-bg)' },
  DELETE: { fg: 'var(--danger-fg)', bg: 'var(--danger-bg)' },
};

const API_GROUPS = [
  {
    name: 'Targets', endpoints: [
      {
        method: 'GET', path: '/api/v1/targets', summary: 'List targets',
        desc: 'Returns sales targets, optionally filtered by manager and month.',
        params: [['manager_id', 'integer', 'Filter by manager Employee ID'], ['month', 'string', 'YYYY-MM, e.g. 2026-06'], ['page', 'integer', 'Page number, default 1']],
        req: 'curl -H "Authorization: Bearer $TOKEN" \\\n  "https://one.company.com/api/v1/targets?manager_id=6781&month=2026-06"',
        res: '{\n  "count": 12,\n  "results": [\n    {\n      "employee_id": 7763,\n      "month": "2026-06",\n      "target": 480000,\n      "currency": "AED",\n      "locked": false\n    }\n  ]\n}',
      },
      {
        method: 'PUT', path: '/api/v1/targets/{id}', summary: 'Update a target',
        desc: 'Updates a single target value. Locked months (current + past) cannot be changed.',
        params: [['id', 'integer', 'Target record ID (path)'], ['target', 'number', 'New target amount in AED']],
        req: 'curl -X PUT -H "Authorization: Bearer $TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"target": 500000}\' \\\n  "https://one.company.com/api/v1/targets/48213"',
        res: '{\n  "id": 48213,\n  "target": 500000,\n  "updated_by": 6424,\n  "updated_at": "2026-06-09T11:42:00Z"\n}',
      },
    ],
  },
  {
    name: 'Excel Reports', endpoints: [
      {
        method: 'GET', path: '/api/v1/reports/files', summary: 'List report files',
        desc: 'Lists Excel report files with processing status.',
        params: [['category', 'string', 'Report category, e.g. Sales'], ['status', 'string', 'success | warning | failed'], ['year', 'integer', 'Filter by year']],
        req: 'curl -H "Authorization: Bearer $TOKEN" \\\n  "https://one.company.com/api/v1/reports/files?category=Sales&status=success"',
        res: '{\n  "count": 24,\n  "results": [\n    {\n      "id": 347,\n      "name": "Sales_Report_2026-06.xlsx",\n      "category": "Sales",\n      "size_bytes": 2000000,\n      "status": "success",\n      "sha256": "a64daae80b78…c51355a7d85d"\n    }\n  ]\n}',
      },
      {
        method: 'GET', path: '/api/v1/reports/files/{id}/download', summary: 'Download a file',
        desc: 'Returns a short-lived signed URL to download the original workbook.',
        params: [['id', 'integer', 'File ID (path)']],
        req: 'curl -H "Authorization: Bearer $TOKEN" \\\n  "https://one.company.com/api/v1/reports/files/347/download"',
        res: '{\n  "url": "https://files.company.com/…/202606.xlsx?sig=…",\n  "expires_in": 300\n}',
      },
    ],
  },
  {
    name: 'Catalog', endpoints: [
      {
        method: 'GET', path: '/api/v1/catalog/items', summary: 'Search items',
        desc: 'Search the SKU catalog by name, brand or barcode.',
        params: [['q', 'string', 'Free-text query'], ['barcode', 'string', 'EAN-13 lookup'], ['brand', 'string', 'Filter by brand']],
        req: 'curl -H "Authorization: Bearer $TOKEN" \\\n  "https://one.company.com/api/v1/catalog/items?barcode=5000000012345"',
        res: '{\n  "count": 1,\n  "results": [\n    {\n      "sku": "NRD-4207",\n      "name": "Stage 1 Infant Formula",\n      "ean": "5000000012345",\n      "brand": "Nordia",\n      "pack": "400 g tin",\n      "list_price": 40.0\n    }\n  ]\n}',
      },
    ],
  },
  {
    name: 'Process Master', endpoints: [
      {
        method: 'POST', path: '/api/v1/process/requests', summary: 'Start a request',
        desc: 'Creates a new request against a flow and routes it to the first step.',
        params: [['flow', 'string', 'Flow code, e.g. FL-03'], ['fields', 'object', 'Key/value form data for the flow']],
        req: 'curl -X POST -H "Authorization: Bearer $TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"flow":"FL-03","fields":{"region":"North"}}\' \\\n  "https://one.company.com/api/v1/process/requests"',
        res: '{\n  "id": "REQ-6",\n  "flow": "FL-03",\n  "status": "in_progress",\n  "current_step": "Auto-clean & validate"\n}',
      },
    ],
  },
];

function APIApp() {
  const flat = useMemoAPI(() => API_GROUPS.flatMap(g => g.endpoints.map(e => ({ ...e, group: g.name, key: e.method + e.path }))), []);
  const [active, setActive] = useStateAPI(flat[0].key);
  const [mobile, setMobile] = useStateAPI(() => typeof window !== 'undefined' && window.innerWidth < 760);
  useEffectAPI(() => { const h = () => setMobile(window.innerWidth < 760); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  const ep = flat.find(e => e.key === active) || flat[0];

  const nav = React.createElement('nav', { style: { width: mobile ? '100%' : 260, flex: 'none' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px 12px' } },
      React.createElement('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--ink)' } }, 'v1'),
      React.createElement('span', { style: { fontSize: 12, color: 'var(--muted)' } }, 'REST · JSON')),
    API_GROUPS.map(g => React.createElement('div', { key: g.name, style: { marginBottom: 16 } },
      React.createElement('div', { className: 'uplabel', style: { padding: '0 12px 6px' } }, g.name),
      g.endpoints.map(e => {
        const k = e.method + e.path; const on = k === active; const mc = METHOD_COLORS[e.method];
        return React.createElement('button', { key: k, onClick: () => setActive(k),
          style: { display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer', background: on ? 'var(--blue-050)' : 'transparent', color: on ? 'var(--ink)' : 'var(--gray-700)', fontSize: 13.5, fontWeight: on ? 700 : 500, fontFamily: 'inherit' },
          onMouseEnter: ev => { if (!on) ev.currentTarget.style.background = 'var(--surface-2)'; },
          onMouseLeave: ev => { if (!on) ev.currentTarget.style.background = 'transparent'; } },
          React.createElement('span', { style: { fontSize: 9.5, fontWeight: 800, color: mc.fg, width: 38, flex: 'none' } }, e.method),
          React.createElement('span', { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, e.summary));
      }))));

  return React.createElement('div', { className: 'fadein' },
    React.createElement(Page, { max: 1180 },
      React.createElement('h1', { style: { fontSize: 30, fontWeight: 700, marginBottom: 6 } }, 'API'),
      React.createElement('p', { style: { fontSize: 17, color: 'var(--muted)', margin: '0 0 20px' } }, 'Programmatic access to One. All endpoints use bearer-token auth and return JSON.'),
      /* auth callout */
      React.createElement(Card, { style: { marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' } },
        React.createElement(Icon, { name: 'lock', size: 18, style: { color: 'var(--muted)', flex: 'none', marginTop: 1 } }),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' } }, 'Authentication'),
          React.createElement('div', { style: { fontSize: 14, color: 'var(--muted)', marginTop: 3, lineHeight: 1.5 } },
            'Pass a personal token in the ', React.createElement('code', { style: { fontFamily: 'ui-monospace, monospace', fontSize: 13, color: 'var(--body)' } }, 'Authorization: Bearer <token>'), ' header. Generate tokens in your account settings.'))),
      React.createElement('div', { style: { display: 'flex', gap: 32, alignItems: 'flex-start', flexDirection: mobile ? 'column' : 'row' } },
        nav,
        React.createElement(APIEndpoint, { ep, mobile }))));
}

function APIEndpoint({ ep, mobile }) {
  const mc = METHOD_COLORS[ep.method];
  return React.createElement('div', { style: { flex: 1, minWidth: 0 } },
    React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginBottom: 6 } }, ep.group),
    React.createElement('h2', { style: { fontSize: 22, fontWeight: 700, marginBottom: 14 } }, ep.summary),
    /* method + path bar */
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', marginBottom: 18, overflowX: 'auto' } },
      React.createElement('span', { style: { fontSize: 12.5, fontWeight: 800, letterSpacing: '.04em', color: mc.fg, background: mc.bg, padding: '4px 10px', borderRadius: 'var(--r-sm)', flex: 'none' } }, ep.method),
      React.createElement('code', { style: { fontFamily: 'ui-monospace, monospace', fontSize: 14.5, color: 'var(--ink)', whiteSpace: 'nowrap' } }, ep.path)),
    React.createElement('p', { style: { fontSize: 15.5, color: 'var(--body)', lineHeight: 1.6, margin: '0 0 24px' } }, ep.desc),
    /* parameters */
    ep.params && ep.params.length > 0 && React.createElement('div', { style: { marginBottom: 24 } },
      React.createElement('div', { className: 'uplabel', style: { marginBottom: 12 } }, 'Parameters'),
      React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
        ep.params.map((p, i) => React.createElement('div', { key: p[0], style: { display: 'grid', gridTemplateColumns: mobile ? '1fr' : '180px 90px 1fr', gap: mobile ? 4 : 14, padding: '12px 16px', borderTop: i ? '1px solid var(--border-2)' : 'none', alignItems: 'baseline' } },
          React.createElement('code', { style: { fontFamily: 'ui-monospace, monospace', fontSize: 13.5, color: 'var(--ink)', fontWeight: 600 } }, p[0]),
          React.createElement('span', { style: { fontSize: 12.5, color: 'var(--muted)', fontFamily: 'ui-monospace, monospace' } }, p[1]),
          React.createElement('span', { style: { fontSize: 13.5, color: 'var(--body)' } }, p[2]))))),
    /* request example */
    React.createElement(CodeBlock, { label: 'Request', code: ep.req, lang: 'bash' }),
    /* response example */
    React.createElement(CodeBlock, { label: 'Response · 200', code: ep.res, lang: 'json' }));
}

function CodeBlock({ label, code, lang }) {
  const [copied, setCopied] = useStateAPI(false);
  return React.createElement('div', { style: { marginBottom: 20 } },
    React.createElement('div', { className: 'uplabel', style: { marginBottom: 10 } }, label),
    React.createElement('div', { style: { position: 'relative', background: '#0f1419', borderRadius: 'var(--r)', border: '1px solid var(--border)', overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 8px 14px', borderBottom: '1px solid rgba(255,255,255,.08)' } },
        React.createElement('span', { style: { fontSize: 11.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#7d8694' } }, lang),
        React.createElement('button', { onClick: () => { setCopied(true); setTimeout(() => setCopied(false), 1400); },
          style: { display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? '#2dd082' : '#aeb6c2', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit' } },
          React.createElement(Icon, { name: copied ? 'check' : 'copy', size: 13 }), copied ? 'Copied' : 'Copy')),
      React.createElement('pre', { style: { margin: 0, padding: '14px 16px', overflowX: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 13, lineHeight: 1.6, color: '#e4e8ee' } },
        React.createElement('code', null, code))));
}

window.APIApp = APIApp;
