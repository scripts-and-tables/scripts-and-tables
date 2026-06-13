/* Root app — routing, theme, layout, tweaks. */
const { useState: useStateR } = React;
const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor } = window;

const WORDMARK = {
  home: 'ONE', targets: 'SALES TARGETS', msl: 'FOCUS SKUS', discounts: 'DISCOUNTS', catalog: 'CATALOG',
  epos: 'EXCEL REPORTS', performance: 'PERFORMANCE', orchestration: 'DATA PIPELINE',
  emails: 'NOTIFICATIONS', easyflow: 'PROCESS MASTER', analytics: 'ANALYTICS', tools: 'TOOLS', api: 'API', account: 'ACCOUNT',
  welcome: 'WELCOME', projects: 'PROJECTS',
};

const APP_STYLE_MAP = { 'Rows': 'rows', 'Compact': 'compact', 'Cards': 'cards' };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "appStyle": "Compact",
  "accent": "#0d6efd"
}/*EDITMODE-END*/;

function Placeholder({ app }) {
  return React.createElement(Page, { max: 760 },
    React.createElement('div', { style: { textAlign: 'center', padding: '60px 0' } },
      React.createElement('div', { style: { display: 'inline-block', marginBottom: 22 } }, React.createElement(IconTile, { icon: app.icon, color: app.color, size: 80, radius: 20, iconSize: 38 })),
      React.createElement('h1', { style: { fontSize: 28, fontWeight: 700, marginBottom: 10 } }, app.name),
      React.createElement('p', { style: { fontSize: 16.5, color: 'var(--muted)', maxWidth: 460, margin: '0 auto 26px' } },
        'This app exists in One. Tell me what its primary screens should do and I’ll design it next — the shell, navigation and design system are already in place.'),
      React.createElement('div', { style: { display: 'inline-flex' } }, React.createElement(Button, { icon: 'sparkles', variant: 'outline' }, 'Design this app'))
    )
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [dark, setDark] = useStateR(() => localStorage.getItem('one-dark') === '1');
  const [route, setRoute] = useStateR(() => localStorage.getItem('one-route') || 'home');
  const [sub, setSub] = useStateR(null);

  React.useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('one-dark', dark ? '1' : '0'); }, [dark]);
  React.useEffect(() => { localStorage.setItem('one-route', route); }, [route]);
  React.useEffect(() => { document.documentElement.style.setProperty('--blue', t.accent); }, [t.accent]);

  function open(id) { setRoute(id); setSub(null); window.scrollTo(0, 0); }
  const app = APP_BY_ID[route];

  const panel = React.createElement(TweaksPanel, null,
    React.createElement(TweakSection, { label: 'Home page' }),
    React.createElement(TweakRadio, { label: 'App style', value: t.appStyle, options: ['Rows', 'Compact', 'Cards'], onChange: v => { setTweak('appStyle', v); open('home'); } }),
    React.createElement(TweakSection, { label: 'Brand' }),
    React.createElement(TweakColor, { label: 'Accent', value: t.accent, options: ['#0d6efd', '#1b5fd9', '#2a5db0', '#0f766e', '#5b53c9'], onChange: v => setTweak('accent', v) })
  );

  /* full-screen SPA apps render their own chrome */
  if (app && app.spa && route === 'easyflow') {
    return React.createElement(React.Fragment, null,
      React.createElement(EasyFlowApp, { onBack: () => open('home') }),
      panel);
  }
  if (app && app.spa && route === 'projects') {
    return React.createElement(React.Fragment, null,
      React.createElement(ProjectsApp, { onBack: () => open('home') }),
      panel);
  }
  if (app && app.spa && route === 'tools') {
    return React.createElement(React.Fragment, null,
      React.createElement(SystemToolsApp, { onBack: () => open('home') }),
      panel);
  }

  let content;
  switch (route) {
    case 'home': {
      content = React.createElement(window.HomeVariants.V2_Favorites, { embed: true, onOpenApp: open, appStyle: APP_STYLE_MAP[t.appStyle] || 'compact' });
      break;
    }
    case 'welcome':    content = React.createElement(WelcomeApp, { onOpenApp: open }); break;
    case 'targets':    content = React.createElement(TargetsApp, { subview: sub, onSubview: setSub }); break;
    case 'msl':        content = React.createElement(MslApp); break;
    case 'discounts':  content = React.createElement(DiscountsApp); break;
    case 'emails':     content = React.createElement(EmailsApp); break;
    case 'epos':       content = React.createElement(EposApp); break;
    case 'catalog':    content = React.createElement(CatalogApp); break;
    case 'performance':content = React.createElement(PerformanceApp); break;
    case 'analytics':  content = React.createElement(AnalyticsApp); break;
    case 'api':        content = React.createElement(APIApp); break;
    case 'orchestration': content = React.createElement(OrchestrationApp); break;
    case 'account':    content = React.createElement(AccountApp); break;
    default:           content = React.createElement(Placeholder, { app });
  }

  return React.createElement('div', null,
    React.createElement(TopNav, {
      appName: WORDMARK[route] || 'ONE', accent: app ? app.color : 'var(--blue)',
      onHome: () => open('home'), onOpenApp: open, dark, onToggleDark: () => setDark(d => !d),
      onAccount: () => open('account'),
    }),
    React.createElement('main', { key: route + t.appStyle + (sub ? JSON.stringify(sub) : '') }, content),
    panel
  );
}

/* ---------------- Device preview shell ---------------- */
function DeviceToggle({ device, setDevice }) {
  const btn = (id, label, path) => React.createElement('button', {
    onClick: () => setDevice(id),
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', border: 'none', cursor: 'pointer',
      borderRadius: 'var(--r-pill)', fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
      background: device === id ? 'var(--surface)' : 'transparent', color: device === id ? 'var(--ink)' : 'var(--muted)',
      boxShadow: device === id ? 'var(--sh-sm)' : 'none',
    },
  },
    React.createElement('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, React.createElement('path', { d: path })),
    label);
  return React.createElement('div', { style: {
    position: 'fixed', left: 16, bottom: 16, zIndex: 2147483646, display: 'flex', gap: 3, padding: 4,
    background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', boxShadow: 'var(--sh-md)',
  } },
    btn('desktop', 'Desktop', 'M3 5h18a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zM8 20h8M12 16v4'),
    btn('mobile', 'Mobile', 'M7 3h10a1 1 0 011 1v16a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zM10.5 18h3')
  );
}

function DevicePreview() {
  const [device, setDevice] = useStateR(() => localStorage.getItem('one-device') || 'desktop');
  React.useEffect(() => { localStorage.setItem('one-device', device); }, [device]);

  let stage;
  if (device === 'mobile') {
    /* iframe gives the inner app a real 390px viewport so mobile breakpoints fire */
    const frame = React.createElement('iframe', { src: 'index.html?view=app', title: 'One',
      style: { width: '100%', height: '100%', border: 'none', display: 'block', background: 'var(--bg)' } });
    stage = React.createElement('div', { style: { minHeight: '100vh', background: '#e9e7e2', display: 'grid', placeItems: 'center', padding: '28px 16px' } },
      React.createElement(window.IOSDevice, { width: 390, height: 820 },
        React.createElement('div', { style: { height: '100%', paddingTop: 50, paddingBottom: 18, boxSizing: 'border-box' } }, frame)));
  } else {
    /* desktop renders the app directly — no iframe, no double-compile */
    stage = React.createElement(App);
  }
  return React.createElement(React.Fragment, null, stage, React.createElement(DeviceToggle, { device, setDevice }));
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
