/* Lightweight SVG chart renderers for the Data Pipeline Automation page.
   All charts use CSS variables for colors so Tweaks recolor them live. */

(function () {
  const NS = "http://www.w3.org/2000/svg";

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function svgRoot(container, w, h) {
    const svg = el("svg", { viewBox: `0 0 ${w} ${h}`, role: "img" });
    container.appendChild(svg);
    return svg;
  }

  const AXIS = { stroke: "var(--line)", labelFill: "var(--ink-3)" };
  const FONT = '10px "IBM Plex Mono", monospace';

  function gridLines(svg, x0, x1, yTicks) {
    yTicks.forEach((t) => {
      el("line", { x1: x0, x2: x1, y1: t.y, y2: t.y, stroke: AXIS.stroke, "stroke-width": 1, "stroke-dasharray": t.dash ? "" : "" }, svg);
      const txt = el("text", { x: x0 - 8, y: t.y + 3, "text-anchor": "end", fill: AXIS.labelFill, style: `font:${FONT}` }, svg);
      txt.textContent = t.label;
    });
  }

  function xLabel(svg, x, y, text, anchor) {
    const t = el("text", { x, y, "text-anchor": anchor || "middle", fill: AXIS.labelFill, style: `font:${FONT}` }, svg);
    t.textContent = text;
  }

  /* ---- stacked bars: data = [{ok, warn, fail}], labels sparse ---- */
  window.renderStackedBars = function (container, data, opts) {
    const W = 640, H = 200, padL = 34, padR = 6, padT = 10, padB = 22;
    const svg = svgRoot(container, W, H);
    const max = opts.max;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const yFor = (v) => padT + innerH - (v / max) * innerH;

    gridLines(svg, padL, W - padR, [0, max / 2, max].map((v) => ({ y: yFor(v), label: String(v) })));

    const slot = innerW / data.length;
    const barW = Math.min(slot * 0.62, 14);
    data.forEach((d, i) => {
      const x = padL + slot * i + (slot - barW) / 2;
      let yTop = padT + innerH;
      [["ok", "var(--ok)"], ["warn", "var(--warn)"], ["fail", "var(--fail)"]].forEach(([k, color]) => {
        const v = d[k];
        if (!v) return;
        const hSeg = (v / max) * innerH;
        yTop -= hSeg;
        el("rect", { x, y: yTop, width: barW, height: hSeg - 0.6, rx: 1.5, fill: color }, svg);
      });
      if (d.label) xLabel(svg, x + barW / 2, H - 6, d.label);
    });
  };

  /* ---- area chart: values[], labels sparse [{i, text}] ---- */
  window.renderArea = function (container, values, labels, opts) {
    const W = 640, H = 200, padL = 40, padR = 6, padT = 10, padB = 22;
    const svg = svgRoot(container, W, H);
    const max = opts.max;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const xFor = (i) => padL + (i / (values.length - 1)) * innerW;
    const yFor = (v) => padT + innerH - (v / max) * innerH;

    gridLines(svg, padL, W - padR, [0, max / 2, max].map((v) => ({ y: yFor(v), label: opts.fmt(v) })));

    const pts = values.map((v, i) => `${xFor(i).toFixed(1)},${yFor(v).toFixed(1)}`);
    const defs = el("defs", {}, svg);
    const grad = el("linearGradient", { id: "areaGrad", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: "0%", "stop-color": "var(--accent)", "stop-opacity": 0.22 }, grad);
    el("stop", { offset: "100%", "stop-color": "var(--accent)", "stop-opacity": 0.02 }, grad);

    el("path", {
      d: `M${padL},${yFor(0)} L${pts.join(" L")} L${xFor(values.length - 1)},${yFor(0)} Z`,
      fill: "url(#areaGrad)",
    }, svg);
    el("path", { d: `M${pts.join(" L")}`, fill: "none", stroke: "var(--accent)", "stroke-width": 2, "stroke-linejoin": "round" }, svg);

    labels.forEach((l) => xLabel(svg, xFor(l.i), H - 6, l.text));
  };

  /* ---- multi line: series = [{name, varColor, values}] ---- */
  window.renderLines = function (container, series, labels, opts) {
    const W = 640, H = 200, padL = 34, padR = 6, padT = 10, padB = 22;
    const svg = svgRoot(container, W, H);
    const max = opts.max;
    const n = series[0].values.length;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const xFor = (i) => padL + (i / (n - 1)) * innerW;
    const yFor = (v) => padT + innerH - (v / max) * innerH;

    gridLines(svg, padL, W - padR, [0, max / 2, max].map((v) => ({ y: yFor(v), label: opts.fmt(v) })));

    series.forEach((s) => {
      const pts = s.values.map((v, i) => `${xFor(i).toFixed(1)},${yFor(v).toFixed(1)}`);
      el("path", { d: `M${pts.join(" L")}`, fill: "none", stroke: s.color, "stroke-width": 1.8, "stroke-linejoin": "round" }, svg);
    });

    labels.forEach((l) => xLabel(svg, xFor(l.i), H - 6, l.text));
  };

  /* ---- flow connectors: draws curves from source/dest cards to pipeline box ---- */
  window.drawFlowConnectors = function () {
    const flow = document.querySelector(".flow");
    if (!flow) return;
    const old = flow.querySelector("svg.connectors");
    if (old) old.remove();
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const svg = el("svg", { class: "connectors" });
    flow.insertBefore(svg, flow.firstChild);
    const fRect = flow.getBoundingClientRect();
    const box = flow.querySelector(".pipeline-box").getBoundingClientRect();
    const boxMidY = box.top + box.height / 2 - fRect.top;

    function curve(x1, y1, x2, y2) {
      const mx = (x1 + x2) / 2;
      el("path", {
        d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`,
        fill: "none",
        stroke: "var(--line)",
        "stroke-width": 1.5,
      }, svg);
      el("circle", { cx: x1, cy: y1, r: 3, fill: "var(--ink-3)" }, svg);
    }

    flow.querySelectorAll(".src-group").forEach((g) => {
      const r = g.getBoundingClientRect();
      curve(r.right - fRect.left, r.top + r.height / 2 - fRect.top, box.left - fRect.left, boxMidY);
    });
    flow.querySelectorAll(".dest").forEach((g) => {
      const r = g.getBoundingClientRect();
      const x1 = box.right - fRect.left, y1 = boxMidY;
      const x2 = r.left - fRect.left, y2 = r.top + r.height / 2 - fRect.top;
      const mx = (x1 + x2) / 2;
      el("path", {
        d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`,
        fill: "none",
        stroke: "var(--line)",
        "stroke-width": 1.5,
      }, svg);
      el("circle", { cx: x2, cy: y2, r: 3, fill: "var(--accent)" }, svg);
    });
  };

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(window.drawFlowConnectors, 150);
  });
})();
