/* ============================================================
   App pages — Dashboard, Customers, Customer detail,
                Orders, Products, Transactions, Profile
   ============================================================ */

/* =================== DASHBOARD =================== */
function DashboardPage({ onNavigate }) {
  const totalRevenue = TRANSACTIONS
    .filter(t => t.status === 'succeeded')
    .slice(0, 30)
    .reduce((sum, t) => sum + t.amount, 0);

  const activeCustomers = CUSTOMERS.filter(c => c.status === 'active').length;
  const ordersToday = ORDERS.filter(o => {
    const d = new Date(o.date);
    return d.toDateString() === new Date().toDateString();
  }).length;
  const aov = totalRevenue / 30;

  const sparkA = [40,52,48,61,55,67,72,68,78,82,79,88,84,93];
  const sparkB = [62,58,65,60,55,57,52,49,53,48,46,44,42,40];
  const sparkC = [10,14,12,16,18,15,20,22,19,24,28,30,33,38];

  return (
    <div data-screen-label="Dashboard">
      <div className="page-head">
        <div>
          <h1 className="page-title">Welcome back, Asha 👋</h1>
          <p className="page-sub">Here's the pulse of your store for the last 30 days.</p>
        </div>
        <div className="page-actions">
          <Segmented value="30d" onChange={()=>{}} options={[{value:'7d',label:'7d'},{value:'30d',label:'30d'},{value:'90d',label:'90d'}]} />
          <Button variant="secondary" icon="download">Export</Button>
        </div>
      </div>

      <div className="kpi-row" style={{ marginBottom: 20 }}>
        <KPI label="Revenue"        value={fmtMoney(totalRevenue)} delta="+12.4%" deltaDir="up"   spark={sparkA} />
        <KPI label="Orders"         value={ORDERS.length}        delta="+8.1%"  deltaDir="up"   spark={sparkC} />
        <KPI label="Active customers" value={activeCustomers}     delta="+3"     deltaDir="up"   spark={sparkA} />
        <KPI label="Refund rate"    value="1.2%"                 delta="-0.3pp" deltaDir="up"   spark={sparkB} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }} className="dash-row">
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600 }}>REVENUE</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>{fmtMoney(totalRevenue)}</div>
              <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>↑ 12.4% vs prior 14 days</div>
            </div>
            <Segmented value="rev" onChange={()=>{}} options={[{value:'rev',label:'Revenue'},{value:'ord',label:'Orders'}]} />
          </div>
          <div className="bars">
            {REVENUE_14.map((v, i) => (
              <div key={i} className={'bar' + (i < 7 ? ' muted' : '')} style={{ height: `${v * 100}%` }} title={`Day ${i+1}: ${fmtMoney(v * 1200)}`}>
              </div>
            ))}
          </div>
          <div className="bars-labels">
            {WEEKDAY_LABELS.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-head">
            <h3>Top products</h3>
            <span className="head-sub" style={{ marginLeft: 'auto' }}>last 30 days</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {PRODUCTS.slice(0, 5).sort((a,b) => b.sales - a.sales).map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: p.tint, color: 'white', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.glyph}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.sales.toLocaleString()} sales</div>
                </div>
                <div className="mono" style={{ fontWeight: 600, fontSize: 13 }}>{fmtMoney(p.price * p.sales / 100)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@media (max-width: 1000px) { .dash-row { grid-template-columns: 1fr !important; } }` }} />

      <div className="card mt-20">
        <div className="card-head">
          <h3>Recent orders</h3>
          <span className="head-sub" style={{ marginLeft: 'auto' }}>Showing 6 of {ORDERS.length}</span>
          <button className="btn ghost sm" onClick={() => onNavigate('orders')}>View all<Icon name="arrow-right" size={14} /></button>
        </div>
        <div className="table-scroll">
          <table className="t">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th className="txt-right">Total</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.slice(0, 6).map(o => (
                <tr key={o.id} onClick={() => onNavigate('order-detail', o.id)}>
                  <td className="mono fw-600">{o.id}</td>
                  <td>
                    <div className="cell-customer">
                      <Avatar name={o.customer.name} size="sm" />
                      <div className="cell-stack">
                        <span className="fw-600">{o.customer.name}</span>
                        <span className="cell-sub">{o.customer.company}</span>
                      </div>
                    </div>
                  </td>
                  <td>{o.items.length} item{o.items.length>1?'s':''}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="txt-right mono fw-700">{fmtMoney(o.total)}</td>
                  <td className="text-3 fs-13">{relDate(o.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, delta, deltaDir, spark }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className={'kpi-delta ' + (deltaDir === 'up' ? 'up' : deltaDir === 'down' ? 'down' : '')}>
        <Icon name={deltaDir === 'up' ? 'arrow-up' : 'arrow-down'} size={12} />
        {delta} <span className="text-3" style={{ marginLeft: 4 }}>vs prev period</span>
      </div>
      {spark && (
        <div className="kpi-spark">
          <Sparkline values={spark} width={120} height={40} color="var(--brand)" />
        </div>
      )}
    </div>
  );
}

/* =================== CUSTOMERS LIST =================== */
function CustomersPage({ onNavigate, addToast }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [planFilter, setPlanFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('ltv');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  let filtered = CUSTOMERS.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (planFilter !== 'all' && c.plan !== planFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (c.name + c.company + c.email + c.country + c.id).toLowerCase().includes(s);
  });
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'ltv') return b.ltv - a.ltv;
    if (sortBy === 'orders') return b.orders - a.orders;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'recent') return new Date(b.lastOrder || 0) - new Date(a.lastOrder || 0);
    return 0;
  });

  React.useEffect(() => { setPage(1); }, [search, statusFilter, planFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div data-screen-label="Customers list">
      <div className="page-head">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-sub">{filtered.length} of {CUSTOMERS.length} customers</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" icon="upload">Import</Button>
          <Button icon="plus" onClick={() => setShowAddModal(true)}>Add customer</Button>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="input-with-icon" style={{ flex: 1, minWidth: 200, maxWidth: 360 }}>
            <span className="input-icon"><Icon name="search" size={16} /></span>
            <input className="input" placeholder="Search by name, email, ID, company…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="select" style={{ width: 'auto', height: 36 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="past_due">Past due</option>
            <option value="churned">Churned</option>
          </select>
          <select className="select" style={{ width: 'auto', height: 36 }} value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
            <option value="all">All plans</option>
            <option value="Starter">Starter</option>
            <option value="Pro">Pro</option>
            <option value="Team">Team</option>
          </select>
          <select className="select" style={{ width: 'auto', height: 36 }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="ltv">Sort: Lifetime value</option>
            <option value="orders">Sort: Orders</option>
            <option value="recent">Sort: Recent activity</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }} className="hide-mobile">
            <Button variant="ghost" size="sm" icon="filter">More filters</Button>
            <Button variant="ghost" size="sm" icon="download">Export</Button>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <div className="empty">
            <Icon name="search" size={28} />
            <h4>No customers match those filters</h4>
            <p>Try clearing search or status filters to see more.</p>
            <Button variant="secondary" onClick={() => { setSearch(''); setStatusFilter('all'); setPlanFilter('all'); }}>Reset filters</Button>
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table className="t">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Country</th>
                    <th className="txt-right">Lifetime value</th>
                    <th className="txt-right">Orders</th>
                    <th>Last order</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(c => (
                    <tr key={c.id} onClick={() => onNavigate('customer-detail', c.id)}>
                      <td>
                        <div className="cell-customer">
                          <Avatar name={c.name} />
                          <div className="cell-stack">
                            <span className="fw-600">{c.name}</span>
                            <span className="cell-sub">{c.company} · <span className="mono">{c.id}</span></span>
                          </div>
                        </div>
                      </td>
                      <td><Badge tone={c.plan === 'Team' ? 'brand' : c.plan === 'Pro' ? 'info' : 'ghost'}>{c.plan}</Badge></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="text-2 fs-13">{c.country}</td>
                      <td className="txt-right mono fw-700">{fmtMoney(c.ltv)}</td>
                      <td className="txt-right mono">{c.orders}</td>
                      <td className="text-3 fs-13">{c.lastOrder ? relDate(c.lastOrder) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span>Showing <strong style={{ color: 'var(--text)' }}>{(page-1)*perPage+1}</strong>–<strong style={{ color: 'var(--text)' }}>{Math.min(page*perPage, filtered.length)}</strong> of {filtered.length}</span>
              <div className="pages">
                <button className="pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><Icon name="chevron-left" size={14} /></button>
                {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
                  <button key={i} className={'pg-btn' + (page === i + 1 ? ' active' : '')} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><Icon name="chevron-right" size={14} /></button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddCustomerModal open={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={(name) => {
        setShowAddModal(false);
        addToast?.({ msg: `Customer "${name}" created`, tone: 'success' });
      }} />
    </div>
  );
}

function AddCustomerModal({ open, onClose, onSubmit }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [plan, setPlan] = React.useState('Pro');
  React.useEffect(() => { if (!open) { setName(''); setEmail(''); setCompany(''); setPlan('Pro'); } }, [open]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add customer"
      foot={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => name && email && onSubmit?.(name)} disabled={!name || !email}>Create customer</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" /></Field>
        <Field label="Email"><Input type="email" icon="mail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" /></Field>
        <Field label="Company"><Input icon="building" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." /></Field>
        <Field label="Plan">
          <select className="select" value={plan} onChange={(e) => setPlan(e.target.value)}>
            <option>Starter</option>
            <option>Pro</option>
            <option>Team</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}

/* =================== CUSTOMER DETAIL =================== */
function CustomerDetailPage({ customerId, onNavigate, addToast }) {
  const c = CUSTOMERS.find(x => x.id === customerId) || CUSTOMERS[0];
  const [tab, setTab] = React.useState('overview');
  const orders = ORDERS.filter(o => o.customerId === c.id);

  return (
    <div data-screen-label="Customer detail">
      <div className="breadcrumb">
        <a href="#customers" onClick={(e)=>{e.preventDefault(); onNavigate('customers');}}>Customers</a>
        <span className="sep">/</span>
        <span>{c.name}</span>
      </div>

      <div className="page-head" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar name={c.name} size="lg" />
          <div>
            <h1 className="page-title">{c.name}</h1>
            <p className="page-sub">{c.company} · <span className="mono">{c.id}</span> · joined {fmtDate(c.joined)}</p>
          </div>
        </div>
        <div className="page-actions">
          <Button variant="secondary" icon="mail">Email</Button>
          <Button variant="secondary" icon="edit">Edit</Button>
          <Button icon="plus">New order</Button>
        </div>
      </div>

      <div className="kpi-row" style={{ marginBottom: 20 }}>
        <KPI label="Lifetime value" value={fmtMoney(c.ltv)} delta="+8% YoY" deltaDir="up" />
        <KPI label="Total orders"   value={c.orders}        delta="+2 this mo" deltaDir="up" />
        <KPI label="Avg. order"     value={c.orders ? fmtMoney(c.ltv / c.orders) : '$0.00'} delta="—" />
        <KPI label="Status"         value={<span style={{ fontSize: 18 }}><StatusBadge status={c.status} /></span>} delta="Plan: " />
      </div>

      <div className="detail-grid">
        <div>
          <div className="tabbar">
            {[
              { id: 'overview',  label: 'Overview' },
              { id: 'orders',    label: `Orders (${orders.length})` },
              { id: 'invoices',  label: 'Invoices' },
              { id: 'activity',  label: 'Activity' },
              { id: 'notes',     label: 'Notes' },
            ].map(t => (
              <button key={t.id} className={'tab' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="card card-pad">
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>Customer details</h3>
              <div className="def-list">
                <div><div className="dl-label">Customer ID</div><div className="dl-value mono">{c.id}</div></div>
                <div><div className="dl-label">Plan</div><div className="dl-value">{c.plan}</div></div>
                <div><div className="dl-label">Email</div><div className="dl-value">{c.email}</div></div>
                <div><div className="dl-label">Phone</div><div className="dl-value">{c.phone}</div></div>
                <div><div className="dl-label">Country</div><div className="dl-value">{c.country}</div></div>
                <div><div className="dl-label">Last order</div><div className="dl-value">{c.lastOrder ? fmtDate(c.lastOrder) : '—'}</div></div>
                <div><div className="dl-label">Joined</div><div className="dl-value">{fmtDate(c.joined)}</div></div>
                <div><div className="dl-label">Status</div><div className="dl-value"><StatusBadge status={c.status} /></div></div>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="card">
              <div className="table-scroll">
                <table className="t">
                  <thead><tr><th>Order</th><th>Items</th><th>Status</th><th className="txt-right">Total</th><th>Date</th></tr></thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="5"><div className="empty"><h4>No orders yet</h4><p>When this customer places an order, it'll appear here.</p></div></td></tr>
                    ) : orders.map(o => (
                      <tr key={o.id}>
                        <td className="mono fw-600">{o.id}</td>
                        <td>{o.items.length} item{o.items.length>1?'s':''}</td>
                        <td><StatusBadge status={o.status} /></td>
                        <td className="txt-right mono fw-700">{fmtMoney(o.total)}</td>
                        <td className="text-3 fs-13">{fmtDate(o.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'invoices' && (
            <div className="card">
              <div className="empty">
                <Icon name="card" size={28} />
                <h4>All invoices paid</h4>
                <p>No outstanding invoices. Past invoices are kept for 7 years.</p>
                <Button variant="secondary" icon="download">Download history</Button>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="card card-pad">
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>Recent activity</h3>
              <ActivityFeed />
            </div>
          )}

          {tab === 'notes' && (
            <div className="card card-pad">
              <Field label="Internal note (only your team sees this)">
                <textarea className="textarea" defaultValue="Asked for invoicing in EUR — re-check on next renewal."></textarea>
              </Field>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Button>Save note</Button>
                <Button variant="ghost">Discard</Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Quick actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              <Button variant="secondary" icon="mail" block>Send email</Button>
              <Button variant="secondary" icon="card" block>Charge customer</Button>
              <Button variant="secondary" icon="refresh" block>Issue refund</Button>
              <Button variant="ghost" icon="trash" block onClick={() => addToast?.({ msg: 'Customer archived', tone: 'success' })}>Archive customer</Button>
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Badge tone="brand">VIP</Badge>
              <Badge tone="info">Newsletter</Badge>
              <Badge tone="ghost">EU</Badge>
              <button className="badge ghost" style={{ border: '1px dashed var(--border-strong)', background: 'transparent', cursor: 'pointer' }}>
                <Icon name="plus" size={11} /> Add tag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const events = [
    { icon: 'orders', tone: '#E07A5F', label: 'Placed order',           detail: 'ORD-10060 · $128.40',         when: '2h ago' },
    { icon: 'card',   tone: '#4CAE7A', label: 'Payment succeeded',      detail: 'Visa •••• 4242',              when: '2h ago' },
    { icon: 'mail',   tone: '#5A88C0', label: 'Opened campaign email',  detail: '"May new releases"',          when: '1d ago' },
    { icon: 'download', tone: '#3D405B', label: 'Downloaded asset',     detail: 'Slate UI Kit (v3.2)',         when: '3d ago' },
    { icon: 'profile', tone: '#C09640', label: 'Updated billing email', detail: 'old@…  →  new@…',             when: '6d ago' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {events.map((e, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < events.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${e.tone}22`, color: e.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={e.icon} size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{e.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{e.detail}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{e.when}</div>
        </div>
      ))}
    </div>
  );
}

/* =================== ORDERS =================== */
function OrdersPage({ onNavigate }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filtered = ORDERS.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (o.id + o.customer.name + o.customer.company).toLowerCase().includes(s);
  });

  return (
    <div data-screen-label="Orders">
      <div className="page-head">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-sub">{filtered.length} orders · {fmtMoney(filtered.reduce((s, o) => s + o.total, 0))} gross</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" icon="download">Export CSV</Button>
          <Button icon="plus">Manual order</Button>
        </div>
      </div>

      <div className="kpi-row" style={{ marginBottom: 20 }}>
        <KPI label="Fulfilled"  value={ORDERS.filter(o => o.status === 'fulfilled').length} delta="83%" />
        <KPI label="Processing" value={ORDERS.filter(o => o.status === 'processing').length} delta="next 24h" />
        <KPI label="Pending"    value={ORDERS.filter(o => o.status === 'pending').length} delta="needs review" />
        <KPI label="Refunded"   value={ORDERS.filter(o => o.status === 'refunded').length} delta="last 30d" />
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="input-with-icon" style={{ flex: 1, minWidth: 200, maxWidth: 360 }}>
            <span className="input-icon"><Icon name="search" size={16} /></span>
            <input className="input" placeholder="Search by order ID or customer…" value={search} onChange={(e)=>setSearch(e.target.value)} />
          </div>
          <select className="select" style={{ width: 'auto', height: 36 }} value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button variant="ghost" size="sm" icon="filter" className="hide-mobile">Date range</Button>
        </div>

        <div className="table-scroll">
          <table className="t">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th>Channel</th>
                <th className="txt-right">Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 18).map(o => (
                <tr key={o.id} onClick={() => onNavigate('order-detail', o.id)}>
                  <td className="mono fw-600">{o.id}</td>
                  <td>
                    <div className="cell-customer">
                      <Avatar name={o.customer.name} size="sm" />
                      <div className="cell-stack">
                        <span className="fw-600">{o.customer.name}</span>
                        <span className="cell-sub">{o.customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-2 fs-13">{o.items[0].name}{o.items.length > 1 ? ` +${o.items.length - 1}` : ''}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td><Badge tone="ghost">{o.channel}</Badge></td>
                  <td className="txt-right mono fw-700">{fmtMoney(o.total)}</td>
                  <td className="text-3 fs-13">{fmtDate(o.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onCustomer }) {
  if (!order) return null;
  return (
    <Modal
      open={!!order}
      onClose={onClose}
      title={`Order ${order.id}`}
      width={560}
      foot={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="secondary" icon="download">Invoice PDF</Button>
          <Button icon="mail">Email receipt</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <StatusBadge status={order.status} />
          <span className="text-3 fs-12">{fmtDate(order.date)} · {order.channel}</span>
        </div>

        <button onClick={() => onCustomer(order.customerId)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' }}>
          <Avatar name={order.customer.name} />
          <div style={{ flex: 1 }}>
            <div className="fw-700">{order.customer.name}</div>
            <div className="fs-12 text-3">{order.customer.email}</div>
          </div>
          <Icon name="chevron-right" size={16} color="var(--text-3)" />
        </button>

        <div>
          <div className="dl-label" style={{ marginBottom: 8 }}>ITEMS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            {order.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: it.tint, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{it.glyph}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fw-600 fs-13" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                  <div className="fs-12 text-3">{it.type} · qty {it.qty}</div>
                </div>
                <div className="mono fw-700">{fmtMoney(it.price * it.qty)}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Row label="Subtotal" value={fmtMoney(order.subtotal)} />
          <Row label="Tax (8%)" value={fmtMoney(order.tax)} />
          <Row label="Total" value={fmtMoney(order.total)} strong />
        </div>
      </div>
    </Modal>
  );
}
function Row({ label, value, strong }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, fontWeight: strong ? 700 : 400, fontSize: strong ? 15 : 13 }}>
      <span style={{ color: strong ? 'var(--text)' : 'var(--text-2)' }}>{label}</span>
      <span className="mono" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  );
}

/* =================== PRODUCTS =================== */
function ProductsPage({ addToast }) {
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [view, setView] = React.useState('grid');
  const [showAdd, setShowAdd] = React.useState(false);

  const categories = ['all', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  const filtered = PRODUCTS.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (!search) return true;
    return (p.name + p.sku + p.category).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div data-screen-label="Products">
      <div className="page-head">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-sub">{filtered.length} digital products · {PRODUCTS.filter(p => p.status === 'live').length} live</p>
        </div>
        <div className="page-actions">
          <Segmented value={view} onChange={setView} options={[{value:'grid',label:'Grid'},{value:'list',label:'List'}]} />
          <Button icon="plus" onClick={() => setShowAdd(true)}>New product</Button>
        </div>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, minWidth: 200, maxWidth: 360 }}>
          <span className="input-icon"><Icon name="search" size={16} /></span>
          <input className="input" placeholder="Search by name, SKU…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={'badge ' + (categoryFilter === cat ? 'brand' : 'ghost')}
              style={{ cursor: 'pointer', textTransform: 'capitalize', height: 28, padding: '0 12px', fontSize: 12 }}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div className="product-grid">
          {filtered.map(p => (
            <div key={p.id} className="product-card" onClick={() => addToast?.({ msg: `Opening ${p.name}…`, tone: '' })}>
              <ProductGlyph product={p} />
              <div className="product-body">
                <div className="product-name">{p.name}</div>
                <div className="product-sub">{p.category} · <span className="mono">{p.sku}</span></div>
                <div className="product-foot">
                  <div className="product-price"><span className="currency">$</span>{p.price.toFixed(2)}</div>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-wrap">
          <div className="table-scroll">
            <table className="t">
              <thead><tr><th>Product</th><th>SKU</th><th>Type</th><th>Category</th><th>Status</th><th className="txt-right">Sales</th><th className="txt-right">Price</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} onClick={() => addToast?.({ msg: `Opening ${p.name}…` })}>
                    <td>
                      <div className="cell-customer">
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: p.tint, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>{p.glyph}</div>
                        <div className="cell-stack">
                          <span className="fw-600">{p.name}</span>
                          <span className="cell-sub">Updated {relDate(p.updated)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="mono fs-13">{p.sku}</td>
                    <td><Badge tone="ghost">{p.type}</Badge></td>
                    <td className="text-2 fs-13">{p.category}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="txt-right mono">{p.sales.toLocaleString()}</td>
                    <td className="txt-right mono fw-700">{fmtMoney(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="New product"
        foot={<><Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={() => { setShowAdd(false); addToast?.({ msg: 'Product saved as draft', tone: 'success' }); }}>Create</Button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Product name"><Input placeholder="e.g. UI Icon Set v2" /></Field>
          <Field label="Type">
            <select className="select"><option>License</option><option>Pack</option><option>Subscription</option></select>
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Price (USD)"><Input type="number" placeholder="0.00" /></Field>
            <Field label="SKU"><Input placeholder="ABC-123" /></Field>
          </div>
          <Field label="Short description"><textarea className="textarea" placeholder="A clear one-liner customers see at checkout."></textarea></Field>
        </div>
      </Modal>
    </div>
  );
}

/* =================== TRANSACTIONS =================== */
function TransactionsPage({ onNavigate }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [methodFilter, setMethodFilter] = React.useState('all');
  const [openTxn, setOpenTxn] = React.useState(null);

  const methods = Array.from(new Set(TRANSACTIONS.map(t => t.method)));
  const filtered = TRANSACTIONS.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (methodFilter !== 'all' && t.method !== methodFilter) return false;
    if (!search) return true;
    return (t.id + t.customer.name + t.orderId).toLowerCase().includes(search.toLowerCase());
  });

  const succeeded = filtered.filter(t => t.status === 'succeeded');
  const grossSum  = succeeded.reduce((s, t) => s + t.amount, 0);
  const feesSum   = succeeded.reduce((s, t) => s + t.fee, 0);
  const netSum    = succeeded.reduce((s, t) => s + t.net, 0);

  return (
    <div data-screen-label="Payments">
      <div className="page-head">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-sub">{filtered.length} transactions · gross {fmtMoney(grossSum)}</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" icon="download">Export</Button>
          <Button icon="refresh">Sync provider</Button>
        </div>
      </div>

      <div className="kpi-row" style={{ marginBottom: 20 }}>
        <KPI label="Gross volume" value={fmtMoney(grossSum)} delta="+9.2%" deltaDir="up" />
        <KPI label="Processing fees" value={fmtMoney(feesSum)} delta="3.0% effective" />
        <KPI label="Net deposited" value={fmtMoney(netSum)} delta="next payout May 20" />
        <KPI label="Failure rate" value="0.8%" delta="-0.4pp" deltaDir="up" />
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="input-with-icon" style={{ flex: 1, minWidth: 200, maxWidth: 360 }}>
            <span className="input-icon"><Icon name="search" size={16} /></span>
            <input className="input" placeholder="Search by transaction, order, customer…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="select" style={{ width: 'auto', height: 36 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select className="select" style={{ width: 'auto', height: 36 }} value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
            <option value="all">All methods</option>
            {methods.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="table-scroll">
          <table className="t">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Status</th>
                <th className="txt-right">Amount</th>
                <th className="txt-right">Fee</th>
                <th className="txt-right">Net</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map(t => (
                <tr key={t.id} onClick={() => setOpenTxn(t)}>
                  <td>
                    <div className="cell-stack">
                      <span className="mono fw-600">{t.id}</span>
                      <span className="cell-sub mono">{t.orderId}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-customer">
                      <Avatar name={t.customer.name} size="sm" />
                      <span className="fw-600">{t.customer.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Icon name={t.methodIcon} size={14} color="var(--text-2)" />
                      <span className="fs-13">{t.method}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={t.status} /></td>
                  <td className="txt-right mono fw-700">{fmtMoney(t.amount)}</td>
                  <td className="txt-right mono text-3">{fmtMoney(t.fee)}</td>
                  <td className="txt-right mono">{fmtMoney(t.net)}</td>
                  <td className="text-3 fs-13">{relDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionDetailModal txn={openTxn} onClose={() => setOpenTxn(null)} onOrder={() => { setOpenTxn(null); onNavigate?.('orders'); }} onCustomer={(id) => { setOpenTxn(null); onNavigate?.('customer-detail', id); }} />
    </div>
  );
}

function TransactionDetailModal({ txn, onClose, onOrder, onCustomer }) {
  if (!txn) return null;
  // simple timeline based on status
  const ts = new Date(txn.date).getTime();
  const timeline = [
    { label: 'Authorized',  ts: ts - 4000, done: true },
    { label: 'Captured',    ts: ts - 2000, done: ['succeeded','refunded'].includes(txn.status) },
    { label: 'Settled',     ts: ts + 3 * 86400000, done: txn.status === 'succeeded' && (Date.now() - ts) > 3 * 86400000 },
    txn.status === 'refunded' ? { label: 'Refunded', ts: ts + 86400000, done: true } : null,
    txn.status === 'failed'   ? { label: 'Failed',   ts: ts,             done: true, fail: true } : null,
  ].filter(Boolean);

  return (
    <Modal
      open={!!txn}
      onClose={onClose}
      title={null}
      width={560}
      foot={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="secondary" icon="download">Receipt PDF</Button>
          {txn.status === 'succeeded' && <Button variant="secondary" icon="refresh">Refund</Button>}
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div className="dl-label">Transaction</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{txn.id}</span>
            <StatusBadge status={txn.status} />
          </div>
        </div>

        <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="dl-label">Amount</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em', marginTop: 2 }}>{fmtMoney(txn.amount)}</div>
              <div className="text-3 fs-12 mono">USD · {fmtDate(txn.date)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-3 fs-12">Fee</div>
              <div className="mono fw-600">{fmtMoney(txn.fee)}</div>
              <div className="text-3 fs-12" style={{ marginTop: 6 }}>Net</div>
              <div className="mono fw-700">{fmtMoney(txn.net)}</div>
            </div>
          </div>
        </div>

        <button onClick={() => onCustomer(txn.customer.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' }}>
          <Avatar name={txn.customer.name} />
          <div style={{ flex: 1 }}>
            <div className="fw-700">{txn.customer.name}</div>
            <div className="fs-12 text-3">{txn.customer.email}</div>
          </div>
          <Icon name="chevron-right" size={16} color="var(--text-3)" />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div className="dl-label">Payment method</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Icon name={txn.methodIcon} size={16} color="var(--text-2)" />
              <span className="fw-600 fs-13">{txn.method}</span>
            </div>
          </div>
          <div>
            <div className="dl-label">Order</div>
            <button onClick={onOrder} style={{ background: 'none', border: 'none', padding: 0, marginTop: 4, color: 'var(--brand)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              <span className="mono">{txn.orderId}</span> <Icon name="external" size={12} />
            </button>
          </div>
        </div>

        <div>
          <div className="dl-label" style={{ marginBottom: 8 }}>Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {timeline.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 999,
                  background: t.done ? (t.fail ? 'var(--danger)' : 'var(--success)') : 'var(--surface-3)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {t.done && <Icon name={t.fail ? 'close' : 'check'} size={11} />}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: t.done ? 'var(--text)' : 'var(--text-3)', fontWeight: t.done ? 600 : 500 }}>{t.label}</div>
                <div className="text-3 fs-12">{t.done ? fmtDate(t.ts) : '—'}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: 'var(--text-3)', padding: '10px 0 0', borderTop: '1px solid var(--border)' }}>
          <div><span className="dl-label">Risk score</span><div className="mono fw-600 text-2" style={{ marginTop: 2 }}>Normal · 12 / 100</div></div>
          <div><span className="dl-label">IP</span><div className="mono fw-600 text-2" style={{ marginTop: 2 }}>72.221.108.4</div></div>
        </div>
      </div>
    </Modal>
  );
}

/* =================== PROFILE =================== */
function ProfilePage({ addToast }) {
  const [revealEmail, setRevealEmail] = React.useState(false);
  const [twoFA, setTwoFA] = React.useState(ADMIN.twoFactor);
  const [revealKey, setRevealKey] = React.useState(false);

  const emailMasked = ADMIN.email.replace(/(.)(.*)(@.*)/, (_, a, b, c) => a + '•'.repeat(Math.max(b.length, 3)) + c);

  return (
    <div data-screen-label="My profile" className="acc-detail">
      <div className="page-head" style={{ marginBottom: 4 }}>
        <div>
          <h1 className="page-title">My profile</h1>
          <p className="page-sub">Account, security and API keys.</p>
        </div>
      </div>

      {/* Identity card */}
      <div className="profile-id-card">
        <Avatar name={ADMIN.name} size="xl" />
        <div className="profile-id-text">
          <div className="profile-id-name">{ADMIN.name}</div>
          <div className="profile-id-role">
            <Badge tone="brand" dot>{ADMIN.role}</Badge>
            <span className="text-3 fs-13">Joined {fmtDate(ADMIN.joined)}</span>
          </div>
          <div className="profile-id-email">
            <Icon name="mail" size={14} color="var(--text-3)" />
            <span className={'mono fs-13' + (revealEmail ? '' : ' email-hidden')}>
              {revealEmail ? ADMIN.email : emailMasked}
            </span>
            <button
              className="icon-btn"
              style={{ width: 28, height: 28, marginLeft: 4 }}
              onClick={() => setRevealEmail(r => !r)}
              aria-label={revealEmail ? 'Hide email' : 'Reveal email'}
              title={revealEmail ? 'Hide email' : 'Reveal email'}
            >
              <Icon name={revealEmail ? 'eye-off' : 'eye'} size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <Section title="Security">
        <div className="card-pad" style={{ padding: 16 }}>
          {/* 2FA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: twoFA ? 'var(--success-soft)' : 'var(--surface-2)', color: twoFA ? 'var(--success)' : 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="shield" size={18} />
              </div>
              <div>
                <div className="fw-700">Two-factor authentication</div>
                <div className="text-3 fs-12">{twoFA ? 'Enabled · Google Authenticator' : 'Not configured'}</div>
              </div>
            </div>
            <Button variant={twoFA ? 'secondary' : 'primary'} onClick={() => { setTwoFA(!twoFA); addToast?.({ msg: twoFA ? '2FA disabled' : '2FA enabled', tone: 'success' }); }}>{twoFA ? 'Disable' : 'Set up'}</Button>
          </div>

          {/* Password */}
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <div className="fw-700">Password</div>
            <div className="text-3 fs-12" style={{ marginBottom: 12 }}>Last changed 2 months ago</div>
            <div className="profile-pw-row">
              <Field label="Current"><Input type="password" placeholder="••••••••" /></Field>
              <Field label="New"><Input type="password" placeholder="••••••••" /></Field>
              <Field label="Confirm"><Input type="password" placeholder="••••••••" /></Field>
            </div>
            <Button style={{ marginTop: 12 }} onClick={() => addToast?.({ msg: 'Password updated', tone: 'success' })}>Update password</Button>
          </div>

          {/* Active sessions */}
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <div className="fw-700" style={{ marginBottom: 4 }}>Active sessions</div>
            <SessionRow device="MacBook Pro — Chrome" location="New York, US" current />
            <SessionRow device="iPhone 15 — Safari"   location="New York, US" />
          </div>
        </div>
      </Section>

      {/* API keys */}
      <Section
        title="API keys"
        sub="Authenticate calls to the ERP Lite API"
        action={<Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => addToast?.({ msg: 'Opening API docs…' })}>Docs</Button>}
      >
        <div className="card-pad" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="profile-key-row">
            <div className="profile-key-label">
              <span className="fs-12 fw-700">Publishable</span>
              <Badge tone="ghost">pk_live</Badge>
            </div>
            <code className="profile-key-value mono">pk_live_demo_publishable_key_sample</code>
            <Button variant="ghost" size="sm" icon="copy" onClick={() => addToast?.({ msg: 'Publishable key copied', tone: 'success' })}>Copy</Button>
          </div>

          <div className="profile-key-row">
            <div className="profile-key-label">
              <span className="fs-12 fw-700">Secret</span>
              <Badge tone="danger">sk_live</Badge>
            </div>
            <code className="profile-key-value mono">{revealKey ? 'sk_live_demo_secret_key_sample_not_real' : 'sk_live_•••••••••••••••••••••••••• cM2L'}</code>
            <Button variant="ghost" size="sm" icon={revealKey ? 'eye-off' : 'eye'} onClick={() => setRevealKey(r => !r)}>{revealKey ? 'Hide' : 'Reveal'}</Button>
            <Button variant="ghost" size="sm" icon="refresh" onClick={() => addToast?.({ msg: 'Secret key rotated', tone: 'success' })}>Rotate</Button>
          </div>

          <div className="text-3 fs-12" style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="lock" size={12} /> Never share your secret key. Rotate immediately if exposed.
          </div>
        </div>
      </Section>
    </div>
  );
}
function SessionRow({ device, location, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
        <Icon name="globe" size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="fw-600 fs-13" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{device}</div>
        <div className="text-3 fs-12">{location} · last active a few minutes ago</div>
      </div>
      {current ? <Badge tone="success" dot>Current</Badge> : <button className="link" style={{ background: 'none', border: 'none', color: 'var(--danger)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Sign out</button>}
    </div>
  );
}

/* =================== ACCOUNTS LIST =================== */
function AccountsPage({ onNavigate, addToast }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [view, setView] = React.useState('tree'); // 'tree' or 'flat'
  const [expanded, setExpanded] = React.useState(() => {
    // start with all primaries expanded
    const s = new Set();
    ACCOUNTS.filter(a => a.type === 'primary').forEach(a => s.add(a.id));
    return s;
  });

  function toggleExpanded(id) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const primaries = ACCOUNTS.filter(a => a.type === 'primary');
  const matchesSearch = (a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const owner = getCustomer(a.ownerId);
    return (a.name + a.id + (owner?.name || '') + (owner?.company || '')).toLowerCase().includes(s);
  };
  const matchesStatus = (a) => statusFilter === 'all' || a.status === statusFilter;

  const totalPrimaries = primaries.length;
  const totalSecondaries = ACCOUNTS.filter(a => a.type === 'secondary').length;
  const totalMrr = primaries.reduce((s, a) => s + a.mrr, 0);

  return (
    <div data-screen-label="Accounts">
      <div className="page-head">
        <div>
          <h1 className="page-title">Accounts</h1>
          <p className="page-sub">{totalPrimaries} primary · {totalSecondaries} secondary · workspaces that hold purchased products</p>
        </div>
        <div className="page-actions">
          <Segmented value={view} onChange={setView} options={[{value:'tree',label:'Tree'},{value:'flat',label:'Flat'}]} />
          <Button icon="plus" onClick={() => addToast?.({ msg: 'New account form…' })}>New account</Button>
        </div>
      </div>

      <div className="kpi-row" style={{ marginBottom: 20 }}>
        <KPI label="Primary accounts"   value={totalPrimaries}   delta="+2 this month" deltaDir="up" />
        <KPI label="Secondary accounts" value={totalSecondaries} delta={`${(totalSecondaries/totalPrimaries).toFixed(1)} avg per primary`} />
        <KPI label="Monthly recurring"  value={fmtMoney(totalMrr)} delta="+9.4% MoM" deltaDir="up" />
        <KPI label="Suspended"          value={ACCOUNTS.filter(a=>a.status==='suspended').length} delta="needs review" />
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="input-with-icon" style={{ flex: 1, minWidth: 200, maxWidth: 360 }}>
            <span className="input-icon"><Icon name="search" size={16} /></span>
            <input className="input" placeholder="Search by name, ID, owner…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="select" style={{ width: 'auto', height: 36 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="past_due">Past due</option>
            <option value="suspended">Suspended</option>
          </select>
          {view === 'tree' && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }} className="hide-mobile">
              <Button variant="ghost" size="sm" onClick={() => setExpanded(new Set(primaries.map(p => p.id)))}>Expand all</Button>
              <Button variant="ghost" size="sm" onClick={() => setExpanded(new Set())}>Collapse all</Button>
            </div>
          )}
        </div>

        {/* Header row */}
        <div className="acc-row head hide-mobile">
          <div className="acc-head-th">Account</div>
          <div className="acc-head-th">Owner</div>
          <div className="acc-head-th">Plan</div>
          <div className="acc-head-th">Products</div>
          <div className="acc-head-th">MRR</div>
          <div className="acc-head-th">Status</div>
          <div></div>
        </div>

        <div className="acc-tree">
          {view === 'tree' ? primaries.map(primary => {
            if (!matchesStatus(primary) && !getChildren(primary.id).some(c => matchesStatus(c) && matchesSearch(c)) && !matchesSearch(primary)) return null;
            const isOpen = expanded.has(primary.id);
            const children = getChildren(primary.id);
            return (
              <React.Fragment key={primary.id}>
                <AccountRow
                  account={primary}
                  expandable={children.length > 0}
                  expanded={isOpen}
                  onToggle={() => toggleExpanded(primary.id)}
                  onClick={() => onNavigate('account-detail', primary.id)}
                  childCount={children.length}
                />
                {isOpen && children
                  .filter(matchesSearch).filter(matchesStatus)
                  .map(child => (
                    <AccountRow
                      key={child.id}
                      account={child}
                      isChild
                      onClick={() => onNavigate('account-detail', child.id)}
                    />
                  ))
                }
              </React.Fragment>
            );
          }) : ACCOUNTS.filter(matchesSearch).filter(matchesStatus).map(a => (
            <AccountRow key={a.id} account={a} onClick={() => onNavigate('account-detail', a.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountRow({ account, expandable, expanded, onToggle, onClick, isChild, childCount }) {
  const owner = getCustomer(account.ownerId);
  const isPrimary = account.type === 'primary';
  return (
    <div className={'acc-row' + (isChild ? ' is-child' : '')} onClick={onClick}>
      <div className="acc-cell-name">
        {!isChild ? (
          expandable ? (
            <button className={'acc-chevron' + (expanded ? ' open' : '')} onClick={(e) => { e.stopPropagation(); onToggle?.(); }} aria-label="Toggle children">
              <Icon name="chevron-right" size={14} />
            </button>
          ) : <span className="acc-chevron spacer" />
        ) : (
          <>
            <span className="acc-chevron spacer" />
            <span className="acc-connector" />
          </>
        )}
        <span className={'acc-icon ' + (isPrimary ? 'primary' : 'secondary')}>
          <Icon name={isPrimary ? 'building' : 'box'} size={isPrimary ? 16 : 14} />
        </span>
        <div className="acc-name">
          <div className="nm">
            {account.name}
            {isPrimary && childCount > 0 && (
              <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>
                · {childCount} sub-account{childCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="sub">
            <Badge tone={isPrimary ? 'brand' : 'ghost'} dot>{isPrimary ? 'Primary' : 'Secondary'}</Badge>{' '}
            <span className="mono">{account.id}</span>
          </div>
        </div>
      </div>

      <div className="acc-mb-hide" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <Avatar name={owner?.name || ''} size="sm" />
        <div style={{ minWidth: 0 }}>
          <div className="fs-13 fw-600" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{owner?.name}</div>
          <div className="fs-12 text-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{owner?.company}</div>
        </div>
      </div>

      <div className="acc-mb-hide fs-13 text-2">{account.plan}</div>
      <div className="acc-mb-hide mono fs-13">{account.products} <span className="text-3">items</span></div>
      <div className="acc-mb-hide mono fw-700 fs-13">{account.mrr > 0 ? fmtMoney(account.mrr) : <span className="text-3" style={{ fontWeight: 400 }}>—</span>}</div>
      <div><StatusBadge status={account.status} /></div>
      <div className="acc-mb-hide" style={{ textAlign: 'right' }}>
        <Icon name="chevron-right" size={16} color="var(--text-3)" />
      </div>
    </div>
  );
}

/* =================== ACCOUNT DETAIL =================== */
function AccountDetailPage({ accountId, onNavigate, addToast }) {
  const account = getAccount(accountId) || ACCOUNTS[0];
  const owner = getCustomer(account.ownerId);
  const isPrimary = account.type === 'primary';
  const parent = !isPrimary ? getAccount(account.parentId) : null;
  const children = isPrimary ? getChildren(account.id) : [];
  const siblings = !isPrimary ? getChildren(account.parentId).filter(a => a.id !== account.id) : [];
  const products = productsForAccount(account);
  const accountOrders = ORDERS.filter(o => o.accountId === account.id).slice(0, 5);
  const accountLedger = ledgerForAccount(account.id).slice(0, 5);
  const accountEmails = emailsForAccount(account.id);
  const balance = voucherBalance(account.id);
  const [vouchersOpen, setVouchersOpen] = React.useState(false);

  return (
    <div data-screen-label="Account detail" className="acc-detail">
      <div className="breadcrumb">
        <a href="#accounts" onClick={(e) => { e.preventDefault(); onNavigate('accounts'); }}>Accounts</a>
        {parent && <>
          <span className="sep">/</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('account-detail', parent.id); }}>{parent.name}</a>
        </>}
        <span className="sep">/</span>
        <span>{account.name}</span>
      </div>

      {/* HEADER */}
      <header className="acc-hero">
        <div className="acc-hero-main">
          <span className={'acc-icon ' + (isPrimary ? 'primary' : 'secondary')} style={{ width: 56, height: 56, borderRadius: 12 }}>
            <Icon name={isPrimary ? 'building' : 'box'} size={isPrimary ? 26 : 22} />
          </span>
          <div className="acc-hero-text">
            <div className="acc-hero-row">
              <h1 className="page-title" style={{ margin: 0 }}>{account.name}</h1>
              <Badge tone={isPrimary ? 'brand' : 'ghost'} dot>{isPrimary ? 'Primary' : 'Secondary'}</Badge>
              <StatusBadge status={account.status} />
            </div>
            <p className="page-sub" style={{ margin: 0 }}>
              <span className="mono">{account.id}</span> · {account.region} · created {fmtDate(account.created)}
            </p>
          </div>
        </div>
        <div className="acc-hero-actions">
          <Button variant="secondary" icon="inbox" onClick={() => onNavigate('emails', account.id)}>
            Inbox{accountEmails.length > 0 && <span className="badge ghost" style={{ height: 18, padding: '0 6px', fontSize: 10, marginLeft: 2 }}>{accountEmails.length}</span>}
          </Button>
          <Button variant="secondary" icon="edit">Edit</Button>
          {isPrimary
            ? <Button icon="plus" onClick={() => addToast?.({ msg: 'Attach secondary account…' })}>Attach secondary</Button>
            : null}
        </div>
      </header>

      {/* PROMINENT "Secondary of …" link */}
      {!isPrimary && (
        <button
          className="acc-parent-banner"
          onClick={() => onNavigate('account-detail', parent.id)}
        >
          <span className="apb-arrow" aria-hidden="true">↑</span>
          <div className="apb-body">
            <div className="apb-eyebrow">Secondary of</div>
            <div className="apb-name">
              {parent.name}
              <span className="apb-id mono">· {parent.id}</span>
            </div>
            <div className="apb-meta">Inherits plan and billing from primary</div>
          </div>
          <Icon name="chevron-right" size={18} color="var(--text-3)" />
        </button>
      )}

      {/* QUICK FACTS — responsive grid, never tabs */}
      <div className="acc-facts">
        <Fact label="Plan"        value={account.plan} />
        <Fact label="MRR"         value={account.mrr > 0 ? fmtMoney(account.mrr) : '—'} sub={isPrimary ? 'billed monthly' : 'via primary'} />
        <Fact label="Products"    value={account.products} sub="attached" />
        <Fact label="Seats"       value={account.seats} sub={account.seats === 1 ? 'user' : 'users'} />
        <Fact label="Sub-accounts" value={isPrimary ? children.length : '—'} sub={isPrimary ? (children.length === 1 ? 'attached' : 'attached') : 'n/a'} />
        <Fact label="Last activity" value={relDate(account.lastActivity)} sub={fmtDate(account.lastActivity)} />
      </div>

      {/* AVAILABLE VOUCHERS — compact panel */}
      <button className="voucher-card" onClick={() => setVouchersOpen(true)}>
        <div className="voucher-card-head">
          <span className="voucher-card-icon"><Icon name="voucher" size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dl-label">Available vouchers</div>
            <div className="voucher-card-big">{fmtMoney(balance.available)}</div>
            <div className="text-3 fs-12">
              of <strong style={{ color: 'var(--text-2)' }}>{fmtMoney(balance.total)}</strong> issued
              {' · '}
              <strong style={{ color: 'var(--text-2)' }}>{balance.activeCount}</strong> active of {balance.count}
            </div>
          </div>
          <div className="voucher-card-cta">
            View vouchers <Icon name="chevron-right" size={16} />
          </div>
        </div>
        <div className="voucher-bar" style={{ marginTop: 12 }}>
          <div className="voucher-bar-fill" style={{ width: (balance.total > 0 ? (balance.available / balance.total) * 100 : 0) + '%' }} />
        </div>
      </button>

      {/* OWNER */}
      <Section title="Owner">
        <button className="acc-owner-row" onClick={() => onNavigate('customer-detail', owner.id)}>
          <Avatar name={owner.name} size="lg" />
          <div className="acc-owner-text">
            <div className="acc-owner-name">{owner.name}</div>
            <div className="acc-owner-meta">{owner.company} · {owner.email}</div>
          </div>
          <span className="text-3 fs-12 hide-mobile">View customer</span>
          <Icon name="chevron-right" size={18} color="var(--text-3)" />
        </button>
      </Section>

      {/* HIERARCHY — if primary, list secondaries; if secondary, list siblings */}
      {isPrimary ? (
        <Section
          title={`Sub-accounts (${children.length})`}
          action={<Button variant="ghost" size="sm" icon="plus" onClick={() => addToast?.({ msg: 'Attach secondary account…' })}>Attach</Button>}
        >
          {children.length === 0 ? (
            <div className="empty" style={{ padding: 28 }}>
              <Icon name="box" size={24} />
              <h4>No sub-accounts yet</h4>
              <p>Attach a secondary workspace to organize team divisions, brands or projects under this primary.</p>
            </div>
          ) : (
            <div className="acc-children">
              {children.map(child => (
                <SubAccountRow key={child.id} account={child} onClick={() => onNavigate('account-detail', child.id)} />
              ))}
            </div>
          )}
        </Section>
      ) : siblings.length > 0 ? (
        <Section title={`Sibling accounts (${siblings.length})`} sub={`Also under ${parent.name}`}>
          <div className="acc-children">
            {siblings.map(s => (
              <SubAccountRow key={s.id} account={s} onClick={() => onNavigate('account-detail', s.id)} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* RECENT ORDERS (last 5) */}
      <Section
        title={`Recent orders (${accountOrders.length})`}
        sub="Last 5 orders placed under this account"
        action={<Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => onNavigate('orders')}>All orders</Button>}
      >
        {accountOrders.length === 0 ? (
          <div className="empty" style={{ padding: 24 }}>
            <h4 style={{ margin: 0 }}>No orders yet</h4>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="t">
              <thead>
                <tr>
                  <th>Order</th>
                  <th className="hide-mobile">Items</th>
                  <th>Status</th>
                  <th className="txt-right">Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {accountOrders.map(o => (
                  <tr key={o.id} onClick={() => onNavigate('order-detail', o.id)}>
                    <td className="mono fw-600">{o.id}</td>
                    <td className="hide-mobile text-2 fs-13">{o.items[0].name}{o.items.length > 1 ? ` +${o.items.length - 1}` : ''}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="txt-right mono fw-700">{fmtMoney(o.total)}</td>
                    <td className="text-3 fs-13">{relDate(o.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* RECENT REDEMPTIONS (last 5) */}
      <Section
        title={`Recent transactions (${accountLedger.length})`}
        sub="Latest redemptions, buy-backs and corrections"
        action={<Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => onNavigate('transactions')}>All transactions</Button>}
      >
        {accountLedger.length === 0 ? (
          <div className="empty" style={{ padding: 24 }}>
            <h4 style={{ margin: 0 }}>No transactions yet</h4>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="t">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Type</th>
                  <th className="hide-mobile">Voucher</th>
                  <th className="txt-right">Value</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {accountLedger.map(l => (
                  <tr key={l.id} onClick={() => onNavigate('transactions')}>
                    <td className="mono fw-600">{l.id}</td>
                    <td><LedgerTypeBadge type={l.type} /></td>
                    <td className="hide-mobile mono fs-12 text-3">{l.voucher || '—'}</td>
                    <td className="txt-right"><LedgerValue value={l.value} /></td>
                    <td className="text-3 fs-13">{relDate(l.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* PRODUCTS */}
      <Section
        title={`Products attached (${products.length})`}
        action={<Button variant="ghost" size="sm" icon="plus">Attach product</Button>}
      >
        {products.length === 0 ? (
          <div className="empty" style={{ padding: 28 }}>
            <Icon name="products" size={24} />
            <h4>No products attached</h4>
            <p>Products purchased under this account will appear here.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="t">
              <thead><tr><th>Product</th><th className="hide-mobile">Type</th><th className="hide-mobile">Purchased</th><th className="txt-right">Price</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} onClick={() => onNavigate('products')}>
                    <td>
                      <div className="cell-customer">
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: p.tint, color: 'white', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.glyph}</div>
                        <div className="cell-stack" style={{ minWidth: 0 }}>
                          <span className="fw-600" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                          <span className="cell-sub mono">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="hide-mobile"><Badge tone="ghost">{p.type}</Badge></td>
                    <td className="text-3 fs-13 hide-mobile">{fmtDate(p.purchasedAt)}</td>
                    <td className="txt-right mono fw-700">{fmtMoney(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* BILLING */}
      <Section title="Billing">
        {isPrimary ? (
          <div className="card-pad" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
                  <Icon name="card" size={18} />
                </span>
                <div>
                  <div className="fw-700">Visa ending in 4242</div>
                  <div className="text-3 fs-12">{account.billingEmail}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon="edit">Update</Button>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div className="text-3 fs-13">Next invoice on Jun 1, 2026</div>
              <div className="fw-700">{fmtMoney(account.mrr)}</div>
            </div>
          </div>
        ) : (
          <button className="acc-parent-banner soft" onClick={() => onNavigate('account-detail', parent.id)}>
            <span className="acc-icon primary" style={{ width: 36, height: 36 }}><Icon name="building" size={16} /></span>
            <div className="apb-body">
              <div className="apb-name">Billed via {parent.name}</div>
              <div className="apb-meta">{parent.plan} · {parent.billingEmail}</div>
            </div>
            <Icon name="chevron-right" size={18} color="var(--text-3)" />
          </button>
        )}
      </Section>

      {/* ACTIVITY */}
      <Section title="Recent activity">
        <div className="card-pad" style={{ padding: 16 }}>
          <ActivityFeed />
        </div>
      </Section>

      {/* DANGER */}
      <Section title="Account controls" tone="muted">
        <div className="acc-controls">
          <Button variant="secondary" icon="download">Export invoices</Button>
          <Button variant="secondary" icon="refresh" onClick={() => addToast?.({ msg: 'Re-sync triggered', tone: 'success' })}>Re-sync from source</Button>
          {account.status === 'active' ? (
            <Button variant="secondary" style={{ color: 'var(--warning)' }} onClick={() => addToast?.({ msg: 'Account suspended', tone: 'success' })}>Suspend account</Button>
          ) : (
            <Button variant="secondary" onClick={() => addToast?.({ msg: 'Account reactivated', tone: 'success' })}>Reactivate account</Button>
          )}
        </div>
      </Section>

      <VouchersModal accountId={account.id} open={vouchersOpen} onClose={() => setVouchersOpen(false)} />
    </div>
  );
}

function Section({ title, sub, action, tone, children }) {
  return (
    <section className={'acc-section' + (tone ? ' tone-' + tone : '')}>
      <div className="acc-section-head">
        <div>
          <h2 className="acc-section-title">{title}</h2>
          {sub && <div className="acc-section-sub">{sub}</div>}
        </div>
        {action}
      </div>
      <div className="acc-section-body">
        {children}
      </div>
    </section>
  );
}

function Fact({ label, value, sub }) {
  return (
    <div className="acc-fact">
      <div className="acc-fact-label">{label}</div>
      <div className="acc-fact-value">{value}</div>
      {sub && <div className="acc-fact-sub">{sub}</div>}
    </div>
  );
}

function SubAccountRow({ account, onClick }) {
  return (
    <button className="sub-acc-row" onClick={onClick}>
      <span className={'acc-icon ' + (account.type === 'primary' ? 'primary' : 'secondary')} style={{ width: 36, height: 36 }}>
        <Icon name={account.type === 'primary' ? 'building' : 'box'} size={16} />
      </span>
      <div className="sub-acc-body">
        <div className="sub-acc-name">{account.name}</div>
        <div className="sub-acc-meta">
          <span className="mono">{account.id}</span>
          <span className="sep">·</span>
          <span>{account.products} products</span>
          <span className="sep">·</span>
          <span>{account.seats} {account.seats === 1 ? 'seat' : 'seats'}</span>
        </div>
      </div>
      <StatusBadge status={account.status} />
      <Icon name="chevron-right" size={16} color="var(--text-3)" />
    </button>
  );
}

/* =================== API DOCS =================== */
function ApiDocsPage({ syncState, onSyncNow, addToast }) {
  const [activeSection, setActiveSection] = React.useState('overview');
  const [codeLang, setCodeLang] = React.useState('curl');

  React.useEffect(() => {
    function onScroll() {
      const sections = ['overview','authentication','endpoints','push-data','webhooks','rate-limits'];
      for (const id of sections) {
        const el = document.getElementById('api-' + id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < 200) {
          setActiveSection(id);
          break;
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTo(id) {
    const el = document.getElementById('api-' + id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  }

  return (
    <div data-screen-label="API & sync">
      <div className="page-head">
        <div>
          <h1 className="page-title">API & sync</h1>
          <p className="page-sub">How to push data into ERP Lite and pull it back out. Real REST + webhooks.</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" icon="external">OpenAPI spec</Button>
          <Button icon="refresh" onClick={() => { onSyncNow?.(); addToast?.({ msg: 'Sync triggered', tone: 'success' }); }}>Sync now</Button>
        </div>
      </div>

      <SyncStatusCard syncState={syncState} />

      <div className="api-grid" style={{ marginTop: 20 }}>
        <nav className="api-toc">
          <div className="toc-head">On this page</div>
          {[
            ['overview','Overview'],
            ['authentication','Authentication'],
            ['endpoints','Endpoints'],
            ['push-data','Push data → ERP'],
            ['webhooks','Webhooks (ERP → you)'],
            ['rate-limits','Rate limits'],
          ].map(([id, label]) => (
            <a key={id} href={`#api-${id}`} className={activeSection === id ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
          ))}
        </nav>

        <div>
          <section id="api-overview" className="api-section">
            <h2>Overview</h2>
            <p>The ERP Lite API is REST-based, JSON-encoded, and lives at <code>https://api.erp-lite.app/v1</code>. Every resource you see in this dashboard — customers, accounts, products, orders, transactions — is also available over HTTP.</p>
            <p>Two-way sync works like this:</p>
            <ul>
              <li><strong>Pull from ERP</strong> — your systems <code>GET</code> resources on a schedule, or open the SSE stream at <code>/v1/events</code> for live updates.</li>
              <li><strong>Push to ERP</strong> — your systems <code>POST</code> / <code>PUT</code> changes. ERP de-duplicates by your idempotency key.</li>
              <li><strong>Webhooks</strong> — for low-latency one-way notifications when something changes here, point ERP at your endpoint.</li>
            </ul>
          </section>

          <section id="api-authentication" className="api-section">
            <h2>Authentication</h2>
            <p>All requests use a bearer token. Get yours from <code>Profile → API keys</code>. Treat secret keys like passwords — never put them in client-side code.</p>
            <CodeBlock
              lang={codeLang}
              onLangChange={setCodeLang}
              addToast={addToast}
              samples={{
                curl: `curl https://api.erp-lite.app/v1/customers \\
  -H "Authorization: Bearer sk_live_••••••••••••cM2L" \\
  -H "Content-Type: application/json"`,
                node: `import { ErpLite } from "@erp-lite/sdk";

const erp = new ErpLite(process.env.ERP_KEY);

const { data } = await erp.customers.list({ limit: 25 });`,
                python: `import os
from erp_lite import ErpLite

erp = ErpLite(api_key=os.environ["ERP_KEY"])

customers = erp.customers.list(limit=25)`,
              }}
            />
          </section>

          <section id="api-endpoints" className="api-section">
            <h2>Endpoints</h2>
            <p>The most common endpoints — full reference lives in the <a href="#" style={{ color: 'var(--brand)', fontWeight: 600 }} onClick={(e) => e.preventDefault()}>OpenAPI spec</a>.</p>
            <div className="card" style={{ marginTop: 8 }}>
              {[
                ['get',  '/v1/customers',           'List customers (paginated)'],
                ['get',  '/v1/customers/:id',       'Retrieve a single customer'],
                ['post', '/v1/customers',           'Create a customer'],
                ['get',  '/v1/accounts',            'List accounts (with parent_id)'],
                ['get',  '/v1/accounts/:id',        'Retrieve an account + attached products'],
                ['post', '/v1/accounts',            'Create primary or secondary'],
                ['get',  '/v1/products',            'List digital products'],
                ['post', '/v1/orders',              'Create an order on behalf of a customer'],
                ['get',  '/v1/orders/:id',          'Retrieve order with line items'],
                ['get',  '/v1/transactions',        'List payment transactions'],
                ['post', '/v1/transactions/refund', 'Issue a full or partial refund'],
              ].map(([m, path, desc]) => (
                <div key={path + m} className="endpoint-row">
                  <span className={'method-pill ' + m}>{m.toUpperCase()}</span>
                  <code>{path}</code>
                  <span className="ep-desc">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="api-push-data" className="api-section">
            <h2>Push data → ERP</h2>
            <p>Create a customer from your own system. Add <code>Idempotency-Key</code> to safely retry on network errors.</p>
            <CodeBlock
              lang={codeLang}
              onLangChange={setCodeLang}
              addToast={addToast}
              samples={{
                curl: `curl https://api.erp-lite.app/v1/customers \\
  -X POST \\
  -H "Authorization: Bearer sk_live_••••" \\
  -H "Idempotency-Key: cust-create-9f2a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name":   "Aria Okafor",
    "email":  "aria@lumen.studio",
    "company":"Lumen Studios",
    "plan":   "pro",
    "country":"US"
  }'`,
                node: `await erp.customers.create({
  name:    "Aria Okafor",
  email:   "aria@lumen.studio",
  company: "Lumen Studios",
  plan:    "pro",
  country: "US",
}, { idempotencyKey: "cust-create-9f2a" });`,
                python: `erp.customers.create(
  name="Aria Okafor",
  email="aria@lumen.studio",
  company="Lumen Studios",
  plan="pro",
  country="US",
  idempotency_key="cust-create-9f2a",
)`,
              }}
            />
            <h3>Bulk push</h3>
            <p>To migrate thousands of records in one job, use the bulk endpoint. Each batch can hold up to 500 records and is processed asynchronously.</p>
            <CodeBlock
              lang={codeLang}
              onLangChange={setCodeLang}
              addToast={addToast}
              samples={{
                curl: `curl https://api.erp-lite.app/v1/bulk/customers \\
  -X POST \\
  -H "Authorization: Bearer sk_live_••••" \\
  -H "Content-Type: application/x-ndjson" \\
  --data-binary @customers.ndjson`,
                node: `await erp.bulk.customers.upload(
  fs.createReadStream("customers.ndjson")
);`,
                python: `with open("customers.ndjson","rb") as f:
  erp.bulk.customers.upload(f)`,
              }}
            />
          </section>

          <section id="api-webhooks" className="api-section">
            <h2>Webhooks (ERP → you)</h2>
            <p>Subscribe an HTTPS endpoint to receive events as they happen. Each delivery is signed with HMAC-SHA256; verify it with your endpoint secret.</p>
            <div className="card" style={{ marginTop: 8 }}>
              {[
                ['order.created',       'A new order was placed in ERP.'],
                ['order.fulfilled',     'Order has been fulfilled (digital delivery sent).'],
                ['transaction.succeeded','Payment captured.'],
                ['transaction.refunded','Payment refunded (full or partial).'],
                ['customer.created',    'New customer record exists.'],
                ['account.suspended',   'An account was suspended.'],
              ].map(([evt, desc]) => (
                <div key={evt} className="endpoint-row">
                  <Icon name="webhook" size={16} color="var(--text-3)" />
                  <code>{evt}</code>
                  <span className="ep-desc">{desc}</span>
                </div>
              ))}
            </div>
            <h3>Verifying signatures</h3>
            <CodeBlock
              lang={codeLang}
              onLangChange={setCodeLang}
              addToast={addToast}
              samples={{
                curl: `# headers on every delivery:
ERP-Signature: t=1747526400,v1=2c8e…f1
ERP-Event-Id:  evt_01HV3K…
ERP-Event:     transaction.succeeded`,
                node: `import crypto from "node:crypto";

function verify(rawBody, header, secret) {
  const [t, v1] = header.split(",").map(p => p.split("=")[1]);
  const sig = crypto.createHmac("sha256", secret)
    .update(\`\${t}.\${rawBody}\`).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(v1));
}`,
                python: `import hmac, hashlib

def verify(raw_body, header, secret):
  t, v1 = [p.split("=")[1] for p in header.split(",")]
  sig = hmac.new(secret.encode(),
                 f"{t}.{raw_body}".encode(),
                 hashlib.sha256).hexdigest()
  return hmac.compare_digest(sig, v1)`,
              }}
            />
          </section>

          <section id="api-rate-limits" className="api-section">
            <h2>Rate limits</h2>
            <p>Limits are per-API-key. When you hit a limit, you'll get a <code>429</code> with a <code>Retry-After</code> header.</p>
            <div className="card" style={{ marginTop: 8 }}>
              <div className="endpoint-row"><span className="method-pill get">READ</span><code>1,000 req / minute</code><span className="ep-desc">GET on any resource</span></div>
              <div className="endpoint-row"><span className="method-pill post">WRITE</span><code>200 req / minute</code><span className="ep-desc">POST / PUT / DELETE</span></div>
              <div className="endpoint-row"><span className="method-pill put">BULK</span><code>20 jobs / hour</code><span className="ep-desc">Bulk endpoints, 500 records / job</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SyncStatusCard({ syncState }) {
  return (
    <div className="card sync-status-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', overflow: 'hidden' }}>
      <SyncStat icon="arrow-down" color="#5A88C0" label="Inbound (push)"  ts={syncState.lastInboundSync}  count={syncState.lastInboundCount || 142}  dir="from your systems" />
      <SyncStat icon="arrow-up"   color="#E07A5F" label="Outbound (fetch)" ts={syncState.lastOutboundSync} count={syncState.lastOutboundCount || 89} dir="to your systems" border />
      <SyncStat icon="webhook"    color="#4CAE7A" label="Webhooks"         ts={syncState.lastInboundSync}  count={3}  dir="endpoints · 100% delivery" border />
      <SyncStat icon="shield"     color="#3D405B" label="API status"       ts={null}                       count={null} dir="All systems normal" status="live" border />
    </div>
  );
}
function SyncStat({ icon, color, label, ts, count, dir, border, status }) {
  return (
    <div style={{ padding: 18, borderLeft: border ? '1px solid var(--border)' : 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: `${color}22`, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={14} />
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{label}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.02em' }}>
        {status === 'live' ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--success)' }} /> Live</span> : (ts ? relDate(ts) : '—')}
      </div>
      <div className="fs-12 text-3">
        {count != null && <span className="mono">{count}</span>} {dir}
      </div>
    </div>
  );
}

function CodeBlock({ samples, lang, onLangChange, addToast }) {
  const languages = Object.keys(samples);
  const active = samples[lang] ? lang : languages[0];
  const code = samples[active];
  return (
    <div className="code-block">
      <div className="code-tabs">
        {languages.map(l => (
          <button key={l} className={active === l ? 'active' : ''} onClick={() => onLangChange(l)}>
            {l === 'curl' ? 'cURL' : l === 'node' ? 'Node.js' : l === 'python' ? 'Python' : l}
          </button>
        ))}
        <button className="copy-btn" onClick={() => {
          try { navigator.clipboard.writeText(code); addToast?.({ msg: 'Code copied', tone: 'success' }); } catch {}
        }}>
          <Icon name="copy" size={12} /> Copy
        </button>
      </div>
      <pre dangerouslySetInnerHTML={{ __html: highlight(code, active) }} />
    </div>
  );
}

// very-lightweight syntax highlighter for the demo code blocks
function highlight(code, lang) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let html = esc(code);
  if (lang === 'curl') {
    html = html.replace(/(^|\n)(curl|#[^\n]*)/g, (m, p1, p2) => p2.startsWith('#') ? `${p1}<span class="tok-c">${p2}</span>` : `${p1}<span class="tok-k">${p2}</span>`);
    html = html.replace(/(-[A-Z]|--?[a-z-]+)\b/g, '<span class="tok-f">$1</span>');
    html = html.replace(/(["'])((?:\\.|(?!\1).)*)\1/g, '<span class="tok-s">$1$2$1</span>');
  } else if (lang === 'node') {
    html = html.replace(/\b(import|from|const|let|var|async|await|return|function|export|new)\b/g, '<span class="tok-k">$1</span>');
    html = html.replace(/(['"`])((?:\\.|(?!\1).)*)\1/g, '<span class="tok-s">$1$2$1</span>');
    html = html.replace(/(\/\/[^\n]*)/g, '<span class="tok-c">$1</span>');
    html = html.replace(/\b([A-Z][A-Za-z0-9_]+)\b/g, '<span class="tok-n">$1</span>');
  } else if (lang === 'python') {
    html = html.replace(/\b(import|from|def|class|return|with|as|for|in|if|else|elif|None|True|False)\b/g, '<span class="tok-k">$1</span>');
    html = html.replace(/(['"])((?:\\.|(?!\1).)*)\1/g, '<span class="tok-s">$1$2$1</span>');
    html = html.replace(/(#[^\n]*)/g, '<span class="tok-c">$1</span>');
    html = html.replace(/\b([A-Z][A-Za-z0-9_]+)\b/g, '<span class="tok-n">$1</span>');
  }
  return html;
}

/* =================== ORDER DETAIL (page) =================== */
function OrderDetailPage({ orderId, onNavigate, addToast }) {
  const order = getOrder(orderId) || ORDERS[0];
  const account = order.accountId ? getAccount(order.accountId) : null;
  const payments = paymentsForOrder(order.id);
  const ledger = ledgerForOrder(order.id);
  const paid = payments.some(p => p.status === 'succeeded') || ['fulfilled', 'processing', 'refunded'].includes(order.status);
  const [openTxn, setOpenTxn] = React.useState(null);
  const [openLedger, setOpenLedger] = React.useState(null);

  const timeline = [
    { label: 'Placed',      ts: order.date, done: true },
    { label: 'Paid',        ts: new Date(new Date(order.date).getTime() + 60_000).toISOString(),     done: paid },
    { label: 'Processing',  ts: new Date(new Date(order.date).getTime() + 30 * 60_000).toISOString(), done: ['processing','fulfilled','refunded'].includes(order.status) },
    { label: 'Fulfilled',   ts: new Date(new Date(order.date).getTime() + 60 * 60_000).toISOString(), done: ['fulfilled','refunded'].includes(order.status) },
    order.status === 'refunded' ? { label: 'Refunded', ts: new Date(new Date(order.date).getTime() + 4 * 86400_000).toISOString(), done: true, warn: true } : null,
    order.status === 'cancelled' ? { label: 'Cancelled', ts: order.date, done: true, fail: true } : null,
  ].filter(Boolean);

  return (
    <div data-screen-label="Order detail" className="acc-detail">
      <div className="breadcrumb">
        <a href="#orders" onClick={(e) => { e.preventDefault(); onNavigate('orders'); }}>Orders</a>
        <span className="sep">/</span>
        <span className="mono">{order.id}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: -6 }}>
        <Button variant="ghost" size="sm" icon="chevron-left" onClick={() => onNavigate('orders')}>Back to orders</Button>
      </div>

      <header className="acc-hero">
        <div className="acc-hero-main">
          <span className="acc-icon primary" style={{ width: 56, height: 56, borderRadius: 12 }}>
            <Icon name="orders" size={22} />
          </span>
          <div className="acc-hero-text">
            <div className="acc-hero-row">
              <h1 className="page-title" style={{ margin: 0 }}>Order <span className="mono">{order.id}</span></h1>
              <StatusBadge status={order.status} />
              <Badge tone={paid ? 'success' : 'warning'} dot>{paid ? 'Paid' : 'Unpaid'}</Badge>
            </div>
            <p className="page-sub" style={{ margin: 0 }}>
              Placed {fmtDate(order.date)} · {order.channel} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="acc-hero-actions">
          <Button variant="secondary" icon="download">Invoice PDF</Button>
          <Button variant="secondary" icon="mail">Email receipt</Button>
          {order.status === 'fulfilled' && <Button variant="secondary" icon="refresh" onClick={() => addToast?.({ msg: 'Refund flow opened…' })}>Refund</Button>}
        </div>
      </header>

      {/* Quick facts strip */}
      <div className="acc-facts">
        <Fact label="Total"      value={fmtMoney(order.total)} sub="incl. tax" />
        <Fact label="Subtotal"   value={fmtMoney(order.subtotal)} />
        <Fact label="Tax (8%)"   value={fmtMoney(order.tax)} />
        <Fact label="Payments"   value={payments.length} sub={paid ? 'captured' : 'pending'} />
        <Fact label="Ledger"     value={ledger.length} sub="entries" />
        <Fact label="Channel"    value={order.channel} />
      </div>

      {/* Account card (clickable) */}
      {account && (
        <Section title="Account">
          <button
            className="acc-owner-row"
            onClick={() => onNavigate('account-detail', account.id)}
            style={{ paddingRight: 18 }}
          >
            <span className={'acc-icon ' + (account.type === 'primary' ? 'primary' : 'secondary')} style={{ width: 44, height: 44, borderRadius: 10 }}>
              <Icon name={account.type === 'primary' ? 'building' : 'box'} size={18} />
            </span>
            <div className="acc-owner-text">
              <div className="acc-owner-name">{account.name}</div>
              <div className="acc-owner-meta">
                <Badge tone={account.type === 'primary' ? 'brand' : 'ghost'} dot>{account.type === 'primary' ? 'Primary' : 'Secondary'}</Badge>{' '}
                · <span className="mono">{account.id}</span> · {account.plan}
              </div>
            </div>
            <span className="text-3 fs-12 hide-mobile">View account</span>
            <Icon name="chevron-right" size={18} color="var(--text-3)" />
          </button>
        </Section>
      )}

      {/* Customer card */}
      <Section title="Customer">
        <button className="acc-owner-row" onClick={() => onNavigate('customer-detail', order.customer.id)}>
          <Avatar name={order.customer.name} size="lg" />
          <div className="acc-owner-text">
            <div className="acc-owner-name">{order.customer.name}</div>
            <div className="acc-owner-meta">{order.customer.company} · {order.customer.email}</div>
          </div>
          <span className="text-3 fs-12 hide-mobile">View customer</span>
          <Icon name="chevron-right" size={18} color="var(--text-3)" />
        </button>
      </Section>

      {/* Line items */}
      <Section title={`Items (${order.items.length})`}>
        <div className="table-scroll">
          <table className="t">
            <thead><tr><th>Product</th><th className="hide-mobile">Type</th><th className="txt-right">Qty</th><th className="txt-right">Price</th><th className="txt-right">Total</th></tr></thead>
            <tbody>
              {order.items.map((it, i) => (
                <tr key={i} style={{ cursor: 'default' }}>
                  <td>
                    <div className="cell-customer">
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: it.tint, color: 'white', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{it.glyph}</div>
                      <div className="cell-stack" style={{ minWidth: 0 }}>
                        <span className="fw-600" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</span>
                        <span className="cell-sub mono">{it.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hide-mobile"><Badge tone="ghost">{it.type}</Badge></td>
                  <td className="txt-right mono">{it.qty}</td>
                  <td className="txt-right mono">{fmtMoney(it.price)}</td>
                  <td className="txt-right mono fw-700">{fmtMoney(it.price * it.qty)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan="4" className="txt-right text-3 fs-13">Subtotal</td><td className="txt-right mono">{fmtMoney(order.subtotal)}</td></tr>
              <tr><td colSpan="4" className="txt-right text-3 fs-13">Tax (8%)</td><td className="txt-right mono">{fmtMoney(order.tax)}</td></tr>
              <tr><td colSpan="4" className="txt-right fw-700">Total</td><td className="txt-right mono fw-800" style={{ fontSize: 15 }}>{fmtMoney(order.total)}</td></tr>
            </tfoot>
          </table>
        </div>
      </Section>

      {/* Payments captured for this order */}
      <Section title={`Payments (${payments.length})`} sub="Card / bank charges">
        {payments.length === 0 ? (
          <div className="empty" style={{ padding: 28 }}>
            <Icon name="card" size={24} />
            <h4>No payments yet</h4>
            <p>This order hasn't been charged.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="t">
              <thead><tr><th>Transaction</th><th>Method</th><th>Status</th><th className="txt-right">Amount</th><th>When</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} onClick={() => setOpenTxn(p)}>
                    <td className="mono fw-600">{p.id}</td>
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Icon name={p.methodIcon} size={14} color="var(--text-2)" />
                        <span className="fs-13">{p.method}</span>
                      </div>
                    </td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="txt-right mono fw-700">{fmtMoney(p.amount)}</td>
                    <td className="text-3 fs-13">{relDate(p.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Ledger / voucher transactions for this order */}
      <Section
        title={`Transactions on this order (${ledger.length})`}
        sub="Redemptions, buy-backs, corrections"
      >
        {ledger.length === 0 ? (
          <div className="empty" style={{ padding: 28 }}>
            <Icon name="swap" size={24} />
            <h4>No transactions linked</h4>
            <p>This order hasn't had any voucher redemptions or balance moves.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="t">
              <thead><tr><th>Transaction</th><th>Type</th><th className="hide-mobile">Place</th><th className="hide-mobile">Voucher</th><th className="txt-right">Value</th><th>Date</th></tr></thead>
              <tbody>
                {ledger.map(l => (
                  <tr key={l.id} onClick={() => setOpenLedger(l)}>
                    <td className="mono fw-600">{l.id}</td>
                    <td><LedgerTypeBadge type={l.type} /></td>
                    <td className="hide-mobile text-2 fs-13">{l.place}</td>
                    <td className="hide-mobile mono fs-12 text-3">{l.voucher || '—'}</td>
                    <td className="txt-right"><LedgerValue value={l.value} /></td>
                    <td className="text-3 fs-13">{relDate(l.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <TransactionDetailModal txn={openTxn} onClose={() => setOpenTxn(null)} onOrder={() => setOpenTxn(null)} onCustomer={(id) => { setOpenTxn(null); onNavigate('customer-detail', id); }} />
      <LedgerDetailModal entry={openLedger} onClose={() => setOpenLedger(null)} onNavigate={(r, id) => { setOpenLedger(null); onNavigate(r, id); }} />
    </div>
  );
}

/* =================== LEDGER / VOUCHER TRANSACTIONS PAGE =================== */
function LedgerPage({ onNavigate, addToast }) {
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [accountFilter, setAccountFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('30d'); // 7d / 30d / 90d / all
  const [openEntry, setOpenEntry] = React.useState(null);

  const dayMs = 86400000;
  const filtered = LEDGER.filter(l => {
    if (typeFilter !== 'all' && l.type !== typeFilter) return false;
    if (accountFilter !== 'all' && l.accountId !== accountFilter) return false;
    if (dateFilter !== 'all') {
      const days = dateFilter === '7d' ? 7 : dateFilter === '30d' ? 30 : 90;
      if (Date.now() - new Date(l.date).getTime() > days * dayMs) return false;
    }
    if (!search) return true;
    const s = search.toLowerCase();
    return (l.id + (l.voucher || '') + l.place + l.accountId + (l.orderId || '')).toLowerCase().includes(s);
  });

  // KPIs for filtered set
  const totalCredit = filtered.filter(l => l.value > 0).reduce((s, l) => s + l.value, 0);
  const totalDebit  = filtered.filter(l => l.value < 0).reduce((s, l) => s + l.value, 0);
  const net = totalCredit + totalDebit;
  const redemptions = filtered.filter(l => l.type === 'redemption').length;

  return (
    <div data-screen-label="Transactions">
      <div className="page-head">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-sub">Redemptions, buy-backs, ping in/out and corrections across all accounts.</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" icon="download">Export CSV</Button>
          <Button icon="plus" onClick={() => addToast?.({ msg: 'New transaction form…' })}>New transaction</Button>
        </div>
      </div>

      <div className="kpi-row" style={{ marginBottom: 20 }}>
        <KPI label="Net movement" value={fmtMoney(Math.abs(net))} delta={net >= 0 ? 'Net credit' : 'Net debit'} deltaDir={net >= 0 ? 'up' : 'down'} />
        <KPI label="Credits (in)" value={fmtMoney(totalCredit)} delta="ping in + buy back" />
        <KPI label="Debits (out)" value={fmtMoney(Math.abs(totalDebit))} delta="redemption + ping out" />
        <KPI label="Redemptions" value={redemptions} delta="this period" />
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="input-with-icon" style={{ flex: 1, minWidth: 200, maxWidth: 360 }}>
            <span className="input-icon"><Icon name="search" size={16} /></span>
            <input className="input" placeholder="Search by ID, voucher, account, order…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="select" style={{ width: 'auto', height: 36 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All types</option>
            {LEDGER_TYPES.map(t => <option key={t} value={t}>{LEDGER_TYPE_META[t].label}</option>)}
          </select>
          <select className="select" style={{ width: 'auto', height: 36 }} value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}>
            <option value="all">All accounts</option>
            <optgroup label="Primary">
              {ACCOUNTS.filter(a => a.type === 'primary').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </optgroup>
            <optgroup label="Secondary">
              {ACCOUNTS.filter(a => a.type === 'secondary').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </optgroup>
          </select>
          <Segmented value={dateFilter} onChange={setDateFilter} options={[{value:'7d',label:'7d'},{value:'30d',label:'30d'},{value:'90d',label:'90d'},{value:'all',label:'All'}]} />
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <Icon name="swap" size={28} />
            <h4>No transactions match those filters</h4>
            <p>Try clearing the search or expanding the date range.</p>
            <Button variant="secondary" onClick={() => { setSearch(''); setTypeFilter('all'); setAccountFilter('all'); setDateFilter('all'); }}>Reset filters</Button>
          </div>
        ) : (
          <div className="txn-tile-grid">
            {filtered.slice(0, 30).map(l => {
              const account = getAccount(l.accountId);
              const vip = isVipVoucher(l.voucher);
              return (
                <button key={l.id} className={'txn-tile' + (vip ? ' vip' : '')} onClick={() => setOpenEntry(l)}>
                  <div className="txn-tile-head">
                    <LedgerTypeBadge type={l.type} />
                    <LedgerValue value={l.value} />
                  </div>
                  <div className="txn-tile-account">
                    <span className={'acc-icon ' + (account.type === 'primary' ? 'primary' : 'secondary')} style={{ width: 28, height: 28, borderRadius: 7 }}>
                      <Icon name={account.type === 'primary' ? 'building' : 'box'} size={12} />
                    </span>
                    <div className="txn-tile-account-text">
                      <div className="fw-600 fs-13" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{account?.name}</div>
                      <div className="text-3 fs-12 mono">{l.accountId}</div>
                    </div>
                  </div>
                  <div className="txn-tile-meta">
                    <div className="txn-tile-meta-row">
                      <span className="dl-label">Place</span>
                      <span className="fs-13">{l.place}</span>
                    </div>
                    <div className="txn-tile-meta-row">
                      <span className="dl-label">Voucher</span>
                      <span><VoucherChip code={l.voucher} /></span>
                    </div>
                  </div>
                  <div className="txn-tile-foot">
                    <span className="mono fs-12 text-3">{l.id}</span>
                    <span className="text-3 fs-12">{relDate(l.date)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        <div className="pagination">
          <span>Showing <strong style={{ color: 'var(--text)' }}>1</strong>–<strong style={{ color: 'var(--text)' }}>{Math.min(30, filtered.length)}</strong> of {filtered.length}</span>
        </div>
      </div>

      <LedgerDetailModal entry={openEntry} onClose={() => setOpenEntry(null)} onNavigate={(r, id) => { setOpenEntry(null); onNavigate(r, id); }} />
    </div>
  );
}

function LedgerTypeBadge({ type }) {
  const meta = LEDGER_TYPE_META[type];
  return (
    <span className={'badge ' + meta.tone} style={{ gap: 4 }}>
      <Icon name={meta.icon} size={11} />
      {meta.label}
    </span>
  );
}

function LedgerValue({ value, big }) {
  const positive = value > 0;
  return (
    <span className="mono fw-700" style={{
      color: value === 0 ? 'var(--text)' : positive ? 'var(--success)' : 'var(--danger)',
      fontSize: big ? 28 : 13.5,
      letterSpacing: big ? '-.02em' : 0,
    }}>
      {positive ? '+' : value === 0 ? '' : '−'}{fmtMoney(Math.abs(value))}
    </span>
  );
}

function LedgerDetailModal({ entry, onClose, onNavigate }) {
  if (!entry) return null;
  const account = getAccount(entry.accountId);
  const meta = LEDGER_TYPE_META[entry.type];
  return (
    <Modal
      open={!!entry}
      onClose={onClose}
      title={null}
      width={520}
      foot={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="secondary" icon="copy">Copy ID</Button>
          {entry.type === 'redemption' && <Button variant="secondary" icon="refresh">Reverse</Button>}
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div className="dl-label">Transaction</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{entry.id}</span>
            <LedgerTypeBadge type={entry.type} />
          </div>
        </div>

        <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 18, border: '1px solid var(--border)' }}>
          <div className="dl-label">Value</div>
          <div style={{ marginTop: 4 }}>
            <LedgerValue value={entry.value} big />
          </div>
          <div className="text-3 fs-12" style={{ marginTop: 4 }}>{entry.currency} · {fmtDate(entry.date)} · by {entry.operator}</div>
        </div>

        <button
          onClick={() => onNavigate('account-detail', account.id)}
          className="acc-owner-row"
          style={{ borderRadius: 10, border: '1px solid var(--border)' }}
        >
          <span className={'acc-icon ' + (account.type === 'primary' ? 'primary' : 'secondary')} style={{ width: 40, height: 40 }}>
            <Icon name={account.type === 'primary' ? 'building' : 'box'} size={16} />
          </span>
          <div className="acc-owner-text">
            <div className="acc-owner-name" style={{ fontSize: 14 }}>{account.name}</div>
            <div className="acc-owner-meta">
              <Badge tone={account.type === 'primary' ? 'brand' : 'ghost'} dot>{account.type === 'primary' ? 'Primary' : 'Secondary'}</Badge>
              {' · '}<span className="mono">{account.id}</span>
            </div>
          </div>
          <Icon name="chevron-right" size={16} color="var(--text-3)" />
        </button>

        {entry.orderId && (
          <button
            onClick={() => onNavigate('order-detail', entry.orderId)}
            className="acc-owner-row"
            style={{ borderRadius: 10, border: '1px solid var(--border)' }}
          >
            <span className="acc-icon primary" style={{ width: 40, height: 40, background: 'var(--ink)', borderRadius: 10 }}>
              <Icon name="orders" size={16} />
            </span>
            <div className="acc-owner-text">
              <div className="acc-owner-name" style={{ fontSize: 14 }}>Related order</div>
              <div className="acc-owner-meta mono">{entry.orderId}</div>
            </div>
            <Icon name="chevron-right" size={16} color="var(--text-3)" />
          </button>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div className="dl-label">Place</div>
            <div className="fs-13 fw-600" style={{ marginTop: 4 }}>{entry.place}</div>
          </div>
          {entry.voucher && (
            <div>
              <div className="dl-label">Voucher</div>
              <div className="mono fw-600" style={{ marginTop: 4, fontSize: 13 }}>{entry.voucher}</div>
            </div>
          )}
        </div>

        {entry.note && (
          <div>
            <div className="dl-label">Note</div>
            <div className="fs-13 text-2" style={{ marginTop: 4, padding: 10, borderRadius: 8, background: 'var(--surface-2)' }}>{entry.note}</div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* =================== EMAILS =================== */
function EmailsPage({ onNavigate, addToast, initialAccountFilter }) {
  const [accountFilter, setAccountFilter] = React.useState(initialAccountFilter || 'all');
  const [search, setSearch] = React.useState('');
  const [readFilter, setReadFilter] = React.useState('all'); // all / unread / starred
  const [openEmail, setOpenEmail] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState(new Date(Date.now() - 4 * 60 * 1000).toISOString());

  // Pull-to-refresh state
  const [pullY, setPullY] = React.useState(0);
  const pullTriggered = React.useRef(false);
  const startY = React.useRef(null);
  const containerRef = React.useRef(null);
  const PULL_THRESHOLD = 70;

  React.useEffect(() => { setAccountFilter(initialAccountFilter || 'all'); }, [initialAccountFilter]);

  const filtered = EMAILS.filter(e => {
    if (accountFilter !== 'all' && e.accountId !== accountFilter) return false;
    if (readFilter === 'unread' && !e.unread) return false;
    if (readFilter === 'starred' && !e.starred) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (e.subject + e.preview + e.from.name + e.from.email).toLowerCase().includes(s);
  });

  function doRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastSync(new Date().toISOString());
      addToast?.({ msg: 'Inbox synced', tone: 'success' });
    }, 1100);
  }

  function onTouchStart(e) {
    if (refreshing) return;
    if (containerRef.current && containerRef.current.scrollTop > 0) return;
    if (window.scrollY > 0) return;
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
    pullTriggered.current = false;
  }
  function onTouchMove(e) {
    if (startY.current == null || refreshing) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const dy = y - startY.current;
    if (dy <= 0) { setPullY(0); return; }
    // dampened pull
    const damped = Math.min(120, dy * 0.55);
    setPullY(damped);
    if (damped >= PULL_THRESHOLD) pullTriggered.current = true;
    if (e.touches && e.cancelable) e.preventDefault();
  }
  function onTouchEnd() {
    if (pullTriggered.current && !refreshing) {
      doRefresh();
    }
    setPullY(0);
    startY.current = null;
    pullTriggered.current = false;
  }

  const indicatorReady = pullY >= PULL_THRESHOLD;

  return (
    <div data-screen-label="Emails" className="emails-shell">
      <div className="page-head">
        <div>
          <h1 className="page-title">Emails {accountFilter !== 'all' && <span className="text-3" style={{ fontWeight: 500, fontSize: 14 }}>· {getAccount(accountFilter)?.name}</span>}</h1>
          <p className="page-sub">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--success)' }} />
              Synced from <strong style={{ color: 'var(--text-2)' }}>mailbox.api</strong> · last fetch {relDate(lastSync)}
            </span>
          </p>
        </div>
        <div className="page-actions">
          {accountFilter !== 'all' && (
            <Button variant="ghost" size="sm" icon="close" onClick={() => { setAccountFilter('all'); onNavigate('emails', null); }}>Clear account filter</Button>
          )}
          <Button variant="secondary" icon={refreshing ? null : 'refresh'} disabled={refreshing} onClick={doRefresh}>
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="card" style={{ padding: 10, marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, minWidth: 200, maxWidth: 360 }}>
          <span className="input-icon"><Icon name="search" size={16} /></span>
          <input className="input" placeholder="Search emails…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select" style={{ width: 'auto', height: 36 }} value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}>
          <option value="all">All accounts</option>
          <optgroup label="Primary">
            {ACCOUNTS.filter(a => a.type === 'primary').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </optgroup>
          <optgroup label="Secondary">
            {ACCOUNTS.filter(a => a.type === 'secondary').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </optgroup>
        </select>
        <Segmented value={readFilter} onChange={setReadFilter} options={[{value:'all',label:'All'},{value:'unread',label:'Unread'},{value:'starred',label:'Starred'}]} />
      </div>

      {/* Pull-to-refresh indicator + email list */}
      <div
        ref={containerRef}
        className="emails-list-wrap"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={(e) => startY.current != null && onTouchMove(e)}
        onMouseUp={onTouchEnd}
        onMouseLeave={() => { if (startY.current != null) onTouchEnd(); }}
        style={{ touchAction: pullY > 0 ? 'none' : 'auto' }}
      >
        <div
          className={'ptr-indicator' + (indicatorReady ? ' ready' : '') + (refreshing ? ' refreshing' : '')}
          style={{
            height: refreshing ? 56 : Math.min(pullY, 80),
            opacity: pullY > 0 || refreshing ? 1 : 0,
          }}
        >
          {refreshing ? (
            <div className="lion-loader-stack" style={{ flexDirection: 'row', gap: 8 }}>
              <div className="lion-loader-ring" style={{ width: 28, height: 28 }}>
                <LionMark size={20} animated />
              </div>
              <span className="fs-13 fw-600 text-2">Fetching from mailbox.api…</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', fontSize: 13, fontWeight: 600 }}>
              <Icon name={indicatorReady ? 'check' : 'arrow-down'} size={16} />
              {indicatorReady ? 'Release to refresh' : 'Pull down to refresh'}
            </div>
          )}
        </div>

        <div
          className="card emails-list"
          style={{ transform: `translateY(${pullY}px)`, transition: pullY === 0 ? 'transform .25s cubic-bezier(.3,.7,.4,1)' : 'none' }}
        >
          {filtered.length === 0 ? (
            <div className="empty" style={{ padding: 48 }}>
              <Icon name="mail" size={28} />
              <h4>Inbox is clear</h4>
              <p>No emails match those filters.</p>
            </div>
          ) : filtered.map(e => {
            const acc = getAccount(e.accountId);
            return (
              <button key={e.id} className={'email-row' + (e.unread ? ' unread' : '')} onClick={() => setOpenEmail(e)}>
                <span className="email-dot" />
                <Avatar name={e.from.name} size="sm" />
                <div className="email-body">
                  <div className="email-meta-line">
                    <span className="email-from">{e.from.name}</span>
                    {e.labels.map(l => <Badge key={l} tone={l === 'Billing' ? 'brand' : l === 'Support' ? 'info' : 'ghost'}>{l}</Badge>)}
                    <span className="email-acct text-3">· <span className="mono">{acc?.id}</span></span>
                    <span className="email-time text-3">{relDate(e.receivedAt)}</span>
                  </div>
                  <div className="email-subject">{e.subject}</div>
                  <div className="email-preview">{e.preview}</div>
                </div>
                <div className="email-flags">
                  {e.starred && <Icon name="star" size={14} color="var(--warning)" />}
                  {e.hasAttachment && <Icon name="paperclip" size={14} color="var(--text-3)" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <EmailDetailModal email={openEmail} onClose={() => setOpenEmail(null)} onNavigate={(r, id) => { setOpenEmail(null); onNavigate(r, id); }} />
    </div>
  );
}

function EmailDetailModal({ email, onClose, onNavigate }) {
  if (!email) return null;
  const account = getAccount(email.accountId);
  return (
    <Modal
      open={!!email}
      onClose={onClose}
      title={null}
      width={640}
      foot={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="secondary" icon="external">Open in mailbox</Button>
          <Button icon="mail">Reply</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-.01em' }}>{email.subject}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            {email.labels.map(l => <Badge key={l} tone={l === 'Billing' ? 'brand' : l === 'Support' ? 'info' : 'ghost'}>{l}</Badge>)}
            <span className="text-3 fs-12">· {fmtDate(email.receivedAt)} {new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <Avatar name={email.from.name} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="fw-700">{email.from.name}</div>
            <div className="fs-12 text-3">{email.from.email}</div>
          </div>
          {email.starred && <Icon name="star" size={16} color="var(--warning)" />}
        </div>

        <button onClick={() => onNavigate('account-detail', account.id)} className="acc-owner-row" style={{ borderRadius: 10, border: '1px solid var(--border)', padding: 12 }}>
          <span className={'acc-icon ' + (account.type === 'primary' ? 'primary' : 'secondary')} style={{ width: 36, height: 36 }}>
            <Icon name={account.type === 'primary' ? 'building' : 'box'} size={14} />
          </span>
          <div className="acc-owner-text">
            <div className="acc-owner-name" style={{ fontSize: 13 }}>Linked to {account.name}</div>
            <div className="acc-owner-meta mono">{account.id}</div>
          </div>
          <Icon name="chevron-right" size={16} color="var(--text-3)" />
        </button>

        <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
          {email.preview}
          <p className="text-3" style={{ marginTop: 14, fontSize: 13 }}>— {email.from.name}</p>
        </div>

        {email.hasAttachment && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface-2)' }}>
            <Icon name="paperclip" size={16} color="var(--text-2)" />
            <div style={{ flex: 1 }}>
              <div className="fw-600 fs-13">invoice-may-2026.pdf</div>
              <div className="fs-12 text-3">124 KB · PDF</div>
            </div>
            <Button variant="ghost" size="sm" icon="download">Download</Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* =================== VOUCHERS MODAL =================== */
function VouchersModal({ accountId, open, onClose }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  if (!open) return null;
  const account = getAccount(accountId);
  const all = vouchersForAccount(accountId);
  const balance = voucherBalance(accountId);
  const filtered = all.filter(v => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (!search) return true;
    return v.code.toLowerCase().includes(search.toLowerCase());
  });
  const pct = balance.total > 0 ? (balance.available / balance.total) * 100 : 0;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={null}
      width={620}
      foot={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="secondary" icon="plus">Issue voucher</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Vouchers · {account.name}</h3>
          <p className="text-3 fs-13" style={{ margin: '4px 0 0' }}>{balance.count} issued · {balance.activeCount} active</p>
        </div>

        {/* Balance summary */}
        <div className="voucher-balance">
          <div>
            <div className="dl-label">Available</div>
            <div className="voucher-big-num" style={{ color: 'var(--success)' }}>{fmtMoney(balance.available)}</div>
            <div className="text-3 fs-12">of <span className="fw-600">{fmtMoney(balance.total)}</span> total issued</div>
          </div>
          <div className="voucher-bar">
            <div className="voucher-bar-fill" style={{ width: pct + '%' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="dl-label">Redeemed</div>
            <div className="fw-700 mono">{fmtMoney(balance.redeemed)}</div>
            <div className="text-3 fs-12">{balance.total > 0 ? Math.round((balance.redeemed/balance.total) * 100) : 0}% of total</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div className="input-with-icon" style={{ flex: 1, minWidth: 180 }}>
            <span className="input-icon"><Icon name="search" size={16} /></span>
            <input className="input" placeholder="Search by voucher code…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="select" style={{ width: 'auto', height: 40 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="redeemed">Redeemed</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="voucher-list">
          {filtered.length === 0 ? (
            <div className="empty" style={{ padding: 24 }}>
              <h4 style={{ marginBottom: 0 }}>No vouchers found</h4>
              <p>Try a different code or clear the status filter.</p>
            </div>
          ) : filtered.map(v => (
            <div key={v.id} className="voucher-row">
              <div className="voucher-code">
                <Icon name="voucher" size={16} color="var(--text-3)" />
                <span className="mono fw-700">{v.code}</span>
              </div>
              <div>
                <div className="dl-label">Issued</div>
                <div className="mono fs-13">{fmtMoney(v.issued)}</div>
              </div>
              <div>
                <div className="dl-label">Remaining</div>
                <div className="mono fs-13 fw-700" style={{ color: v.remaining > 0 ? 'var(--success)' : 'var(--text-3)' }}>{fmtMoney(v.remaining)}</div>
              </div>
              <div>
                <div className="dl-label">Expires</div>
                <div className="fs-12 text-2">{fmtDate(v.expiresAt)}</div>
              </div>
              <StatusBadge status={v.status === 'active' ? 'active' : v.status === 'expired' ? 'churned' : 'fulfilled'} />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, {
  DashboardPage, CustomersPage, CustomerDetailPage,
  OrdersPage, OrderDetailPage, ProductsPage, TransactionsPage, ProfilePage,
  AccountsPage, AccountDetailPage, ApiDocsPage, LedgerPage,
  EmailsPage, EmailDetailModal, VouchersModal,
});
