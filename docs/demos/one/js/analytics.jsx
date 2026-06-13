/* Site Analytics — lightweight internal portal usage dashboard. */
const { useState: useStateA, useMemo: useMemoA } = React;

const AN_APPS = [
  ['Sales Targets', 'target', 'var(--cyan)', 0.22],
  ['Excel Reports', 'fileText', 'var(--blue)', 0.14],
  ['Notification Center', 'mail', 'var(--cyan)', 0.11],
  ['Items Catalog', 'book', 'var(--green)', 0.09],
  ['User Performance', 'idCard', 'var(--blue)', 0.08],
  ['Focus SKUs', 'clipboardCheck', 'var(--amber)', 0.07],
  ['Process Master', 'sitemap', 'var(--blue)', 0.06],
  ['Staff Discounts', 'percent', 'var(--green)', 0.05],
  ['Data Pipeline', 'sitemap', 'var(--indigo)', 0.03],
  ['Site Analytics', 'chartLine', 'var(--black-tile)', 0.01],
];
const AN_USERS = [
  ['Oleksandr', 'Corporate', 'var(--amber)'], ['Alex', 'Personal Care', 'var(--blue)'],
  ['Brian', 'Operations', 'var(--green)'], ['Felix', 'Food', 'var(--teal)'],
  ['Vikram', 'Beverages', 'var(--purple)'], ['Nadia', 'Personal Care', 'var(--cyan)'],
  ['Leo', 'Corporate', 'var(--indigo)'], ['Tariq', 'Personal Care', 'var(--orange)'],
];
const AN_DEPTS = [['Personal Care', 0.38], ['Food', 0.24], ['Beverages', 0.18], ['Operations', 0.12], ['Corporate', 0.08]];
const RANGES = { '7 days': { days: 7, base: 1000, users: 100 }, '30 days': { days: 30, base: 5000, users: 300 }, '90 days': { days: 90, base: 12000, users: 500 } };

function prngA(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function initials(n) { return n.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(); }
function fmt(n) { return n.toLocaleString('en-US'); }

function AnAvatar({ name, color, size = 34 }) {
  return React.createElement('div', { style: { width: size, height: size, borderRadius: '50%', flex: 'none', background: color, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: size * 0.38 } }, initials(name));
}

function AnalyticsApp() {
  const [range, setRange] = useStateA('30 days');
  const cfg = RANGES[range];

  const daily = useMemoA(() => {
    const rnd = prngA(cfg.days * 91 + 7); const out = [];
    for (let i = 0; i < cfg.days; i++) {
      const dow = i % 7; const weekend = dow === 5 || dow === 6;
      const v = Math.round((cfg.base / cfg.days) * (weekend ? 0.35 : 1) * (0.8 + rnd() * 0.5));
      out.push(v);
    }
    return out;
  }, [range]);
  const sessions = daily.reduce((a, b) => a + b, 0);
  const pageViews = Math.round(sessions * 3.4);
  const peak = Math.max(...daily);

  const appRows = AN_APPS.map(([name, icon, color, share]) => ({ name, icon, color, views: Math.round(pageViews * share) }));
  const maxApp = appRows[0].views;
  const userRows = AN_USERS.map(([name, dept, color], i) => {
    const rnd = prngA((i + 3) * 131);
    return { name, dept, color, sessions: Math.round((cfg.base / 30) * (1.4 - i * 0.12) * (0.7 + rnd() * 0.5)), mins: Math.round(40 + rnd() * 180) };
  }).sort((a, b) => b.sessions - a.sessions);

  return React.createElement('div', { className: 'fadein' },
    React.createElement(Page, { max: 1180 },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 } },
        React.createElement('div', null,
          React.createElement('h1', { style: { fontSize: 30, fontWeight: 700, marginBottom: 6 } }, 'Site Analytics'),
          React.createElement('p', { style: { fontSize: 17, color: 'var(--muted)', margin: 0 } }, 'How the One portal is being used.')),
        React.createElement(Segmented, { options: Object.keys(RANGES), value: range, onChange: setRange })),
      /* KPI cards */
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 18 } },
        React.createElement(AnStat, { icon: 'users', label: 'Active users', value: fmt(cfg.users), sub: 'of ~1,000 employees' }),
        React.createElement(AnStat, { icon: 'trending', label: 'Sessions', value: fmt(sessions), sub: range }),
        React.createElement(AnStat, { icon: 'eye', label: 'Page views', value: fmt(pageViews), sub: '~3.4 per session' }),
        React.createElement(AnStat, { icon: 'clock', label: 'Avg. session', value: '6m 12s', sub: '+8% vs prev.' })),
      /* activity over time */
      React.createElement(Card, { style: { marginBottom: 18 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 } },
          React.createElement('div', { className: 'uplabel' }, 'Activity over time'),
          React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)' } }, fmt(sessions) + ' sessions')),
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: cfg.days > 40 ? 2 : 4, height: 140 } },
          daily.map((v, i) => React.createElement('div', { key: i, title: v + ' sessions', style: { flex: 1, minWidth: 0, height: (v / peak) * 130, background: 'linear-gradient(180deg, var(--blue-300), var(--blue))', borderRadius: '3px 3px 0 0', opacity: i === daily.length - 1 ? 1 : 0.82 } })))),
      /* two columns: top apps + active users */
      React.createElement('div', { className: 'grid-po', style: { marginBottom: 18 } },
        React.createElement(Card, { pad: 0 },
          React.createElement('div', { style: { padding: '18px 20px 12px' } }, React.createElement('div', { className: 'uplabel' }, 'Most used apps')),
          React.createElement('div', { style: { padding: '0 20px 18px', display: 'flex', flexDirection: 'column', gap: 13 } },
            appRows.map(a => React.createElement('div', { key: a.name, style: { display: 'flex', alignItems: 'center', gap: 12 } },
              React.createElement(IconTile, { icon: a.icon, color: a.color, size: 32, radius: 9, iconSize: 16 }),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 5 } },
                  React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, a.name),
                  React.createElement('span', { style: { fontSize: 13, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums', flex: 'none' } }, fmt(a.views))),
                React.createElement('div', { style: { height: 6, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden' } },
                  React.createElement('div', { style: { width: (a.views / maxApp) * 100 + '%', height: '100%', background: a.color } })))))) ),
        React.createElement(Card, { pad: 0 },
          React.createElement('div', { style: { padding: '18px 20px 12px' } }, React.createElement('div', { className: 'uplabel' }, 'Most active users')),
          React.createElement('div', null,
            userRows.map((u, i) => React.createElement('div', { key: u.name, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
              React.createElement(AnAvatar, { name: u.name, color: u.color }),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, u.name),
                React.createElement('div', { style: { fontSize: 12.5, color: 'var(--muted)' } }, u.dept)),
              React.createElement('div', { style: { textAlign: 'right', flex: 'none' } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: 'var(--ink)' } }, u.sessions),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)' } }, 'sessions')))))) ),
      /* usage by department */
      React.createElement(Card, null,
        React.createElement('div', { className: 'uplabel', style: { marginBottom: 16 } }, 'Usage by department'),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 13 } },
          AN_DEPTS.map(([d, share]) => React.createElement('div', { key: d, style: { display: 'flex', alignItems: 'center', gap: 14 } },
            React.createElement('span', { style: { width: 110, flex: 'none', fontSize: 14, fontWeight: 600, color: 'var(--ink)' } }, d),
            React.createElement('div', { style: { flex: 1, height: 10, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden' } },
              React.createElement('div', { style: { width: (share * 100) + '%', height: '100%', background: 'var(--blue)' } })),
            React.createElement('span', { style: { width: 44, flex: 'none', textAlign: 'right', fontSize: 13.5, fontWeight: 600, color: 'var(--muted)' } }, Math.round(share * 100) + '%')))))) );
}
function AnStat({ icon, label, value, sub }) {
  return React.createElement(Card, { pad: 18 },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 } },
      React.createElement(Icon, { name: icon, size: 16, style: { color: 'var(--muted)' } }),
      React.createElement('span', { className: 'uplabel' }, label)),
    React.createElement('div', { style: { fontSize: 30, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 } }, value),
    sub && React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 7 } }, sub));
}

window.AnalyticsApp = AnalyticsApp;
