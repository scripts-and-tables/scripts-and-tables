/* System Tools — admin console (users, access, audit logs). */
const { useState: useStateST, useMemo: useMemoST } = React;

const ST_GROUPS = ['Admins', 'Commercial Mgrs', 'Sales Reps', 'Data Team', 'HR', 'Finance', 'All Staff'];
const ST_USERS = [
  { name: 'Oleksandr', empId: 'EMP-6424', dept: 'Corporate', role: 'Data Analyst Manager', group: 'Data Team', status: 'active', email: 'oleks.t@company.com', last: 'Today 11:42' },
  { name: 'Sara', empId: 'EMP-2268', dept: 'Personal Care', role: 'Commercial Director', group: 'Admins', status: 'active', email: 'sara.l@company.com', last: 'Today 09:18' },
  { name: 'John', empId: 'EMP-8311', dept: 'Operations', role: 'Ops Lead', group: 'Admins', status: 'active', email: 'john.c@company.com', last: 'Today 10:05' },
  { name: 'Omar', empId: 'EMP-6781', dept: 'Personal Care', role: 'Sales Manager', group: 'Commercial Mgrs', status: 'active', email: 'omar.s@company.com', last: 'Yesterday' },
  { name: 'Mia', empId: 'EMP-6549', dept: 'Food', role: 'Sales Rep', group: 'Sales Reps', status: 'active', email: 'mia.a@company.com', last: 'Today 08:30' },
  { name: 'Arun', empId: 'EMP-7381', dept: 'Finance', role: 'Finance Officer', group: 'Finance', status: 'active', email: 'arun.p@company.com', last: '2 days ago' },
  { name: 'Iris', empId: 'EMP-7961', dept: 'Personal Care', role: 'HR Partner', group: 'HR', status: 'active', email: 'iris.t@company.com', last: 'Today 07:55' },
  { name: 'Karim', empId: 'EMP-7239', dept: 'Food', role: 'Sales Rep', group: 'Sales Reps', status: 'suspended', email: 'karim.a@company.com', last: '3 weeks ago' },
  { name: 'Sami', empId: 'EMP-5120', dept: 'Operations', role: 'Coordinator', group: 'All Staff', status: 'active', email: 'sami.n@company.com', last: 'Today 11:10' },
];
const ST_STATUS = { active: { kind: 'success', label: 'Active' }, suspended: { kind: 'danger', label: 'Suspended' } };

const ST_ACCESS = [
  ['Sales Targets', [1, 1, 0, 0, 0, 0, 0]], ['Focus SKUs', [1, 1, 1, 1, 0, 0, 0]], ['Items Catalog', [1, 1, 1, 1, 0, 0, 1]],
  ['Excel Reports', [1, 0, 0, 1, 0, 0, 0]],
  ['User Performance', [1, 1, 0, 0, 1, 0, 0]],
  ['Notification Center', [1, 0, 0, 1, 0, 0, 0]], ['Process Master', [1, 1, 1, 1, 1, 1, 1]],
  ['Site Analytics', [1, 0, 0, 1, 0, 0, 0]], ['API', [1, 0, 0, 1, 0, 0, 0]],
];

function stInit(n) { return n.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(); }
function stColor(n) { const cs = ['var(--blue)', 'var(--green)', 'var(--amber)', 'var(--teal)', 'var(--purple)', 'var(--cyan)', 'var(--indigo)', 'var(--orange)']; let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) >>> 0; return cs[h % cs.length]; }
function STAvatar({ name, size = 38 }) { return React.createElement('div', { style: { width: size, height: size, borderRadius: '50%', flex: 'none', background: stColor(name), color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: size * 0.38 } }, stInit(name)); }

const ST_TARGET_LOG = [
  ['Omar', 'Gabriel (EMP-3210)', 'Jul-26', '100,000', '250,000', 'Today 11:20'],
  ['Sara', 'Team North', 'Aug-26', '250,000', '500,000', 'Today 09:42'],
  ['Omar', 'Paul (EMP-3891)', 'Jul-26', '100,000', '250,000', 'Yesterday 16:08'],
  ['John', 'Marc (EMP-4120)', 'Sep-26', '—', '500,000', 'Yesterday 14:51'],
  ['Mia', 'Ryan (EMP-3677)', 'Jul-26', '250,000', '100,000', '2 days ago'],
];
const ST_EPOS_LOG = [
  ['Oleksandr', 'Sales_Report_2026-06.xlsx', 'Sales', 'Today 11:38', '10.0.0.55'],
  ['Sami', 'Inventory_Report_2026-05.xlsx', 'Inventory', 'Today 09:02', '10.0.0.18'],
  ['Mia', 'Promotions_Report_2026-06.xlsx', 'Promotions', 'Yesterday 17:20', '10.0.0.92'],
  ['Oleksandr', 'Pricing_Report_2026-04.xlsx', 'Pricing', 'Yesterday 13:11', '10.0.0.55'],
  ['John', 'Forecast_Report_2026-06.xlsx', 'Forecast', '2 days ago', '10.0.0.30'],
];

function SystemToolsApp({ onBack }) {
  const [tab, setTab] = useStateST('users');
  const [sel, setSel] = useStateST(null);
  const [mobile, setMobile] = useStateST(() => typeof window !== 'undefined' && window.innerWidth < 760);
  React.useEffect(() => { const h = () => setMobile(window.innerWidth < 760); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  const items = [['users', 'Users', 'users'], ['access', 'App access', 'lock'], ['targets', 'Target changes', 'target'], ['epos', 'Report downloads', 'download']];
  const views = { users: () => React.createElement(STUsers, { onOpen: setSel }), access: () => React.createElement(STAccess, { mobile }), targets: STTargetLog, epos: STEposLog };
  const View = views[tab];
  const heading = items.find(i => i[0] === tab)[1];

  const drawer = sel && React.createElement('div', { onClick: () => setSel(null), style: { position: 'fixed', inset: 0, background: 'rgba(16,24,40,.42)', zIndex: 120, display: 'flex', justifyContent: 'flex-end' } },
    React.createElement('div', { onClick: e => e.stopPropagation(), className: 'epos-drawer', style: { width: mobile ? '100%' : 440, maxWidth: '100%', height: '100%', boxShadow: 'var(--sh-lg)' } },
      React.createElement(STUserDetail, { u: sel, onClose: () => setSel(null) })));

  if (mobile) {
    return React.createElement('div', { className: 'fadein', style: { minHeight: '100vh', background: 'var(--canvas)' } },
      React.createElement('div', { style: { height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 20 } },
        React.createElement('button', { onClick: onBack, style: stIconBtn() }, React.createElement(Icon, { name: 'arrowLeft', size: 20 })),
        React.createElement(IconTile, { icon: 'wrench', color: 'var(--gray-tile)', size: 30, radius: 9, iconSize: 16 }),
        React.createElement('span', { style: { fontWeight: 800, fontSize: 16, color: 'var(--ink)', flex: 1 } }, 'System Tools')),
      React.createElement('div', { style: { padding: '14px 12px 8px', display: 'flex', gap: 8, overflowX: 'auto', borderBottom: '1px solid var(--border-2)', background: 'var(--surface)' } },
        items.map(([id, label]) => React.createElement('button', { key: id, onClick: () => setTab(id), style: { flex: 'none', padding: '7px 13px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: tab === id ? 'var(--blue)' : 'var(--surface-2)', color: tab === id ? '#fff' : 'var(--gray-700)' } }, label))),
      React.createElement('div', { style: { padding: '18px 14px 40px' } }, React.createElement(View)),
      drawer);
  }

  return React.createElement('div', { className: 'fadein', style: { display: 'flex', minHeight: '100vh', background: 'var(--canvas)' } },
    React.createElement('aside', { style: { width: 240, flex: 'none', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '18px', borderBottom: '1px solid var(--border-2)' } },
        React.createElement(IconTile, { icon: 'wrench', color: 'var(--gray-tile)', size: 36, radius: 10, iconSize: 19 }),
        React.createElement('span', { style: { fontWeight: 800, fontSize: 17, color: 'var(--ink)' } }, 'System Tools')),
      React.createElement('div', { style: { padding: '14px 12px', flex: 1 } },
        React.createElement('div', { className: 'uplabel', style: { padding: '0 8px 10px' } }, 'Admin'),
        items.map(([id, label, icon]) => { const on = tab === id; return React.createElement('button', { key: id, onClick: () => setTab(id),
          style: { display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '11px 13px', marginBottom: 3, borderRadius: 'var(--r)', border: 'none', cursor: 'pointer', fontSize: 14.5, fontWeight: 600, background: on ? 'var(--blue-050)' : 'transparent', color: on ? 'var(--blue)' : 'var(--gray-700)' },
          onMouseEnter: e => { if (!on) e.currentTarget.style.background = 'var(--surface-2)'; }, onMouseLeave: e => { if (!on) e.currentTarget.style.background = 'transparent'; } },
          React.createElement(Icon, { name: icon, size: 18 }), label); })),
      React.createElement('div', { style: { padding: '12px 12px 76px', borderTop: '1px solid var(--border-2)' } },
        React.createElement('button', { onClick: onBack, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 'var(--r)', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--gray-700)', fontSize: 14, fontWeight: 600, width: '100%' } },
          React.createElement(Icon, { name: 'arrowLeft', size: 18 }), 'Back to One'))),
    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
      React.createElement('div', { style: { height: 64, display: 'flex', alignItems: 'center', padding: '0 32px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' } },
        React.createElement('span', { className: 'uplabel' }, heading)),
      React.createElement('div', { style: { padding: 32, overflowY: 'auto' } }, React.createElement(View))),
    drawer);
}
function stIconBtn() { return { width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 'var(--r-sm)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-700)', flex: 'none' }; }

function STUsers({ onOpen }) {
  const [q, setQ] = useStateST('');
  const list = ST_USERS.filter(u => (u.name + u.empId + u.dept + u.group).toLowerCase().includes(q.toLowerCase()));
  return React.createElement('div', null,
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 46, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)', marginBottom: 16, maxWidth: 420 } },
      React.createElement(Icon, { name: 'search', size: 18, style: { color: 'var(--faint)' } }),
      React.createElement('input', { value: q, onChange: e => setQ(e.target.value), placeholder: 'Search users…', style: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit' } })),
    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 110px', gap: 14, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' } },
        ['User', 'Department', 'Group', 'Status'].map((h, i) => React.createElement('div', { key: i, className: 'uplabel', style: { fontSize: 11.5 } }, h))),
      list.map((u, i) => { const sp = ST_STATUS[u.status]; return React.createElement('div', { key: u.empId, onClick: () => onOpen(u), className: 'hv-row', style: { display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 110px', gap: 14, padding: '13px 18px', alignItems: 'center', cursor: 'pointer', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 } },
          React.createElement(STAvatar, { name: u.name }),
          React.createElement('div', { style: { minWidth: 0 } },
            React.createElement('div', { style: { fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, u.name),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)' } }, u.empId))),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--body)' } }, u.dept),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--body)' } }, u.group),
        React.createElement('div', null, React.createElement(StatusPill, { kind: sp.kind }, sp.label))); })));
}
function STUserDetail({ u, onClose }) {
  const sp = ST_STATUS[u.status];
  const row = (l, v) => React.createElement('div', { style: { display: 'flex', gap: 12, padding: '11px 0', borderTop: '1px solid var(--border-2)' } },
    React.createElement('div', { style: { width: 110, flex: 'none', fontSize: 13.5, color: 'var(--muted)' } }, l), React.createElement('div', { style: { flex: 1, fontSize: 14.5, color: 'var(--ink)', fontWeight: 500 } }, v));
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 13, padding: '18px 22px', borderBottom: '1px solid var(--border-2)' } },
      React.createElement(STAvatar, { name: u.name, size: 46 }),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 17, fontWeight: 700, color: 'var(--ink)' } }, u.name),
        React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 2 } }, u.role)),
      React.createElement('button', { onClick: onClose, style: { width: 34, height: 34, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-700)' } }, React.createElement(Icon, { name: 'x', size: 20 }))),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '18px 22px' } },
      React.createElement('div', { style: { marginBottom: 10 } }, React.createElement(StatusPill, { kind: sp.kind }, sp.label)),
      row('Employee ID', u.empId), row('Email', u.email), row('Department', u.dept), row('Access group', u.group), row('Last active', u.last)),
    React.createElement('div', { style: { padding: '16px 22px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 } },
      React.createElement('div', { style: { display: 'flex', gap: 10 } },
        React.createElement(Button, { variant: 'outline', icon: 'lock', style: { flex: 1, justifyContent: 'center' } }, 'Reset password'),
        React.createElement(Button, { variant: 'outline', icon: 'eye', style: { flex: 1, justifyContent: 'center' } }, 'View activity')),
      React.createElement(Button, { variant: u.status === 'active' ? 'ghost' : 'primary', icon: u.status === 'active' ? 'lock' : 'check', style: { justifyContent: 'center', color: u.status === 'active' ? 'var(--danger-fg)' : undefined, borderColor: u.status === 'active' ? 'var(--danger-bg)' : undefined } }, u.status === 'active' ? 'Suspend user' : 'Reactivate user')));
}

function STAccess({ mobile }) {
  return React.createElement('div', null,
    React.createElement('p', { style: { fontSize: 14.5, color: 'var(--muted)', margin: '0 0 16px' } }, 'Which access groups can open each app. Tap a cell to toggle (admin only).'),
    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      React.createElement('div', { style: { overflowX: 'auto' } },
        React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', minWidth: 720 } },
          React.createElement('thead', null, React.createElement('tr', null,
            React.createElement('th', { style: { textAlign: 'left', padding: '12px 16px', fontSize: 11.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--gray-700)', background: 'var(--surface-2)', position: 'sticky', left: 0 } }, 'App'),
            ST_GROUPS.map(g => React.createElement('th', { key: g, style: { padding: '12px 8px', fontSize: 11, fontWeight: 700, color: 'var(--gray-700)', background: 'var(--surface-2)', textAlign: 'center', whiteSpace: 'nowrap' } }, g)))),
          React.createElement('tbody', null,
            ST_ACCESS.map(([app, perms], i) => React.createElement('tr', { key: app, style: { borderTop: '1px solid var(--border-2)' } },
              React.createElement('td', { style: { padding: '11px 16px', fontSize: 14, fontWeight: 600, color: 'var(--ink)', background: 'var(--surface)', position: 'sticky', left: 0, whiteSpace: 'nowrap' } }, app),
              perms.map((p, j) => React.createElement('td', { key: j, style: { textAlign: 'center', padding: '11px 8px' } },
                p ? React.createElement('span', { style: { display: 'inline-grid', placeItems: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success-fg)' } }, React.createElement(Icon, { name: 'check', size: 14, stroke: 2.6 }))
                  : React.createElement('span', { style: { display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--gray-300)' } }))))))))));
}

function LogTable({ cols, rows, render }) {
  return React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
    React.createElement('div', { style: { overflowX: 'auto' } },
      React.createElement('div', { style: { minWidth: 640 } },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: cols.map(c => c.w).join(' '), gap: 14, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' } },
          cols.map((c, i) => React.createElement('div', { key: i, className: 'uplabel', style: { fontSize: 11.5, textAlign: c.right ? 'right' : 'left' } }, c.label))),
        rows.map((r, i) => React.createElement('div', { key: i, style: { display: 'grid', gridTemplateColumns: cols.map(c => c.w).join(' '), gap: 14, padding: '13px 18px', alignItems: 'center', borderTop: i ? '1px solid var(--border-2)' : 'none' } }, render(r))))));
}
function STTargetLog() {
  const cols = [{ label: 'Changed by', w: '1.3fr' }, { label: 'Target', w: '1.4fr' }, { label: 'Month', w: '90px' }, { label: 'From', w: '1fr', right: true }, { label: 'To', w: '1fr', right: true }, { label: 'When', w: '130px', right: true }];
  return React.createElement('div', null,
    React.createElement('p', { style: { fontSize: 14.5, color: 'var(--muted)', margin: '0 0 16px' } }, 'Every change made to sales targets, with the before and after values.'),
    React.createElement(LogTable, { cols, rows: ST_TARGET_LOG, render: r => [
      React.createElement('span', { key: 0, style: { display: 'flex', alignItems: 'center', gap: 9 } }, React.createElement(STAvatar, { name: r[0], size: 28 }), React.createElement('span', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' } }, r[0])),
      React.createElement('span', { key: 1, style: { fontSize: 13.5, color: 'var(--body)' } }, r[1]),
      React.createElement('span', { key: 2, style: { fontSize: 13.5, color: 'var(--muted)' } }, r[2]),
      React.createElement('span', { key: 3, style: { fontSize: 13.5, color: 'var(--muted)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' } }, r[3]),
      React.createElement('span', { key: 4, style: { fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' } }, r[4]),
      React.createElement('span', { key: 5, style: { fontSize: 13, color: 'var(--muted)', textAlign: 'right' } }, r[5])] }));
}
function STEposLog() {
  const cols = [{ label: 'Downloaded by', w: '1.2fr' }, { label: 'File', w: '1.8fr' }, { label: 'Category', w: '1fr' }, { label: 'IP', w: '110px' }, { label: 'When', w: '130px', right: true }];
  return React.createElement('div', null,
    React.createElement('p', { style: { fontSize: 14.5, color: 'var(--muted)', margin: '0 0 16px' } }, 'Audit trail of report downloads — who downloaded which report, and from where.'),
    React.createElement(LogTable, { cols, rows: ST_EPOS_LOG, render: r => [
      React.createElement('span', { key: 0, style: { display: 'flex', alignItems: 'center', gap: 9 } }, React.createElement(STAvatar, { name: r[0], size: 28 }), React.createElement('span', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, r[0])),
      React.createElement('span', { key: 1, style: { fontSize: 13, color: 'var(--body)', fontFamily: 'ui-monospace, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, r[1]),
      React.createElement('span', { key: 2, style: { fontSize: 13.5, color: 'var(--body)' } }, r[2]),
      React.createElement('span', { key: 3, style: { fontSize: 13, color: 'var(--muted)', fontFamily: 'ui-monospace, monospace' } }, r[4]),
      React.createElement('span', { key: 4, style: { fontSize: 13, color: 'var(--muted)', textAlign: 'right' } }, r[3])] }));
}

window.SystemToolsApp = SystemToolsApp;
