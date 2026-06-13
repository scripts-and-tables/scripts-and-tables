/* EasyFlow — requests & approvals with visual process flows. */
const { useState: useStateF, useMemo: useMemoF, useEffect: useEffectF } = React;

/* ---------- step + flow data ---------- */
// step: { name, type:'task'|'auto', role, icon }
const EF_FLOWS = [
  {
    code: 'FL-01', id: 'leave', name: 'Leave Request', color: 'var(--purple)',
    desc: 'Request annual or sick leave and route it for approval.',
    submitters: 'All staff',
    steps: [
      { name: 'Submit request', type: 'task', role: 'Requester', icon: 'pencil' },
      { name: 'Check balance', type: 'auto', role: 'Process Master', icon: 'check' },
      { name: 'Manager review', type: 'task', role: 'John', icon: 'eye' },
      { name: 'HR approval', type: 'task', role: 'Arun', icon: 'shield' },
      { name: 'Update calendar', type: 'auto', role: 'Process Master', icon: 'upload' },
      { name: 'Notify requester', type: 'auto', role: 'Process Master', icon: 'mail' },
    ],
  },
  {
    code: 'FL-02', id: 'access', name: 'App Access Request', color: 'var(--blue)',
    desc: 'Request access to an app or shared folder.',
    submitters: 'Anyone',
    steps: [
      { name: 'Submit request', type: 'task', role: 'Requester', icon: 'pencil' },
      { name: 'Grant access', type: 'task', role: 'Admin', icon: 'shield' },
    ],
  },
  {
    code: 'FL-03', id: 'expense', name: 'Expense Claim', color: 'var(--green)',
    desc: 'Submit expenses for validation, review and reimbursement.',
    submitters: 'All staff',
    steps: [
      { name: 'Submit claim', type: 'task', role: 'Requester', icon: 'pencil' },
      { name: 'Validate receipts', type: 'auto', role: 'Process Master', icon: 'refresh' },
      { name: 'Manager review', type: 'task', role: 'Omar', icon: 'eye' },
      { name: 'Finance approval', type: 'task', role: 'Gabriel', icon: 'shield' },
      { name: 'Reimburse', type: 'auto', role: 'Process Master', icon: 'database' },
    ],
  },
  {
    code: 'FL-04', id: 'onboard', name: 'New Joiner Onboarding', color: 'var(--orange)',
    desc: 'Set up accounts and equipment for a new team member.',
    submitters: 'Managers',
    steps: [
      { name: 'Submit details', type: 'task', role: 'Requester', icon: 'upload' },
      { name: 'Provision accounts', type: 'auto', role: 'Process Master', icon: 'refresh' },
      { name: 'Ready to start', type: 'task', role: 'John', icon: 'check' },
    ],
  },
];
const EF_FLOW_BY_ID = Object.fromEntries(EF_FLOWS.map(f => [f.id, f]));

const EF_STATUS = {
  inprogress: { kind: 'info', label: 'In progress' },
  approved: { kind: 'success', label: 'Approved' },
  cancelled: { kind: 'danger', label: 'Cancelled' },
  rejected: { kind: 'danger', label: 'Rejected' },
};
// requests
const EF_REQUESTS = [
  { id: 'REQ-5', flow: 'access', by: 'me', submitted: '2d ago', status: 'cancelled', stepIdx: 1, title: 'Access to Reports folder' },
  { id: 'REQ-4', flow: 'expense', by: 'me', assigned: true, submitted: '4h ago', status: 'inprogress', stepIdx: 2, title: 'Client visit expenses — June' },
  { id: 'REQ-3', flow: 'leave', by: 'Mona', assigned: true, submitted: '1d ago', status: 'inprogress', stepIdx: 3, title: 'Annual leave — 5 days' },
  { id: 'REQ-2', flow: 'onboard', by: 'John', submitted: '3d ago', status: 'approved', stepIdx: 3, title: 'New joiner — Analyst' },
  { id: 'REQ-1', flow: 'expense', by: 'Omar', assigned: true, submitted: '5d ago', status: 'approved', stepIdx: 5, title: 'Travel reimbursement — May' },
];

const EF_USERS = [
  { name: 'Admin', eid: 'admin', roles: { leave: 'approver', access: 'approver' } },
  { name: 'Omar', eid: 'EMP-7239', roles: { expense: 'member' } },
  { name: 'Paul', eid: 'EMP-6373', roles: { expense: 'member' } },
  { name: 'John', eid: 'EMP-8311', roles: { leave: 'approver', access: 'approver', expense: 'member', onboard: 'member' } },
  { name: 'Mona', eid: 'EMP-7961', roles: { leave: 'member' } },
  { name: 'Arun', eid: 'EMP-7381', roles: { leave: 'approver', expense: 'member', onboard: 'member' } },
  { name: 'Gabriel', eid: 'EMP-6549', roles: { expense: 'member' } },
];

function efInitials(n) { const p = n.split(/\s+/); return ((p[0] || '')[0] || '') + ((p[1] || '')[0] || ''); }
function efColor(n) { const cs = ['var(--blue)', 'var(--green)', 'var(--amber)', 'var(--teal)', 'var(--purple)', 'var(--cyan)', 'var(--indigo)', 'var(--orange)']; let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) >>> 0; return cs[h % cs.length]; }
function EFAvatar({ name, size = 36 }) {
  return React.createElement('div', { style: { width: size, height: size, borderRadius: '50%', flex: 'none', background: efColor(name), color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: size * 0.38 } }, efInitials(name).toUpperCase());
}

/* ---------- visual flow diagram (the centerpiece) ---------- */
function StepNode({ step, index, state }) {
  // state: 'done' | 'current' | 'pending' (or null for definition view)
  const auto = step.type === 'auto';
  let ring = 'var(--border)', bg = 'var(--surface)', ic = auto ? 'var(--muted)' : 'var(--blue)';
  if (state === 'done') { ring = 'var(--success-fg)'; bg = 'var(--success-bg)'; ic = 'var(--success-fg)'; }
  else if (state === 'current') { ring = 'var(--blue)'; bg = 'var(--blue-050)'; ic = 'var(--blue)'; }
  else if (state === 'pending') { ring = 'var(--border)'; bg = 'var(--surface)'; ic = 'var(--faint)'; }
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, width: 132, flex: 'none' } },
    React.createElement('div', { style: { position: 'relative', width: 54, height: 54, borderRadius: auto ? 12 : '50%', background: bg, border: '2px ' + (auto ? 'dashed' : 'solid') + ' ' + ring, display: 'grid', placeItems: 'center', color: ic } },
      React.createElement(Icon, { name: state === 'done' ? 'check' : step.icon, size: 22, stroke: 2.2 }),
      React.createElement('span', { style: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--ink)', color: 'var(--bg)', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center' } }, index + 1)),
    React.createElement('div', { style: { textAlign: 'center' } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 } }, step.name),
      React.createElement('div', { style: { fontSize: 11.5, color: 'var(--muted)', marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 4 } },
        React.createElement(Icon, { name: auto ? 'gear' : 'users', size: 11 }), step.role)));
}
function FlowDiagram({ flow, activeIdx, status }) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', overflowX: 'auto', padding: '8px 4px 16px', gap: 0 } },
    flow.steps.map((s, i) => {
      let state = null;
      if (activeIdx != null) {
        const done = status === 'approved' ? true : i < activeIdx;
        state = (status === 'cancelled' && i >= activeIdx) ? 'pending' : (done ? 'done' : (i === activeIdx ? 'current' : 'pending'));
      }
      return React.createElement(React.Fragment, { key: i },
        React.createElement(StepNode, { step: s, index: i, state }),
        i < flow.steps.length - 1 && React.createElement('div', { style: { flex: 'none', width: 36, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          React.createElement(Icon, { name: 'arrowRight', size: 18, style: { color: (activeIdx != null && i < activeIdx) ? 'var(--success-fg)' : 'var(--gray-400)' } })));
    }));
}

window.EF = { EF_FLOWS, EF_FLOW_BY_ID, EF_STATUS, EF_REQUESTS, EF_USERS, EFAvatar, FlowDiagram, StepNode };
