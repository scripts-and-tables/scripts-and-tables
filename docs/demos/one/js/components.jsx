/* Shared One components + app registry. */
const { useState, useRef, useEffect } = React;
const Icon = window.Icon;

/* ---------------- App registry (real One apps) ---------------- */
const APPS = [
  { id: 'welcome',      name: 'Welcome',                  icon: 'sparkles',       color: 'var(--blue)', built: true },
  { id: 'targets',      name: 'Sales Targets',            icon: 'target',         color: 'var(--cyan)', built: true },
  { id: 'msl',          name: 'Focus SKUs',               icon: 'clipboardCheck', color: 'var(--amber)', built: true },
  { id: 'discounts',    name: 'Staff Discounts',          icon: 'percent',        color: 'var(--green)', built: true },
  { id: 'catalog',      name: 'Items Catalog',            icon: 'book',           color: 'var(--green)', built: true },
  { id: 'epos',         name: 'Excel Reports',            icon: 'fileText',       color: 'var(--blue)', built: true },
  { id: 'performance',  name: 'User Performance',         icon: 'idCard',         color: 'var(--blue)', built: true },
  { id: 'orchestration',name: 'Data Pipeline',            icon: 'sitemap',        color: 'var(--indigo)', built: true },
  { id: 'emails',       name: 'Notification Center',      icon: 'mail',           color: 'var(--cyan)', built: true },
  { id: 'projects',     name: 'Project Management',       icon: 'flow',           color: 'var(--purple)', spa: true, built: true },
  { id: 'easyflow',     name: 'Process Master',           icon: 'sitemap',        color: 'var(--blue)', spa: true, built: true },
  { id: 'analytics',    name: 'Site Analytics',           icon: 'chartLine',      color: 'var(--black-tile)', built: true },
  { id: 'tools',        name: 'System Tools',             icon: 'wrench',         color: 'var(--gray-tile)', spa: true, built: true },
  { id: 'api',          name: 'API',                      icon: 'code',           color: 'var(--red)', built: true },
];
const APP_BY_ID = Object.fromEntries(APPS.map(a => [a.id, a]));
window.APPS = APPS; window.APP_BY_ID = APP_BY_ID;

/* ---------------- Wordmark ---------------- */
function Wordmark({ name = 'ONE', beta = true, size = 22 }) {
  return (
    React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8 } },
      React.createElement('span', { className: 'tm-wordmark', style: { fontSize: size } },
        React.createElement('span', { className: 'nm' }, 'One')
      ),
      beta && React.createElement('span', { style: {
        fontSize: 11, fontWeight: 800, letterSpacing: '.06em', padding: '3px 8px',
        borderRadius: 'var(--r-pill)', background: 'var(--warning-bg)', color: 'var(--warning-ink)',
      } }, 'DEMO')
    )
  );
}

/* ---------------- Icon tile (soft-tinted, enterprise) ---------------- */
function IconTile({ icon, color, size = 56, radius = 14, iconSize, solid }) {
  /* Demo look: vibrant gradient "app icon" tiles (distinct from the soft-tinted product UI). */
  const r = Math.round(size * 0.28);
  const bg = 'linear-gradient(140deg, ' + color + ' 0%, color-mix(in srgb, ' + color + ' 56%, #11161f) 100%)';
  return (
    React.createElement('div', { style: {
      width: size, height: size, borderRadius: r, background: bg, flex: 'none',
      display: 'grid', placeItems: 'center', color: '#fff',
      boxShadow: '0 5px 14px color-mix(in srgb, ' + color + ' 42%, transparent), inset 0 1px 0 rgba(255,255,255,.3)',
    } }, React.createElement(Icon, { name: icon, size: iconSize || Math.round(size * .44), stroke: 2 }))
  );
}

/* ---------------- Avatar ---------------- */
function Avatar({ initial = 'O', size = 36, gradient }) {
  const g = gradient || 'linear-gradient(135deg, #d98a2b, #c2a01f)';
  return React.createElement('div', { style: {
    width: size, height: size, borderRadius: '50%', background: g, color: '#fff',
    display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: size * .42, flex: 'none',
  } }, initial);
}

/* ---------------- Apps menu (dropdown) ---------------- */
function AppsMenu({ onOpenApp, accent }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    React.createElement('div', { ref, style: { position: 'relative' } },
      React.createElement('button', {
        onClick: () => setOpen(o => !o),
        style: {
          display: 'inline-flex', alignItems: 'center', gap: 8, background: open ? 'var(--surface-2)' : 'transparent',
          border: 'none', cursor: 'pointer', padding: '7px 10px', borderRadius: 'var(--r)', color: 'var(--ink)',
          fontSize: 16, fontWeight: 500,
        },
      },
        React.createElement('span', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,4px)', gap: 2.5 } },
          Array.from({ length: 9 }).map((_, i) =>
            React.createElement('span', { key: i, style: { width: 4, height: 4, borderRadius: 1.5, background: accent || 'var(--blue)' } }))
        ),
        React.createElement('span', { className: 'apps-label' }, 'Apps'),
        React.createElement(Icon, { name: 'chevDown', size: 16, style: { color: 'var(--muted)' } })
      ),
      open && React.createElement('div', { className: 'fadein', style: {
        position: 'absolute', right: 0, top: '120%', width: 380, background: 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-lg)',
        padding: 12, zIndex: 90,
      } },
        React.createElement('div', { className: 'uplabel', style: { padding: '4px 6px 10px' } }, 'All apps'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 } },
          APPS.map(a => React.createElement('button', {
            key: a.id, onClick: () => { setOpen(false); onOpenApp(a.id); },
            style: {
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '12px 6px',
              background: 'transparent', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer',
              color: 'var(--body)', textAlign: 'center',
            },
            onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-2)',
            onMouseLeave: e => e.currentTarget.style.background = 'transparent',
          },
            React.createElement(IconTile, { icon: a.icon, color: a.color, size: 40, radius: 12 }),
            React.createElement('span', { style: { fontSize: 11.5, lineHeight: 1.2, color: 'var(--body)' } }, a.name)
          ))
        )
      )
    )
  );
}

/* ---------------- Top navigation (portal pages) ---------------- */
function TopNav({ appName = 'ONE', accent, onHome, onOpenApp, dark, onToggleDark, onAccount }) {
  return (
    React.createElement('header', { className: 'tm-topnav', style: {
      height: 'var(--nav-h)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', background: 'var(--bg)', borderBottom: '1px solid var(--border-2)',
      position: 'sticky', top: 0, zIndex: 50,
    } },
      React.createElement('button', { onClick: onHome, style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0 } },
        React.createElement(Wordmark, { name: appName })),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement(AppsMenu, { onOpenApp, accent }),
        React.createElement(IconBtn, { icon: dark ? 'sun' : 'moon', onClick: onToggleDark, title: 'Toggle theme' }),
        React.createElement('button', {
          onClick: onAccount,
          style: {
            display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none',
            cursor: 'pointer', padding: '4px 6px 4px 4px', borderRadius: 'var(--r-pill)',
          },
        },
          React.createElement(Avatar, { initial: 'O', size: 36 }),
          React.createElement(Icon, { name: 'chevDown', size: 16, style: { color: 'var(--muted)' } })
        )
      )
    )
  );
}

function IconBtn({ icon, onClick, title, size = 20 }) {
  return React.createElement('button', {
    onClick, title,
    style: {
      width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: '50%',
      background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-700)',
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
  }, React.createElement(Icon, { name: icon, size }));
}

/* ---------------- Buttons ---------------- */
function Button({ children, onClick, variant = 'primary', icon, size = 'md', style = {}, type }) {
  const sizes = { sm: { p: '7px 12px', f: 14 }, md: { p: '10px 16px', f: 15 }, lg: { p: '12px 20px', f: 16 } }[size];
  const variants = {
    primary: { background: 'var(--blue)', color: '#fff', border: '1px solid var(--blue)' },
    outline: { background: 'var(--surface)', color: 'var(--blue)', border: '1px solid var(--blue)' },
    ghost:   { background: 'transparent', color: 'var(--gray-700)', border: '1px solid var(--border)' },
    soft:    { background: 'var(--blue-050)', color: 'var(--blue-700)', border: '1px solid transparent' },
  }[variant];
  return React.createElement('button', {
    onClick, type: type || 'button',
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: sizes.p, fontSize: sizes.f, fontWeight: 600,
      borderRadius: 'var(--r)', cursor: 'pointer', transition: 'filter .12s, background .12s', ...variants, ...style,
    },
    onMouseEnter: e => e.currentTarget.style.filter = 'brightness(.95)',
    onMouseLeave: e => e.currentTarget.style.filter = 'none',
  },
    icon && React.createElement(Icon, { name: icon, size: sizes.f + 2 }),
    children
  );
}

/* ---------------- Card ---------------- */
function Card({ children, style = {}, pad = 20, hover, onClick, className = '' }) {
  return React.createElement('div', {
    onClick, className,
    style: {
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
      padding: pad, boxShadow: 'var(--sh)', cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow .15s, transform .15s, border-color .15s', ...style,
    },
    onMouseEnter: hover ? e => { e.currentTarget.style.boxShadow = 'var(--sh-md)'; e.currentTarget.style.borderColor = 'var(--gray-400)'; } : undefined,
    onMouseLeave: hover ? e => { e.currentTarget.style.boxShadow = 'var(--sh)'; e.currentTarget.style.borderColor = 'var(--border)'; } : undefined,
  }, children);
}

/* ---------------- Badges & pills ---------------- */
function NewBadge() {
  return React.createElement('span', { style: {
    fontSize: 11, fontWeight: 700, letterSpacing: '.04em', padding: '3px 8px', borderRadius: 'var(--r-pill)',
    background: 'var(--success-bg)', color: 'var(--success-ink)',
  } }, 'NEW');
}
function CountPill({ icon, children }) {
  return React.createElement('span', { style: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 'var(--r-pill)',
    background: 'var(--surface-2)', border: '1px solid var(--border-2)', color: 'var(--gray-700)',
    fontSize: 14, fontWeight: 600,
  } }, icon && React.createElement(Icon, { name: icon, size: 15, style: { color: 'var(--gray-600)' } }), children);
}
function StatusPill({ kind, children }) {
  const map = {
    success: { bg: 'var(--success-bg)', fg: 'var(--success-ink)', dot: 'var(--success-fg)' },
    danger:  { bg: 'var(--danger-bg)',  fg: 'var(--danger-ink)',  dot: 'var(--danger-fg)' },
    info:    { bg: 'var(--info-bg)',     fg: 'var(--info-ink)',    dot: 'var(--info-ink)' },
    warning: { bg: 'var(--warning-bg)',  fg: 'var(--warning-ink)', dot: 'var(--warning-ink)' },
  }[kind] || { bg: 'var(--surface-2)', fg: 'var(--gray-700)', dot: 'var(--gray-500)' };
  return React.createElement('span', { style: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--r-pill)',
    background: map.bg, color: map.fg, fontSize: 13, fontWeight: 600,
  } }, React.createElement('span', { style: { width: 7, height: 7, borderRadius: '50%', background: map.dot } }), children);
}

/* ---------------- Search bar ---------------- */
function SearchBar({ placeholder, value, onChange, segmented }) {
  return React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'wrap' } },
    React.createElement('div', { style: {
      flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: 52,
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-sm)',
    } },
      React.createElement(Icon, { name: 'search', size: 20, style: { color: 'var(--faint)' } }),
      React.createElement('input', {
        value: value || '', onChange: e => onChange && onChange(e.target.value), placeholder,
        style: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: 'var(--ink)', fontFamily: 'inherit' },
      })
    ),
    segmented
  );
}

/* ---------------- Segmented control ---------------- */
function Segmented({ options, value, onChange }) {
  return React.createElement('div', { style: {
    display: 'inline-flex', padding: 4, background: 'var(--surface-2)', borderRadius: 'var(--r-pill)',
    border: '1px solid var(--border-2)',
  } }, options.map(o => React.createElement('button', {
    key: o, onClick: () => onChange(o),
    style: {
      padding: '8px 18px', border: 'none', borderRadius: 'var(--r-pill)', cursor: 'pointer', fontSize: 14.5, fontWeight: 600,
      background: value === o ? 'var(--surface)' : 'transparent', color: value === o ? 'var(--ink)' : 'var(--muted)',
      boxShadow: value === o ? 'var(--sh-sm)' : 'none',
    },
  }, o)));
}

/* ---------------- Page wrapper ---------------- */
function Page({ children, max = 1180 }) {
  return React.createElement('div', { className: 'fadein tm-page', style: { maxWidth: max, margin: '0 auto', padding: '40px 28px 80px' } }, children);
}

Object.assign(window, {
  Wordmark, IconTile, Avatar, AppsMenu, TopNav, IconBtn, Button, Card,
  NewBadge, CountPill, StatusPill, SearchBar, Segmented, Page,
});
