/* Welcome — portal intro / promo landing page. */
const { useMemo: useMemoW } = React;

const WELCOME_FEATURES = [
  ['targets', 'Set and track sales targets', 'Update monthly targets for your team and see them roll up — with the current month safely locked.'],
  ['epos', 'Download Excel reports', 'Find the report you need, see its status, and download the latest Excel file in one click.'],
  ['orchestration', 'Watch the data pipeline live', 'See every AI and data agent, what each is processing, and what needs attention — in real time.'],
  ['easyflow', 'Route requests & approvals', 'Submit a request on any business flow and watch it move through the right people automatically.'],
  ['msl', 'Manage focus SKUs', 'Pick the SKUs that matter and define exactly which customers should stock each one.'],
];

function BrowserShot({ src, big }) {
  return React.createElement('div', { style: { borderRadius: big ? 'var(--r-lg)' : 0, overflow: 'hidden', border: big ? '1px solid var(--border)' : 'none', boxShadow: big ? 'var(--sh-lg)' : 'none', background: 'var(--surface)' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-2)' } },
      ['#ef6f6c', '#f5bf4f', '#5bc77f'].map((c, i) => React.createElement('span', { key: i, style: { width: 10, height: 10, borderRadius: '50%', background: c } }))),
    React.createElement('div', { style: { position: 'relative', width: '100%', height: big ? 380 : 168, background: 'linear-gradient(135deg, var(--blue-050), var(--surface-2))', display: 'grid', placeItems: 'center' } },
      React.createElement('span', { style: { fontSize: big ? 15 : 13, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.02em' } }, 'Open to explore →'),
      React.createElement('img', { src, alt: '', loading: 'lazy', onError: e => { e.target.style.display = 'none'; }, style: { position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' } })));
}

function WelcomeApp({ onOpenApp }) {
  const live = APPS.filter(a => !a.soon).length;
  const soon = APPS.filter(a => a.soon).length;
  const isNew = APPS.filter(a => a.isNew).length;

  return React.createElement('div', { className: 'fadein' },
    /* Hero */
    React.createElement('div', { style: { background: 'linear-gradient(180deg, var(--blue-050), var(--bg) 78%)', borderBottom: '1px solid var(--border-2)' } },
      React.createElement('div', { style: { maxWidth: 900, margin: '0 auto', padding: '72px 28px 64px', textAlign: 'center' } },
        React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 'var(--r-pill)', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 26 } },
          React.createElement('span', { style: { width: 8, height: 8, borderRadius: '50%', background: 'var(--success-fg)' } }), live + ' apps live · ' + soon + ' coming soon'),
        React.createElement('h1', { style: { fontSize: 52, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 18 } },
          'Everything you do,', React.createElement('br', null),
          React.createElement('span', { style: { color: 'var(--blue)' } }, 'in one place.')),
        React.createElement('p', { style: { fontSize: 19, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 620, margin: '0 auto 32px' } },
          'One is the internal portal that brings your targets, files, approvals and automations together — so you spend less time hunting for tools and more time getting work done.'),
        React.createElement('div', { style: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' } },
          React.createElement(Button, { size: 'lg', icon: 'grid', onClick: () => onOpenApp('home') }, 'Browse all apps'),
          React.createElement(Button, { size: 'lg', variant: 'outline', icon: 'sparkles', onClick: () => onOpenApp('targets') }, 'Jump to Targets')),
        React.createElement('div', { onClick: () => onOpenApp('orchestration'), style: { maxWidth: 880, margin: '48px auto 0', cursor: 'pointer' } },
          React.createElement(BrowserShot, { src: 'screenshots/welcome-orchestration.png', big: true }))) ),

    React.createElement(Page, { max: 1080 },
      /* Showcase screenshots */
      React.createElement('div', { style: { textAlign: 'center', margin: '4px 0 28px' } },
        React.createElement('div', { className: 'uplabel', style: { marginBottom: 10 } }, 'A look inside'),
        React.createElement('h2', { style: { fontSize: 28, fontWeight: 700 } }, 'Real tools, one portal')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 60 } },
        [['orchestration', 'screenshots/welcome-orchestration.png', 'Data Pipeline', 'AI & data agents, live'],
         ['targets', 'screenshots/welcome-targets.png', 'Sales Targets', 'Set & submit team targets'],
         ['analytics', 'screenshots/welcome-analytics.png', 'Site Analytics', 'See how the portal is used']].map(([id, src, title, sub]) =>
          React.createElement('div', { key: id, onClick: () => onOpenApp(id), className: 'hv-card', style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--sh-sm)' } },
            React.createElement(BrowserShot, { src }),
            React.createElement('div', { style: { padding: '14px 16px' } },
              React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: 'var(--ink)' } }, title),
              React.createElement('div', { style: { fontSize: 13.5, color: 'var(--muted)', marginTop: 2 } }, sub)))) ),
      /* Stats */
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, margin: '8px 0 56px' } },
        [[live, 'apps available'], [isNew, 'launched recently'], ['1,885 h', 'saved every month'], ['~900', 'employees served']].map(([v, l], i) =>
          React.createElement('div', { key: i, style: { textAlign: 'center', padding: '8px 0' } },
            React.createElement('div', { style: { fontSize: 34, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 } }, v),
            React.createElement('div', { style: { fontSize: 14, color: 'var(--muted)', marginTop: 8 } }, l)))),

      /* Feature highlights */
      React.createElement('div', { style: { textAlign: 'center', marginBottom: 36 } },
        React.createElement('div', { className: 'uplabel', style: { marginBottom: 10 } }, 'What you can do'),
        React.createElement('h2', { style: { fontSize: 30, fontWeight: 700 } }, 'Built for the way you work')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18, marginBottom: 64 } },
        WELCOME_FEATURES.map(([id, title, desc]) => { const app = APP_BY_ID[id]; if (!app) return null;
          return React.createElement('div', { key: id, onClick: () => onOpenApp(id), className: 'hv-card', style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 22, cursor: 'pointer', boxShadow: 'var(--sh-sm)' } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 } },
              React.createElement(IconTile, { icon: app.icon, color: app.color, size: 44, radius: 12 }),
              React.createElement('h3', { style: { fontSize: 17, fontWeight: 700 } }, title)),
            React.createElement('p', { style: { fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.55, margin: '0 0 14px' } }, desc),
            React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--blue)' } }, 'Open ' + app.name, React.createElement(Icon, { name: 'arrowRight', size: 15 }))); })),

      /* How it works */
      React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--r-xl)', padding: '40px 36px', marginBottom: 56 } },
        React.createElement('h2', { style: { fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 32 } }, 'How One works'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 } },
          [['grid', 'Open the launcher', 'Every tool you have access to lives on the home screen. Pin your favourites with the ♥ for one-tap access.'],
           ['play', 'Work inside the app', 'Simple tasks are single pages; richer tools (Excel Reports, Process Master, Data Pipeline) open as full workspaces.'],
           ['check', 'Stay in the loop', 'Approvals route automatically, jobs are tracked end to end, and you’re notified by email when something needs you.']].map(([icon, t, d], i) =>
            React.createElement('div', { key: i },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 } },
                React.createElement('div', { style: { width: 38, height: 38, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, flex: 'none' } }, i + 1),
                React.createElement(Icon, { name: icon, size: 20, style: { color: 'var(--blue)' } })),
              React.createElement('h3', { style: { fontSize: 17, fontWeight: 700, marginBottom: 6 } }, t),
              React.createElement('p', { style: { fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.55, margin: 0 } }, d)))) ),

      /* Coming soon */
      React.createElement('div', { style: { textAlign: 'center', marginBottom: 30 } },
        React.createElement('div', { className: 'uplabel', style: { marginBottom: 14 } }, 'On the roadmap'),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' } },
          APPS.filter(a => a.soon).map(a => React.createElement('span', { key: a.id, style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--r-pill)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' } },
            React.createElement(Icon, { name: a.icon, size: 15, style: { color: a.color } }), a.name)))),

      /* CTA */
      React.createElement('div', { style: { textAlign: 'center', padding: '40px 0 16px' } },
        React.createElement('h2', { style: { fontSize: 24, fontWeight: 700, marginBottom: 8 } }, 'Ready to get started?'),
        React.createElement('p', { style: { fontSize: 16, color: 'var(--muted)', margin: '0 0 22px' } }, 'Open the launcher and pick up where you left off.'),
        React.createElement('div', { style: { display: 'inline-flex' } }, React.createElement(Button, { size: 'lg', icon: 'grid', onClick: () => onOpenApp('home') }, 'Browse all apps')))));
}

window.WelcomeApp = WelcomeApp;
