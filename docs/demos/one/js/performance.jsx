/* User Performance — scored user list + profile (score, KPI breakdown, trends). */
const { useState: useStateP, useMemo: useMemoP, useEffect: useEffectP } = React;

const PERF_KPIS = [
  { id: 'revenue', name: 'Revenue Achievement', weight: 30, unit: '%' },
  { id: 'newcust', name: 'New Customer Acquisition', weight: 15, unit: '%' },
  { id: 'msl', name: 'Focus SKU Compliance', weight: 20, unit: '%' },
  { id: 'collection', name: 'Collection Efficiency', weight: 15, unit: '%' },
  { id: 'coverage', name: 'Visit Coverage', weight: 12, unit: '%' },
  { id: 'mix', name: 'Product Mix', weight: 8, unit: '%' },
];
const PERF_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const PERF_PEOPLE = [
  ['Iris', 'EMP-0006', 'Personal Care', 'North'], ['Karim', 'EMP-0007', 'Personal Care', 'Central'],
  ['Mona', 'EMP-0009', 'Personal Care', 'North'], ['Paul', 'EMP-0011', 'Food', 'West'],
  ['Marc', 'EMP-0012', 'Food', 'Central'], ['John', 'EMP-0002', 'Personal Care', 'East'],
  ['Omar', 'EMP-0003', 'Beverages', 'North'], ['Sami', 'EMP-0008', 'Food', 'West'],
  ['Gabriel', 'EMP-0010', 'Beverages', 'Central'], ['Sara', 'EMP-0001', 'Personal Care', 'East'],
  ['Ryan', 'EMP-0013', 'Food', 'North'], ['Dina', 'EMP-0014', 'Beverages', 'West'],
  ['Eli', 'EMP-0015', 'Personal Care', 'Central'], ['Gary', 'EMP-0016', 'Food', 'East'],
  ['Hana', 'EMP-0017', 'Beverages', 'North'], ['Adrian', 'EMP-0018', 'Personal Care', 'West'],
];

function prng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function idSeedP(id) { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
const PERF_USERS = PERF_PEOPLE.map(([name, id, dept, region], i) => {
  const rnd = prng(idSeedP(id) * 31 + 7);
  const kpis = PERF_KPIS.map(k => {
    const base = 62 + rnd() * 46; // 62..108
    const trend = PERF_MONTHS.map((_, m) => Math.max(40, Math.min(118, Math.round(base + (rnd() - 0.45) * 26 + m * (rnd() * 4 - 1)))));
    return { id: k.id, value: trend[trend.length - 1], trend };
  });
  const score = Math.round(kpis.reduce((s, k) => { const w = PERF_KPIS.find(x => x.id === k.id).weight; return s + Math.min(k.value, 120) * w / 100; }, 0));
  const prev = Math.round(score - (rnd() * 10 - 4));
  return { name, id, dept, region, kpis, score, prev, delta: score - prev,
    trend: PERF_MONTHS.map((_, m) => Math.round(kpis.reduce((s, k) => s + Math.min(k.trend[m], 120) * PERF_KPIS.find(x => x.id === k.id).weight / 100, 0))) };
}).sort((a, b) => b.score - a.score);

function scoreBand(s) {
  if (s >= 100) return { label: 'Exceeds', color: 'var(--success-fg)', bg: 'var(--success-bg)' };
  if (s >= 85) return { label: 'On track', color: 'var(--blue)', bg: 'var(--blue-050)' };
  if (s >= 70) return { label: 'Developing', color: 'var(--warning-ink)', bg: 'var(--warning-bg)' };
  return { label: 'Below target', color: 'var(--danger-fg)', bg: 'var(--danger-bg)' };
}
function PerfAvatar({ name, size = 40 }) {
  const cs = ['var(--blue)', 'var(--green)', 'var(--amber)', 'var(--teal)', 'var(--purple)', 'var(--cyan)', 'var(--indigo)', 'var(--orange)'];
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const init = name.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return React.createElement('div', { style: { width: size, height: size, borderRadius: '50%', flex: 'none', background: cs[h % cs.length], color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: size * 0.36 } }, init);
}

/* score ring */
function ScoreRing({ score, size = 132, stroke = 11 }) {
  const band = scoreBand(score);
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, pct = Math.min(score, 120) / 120;
  return React.createElement('div', { style: { position: 'relative', width: size, height: size, flex: 'none' } },
    React.createElement('svg', { width: size, height: size, style: { transform: 'rotate(-90deg)' } },
      React.createElement('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: 'var(--border)', strokeWidth: stroke }),
      React.createElement('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: band.color, strokeWidth: stroke, strokeLinecap: 'round', strokeDasharray: c, strokeDashoffset: c * (1 - pct) })),
    React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
      React.createElement('div', { style: { fontSize: size * 0.3, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 } }, score),
      React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)', marginTop: 2 } }, 'score')));
}
/* sparkline */
function Spark({ data, w = 96, h = 30, color = 'var(--blue)' }) {
  const min = Math.min(...data) - 4, max = Math.max(...data) + 4, rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / rng) * h]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return React.createElement('svg', { width: w, height: h, style: { display: 'block', overflow: 'visible' } },
    React.createElement('path', { d, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
    React.createElement('circle', { cx: pts[pts.length - 1][0], cy: pts[pts.length - 1][1], r: 2.6, fill: color }));
}
function Delta({ v }) {
  const up = v >= 0;
  return React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 700, color: up ? 'var(--success-fg)' : 'var(--danger-fg)' } },
    React.createElement(Icon, { name: up ? 'trending' : 'chartLine', size: 13 }), (up ? '+' : '') + v);
}

/* ---------- main ---------- */
function PerformanceApp() {
  const [q, setQ] = useStateP('');
  const [dept, setDept] = useStateP('All departments');
  const [sort, setSort] = useStateP('score');
  const [sel, setSel] = useStateP(null);
  const [mobile, setMobile] = useStateP(() => typeof window !== 'undefined' && window.innerWidth < 760);
  useEffectP(() => { const h = () => setMobile(window.innerWidth < 760); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);

  const depts = ['All departments', ...Array.from(new Set(PERF_USERS.map(u => u.dept)))];
  const list = useMemoP(() => {
    let r = PERF_USERS.filter(u => (dept === 'All departments' || u.dept === dept) && (u.name + ' ' + u.id + ' ' + u.region).toLowerCase().includes(q.toLowerCase()));
    if (sort === 'name') r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'delta') r = [...r].sort((a, b) => b.delta - a.delta);
    else r = [...r].sort((a, b) => b.score - a.score);
    return r;
  }, [q, dept, sort]);
  const teamAvg = Math.round(PERF_USERS.reduce((s, u) => s + u.score, 0) / PERF_USERS.length);

  return React.createElement('div', { className: 'fadein' },
    React.createElement(Page, { max: 1180 },
      React.createElement('h1', { style: { fontSize: 30, fontWeight: 700, marginBottom: 6 } }, 'User Performance'),
      React.createElement('p', { style: { fontSize: 17, color: 'var(--muted)', margin: '0 0 24px' } }, 'Weighted KPI scores across the field force. Open anyone for their full scorecard and trends.'),
      /* summary stats */
      React.createElement('div', { style: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 } },
        React.createElement(PerfStat, { label: 'People scored', value: PERF_USERS.length }),
        React.createElement(PerfStat, { label: 'Team average', value: teamAvg, band: true }),
        React.createElement(PerfStat, { label: 'Exceeding target', value: PERF_USERS.filter(u => u.score >= 100).length, sub: 'score ≥ 100' }),
        React.createElement(PerfStat, { label: 'Below target', value: PERF_USERS.filter(u => u.score < 70).length, sub: 'score < 70', danger: true })),
      /* filters */
      React.createElement('div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 } },
        React.createElement('div', { style: { flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 46, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)' } },
          React.createElement(Icon, { name: 'search', size: 18, style: { color: 'var(--faint)' } }),
          React.createElement('input', { value: q, onChange: e => setQ(e.target.value), placeholder: 'Search by name, Employee ID or region…', style: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit' } })),
        PerfSelect(dept, setDept, depts),
        PerfSelect(sort, setSort, ['score', 'delta', 'name'], { score: 'Sort: Score', delta: 'Sort: Trend ▲', name: 'Sort: Name' })),
      /* leaderboard */
      React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
        !mobile && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '38px 1fr 120px 120px 120px 80px', gap: 14, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' } },
          ['#', 'User', 'Department', '6-month trend', 'vs last', 'Score'].map((h, i) => React.createElement('div', { key: i, className: 'uplabel', style: { fontSize: 11.5, textAlign: i >= 4 ? 'right' : 'left' } }, h))),
        list.map((u, i) => mobile
          ? React.createElement(PerfRowMobile, { key: u.id, u, rank: sort === 'score' ? i + 1 : null, onOpen: () => setSel(u) })
          : React.createElement(PerfRow, { key: u.id, u, rank: sort === 'score' ? i + 1 : null, onOpen: () => setSel(u) })))),
    sel && React.createElement('div', { onClick: () => setSel(null), style: { position: 'fixed', inset: 0, background: 'rgba(16,24,40,.42)', zIndex: 120, display: 'flex', justifyContent: 'flex-end' } },
      React.createElement('div', { onClick: e => e.stopPropagation(), className: 'epos-drawer', style: { width: mobile ? '100%' : 540, maxWidth: '100%', height: '100%', boxShadow: 'var(--sh-lg)' } },
        React.createElement(PerfProfile, { u: sel, onClose: () => setSel(null) }))));
}
function PerfStat({ label, value, sub, band, danger }) {
  const col = danger ? 'var(--danger-fg)' : band ? scoreBand(value).color : 'var(--ink)';
  return React.createElement(Card, { pad: 18, style: { flex: 1, minWidth: 150 } },
    React.createElement('div', { className: 'uplabel', style: { marginBottom: 8 } }, label),
    React.createElement('div', { style: { fontSize: 30, fontWeight: 800, color: col, lineHeight: 1 } }, value),
    sub && React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 6 } }, sub));
}
function PerfSelect(value, onChange, options, labels) {
  return React.createElement('div', { style: { position: 'relative' } },
    React.createElement('select', { value, onChange: e => onChange(e.target.value),
      style: { appearance: 'none', height: 46, padding: '0 38px 0 14px', borderRadius: 'var(--r)', border: '1px solid var(--border)', background: 'var(--surface)', boxShadow: 'var(--sh-sm)', fontSize: 14.5, color: 'var(--ink)', fontFamily: 'inherit', cursor: 'pointer', minWidth: 150 } },
      options.map(o => React.createElement('option', { key: o, value: o }, labels ? labels[o] : o))),
    React.createElement(Icon, { name: 'chevDown', size: 17, style: { position: 'absolute', right: 13, top: 15, color: 'var(--muted)', pointerEvents: 'none' } }));
}
function PerfRow({ u, rank, onOpen }) {
  const band = scoreBand(u.score);
  return React.createElement('div', { onClick: onOpen, className: 'hv-row', style: { display: 'grid', gridTemplateColumns: '38px 1fr 120px 120px 120px 80px', gap: 14, padding: '13px 18px', alignItems: 'center', cursor: 'pointer', borderTop: '1px solid var(--border-2)' } },
    React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: rank && rank <= 3 ? 'var(--amber)' : 'var(--faint)' } }, rank ? '#' + rank : '–'),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 } },
      React.createElement(PerfAvatar, { name: u.name, size: 38 }),
      React.createElement('div', { style: { minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, u.name),
        React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)' } }, u.id + ' · ' + u.region))),
    React.createElement('div', { style: { fontSize: 13.5, color: 'var(--body)' } }, u.dept),
    React.createElement('div', null, React.createElement(Spark, { data: u.trend, color: band.color })),
    React.createElement('div', { style: { textAlign: 'right' } }, React.createElement(Delta, { v: u.delta })),
    React.createElement('div', { style: { textAlign: 'right' } },
      React.createElement('span', { style: { fontSize: 18, fontWeight: 800, color: band.color } }, u.score)));
}
function PerfRowMobile({ u, rank, onOpen }) {
  const band = scoreBand(u.score);
  return React.createElement('div', { onClick: onOpen, className: 'hv-row', style: { display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', cursor: 'pointer', borderTop: '1px solid var(--border-2)' } },
    React.createElement(PerfAvatar, { name: u.name, size: 40 }),
    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
      React.createElement('div', { style: { fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' } }, u.name),
      React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)' } }, u.dept + ' · ' + u.region)),
    React.createElement(Spark, { data: u.trend, color: band.color, w: 60, h: 24 }),
    React.createElement('span', { style: { fontSize: 19, fontWeight: 800, color: band.color, minWidth: 34, textAlign: 'right' } }, u.score));
}

/* ---------- profile drawer ---------- */
function PerfProfile({ u, onClose }) {
  const band = scoreBand(u.score);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 13, padding: '18px 22px', borderBottom: '1px solid var(--border-2)' } },
      React.createElement(PerfAvatar, { name: u.name, size: 46 }),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 17, fontWeight: 700, color: 'var(--ink)' } }, u.name),
        React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 2 } }, u.id + ' · ' + u.dept + ' · ' + u.region)),
      React.createElement('button', { onClick: onClose, style: { width: 34, height: 34, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-700)' } }, React.createElement(Icon, { name: 'x', size: 20 }))),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '22px' } },
      /* headline score */
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 22, padding: '6px 0 20px' } },
        React.createElement(ScoreRing, { score: u.score }),
        React.createElement('div', null,
          React.createElement('span', { style: { display: 'inline-block', fontSize: 13, fontWeight: 700, color: band.color, background: band.bg, padding: '4px 11px', borderRadius: 'var(--r-pill)' } }, band.label),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 14.5, color: 'var(--body)' } }, 'vs last period ', React.createElement(Delta, { v: u.delta })),
          React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 4 } }, 'Weighted across ' + PERF_KPIS.length + ' KPIs'))),
      /* 6-month trend */
      React.createElement('div', { className: 'uplabel', style: { padding: '8px 0 12px' } }, 'Overall trend · 6 months'),
      React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--r-lg)', padding: '16px 18px' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 10, height: 110 } },
          u.trend.map((v, i) => { const b = scoreBand(v); return React.createElement('div', { key: i, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 } },
            React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: 'var(--gray-700)' } }, v),
            React.createElement('div', { style: { width: '100%', maxWidth: 40, height: (Math.min(v, 120) / 120) * 76, background: b.color, borderRadius: '6px 6px 0 0', opacity: i === u.trend.length - 1 ? 1 : 0.55 } }),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)' } }, PERF_MONTHS[i])); }))),
      /* KPI breakdown */
      React.createElement('div', { className: 'uplabel', style: { padding: '26px 0 12px' } }, 'Score by KPI'),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        u.kpis.map(k => { const def = PERF_KPIS.find(x => x.id === k.id); const b = scoreBand(k.value);
          return React.createElement('div', { key: k.id },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 } },
              React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: 'var(--ink)' } }, def.name, React.createElement('span', { style: { fontSize: 12, color: 'var(--faint)', marginLeft: 7, fontWeight: 500 } }, 'wt ' + def.weight + '%')),
              React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                React.createElement(Spark, { data: k.trend, color: b.color, w: 60, h: 20 }),
                React.createElement('span', { style: { fontSize: 14.5, fontWeight: 800, color: b.color, minWidth: 34, textAlign: 'right' } }, k.value + '%'))),
            React.createElement('div', { style: { height: 7, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden' } },
              React.createElement('div', { style: { width: Math.min(k.value, 120) / 120 * 100 + '%', height: '100%', background: b.color } }))); }))),
    React.createElement('div', { style: { display: 'flex', gap: 10, padding: '16px 22px', borderTop: '1px solid var(--border)' } },
      React.createElement(Button, { icon: 'download', variant: 'outline', style: { flex: 1, justifyContent: 'center' } }, 'Export scorecard'),
      React.createElement(Button, { icon: 'mail', style: { flex: 1, justifyContent: 'center' } }, 'Share with manager')));
}

window.PerformanceApp = PerformanceApp;
