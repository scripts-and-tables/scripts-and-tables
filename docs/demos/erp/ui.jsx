/* ============================================================
   UI primitives — Logo, Icons, Avatar, Button, Input, Badge, Modal, Toast
   ============================================================ */

/* --- Cube-style Lion Logo (terracotta palette) --- */
function LionMark({ size = 32, withGlow = false, animated = false }) {
  const cls = animated ? 'lion lion--animated' : 'lion';
  return (
    <svg className={cls} width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {withGlow && (
        <defs>
          <filter id="lionGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      )}
      <g filter={withGlow ? 'url(#lionGlow)' : undefined}>
        {/* ears */}
        <polygon points="8,12 12,3 16,12" fill="#B85A40" />
        <polygon points="32,12 36,3 40,12" fill="#B85A40" />
        <polygon points="12,11 14,9 14,12" fill="#3D405B" opacity=".4" />
        <polygon points="34,11 34,9 36,11" fill="#3D405B" opacity=".4" />

        {/* outer mane hex */}
        <polygon points="24,5 41,14 41,34 24,43 7,34 7,14" fill="#E07A5F" />
        {/* mane facets (geometric shading) — animated as a rotating shimmer */}
        <polygon className="lion-mane lion-mane-1" points="24,5 7,14 24,24"   fill="#F2CC8F" opacity=".85" />
        <polygon className="lion-mane lion-mane-2" points="24,5 41,14 24,24"  fill="#D26A4F" />
        <polygon className="lion-mane lion-mane-3" points="41,14 41,34 24,24" fill="#9D4A30" />
        <polygon className="lion-mane lion-mane-4" points="41,34 24,43 24,24" fill="#A85240" />
        <polygon className="lion-mane lion-mane-5" points="7,34 24,43 24,24"  fill="#C76A50" />
        <polygon className="lion-mane lion-mane-6" points="7,14 7,34 24,24"   fill="#B85A40" />

        {/* face (lighter inner diamond) */}
        <polygon points="24,15 32,24 24,33 16,24" fill="#F2CC8F" />
        <polygon points="24,15 32,24 24,24" fill="#FAE0B5" />
        <polygon points="24,15 16,24 24,24" fill="#E7BE7C" />
        <polygon points="16,24 24,33 24,24" fill="#D9A862" />
        <polygon points="32,24 24,33 24,24" fill="#C99A55" />

        {/* eyes */}
        <polygon className="lion-eye" points="20.5,21 22,22.5 20.5,24 19,22.5" fill="#3D405B" />
        <polygon className="lion-eye" points="27.5,21 29,22.5 27.5,24 26,22.5" fill="#3D405B" />

        {/* nose / muzzle */}
        <polygon points="24,26 25.6,28 22.4,28" fill="#3D405B" />
        <polygon points="22.4,28 25.6,28 24,30.5" fill="#3D405B" opacity=".75" />
      </g>
    </svg>
  );
}

/* --- Full-bleed loader using the lion --- */
function LionLoader({ size = 72, label, overlay = false }) {
  const node = (
    <div className="lion-loader-stack" role="status" aria-live="polite">
      <div className="lion-loader-ring" style={{ width: size + 24, height: size + 24 }}>
        <LionMark size={size} animated />
      </div>
      {label && <div className="lion-loader-label">{label}</div>}
    </div>
  );
  if (!overlay) return node;
  return <div className="lion-loader-overlay">{node}</div>;
}

function BrandLockup({ size = 32, showWordmark = true }) {
  return (
    <div className="sidebar-brand">
      <LionMark size={size} />
      {showWordmark && (
        <div className="sidebar-brand-text">
          <div style={{ fontSize: 15, lineHeight: 1, fontWeight: 800, letterSpacing: '-.02em' }}>ERP Lite</div>
          <div className="sidebar-brand-sub">Retail · Digital</div>
        </div>
      )}
    </div>
  );
}

/* --- Icon set (inline SVG, 18×18 stroke 1.6) --- */
const Icon = ({ name, size = 18, color, ...rest }) => {
  const stroke = color || 'currentColor';
  const sw = 1.6;
  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke, strokeWidth: sw,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true, ...rest,
  };
  switch (name) {
    case 'dashboard': return (<svg {...common}><rect x="3" y="3" width="8" height="9" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/></svg>);
    case 'users':     return (<svg {...common}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.4 3.5-5.5 6.5-5.5s5.9 2.1 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.7c2.4.3 4.4 1.8 4.9 4.3"/></svg>);
    case 'accounts':  return (<svg {...common}><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="8" height="6" rx="1.5"/><rect x="13" y="14" width="8" height="6" rx="1.5"/><path d="M7 10v2.5M17 10v2.5M12 10v2.5"/></svg>);
    case 'orders':    return (<svg {...common}><path d="M4 7h16l-1.4 11.2A2 2 0 0 1 16.6 20H7.4a2 2 0 0 1-2-1.8L4 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>);
    case 'products':  return (<svg {...common}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5"/><path d="M12 12v9"/></svg>);
    case 'card':      return (<svg {...common}><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/><path d="M6 15h3"/></svg>);
    case 'swap':      return (<svg {...common}><path d="M7 4 4 7l3 3"/><path d="M4 7h13a3 3 0 0 1 3 3v1"/><path d="m17 20 3-3-3-3"/><path d="M20 17H7a3 3 0 0 1-3-3v-1"/></svg>);
    case 'arrow-left-right': return (<svg {...common}><path d="M3 12h18"/><path d="M7 8l-4 4 4 4"/><path d="M17 8l4 4-4 4"/></svg>);
    case 'profile':   return (<svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 4.5-6 8-6s7 2 8 6"/></svg>);
    case 'settings':  return (<svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>);
    case 'search':    return (<svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>);
    case 'bell':      return (<svg {...common}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>);
    case 'menu':      return (<svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>);
    case 'close':     return (<svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>);
    case 'plus':      return (<svg {...common}><path d="M12 5v14M5 12h14"/></svg>);
    case 'minus':     return (<svg {...common}><path d="M5 12h14"/></svg>);
    case 'chevron-down': return (<svg {...common}><path d="m6 9 6 6 6-6"/></svg>);
    case 'chevron-left': return (<svg {...common}><path d="m15 6-6 6 6 6"/></svg>);
    case 'chevron-right': return (<svg {...common}><path d="m9 6 6 6-6 6"/></svg>);
    case 'arrow-up':  return (<svg {...common}><path d="M12 19V5M5 12l7-7 7 7"/></svg>);
    case 'arrow-down':return (<svg {...common}><path d="M12 5v14M5 12l7 7 7-7"/></svg>);
    case 'arrow-right': return (<svg {...common}><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
    case 'mail':      return (<svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>);
    case 'paperclip': return (<svg {...common}><path d="M21 11.5 12.5 20a5.5 5.5 0 0 1-7.78-7.78l8.5-8.49a3.67 3.67 0 0 1 5.19 5.19l-8.5 8.5a1.83 1.83 0 0 1-2.59-2.6L15 7"/></svg>);
    case 'inbox':     return (<svg {...common}><path d="M3 13l3-8h12l3 8M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/><path d="M3 13h5l1 2h6l1-2h5"/></svg>);
    case 'voucher':   return (<svg {...common}><path d="M3 9V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a2 2 0 0 0 0-4z"/><path d="M9 9v.01M9 13v.01M9 17v.01"/></svg>);
    case 'crown':     return (<svg width={size} height={size} viewBox="0 0 24 24" fill={stroke} stroke="none" aria-hidden="true" {...rest}><path d="M3.5 18 L2.4 8.6 a.6 .6 0 0 1 1-.5 L7.5 12 L11.2 5.6 a1 1 0 0 1 1.6 0 L16.5 12 L20.6 8.1 a.6 .6 0 0 1 1 .5 L20.5 18 Z"/><rect x="3.8" y="19" width="16.4" height="1.6" rx=".5"/></svg>);
    case 'phone':     return (<svg {...common}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>);
    case 'lock':      return (<svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>);
    case 'unlock':    return (<svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.4-2"/></svg>);
    case 'eye':       return (<svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>);
    case 'eye-off':   return (<svg {...common}><path d="M3 3l18 18"/><path d="M10.6 6.1A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a17.8 17.8 0 0 1-3.4 4.3"/><path d="M6.4 6.4A17.8 17.8 0 0 0 2 12s3.5 6 10 6a10.9 10.9 0 0 0 4-.7"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>);
    case 'download':  return (<svg {...common}><path d="M12 4v12M6 12l6 6 6-6"/><path d="M4 20h16"/></svg>);
    case 'upload':    return (<svg {...common}><path d="M12 20V8M6 12l6-6 6 6"/><path d="M4 4h16"/></svg>);
    case 'filter':    return (<svg {...common}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/></svg>);
    case 'more':      return (<svg {...common}><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></svg>);
    case 'check':     return (<svg {...common}><path d="m5 12 5 5L20 7"/></svg>);
    case 'sun':       return (<svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>);
    case 'moon':      return (<svg {...common}><path d="M21 12.8A9 9 0 0 1 11.2 3 7 7 0 1 0 21 12.8z"/></svg>);
    case 'globe':     return (<svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>);
    case 'edit':      return (<svg {...common}><path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="m13 6 4 4"/></svg>);
    case 'trash':     return (<svg {...common}><path d="M4 7h16"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/></svg>);
    case 'tag':       return (<svg {...common}><path d="M20 12 13 21l-9-9V4h8l8 8z"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/></svg>);
    case 'building':  return (<svg {...common}><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2"/></svg>);
    case 'help':      return (<svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r=".8" fill="currentColor"/></svg>);
    case 'logout':    return (<svg {...common}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>);
    case 'sparkle':   return (<svg {...common}><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z"/></svg>);
    case 'box':       return (<svg {...common}><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/></svg>);
    case 'refresh':   return (<svg {...common}><path d="M4 4v6h6"/><path d="M20 20v-6h-6"/><path d="M4.5 14a8 8 0 0 0 14.5 2M19.5 10A8 8 0 0 0 5 8"/></svg>);
    case 'copy':      return (<svg {...common}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>);
    case 'external': return (<svg {...common}><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>);
    case 'star':     return (<svg {...common}><path d="m12 3 3 6.5 7 .7-5.2 4.7 1.5 6.9L12 18.3l-6.3 3.5L7.2 14.9 2 10.2l7-.7L12 3z"/></svg>);
    case 'shield':   return (<svg {...common}><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/></svg>);
    case 'code':     return (<svg {...common}><path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"/></svg>);
    case 'webhook':  return (<svg {...common}><path d="M15 4.5a3.5 3.5 0 1 0-6.3 2.1L5 13"/><path d="M3 16a3.5 3.5 0 1 0 6.3 2.1l3.7-6.4"/><path d="M21 13a3.5 3.5 0 1 0-3.7-5.9L13 14"/></svg>);
    case 'zap':      return (<svg {...common}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>);
    case 'play':     return (<svg {...common}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>);
    case 'pause':    return (<svg {...common}><rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/></svg>);
    case 'paypal':   return (<svg {...common}><path d="M7 19l1-8h4.5a3 3 0 0 0 3-3 3 3 0 0 0-3-3H8L6 19"/><path d="M10 16h3.5a3 3 0 0 0 3-3 2.5 2.5 0 0 0-2-2.5"/></svg>);
    case 'bank':     return (<svg {...common}><path d="M3 10h18L12 3 3 10z"/><path d="M5 10v9M9 10v9M15 10v9M19 10v9"/><path d="M3 21h18"/></svg>);
    case 'apple':    return (<svg {...common}><path d="M16.7 12.5a4 4 0 0 1 2-3.4 4.2 4.2 0 0 0-3.3-1.8c-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.7a4.4 4.4 0 0 0-3.7 2.3c-1.6 2.7-.4 6.7 1.1 8.9.8 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 2.9-.7 1.4 0 1.8.7 3 .7s2-1 2.7-2.2a9.6 9.6 0 0 0 1.2-2.5 3.8 3.8 0 0 1-2.2-3.6z"/><path d="M14 5.5c.6-.8 1-1.9.9-3a4.1 4.1 0 0 0-2.7 1.4 3.6 3.6 0 0 0-.9 2.9 3.4 3.4 0 0 0 2.7-1.3z"/></svg>);
    default: return null;
  }
};

/* --- Avatar --- */
function Avatar({ name, size = 'md', src }) {
  const cls = size === 'sm' ? 'avatar sm' : size === 'lg' ? 'avatar lg' : size === 'xl' ? 'avatar xl' : 'avatar';
  if (src) return <img className={cls} src={src} alt={name} />;
  return (
    <span className={cls} style={{ background: hashColor(name) }}>
      {initials(name).toUpperCase()}
    </span>
  );
}

/* --- Button --- */
function Button({ variant = 'primary', size, icon, iconRight, block, children, ...props }) {
  const cls = ['btn', variant, size, block && 'block'].filter(Boolean).join(' ');
  return (
    <button className={cls} {...props}>
      {icon && <Icon name={icon} size={16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={16} />}
    </button>
  );
}

/* --- Field / Input --- */
function Field({ label, hint, error, children }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
      {error ? (
        <span className="field-error"><Icon name="close" size={12} />{error}</span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </div>
  );
}
function Input({ icon, error, suffix, ...props }) {
  if (icon || suffix) {
    return (
      <div className="input-with-icon">
        {icon && <span className="input-icon"><Icon name={icon} size={16} /></span>}
        <input className={'input' + (error ? ' error' : '')} {...props} />
        {suffix && <button type="button" className="input-suffix-btn" onClick={suffix.onClick} aria-label={suffix.label}><Icon name={suffix.icon} size={16} /></button>}
      </div>
    );
  }
  return <input className={'input' + (error ? ' error' : '')} {...props} />;
}
function Checkbox({ checked, onChange, children }) {
  return (
    <label className="check">
      <input type="checkbox" checked={!!checked} onChange={e => onChange?.(e.target.checked)} />
      <span className="box"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>
      {children}
    </label>
  );
}

/* --- Badge --- */
function Badge({ tone = 'ghost', dot, children }) {
  return (
    <span className={'badge ' + tone}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}
function StatusBadge({ status }) {
  const map = {
    active:     { tone: 'success', label: 'Active' },
    trial:      { tone: 'info',    label: 'Trial' },
    past_due:   { tone: 'warning', label: 'Past due' },
    churned:    { tone: 'danger',  label: 'Churned' },
    fulfilled:  { tone: 'success', label: 'Fulfilled' },
    processing: { tone: 'info',    label: 'Processing' },
    pending:    { tone: 'warning', label: 'Pending' },
    refunded:   { tone: 'ghost',   label: 'Refunded' },
    cancelled:  { tone: 'danger',  label: 'Cancelled' },
    succeeded:  { tone: 'success', label: 'Succeeded' },
    failed:     { tone: 'danger',  label: 'Failed' },
    live:       { tone: 'success', label: 'Live' },
    draft:      { tone: 'ghost',   label: 'Draft' },
  };
  const m = map[status] || { tone: 'ghost', label: status };
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

/* --- Modal --- */
function Modal({ open, onClose, title, children, foot, width }) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={width ? { maxWidth: width } : undefined} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-head">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{title}</h3>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {foot && <div className="modal-foot">{foot}</div>}
      </div>
    </div>
  );
}

/* --- Toast --- */
function ToastStack({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div className={'toast ' + (t.tone || '')} key={t.id}>
          {t.tone === 'success' && <Icon name="check" size={16} />}
          {t.tone === 'error' && <Icon name="close" size={16} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* --- Segmented --- */
function Segmented({ value, onChange, options }) {
  return (
    <div className="segmented">
      {options.map(o => (
        <button key={o.value} className={value === o.value ? 'active' : ''} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

/* --- Sparkline (mini SVG) --- */
function Sparkline({ values, width = 80, height = 28, color = '#E07A5F' }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const points = values.map((v, i) => `${i * step},${height - ((v - min) / span) * height}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --- Product visual placeholder (geometric tile) --- */
function ProductGlyph({ product }) {
  const tint = product.tint || '#E07A5F';
  return (
    <div className="product-thumb" style={{
      background: `linear-gradient(135deg, ${tint}25 0%, ${tint}55 60%, ${tint}30 100%)`
    }}>
      <svg width="100%" height="100%" viewBox="0 0 200 130" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: .35 }}>
        <defs>
          <pattern id={`p-${product.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 20 L20 0" stroke={tint} strokeWidth=".6" opacity=".35" />
          </pattern>
        </defs>
        <rect width="200" height="130" fill={`url(#p-${product.id})`} />
      </svg>
      <div style={{
        width: 64, height: 64,
        borderRadius: 14,
        background: tint,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: '-.04em',
        boxShadow: `0 8px 20px -8px ${tint}80`,
        position: 'relative', zIndex: 1,
      }}>{product.glyph || product.name.slice(0, 1)}</div>
      <span className="product-tag">{product.type}</span>
    </div>
  );
}

/* --- Sync status pill (replaces notifications bell) --- */
function SyncPill({ syncState, onSyncNow, onOpenDocs }) {
  const [open, setOpen] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const inMs = Date.now() - new Date(syncState.lastInboundSync).getTime();
  const outMs = Date.now() - new Date(syncState.lastOutboundSync).getTime();
  const stale = Math.max(inMs, outMs) > 15 * 60 * 1000;
  const tone = syncState.health === 'live' && !stale ? 'success' : stale ? 'warning' : 'danger';
  const dotColor = tone === 'success' ? 'var(--success)' : tone === 'warning' ? 'var(--warning)' : 'var(--danger)';

  function syncNow() {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      onSyncNow?.();
      setSyncing(false);
    }, 900);
  }

  const newestSync = new Date(Math.max(
    new Date(syncState.lastInboundSync).getTime(),
    new Date(syncState.lastOutboundSync).getTime()
  )).toISOString();

  return (
    <div className="sync-pill-wrap" ref={ref}>
      {syncing && <LionLoader overlay size={72} label="Syncing with your systems…" />}
      <button className="sync-pill" onClick={() => setOpen(o => !o)} title="Data sync status">
        <span className="sp-dot" style={{ background: dotColor }} />
        <span className="sp-label">Synced {relDate(newestSync)}</span>
        <Icon name="chevron-down" size={14} color="var(--text-3)" />
      </button>
      {open && (
        <div className="sync-popover">
          <div className="sync-pop-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="sp-dot" style={{ background: dotColor, width: 8, height: 8 }} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>API {tone === 'success' ? 'connected' : 'attention'}</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }} className="mono">v3.4.1</span>
          </div>

          <div className="sync-rows">
            <div className="sync-row">
              <div className="sr-icon" style={{ background: '#5A88C022', color: '#5A88C0' }}><Icon name="arrow-down" size={14} /></div>
              <div className="sr-body">
                <div className="sr-label">Inbound (push to ERP)</div>
                <div className="sr-time">{relDate(syncState.lastInboundSync)}</div>
              </div>
              <div className="sr-meta mono">{syncState.lastInboundCount || 142} rec</div>
            </div>
            <div className="sync-row">
              <div className="sr-icon" style={{ background: '#E07A5F22', color: '#E07A5F' }}><Icon name="arrow-up" size={14} /></div>
              <div className="sr-body">
                <div className="sr-label">Outbound (fetched from ERP)</div>
                <div className="sr-time">{relDate(syncState.lastOutboundSync)}</div>
              </div>
              <div className="sr-meta mono">{syncState.lastOutboundCount || 89} rec</div>
            </div>
            <div className="sync-row">
              <div className="sr-icon" style={{ background: '#4CAE7A22', color: '#4CAE7A' }}><Icon name="webhook" size={14} /></div>
              <div className="sr-body">
                <div className="sr-label">Webhooks</div>
                <div className="sr-time">3 endpoints · 100% delivery</div>
              </div>
              <div className="sr-meta"><Badge tone="success" dot>OK</Badge></div>
            </div>
          </div>

          <div className="sync-pop-foot">
            <Button variant="secondary" size="sm" icon={syncing ? null : 'refresh'} onClick={syncNow} disabled={syncing}>
              {syncing ? 'Syncing…' : 'Sync now'}
            </Button>
            <Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => { setOpen(false); onOpenDocs?.(); }}>
              API & docs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Voucher chip with VIP highlighting --- */
function VoucherChip({ code, size = 'sm' }) {
  if (!code) return <span className="text-3 mono">—</span>;
  const vip = isVipVoucher(code);
  return (
    <span className={'voucher-chip' + (vip ? ' vip' : '') + (size === 'md' ? ' md' : '')}>
      {vip && <Icon name="crown" size={12} />}
      <span className="mono">{code}</span>
    </span>
  );
}

Object.assign(window, {
  LionMark, LionLoader, BrandLockup, Icon, Avatar, Button, Field, Input, Checkbox,
  Badge, StatusBadge, Modal, ToastStack, Segmented, Sparkline, ProductGlyph,
  SyncPill, VoucherChip,
});
