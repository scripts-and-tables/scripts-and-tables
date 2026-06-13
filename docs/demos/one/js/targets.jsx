/* Sales Targets app: employee list -> employee detail (editable monthly targets)
   + desktop right-side Quick Submission pane. All data is fictional. */

const TARGET_MONTHS = ['Jul-26', 'Aug-26', 'Sep-26', 'Oct-26', 'Nov-26', 'Dec-26'];

/* Fictional employees. Each gets a deterministic, rounded set of monthly targets. */
const SALES_EMPLOYEES = [
  ['Sara', 'EMP-0001', 'North', 6],
  ['John', 'EMP-0002', 'Central', 3],
  ['Omar', 'EMP-0003', 'East', 6],
  ['Mia', 'EMP-0004', 'West', 0],
  ['Arun', 'EMP-0005', 'North', 2],
  ['Iris', 'EMP-0006', 'Central', 6],
  ['Karim', 'EMP-0007', 'East', 4],
  ['Sami', 'EMP-0008', 'West', 0],
  ['Mona', 'EMP-0009', 'North', 6],
  ['Gabriel', 'EMP-0010', 'Central', 1],
  ['Paul', 'EMP-0011', 'East', 5],
  ['Marc', 'EMP-0012', 'West', 6],
].map(([name, id, region, filled]) => ({ name, id, region, filled }));

const EMP_BY_ID = Object.fromEntries(SALES_EMPLOYEES.map(e => [e.id, e]));

/* Rounded, illustrative AED values only. */
const TARGET_STEPS = [100000, 150000, 200000, 250000, 300000, 400000, 500000];
function idSeed(id) { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) % 233280; return h; }
function seedMonthly(id, filled) {
  let s = idSeed(id);
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return TARGET_MONTHS.map((_, mi) =>
    mi < filled ? TARGET_STEPS[Math.floor(rnd() * TARGET_STEPS.length)] : null
  );
}

function empStatus(filled) {
  if (filled >= TARGET_MONTHS.length) return { kind: 'success', label: 'Submitted' };
  if (filled === 0) return { kind: 'warning', label: 'Pending' };
  return { kind: 'info', label: filled + '/' + TARGET_MONTHS.length + ' months' };
}

const fmtAED = v => v == null ? '—' : Number(v).toLocaleString('en-US');

/* ---------------- Root ---------------- */
function TargetsApp({ subview, onSubview }) {
  const [internal, setInternal] = useState({ v: 'list' });
  const view = subview || internal;
  const setView = onSubview || setInternal;

  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 980);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 980);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  if (view && view.v === 'detail') {
    return React.createElement(EmployeeDetail, { id: view.id, mobile, onBack: () => setView({ v: 'list' }) });
  }
  return React.createElement(TargetsList, { mobile, setView });
}

/* ---------------- List view (with desktop quick-submit pane) ---------------- */
function TargetsList({ mobile, setView }) {
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();
  const list = SALES_EMPLOYEES.filter(e =>
    (e.name + ' ' + e.id + ' ' + e.region).toLowerCase().includes(ql)
  );

  const main = React.createElement('div', { style: { minWidth: 0 } },
    React.createElement('div', { style: { marginBottom: 18 } },
      React.createElement(SearchBar, { placeholder: 'Search by name, Employee ID or region…', value: q, onChange: setQ })
    ),
    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      list.length === 0
        ? React.createElement('div', { style: { padding: '42px 22px', textAlign: 'center', color: 'var(--muted)', fontSize: 15.5 } }, 'No employees match your search.')
        : list.map((e, i) => React.createElement(EmployeeRow, { key: e.id, emp: e, first: i === 0, onClick: () => setView({ v: 'detail', id: e.id }) }))
    )
  );

  return React.createElement(Page, { max: 1180 },
    React.createElement('h1', { style: { fontSize: 30, fontWeight: 700, marginBottom: 6 } }, 'Sales Targets'),
    React.createElement('p', { style: { fontSize: 18, color: 'var(--muted)', margin: '0 0 26px' } },
      'Select an employee to review and submit their monthly sales targets.'),
    mobile
      ? React.createElement('div', null,
          main,
          React.createElement('div', { style: { marginTop: 22 } }, React.createElement(QuickSubmit, null))
        )
      : React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 24, alignItems: 'start' } },
          main,
          React.createElement('div', { style: { position: 'sticky', top: 88 } }, React.createElement(QuickSubmit, null))
        )
  );
}

function EmployeeRow({ emp, first, onClick }) {
  const st = empStatus(emp.filled);
  const initials = emp.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return React.createElement('button', {
    onClick,
    style: {
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      padding: '16px 22px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
      borderTop: first ? 'none' : '1px solid var(--border-2)',
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 } },
      React.createElement(Avatar, { initial: initials, size: 40 }),
      React.createElement('div', { style: { minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 16.5, fontWeight: 700, color: 'var(--ink)' } }, emp.name),
        React.createElement('div', { style: { fontSize: 14, color: 'var(--muted)', marginTop: 2 } },
          emp.id + '  ·  ' + emp.region + ' region')
      )
    ),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, flex: 'none' } },
      React.createElement(StatusPill, { kind: st.kind }, st.label),
      React.createElement(Icon, { name: 'chevRight', size: 20, style: { color: 'var(--gray-400)' } })
    )
  );
}

/* ---------------- Detail view (editable monthly targets) ---------------- */
function EmployeeDetail({ id, mobile, onBack }) {
  const emp = EMP_BY_ID[id] || SALES_EMPLOYEES[0];
  const [vals, setVals] = useState(() => seedMonthly(emp.id, emp.filled));
  const [submitted, setSubmitted] = useState(false);

  function setCell(mi, raw) {
    const num = raw === '' ? null : Math.max(0, parseInt(String(raw).replace(/\D/g, '') || '0', 10));
    setVals(vs => vs.map((v, i) => i === mi ? num : v));
    setSubmitted(false);
  }
  function submit() {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2600);
  }

  const total = vals.reduce((a, v) => a + (v || 0), 0);
  const filledCount = vals.filter(v => v != null).length;
  const initials = emp.name.split(' ').map(w => w[0]).slice(0, 2).join('');

  return React.createElement(Page, { max: 880 },
    React.createElement('button', {
      onClick: onBack,
      style: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: 16, fontWeight: 600, padding: 0, marginBottom: 16 },
    }, React.createElement(Icon, { name: 'arrowLeft', size: 18 }), 'Back to employees'),

    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 } },
      React.createElement(Avatar, { initial: initials, size: 52 }),
      React.createElement('div', null,
        React.createElement('h1', { style: { fontSize: 26, fontWeight: 700 } }, emp.name),
        React.createElement('p', { style: { fontSize: 15.5, color: 'var(--muted)', margin: '4px 0 0' } },
          emp.id + '  ·  ' + emp.region + ' region')
      )
    ),

    /* Summary strip */
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 20 } },
      React.createElement(Stat, { label: 'Total target (AED)', value: fmtAED(total) }),
      React.createElement(Stat, { label: 'Months filled', value: filledCount + ' / ' + TARGET_MONTHS.length }),
      React.createElement(Stat, { label: 'Status', value: empStatus(filledCount).label })
    ),

    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      React.createElement('div', { style: { padding: '16px 20px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
        React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: 'var(--ink)' } }, 'Monthly targets'),
        React.createElement('span', { style: { fontSize: 13.5, color: 'var(--muted)' } }, 'Amounts in AED')
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 0 } },
        TARGET_MONTHS.map((m, mi) => React.createElement('div', {
          key: m,
          style: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px 20px',
            borderTop: (mi >= (mobile ? 1 : 2)) ? '1px solid var(--border-2)' : 'none',
            borderLeft: (!mobile && mi % 2 === 1) ? '1px solid var(--border-2)' : 'none',
          },
        },
          React.createElement('label', { style: { fontSize: 15, fontWeight: 600, color: 'var(--body)' } }, m),
          React.createElement('div', { style: {
            display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 42, width: 168,
            borderRadius: 'var(--r)', background: 'var(--surface)', border: '1px solid var(--border)',
          } },
            React.createElement('span', { style: { fontSize: 13, color: 'var(--faint)', fontWeight: 600 } }, 'AED'),
            React.createElement('input', {
              value: vals[mi] == null ? '' : vals[mi],
              onChange: e => setCell(mi, e.target.value),
              inputMode: 'numeric', placeholder: '0',
              style: { width: '100%', textAlign: 'right', border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums' },
            })
          )
        ))
      )
    ),

    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, marginTop: 22, flexWrap: 'wrap' } },
      React.createElement(Button, { icon: 'check', size: 'lg', onClick: submit }, 'Submit targets'),
      submitted && React.createElement('span', { className: 'fadein', style: {
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--r-pill)',
        background: 'var(--success-bg)', color: 'var(--success-ink)', fontSize: 14.5, fontWeight: 600,
      } }, React.createElement(Icon, { name: 'check', size: 16 }), 'Targets submitted')
    )
  );
}

function Stat({ label, value }) {
  return React.createElement('div', { style: {
    background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--r-lg)', padding: '14px 16px',
  } },
    React.createElement('div', { style: { fontSize: 12.5, fontWeight: 700, letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--muted)' } }, label),
    React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginTop: 4, fontVariantNumeric: 'tabular-nums' } }, value)
  );
}

/* ---------------- Quick Submission pane ---------------- */
function QuickSubmit() {
  const [empId, setEmpId] = useState(SALES_EMPLOYEES[0].id);
  const [month, setMonth] = useState(TARGET_MONTHS[0]);
  const [amount, setAmount] = useState('');
  const [done, setDone] = useState(false);

  function submit() {
    setDone(true);
    setAmount('');
    setTimeout(() => setDone(false), 2600);
  }

  const selStyle = {
    width: '100%', height: 44, padding: '0 12px', borderRadius: 'var(--r)',
    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)',
    fontSize: 15, fontFamily: 'inherit', cursor: 'pointer', appearance: 'none',
  };
  const field = (label, control) => React.createElement('div', { style: { marginBottom: 14 } },
    React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 } }, label),
    control
  );

  return React.createElement(Card, { style: { padding: 20 } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 } },
      React.createElement(Icon, { name: 'target', size: 20, style: { color: 'var(--blue)' } }),
      React.createElement('div', { style: { fontSize: 17, fontWeight: 700, color: 'var(--ink)' } }, 'Quick submission')
    ),
    React.createElement('p', { style: { fontSize: 13.5, color: 'var(--muted)', margin: '0 0 16px' } },
      'Set a single target without opening the employee.'),

    field('Employee', React.createElement('select', {
      value: empId, onChange: e => setEmpId(e.target.value), style: selStyle,
    }, SALES_EMPLOYEES.map(e => React.createElement('option', { key: e.id, value: e.id }, e.name + ' · ' + e.id)))),

    field('Month', React.createElement('select', {
      value: month, onChange: e => setMonth(e.target.value), style: selStyle,
    }, TARGET_MONTHS.map(m => React.createElement('option', { key: m, value: m }, m)))),

    field('Amount (AED)', React.createElement('div', { style: {
      display: 'flex', alignItems: 'center', gap: 6, height: 44, padding: '0 12px',
      borderRadius: 'var(--r)', border: '1px solid var(--border)', background: 'var(--surface)',
    } },
      React.createElement('span', { style: { fontSize: 13, color: 'var(--faint)', fontWeight: 600 } }, 'AED'),
      React.createElement('input', {
        value: amount, onChange: e => setAmount(e.target.value.replace(/\D/g, '')),
        inputMode: 'numeric', placeholder: '250,000',
        style: { width: '100%', textAlign: 'right', border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums' },
      })
    )),

    React.createElement(Button, {
      icon: 'check', style: { width: '100%', justifyContent: 'center' },
      onClick: submit,
    }, 'Submit'),

    done && React.createElement('div', { className: 'fadein', style: {
      display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '9px 12px', borderRadius: 'var(--r)',
      background: 'var(--success-bg)', color: 'var(--success-ink)', fontSize: 14, fontWeight: 600,
    } },
      React.createElement(Icon, { name: 'check', size: 16 }),
      'Target submitted for ' + (EMP_BY_ID[empId] ? EMP_BY_ID[empId].name : '') + ' · ' + month)
  );
}

window.TargetsApp = TargetsApp;
