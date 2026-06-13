(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('particle-bg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var dpr = window.devicePixelRatio || 1;
  var w = 0, h = 0;
  var particles = [];
  var mouse = { x: -9999, y: -9999, active: false };
  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    var density = Math.min(90, Math.max(28, Math.floor((w * h) / 16000)));
    particles = [];
    for (var i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 1.4
      });
    }
  }

  function accentRgb() {
    var theme = document.documentElement.dataset.theme;
    return theme === 'light' ? [105, 56, 255] : [124, 92, 255];
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    var rgb = accentRgb();
    var rgbStr = rgb[0] + ',' + rgb[1] + ',' + rgb[2];

    var linkDist = 130;
    var linkDistSq = linkDist * linkDist;
    var mouseLinkDist = 180;
    var mouseLinkDistSq = mouseLinkDist * mouseLinkDist;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    ctx.lineWidth = 1;
    for (var i = 0; i < particles.length; i++) {
      var a = particles[i];
      for (var j = i + 1; j < particles.length; j++) {
        var b = particles[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < linkDistSq) {
          var alpha = (1 - d2 / linkDistSq) * 0.22;
          ctx.strokeStyle = 'rgba(' + rgbStr + ',' + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      if (mouse.active) {
        var dx2 = a.x - mouse.x, dy2 = a.y - mouse.y;
        var d2m = dx2 * dx2 + dy2 * dy2;
        if (d2m < mouseLinkDistSq) {
          var alpha2 = (1 - d2m / mouseLinkDistSq) * 0.55;
          ctx.strokeStyle = 'rgba(' + rgbStr + ',' + alpha2.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.fillStyle = 'rgba(' + rgbStr + ',0.55)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  if (!isTouch) {
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });
    window.addEventListener('mouseleave', function () { mouse.active = false; });
  }

  resize();
  requestAnimationFrame(tick);
})();
