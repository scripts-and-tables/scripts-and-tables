/* Shared credential rendering: provider logos (avatars) + credential card.
   Used by credentials.html (Learning) and ai.html (AI courses). */
(function () {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  // issuer fragment -> self-hosted logo + monogram/colour fallback
  const PROVIDERS = [
    ['anthropic',     {logo:'anthropic.svg',         s:'A',   c:'#CC785C'}],
    ['coursera',      {logo:'coursera.svg',          s:'C',   c:'#0056D2'}],
    ['stanford',      {logo:'stanford.png',          s:'S',   c:'#8C1515'}],
    ['michigan',      {logo:'michigan.png',          s:'M',   c:'#00274C'}],
    ['washington',    {logo:'washington.svg',        s:'W',   c:'#4B2E83'}],
    ['pennsylvania',  {logo:'pennsylvania.ico',      s:'P',   c:'#011F5B'}],
    ['ibm',           {logo:'ibm.svg',               s:'IBM', c:'#0F62FE', sm:true}],
    ['pwc',           {logo:'pwc.svg',               s:'pwc', c:'#D04A02', sm:true}],
    ['rice',          {logo:'rice.ico',              s:'R',   c:'#00205B'}],
    ['toronto',       {s:'T',   c:'#1E3765'}],
    ['sydney',        {logo:'sydney.png',            s:'Syd', c:'#E64626', sm:true}],
    ['amazon web services', {logo:'amazonwebservices.svg', s:'aws', c:'#232F3E', sm:true}],
    ['aws',           {logo:'amazonwebservices.svg', s:'aws', c:'#232F3E', sm:true}],
    ['mcmaster',      {logo:'mcmaster.svg', s:'Mc',  c:'#7A003C', sm:true}],
    ['iese',          {logo:'iese.png', s:'IE',  c:'#003366', sm:true}],
    ['deep teaching', {s:'LL',  c:'#0F9D6E', sm:true}],
    ['udemy',         {logo:'udemy.svg',             s:'U',   c:'#A435F0'}],
    ['sololearn',     {logo:'sololearn.svg',         s:'SL',  c:'#149EF2', sm:true}],
    ['microsoft',     {logo:'microsoft.svg',         s:'M',   c:'#737373'}],
    ['karazin',       {logo:'karazin-emblem.svg',    s:'K',   c:'#203979'}],
    ['kuznets',       {logo:'khnue.png',             s:'K',   c:'#003366'}]
  ];
  function provider(name) {
    const n = name.toLowerCase();
    for (const [k, v] of PROVIDERS) if (n.includes(k)) return v;
    return { s: (name.trim()[0] || '•').toUpperCase(), c: '#5b626c' };
  }
  function avatarOne(p, label) {
    const cls = `prov${p.sm ? ' sm' : ''}`;
    const mono = `<span class="mono">${esc(p.s)}</span>`;
    if (!p.logo) return `<span class="${cls} fb" style="--c:${p.c}" title="${esc(label)}">${mono}</span>`;
    return `<span class="${cls}" style="--c:${p.c}" title="${esc(label)}">` +
      `<img src="assets/logos/${p.logo}" alt="${esc(label)} logo" loading="lazy" ` +
      `onerror="this.closest('.prov').classList.add('fb');this.remove();" />${mono}</span>`;
  }
  function avatars(issuer) {
    const parts = String(issuer).split('·').map(s => s.trim()).filter(Boolean).slice(0, 2);
    return `<span class="prov-stack">${parts.map(p => avatarOne(provider(p), p)).join('')}</span>`;
  }
  function card(c) {
    const skills = (c.skills || []).slice(0, 3).map(s => `<span class="tag">${esc(s)}</span>`).join('');
    const mark = c.type === 'specialization'
      ? '<span class="cred-verified" style="color:var(--accent);">Specialization</span>'
      : (c.status === 'verified' ? '<span class="cred-verified">Verified</span>' : '');
    const links = [
      c.verifyUrl ? `<a class="cred-link" href="${esc(c.verifyUrl)}" target="_blank" rel="noopener">Verify ↗</a>` : '',
      c.file ? `<a class="cred-link" href="${esc(c.file)}" target="_blank" rel="noopener">Certificate ↓</a>` : ''
    ].filter(Boolean).join('');
    return `<div class="cred">
      <div class="cred-h">
        ${avatars(c.issuer)}
        <div><div class="cn">${esc(c.title)}</div><div class="ci">${esc(c.issuer || '')}</div></div>
      </div>
      <div class="cred-skills">${skills}</div>
      <div class="cred-foot">${mark}<span class="yr">${esc(c.date || '')}</span></div>
      ${links ? `<div class="cred-links">${links}</div>` : ''}
    </div>`;
  }

  window.Cred = { esc, avatars, card };
})();
