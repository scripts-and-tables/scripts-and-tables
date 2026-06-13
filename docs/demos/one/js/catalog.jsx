/* Items Catalog — SKU browser with full item profile + barcode image. */
const { useState: useStateC, useMemo: useMemoC, useEffect: useEffectC } = React;

const CAT_BRANDS = {
  'PureNest': 'var(--blue)', 'Nordia': 'var(--red)', 'Crexta': 'var(--orange)', 'Tymo': 'var(--blue)',
  'Marlo': 'var(--red)', 'Brightleaf': 'var(--red)', 'Verde': 'var(--blue)', 'Sunata': 'var(--green)',
  'Lumio': 'var(--cyan)', 'Kobo': 'var(--cyan)', 'Avalon': 'var(--indigo)', 'Brisk': 'var(--blue)',
  'Velora': 'var(--amber)', 'Aurora': 'var(--orange)', 'Zephyr': 'var(--red)', 'Marlo Care': 'var(--pink)',
};
const CAT_CATEGORIES = ['Baby Nutrition', 'Beverages', 'Confectionery', 'Biscuits & Snacks', 'Cereal', 'Sauces & Spreads', 'Personal Care', 'Home Care'];

/* curated products: [name, brand, category, pack, unitsPerCase, priceAED, origin, shelfLifeM] */
const CAT_RAW = [
  ['PureNest Stage 1 Infant Formula', 'PureNest', 'Baby Nutrition', '400 g tin', 12, 38.50, 'Netherlands', 24],
  ['PureNest Stage 2 Follow-on Formula', 'PureNest', 'Baby Nutrition', '800 g tin', 6, 62.00, 'Netherlands', 24],
  ['PureNest Stage 3 Growing Up Milk', 'PureNest', 'Baby Nutrition', '900 g tin', 6, 58.75, 'Germany', 24],
  ['Aurora Wheat Cereal with Milk', 'Aurora', 'Baby Nutrition', '400 g box', 12, 14.25, 'Switzerland', 18],
  ['Aurora Rice Cereal with Milk', 'Aurora', 'Baby Nutrition', '400 g box', 12, 14.25, 'Switzerland', 18],
  ['Nordia Fortified Milk Powder', 'Nordia', 'Beverages', '900 g pouch', 12, 41.00, 'Netherlands', 18],
  ['Nordia Classic Instant Coffee', 'Nordia', 'Beverages', '200 g jar', 12, 28.90, 'UK', 24],
  ['Nordia Wafer Chocolate Bar', 'Nordia', 'Confectionery', '41.5 g x 24', 24, 36.00, 'UAE', 12],
  ['Crexta Hazelnut Spread', 'Crexta', 'Sauces & Spreads', '350 g jar', 15, 18.75, 'Italy', 12],
  ['Crexta Hazelnut Spread', 'Crexta', 'Sauces & Spreads', '750 g jar', 6, 33.50, 'Italy', 12],
  ['Tymo Spaghetti No.5', 'Tymo', 'Sauces & Spreads', '500 g pack', 24, 6.25, 'Italy', 36],
  ['Tymo Penne Rigate No.73', 'Tymo', 'Sauces & Spreads', '500 g pack', 24, 6.25, 'Italy', 36],
  ['Tymo Marinara Pasta Sauce', 'Tymo', 'Sauces & Spreads', '400 g jar', 12, 12.00, 'Italy', 24],
  ['Marlo Tomato Ketchup', 'Marlo', 'Sauces & Spreads', '342 g bottle', 24, 8.50, 'Netherlands', 24],
  ['Marlo Tomato Ketchup', 'Marlo', 'Sauces & Spreads', '910 g bottle', 12, 16.75, 'Netherlands', 24],
  ['Marlo Mayonnaise', 'Marlo', 'Sauces & Spreads', '400 ml jar', 12, 11.25, 'Netherlands', 18],
  ['Marlo Baked Beans', 'Marlo', 'Sauces & Spreads', '415 g can', 24, 5.75, 'UK', 36],
  ['Brightleaf Corn Flakes', 'Brightleaf', 'Cereal', '500 g box', 12, 15.50, 'UK', 12],
  ['Brightleaf Cocoa Pops', 'Brightleaf', 'Cereal', '375 g box', 12, 16.25, 'UK', 12],
  ['Brightleaf Light Flakes Original', 'Brightleaf', 'Cereal', '300 g box', 12, 17.00, 'UK', 12],
  ['Verde Strawberry Yogurt', 'Verde', 'Beverages', '4 x 120 g', 6, 9.75, 'Saudi Arabia', 1],
  ['Verde Greek Yogurt', 'Verde', 'Beverages', '150 g cup', 12, 4.50, 'Saudi Arabia', 1],
  ['Sunata Black Label Tea', 'Sunata', 'Beverages', '100 bags', 24, 13.25, 'UAE', 24],
  ['Sunata Green Tea', 'Sunata', 'Beverages', '25 bags', 24, 9.00, 'UAE', 24],
  ['Velora Choco Biscuits', 'Velora', 'Biscuits & Snacks', '125 g pack', 20, 10.50, 'Germany', 12],
  ['Velora Wafer Rolls', 'Velora', 'Biscuits & Snacks', '100 g pack', 20, 9.25, 'Germany', 12],
  ['Zephyr Original Chips', 'Zephyr', 'Biscuits & Snacks', '165 g can', 19, 8.75, 'Belgium', 15],
  ['Zephyr Sour Cream & Onion Chips', 'Zephyr', 'Biscuits & Snacks', '165 g can', 19, 8.75, 'Belgium', 15],
  ['Lumio Pro 1 Toothbrush Medium', 'Lumio', 'Personal Care', '1 pc', 12, 12.00, 'Germany', 60],
  ['Lumio White Toothpaste', 'Lumio', 'Personal Care', '75 ml tube', 24, 14.50, 'Germany', 36],
  ['Kobo Baby-Dry Diapers Size 4', 'Kobo', 'Personal Care', '58 pcs', 2, 64.00, 'Germany', 36],
  ['Kobo Premium Care Diapers Size 3', 'Kobo', 'Personal Care', '60 pcs', 2, 72.50, 'Germany', 36],
  ['Avalon 5-Blade Razor', 'Avalon', 'Personal Care', '1 razor + 2 blades', 6, 38.00, 'Germany', 60],
  ['Avalon 3-Blade Cartridges', 'Avalon', 'Personal Care', '8 cartridges', 6, 64.00, 'Germany', 60],
  ['Marlo Care Ultra Normal Pads', 'Marlo Care', 'Personal Care', '20 pcs', 12, 13.75, 'Germany', 48],
  ['Brisk Original Detergent Powder', 'Brisk', 'Home Care', '2.5 kg bag', 6, 32.00, 'Saudi Arabia', 36],
  ['Brisk Liquid Detergent', 'Brisk', 'Home Care', '2 L bottle', 6, 38.50, 'Saudi Arabia', 24],
];

function ean13(seed) {
  let s = (seed * 2654435761) >>> 0; let d = '500'; // GS1 country prefix (demo)
  for (let i = 0; i < 9; i++) { s = (s * 1103515245 + 12345) >>> 0; d += ((s >>> 16) % 10); }
  // checksum
  let sum = 0; for (let i = 0; i < 12; i++) sum += (+d[i]) * (i % 2 ? 3 : 1);
  return d + ((10 - (sum % 10)) % 10);
}
const CAT_ITEMS = CAT_RAW.map((r, i) => {
  const [name, brand, category, pack, upc, price, origin, shelf] = r;
  const rr = (i * 73 + 11) % 100;
  const status = rr < 8 ? 'delisted' : (rr < 18 ? 'low' : 'active');
  return {
    id: 10000 + i, name, brand, category, pack, unitsPerCase: upc, price, origin, shelfLife: shelf,
    ean: ean13(i + 7), sku: brand.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() + '-' + (4200 + i * 7),
    status, netWeight: pack, vat: 5,
    updated: '2026-0' + (1 + (i % 6)) + '-' + String(2 + (i % 26)).padStart(2, '0'),
  };
});
const CAT_TOTAL = 4318;

const CAT_STATUS = { active: { kind: 'success', label: 'Active' }, low: { kind: 'warning', label: 'Low stock' }, delisted: { kind: 'danger', label: 'Delisted' } };

/* ---------- EAN-13 barcode (authentic L/R encoding) ---------- */
const L_CODE = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
function Barcode({ code, height = 90, module = 2.4, color = 'var(--ink)' }) {
  const digits = code.replace(/\D/g, '').padEnd(13, '0').slice(0, 13);
  const bits = [];
  const push = (str, guard) => { for (const c of str) bits.push({ on: c === '1', guard }); };
  push('101', true);
  for (let i = 1; i <= 6; i++) push(L_CODE[+digits[i]], false);
  push('01010', true);
  for (let i = 7; i <= 12; i++) push(L_CODE[+digits[i]].split('').map(b => b === '1' ? '0' : '1').join(''), false);
  push('101', true);
  const W = bits.length * module;
  let x = 0; const rects = [];
  bits.forEach((b, i) => {
    const h = b.guard ? height : height - 11;
    if (b.on) rects.push(React.createElement('rect', { key: i, x, y: 0, width: module, height: h, fill: color }));
    x += module;
  });
  return React.createElement('div', { style: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: '#fff', padding: '14px 16px 10px', borderRadius: 'var(--r)', border: '1px solid var(--border)' } },
    React.createElement('svg', { width: W, height: height, viewBox: '0 0 ' + W + ' ' + height, style: { display: 'block' } }, rects),
    React.createElement('div', { style: { fontFamily: 'ui-monospace, monospace', fontSize: 14, letterSpacing: '.28em', color: '#111', paddingLeft: '.28em' } }, digits.slice(0, 1) + '  ' + digits.slice(1, 7) + '  ' + digits.slice(7)));
}

/* ---------- product thumbnail (brand monogram placeholder) ---------- */
function ProductThumb({ item, size = 56, radius = 12 }) {
  const c = CAT_BRANDS[item.brand] || 'var(--gray-tile)';
  const mono = item.brand.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
  return React.createElement('div', { style: { width: size, height: size, borderRadius: radius, flex: 'none', background: 'color-mix(in srgb, ' + c + ' 14%, var(--surface))', border: '1px solid color-mix(in srgb, ' + c + ' 24%, transparent)', display: 'grid', placeItems: 'center', color: c, fontWeight: 800, fontSize: size * 0.34, letterSpacing: '.02em' } }, mono);
}

/* ---------- list card ---------- */
function ItemCard({ item, onOpen }) {
  const sp = CAT_STATUS[item.status];
  return React.createElement('div', { onClick: onOpen, className: 'hv-card', style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 16, cursor: 'pointer', boxShadow: 'var(--sh-sm)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 150 } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 } },
      React.createElement(ProductThumb, { item, size: 52 }),
      React.createElement(StatusPill, { kind: sp.kind }, sp.label)),
    React.createElement('div', { style: { flex: 1 } },
      React.createElement('div', { style: { fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } }, item.name),
      React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 3 } }, item.brand + '  ·  ' + item.pack)),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'ui-monospace, monospace', fontSize: 12, color: 'var(--faint)', borderTop: '1px solid var(--border-2)', paddingTop: 10 } },
      React.createElement(Icon, { name: 'box', size: 13 }), item.ean));
}

/* ---------- detail row ---------- */
function CatRow({ label, children }) {
  return React.createElement('div', { style: { display: 'flex', gap: 12, padding: '11px 0', borderTop: '1px solid var(--border-2)' } },
    React.createElement('div', { style: { width: 120, flex: 'none', fontSize: 13.5, color: 'var(--muted)' } }, label),
    React.createElement('div', { style: { flex: 1, fontSize: 14.5, color: 'var(--ink)', fontWeight: 500, wordBreak: 'break-word' } }, children));
}
function ItemDetail({ item, onClose }) {
  const sp = CAT_STATUS[item.status];
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', borderBottom: '1px solid var(--border-2)' } },
      React.createElement(ProductThumb, { item, size: 52, radius: 14 }),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 16.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 } }, item.name),
        React.createElement('div', { style: { fontSize: 13, color: 'var(--muted)', marginTop: 2 } }, item.brand + '  ·  ' + item.sku)),
      React.createElement('button', { onClick: onClose, style: { width: 34, height: 34, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-700)' } }, React.createElement(Icon, { name: 'x', size: 20 }))),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '20px 22px 22px' } },
      /* barcode block */
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '6px 0 18px' } },
        React.createElement(Barcode, { code: item.ean }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('span', { style: { fontSize: 13, color: 'var(--muted)' } }, 'EAN-13'),
          React.createElement(StatusPill, { kind: sp.kind }, sp.label))),
      React.createElement('div', { className: 'uplabel', style: { padding: '8px 0 2px' } }, 'Identifiers'),
      React.createElement(CatRow, { label: 'Item code' }, React.createElement('code', { style: { fontFamily: 'ui-monospace, monospace', fontSize: 13.5 } }, item.sku)),
      React.createElement(CatRow, { label: 'Barcode (EAN)' },
        React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8 } },
          React.createElement('code', { style: { fontFamily: 'ui-monospace, monospace', fontSize: 13.5 } }, item.ean),
          React.createElement('button', { title: 'Copy', style: { width: 26, height: 26, display: 'grid', placeItems: 'center', borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-600)' } }, React.createElement(Icon, { name: 'copy', size: 14 })))),
      React.createElement(CatRow, { label: 'Brand' }, item.brand),
      React.createElement(CatRow, { label: 'Category' }, item.category),
      React.createElement('div', { className: 'uplabel', style: { padding: '22px 0 2px' } }, 'Logistics'),
      React.createElement(CatRow, { label: 'Pack size' }, item.pack),
      React.createElement(CatRow, { label: 'Units / case' }, item.unitsPerCase),
      React.createElement(CatRow, { label: 'Net weight' }, item.netWeight),
      React.createElement(CatRow, { label: 'Country of origin' }, item.origin),
      React.createElement(CatRow, { label: 'Shelf life' }, item.shelfLife + ' months'),
      React.createElement('div', { className: 'uplabel', style: { padding: '22px 0 2px' } }, 'Commercial'),
      React.createElement(CatRow, { label: 'List price' }, 'AED ' + item.price.toFixed(2)),
      React.createElement(CatRow, { label: 'VAT' }, item.vat + '%'),
      React.createElement(CatRow, { label: 'Last updated' }, item.updated)),
    React.createElement('div', { style: { display: 'flex', gap: 10, padding: '16px 22px', borderTop: '1px solid var(--border)' } },
      React.createElement(Button, { icon: 'download', variant: 'outline', style: { flex: 1, justifyContent: 'center' } }, 'Export sheet'),
      React.createElement(Button, { icon: 'pencil', style: { flex: 1, justifyContent: 'center' } }, 'Edit item')));
}

/* ---------- main ---------- */
function CatalogApp() {
  const [q, setQ] = useStateC('');
  const [brand, setBrand] = useStateC('All brands');
  const [cat, setCat] = useStateC('All categories');
  const [status, setStatus] = useStateC('All statuses');
  const [sel, setSel] = useStateC(null);
  const [mobile, setMobile] = useStateC(() => typeof window !== 'undefined' && window.innerWidth < 760);
  useEffectC(() => { const h = () => setMobile(window.innerWidth < 760); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);

  const statusMap = { 'Active': 'active', 'Low stock': 'low', 'Delisted': 'delisted' };
  const list = useMemoC(() => CAT_ITEMS.filter(it => {
    if (brand !== 'All brands' && it.brand !== brand) return false;
    if (cat !== 'All categories' && it.category !== cat) return false;
    if (status !== 'All statuses' && it.status !== statusMap[status]) return false;
    if (q && !(it.name + ' ' + it.brand + ' ' + it.ean + ' ' + it.sku).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, brand, cat, status]);

  const filters = React.createElement('div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 } },
    React.createElement('div', { style: { flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 46, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)' } },
      React.createElement(Icon, { name: 'search', size: 18, style: { color: 'var(--faint)' } }),
      React.createElement('input', { value: q, onChange: e => setQ(e.target.value), placeholder: 'Search by name, brand, item code or barcode…', style: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', fontFamily: 'inherit' } }),
      q && React.createElement('button', { onClick: () => setQ(''), style: { border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--muted)', display: 'grid', placeItems: 'center', padding: 0 } }, React.createElement(Icon, { name: 'x', size: 16 }))),
    CatSelect(brand, setBrand, ['All brands', ...Object.keys(CAT_BRANDS)]),
    CatSelect(cat, setCat, ['All categories', ...CAT_CATEGORIES]),
    CatSelect(status, setStatus, ['All statuses', 'Active', 'Low stock', 'Delisted']));

  return React.createElement('div', { className: 'fadein' },
    React.createElement(Page, { max: 1240 },
      React.createElement('h1', { style: { fontSize: 30, fontWeight: 700, marginBottom: 6 } }, 'Items Catalog'),
      React.createElement('p', { style: { fontSize: 17, color: 'var(--muted)', margin: '0 0 24px' } }, 'Every SKU we distribute. Search by name or barcode, then open an item for its full profile.'),
      filters,
      React.createElement('div', { style: { fontSize: 14, color: 'var(--muted)', marginBottom: 14 } },
        'Showing ', React.createElement('strong', { style: { color: 'var(--body)' } }, list.length.toLocaleString('en-US')), ' of ' + CAT_TOTAL.toLocaleString('en-US') + ' SKUs'),
      list.length === 0
        ? React.createElement(Card, { style: { textAlign: 'center', color: 'var(--muted)', fontSize: 15.5, padding: '48px 0' } }, 'No items match your filters.')
        : React.createElement('div', { className: 'cat-grid' }, list.map(it => React.createElement(ItemCard, { key: it.id, item: it, onOpen: () => setSel(it) })))),
    sel && React.createElement('div', { onClick: () => setSel(null), style: { position: 'fixed', inset: 0, background: 'rgba(16,24,40,.42)', zIndex: 120, display: 'flex', justifyContent: 'flex-end' } },
      React.createElement('div', { onClick: e => e.stopPropagation(), className: 'epos-drawer', style: { width: mobile ? '100%' : 480, maxWidth: '100%', height: '100%', boxShadow: 'var(--sh-lg)' } },
        React.createElement(ItemDetail, { item: sel, onClose: () => setSel(null) }))));
}
function CatSelect(value, onChange, options) {
  return React.createElement('div', { style: { position: 'relative' } },
    React.createElement('select', { value, onChange: e => onChange(e.target.value),
      style: { appearance: 'none', height: 46, padding: '0 38px 0 14px', borderRadius: 'var(--r)', border: '1px solid var(--border)', background: 'var(--surface)', boxShadow: 'var(--sh-sm)', fontSize: 14.5, color: 'var(--ink)', fontFamily: 'inherit', cursor: 'pointer', minWidth: 150 } },
      options.map(o => React.createElement('option', { key: o, value: o }, o))),
    React.createElement(Icon, { name: 'chevDown', size: 17, style: { position: 'absolute', right: 13, top: 15, color: 'var(--muted)', pointerEvents: 'none' } }));
}

window.CatalogApp = CatalogApp;
