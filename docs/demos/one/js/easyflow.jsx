/* EasyFlow — SPA shell + views. Uses window.EF. */
const { useState: useStateEF, useMemo: useMemoEF, useEffect: useEffectEF } = React;
const EFD = window.EF;

function EasyFlowApp({ onBack }) {
  const [nav, setNav] = useStateEF('requests');
  const [flowId, setFlowId] = useStateEF(null);
  const [reqId, setReqId] = useStateEF(null);
  const [mobile, setMobile] = useStateEF(() => typeof window !== 'undefined' && window.innerWidth < 760);
  useEffectEF(() => { const h = () => setMobile(window.innerWidth < 760); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);

  const go = (n) => { setNav(n); setFlowId(null); setReqId(null); };
  const items = [['requests', 'My requests', 'inbox'], ['flows', 'Flows', 'layers'], ['users', 'Users', 'users'], ['docs', 'Docs', 'fileText']];

  let body;
  if (reqId) body = React.createElement(EFRequestDetail, { id: reqId, onBack: () => setReqId(null), onOpenFlow: id => { setReqId(null); setFlowId(id); setNav('flows'); } });
  else if (flowId) body = React.createElement(EFFlowDetail, { id: flowId, onBack: () => setFlowId(null), onOpenReq: setReqId });
  else if (nav === 'requests') body = React.createElement(EFRequests, { onOpenReq: setReqId });
  else if (nav === 'flows') body = React.createElement(EFFlows, { onOpenFlow: setFlowId });
  else if (nav === 'users') body = React.createElement(EFUsers, { onOpenFlow: id => { setFlowId(id); setNav('flows'); } });
  else body = React.createElement(EFDocs);

  const search = React.createElement('div', { style: { flex: '1 1 320px', maxWidth: 520, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 42, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)' } },
    React.createElement(Icon, { name: 'search', size: 17, style: { color: 'var(--faint)' } }),
    React.createElement('input', { placeholder: 'Search requests…', style: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14.5, color: 'var(--ink)', fontFamily: 'inherit' } }),
    React.createElement('span', { style: { fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 5, padding: '2px 7px', background: 'var(--surface-2)' } }, '⌘K'));
  const newBtn = React.createElement(Button, { icon: 'plus' }, 'New request');

  if (mobile) {
    return React.createElement('div', { className: 'fadein', style: { minHeight: '100vh', background: 'var(--canvas)', display: 'flex', flexDirection: 'column' } },
      React.createElement('div', { style: { height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 20 } },
        React.createElement('button', { onClick: onBack, title: 'Back to One', style: efIconBtn() }, React.createElement(Icon, { name: 'arrowLeft', size: 20 })),
        React.createElement(IconTile, { icon: 'sitemap', color: 'var(--blue)', size: 30, radius: 9, iconSize: 16 }),
        React.createElement('span', { style: { fontWeight: 800, fontSize: 16, color: 'var(--ink)', flex: 1 } }, 'Process Master'),
        React.createElement('button', { style: { ...efIconBtn(), background: 'var(--blue)', color: '#fff' } }, React.createElement(Icon, { name: 'plus', size: 20 }))),
      React.createElement('div', { style: { flex: 1, padding: '18px 16px 92px', overflowY: 'auto' } }, body),
      React.createElement('div', { style: { position: 'fixed', bottom: 0, left: 0, right: 0, height: 64, display: 'flex', background: 'var(--surface)', borderTop: '1px solid var(--border)', zIndex: 30 } },
        items.map(([id, label, icon]) => React.createElement('button', { key: id, onClick: () => go(id), style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', color: nav === id ? 'var(--blue)' : 'var(--muted)', fontSize: 10.5, fontWeight: 600 } },
          React.createElement(Icon, { name: icon, size: 21 }), label.replace('My ', '')))));
  }

  return React.createElement('div', { className: 'fadein', style: { display: 'flex', minHeight: '100vh', background: 'var(--canvas)' } },
    React.createElement('aside', { style: { width: 248, flex: 'none', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '18px 18px', borderBottom: '1px solid var(--border-2)' } },
        React.createElement(IconTile, { icon: 'sitemap', color: 'var(--blue)', size: 36, radius: 10, iconSize: 19 }),
        React.createElement('span', { style: { fontWeight: 800, fontSize: 18, color: 'var(--ink)' } }, 'Process Master')),
      React.createElement('div', { style: { padding: '18px 14px', flex: 1 } },
        React.createElement('div', { className: 'uplabel', style: { padding: '0 8px 10px' } }, 'Workspace'),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          items.map(([id, label, icon]) => {
            const active = nav === id;
            return React.createElement('button', { key: id, onClick: () => go(id),
              style: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 'var(--r)', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, background: active ? 'var(--blue-050)' : 'transparent', color: active ? 'var(--blue)' : 'var(--gray-700)' },
              onMouseEnter: e => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; },
              onMouseLeave: e => { if (!active) e.currentTarget.style.background = 'transparent'; } },
              React.createElement(Icon, { name: icon, size: 19 }), label);
          }))),
      React.createElement('div', { style: { padding: '14px 14px 76px', borderTop: '1px solid var(--border-2)' } },
        React.createElement('button', { onClick: onBack, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--r)', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--gray-700)', fontSize: 14.5, fontWeight: 600, width: '100%' } },
          React.createElement(Icon, { name: 'arrowLeft', size: 18 }), 'Back to One'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 0' } },
          React.createElement(EFD.EFAvatar, { name: 'Oleksandr', size: 34 }),
          React.createElement('div', { style: { minWidth: 0 } },
            React.createElement('div', { style: { fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, 'Oleksandr'),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, 'oleks.t@company.com')))) ),
    React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 } },
      React.createElement('div', { style: { height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' } },
        search, React.createElement('div', { style: { flex: 1 } }), newBtn),
      React.createElement('div', { style: { padding: '32px', overflowY: 'auto' } }, body)));
}
function efIconBtn() { return { width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 'var(--r-sm)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-700)', flex: 'none' }; }

/* ---------- My requests ---------- */
function EFRequests({ onOpenReq }) {
  const [who, setWho] = useStateEF('me');
  const [status, setStatus] = useStateEF('all');
  let rows = EFD.EF_REQUESTS.filter(r => who === 'me' ? r.by === 'me' : r.assigned);
  const counts = { all: rows.length, inprogress: rows.filter(r => r.status === 'inprogress').length, approved: rows.filter(r => r.status === 'approved').length, cancelled: rows.filter(r => r.status === 'cancelled').length };
  if (status !== 'all') rows = rows.filter(r => r.status === status);
  return React.createElement('div', { style: { maxWidth: 1100 } },
    React.createElement('h1', { style: { fontSize: 28, fontWeight: 700, marginBottom: 6 } }, 'My requests'),
    React.createElement('p', { style: { fontSize: 16, color: 'var(--muted)', margin: '0 0 22px' } }, 'Requests you’ve raised and steps waiting on you — all in one place.'),
    React.createElement('div', { style: { display: 'inline-flex', padding: 4, background: 'var(--surface-2)', borderRadius: 'var(--r)', border: '1px solid var(--border-2)', marginBottom: 20 } },
      [['me', 'Created by me'], ['assigned', 'Assigned to me']].map(([id, label]) => React.createElement('button', { key: id, onClick: () => setWho(id),
        style: { padding: '8px 16px', border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: who === id ? 'var(--blue)' : 'transparent', color: who === id ? '#fff' : 'var(--gray-700)' } },
        label, ' ', React.createElement('span', { style: { opacity: .7 } }, id === 'me' ? EFD.EF_REQUESTS.filter(r => r.by === 'me').length : EFD.EF_REQUESTS.filter(r => r.assigned).length)))),
    React.createElement('div', { style: { display: 'flex', gap: 22, borderBottom: '1px solid var(--border-2)', marginBottom: 4 } },
      [['all', 'All'], ['inprogress', 'In progress'], ['approved', 'Approved'], ['cancelled', 'Cancelled']].map(([id, label]) => React.createElement('button', { key: id, onClick: () => setStatus(id),
        style: { padding: '10px 0', border: 'none', borderBottom: '2px solid ' + (status === id ? 'var(--blue)' : 'transparent'), background: 'transparent', cursor: 'pointer', fontSize: 14.5, fontWeight: 600, color: status === id ? 'var(--blue)' : 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 7 } },
        label, React.createElement('span', { style: { fontSize: 12, fontWeight: 700, color: 'var(--muted)', background: 'var(--surface-2)', borderRadius: 99, padding: '1px 7px' } }, counts[id] || 0)))),
    rows.length === 0
      ? React.createElement('div', { style: { padding: '48px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 15 } }, 'Nothing here yet.')
      : React.createElement(Card, { pad: 0, style: { overflow: 'hidden', marginTop: 16 } },
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '120px 1fr 110px 130px 130px', gap: 14, padding: '12px 20px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' } },
            ['Request', 'Flow', 'Submitted', 'Progress', 'Status'].map(h => React.createElement('div', { key: h, className: 'uplabel', style: { fontSize: 11.5 } }, h))),
          rows.map((r, i) => {
            const flow = EFD.EF_FLOW_BY_ID[r.flow]; const sp = EFD.EF_STATUS[r.status];
            return React.createElement('div', { key: r.id, onClick: () => onOpenReq(r.id), className: 'hv-row', style: { display: 'grid', gridTemplateColumns: '120px 1fr 110px 130px 130px', gap: 14, padding: '15px 20px', alignItems: 'center', cursor: 'pointer', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
              React.createElement('div', { style: { fontWeight: 700, color: 'var(--ink)' } }, r.id),
              React.createElement('div', { style: { minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, flow.name),
                React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, r.title)),
              React.createElement('div', { style: { fontSize: 13.5, color: 'var(--muted)' } }, r.submitted),
              React.createElement(EFMiniProgress, { flow, idx: r.stepIdx, status: r.status }),
              React.createElement('div', null, React.createElement(StatusPill, { kind: sp.kind }, sp.label)));
          })));
}
function EFMiniProgress({ flow, idx, status }) {
  const n = flow.steps.length;
  return React.createElement('div', { style: { display: 'flex', gap: 3 } },
    flow.steps.map((s, i) => {
      const done = status === 'approved' || i < idx;
      const cur = status === 'inprogress' && i === idx;
      const col = status === 'cancelled' && i >= idx ? 'var(--gray-300)' : (done ? 'var(--success-fg)' : cur ? 'var(--blue)' : 'var(--gray-300)');
      return React.createElement('span', { key: i, title: s.name, style: { width: 14, height: 6, borderRadius: 99, background: col } });
    }));
}

/* ---------- Flows list ---------- */
function EFFlows({ onOpenFlow }) {
  return React.createElement('div', { style: { maxWidth: 1100 } },
    React.createElement('h1', { style: { fontSize: 28, fontWeight: 700, marginBottom: 6 } }, 'Flows'),
    React.createElement('p', { style: { fontSize: 16, color: 'var(--muted)', margin: '0 0 24px' } }, 'Every process available in Process Master — open one to see its full step flow.'),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 } },
      EFD.EF_FLOWS.map(f => {
        const reqs = EFD.EF_REQUESTS.filter(r => r.flow === f.id).length;
        return React.createElement('div', { key: f.id, onClick: () => onOpenFlow(f.id), className: 'hv-card', style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, cursor: 'pointer', boxShadow: 'var(--sh-sm)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11 } },
              React.createElement(IconTile, { icon: 'sitemap', color: f.color, size: 38, radius: 11, iconSize: 19 }),
              React.createElement('h3', { style: { fontSize: 17.5, fontWeight: 700 } }, f.name)),
            React.createElement('span', { style: { fontSize: 11.5, fontWeight: 700, color: 'var(--blue)', background: 'var(--blue-050)', borderRadius: 'var(--r-sm)', padding: '3px 8px' } }, f.code)),
          React.createElement('p', { style: { fontSize: 14.5, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5, minHeight: 42 } }, f.desc),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-2)', paddingTop: 14 } },
            React.createElement('span', { style: { fontSize: 13.5, color: 'var(--body)', display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 600 } }, React.createElement(Icon, { name: 'layers', size: 15, style: { color: 'var(--muted)' } }), f.steps.length + ' steps'),
            React.createElement('span', { style: { fontSize: 13.5, color: 'var(--muted)' } }, reqs + (reqs === 1 ? ' request' : ' requests'))));
      })));
}

/* ---------- Flow detail (visual flow) ---------- */
function EFFlowDetail({ id, onBack, onOpenReq }) {
  const f = EFD.EF_FLOW_BY_ID[id];
  const reqs = EFD.EF_REQUESTS.filter(r => r.flow === id);
  return React.createElement('div', { style: { maxWidth: 1100 } },
    React.createElement('button', { onClick: onBack, style: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: 15, fontWeight: 600, padding: 0, marginBottom: 16 } }, React.createElement(Icon, { name: 'arrowLeft', size: 18 }), 'All flows'),
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 8 } },
      React.createElement(IconTile, { icon: 'sitemap', color: f.color, size: 46, radius: 13 }),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('h1', { style: { fontSize: 27, fontWeight: 700 } }, f.name),
          React.createElement('span', { style: { fontSize: 12, fontWeight: 700, color: 'var(--blue)', background: 'var(--blue-050)', borderRadius: 'var(--r-sm)', padding: '3px 9px' } }, f.code)),
        React.createElement('p', { style: { fontSize: 15.5, color: 'var(--muted)', margin: '6px 0 0' } }, f.desc)),
      React.createElement(Button, { icon: 'plus' }, 'Start request')),
    React.createElement('div', { style: { display: 'flex', gap: 24, margin: '18px 0 8px', flexWrap: 'wrap' } },
      [['Can submit', f.submitters], ['Steps', f.steps.length], ['Requests', reqs.length]].map(([k, v]) => React.createElement('div', { key: k },
        React.createElement('div', { className: 'uplabel', style: { marginBottom: 3 } }, k),
        React.createElement('div', { style: { fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' } }, v)))),
    React.createElement(Card, { style: { marginTop: 18 } },
      React.createElement('div', { className: 'uplabel', style: { marginBottom: 6 } }, 'Process flow'),
      React.createElement(EFD.FlowDiagram, { flow: f })),
    React.createElement('div', { className: 'uplabel', style: { margin: '26px 0 12px' } }, 'Steps in detail'),
    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      f.steps.map((s, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
        React.createElement('div', { style: { width: 30, height: 30, flex: 'none', borderRadius: '50%', background: 'var(--surface-2)', color: 'var(--gray-700)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 } }, i + 1),
        React.createElement(Icon, { name: s.icon, size: 18, style: { color: s.type === 'auto' ? 'var(--muted)' : 'var(--blue)', flex: 'none' } }),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: 'var(--ink)' } }, s.name),
          React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)' } }, s.role)),
        React.createElement('span', { style: { fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 'var(--r-pill)', background: s.type === 'auto' ? 'var(--surface-2)' : 'var(--blue-050)', color: s.type === 'auto' ? 'var(--muted)' : 'var(--blue)', display: 'inline-flex', alignItems: 'center', gap: 5 } },
          React.createElement(Icon, { name: s.type === 'auto' ? 'gear' : 'users', size: 12 }), s.type === 'auto' ? 'Automatic' : 'Task'))) ),
    reqs.length > 0 && React.createElement('div', null,
      React.createElement('div', { className: 'uplabel', style: { margin: '26px 0 12px' } }, 'Recent requests'),
      React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
        reqs.map((r, i) => { const sp = EFD.EF_STATUS[r.status]; return React.createElement('div', { key: r.id, onClick: () => onOpenReq(r.id), className: 'hv-row', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px 18px', cursor: 'pointer', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
          React.createElement('div', null, React.createElement('span', { style: { fontWeight: 700, color: 'var(--ink)' } }, r.id), React.createElement('span', { style: { color: 'var(--muted)', marginLeft: 10, fontSize: 14 } }, r.title)),
          React.createElement(StatusPill, { kind: sp.kind }, sp.label)); }))));
}

/* ---------- Request detail (timeline) ---------- */
function EFRequestDetail({ id, onBack, onOpenFlow }) {
  const r = EFD.EF_REQUESTS.find(x => x.id === id); const f = EFD.EF_FLOW_BY_ID[r.flow]; const sp = EFD.EF_STATUS[r.status];
  return React.createElement('div', { style: { maxWidth: 880 } },
    React.createElement('button', { onClick: onBack, style: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: 15, fontWeight: 600, padding: 0, marginBottom: 16 } }, React.createElement(Icon, { name: 'arrowLeft', size: 18 }), 'Back'),
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 6 } },
      React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('h1', { style: { fontSize: 26, fontWeight: 700 } }, r.id),
          React.createElement(StatusPill, { kind: sp.kind }, sp.label)),
        React.createElement('div', { style: { fontSize: 16, color: 'var(--body)', marginTop: 6 } }, r.title),
        React.createElement('button', { onClick: () => onOpenFlow(f.id), style: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--blue)', fontSize: 14, fontWeight: 600, marginTop: 4 } }, f.name + ' · ' + f.code)),
      r.status === 'inprogress' && React.createElement('div', { style: { display: 'flex', gap: 8 } }, React.createElement(Button, { variant: 'ghost' }, 'Reject'), React.createElement(Button, { icon: 'check' }, 'Approve'))),
    React.createElement(Card, { style: { margin: '20px 0' } },
      React.createElement('div', { className: 'uplabel', style: { marginBottom: 6 } }, 'Progress'),
      React.createElement(EFD.FlowDiagram, { flow: f, activeIdx: r.stepIdx, status: r.status })),
    React.createElement('div', { className: 'uplabel', style: { margin: '6px 0 12px' } }, 'Activity'),
    React.createElement('div', { style: { position: 'relative', paddingLeft: 4 } },
      f.steps.map((s, i) => {
        const done = r.status === 'approved' || i < r.stepIdx; const cur = r.status === 'inprogress' && i === r.stepIdx;
        const cancelled = r.status === 'cancelled' && i >= r.stepIdx;
        const col = cancelled ? 'var(--faint)' : done ? 'var(--success-fg)' : cur ? 'var(--blue)' : 'var(--faint)';
        const bg = cancelled ? 'var(--surface-2)' : done ? 'var(--success-bg)' : cur ? 'var(--blue-050)' : 'var(--surface-2)';
        const last = i === f.steps.length - 1;
        return React.createElement('div', { key: i, style: { display: 'flex', gap: 14, paddingBottom: last ? 0 : 18, position: 'relative' } },
          !last && React.createElement('div', { style: { position: 'absolute', left: 15, top: 32, bottom: 0, width: 2, background: 'var(--border)' } }),
          React.createElement('div', { style: { width: 32, height: 32, flex: 'none', borderRadius: '50%', background: bg, color: col, display: 'grid', placeItems: 'center', zIndex: 1 } }, React.createElement(Icon, { name: done ? 'check' : (cur ? s.icon : s.icon), size: 16, stroke: 2.2 })),
          React.createElement('div', { style: { paddingTop: 4 } },
            React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: 'var(--ink)' } }, s.name, cur && React.createElement('span', { style: { marginLeft: 8, fontSize: 11.5, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '.04em' } }, '· current')),
            React.createElement('div', { style: { fontSize: 13.5, color: 'var(--muted)', marginTop: 2 } }, (s.type === 'auto' ? 'Automatic · ' : 'Task · ') + s.role + (done ? '  ·  done' : cancelled ? '  ·  skipped' : ''))));
      })));
}

/* ---------- Users ---------- */
function EFUsers({ onOpenFlow }) {
  return React.createElement('div', { style: { maxWidth: 1100 } },
    React.createElement('h1', { style: { fontSize: 28, fontWeight: 700, marginBottom: 6 } }, 'Users'),
    React.createElement('p', { style: { fontSize: 16, color: 'var(--muted)', margin: '0 0 22px' } }, 'Everyone with a role on a flow — gathered from the flow definitions.'),
    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, padding: '12px 20px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' } },
        React.createElement('div', { className: 'uplabel', style: { fontSize: 11.5 } }, 'User'), React.createElement('div', { className: 'uplabel', style: { fontSize: 11.5 } }, 'Can act on')),
      EFD.EF_USERS.map((u, i) => React.createElement('div', { key: u.eid, style: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, padding: '14px 20px', alignItems: 'center', borderTop: i ? '1px solid var(--border-2)' : 'none' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11 } },
          React.createElement(EFD.EFAvatar, { name: u.name, size: 36 }),
          React.createElement('div', null, React.createElement('span', { style: { fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' } }, u.name), React.createElement('span', { style: { fontSize: 13, color: 'var(--muted)', marginLeft: 6 } }, '(' + u.eid + ')'))),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 7 } },
          Object.entries(u.roles).map(([fid, role]) => { const fl = EFD.EF_FLOW_BY_ID[fid]; return React.createElement('button', { key: fid, onClick: () => onOpenFlow(fid),
            style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--r-pill)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--gray-700)', cursor: 'pointer' } },
            role === 'approver' && React.createElement(Icon, { name: 'shield', size: 12, style: { color: 'var(--blue)' } }), fl.name); })))) ));
}

/* ---------- Docs ---------- */
function EFDocs() {
  return React.createElement('div', { style: { maxWidth: 840 } },
    React.createElement('h1', { style: { fontSize: 28, fontWeight: 700, marginBottom: 6 } }, 'Documentation'),
    React.createElement('p', { style: { fontSize: 16, color: 'var(--muted)', margin: '0 0 22px' } }, 'What Process Master is and how requests and approvals work.'),
    React.createElement(Card, { style: { marginBottom: 18 } },
      React.createElement('h3', { style: { fontSize: 19, fontWeight: 700, marginBottom: 10 } }, 'What is Process Master?'),
      React.createElement('p', { style: { fontSize: 15, color: 'var(--body)', lineHeight: 1.6, margin: 0 } }, 'Process Master is One’s in-house requests-and-approvals tool. Each business process — requesting leave, claiming expenses, onboarding a new joiner — is modelled as a', React.createElement('strong', null, 'flow'), '. Anyone with access can start a request on a flow, and Process Master routes it through the right people automatically and tracks every step.')),
    React.createElement(Card, null,
      React.createElement('h3', { style: { fontSize: 19, fontWeight: 700, marginBottom: 14 } }, 'Key concepts'),
      [['Flow', 'a process template. It defines who can submit, the fields to fill in, and the sequence of steps.'],
       ['Request', 'one submission against a flow. It moves through that flow’s steps from start to finish.'],
       ['Step', 'a stage in the flow — either a task a person must do, or an automatic step the system completes.'],
       ['Assignee', 'the person or role responsible for a task step. Automatic steps are run by Process Master.']].map(([t, d]) =>
        React.createElement('div', { key: t, style: { display: 'flex', gap: 10, padding: '8px 0', fontSize: 15, color: 'var(--body)', lineHeight: 1.55 } },
          React.createElement('span', { style: { color: 'var(--blue)', marginTop: 7, width: 6, height: 6, borderRadius: 99, background: 'var(--blue)', flex: 'none' } }),
          React.createElement('div', null, React.createElement('strong', null, t), ' — ', d)))));
}

window.EasyFlowApp = EasyFlowApp;
