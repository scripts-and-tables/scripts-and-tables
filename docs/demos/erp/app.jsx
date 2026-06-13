/* ============================================================
   App root — auth gate, theme, routing
   ============================================================ */

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  'customer-detail': 'Customer',
  accounts: 'Accounts',
  'account-detail': 'Account',
  orders: 'Orders',
  'order-detail': 'Order',
  products: 'Products',
  payments: 'Payments',
  transactions: 'Transactions',
  emails: 'Emails',
  profile: 'My profile',
  'api-docs': 'API & sync',
};

function App() {
  // Brief boot splash — animated lion + ring while we hydrate
  const [booting, setBooting] = React.useState(true);
  React.useEffect(() => {
    const id = setTimeout(() => setBooting(false), 700);
    return () => clearTimeout(id);
  }, []);

  // Auth — start at login. Demo creds are pre-filled so user can just click "Sign in".
  // When embedded in the Mobile Preview iframe (?demo=1), skip the login screen.
  const skipAuth = (() => {
    try { return new URLSearchParams(window.location.search).get('demo') === '1' || window.self !== window.top; }
    catch { return false; }
  })();
  const [authStep, setAuthStep] = React.useState('auth-login');
  const [authedRoute, setAuthedRoute] = React.useState('dashboard');
  const [authed, setAuthed] = React.useState(skipAuth);
  const [authData, setAuthData] = React.useState({ email: 'asha@erp-lite.app' });

  // Theme
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem('erp-theme') || 'light'; } catch { return 'light'; }
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('erp-theme', theme); } catch {}
  }, [theme]);

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 960);
  // Desktop sidebar collapse — persist in localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    try { return localStorage.getItem('erp-sidebar-collapsed') === '1'; } catch { return false; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('erp-sidebar-collapsed', sidebarCollapsed ? '1' : '0'); } catch {}
  }, [sidebarCollapsed]);
  React.useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 960);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  React.useEffect(() => {
    if (mobileOpen) document.body.classList.add('drawer-open');
    else document.body.classList.remove('drawer-open');
  }, [mobileOpen]);

  // Customer detail param
  const [detailId, setDetailId] = React.useState(null);
  const [accountDetailId, setAccountDetailId] = React.useState(null);
  const [orderDetailId, setOrderDetailId] = React.useState(null);
  const [emailFilterAccountId, setEmailFilterAccountId] = React.useState(null);

  // Sync state — last inbound (data pushed to ERP) / outbound (data fetched out)
  const [syncState, setSyncState] = React.useState(() => ({
    lastInboundSync: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    lastOutboundSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    lastInboundCount: 142,
    lastOutboundCount: 89,
    health: 'live',
  }));
  // tick to make "Xm ago" labels refresh
  const [, tick] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  function syncNow() {
    setSyncState(s => ({
      ...s,
      lastInboundSync: new Date().toISOString(),
      lastOutboundSync: new Date().toISOString(),
      lastInboundCount: 140 + Math.floor(Math.random() * 20),
      lastOutboundCount: 80 + Math.floor(Math.random() * 20),
    }));
  }

  // Cross-window route jump (used by Mobile Preview.html buttons)
  React.useEffect(() => {
    function handler(e) {
      const route = e.data && e.data.erpRoute;
      if (!route) return;
      setAuthed(true);
      setAuthedRoute(route);
    }
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Toasts
  const [toasts, setToasts] = React.useState([]);
  function addToast(t) {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts, { ...t, id }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 2600);
  }

  function navigate(route, param) {
    if (route === 'customer-detail') { setDetailId(param); }
    if (route === 'account-detail') { setAccountDetailId(param); }
    if (route === 'order-detail') { setOrderDetailId(param); }
    if (route === 'emails') { setEmailFilterAccountId(param || null); }
    if (route?.startsWith('auth-')) {
      if (param) setAuthData(d => ({ ...d, email: param }));
      setAuthStep(route);
      return;
    }
    setAuthedRoute(route);
    window.scrollTo({ top: 0 });
  }

  function login() {
    setAuthed(true);
    setAuthedRoute('dashboard');
  }
  function logout() {
    setAuthed(false);
    setAuthStep('auth-login');
    addToast({ msg: 'Signed out', tone: '' });
  }

  // -------- Auth flow --------
  if (booting) {
    return <LionLoader overlay size={96} label="ERP Lite" />;
  }
  if (!authed) {
    let page;
    if (authStep === 'auth-forgot') page = <ForgotPage onNavigate={navigate} addToast={addToast} />;
    else if (authStep === 'auth-otp') page = <OTPPage email={authData.email} onNavigate={navigate} addToast={addToast} />;
    else if (authStep === 'auth-reset') page = <ResetPage onNavigate={navigate} addToast={addToast} />;
    else page = <LoginPage onLogin={login} onNavigate={navigate} addToast={addToast} />;
    return (
      <>
        {page}
        <ToastStack toasts={toasts} />
        <ThemeMiniToggle theme={theme} onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      </>
    );
  }

  // -------- Authed shell --------
  let content;
  switch (authedRoute) {
    case 'customers':         content = <CustomersPage onNavigate={navigate} addToast={addToast} />; break;
    case 'customer-detail':   content = <CustomerDetailPage customerId={detailId} onNavigate={navigate} addToast={addToast} />; break;
    case 'accounts':          content = <AccountsPage onNavigate={navigate} addToast={addToast} />; break;
    case 'account-detail':    content = <AccountDetailPage accountId={accountDetailId} onNavigate={navigate} addToast={addToast} />; break;
    case 'orders':            content = <OrdersPage onNavigate={navigate} />; break;
    case 'order-detail':      content = <OrderDetailPage orderId={orderDetailId} onNavigate={navigate} addToast={addToast} />; break;
    case 'products':          content = <ProductsPage addToast={addToast} />; break;
    case 'payments':          content = <TransactionsPage onNavigate={navigate} />; break;
    case 'transactions':      content = <LedgerPage onNavigate={navigate} addToast={addToast} />; break;
    case 'emails':            content = <EmailsPage onNavigate={navigate} addToast={addToast} initialAccountFilter={emailFilterAccountId} />; break;
    case 'profile':           content = <ProfilePage addToast={addToast} />; break;
    case 'api-docs':          content = <ApiDocsPage syncState={syncState} onSyncNow={syncNow} addToast={addToast} />; break;
    case 'dashboard':
    default:                  content = <DashboardPage onNavigate={navigate} />; break;
  }

  const title = authedRoute === 'customer-detail'
    ? (CUSTOMERS.find(c => c.id === detailId)?.name || 'Customer')
    : authedRoute === 'account-detail'
    ? (ACCOUNTS.find(a => a.id === accountDetailId)?.name || 'Account')
    : authedRoute === 'order-detail'
    ? (ORDERS.find(o => o.id === orderDetailId)?.id || 'Order')
    : (PAGE_TITLES[authedRoute] || 'Dashboard');

  return (
    <div className={'app-shell' + (sidebarCollapsed && !isMobile ? ' collapsed' : '')}>
      {!isMobile ? (
        <Sidebar
          route={authedRoute}
          onNavigate={navigate}
          theme={theme}
          onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          onLogout={logout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />
      ) : (
        <>
          <div className={'sidebar-mobile-backdrop' + (mobileOpen ? ' open' : '')} onClick={() => setMobileOpen(false)} />
          <Sidebar
            route={authedRoute}
            onNavigate={navigate}
            isMobile
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
            theme={theme}
            onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            onLogout={logout}
          />
        </>
      )}
      <div className="app-main">
        <Topbar
          title={title}
          isMobile={isMobile}
          onOpenMobile={() => setMobileOpen(true)}
          onNavigate={navigate}
          route={authedRoute}
          syncState={syncState}
          onSyncNow={syncNow}
        />
        <main className="app-content">{content}</main>
      </div>
      <ToastStack toasts={toasts} />
    </div>
  );
}

/* small fixed-corner theme toggle for auth screens */
function ThemeMiniToggle({ theme, onToggle }) {
  return (
    <button
      className="icon-btn"
      onClick={onToggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      style={{
        position: 'fixed', bottom: 16, right: 16,
        background: 'var(--surface)', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)', zIndex: 200,
      }}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
