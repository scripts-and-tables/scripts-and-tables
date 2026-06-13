/* Project Management — SPA shell + 9 views. Uses window.PM. */
const { useState: useStatePM, useMemo: useMemoPM, useEffect: useEffectPM } = React;
const PM = window.PM;

function ProjectsApp({ onBack }) {
  const [nav, setNav] = useStatePM('dashboard');
  const [mobile, setMobile] = useStatePM(() => typeof window !== 'undefined' && window.innerWidth < 760);
  useEffectPM(() => { const h = () => setMobile(window.innerWidth < 760); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  const items = [['dashboard', 'Dashboard', 'dashboard'], ['projects', 'Projects', 'briefcase'], ['tasks', 'Tasks', 'check'], ['sprints', 'Sprints', 'refresh'], ['raid', 'RAID Log', 'alert'], ['operations', 'Operations', 'gear'], ['team', 'Team', 'users'], ['analytics', 'Analytics', 'barChart'], ['history', 'History', 'history']];
  const views = { dashboard: PMDashboard, projects: PMProjects, tasks: PMTasks, sprints: PMSprints, raid: PMRaid, operations: PMOps, team: PMTeam, analytics: PMAnalytics, history: PMHistory };
  const View = views[nav];

  if (mobile) {
    return React.createElement('div', { className: 'fadein', style: { minHeight: '100vh', background: 'var(--canvas)' } },
      React.createElement('div', { style: { height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 20 } },
        React.createElement('button', { onClick: onBack, style: pmIconBtn() }, React.createElement(Icon, { name: 'arrowLeft', size: 20 })),
        React.createElement(IconTile, { icon: 'flow', color: 'var(--purple)', size: 30, radius: 9, iconSize: 16 }),
        React.createElement('span', { style: { fontWeight: 800, fontSize: 16, color: 'var(--ink)', flex: 1 } }, 'Projects')),
      React.createElement('div', { style: { padding: '14px 12px 8px', display: 'flex', gap: 8, overflowX: 'auto', borderBottom: '1px solid var(--border-2)', background: 'var(--surface)' } },
        items.map(([id, label]) => React.createElement('button', { key: id, onClick: () => setNav(id), style: { flex: 'none', padding: '7px 13px', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: nav === id ? 'var(--blue)' : 'var(--surface-2)', color: nav === id ? '#fff' : 'var(--gray-700)' } }, label))),
      React.createElement('div', { style: { padding: '18px 14px 40px' } }, React.createElement(View, { mobile: true })));
  }

  return React.createElement('div', { className: 'fadein', style: { display: 'flex', minHeight: '100vh', background: 'var(--canvas)' } },
    React.createElement('aside', { style: { width: 234, flex: 'none', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '18px', borderBottom: '1px solid var(--border-2)' } },
        React.createElement(IconTile, { icon: 'flow', color: 'var(--purple)', size: 36, radius: 10, iconSize: 19 }),
        React.createElement('span', { style: { fontWeight: 800, fontSize: 17, color: 'var(--ink)' } }, 'Projects')),
      React.createElement('div', { style: { padding: '14px 12px', flex: 1, overflowY: 'auto' } },
        items.map(([id, label, icon]) => { const on = nav === id; return React.createElement('button', { key: id, onClick: () => setNav(id),
          style: { display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '10px 13px', marginBottom: 3, borderRadius: 'var(--r)', border: 'none', cursor: 'pointer', fontSize: 14.5, fontWeight: 600, background: on ? 'var(--blue-050)' : 'transparent', color: on ? 'var(--blue)' : 'var(--gray-700)' },
          onMouseEnter: e => { if (!on) e.currentTarget.style.background = 'var(--surface-2)'; }, onMouseLeave: e => { if (!on) e.currentTarget.style.background = 'transparent'; } },
          React.createElement(Icon, { name: icon, size: 18 }), label); })),
      React.createElement('div', { style: { padding: '12px 12px 76px', borderTop: '1px solid var(--border-2)' } },
        React.createElement('button', { onClick: onBack, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 'var(--r)', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--gray-700)', fontSize: 14, fontWeight: 600, width: '100%' } },
          React.createElement(Icon, { name: 'arrowLeft', size: 18 }), 'Back to One'))),
    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
      React.createElement('div', { style: { height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' } },
        React.createElement('span', { className: 'uplabel' }, items.find(i => i[0] === nav)[1]),
        React.createElement(Button, { icon: 'plus', size: 'sm' }, 'New task')),
      React.createElement('div', { style: { padding: 32, overflowY: 'auto' } }, React.createElement(View, {}))));
}
function pmIconBtn() { return { width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 'var(--r-sm)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-700)', flex: 'none' }; }
function PMStat({ label, value, sub, color }) {
  return React.createElement(Card, { pad: 18 },
    React.createElement('div', { className: 'uplabel', style: { marginBottom: 10 } }, label),
    React.createElement('div', { style: { fontSize: 28, fontWeight: 800, color: color || 'var(--ink)', lineHeight: 1 } }, value),
    sub && React.createElement('div', { style: { fontSize: 12.5, color: 'var(--muted)', marginTop: 7 } }, sub));
}
function pmPill(active) { return { padding: '7px 13px', borderRadius: 'var(--r-pill)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', border: '1px solid ' + (active ? 'var(--blue)' : 'var(--border)'), background: active ? 'var(--blue)' : 'var(--surface)', color: active ? '#fff' : 'var(--gray-700)' }; }

/* 1. Dashboard */
function PMDashboard() {
  const active = PM.PROJECTS.filter(p => p.status === 'active').length;
  const openTasks = PM.TASKS.filter(t => t.status !== 'done').length;
  const doneTasks = PM.TASKS.filter(t => t.status === 'done').length;
  const issues = PM.RAID.Issues.length + PM.RAID.Dependencies.filter(d => d.status === 'blocked').length;
  const sprint = PM.SPRINTS.find(s => s.status === 'active');
  return React.createElement('div', { style: { maxWidth: 1080 } },
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 16, marginBottom: 22 } },
      React.createElement(PMStat, { label: 'Active projects', value: active, sub: PM.PROJECTS.length + ' total' }),
      React.createElement(PMStat, { label: 'Open tasks', value: openTasks, sub: doneTasks + ' done' }),
      React.createElement(PMStat, { label: 'Sprint progress', value: Math.round(sprint.done / sprint.committed * 100) + '%', sub: sprint.name, color: 'var(--blue)' }),
      React.createElement(PMStat, { label: 'Open risks & blockers', value: issues, sub: 'across RAID log', color: issues ? 'var(--danger-fg)' : 'var(--ink)' })),
    React.createElement('div', { className: 'grid-po' },
      React.createElement(Card, { pad: 0 },
        React.createElement('div', { style: { padding: '16px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('div', { className: 'uplabel' }, 'Projects'), React.createElement('span', { style: { fontSize: 13, color: 'var(--muted)' } }, 'health')),
        PM.PROJECTS.map((p, i) => { const h = PM.HEALTH[p.health]; return React.createElement('div', { key: p.code, style: { padding: '13px 20px', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 } },
              React.createElement('span', { style: { width: 8, height: 8, borderRadius: '50%', background: h.c, flex: 'none' } }),
              React.createElement('span', { style: { fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, p.name)),
            React.createElement('span', { style: { fontSize: 13, color: 'var(--muted)', flex: 'none' } }, p.progress + '%')),
          React.createElement('div', { style: { height: 6, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden' } },
            React.createElement('div', { style: { width: p.progress + '%', height: '100%', background: h.c } }))); })),
      React.createElement(Card, { pad: 0 },
        React.createElement('div', { style: { padding: '16px 20px 10px' } }, React.createElement('div', { className: 'uplabel' }, 'Recent activity')),
        PM.HISTORY.slice(0, 6).map((h, i) => React.createElement('div', { key: i, style: { display: 'flex', gap: 11, padding: '11px 20px', borderTop: i ? '1px solid var(--border-2)' : 'none', alignItems: 'flex-start' } },
          React.createElement(PM.Avatar, { name: h[0], size: 30 }),
          React.createElement('div', { style: { fontSize: 13.5, color: 'var(--body)', lineHeight: 1.45 } },
            React.createElement('strong', { style: { color: 'var(--ink)' } }, h[0]), ' ' + h[1] + ' ', React.createElement('strong', { style: { color: 'var(--ink)' } }, h[2]),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--faint)', marginTop: 2 } }, h[4]))))) ));
}

/* 2. Projects */
function PMProjects() {
  return React.createElement('div', { style: { maxWidth: 1080, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px,1fr))', gap: 16 } },
    PM.PROJECTS.map(p => { const h = PM.HEALTH[p.health]; const tasks = PM.TASKS.filter(t => t.project === p.code); const done = tasks.filter(t => t.status === 'done').length;
      return React.createElement(Card, { key: p.code, pad: 18 },
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 } },
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 16.5, fontWeight: 700, color: 'var(--ink)' } }, p.name),
            React.createElement('div', { style: { fontSize: 12.5, color: 'var(--muted)', marginTop: 3 } }, p.code + ' · ' + p.area)),
          React.createElement('span', { style: { fontSize: 11.5, fontWeight: 700, color: h.c, background: 'color-mix(in srgb,' + h.c + ' 13%, var(--surface))', padding: '3px 9px', borderRadius: 'var(--r-pill)', whiteSpace: 'nowrap' } }, h.label)),
        React.createElement('div', { style: { height: 7, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden', marginBottom: 12 } },
          React.createElement('div', { style: { width: p.progress + '%', height: '100%', background: h.c } })),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' } },
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, React.createElement(PM.Avatar, { name: p.owner, size: 22 }), p.owner.split(' ')[0]),
          React.createElement('span', null, done + '/' + tasks.length + ' tasks'),
          React.createElement('span', null, 'Due ' + p.due.slice(5)))); }));
}

/* 3. Tasks (kanban) */
function PMTasks({ mobile }) {
  const [proj, setProj] = useStatePM('all');
  const cols = PM.STATUSES;
  const labels = { todo: 'To do', inprogress: 'In progress', review: 'In review', done: 'Done' };
  const tasks = proj === 'all' ? PM.TASKS : PM.TASKS.filter(t => t.project === proj);
  return React.createElement('div', null,
    React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' } },
      React.createElement('button', { onClick: () => setProj('all'), style: pmPill(proj === 'all') }, 'All projects'),
      PM.PROJECTS.map(p => React.createElement('button', { key: p.code, onClick: () => setProj(p.code), style: pmPill(proj === p.code) }, p.code))),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(4, 1fr)', gap: 14, alignItems: 'start' } },
      cols.map(c => { const items = tasks.filter(t => t.status === c); const sc = PM.TASK_STATUS[c];
        return React.createElement('div', { key: c, style: { background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--r-lg)', padding: 10, minHeight: 80 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px 12px' } },
            React.createElement('span', { style: { width: 8, height: 8, borderRadius: '50%', background: sc.col } }),
            React.createElement('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--ink)' } }, labels[c]),
            React.createElement('span', { style: { fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' } }, items.length)),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
            items.map(t => { const pr = PM.PRIO[t.prio]; return React.createElement('div', { key: t.id, className: 'hv-card', style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 12, cursor: 'pointer', boxShadow: 'var(--sh-sm)' } },
              React.createElement('div', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 9 } }, t.title),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
                React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
                  React.createElement('span', { style: { width: 7, height: 7, borderRadius: '50%', background: pr.c } }),
                  React.createElement('span', { style: { fontSize: 11.5, color: 'var(--muted)' } }, t.project)),
                React.createElement(PM.Avatar, { name: t.assignee, size: 22 }))); }))); })));
}

/* 4. Sprints */
function PMSprints() {
  const SS = { active: { kind: 'info', label: 'Active' }, completed: { kind: 'success', label: 'Completed' }, planned: { kind: 'default', label: 'Planned' } };
  return React.createElement('div', { style: { maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 16 } },
    PM.SPRINTS.map(s => { const pct = s.committed ? Math.round(s.done / s.committed * 100) : 0; const tasks = PM.TASKS.filter(t => t.sprint === s.code);
      return React.createElement(Card, { key: s.code, pad: 20 },
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 } },
          React.createElement('div', null,
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
              React.createElement('span', { style: { fontSize: 18, fontWeight: 700, color: 'var(--ink)' } }, s.name),
              React.createElement(StatusPill, { kind: SS[s.status].kind }, SS[s.status].label)),
            React.createElement('div', { style: { fontSize: 13.5, color: 'var(--muted)', marginTop: 4 } }, s.range + ' · ' + tasks.length + ' tasks')),
          React.createElement('div', { style: { textAlign: 'right' } },
            React.createElement('div', { style: { fontSize: 22, fontWeight: 800, color: 'var(--ink)' } }, s.done + ' / ' + s.committed),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)' } }, 'points'))),
        s.committed > 0 && React.createElement('div', { style: { height: 8, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden' } },
          React.createElement('div', { style: { width: pct + '%', height: '100%', background: s.status === 'completed' ? 'var(--success-fg)' : 'var(--blue)' } }))); }));
}

/* 5. RAID */
function PMRaid() {
  const order = ['Risks', 'Assumptions', 'Issues', 'Dependencies'];
  return React.createElement('div', { style: { maxWidth: 1080, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))' } },
    order.map(k => React.createElement(Card, { key: k, pad: 0 },
      React.createElement('div', { style: { padding: '14px 18px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
        React.createElement('span', { style: { fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' } }, k),
        React.createElement('span', { style: { fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', background: 'var(--surface-2)', borderRadius: 99, padding: '2px 9px' } }, PM.RAID[k].length)),
      PM.RAID[k].map((it, i) => React.createElement('div', { key: i, style: { padding: '13px 18px', borderTop: i ? '1px solid var(--border-2)' : 'none', display: 'flex', gap: 11, alignItems: 'flex-start' } },
        React.createElement('span', { style: { width: 8, height: 8, borderRadius: '50%', background: PM.SEV[it.sev], flex: 'none', marginTop: 6 } }),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 14, color: 'var(--ink)', lineHeight: 1.45 } }, it.t),
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--muted)', marginTop: 4 } }, it.owner, ' · ', React.createElement('span', { style: { textTransform: 'capitalize' } }, it.status))))))));
}

/* 6. Operations */
function PMOps() {
  const OS = { healthy: { kind: 'success', label: 'Healthy' }, degraded: { kind: 'warning', label: 'Degraded' }, down: { kind: 'danger', label: 'Down' } };
  return React.createElement('div', { style: { maxWidth: 1000 } },
    React.createElement('p', { style: { fontSize: 14.5, color: 'var(--muted)', margin: '0 0 16px' } }, 'Recurring operational jobs that keep delivered projects running.'),
    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 110px', gap: 14, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' } },
        ['Operation', 'Frequency', 'Owner', 'Last run', 'Status'].map((h, i) => React.createElement('div', { key: i, className: 'uplabel', style: { fontSize: 11.5 } }, h))),
      PM.OPERATIONS.map((o, i) => React.createElement('div', { key: o.name, style: { display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 110px', gap: 14, padding: '13px 18px', alignItems: 'center', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: 'var(--ink)' } }, o.name),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--muted)' } }, o.freq),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--body)' } }, o.owner),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--muted)' } }, o.last),
        React.createElement('div', null, React.createElement(StatusPill, { kind: OS[o.status].kind }, OS[o.status].label)))) ));
}

/* 7. Team */
function PMTeam() {
  return React.createElement('div', { style: { maxWidth: 1000, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16 } },
    PM.TEAM.map(m => { const tasks = PM.TASKS.filter(t => t.assignee === m.name && t.status !== 'done').length; const col = m.cap > 85 ? 'var(--danger-fg)' : m.cap > 65 ? 'var(--warning-ink)' : 'var(--success-fg)';
      return React.createElement(Card, { key: m.name, pad: 18 },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 } },
          React.createElement(PM.Avatar, { name: m.name, size: 44 }),
          React.createElement('div', { style: { minWidth: 0 } },
            React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: 'var(--ink)' } }, m.name),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)' } }, m.role))),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)', marginBottom: 6 } },
          React.createElement('span', null, 'Capacity'), React.createElement('span', { style: { fontWeight: 700, color: col } }, m.cap + '%')),
        React.createElement('div', { style: { height: 6, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden', marginBottom: 12 } },
          React.createElement('div', { style: { width: m.cap + '%', height: '100%', background: col } })),
        React.createElement('div', { style: { fontSize: 13, color: 'var(--body)' } }, React.createElement('strong', null, tasks), ' active tasks')); }));
}

/* 8. Analytics */
function PMAnalytics() {
  const statusCounts = PM.STATUSES.map(s => ({ s, n: PM.TASKS.filter(t => t.status === s).length }));
  const total = PM.TASKS.length;
  const velocity = [['S-20', 28], ['S-21', 30], ['S-22', 31], ['S-23', 22]];
  const maxV = 38;
  return React.createElement('div', { style: { maxWidth: 1000 } },
    React.createElement('div', { className: 'grid-po' },
      React.createElement(Card, null,
        React.createElement('div', { className: 'uplabel', style: { marginBottom: 18 } }, 'Velocity · points / sprint'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 18, height: 160 } },
          velocity.map(([s, v]) => React.createElement('div', { key: s, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 } },
            React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: 'var(--gray-700)' } }, v),
            React.createElement('div', { style: { width: '100%', maxWidth: 46, height: (v / maxV) * 120, background: 'linear-gradient(180deg, var(--blue-300), var(--blue))', borderRadius: '6px 6px 0 0' } }),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)' } }, s))))),
      React.createElement(Card, null,
        React.createElement('div', { className: 'uplabel', style: { marginBottom: 18 } }, 'Task status'),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 13 } },
          statusCounts.map(({ s, n }) => { const sc = PM.TASK_STATUS[s]; return React.createElement('div', { key: s },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 5 } },
              React.createElement('span', { style: { fontSize: 13.5, color: 'var(--ink)', fontWeight: 600 } }, sc.label),
              React.createElement('span', { style: { fontSize: 13, color: 'var(--muted)' } }, n)),
            React.createElement('div', { style: { height: 8, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden' } },
              React.createElement('div', { style: { width: (n / total * 100) + '%', height: '100%', background: sc.col } }))); })))),
    React.createElement('div', { className: 'uplabel', style: { margin: '26px 0 12px' } }, 'Tasks by project'),
    React.createElement(Card, { pad: 20 },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 13 } },
        PM.PROJECTS.map(p => { const n = PM.TASKS.filter(t => t.project === p.code).length; const mx = Math.max(...PM.PROJECTS.map(pp => PM.TASKS.filter(t => t.project === pp.code).length));
          return React.createElement('div', { key: p.code, style: { display: 'flex', alignItems: 'center', gap: 14 } },
            React.createElement('span', { style: { width: 160, flex: 'none', fontSize: 13.5, color: 'var(--ink)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, p.name),
            React.createElement('div', { style: { flex: 1, height: 10, borderRadius: 99, background: 'var(--gray-200)', overflow: 'hidden' } },
              React.createElement('div', { style: { width: (n / mx * 100) + '%', height: '100%', background: 'var(--purple)' } })),
            React.createElement('span', { style: { width: 28, textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' } }, n)); }))));
}

/* 9. History */
function PMHistory() {
  return React.createElement('div', { style: { maxWidth: 760 } },
    React.createElement('div', { style: { position: 'relative', paddingLeft: 4 } },
      PM.HISTORY.map((h, i) => { const last = i === PM.HISTORY.length - 1;
        return React.createElement('div', { key: i, style: { display: 'flex', gap: 14, paddingBottom: last ? 0 : 18, position: 'relative' } },
          !last && React.createElement('div', { style: { position: 'absolute', left: 15, top: 34, bottom: 0, width: 2, background: 'var(--border)' } }),
          React.createElement('div', { style: { position: 'relative', zIndex: 1 } }, React.createElement(PM.Avatar, { name: h[0], size: 32 })),
          React.createElement('div', { style: { paddingTop: 3 } },
            React.createElement('div', { style: { fontSize: 14, color: 'var(--body)', lineHeight: 1.5 } },
              React.createElement('strong', { style: { color: 'var(--ink)' } }, h[0]), ' ' + h[1] + ' ', React.createElement('strong', { style: { color: 'var(--ink)' } }, h[2])),
            React.createElement('div', { style: { fontSize: 12.5, color: 'var(--faint)', marginTop: 3 } }, h[3] + ' · ' + h[4]))); })));
}

window.ProjectsApp = ProjectsApp;
