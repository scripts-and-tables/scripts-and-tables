/* Home page — organization variants. Reuses window components. Embeddable + clickable. */
const Icon = window.Icon;
const { IconTile, Avatar, NewBadge } = window;
const APPS = window.APPS;
const APP_BY_ID = window.APP_BY_ID;

if (!document.getElementById('hv-styles')) {
  const s = document.createElement('style');
  s.id = 'hv-styles';
  s.textContent = [
    '.hv-card{cursor:pointer;transition:box-shadow .16s,border-color .16s}',
    '.hv-card:hover{box-shadow:var(--sh-md);border-color:var(--gray-400)!important}',
    '.hv-row{cursor:pointer;transition:background .14s}',
    '.hv-row:hover{background:var(--surface-2)}',
    '.hv-chip{cursor:pointer;transition:border-color .14s,box-shadow .14s}',
    '.hv-chip:hover{border-color:var(--gray-400)!important;box-shadow:var(--sh)}',
    '.hv-rail{cursor:pointer;transition:background .12s}',
    '.hv-rail:hover{background:var(--surface-2)}',
    '.hv-heart{opacity:0;transition:opacity .12s,transform .12s}',
    '.hv-heart.on{opacity:1}',
    '.hv-card:hover .hv-heart,.hv-row:hover .hv-heart{opacity:1}',
    '.hv-heart:hover{transform:scale(1.15)}',
    '@media (hover:none){.hv-heart{opacity:1}}',
  ].join('');
  document.head.appendChild(s);
}

const A = id => APP_BY_ID[id];
const noop = () => {};
const DESC = {
  welcome: 'Onboarding & company intro', targets: 'Set & track sales targets',
  msl: 'Focus SKUs & where we sell', discounts: 'Exclusive offers for the team',
  catalog: 'Browse the full product catalog',
  epos: 'Download Excel reports',
  performance: 'Team performance dashboards',
  orchestration: 'Live data pipeline & AI agents', emails: 'System notifications & alerts',
  projects: 'Plan & track projects', easyflow: 'Build & run processes',
  analytics: 'Traffic & usage insights', tools: 'Admin utilities', api: 'Developer access & keys',
};

/* shared bits ---------------------------------------------------------- */
function MiniNav({ name = 'ONE' }) {
  return React.createElement('div', { style: { height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', borderBottom: '1px solid var(--border-2)', background: 'var(--bg)' } },
    React.createElement('span', { className: 'tm-wordmark', style: { fontSize: 21 } },
      React.createElement('span', { className: 'nm' }, name),
      React.createElement('span', { style: { fontSize: 10, fontWeight: 800, letterSpacing: '.06em', padding: '3px 7px', borderRadius: 99, background: 'var(--warning-bg)', color: 'var(--warning-ink)', marginLeft: 8 } }, 'DEMO')),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, color: 'var(--muted)' } },
      React.createElement('span', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,4px)', gap: 2.5 } }, Array.from({ length: 9 }).map((_, i) => React.createElement('span', { key: i, style: { width: 4, height: 4, borderRadius: 1.5, background: 'var(--blue)' } }))),
      React.createElement('span', { style: { fontSize: 15, color: 'var(--ink)', fontWeight: 500 } }, 'Apps'),
      React.createElement(Icon, { name: 'moon', size: 18 }),
      React.createElement(Avatar, { initial: 'O', size: 32 }))
  );
}
function Greeting({ sub }) {
  const hour = new Date().getHours();
  const g = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return React.createElement('div', { style: { marginBottom: 26 } },
    React.createElement('div', { className: 'uplabel', style: { marginBottom: 8 } }, dateStr),
    React.createElement('h1', { style: { fontSize: 30, fontWeight: 700 } }, g + ', Oleksandr'),
    sub && React.createElement('p', { style: { fontSize: 15.5, color: 'var(--muted)', margin: '8px 0 0' } }, sub));
}
/* ---- pin heart + status badge ---- */
function Heart({ filled, onToggle, size = 28 }) {
  return React.createElement('button', {
    className: 'hv-heart' + (filled ? ' on' : ''),
    onClick: e => { e.stopPropagation(); onToggle(); },
    title: filled ? 'Unpin' : 'Pin to top',
    style: { position: 'absolute', top: 8, right: 8, width: size, height: size, display: 'grid', placeItems: 'center', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', zIndex: 3, padding: 0 },
  },
    React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: filled ? 'var(--blue)' : 'none', stroke: filled ? 'var(--blue)' : 'var(--gray-400)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
      React.createElement('path', { d: 'M12 17v5' }),
      React.createElement('path', { d: 'M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' })));
}
function badgePill(kind, text) {
  const map = {
    new: { bg: 'var(--success-bg)', fg: 'var(--success-ink)' },
    soon: { bg: 'var(--surface-2)', fg: 'var(--muted)', border: '1px solid var(--border)' },
    wip: { bg: 'color-mix(in srgb, var(--orange) 14%, var(--surface))', fg: 'var(--orange)' },
  }[kind];
  return React.createElement('span', { style: { fontSize: 9.5, fontWeight: 800, letterSpacing: '.05em', padding: '2px 7px', borderRadius: 'var(--r-pill)', background: map.bg, color: map.fg, border: map.border || 'none', whiteSpace: 'nowrap' } }, text);
}

function WipMark() {
  return React.createElement('span', { title: 'Not built yet', style: { position: 'absolute', bottom: 8, left: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9.5, fontWeight: 800, letterSpacing: '.04em', color: 'var(--orange)', background: 'color-mix(in srgb, var(--orange) 14%, var(--surface))', borderRadius: 'var(--r-pill)', padding: '2px 7px' } },
    React.createElement(Icon, { name: 'wrench', size: 11 }), 'WIP');
}
function bigTile(app, opts = {}) {
  const open = opts.open || noop;
  const soon = app.soon;
  const wip = !soon && !app.built;
  return React.createElement('div', { key: app.id, className: soon ? '' : 'hv-card', onClick: soon ? undefined : () => open(app.id), title: wip ? 'Not built yet' : undefined,
    style: { position: 'relative', background: 'var(--surface)', border: '1px ' + (wip ? 'dashed var(--orange)' : 'solid var(--border)'), borderRadius: 'var(--r-lg)', padding: 18, minHeight: 122, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14, boxShadow: 'var(--sh)', cursor: soon ? 'default' : 'pointer', opacity: soon ? .62 : 1 } },
    React.createElement('div', { style: { opacity: soon ? .85 : 1 } }, React.createElement(IconTile, { icon: app.icon, color: app.color, size: 48, radius: 14 })),
    !soon && React.createElement(Heart, { filled: opts.pinned, onToggle: () => opts.togglePin(app.id) }),
    React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 } }, app.name),
      (soon || app.isNew) && React.createElement('div', { style: { marginTop: 8 } }, soon ? badgePill('soon', 'COMING SOON') : badgePill('new', 'NEW'))));
}
function Frame({ name, children, pad = 36, embed, full }) {
  if (embed) return React.createElement('div', { className: 'fadein', style: { maxWidth: full ? 'none' : 1240, margin: '0 auto', padding: full ? 0 : '32px 28px 64px' } }, children);
  return React.createElement('div', { style: { background: 'var(--bg)', minHeight: '100%', height: '100%', overflow: 'hidden' } },
    React.createElement(MiniNav, { name }),
    React.createElement('div', { style: { padding: pad } }, children));
}

function detailRow(app, opts = {}) {
  const open = opts.open || noop;
  const soon = app.soon;
  const wip = !soon && !app.built;
  return React.createElement('div', { key: app.id, className: soon ? '' : 'hv-row', onClick: soon ? undefined : () => open(app.id), title: wip ? 'Not built yet' : undefined,
    style: { position: 'relative', display: 'flex', alignItems: 'center', gap: 13, padding: '12px 44px 12px 14px', background: 'var(--surface)', border: '1px ' + (wip ? 'dashed var(--orange)' : 'solid var(--border)'), borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)', cursor: soon ? 'default' : 'pointer', opacity: soon ? .62 : 1 } },
    React.createElement(IconTile, { icon: app.icon, color: app.color, size: 38, radius: 11, iconSize: 19 }),
    React.createElement('div', { style: { minWidth: 0, flex: 1 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7 } },
        React.createElement('span', { style: { fontSize: 15, fontWeight: 700, color: 'var(--ink)' } }, app.name),
        wip && badgePill('wip', 'WIP'),
        soon ? badgePill('soon', 'COMING SOON') : (app.isNew && badgePill('new', 'NEW'))),
      React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, DESC[app.id])),
    soon ? null : React.createElement(Heart, { filled: opts.pinned, onToggle: () => opts.togglePin(app.id), size: 26 }));
}
function compactTile(app, opts = {}) {
  const open = opts.open || noop;
  const soon = app.soon;
  const wip = !soon && !app.built;
  return React.createElement('div', { key: app.id, className: soon ? '' : 'hv-card', onClick: soon ? undefined : () => open(app.id), title: wip ? 'Not built yet' : undefined,
    style: { position: 'relative', background: 'var(--surface)', border: '1px ' + (wip ? 'dashed var(--orange)' : 'solid var(--border)'), borderRadius: 'var(--r)', padding: '16px 12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', boxShadow: 'var(--sh-sm)', cursor: soon ? 'default' : 'pointer', opacity: soon ? .62 : 1, minHeight: 104, justifyContent: 'center' } },
    (soon || app.isNew) && React.createElement('div', { style: { position: 'absolute', top: 8, left: 8 } }, soon ? badgePill('soon', 'SOON') : badgePill('new', 'NEW')),
    wip && React.createElement(WipMark),
    !soon && React.createElement(Heart, { filled: opts.pinned, onToggle: () => opts.togglePin(app.id), size: 26 }),
    React.createElement(IconTile, { icon: app.icon, color: app.color, size: 40, radius: 12, iconSize: 20 }),
    React.createElement('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--body)', lineHeight: 1.2 } }, app.name));
}
function appsGrid(list, style, open, cardsClass, pinnedSet, togglePin) {
  const mk = fn => list.map(a => fn(a, { open, pinned: pinnedSet.has(a.id), togglePin }));
  if (style === 'cards') return React.createElement('div', { className: cardsClass }, mk(bigTile));
  if (style === 'rows') return React.createElement('div', { className: 'grid-rows' }, mk(detailRow));
  return React.createElement('div', { className: 'grid-compact' }, mk(compactTile));
}

/* V2 — Pinned + All apps (search, heart-pinning, NEW / Coming soon) ---- */
const DEFAULT_PINS = ['targets', 'msl', 'discounts', 'epos', 'projects', 'emails'];
function loadPins() { try { const v = JSON.parse(localStorage.getItem('one-pins')); return Array.isArray(v) ? v : DEFAULT_PINS.slice(); } catch (e) { return DEFAULT_PINS.slice(); } }

function V2_Favorites({ embed, onOpenApp, appStyle }) {
  const open = onOpenApp || noop;
  const style = appStyle || 'compact';
  const [q, setQ] = React.useState('');
  const [pins, setPins] = React.useState(loadPins);
  const pinnedSet = new Set(pins);
  const togglePin = id => setPins(prev => {
    const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
    try { localStorage.setItem('one-pins', JSON.stringify(next)); } catch (e) {}
    return next;
  });

  const query = q.trim().toLowerCase();
  const matches = a => !query || (a.name + ' ' + (DESC[a.id] || '')).toLowerCase().includes(query);
  const favs = pins.map(A).filter(a => a && !a.soon);
  // All apps: live first, coming-soon last (single grid)
  const allApps = APPS.filter(a => !pinnedSet.has(a.id) && matches(a))
    .sort((a, b) => (a.soon ? 1 : 0) - (b.soon ? 1 : 0));

  const SearchBox = React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 48, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)', width: '100%', marginBottom: 24 } },
    React.createElement(Icon, { name: 'search', size: 19, style: { color: 'var(--faint)' } }),
    React.createElement('input', { value: q, onChange: e => setQ(e.target.value), placeholder: 'Search ' + APPS.length + ' apps…', style: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15.5, color: 'var(--ink)', fontFamily: 'inherit' } }),
    q && React.createElement('button', { onClick: () => setQ(''), style: { border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--muted)', display: 'grid', placeItems: 'center', padding: 0 } }, React.createElement(Icon, { name: 'x', size: 17 })));

  return React.createElement(Frame, { embed },
    React.createElement(Greeting, null),
    SearchBox,
    /* Pinned — hidden during search */
    (!query && favs.length > 0) && React.createElement('div', { style: { marginBottom: 30 } },
      React.createElement('div', { className: 'uplabel', style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 } },
        React.createElement('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--blue)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('path', { d: 'M12 17v5' }),
          React.createElement('path', { d: 'M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' })),
        'Pinned'),
      appsGrid(favs, style, open, 'grid-pinned', pinnedSet, togglePin)),
    /* All apps (live then coming soon, single grid) */
    React.createElement('div', null,
      React.createElement('div', { className: 'uplabel', style: { marginBottom: 14 } }, query ? 'Results' : 'All apps'),
      allApps.length === 0
        ? React.createElement('div', { style: { padding: '24px 0', color: 'var(--muted)', fontSize: 15.5 } }, 'No apps match “' + q + '”.')
        : appsGrid(allApps, style, open, 'grid-all', pinnedSet, togglePin)));
}

/* ------------------------------------------------------------------- */
const LAYOUTS = { pinned: V2_Favorites };
window.HomeVariants = { V2_Favorites, LAYOUTS };
