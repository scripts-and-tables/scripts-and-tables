/* ============================================================
   App shell — Sidebar, Topbar, Mobile drawer, Theme toggle
   ============================================================ */

const NAV_GROUPS = [
  {
    label: 'Operate',
    items: [
      { id: 'dashboard',    label: 'Dashboard',     icon: 'dashboard' },
      { id: 'orders',       label: 'Orders',        icon: 'orders',   badge: '12' },
      { id: 'payments',     label: 'Payments',      icon: 'card' },
      { id: 'transactions', label: 'Transactions',  icon: 'swap' },
      { id: 'emails',       label: 'Emails',        icon: 'mail',     badge: '4' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { id: 'accounts',     label: 'Accounts',      icon: 'accounts' },
      { id: 'products',     label: 'Products',      icon: 'products' },
      { id: 'customers',    label: 'Customers',     icon: 'users' },
    ],
  },
  {
    label: 'Developer',
    items: [
      { id: 'api-docs',     label: 'API & sync',    icon: 'code' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'profile',      label: 'My profile',    icon: 'profile' },
    ],
  },
];

function Sidebar({ route, onNavigate, mobileOpen, onCloseMobile, isMobile, onLogout, theme, onToggleTheme, collapsed, onToggleCollapse }) {
  const cls = ['sidebar', isMobile && 'mobile', mobileOpen && 'open', collapsed && !isMobile && 'collapsed'].filter(Boolean).join(' ');
  return (
    <aside className={cls}>
      {!isMobile && (
        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <Icon name="chevron-left" size={14} />
        </button>
      )}
      <div className="sidebar-head">
        <BrandLockup />
        {isMobile && (
          <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={onCloseMobile} aria-label="Close menu">
            <Icon name="close" />
          </button>
        )}
      </div>

      <div className="sidebar-nav">
        {NAV_GROUPS.map(group => (
          <React.Fragment key={group.label}>
            <div className="sidebar-section">{group.label}</div>
            {group.items.map(item => (
              <a
                key={item.id}
                data-label={item.label}
                className={'nav-item' + (
                  route === item.id ||
                  (item.id === 'customers' && route === 'customer-detail') ||
                  (item.id === 'accounts' && route === 'account-detail') ||
                  (item.id === 'orders' && route === 'order-detail')
                  ? ' active' : '')}
                onClick={(e) => { e.preventDefault(); onNavigate(item.id); onCloseMobile?.(); }}
                href={`#${item.id}`}
              >
                <span className="nav-icon"><Icon name={item.icon} /></span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </a>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)' }}>
        <button
          className="nav-item"
          data-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          style={{ width: '100%', textAlign: 'left' }}
          onClick={onToggleTheme}
        >
          <span className="nav-icon"><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></span>
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <button
          className="nav-item"
          data-label="Sign out"
          style={{ width: '100%', textAlign: 'left' }}
          onClick={onLogout}
        >
          <span className="nav-icon"><Icon name="logout" /></span>
          <span>Sign out</span>
        </button>
      </div>

      <div className="sidebar-foot">
        <Avatar name={ADMIN.name} />
        <div className="me-info">
          <div className="me-name">{ADMIN.name}</div>
          <div className="me-role">{ADMIN.role}</div>
        </div>
        <button className="icon-btn" aria-label="Account menu" onClick={() => onNavigate('profile')}>
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </aside>
  );
}

/* --- Topbar --- */
function Topbar({ title, onOpenMobile, isMobile, onNavigate, route, syncState, onSyncNow }) {
  const [searchValue, setSearchValue] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const matches = searchValue.trim() ?
    [
      ...CUSTOMERS.filter(c => (c.name + c.company + c.email).toLowerCase().includes(searchValue.toLowerCase())).slice(0, 4).map(c => ({ kind: 'customer', item: c })),
      ...PRODUCTS.filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase())).slice(0, 3).map(p => ({ kind: 'product', item: p })),
      ...ORDERS.filter(o => o.id.toLowerCase().includes(searchValue.toLowerCase())).slice(0, 3).map(o => ({ kind: 'order', item: o })),
    ] : [];

  return (
    <div className="topbar">
      {isMobile && (
        <button className="icon-btn" onClick={onOpenMobile} aria-label="Open menu">
          <Icon name="menu" />
        </button>
      )}
      {isMobile && <div className="topbar-title">{title}</div>}
      {!isMobile && <div className="topbar-title">{title}</div>}

      <div className="topbar-search hide-mobile" style={{ position: 'relative' }}>
        <span className="topbar-search-icon"><Icon name="search" size={16} /></span>
        <input
          ref={inputRef}
          placeholder="Search customers, orders, products…"
          value={searchValue}
          onChange={(e) => { setSearchValue(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
        />
        <kbd>⌘K</kbd>

        {searchOpen && matches.length > 0 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, boxShadow: 'var(--shadow-lg)', padding: 6, zIndex: 60, maxHeight: 360, overflowY: 'auto',
          }}>
            {matches.map((m, i) => (
              <button
                key={i}
                onMouseDown={(e) => { e.preventDefault(); }}
                onClick={() => {
                  setSearchValue('');
                  setSearchOpen(false);
                  if (m.kind === 'customer') onNavigate('customer-detail', m.item.id);
                  if (m.kind === 'product') onNavigate('products');
                  if (m.kind === 'order') onNavigate('orders');
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '8px 10px', borderRadius: 8,
                  textAlign: 'left', fontSize: 13, color: 'var(--text)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {m.kind === 'customer' && <><Avatar name={m.item.name} size="sm" /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600 }}>{m.item.name}</div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>{m.item.company} · {m.item.email}</div></div><Badge tone="ghost">Customer</Badge></>}
                {m.kind === 'product' && <><div style={{ width: 26, height: 26, borderRadius: 6, background: m.item.tint, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{m.item.glyph}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600 }}>{m.item.name}</div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmtMoney(m.item.price)} · {m.item.category}</div></div><Badge tone="ghost">Product</Badge></>}
                {m.kind === 'order' && <><span className="mono" style={{ width: 26, color: 'var(--text-3)' }}>#</span><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600 }} className="mono">{m.item.id}</div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>{m.item.customer.name} · {fmtMoney(m.item.total)}</div></div><Badge tone="ghost">Order</Badge></>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="topbar-spacer hide-mobile" />

      {isMobile && (
        <button className="icon-btn" aria-label="Search" style={{ marginLeft: 'auto' }} onClick={() => onNavigate('search')}>
          <Icon name="search" />
        </button>
      )}
      <a
        className="btn secondary sm hide-mobile"
        href="mobile-preview.html"
        title="Open mobile/tablet preview"
        style={{ textDecoration: 'none' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg>
        Mobile preview
      </a>
      <SyncPill syncState={syncState} onSyncNow={onSyncNow} onOpenDocs={() => onNavigate('api-docs')} />
      <button className="icon-btn hide-mobile" aria-label="Help">
        <Icon name="help" />
      </button>
      <button
        className="icon-btn show-mobile"
        aria-label="Profile"
        onClick={() => onNavigate('profile')}
        style={{ padding: 0 }}
      >
        <Avatar name={ADMIN.name} size="sm" />
      </button>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, NAV_GROUPS });
