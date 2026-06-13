/* Project Management — data layer (window.PM). */
(function () {
  const TEAM = [
    { name: 'Mona', role: 'Project Manager', cap: 70 },
    { name: 'Oleksandr', role: 'Lead Engineer', cap: 85 },
    { name: 'Sami', role: 'Data Engineer', cap: 95 },
    { name: 'Mia', role: 'Business Analyst', cap: 60 },
    { name: 'Karim', role: 'Backend Developer', cap: 90 },
    { name: 'John', role: 'QA Lead', cap: 55 },
    { name: 'Sara', role: 'Sponsor', cap: 20 },
  ];
  const PROJECTS = [
    { code: 'PRJ-01', name: 'EPOS Pipeline v2', area: 'Data', status: 'active', health: 'green', progress: 72, owner: 'Sami', due: '2026-08-15' },
    { code: 'PRJ-02', name: 'Order Intake Automation', area: 'Operations', status: 'active', health: 'green', progress: 90, owner: 'Karim', due: '2026-06-30' },
    { code: 'PRJ-03', name: 'Commission Engine Revamp', area: 'HR Tech', status: 'active', health: 'amber', progress: 45, owner: 'Oleksandr', due: '2026-09-20' },
    { code: 'PRJ-04', name: 'Portal Mobile App', area: 'Platform', status: 'active', health: 'amber', progress: 30, owner: 'Mona', due: '2026-10-10' },
    { code: 'PRJ-05', name: 'Target Data Cleanup', area: 'Commercial', status: 'at-risk', health: 'red', progress: 20, owner: 'Mia', due: '2026-07-05' },
    { code: 'PRJ-06', name: 'Data Warehouse Migration', area: 'Data', status: 'planning', health: 'grey', progress: 8, owner: 'Sami', due: '2026-12-01' },
  ];
  const TASK_TITLES = ['Define schema mapping', 'Build ingestion job', 'QA validation rules', 'Wire up dashboard', 'Write unit tests', 'Deploy to staging', 'Stakeholder demo', 'Fix variance bug', 'Optimize query', 'Draft API spec', 'Migrate legacy table', 'Add retry logic', 'Review PR', 'Update runbook', 'Load test', 'Design mobile nav', 'Configure SSO', 'Clean target file', 'Set up alerts', 'Document rollback', 'Refactor parser', 'Add audit log', 'Build report export', 'Security review'];
  const STATUSES = ['todo', 'inprogress', 'review', 'done'];
  const PRIOS = ['high', 'medium', 'low'];
  function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const r = rnd(99);
  const TASKS = TASK_TITLES.map((t, i) => {
    const proj = PROJECTS[i % PROJECTS.length];
    return { id: 'T-' + (120 + i), title: t, project: proj.code, assignee: TEAM[i % (TEAM.length - 1)].name,
      status: STATUSES[Math.floor(r() * 4)], prio: PRIOS[Math.floor(r() * 3)], points: [1, 2, 3, 5, 8][Math.floor(r() * 5)],
      sprint: i < 8 ? 'S-23' : i < 14 ? 'S-24' : (i < 18 ? 'S-22' : 'backlog'), due: '2026-0' + (6 + (i % 4)) + '-' + String(3 + (i % 25)).padStart(2, '0') };
  });
  const SPRINTS = [
    { code: 'S-22', name: 'Sprint 22', status: 'completed', range: 'May 12 – May 23', committed: 34, done: 31 },
    { code: 'S-23', name: 'Sprint 23', status: 'active', range: 'May 26 – Jun 13', committed: 38, done: 22 },
    { code: 'S-24', name: 'Sprint 24', status: 'planned', range: 'Jun 16 – Jun 27', committed: 30, done: 0 },
    { code: 'S-25', name: 'Sprint 25', status: 'planned', range: 'Jun 30 – Jul 11', committed: 0, done: 0 },
  ];
  const RAID = {
    Risks: [
      { t: 'EPOS source schema may change mid-migration', owner: 'Sami', sev: 'high', status: 'open' },
      { t: 'Mobile app store review delays launch', owner: 'Mona', sev: 'medium', status: 'monitoring' },
      { t: 'Key developer on leave during Sprint 24', owner: 'Mona', sev: 'medium', status: 'open' },
    ],
    Assumptions: [
      { t: 'Warehouse capacity sufficient through Q4', owner: 'Sami', sev: 'low', status: 'agreed' },
      { t: 'Finance signs off commission logic by Jul 1', owner: 'Oleksandr', sev: 'medium', status: 'pending' },
    ],
    Issues: [
      { t: 'Variance bug blocking target load', owner: 'Mia', sev: 'high', status: 'open' },
      { t: 'Staging environment unstable', owner: 'Karim', sev: 'medium', status: 'in-progress' },
    ],
    Dependencies: [
      { t: 'CRM API access from vendor', owner: 'Karim', sev: 'high', status: 'blocked' },
      { t: 'SSO config from IT Security', owner: 'John', sev: 'medium', status: 'requested' },
    ],
  };
  const OPERATIONS = [
    { name: 'Nightly warehouse load', freq: 'Daily 02:00', owner: 'Data Eng', last: 'Today 02:00', sla: '99.5%', status: 'healthy' },
    { name: 'EPOS file sweep', freq: 'Every 15 min', owner: 'Platform', last: '11:45', sla: '99.9%', status: 'healthy' },
    { name: 'Commission statement run', freq: 'Monthly 1st', owner: 'HR Tech', last: 'Jun 01', sla: '100%', status: 'healthy' },
    { name: 'Backup & snapshot', freq: 'Daily 04:00', owner: 'Platform', last: 'Today 04:00', sla: '99.8%', status: 'degraded' },
    { name: 'CRM export', freq: 'Daily 22:00', owner: 'Data Eng', last: 'Failed 22:00', sla: '92%', status: 'down' },
  ];
  const HISTORY = [
    ['Karim', 'moved', 'T-122 to Done', 'Order Intake Automation', '14m ago'],
    ['Mia', 'raised an issue', 'Variance bug blocking target load', 'Target Data Cleanup', '1h ago'],
    ['Mona', 'started', 'Sprint 23', 'EPOS Pipeline v2', '2h ago'],
    ['Sami', 'closed', 'T-120 Define schema mapping', 'EPOS Pipeline v2', '3h ago'],
    ['Oleksandr', 'commented on', 'T-131 Draft API spec', 'Commission Engine Revamp', '5h ago'],
    ['John', 'flagged dependency', 'SSO config from IT Security', 'Portal Mobile App', 'Yesterday'],
    ['Sara', 'approved', 'Q3 budget for PRJ-06', 'Data Warehouse Migration', 'Yesterday'],
  ];

  const HEALTH = { green: { c: 'var(--success-fg)', label: 'On track' }, amber: { c: 'var(--warning-ink)', label: 'Needs attention' }, red: { c: 'var(--danger-fg)', label: 'At risk' }, grey: { c: 'var(--gray-500)', label: 'Planning' } };
  const TASK_STATUS = { todo: { kind: 'default', label: 'To do', col: 'var(--gray-500)' }, inprogress: { kind: 'info', label: 'In progress', col: 'var(--blue)' }, review: { kind: 'warning', label: 'In review', col: 'var(--warning-ink)' }, done: { kind: 'success', label: 'Done', col: 'var(--success-fg)' } };
  const PRIO = { high: { c: 'var(--danger-fg)', label: 'High' }, medium: { c: 'var(--warning-ink)', label: 'Medium' }, low: { c: 'var(--muted)', label: 'Low' } };
  const SEV = { high: 'var(--danger-fg)', medium: 'var(--warning-ink)', low: 'var(--muted)' };
  const PROJ_BY = Object.fromEntries(PROJECTS.map(p => [p.code, p]));

  function initials(n) { return n.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(); }
  function color(n) { const cs = ['var(--blue)', 'var(--green)', 'var(--amber)', 'var(--teal)', 'var(--purple)', 'var(--cyan)', 'var(--indigo)', 'var(--orange)']; let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) >>> 0; return cs[h % cs.length]; }
  function Avatar({ name, size = 32 }) { return React.createElement('div', { title: name, style: { width: size, height: size, borderRadius: '50%', flex: 'none', background: color(name), color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: size * 0.38 } }, initials(name)); }

  window.PM = { TEAM, PROJECTS, PROJ_BY, TASKS, STATUSES, SPRINTS, RAID, OPERATIONS, HISTORY, HEALTH, TASK_STATUS, PRIO, SEV, Avatar };
})();
