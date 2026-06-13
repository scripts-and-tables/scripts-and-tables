/* ============================================================
   Auth pages — Login, Forgot, OTP, Reset
   ============================================================ */

function AuthShell({ children, page }) {
  return (
    <div className="auth-shell" data-screen-label={`Auth · ${page}`}>
      <div className="auth-form-side">
        <div className="auth-head">
          <BrandLockup />
          <a className="link" href="#help" onClick={(e)=>e.preventDefault()} style={{ fontSize: 13, color: 'var(--text-2)' }}>Need help?</a>
        </div>
        <div className="auth-body">
          {children}
        </div>
        <div className="auth-foot">
          <span>© 2026 ERP Lite, Inc.</span>
          <span>v3.4.1</span>
        </div>
      </div>
      <AuthPoster />
    </div>
  );
}

function AuthPoster() {
  return (
    <div className="auth-poster-side">
      {/* decorative mascot */}
      <svg className="poster-marks" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
        <g stroke="white" strokeWidth=".6" fill="none">
          {Array.from({ length: 18 }).map((_, i) => (
            <polygon key={i}
              points={`${50 + i*30},${80 + i*20} ${100 + i*30},${50 + i*20} ${150 + i*30},${80 + i*20} ${150 + i*30},${140 + i*20} ${100 + i*30},${170 + i*20} ${50 + i*30},${140 + i*20}`}
              opacity={.35 - i*0.015}
            />
          ))}
        </g>
      </svg>

      <div>
        <div className="auth-poster-mascot">
          <LionMark size={56} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(244,241,236,.7)' }}>ERP LITE</div>
            <div style={{ fontSize: 12, color: 'rgba(244,241,236,.5)', marginTop: 2 }}>Backbone for digital storefronts</div>
          </div>
        </div>
        <h2>One pride, one place — <span className="em">manage every download, license, and customer.</span></h2>
      </div>

      <div>
        <div className="quote-card">
          “We moved off three different tools the week we switched. Our finance ops lead shaved a full day per month off reconciliation.”
          <div className="quote-by">
            <div style={{ width: 28, height: 28, borderRadius: 999, background: 'rgba(242,204,143,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#3D405B' }}>SL</div>
            <div>
              <div style={{ color: 'rgba(244,241,236,.95)', fontWeight: 600 }}>Sofie Lindqvist</div>
              <div>Head of Ops, Pixelmint</div>
            </div>
          </div>
        </div>
        <div className="auth-poster-stats">
          <div className="stat"><div className="stat-v">12.4k+</div><div className="stat-l">Active stores</div></div>
          <div className="stat"><div className="stat-v">$840M</div><div className="stat-l">Processed</div></div>
          <div className="stat"><div className="stat-v">99.99%</div><div className="stat-l">Uptime</div></div>
        </div>
      </div>
    </div>
  );
}

/* ============== Login ============== */
function LoginPage({ onLogin, onNavigate, addToast }) {
  const [email, setEmail] = React.useState('asha@erp-lite.app');
  const [password, setPassword] = React.useState('Demo1234!');
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast?.({ msg: 'Welcome back, Asha', tone: 'success' });
      onLogin();
    }, 700);
  }

  return (
    <AuthShell page="Login">
      {submitting && <LionLoader overlay size={84} label="Signing you in…" />}
      <form className="auth-form" onSubmit={submit} noValidate>
        <div>
          <h1>Sign in to your workspace</h1>
          <p className="sub">Admins only — your team can be invited from settings.</p>
        </div>

        <div className="form-fields">
          <Field label="Work email" error={errors.email}>
            <Input
              type="email"
              icon="mail"
              value={email}
              error={errors.email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <Input
              type={showPw ? 'text' : 'password'}
              icon="lock"
              value={password}
              error={errors.password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              suffix={{ icon: showPw ? 'eye-off' : 'eye', onClick: () => setShowPw(s => !s), label: 'Toggle password visibility' }}
            />
          </Field>

          <div className="row">
            <Checkbox checked={remember} onChange={setRemember}>Stay signed in for 30 days</Checkbox>
            <a className="link" href="#forgot" onClick={(e) => { e.preventDefault(); onNavigate('auth-forgot'); }}>Forgot password?</a>
          </div>
        </div>

        <Button type="submit" size="lg" block disabled={submitting} iconRight={submitting ? null : 'arrow-right'}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>

        <div className="divider">SECURE LOGIN</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', fontSize: 12, justifyContent: 'center' }}>
          <Icon name="shield" size={14} /> Protected by 2-factor verification
        </div>
      </form>
    </AuthShell>
  );
}

/* ============== Forgot password ============== */
function ForgotPage({ onNavigate, addToast }) {
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) { setErr('Enter a valid email'); return; }
    setErr('');
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      addToast?.({ msg: 'Reset link sent', tone: 'success' });
    }, 700);
  }

  return (
    <AuthShell page="Forgot password">
      {!sent ? (
        <form className="auth-form" onSubmit={submit} noValidate>
          <a className="link" href="#login" onClick={(e)=>{e.preventDefault(); onNavigate('auth-login');}} style={{ fontSize: 13, color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="chevron-left" size={14} /> Back to sign in
          </a>
          <div>
            <h1>Forgot password?</h1>
            <p className="sub">Enter the email tied to your workspace and we'll send a one-time code.</p>
          </div>
          <Field label="Work email" error={err}>
            <Input
              type="email"
              icon="mail"
              value={email}
              error={err}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </Field>
          <Button type="submit" size="lg" block disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset code'}
          </Button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onNavigate('auth-otp', email); }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)' }}>
            <Icon name="mail" size={28} />
          </div>
          <div>
            <h1>Check your inbox</h1>
            <p className="sub">We sent a 6-digit code to <strong style={{ color: 'var(--text)' }}>{email}</strong>. It's good for 15 minutes.</p>
          </div>
          <Button type="submit" size="lg" block iconRight="arrow-right">Enter code</Button>
          <button type="button" className="link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, alignSelf: 'flex-start' }} onClick={() => setSent(false)}>
            Use a different email
          </button>
        </form>
      )}
    </AuthShell>
  );
}

/* ============== OTP page ============== */
function OTPPage({ email, onNavigate, addToast }) {
  const [code, setCode] = React.useState(['','','','','','']);
  const [err, setErr] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(0);
  const refs = React.useRef([]);

  React.useEffect(() => {
    refs.current[0]?.focus();
  }, []);
  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  function setDigit(i, v) {
    v = v.replace(/\D/g, '').slice(-1);
    setCode(prev => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < 5) refs.current[i + 1]?.focus();
  }
  function onKeyDown(e, i) {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus();
  }
  function onPaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...code];
    for (let i = 0; i < 6; i++) next[i] = text[i] || '';
    setCode(next);
    refs.current[Math.min(text.length, 5)]?.focus();
  }
  function submit(e) {
    e.preventDefault();
    const full = code.join('');
    if (full.length < 6) { setErr('Please enter all 6 digits'); return; }
    setErr('');
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      // accept 123456 or any 6 digits (demo)
      if (full === '000000') {
        setErr('Code is invalid or expired');
        return;
      }
      addToast?.({ msg: 'Code verified', tone: 'success' });
      onNavigate('auth-reset');
    }, 600);
  }

  return (
    <AuthShell page="Verify code">
      <form className="auth-form" onSubmit={submit}>
        <a className="link" href="#forgot" onClick={(e)=>{e.preventDefault(); onNavigate('auth-forgot');}} style={{ fontSize: 13, color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="chevron-left" size={14} /> Back
        </a>
        <div>
          <h1>Enter verification code</h1>
          <p className="sub">We sent a 6-digit code to <strong style={{ color: 'var(--text)' }}>{email || 'your email'}</strong>.</p>
        </div>

        <div>
          <div className="otp-row" onPaste={onPaste}>
            {code.map((d, i) => (
              <input
                key={i}
                ref={(el) => refs.current[i] = el}
                inputMode="numeric"
                maxLength={1}
                value={d}
                className={d ? 'filled' : ''}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(e, i)}
              />
            ))}
          </div>
          {err && <div className="field-error" style={{ marginTop: 10 }}><Icon name="close" size={12} />{err}</div>}
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-3)' }}>
            Didn't get a code?{' '}
            {resendIn > 0 ? (
              <span>Resend in <span className="mono">{resendIn}s</span></span>
            ) : (
              <button type="button" className="link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => { setResendIn(30); addToast?.({ msg: 'New code sent', tone: 'success' }); }}>
                Resend code
              </button>
            )}
          </div>
        </div>

        <Button type="submit" size="lg" block disabled={submitting} iconRight={submitting ? null : 'arrow-right'}>
          {submitting ? 'Verifying…' : 'Verify & continue'}
        </Button>
      </form>
    </AuthShell>
  );
}

/* ============== Reset password ============== */
function ResetPage({ onNavigate, addToast }) {
  const [pw, setPw] = React.useState('');
  const [pw2, setPw2] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const checks = {
    length: pw.length >= 8,
    upper:  /[A-Z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const match = pw && pw === pw2;
  const ok = score === 4 && match;

  function submit(e) {
    e.preventDefault();
    if (!ok) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast?.({ msg: 'Password updated. Please sign in.', tone: 'success' });
      onNavigate('auth-login');
    }, 700);
  }

  return (
    <AuthShell page="Reset password">
      <form className="auth-form" onSubmit={submit}>
        <div>
          <h1>Set a new password</h1>
          <p className="sub">Choose something you don't use anywhere else.</p>
        </div>

        <div className="form-fields">
          <Field label="New password">
            <Input
              type={show ? 'text' : 'password'}
              icon="lock"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="At least 8 characters"
              suffix={{ icon: show ? 'eye-off' : 'eye', onClick: () => setShow(s => !s), label: 'Toggle' }}
            />
          </Field>
          <Field label="Confirm password" error={pw2 && !match ? 'Passwords don\'t match' : ''}>
            <Input
              type={show ? 'text' : 'password'}
              icon="lock"
              value={pw2}
              error={pw2 && !match}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="Re-enter new password"
            />
          </Field>
        </div>

        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 999,
                background: i <= score
                  ? (score < 2 ? 'var(--danger)' : score < 4 ? 'var(--warning)' : 'var(--success)')
                  : 'var(--surface-3)',
              }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 12 }}>
            <PwRequirement ok={checks.length} label="8+ characters" />
            <PwRequirement ok={checks.upper}  label="Uppercase letter" />
            <PwRequirement ok={checks.number} label="One number" />
            <PwRequirement ok={checks.symbol} label="One symbol" />
          </div>
        </div>

        <Button type="submit" size="lg" block disabled={!ok || submitting}>
          {submitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthShell>
  );
}
function PwRequirement({ ok, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: ok ? 'var(--success)' : 'var(--text-3)' }}>
      <span style={{
        width: 14, height: 14, borderRadius: 999,
        background: ok ? 'var(--success)' : 'var(--surface-3)',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ok && <Icon name="check" size={10} />}
      </span>
      {label}
    </div>
  );
}

Object.assign(window, { LoginPage, ForgotPage, OTPPage, ResetPage });
