// Tweaks panel for the Data Pipeline Automation page.
// Applies tweak values as CSS variables / data attributes on <html>.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2456A6",
  "density": "regular"
}/*EDITMODE-END*/;

function PipelineTweaks() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    root.dataset.density = t.density;
    if (window.drawFlowConnectors) {
      requestAnimationFrame(window.drawFlowConnectors);
    }
  }, [t.accent, t.density]);

  return (
    <window.TweaksPanel>
      <window.TweakSection label="Theme" />
      <window.TweakColor
        label="Accent"
        value={t.accent}
        options={["#2456A6", "#1F7A6B", "#6A4FB0"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <window.TweakSection label="Layout" />
      <window.TweakRadio
        label="Density"
        value={t.density}
        options={["regular", "compact"]}
        onChange={(v) => setTweak("density", v)}
      />
    </window.TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<PipelineTweaks />);
