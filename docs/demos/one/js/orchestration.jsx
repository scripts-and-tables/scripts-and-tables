/* Data Pipeline — AI + data agent fabric monitor (agents / dashboard / jobs / files / errors). */
const { useState: useStateO, useMemo: useMemoO } = React;

const ORCH_PIPELINES = [
  { name: 'Commercial Daily', schedule: 'Daily · 06:00', health: 'healthy', last: '06:00', next: 'Tomorrow 06:00', success: 99, jobs: 14 },
  { name: 'EPOS Ingest', schedule: 'Every 15 min', health: 'healthy', last: '11:45', next: '12:00', success: 97, jobs: 96 },
  { name: 'Order Imports', schedule: 'On upload', health: 'healthy', last: '11:19', next: 'On demand', success: 82, jobs: 12 },
  { name: 'Commission Statements', schedule: 'Monthly · 1st', health: 'healthy', last: 'Jun 01', next: 'Jul 01', success: 100, jobs: 3 },
  { name: 'SKU Sync', schedule: 'Hourly', health: 'degraded', last: '11:30', next: '12:30', success: 88, jobs: 24 },
  { name: 'Catalog Export', schedule: 'Daily · 22:00', health: 'down', last: 'Failed 22:00', next: 'Paused', success: 41, jobs: 6 },
];
const HEALTH = {
  healthy: { kind: 'success', label: 'Healthy', dot: 'var(--success-fg)' },
  degraded: { kind: 'warning', label: 'Degraded', dot: 'var(--warning-ink)' },
  down: { kind: 'danger', label: 'Down', dot: 'var(--danger-fg)' },
};
const JOB_STATUS = { success: { kind: 'success', label: 'Success' }, running: { kind: 'info', label: 'Running' }, failed: { kind: 'danger', label: 'Failed' }, queued: { kind: 'default', label: 'Queued' } };

function oprng(s) { let x = s >>> 0; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }
function pad2(n) { return String(n).padStart(2, '0'); }

/* ---------- Agents (the new headline concept) ---------- */
const ORCH_AGENTS = [
  { name: 'Ingestor', kind: 'data', role: 'Pulls raw feeds from sources & queues for parsing', health: 'healthy', tasks: 41280, tput: '420 rec/s', lat: '38 ms', uptime: '99.98%', beat: '1s ago', spark: [6, 7, 5, 8, 9, 7, 8, 9] },
  { name: 'SchemaGuard', kind: 'data', role: 'Validates inbound files against expected schema', health: 'healthy', tasks: 12480, tput: '320 rec/s', lat: '52 ms', uptime: '99.95%', beat: '2s ago', spark: [4, 5, 5, 6, 5, 7, 6, 7] },
  { name: 'Normalizer', kind: 'data', role: 'Cleans, de-dupes & standardises rows', health: 'healthy', tasks: 38640, tput: '510 rec/s', lat: '44 ms', uptime: '99.97%', beat: '1s ago', spark: [7, 6, 8, 7, 9, 8, 9, 8] },
  { name: 'Warehouse Loader', kind: 'data', role: 'Bulk-loads curated rows into the warehouse', health: 'healthy', tasks: 29110, tput: '280 rec/s', lat: '120 ms', uptime: '99.90%', beat: '3s ago', spark: [5, 6, 6, 5, 7, 6, 6, 7] },
  { name: 'Anomaly Detector', kind: 'ai', role: 'Flags outliers & data drift in real time', health: 'degraded', tasks: 8920, tput: '95 rec/s', lat: '210 ms', uptime: '98.40%', beat: '6s ago', spark: [6, 4, 7, 3, 6, 4, 7, 5] },
  { name: 'Forecast Engine', kind: 'ai', role: 'Refreshes demand forecasts from new sell-out', health: 'healthy', tasks: 1540, tput: '12 batch/min', lat: '1.8 s', uptime: '99.80%', beat: '4s ago', spark: [3, 4, 4, 5, 4, 6, 5, 6] },
  { name: 'Hierarchy Mapper', kind: 'ai', role: 'Maps free-text SKUs to the product hierarchy', health: 'healthy', tasks: 6730, tput: '60 rec/s', lat: '340 ms', uptime: '99.60%', beat: '5s ago', spark: [4, 5, 4, 6, 5, 5, 6, 6] },
  { name: 'Model Refresher', kind: 'data', role: 'Rebuilds aggregates & semantic models', health: 'healthy', tasks: 2210, tput: '8 models/hr', lat: '4.2 s', uptime: '99.99%', beat: '8s ago', spark: [5, 5, 6, 5, 6, 6, 7, 6] },
  { name: 'Reconciler', kind: 'data', role: 'Cross-checks source vs warehouse totals', health: 'degraded', tasks: 4180, tput: '40 rec/s', lat: '180 ms', uptime: '99.20%', beat: '7s ago', spark: [6, 5, 4, 6, 4, 5, 4, 5] },
  { name: 'Notifier', kind: 'data', role: 'Dispatches alerts & run summaries', health: 'down', tasks: 980, tput: '0 msg/s', lat: '—', uptime: '94.10%', beat: '4m ago', spark: [5, 4, 5, 3, 2, 1, 0, 0] },
];
const AGENT_KIND = {
  ai: { label: 'AI', bg: 'var(--blue-bg, rgba(80,120,255,0.12))', fg: 'var(--blue)', icon: 'sparkles' },
  data: { label: 'Data', bg: 'var(--surface-2)', fg: 'var(--muted)', icon: 'database' },
};

const ORCH_JOBS = (() => {
  const names = ['extract_sellout', 'validate_schema', 'normalise_rows', 'load_warehouse', 'refresh_models', 'send_notifications', 'archive_source', 'reconcile_totals', 'sync_skus', 'export_catalog', 'build_statements', 'parse_orders', 'map_hierarchy', 'compute_kpis'];
  const agents = ['Ingestor', 'SchemaGuard', 'Normalizer', 'Warehouse Loader', 'Model Refresher', 'Notifier', 'Ingestor', 'Reconciler', 'Hierarchy Mapper', 'Notifier', 'Warehouse Loader', 'SchemaGuard', 'Hierarchy Mapper', 'Forecast Engine'];
  const pls = ORCH_PIPELINES.map(p => p.name); const rnd = oprng(42); const out = [];
  for (let i = 0; i < 22; i++) {
    const r = rnd();
    let status = 'success'; if (r < 0.08) status = 'failed'; else if (r < 0.14) status = 'running'; else if (r < 0.2) status = 'queued';
    out.push({ id: i, name: names[i % names.length], agent: agents[i % agents.length], pipeline: pls[i % pls.length], schedule: ['Every 15 min', 'Hourly', 'Daily · 06:00', 'On upload'][i % 4], last: pad2(11 - (i % 11)) + ':' + pad2((i * 7) % 60), duration: (2 + Math.floor(rnd() * 240)) + 's', status });
  }
  return out;
})();

const FILE_STAGES = ['Received', 'Validated', 'Transformed', 'Loaded'];
const ORCH_FILES = (() => {
  const srcs = ['CITY_COOP', 'RETAIL_A', 'MEGA_MART', 'ONLINE_HUB', 'NORTH_COOP', 'Catalog', 'RETAIL_B'];
  const rnd = oprng(7); const out = [];
  for (let i = 0; i < 18; i++) {
    const r = rnd(); let status = 'processed', stage = 4;
    if (r < 0.16) { status = 'failed'; stage = 1 + Math.floor(rnd() * 3); }
    else if (r < 0.34) { status = 'pending'; stage = 1 + Math.floor(rnd() * 3); }
    out.push({ id: 800 + i, name: (2026) + pad2(1 + (i % 6)) + '_' + ['SELLOUT', 'PO', 'SKU', 'CATALOG'][i % 4] + '_' + pad2(i) + '.xlsx', source: srcs[i % srcs.length], stage, status, received: pad2(11 - (i % 11)) + ':' + pad2((i * 11) % 60) });
  }
  return out;
})();
const FILE_STATUS = { processed: { kind: 'success', label: 'Processed' }, pending: { kind: 'info', label: 'In progress' }, failed: { kind: 'danger', label: 'Failed' } };

const ORCH_ERRORS = [
  { sev: 'error', job: 'export_catalog', agent: 'Notifier', pipeline: 'Catalog Export', msg: 'Connection timeout to export SFTP after 3 retries.', time: 'Today 22:00:14' },
  { sev: 'error', job: 'parse_orders', agent: 'SchemaGuard', pipeline: 'Order Imports', msg: 'Template header mismatch on sheet "Region2" — column SKU_ID not found.', time: 'Today 10:54:49' },
  { sev: 'warning', job: 'sync_skus', agent: 'Reconciler', pipeline: 'SKU Sync', msg: '4 SKUs skipped: no price found for region North.', time: 'Today 11:30:02' },
  { sev: 'error', job: 'load_warehouse', agent: 'Warehouse Loader', pipeline: 'EPOS Ingest', msg: 'Duplicate rows rejected (12) — unique key violation.', time: 'Today 09:12:33' },
  { sev: 'warning', job: 'reconcile_totals', agent: 'Reconciler', pipeline: 'Commercial Daily', msg: 'Variance 1.8% between source and warehouse totals.', time: 'Today 06:04:50' },
  { sev: 'warning', job: 'map_hierarchy', agent: 'Hierarchy Mapper', pipeline: 'EPOS Ingest', msg: 'AI confidence below 0.7 on 23 SKU mappings — queued for review.', time: 'Today 11:18:07' },
];

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

function OrchestrationApp() {
  const [tab, setTab] = useStateO('agents');
  const tabs = [['agents', 'Agents', 'robot'], ['dashboard', 'Pipelines', 'sitemap'], ['jobs', 'Jobs', 'refresh'], ['files', 'Files', 'fileText'], ['errors', 'Errors', 'alert']];
  const errCount = ORCH_ERRORS.filter(e => e.sev === 'error').length;
  return React.createElement('div', { className: 'fadein' },
    React.createElement(Page, { max: 1180 },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 } },
        React.createElement('h1', { style: { fontSize: 30, fontWeight: 700, margin: 0 } }, 'Data Pipeline'),
        React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, letterSpacing: '.04em', color: 'var(--blue)', background: 'var(--blue-bg, rgba(80,120,255,0.12))', borderRadius: 99, padding: '3px 10px' } },
          React.createElement(Icon, { name: 'sparkles', size: 13 }), 'AI AGENTS')),
      React.createElement('p', { style: { fontSize: 17, color: 'var(--muted)', margin: '0 0 22px' } }, 'A fabric of AI and data agents that ingest, clean, model and reconcile every feed — monitored live, end to end.'),
      React.createElement('div', { style: { display: 'flex', gap: 26, borderBottom: '1px solid var(--border)', marginBottom: 26, overflowX: 'auto' } },
        tabs.map(([id, label, icon]) => React.createElement('button', { key: id, onClick: () => setTab(id),
          style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 0 14px', border: 'none', borderBottom: '2px solid ' + (tab === id ? 'var(--blue)' : 'transparent'), background: 'transparent', cursor: 'pointer', fontSize: 15.5, fontWeight: 600, color: tab === id ? 'var(--blue)' : 'var(--muted)', whiteSpace: 'nowrap', fontFamily: 'inherit' } },
          React.createElement(Icon, { name: icon, size: 17 }), label,
          id === 'errors' && errCount > 0 && React.createElement('span', { style: { fontSize: 11.5, fontWeight: 700, color: '#fff', background: 'var(--danger-fg)', borderRadius: 99, padding: '1px 7px' } }, errCount))) ),
      tab === 'agents' && React.createElement(OrchAgents, { onTab: setTab }),
      tab === 'dashboard' && React.createElement(OrchDashboard, { onTab: setTab }),
      tab === 'jobs' && React.createElement(OrchJobs),
      tab === 'files' && React.createElement(OrchFiles),
      tab === 'errors' && React.createElement(OrchErrors)));
}

/* ---------- Agents (primary view) ---------- */
function OrchAgents({ onTab }) {
  const [f, setF] = useStateO('all');
  const aiCount = ORCH_AGENTS.filter(a => a.kind === 'ai').length;
  const healthy = ORCH_AGENTS.filter(a => a.health === 'healthy').length;
  const degraded = ORCH_AGENTS.filter(a => a.health === 'degraded').length;
  const down = ORCH_AGENTS.filter(a => a.health === 'down').length;
  const filtered = f === 'all' ? ORCH_AGENTS
    : f === 'ai' ? ORCH_AGENTS.filter(a => a.kind === 'ai')
    : f === 'data' ? ORCH_AGENTS.filter(a => a.kind === 'data')
    : ORCH_AGENTS.filter(a => a.health === f);
  return React.createElement('div', null,
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 } },
      React.createElement(OStat, { icon: 'robot', label: 'Agents online', value: (ORCH_AGENTS.length - down) + ' / ' + ORCH_AGENTS.length, ok: true }),
      React.createElement(OStat, { icon: 'sparkles', label: 'AI agents', value: aiCount }),
      React.createElement(OStat, { icon: 'trending', label: 'Records / min', value: '~74k' }),
      React.createElement(OStat, { icon: 'check', label: 'Healthy', value: healthy, ok: true }),
      React.createElement(OStat, { icon: 'alert', label: 'Degraded / down', value: (degraded + down), danger: down > 0 })),
    React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' } },
      [['all', 'All agents'], ['ai', 'AI'], ['data', 'Data'], ['healthy', 'Healthy'], ['degraded', 'Degraded'], ['down', 'Down']].map(([id, label]) =>
        React.createElement('button', { key: id, onClick: () => setF(id), style: pill(f === id) }, label))),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 16 } },
      filtered.map(a => React.createElement(AgentCard, { key: a.name, a: a }))));
}

function AgentCard({ a }) {
  const h = HEALTH[a.health];
  const k = AGENT_KIND[a.kind];
  return React.createElement(Card, { pad: 18, hover: true },
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 } },
        React.createElement('div', { style: { width: 38, height: 38, flex: 'none', borderRadius: 10, background: k.bg, color: k.fg, display: 'grid', placeItems: 'center' } },
          React.createElement(Icon, { name: a.kind === 'ai' ? 'sparkles' : 'database', size: 19 })),
        React.createElement('div', { style: { minWidth: 0 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            React.createElement('span', { style: { fontSize: 16, fontWeight: 700, color: 'var(--ink)', fontFamily: MONO } }, a.name),
            React.createElement('span', { style: { fontSize: 10.5, fontWeight: 800, letterSpacing: '.05em', color: k.fg, background: k.bg, borderRadius: 5, padding: '2px 6px' } }, k.label)),
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--muted)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, a.role))),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, flex: 'none' } },
        React.createElement('span', { style: { width: 9, height: 9, borderRadius: '50%', background: h.dot, boxShadow: a.health === 'healthy' ? '0 0 0 3px rgba(34,197,94,0.15)' : 'none', flex: 'none' } }),
        React.createElement(StatusPill, { kind: h.kind }, h.label))),
    React.createElement(Sparkline, { data: a.spark, color: h.dot }),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginTop: 14 } },
      React.createElement(AgentStat, { label: 'Tasks', value: a.tasks.toLocaleString() }),
      React.createElement(AgentStat, { label: 'Throughput', value: a.tput }),
      React.createElement(AgentStat, { label: 'Avg latency', value: a.lat }),
      React.createElement(AgentStat, { label: 'Uptime', value: a.uptime })),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-2)', fontSize: 12.5, color: 'var(--muted)' } },
      React.createElement('span', { style: { width: 6, height: 6, borderRadius: '50%', background: h.dot, flex: 'none' } }),
      'Last heartbeat ', React.createElement('span', { style: { color: 'var(--body)', fontWeight: 600, fontFamily: MONO } }, a.beat)));
}
function AgentStat({ label, value }) {
  return React.createElement('div', null,
    React.createElement('div', { className: 'uplabel', style: { fontSize: 10.5, marginBottom: 2 } }, label),
    React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: MONO, fontVariantNumeric: 'tabular-nums' } }, value));
}
function Sparkline({ data, color }) {
  const max = Math.max.apply(null, data.concat([1]));
  return React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 3, height: 30, marginTop: 2 } },
    data.map((v, i) => React.createElement('div', { key: i, style: { flex: 1, height: Math.max(8, Math.round((v / max) * 100)) + '%', background: color, opacity: 0.35 + 0.65 * (i / (data.length - 1)), borderRadius: 2 } })));
}

/* ---------- Pipelines dashboard ---------- */
function OrchDashboard({ onTab }) {
  const healthy = ORCH_PIPELINES.filter(p => p.health === 'healthy').length;
  const pending = ORCH_FILES.filter(f => f.status === 'pending').length;
  return React.createElement('div', null,
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 24 } },
      React.createElement(OStat, { icon: 'sitemap', label: 'Pipelines healthy', value: healthy + ' / ' + ORCH_PIPELINES.length, ok: true }),
      React.createElement(OStat, { icon: 'refresh', label: 'Jobs run today', value: '128' }),
      React.createElement(OStat, { icon: 'trending', label: 'Success rate', value: '94%' }),
      React.createElement(OStat, { icon: 'hourglass', label: 'Files pending', value: pending }),
      React.createElement(OStat, { icon: 'alert', label: 'Open errors', value: ORCH_ERRORS.filter(e => e.sev === 'error').length, danger: true })),
    React.createElement('div', { className: 'uplabel', style: { marginBottom: 14 } }, 'Pipelines'),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 } },
      ORCH_PIPELINES.map(p => { const h = HEALTH[p.health]; return React.createElement(Card, { key: p.name, pad: 18 },
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 } },
          React.createElement('div', null,
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9 } },
              React.createElement('span', { style: { width: 9, height: 9, borderRadius: '50%', background: h.dot, flex: 'none' } }),
              React.createElement('span', { style: { fontSize: 16, fontWeight: 700, color: 'var(--ink)' } }, p.name)),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 4 } }, p.schedule)),
          React.createElement(StatusPill, { kind: h.kind }, h.label)),
        React.createElement('div', { style: { height: 6, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden', marginBottom: 12 } },
          React.createElement('div', { style: { width: p.success + '%', height: '100%', background: h.dot } })),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' } },
          React.createElement('span', null, 'Last run ', React.createElement('strong', { style: { color: 'var(--body)' } }, p.last)),
          React.createElement('span', null, p.success + '% success'),
          React.createElement('span', null, 'Next ', React.createElement('strong', { style: { color: 'var(--body)' } }, p.next)))); })));
}
function OStat({ icon, label, value, ok, danger }) {
  const col = danger ? 'var(--danger-fg)' : ok ? 'var(--success-fg)' : 'var(--ink)';
  return React.createElement(Card, { pad: 18 },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 } },
      React.createElement(Icon, { name: icon, size: 16, style: { color: 'var(--muted)' } }), React.createElement('span', { className: 'uplabel' }, label)),
    React.createElement('div', { style: { fontSize: 28, fontWeight: 800, color: col, lineHeight: 1 } }, value));
}

/* ---------- Jobs ---------- */
function OrchJobs() {
  const [f, setF] = useStateO('all');
  const rows = f === 'all' ? ORCH_JOBS : ORCH_JOBS.filter(j => j.status === f);
  return React.createElement('div', null,
    React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' } },
      [['all', 'All'], ['running', 'Running'], ['success', 'Success'], ['failed', 'Failed'], ['queued', 'Queued']].map(([id, label]) =>
        React.createElement('button', { key: id, onClick: () => setF(id), style: pill(f === id) }, label))),
    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1.4fr 1.1fr 1.1fr 1fr 90px 110px', gap: 14, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' } },
        ['Job', 'Agent', 'Pipeline', 'Schedule', 'Duration', 'Status'].map((h, i) => React.createElement('div', { key: i, className: 'uplabel', style: { fontSize: 11.5, textAlign: i >= 5 ? 'right' : 'left' } }, h))),
      rows.map((j, i) => { const sp = JOB_STATUS[j.status]; return React.createElement('div', { key: j.id, style: { display: 'grid', gridTemplateColumns: '1.4fr 1.1fr 1.1fr 1fr 90px 110px', gap: 14, padding: '13px 18px', alignItems: 'center', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
        React.createElement('code', { style: { fontFamily: MONO, fontSize: 13.5, color: 'var(--ink)', fontWeight: 600 } }, j.name),
        React.createElement('span', { style: { fontSize: 13, color: 'var(--blue)', fontWeight: 600, fontFamily: MONO } }, j.agent),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--body)' } }, j.pipeline),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--muted)' } }, j.schedule),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums', fontFamily: MONO } }, j.duration),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end' } }, React.createElement(StatusPill, { kind: sp.kind }, sp.label))); })));
}
function pill(active) {
  return { padding: '7px 14px', borderRadius: 'var(--r-pill)', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
    border: '1px solid ' + (active ? 'var(--blue)' : 'var(--border)'), background: active ? 'var(--blue)' : 'var(--surface)', color: active ? '#fff' : 'var(--gray-700)' };
}

/* ---------- Files ---------- */
function OrchFiles() {
  const [f, setF] = useStateO('all');
  const rows = f === 'all' ? ORCH_FILES : ORCH_FILES.filter(x => x.status === f);
  return React.createElement('div', null,
    React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' } },
      [['all', 'All files'], ['pending', 'In progress'], ['failed', 'Failed'], ['processed', 'Processed']].map(([id, label]) =>
        React.createElement('button', { key: id, onClick: () => setF(id), style: pill(f === id) }, label))),
    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      ORCH_FILES.length && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.4fr 110px 90px', gap: 14, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' } },
        ['File', 'Source', 'Stage', 'Status', 'Received'].map((h, i) => React.createElement('div', { key: i, className: 'uplabel', style: { fontSize: 11.5, textAlign: i === 4 ? 'right' : 'left' } }, h))),
      rows.map((file, i) => { const sp = FILE_STATUS[file.status]; return React.createElement('div', { key: file.id, style: { display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.4fr 110px 90px', gap: 14, padding: '13px 18px', alignItems: 'center', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, file.name),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--body)' } }, file.source),
        React.createElement(StageDots, { stage: file.stage, failed: file.status === 'failed' }),
        React.createElement('div', null, React.createElement(StatusPill, { kind: sp.kind }, sp.label)),
        React.createElement('span', { style: { fontSize: 13, color: 'var(--muted)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' } }, file.received)); })));
}
function StageDots({ stage, failed }) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
    FILE_STAGES.map((s, i) => {
      const done = i < stage; const isFail = failed && i === stage;
      const col = isFail ? 'var(--danger-fg)' : done ? 'var(--success-fg)' : 'var(--gray-300)';
      return React.createElement(React.Fragment, { key: s },
        React.createElement('span', { title: s, style: { width: 8, height: 8, borderRadius: '50%', background: col, flex: 'none' } }),
        i < FILE_STAGES.length - 1 && React.createElement('span', { style: { width: 14, height: 2, background: done ? 'var(--success-fg)' : 'var(--gray-300)' } }));
    }),
    React.createElement('span', { style: { fontSize: 12, color: 'var(--muted)', marginLeft: 6 } }, failed ? FILE_STAGES[stage] : (stage >= 4 ? 'Done' : FILE_STAGES[stage])));
}

/* ---------- Errors ---------- */
function OrchErrors() {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
    ORCH_ERRORS.map((e, i) => { const err = e.sev === 'error'; return React.createElement(Card, { key: i, pad: 16, style: { display: 'flex', gap: 14, alignItems: 'flex-start', borderLeft: '3px solid ' + (err ? 'var(--danger-fg)' : 'var(--warning-ink)') } },
      React.createElement('div', { style: { width: 36, height: 36, flex: 'none', borderRadius: '50%', background: err ? 'var(--danger-bg)' : 'var(--warning-bg)', color: err ? 'var(--danger-fg)' : 'var(--warning-ink)', display: 'grid', placeItems: 'center' } },
        React.createElement(Icon, { name: 'alert', size: 18 })),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' } },
          React.createElement('code', { style: { fontFamily: MONO, fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' } }, e.job),
          React.createElement('span', { style: { fontSize: 11.5, fontWeight: 700, color: 'var(--blue)', background: 'var(--blue-bg, rgba(80,120,255,0.12))', borderRadius: 5, padding: '1px 7px', fontFamily: MONO } }, e.agent),
          React.createElement('span', { style: { fontSize: 12.5, color: 'var(--muted)' } }, e.pipeline),
          React.createElement('span', { style: { fontSize: 12.5, color: 'var(--faint)', marginLeft: 'auto' } }, e.time)),
        React.createElement('div', { style: { fontSize: 14, color: 'var(--body)', marginTop: 5, lineHeight: 1.5 } }, e.msg)),
      React.createElement(Button, { variant: 'ghost', size: 'sm', icon: 'refresh' }, 'Retry')); }));
}

window.OrchestrationApp = OrchestrationApp;
