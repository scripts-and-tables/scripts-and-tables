/* Focus SKUs · Discounts · Account */

/* ---------------- Focus SKUs ---------------- */
/* Fictional retail customers (Dubai-flavored, invented — not real chains). */
const FOCUS_CUSTOMERS = [
  'MetroFresh', 'GreenBasket Hypermarket', 'CityMart', 'Bayan Hypermarket', 'Souq Saver',
  'Marina Grocers', 'Oasis Mart', 'Al Noor Supermarket', 'Gulf Stores', 'DailyCo Express',
];

/* Fictional SKUs: name, brand, 13-digit barcode (500…), default stocked-customer indices. */
const FOCUS_SKUS = [
  ['Stage 1 Infant Formula 400g', 'PureNest', '5001234500017', [0, 1, 2, 3, 4, 6, 8]],
  ['Stage 2 Follow-on Formula 800g', 'PureNest', '5001234500024', [0, 1, 3, 7]],
  ['Classic Instant Coffee 200g', 'Nordia', '5001234500031', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
  ['Gold Roast Coffee 100g', 'Nordia', '5001234500048', [1, 2, 5, 8]],
  ['Hazelnut Spread 350g', 'Velora', '5001234500055', [0, 2, 3, 4, 5, 6]],
  ['Strawberry Jam 450g', 'Velora', '5001234500062', [2, 4, 6]],
  ['Original Detergent 2.5kg', 'Aurora', '5001234500079', [0, 1, 2, 3, 4, 5, 6, 7, 8]],
  ['Fabric Softener 1L', 'Aurora', '5001234500086', [1, 3, 5, 7, 9]],
  ['Green Tea Bags 50ct', 'Brightleaf', '5001234500093', [0, 4, 6, 8, 9]],
  ['Herbal Infusion 25ct', 'Brightleaf', '5001234500109', [4, 8]],
  ['Sunflower Oil 1.5L', 'Sunata', '5001234500116', [0, 1, 2, 3, 5, 6, 7]],
  ['Extra Virgin Olive Oil 750ml', 'Sunata', '5001234500123', [1, 2, 5]],
  ['Sparkling Water 6x500ml', 'Zephyr', '5001234500130', [0, 1, 5, 6, 9]],
  ['Still Mineral Water 1.5L', 'Zephyr', '5001234500147', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
  ['Whole Grain Cereal 500g', 'Lumio', '5001234500154', [2, 3, 6, 8]],
  ['Choco Crunch Cereal 375g', 'Lumio', '5001234500161', [3, 6]],
].map(([name, brand, barcode, stocked], id) => ({ id, name, brand, barcode, stocked }));

function MslApp() {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(null);     // selected SKU id, or null
  const [dist, setDist] = useState({});           // overrides: { [skuId]: Set(custIdx) }
  const [toast, setToast] = useState('');

  // Resolve the current stocked-set for a SKU (override if edited, else default).
  const stockedSet = (sku) => dist[sku.id] || new Set(sku.stocked);

  const list = FOCUS_SKUS.filter(s =>
    (s.name + ' ' + s.brand + ' ' + s.barcode).toLowerCase().includes(q.toLowerCase()));

  /* ---- Detail / drawer view ---- */
  if (active != null) {
    const sku = FOCUS_SKUS[active];
    const set = stockedSet(sku);
    const toggle = (idx) => setDist(d => {
      const next = new Set(d[sku.id] || sku.stocked);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return { ...d, [sku.id]: next };
    });
    const save = () => {
      setToast('Distribution saved · stocked in ' + set.size + ' of ' + FOCUS_CUSTOMERS.length + ' customers');
      setTimeout(() => setToast(''), 2600);
    };
    return React.createElement(Page, { max: 820 },
      React.createElement('button', {
        onClick: () => { setActive(null); setToast(''); },
        style: { display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: 15.5, fontWeight: 600, marginBottom: 18, padding: 0 },
      },
        React.createElement(Icon, { name: 'arrowLeft', size: 18 }), 'Back to Focus SKUs'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 8 } },
        React.createElement('div', { style: { width: 52, height: 52, borderRadius: 'var(--r)', background: 'var(--blue-050)', color: 'var(--blue)', display: 'grid', placeItems: 'center', flex: 'none' } },
          React.createElement(Icon, { name: 'package', size: 26 })),
        React.createElement('div', null,
          React.createElement('h1', { style: { fontSize: 28, fontWeight: 700, marginBottom: 4 } }, sku.name),
          React.createElement('div', { style: { fontSize: 15.5, color: 'var(--muted)' } },
            sku.brand,
            React.createElement('span', { style: { color: 'var(--faint)', margin: '0 8px' } }, '·'),
            React.createElement('span', { style: { fontVariantNumeric: 'tabular-nums', letterSpacing: '.02em' } }, sku.barcode))
        )
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 18px' } },
        React.createElement(StatusPill, { kind: set.size ? 'success' : 'warning' },
          'Stocked in ' + set.size + ' of ' + FOCUS_CUSTOMERS.length + ' customers'),
        React.createElement('span', { style: { fontSize: 15, color: 'var(--muted)' } }, 'Define where we sell it')
      ),
      React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
        FOCUS_CUSTOMERS.map((c, idx) => {
          const on = set.has(idx);
          return React.createElement('label', {
            key: c,
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, cursor: 'pointer',
              padding: '15px 20px', borderTop: idx ? '1px solid var(--border-2)' : 'none',
              background: on ? 'var(--blue-050)' : 'transparent',
            },
          },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
              React.createElement('span', { style: {
                width: 22, height: 22, borderRadius: 6, flex: 'none', display: 'grid', placeItems: 'center',
                border: '1.5px solid ' + (on ? 'var(--blue)' : 'var(--border)'),
                background: on ? 'var(--blue)' : 'var(--surface)', color: '#fff',
              } }, on ? React.createElement(Icon, { name: 'check', size: 15, stroke: 3 }) : null),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                React.createElement(Icon, { name: 'store', size: 18, style: { color: 'var(--gray-500)' } }),
                React.createElement('span', { style: { fontSize: 16, fontWeight: 600, color: 'var(--ink)' } }, c))
            ),
            React.createElement('span', { style: { fontSize: 13.5, fontWeight: 600, color: on ? 'var(--blue-700)' : 'var(--muted)' } }, on ? 'Stocked' : 'Excluded'),
            React.createElement('input', { type: 'checkbox', checked: on, onChange: () => toggle(idx), style: { position: 'absolute', opacity: 0, width: 0, height: 0 } })
          );
        })
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 22, flexWrap: 'wrap' } },
        React.createElement('span', { style: { fontSize: 14.5, color: 'var(--muted)' } }, 'Changes apply to ' + sku.name + '.'),
        React.createElement(Button, { size: 'lg', icon: 'check', onClick: save }, 'Save distribution')
      ),
      toast ? React.createElement('div', { style: {
        position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 50,
        background: 'var(--ink)', color: 'var(--surface)', padding: '12px 20px', borderRadius: 'var(--r-pill)',
        boxShadow: 'var(--sh-md)', fontSize: 14.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 9,
      } },
        React.createElement(Icon, { name: 'check', size: 17, stroke: 3 }), toast) : null
    );
  }

  /* ---- List view ---- */
  return React.createElement(Page, { max: 920 },
    React.createElement('h1', { style: { fontSize: 30, fontWeight: 700, marginBottom: 6 } }, 'Focus SKUs'),
    React.createElement('p', { style: { fontSize: 18, color: 'var(--muted)', margin: '0 0 26px' } }, 'Select a focus SKU and choose which customers stock it.'),
    React.createElement('div', { style: { marginBottom: 18 } }, React.createElement(SearchBar, { placeholder: 'Search by product, brand or barcode…', value: q, onChange: setQ })),
    React.createElement(Card, { pad: 0, style: { overflow: 'hidden' } },
      list.length ? list.map((s, i) => {
        const count = stockedSet(s).size;
        return React.createElement('button', {
          key: s.id,
          onClick: () => { setActive(s.id); setToast(''); },
          style: {
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            padding: '16px 22px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
            borderTop: i ? '1px solid var(--border-2)' : 'none',
          },
          onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-2)',
          onMouseLeave: e => e.currentTarget.style.background = 'transparent',
        },
          React.createElement('div', { style: { minWidth: 0 } },
            React.createElement('div', { style: { fontSize: 16.5, fontWeight: 700, color: 'var(--ink)' } }, s.name),
            React.createElement('div', { style: { fontSize: 13.5, color: 'var(--muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
              React.createElement('span', { style: { fontWeight: 600, color: 'var(--gray-700)' } }, s.brand),
              React.createElement('span', { style: { color: 'var(--faint)' } }, '·'),
              React.createElement('span', { style: { fontVariantNumeric: 'tabular-nums', letterSpacing: '.02em' } }, s.barcode))
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, flex: 'none' } },
            React.createElement(CountPill, { icon: 'store' }, count + ' / ' + FOCUS_CUSTOMERS.length + ' customers'),
            React.createElement(Icon, { name: 'chevRight', size: 20, style: { color: 'var(--gray-400)' } })
          )
        );
      }) : React.createElement('div', { style: { padding: '40px 22px', textAlign: 'center', color: 'var(--muted)', fontSize: 15.5 } }, 'No SKUs match your search.')
    )
  );
}

/* ---------------- Discounts ---------------- */
const DISC_OFFERS = [
  ['City Sports', 'Health & Fitness', 'Downtown', 20, '#3b7a57'],
  ['Cafe Lumen', 'Food & Drink', 'Hillside', 20, '#c2742d'],
  ['GlowCare', 'Beauty & Wellness', 'Downtown', 10, '#9b8579'],
  ['BrightMinds', 'Health & Fitness', 'Downtown', 15, '#4a4a4a'],
  ['PulseFit', 'Health & Fitness', 'Hillside', 30, '#b23b3b'],
  ['FitFlow Gym', 'Health & Fitness', 'Downtown', 20, '#2f5a8c'],
  ['Sweet Crumb Bakery', 'Food & Drink', 'Central Mall', 15, '#caa15a'],
  ['Live Arena', 'Entertainment', 'City Arena', 10, '#1f6fb2'],
  ['Snack Stop', 'Food & Drink', 'Marina', 38, '#a6402f'],
  ['Urban Eats', 'Food & Drink', 'Multiple', 15, '#7a8c3b'],
];
const DISC_CATS = ['All Categories', 'Food & Drink', 'Beauty & Wellness', 'Health & Fitness', 'Entertainment', 'Home & Lifestyle', 'Other'];
function MslPlaceholderImg({ color, label }) {
  return React.createElement('div', { style: {
    height: 168, background: 'linear-gradient(135deg,' + color + ',' + color + 'cc)', position: 'relative',
    display: 'grid', placeItems: 'center',
  } },
    React.createElement('div', { style: { color: 'rgba(255,255,255,.85)', fontWeight: 700, fontSize: 22, letterSpacing: '.04em', textTransform: 'uppercase' } }, label),
    React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 10px, transparent 10px 20px)' } })
  );
}
function DiscountsApp() {
  const [q, setQ] = useState(''); const [status, setStatus] = useState('Active'); const [cat, setCat] = useState('All Categories');
  const list = DISC_OFFERS.filter(o => (cat === 'All Categories' || o[1] === cat) && (o[0] + o[1] + o[2]).toLowerCase().includes(q.toLowerCase()));
  return React.createElement(Page, { max: 1180 },
    React.createElement('h1', { style: { fontSize: 30, fontWeight: 700, marginBottom: 6 } }, 'Corporate Offers'),
    React.createElement('p', { style: { fontSize: 18, color: 'var(--muted)', margin: '0 0 24px' } }, 'Exclusive offers for the team'),
    React.createElement('div', { style: { marginBottom: 20 } },
      React.createElement(SearchBar, { placeholder: 'Search by vendor, area or description…', value: q, onChange: setQ, segmented: React.createElement(Segmented, { options: ['Active', 'All', 'Expired'], value: status, onChange: setStatus }) })),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 } },
      DISC_CATS.map(c => React.createElement('button', {
        key: c, onClick: () => setCat(c),
        style: {
          padding: '9px 18px', borderRadius: 'var(--r-pill)', cursor: 'pointer', fontSize: 14.5, fontWeight: 600,
          border: '1px solid ' + (cat === c ? 'var(--blue)' : 'var(--border)'),
          background: cat === c ? 'var(--blue)' : 'var(--surface)', color: cat === c ? '#fff' : 'var(--gray-700)',
        },
      }, c))
    ),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 } },
      list.map(o => React.createElement(Card, { key: o[0], pad: 0, hover: true, style: { overflow: 'hidden' } },
        React.createElement('div', { style: { position: 'relative' } },
          React.createElement(MslPlaceholderImg, { color: o[4], label: o[0].split(' ')[0] }),
          React.createElement('span', { style: {
            position: 'absolute', top: 12, right: 12, background: 'var(--green)', color: '#fff', fontWeight: 700,
            fontSize: 13.5, padding: '5px 11px', borderRadius: 'var(--r-pill)', boxShadow: 'var(--sh-sm)',
          } }, o[3] + '% OFF')
        ),
        React.createElement('div', { style: { padding: '16px 18px 18px' } },
          React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: 'var(--ink)' } }, o[0]),
          React.createElement('div', { style: { fontSize: 14.5, color: '#9a6a4a', marginTop: 4 } }, o[1] + '  ·  ' + o[2])
        )
      ))
    )
  );
}

/* ---------------- Account ---------------- */
function AccountApp() {
  return React.createElement(Page, { max: 880 },
    React.createElement(Card, { pad: 24, style: { background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: 26, marginBottom: 28 } },
      React.createElement(Avatar, { initial: 'O', size: 104, gradient: 'linear-gradient(150deg,#d98a2b,#bd9a1e)' }),
      React.createElement('div', null,
        React.createElement('h1', { style: { fontSize: 28, fontWeight: 700 } }, 'Oleksandr')
      )
    ),
    React.createElement('div', { className: 'uplabel', style: { margin: '0 4px 12px' } }, 'Contact'),
    React.createElement(Card, { pad: 0, style: { marginBottom: 28 } }, React.createElement(InfoRow, { icon: 'mail', label: 'Email', value: 'oleks.t@company.com' })),
    React.createElement('div', { className: 'uplabel', style: { margin: '0 4px 12px' } }, 'Work'),
    React.createElement(Card, { pad: 0 },
      React.createElement(InfoRow, { icon: 'building', label: 'Department', value: 'Personal Care' }),
      React.createElement(InfoRow, { icon: 'userCheck', label: 'Reports to', value: 'Sara', border: true }),
      React.createElement(InfoRow, { icon: 'briefcase', label: 'Pay frequency', value: 'Quarterly', border: true })
    )
  );
}
function InfoRow({ icon, label, value, border }) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderTop: border ? '1px solid var(--border-2)' : 'none' } },
    React.createElement('div', { style: { width: 44, height: 44, borderRadius: 'var(--r)', background: 'var(--blue-050)', color: 'var(--blue)', display: 'grid', placeItems: 'center', flex: 'none' } },
      React.createElement(Icon, { name: icon, size: 20 })),
    React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 14.5, color: 'var(--muted)' } }, label),
      React.createElement('div', { style: { fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginTop: 1 } }, value)
    )
  );
}

Object.assign(window, { MslApp, DiscountsApp, AccountApp });
