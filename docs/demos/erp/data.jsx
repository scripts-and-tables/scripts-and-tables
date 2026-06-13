/* ============================================================
   Sample data + helpers
   Digital retail / e-commerce ERP
   ============================================================ */

const palette = ['#E07A5F','#3D405B','#F2CC8F','#5A88C0','#4CAE7A','#B85A40','#7C7AAE','#C09640'];

function hashColor(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}
function initials(name) {
  const parts = name.split(' ').filter(Boolean);
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
}
function fmtMoney(n, currency = 'USD') {
  const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  return sym + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function relDate(d) {
  const ms = Date.now() - new Date(d).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  const days = Math.floor(h / 24);
  if (days < 7) return days + 'd ago';
  return fmtDate(d);
}

const CUSTOMERS = [
  { id: 'CUS-2841', name: 'Aria Okafor',      company: 'Lumen Studios',         email: 'aria@lumen.studio',        phone: '+1 (415) 555-0142', country: 'United States', plan: 'Pro',        status: 'active',   ltv: 4280.50, orders: 18, joined: '2024-03-12', lastOrder: '2026-05-15' },
  { id: 'CUS-2842', name: 'Mateo Rivera',     company: 'Drift Audio Co.',       email: 'mateo@driftaudio.co',      phone: '+1 (212) 555-0188', country: 'United States', plan: 'Team',       status: 'active',   ltv: 9820.00, orders: 42, joined: '2023-11-04', lastOrder: '2026-05-17' },
  { id: 'CUS-2843', name: 'Imani Chen',       company: 'Wildcard Type',         email: 'imani@wildcardtype.com',   phone: '+44 20 7946 0958',  country: 'United Kingdom', plan: 'Pro',        status: 'active',   ltv: 6190.00, orders: 27, joined: '2024-01-20', lastOrder: '2026-05-12' },
  { id: 'CUS-2844', name: 'Petra Halvorsen',  company: 'Nordic Stock',          email: 'petra@nordicstock.no',     phone: '+47 22 12 34 56',   country: 'Norway',         plan: 'Starter',    status: 'trial',    ltv: 0,       orders: 0,  joined: '2026-05-14', lastOrder: null },
  { id: 'CUS-2845', name: 'Yusuf Demir',      company: 'Atlas Templates',       email: 'yusuf@atlas.tpl',          phone: '+90 212 555 0102',  country: 'Turkey',         plan: 'Pro',        status: 'active',   ltv: 3140.00, orders: 11, joined: '2024-08-09', lastOrder: '2026-05-11' },
  { id: 'CUS-2846', name: 'Sofie Lindqvist',  company: 'Pixelmint',             email: 'sofie@pixelmint.se',       phone: '+46 8 555 0144',    country: 'Sweden',         plan: 'Team',       status: 'active',   ltv: 12480.00,orders: 64, joined: '2023-07-22', lastOrder: '2026-05-16' },
  { id: 'CUS-2847', name: 'Dmitri Volkov',    company: 'Slate & Co.',           email: 'dmitri@slate.co',          phone: '+7 495 555 0177',   country: 'Russia',         plan: 'Pro',        status: 'past_due', ltv: 2280.00, orders: 9,  joined: '2024-10-30', lastOrder: '2026-04-22' },
  { id: 'CUS-2848', name: 'Naledi Mokoena',   company: 'Honeybox Studio',       email: 'naledi@honeybox.co.za',    phone: '+27 11 555 0123',   country: 'South Africa',   plan: 'Pro',        status: 'active',   ltv: 5210.00, orders: 22, joined: '2024-02-14', lastOrder: '2026-05-09' },
  { id: 'CUS-2849', name: 'Hiroki Tanaka',    company: 'Mono Print Works',      email: 'hiroki@monoprint.jp',      phone: '+81 3 5555 0199',   country: 'Japan',          plan: 'Starter',    status: 'active',   ltv: 480.00,  orders: 4,  joined: '2025-12-01', lastOrder: '2026-05-02' },
  { id: 'CUS-2850', name: 'Camille Roussel',  company: 'Maison de Vecteur',     email: 'camille@mvecteur.fr',      phone: '+33 1 55 55 01 88', country: 'France',         plan: 'Team',       status: 'active',   ltv: 8420.00, orders: 33, joined: '2023-09-18', lastOrder: '2026-05-14' },
  { id: 'CUS-2851', name: 'Beatriz Almeida',  company: 'Bossa Sound',           email: 'bea@bossasound.com.br',    phone: '+55 11 5555 0156',  country: 'Brazil',         plan: 'Pro',        status: 'active',   ltv: 3960.00, orders: 14, joined: '2024-06-07', lastOrder: '2026-05-10' },
  { id: 'CUS-2852', name: 'Idris Lawal',      company: 'Lagosfonts',            email: 'idris@lagosfonts.com',     phone: '+234 1 555 0144',   country: 'Nigeria',        plan: 'Pro',        status: 'churned',  ltv: 1280.00, orders: 6,  joined: '2024-05-19', lastOrder: '2026-01-18' },
  { id: 'CUS-2853', name: 'Lan Pham',         company: 'Hanoi Bitmap',          email: 'lan@hanoibitmap.vn',       phone: '+84 24 5555 0177',  country: 'Vietnam',        plan: 'Starter',    status: 'active',   ltv: 320.00,  orders: 3,  joined: '2026-02-11', lastOrder: '2026-05-13' },
  { id: 'CUS-2854', name: 'Eitan Bar',        company: 'Refraction Lab',        email: 'eitan@refraction.io',      phone: '+972 3 555 0102',   country: 'Israel',         plan: 'Team',       status: 'active',   ltv: 7110.00, orders: 29, joined: '2023-12-30', lastOrder: '2026-05-17' },
  { id: 'CUS-2855', name: 'Marisol Vega',     company: 'Cactus Creative',       email: 'marisol@cactus.mx',        phone: '+52 55 5555 0188',  country: 'Mexico',         plan: 'Pro',        status: 'active',   ltv: 4520.00, orders: 17, joined: '2024-04-23', lastOrder: '2026-05-08' },
];

const PRODUCTS = [
  { id: 'PRD-DSK-PRO',    sku: 'DSK-PRO',   name: 'Desk Workspace Pro',           type: 'License',      category: 'Templates',  price: 89.00,  status: 'live',    sales: 1842, stock: 'unlimited', updated: '2026-05-14', tint: '#E07A5F', glyph: '◧' },
  { id: 'PRD-LION-ICN',   sku: 'LION-ICN',  name: 'Lion Icon Set — 240 marks',    type: 'Pack',         category: 'Icons',      price: 39.00,  status: 'live',    sales: 3120, stock: 'unlimited', updated: '2026-05-12', tint: '#F2CC8F', glyph: '◆' },
  { id: 'PRD-BOSS-LUT',   sku: 'BOSS-LUT',  name: 'Bossa Color LUT Pack',         type: 'Pack',         category: 'Presets',    price: 24.00,  status: 'live',    sales: 980,  stock: 'unlimited', updated: '2026-05-09', tint: '#3D405B', glyph: '▣' },
  { id: 'PRD-MONO-FNT',   sku: 'MONO-FNT',  name: 'Mono Print — Variable Font',   type: 'License',      category: 'Fonts',      price: 129.00, status: 'live',    sales: 612,  stock: 'unlimited', updated: '2026-05-15', tint: '#4CAE7A', glyph: 'Aa' },
  { id: 'PRD-SLATE-UI',   sku: 'SLATE-UI',  name: 'Slate UI Kit — 1200 screens',  type: 'License',      category: 'Templates',  price: 199.00, status: 'live',    sales: 488,  stock: 'unlimited', updated: '2026-04-30', tint: '#5A88C0', glyph: '▤' },
  { id: 'PRD-DRIFT-PCK',  sku: 'DRIFT-PCK', name: 'Drift Ambient Audio — Pack 04',type: 'Pack',         category: 'Audio',      price: 19.00,  status: 'live',    sales: 2240, stock: 'unlimited', updated: '2026-05-11', tint: '#B85A40', glyph: '◐' },
  { id: 'PRD-WILD-CRS',   sku: 'WILD-CRS',  name: 'Wildcard Brushes — Pro Pack', type: 'Pack',         category: 'Brushes',    price: 29.00,  status: 'live',    sales: 1410, stock: 'unlimited', updated: '2026-05-08', tint: '#7C7AAE', glyph: '✦' },
  { id: 'PRD-NORD-MOC',   sku: 'NORD-MOC',  name: 'Nordic Mockup Bundle',         type: 'Pack',         category: 'Mockups',    price: 49.00,  status: 'draft',   sales: 0,    stock: 'unlimited', updated: '2026-05-16', tint: '#3D405B', glyph: '▥' },
  { id: 'PRD-ANN-SUB',    sku: 'ANN-SUB',   name: 'Annual Pro Membership',        type: 'Subscription', category: 'Membership', price: 240.00, status: 'live',    sales: 312,  stock: 'unlimited', updated: '2026-05-01', tint: '#E07A5F', glyph: '∞' },
  { id: 'PRD-WIRE-KIT',   sku: 'WIRE-KIT',  name: 'Wireframe Starter Kit',        type: 'License',      category: 'Templates',  price: 59.00,  status: 'live',    sales: 720,  stock: 'unlimited', updated: '2026-05-03', tint: '#C09640', glyph: '▦' },
  { id: 'PRD-PIX-VEC',    sku: 'PIX-VEC',   name: 'Pixelmint Vector Library',     type: 'Pack',         category: 'Illustrations', price: 79.00, status: 'live', sales: 540, stock: 'unlimited', updated: '2026-04-28', tint: '#4CAE7A', glyph: '✿' },
  { id: 'PRD-LOOP-MOT',   sku: 'LOOP-MOT',  name: 'Loop Motion Pack — 80 clips',  type: 'Pack',         category: 'Motion',     price: 99.00,  status: 'live',    sales: 264,  stock: 'unlimited', updated: '2026-05-02', tint: '#F2CC8F', glyph: '◌' },
];

function rng(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
function genOrders() {
  const r = rng('orders-v1');
  const channels = ['Web', 'API', 'Affiliate', 'Web', 'Web', 'In-app'];
  const statuses = [
    { s: 'fulfilled', w: 5 },
    { s: 'processing', w: 2 },
    { s: 'pending', w: 1 },
    { s: 'refunded', w: 1 },
    { s: 'cancelled', w: 1 },
  ];
  function pickStatus() {
    const total = statuses.reduce((a,b)=>a+b.w,0);
    let n = r() * total;
    for (const o of statuses) { n -= o.w; if (n <= 0) return o.s; }
    return 'fulfilled';
  }
  const out = [];
  for (let i = 0; i < 60; i++) {
    const customer = CUSTOMERS[Math.floor(r() * CUSTOMERS.length)];
    const itemCount = 1 + Math.floor(r() * 3);
    const items = [];
    let subtotal = 0;
    for (let j = 0; j < itemCount; j++) {
      const p = PRODUCTS[Math.floor(r() * PRODUCTS.length)];
      const qty = 1 + Math.floor(r() * 2);
      items.push({ ...p, qty });
      subtotal += p.price * qty;
    }
    const days = Math.floor(r() * 30);
    const date = new Date(Date.now() - days * 86400000 - Math.floor(r() * 86400000));
    out.push({
      id: 'ORD-' + (10000 + 60 - i).toString(),
      customerId: customer.id,
      customer,
      accountId: null,  // filled in after ACCOUNTS is defined (below)
      items,
      subtotal,
      tax: subtotal * 0.08,
      total: subtotal * 1.08,
      status: pickStatus(),
      channel: channels[Math.floor(r() * channels.length)],
      date: date.toISOString(),
    });
  }
  return out.sort((a, b) => new Date(b.date) - new Date(a.date));
}
const ORDERS = genOrders();

function genTransactions() {
  const r = rng('tx-v1');
  const methods = [
    { m: 'Visa •••• 4242', icon: 'card' },
    { m: 'Mastercard •••• 1112', icon: 'card' },
    { m: 'Amex •••• 0005', icon: 'card' },
    { m: 'PayPal', icon: 'paypal' },
    { m: 'ACH Transfer', icon: 'bank' },
    { m: 'Apple Pay', icon: 'apple' },
  ];
  const statuses = [
    { s: 'succeeded', w: 7 },
    { s: 'pending', w: 1 },
    { s: 'refunded', w: 1 },
    { s: 'failed', w: 1 },
  ];
  function pickStatus() {
    const t = statuses.reduce((a,b)=>a+b.w,0);
    let n = r() * t;
    for (const o of statuses) { n -= o.w; if (n <= 0) return o.s; }
    return 'succeeded';
  }
  const out = [];
  for (let i = 0; i < 80; i++) {
    const order = ORDERS[i % ORDERS.length];
    const method = methods[Math.floor(r() * methods.length)];
    const status = pickStatus();
    const days = Math.floor(r() * 30);
    const date = new Date(Date.now() - days * 86400000 - Math.floor(r() * 86400000));
    out.push({
      id: 'TXN-' + (200000 + 80 - i).toString(),
      orderId: order.id,
      customer: order.customer,
      method: method.m,
      methodIcon: method.icon,
      amount: order.total,
      status,
      fee: Math.round((order.total * 0.029 + 0.30) * 100) / 100,
      net: Math.round((order.total - (order.total * 0.029 + 0.30)) * 100) / 100,
      date: date.toISOString(),
    });
  }
  return out.sort((a, b) => new Date(b.date) - new Date(a.date));
}
const TRANSACTIONS = genTransactions();

// dashboard sparkline data (last 14 days revenue, normalized 0-1)
const REVENUE_14 = [0.42, 0.48, 0.55, 0.51, 0.60, 0.67, 0.59, 0.72, 0.78, 0.71, 0.83, 0.79, 0.88, 0.95];
const WEEKDAY_LABELS = ['M','T','W','T','F','S','S','M','T','W','T','F','S','S'];

const ADMIN = {
  name: 'Asha Karim',
  role: 'Owner & Admin',
  email: 'asha@erp-lite.app',
  phone: '+1 (646) 555-0117',
  timezone: 'America/New_York',
  joined: '2023-06-01',
  twoFactor: true,
};

/* ---------- ACCOUNTS ----------
   An Account is a workspace/billing entity owned by a Customer.
   - "primary"   = master billing account (has its own plan)
   - "secondary" = child workspace attached to a primary (inherits billing)
   One Customer can own multiple Accounts; a Primary can have many Secondaries.
   Products are purchased *under* an Account, not directly by a Customer.
*/
const ACCOUNTS = [
  // Lumen Studios — Aria Okafor
  { id: 'ACC-1001', name: 'Lumen Studios HQ',         type: 'primary',   parentId: null,       ownerId: 'CUS-2841', plan: 'Pro Annual',   status: 'active',   billingEmail: 'billing@lumen.studio',  region: 'United States',  created: '2024-03-12', products: 8,  seats: 4,  mrr: 199.00, lastActivity: '2026-05-17' },
  { id: 'ACC-1002', name: 'Lumen — Brand Studio',     type: 'secondary', parentId: 'ACC-1001', ownerId: 'CUS-2841', plan: 'Inherited',    status: 'active',   billingEmail: null,                     region: 'United States',  created: '2024-04-02', products: 3,  seats: 2,  mrr: 0,      lastActivity: '2026-05-15' },
  { id: 'ACC-1003', name: 'Lumen — Motion Lab',       type: 'secondary', parentId: 'ACC-1001', ownerId: 'CUS-2841', plan: 'Inherited',    status: 'active',   billingEmail: null,                     region: 'United States',  created: '2024-05-18', products: 2,  seats: 1,  mrr: 0,      lastActivity: '2026-05-12' },

  // Drift Audio — Mateo Rivera (biggest)
  { id: 'ACC-1010', name: 'Drift Audio Co.',          type: 'primary',   parentId: null,       ownerId: 'CUS-2842', plan: 'Team Annual',  status: 'active',   billingEmail: 'finance@driftaudio.co', region: 'United States',  created: '2023-11-04', products: 18, seats: 12, mrr: 480.00, lastActivity: '2026-05-17' },
  { id: 'ACC-1011', name: 'Drift — Sync Library',     type: 'secondary', parentId: 'ACC-1010', ownerId: 'CUS-2842', plan: 'Inherited',    status: 'active',   billingEmail: null,                     region: 'United States',  created: '2024-01-20', products: 6,  seats: 4,  mrr: 0,      lastActivity: '2026-05-16' },
  { id: 'ACC-1012', name: 'Drift — Spatial Audio',    type: 'secondary', parentId: 'ACC-1010', ownerId: 'CUS-2842', plan: 'Inherited',    status: 'active',   billingEmail: null,                     region: 'United States',  created: '2024-08-12', products: 4,  seats: 3,  mrr: 0,      lastActivity: '2026-05-14' },
  { id: 'ACC-1013', name: 'Drift — Game Audio',       type: 'secondary', parentId: 'ACC-1010', ownerId: 'CUS-2842', plan: 'Inherited',    status: 'trial',    billingEmail: null,                     region: 'United States',  created: '2026-04-30', products: 1,  seats: 1,  mrr: 0,      lastActivity: '2026-05-10' },

  // Wildcard
  { id: 'ACC-1020', name: 'Wildcard Type',            type: 'primary',   parentId: null,       ownerId: 'CUS-2843', plan: 'Pro Annual',   status: 'active',   billingEmail: 'billing@wildcardtype.com', region: 'United Kingdom', created: '2024-01-20', products: 6, seats: 3, mrr: 99.00, lastActivity: '2026-05-12' },
  { id: 'ACC-1021', name: 'Wildcard — Editorial',     type: 'secondary', parentId: 'ACC-1020', ownerId: 'CUS-2843', plan: 'Inherited',    status: 'active',   billingEmail: null,                     region: 'United Kingdom', created: '2024-06-09', products: 2, seats: 1, mrr: 0,    lastActivity: '2026-05-11' },

  // Pixelmint (largest team)
  { id: 'ACC-1030', name: 'Pixelmint Studio',         type: 'primary',   parentId: null,       ownerId: 'CUS-2846', plan: 'Team Annual',  status: 'active',   billingEmail: 'finance@pixelmint.se',   region: 'Sweden',         created: '2023-07-22', products: 22, seats: 18, mrr: 540.00, lastActivity: '2026-05-17' },
  { id: 'ACC-1031', name: 'Pixelmint — Marketing',    type: 'secondary', parentId: 'ACC-1030', ownerId: 'CUS-2846', plan: 'Inherited',    status: 'active',   billingEmail: null,                     region: 'Sweden',         created: '2023-09-10', products: 7,  seats: 6,  mrr: 0,      lastActivity: '2026-05-17' },
  { id: 'ACC-1032', name: 'Pixelmint — Product',      type: 'secondary', parentId: 'ACC-1030', ownerId: 'CUS-2846', plan: 'Inherited',    status: 'active',   billingEmail: null,                     region: 'Sweden',         created: '2023-11-04', products: 8,  seats: 7,  mrr: 0,      lastActivity: '2026-05-16' },
  { id: 'ACC-1033', name: 'Pixelmint — R&D Lab',      type: 'secondary', parentId: 'ACC-1030', ownerId: 'CUS-2846', plan: 'Inherited',    status: 'suspended',billingEmail: null,                     region: 'Sweden',         created: '2024-02-22', products: 2,  seats: 1,  mrr: 0,      lastActivity: '2026-04-22' },

  // Maison de Vecteur
  { id: 'ACC-1040', name: 'Maison de Vecteur',        type: 'primary',   parentId: null,       ownerId: 'CUS-2850', plan: 'Team Annual',  status: 'active',   billingEmail: 'finance@mvecteur.fr',    region: 'France',         created: '2023-09-18', products: 14, seats: 9, mrr: 320.00, lastActivity: '2026-05-14' },
  { id: 'ACC-1041', name: 'Maison — Atelier Paris',   type: 'secondary', parentId: 'ACC-1040', ownerId: 'CUS-2850', plan: 'Inherited',    status: 'active',   billingEmail: null,                     region: 'France',         created: '2024-01-15', products: 5, seats: 4, mrr: 0,    lastActivity: '2026-05-13' },

  // Slate & Co. — past due
  { id: 'ACC-1050', name: 'Slate & Co.',              type: 'primary',   parentId: null,       ownerId: 'CUS-2847', plan: 'Pro Monthly',  status: 'past_due', billingEmail: 'admin@slate.co',         region: 'Russia',         created: '2024-10-30', products: 4, seats: 2, mrr: 49.00, lastActivity: '2026-04-22' },

  // Standalones (primary, no children)
  { id: 'ACC-1060', name: 'Atlas Templates',          type: 'primary',   parentId: null,       ownerId: 'CUS-2845', plan: 'Pro Monthly',  status: 'active',   billingEmail: 'yusuf@atlas.tpl',         region: 'Turkey',         created: '2024-08-09', products: 5,  seats: 2, mrr: 39.00,  lastActivity: '2026-05-11' },
  { id: 'ACC-1070', name: 'Refraction Lab',           type: 'primary',   parentId: null,       ownerId: 'CUS-2854', plan: 'Team Monthly', status: 'active',   billingEmail: 'finance@refraction.io',   region: 'Israel',         created: '2023-12-30', products: 11, seats: 8, mrr: 240.00, lastActivity: '2026-05-17' },
  { id: 'ACC-1080', name: 'Honeybox Studio',          type: 'primary',   parentId: null,       ownerId: 'CUS-2848', plan: 'Pro Annual',   status: 'active',   billingEmail: 'naledi@honeybox.co.za',  region: 'South Africa',   created: '2024-02-14', products: 7,  seats: 3, mrr: 99.00,  lastActivity: '2026-05-09' },
  { id: 'ACC-1090', name: 'Bossa Sound',              type: 'primary',   parentId: null,       ownerId: 'CUS-2851', plan: 'Pro Monthly',  status: 'active',   billingEmail: 'bea@bossasound.com.br',  region: 'Brazil',         created: '2024-06-07', products: 6,  seats: 3, mrr: 49.00,  lastActivity: '2026-05-10' },
  { id: 'ACC-1100', name: 'Cactus Creative',          type: 'primary',   parentId: null,       ownerId: 'CUS-2855', plan: 'Pro Annual',   status: 'active',   billingEmail: 'marisol@cactus.mx',      region: 'Mexico',         created: '2024-04-23', products: 9,  seats: 4, mrr: 99.00,  lastActivity: '2026-05-08' },
];

// Helpers
function getAccount(id) { return ACCOUNTS.find(a => a.id === id); }
function getCustomer(id) { return CUSTOMERS.find(c => c.id === id); }
function getChildren(id) { return ACCOUNTS.filter(a => a.parentId === id); }
function getPrimaryAccounts() { return ACCOUNTS.filter(a => a.type === 'primary'); }
function productsForAccount(account) {
  // Deterministic-ish: pick N products based on the account's stored `products` count.
  const r = rng('prod-' + account.id);
  const list = [...PRODUCTS];
  const out = [];
  for (let i = 0; i < Math.min(account.products, PRODUCTS.length); i++) {
    const idx = Math.floor(r() * list.length);
    const p = list.splice(idx, 1)[0];
    out.push({ ...p, purchasedAt: new Date(new Date(account.created).getTime() + i * 7 * 86400000).toISOString() });
  }
  return out;
}
// Backfill accountId on every order — pick a deterministic primary or secondary account
// owned by the order's customer.
ORDERS.forEach((o, i) => {
  const ownedPrimaries = ACCOUNTS.filter(a => a.ownerId === o.customerId);
  if (ownedPrimaries.length === 0) {
    o.accountId = ACCOUNTS[0].id;
  } else {
    o.accountId = ownedPrimaries[i % ownedPrimaries.length].id;
  }
});

// =============================================================
// LEDGER TRANSACTIONS — vouchers, redemptions, ping in/out, corrections.
// Different from financial Payments (card processing).
// =============================================================
const LEDGER_TYPES = ['redemption', 'buy_back', 'ping_in', 'ping_out', 'correction'];
const LEDGER_PLACES = [
  'Web checkout',
  'POS · HQ',
  'POS · Storefront',
  'API · partner sync',
  'Admin console',
  'Mobile app',
];

function genLedger() {
  const r = rng('ledger-v3');
  const out = [];
  function pickType() {
    // weighted: redemption most common, correction rare
    const weights = [
      ['redemption', 5],
      ['buy_back', 1],
      ['ping_in', 3],
      ['ping_out', 2],
      ['correction', 1],
    ];
    const total = weights.reduce((a, b) => a + b[1], 0);
    let n = r() * total;
    for (const [t, w] of weights) { n -= w; if (n <= 0) return t; }
    return 'redemption';
  }
  for (let i = 0; i < 80; i++) {
    const account = ACCOUNTS[Math.floor(r() * ACCOUNTS.length)];
    const owner = ACCOUNTS.find(a => a.id === account.id);
    const type = pickType();
    // value sign by type:
    // redemption  → spend voucher credit (negative for account balance)
    // buy_back    → reverse a redemption (positive)
    // ping_in     → credit added (positive)
    // ping_out    → credit transferred out (negative)
    // correction  → +/-
    const magnitude = Math.round((5 + r() * 295) * 100) / 100;
    let value;
    if (type === 'redemption' || type === 'ping_out') value = -magnitude;
    else if (type === 'buy_back' || type === 'ping_in') value = magnitude;
    else value = (r() > 0.5 ? 1 : -1) * magnitude;

    const days = Math.floor(r() * 45);
    const date = new Date(Date.now() - days * 86400000 - Math.floor(r() * 86400000));
    // ~40% of ledger entries link to a real order from the same customer
    let orderId = null;
    if ((type === 'redemption' || type === 'buy_back') && r() < 0.55) {
      const candidate = ORDERS.find(o => o.accountId === account.id);
      if (candidate) orderId = candidate.id;
    }

    const voucherChars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let voucher = null;
    if (type === 'redemption' || type === 'buy_back') {
      // ~25% of voucher-bearing ledger entries reference a named VIP/promo code
      if (r() < 0.25) {
        const vipPromos = ['VIP100','VIPGOLD','VIPSTUDIO','SUMMER25','BLACKFRIDAY','LAUNCH25','REFER50','WELCOME10'];
        voucher = vipPromos[Math.floor(r() * vipPromos.length)];
      } else {
        voucher = 'V-';
        for (let k = 0; k < 6; k++) voucher += voucherChars[Math.floor(r() * voucherChars.length)];
      }
    }
    out.push({
      id: 'LDG-' + (500000 + 80 - i).toString(),
      accountId: account.id,
      orderId,
      type,
      place: LEDGER_PLACES[Math.floor(r() * LEDGER_PLACES.length)],
      voucher,
      date: date.toISOString(),
      value,
      currency: 'USD',
      operator: r() > 0.5 ? 'Asha Karim' : 'System',
      note: type === 'correction' ? 'Manual adjustment — see ticket #' + (4000 + Math.floor(r() * 999)) : null,
    });
  }
  return out.sort((a, b) => new Date(b.date) - new Date(a.date));
}
const LEDGER = genLedger();

function ledgerForAccount(id) { return LEDGER.filter(l => l.accountId === id); }
function ledgerForOrder(id)   { return LEDGER.filter(l => l.orderId === id); }
function paymentsForOrder(id) { return TRANSACTIONS.filter(t => t.orderId === id); }
function getOrder(id)         { return ORDERS.find(o => o.id === id); }
function getLedger(id)        { return LEDGER.find(l => l.id === id); }

const LEDGER_TYPE_META = {
  redemption: { label: 'Redemption', tone: 'info',    sign: 'neg', icon: 'tag' },
  buy_back:   { label: 'Buy Back',   tone: 'warning', sign: 'pos', icon: 'refresh' },
  ping_in:    { label: 'Ping In',    tone: 'success', sign: 'pos', icon: 'arrow-down' },
  ping_out:   { label: 'Ping Out',   tone: 'danger',  sign: 'neg', icon: 'arrow-up' },
  correction: { label: 'Correction', tone: 'ghost',   sign: 'any', icon: 'edit' },
};

// =============================================================
// VOUCHERS — issued to each account, with remaining balance.
// "Available voucher" = sum of remaining; "Total" = sum of issued.
// =============================================================
function genVouchers() {
  const r = rng('vouchers-v1');
  const out = [];
  const voucherChars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  ACCOUNTS.forEach(acc => {
    const count = 2 + Math.floor(r() * 5); // 2-6 vouchers per account
    for (let i = 0; i < count; i++) {
      const issued = Math.round((25 + r() * 475) * 100) / 100;
      let remaining;
      const fortune = r();
      if (fortune > 0.7) remaining = issued;                        // untouched
      else if (fortune > 0.35) remaining = Math.round(issued * r() * 100) / 100; // partially redeemed
      else remaining = 0;                                            // fully redeemed
      const expiresIn = 30 + Math.floor(r() * 365);
      const issuedDaysAgo = 10 + Math.floor(r() * 400);
      let code = 'V-';
      for (let k = 0; k < 6; k++) code += voucherChars[Math.floor(r() * voucherChars.length)];
      // a few "named" promo vouchers for searchability
      const namedPromos = ['SUMMER25','BLACKFRIDAY','WELCOME10','REFER50','VIP100','VIPGOLD','VIPSTUDIO','LAUNCH25'];
      if (r() > 0.7) code = namedPromos[Math.floor(r() * namedPromos.length)];
      const status = remaining === 0 ? 'redeemed' : (Date.now() - issuedDaysAgo * 86400000 > expiresIn * 86400000 ? 'expired' : 'active');
      out.push({
        id: 'VCH-' + (700000 + out.length).toString(),
        accountId: acc.id,
        code,
        issued,
        remaining: status === 'expired' ? 0 : remaining,
        status,
        currency: 'USD',
        issuedAt: new Date(Date.now() - issuedDaysAgo * 86400000).toISOString(),
        expiresAt: new Date(Date.now() + expiresIn * 86400000).toISOString(),
      });
    }
  });
  return out;
}
const VOUCHERS = genVouchers();
function vouchersForAccount(id) { return VOUCHERS.filter(v => v.accountId === id); }
function isVipVoucher(code) { return !!code && /^VIP/i.test(code); }
function voucherBalance(id) {
  const list = vouchersForAccount(id);
  return {
    available: list.filter(v => v.status === 'active').reduce((s, v) => s + v.remaining, 0),
    total:     list.reduce((s, v) => s + v.issued, 0),
    redeemed:  list.reduce((s, v) => s + (v.issued - v.remaining), 0),
    count:     list.length,
    activeCount: list.filter(v => v.status === 'active').length,
  };
}

// =============================================================
// EMAILS — synced from external mailbox via API.
// =============================================================
function genEmails() {
  const r = rng('emails-v1');
  const subjects = [
    'License key delivery for {product}',
    'Re: Question about commercial usage',
    'Your refund has been issued',
    'Payment failed on {order}',
    'New seat invitation — please confirm',
    'Welcome to ERP Lite',
    '[Action required] Verify your billing email',
    'Re: Custom enterprise pricing',
    'Your invoice for {month} is ready',
    'Bulk download link (expires in 24h)',
    'Account approaching seat limit',
    'Receipt for your purchase',
    'Re: Can we get an extension on the trial?',
    'New product release: {product}',
    'Voucher SUMMER25 was just redeemed',
  ];
  const senders = [
    { name: 'Payments Service',     email: 'notify@payments.app' },
    { name: 'Mailer Service',       email: 'mail@mailer.app' },
    { name: 'ERP Lite System',      email: 'system@erp-lite.app' },
    { name: 'Customer Support',     email: 'support@erp-lite.app' },
    { name: 'Aria Okafor',          email: 'aria@lumen.studio' },
    { name: 'Mateo Rivera',         email: 'mateo@driftaudio.co' },
    { name: 'Sofie Lindqvist',      email: 'sofie@pixelmint.se' },
    { name: 'Imani Chen',           email: 'imani@wildcardtype.com' },
    { name: 'Yusuf Demir',          email: 'yusuf@atlas.tpl' },
    { name: 'Naledi Mokoena',       email: 'naledi@honeybox.co.za' },
  ];
  const previews = [
    'Hi team — quick question about the bundle license we purchased last week. We need to clarify whether we can use it across our three studios under the same parent account, or if we need separate licenses for each.',
    'Your charge of $128.40 was declined. Please update your payment method to avoid any service interruption. The retry will happen automatically in 24 hours.',
    'Attached you will find the license key for your purchase. Please keep this email for your records — re-downloads are available from your account dashboard at any time.',
    'Thank you for reaching out. We have processed your refund of $99.00 back to the original payment method. Funds typically take 3-5 business days to appear.',
    'We noticed that your team is currently using 17 of the 18 seats included in your plan. To add more seats, upgrade your subscription from the Profile → Billing tab.',
    'A new seat invitation has been sent to your inbox. Please click the link below within 48 hours to accept and join the workspace.',
    'Just a heads up: your trial ends on May 24, 2026. Convert before that date to keep your data, custom integrations, and 14 active vouchers.',
    'Following up on our chat yesterday — we put together a custom enterprise quote for you. Let us know a good time to walk through the details together.',
    'Your monthly invoice is now ready. Total: $480.00. The PDF is attached for your finance team. Auto-charge will occur on the 1st as usual.',
    'New product release: Mono Print — Variable Font v2 is now live. As a Team subscriber, this is included at no extra cost. Download from the catalog.',
  ];
  const out = [];
  const baseTs = Date.now();
  for (let i = 0; i < 36; i++) {
    const acc = ACCOUNTS[Math.floor(r() * ACCOUNTS.length)];
    const sender = senders[Math.floor(r() * senders.length)];
    const ago = i * 90 * 60_000 + Math.floor(r() * 60 * 60_000);
    let subject = subjects[Math.floor(r() * subjects.length)];
    subject = subject
      .replace('{product}', PRODUCTS[Math.floor(r() * PRODUCTS.length)].name)
      .replace('{order}', 'ORD-' + (10010 + Math.floor(r() * 50)))
      .replace('{month}', new Date(baseTs - ago).toLocaleDateString('en-US', { month: 'long' }));
    out.push({
      id: 'EML-' + (900000 + i).toString(),
      accountId: acc.id,
      from: sender,
      subject,
      preview: previews[Math.floor(r() * previews.length)],
      receivedAt: new Date(baseTs - ago).toISOString(),
      unread: r() < 0.4,
      starred: r() < 0.18,
      hasAttachment: r() < 0.3,
      labels: r() < 0.4 ? ['Billing'] : r() < 0.3 ? ['Support'] : r() < 0.2 ? ['System'] : [],
    });
  }
  return out.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
}
const EMAILS = genEmails();
function emailsForAccount(id) { return EMAILS.filter(e => e.accountId === id); }

Object.assign(window, {
  CUSTOMERS, PRODUCTS, ORDERS, TRANSACTIONS, REVENUE_14, WEEKDAY_LABELS, ADMIN,
  ACCOUNTS, getAccount, getCustomer, getChildren, getPrimaryAccounts, productsForAccount,
  LEDGER, LEDGER_TYPES, LEDGER_PLACES, LEDGER_TYPE_META,
  ledgerForAccount, ledgerForOrder, paymentsForOrder, getOrder, getLedger,
  VOUCHERS, vouchersForAccount, voucherBalance, isVipVoucher,
  EMAILS, emailsForAccount,
  hashColor, initials, fmtMoney, fmtDate, relDate, palette,
});
