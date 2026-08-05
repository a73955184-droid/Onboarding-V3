function sumWeights(sleeves) {
  return sleeves.reduce((s, sl) => s + Number(sl.weight || 0), 0);
}

export function normalizeWeights(sleeves) {
  const weights = sleeves.map(s => Number(s.weight) || 0);
  const rawSum = weights.reduce((a,b)=>a+b,0);

  // detect percentage-style weights (e.g., 40,20,40)
  const anyAboveOne = weights.some(w => w > 1);
  let normalized;

  if (rawSum === 0) {
    const equal = 1 / sleeves.length;
    normalized = weights.map(() => equal);
  } else if (anyAboveOne || rawSum > 1.5) {
    // assume weights are percentages like 40 -> 0.4
    const asDecimals = weights.map(w => (w > 1 ? w / 100 : w));
    const s = asDecimals.reduce((a,b)=>a+b,0) || 1;
    normalized = asDecimals.map(w => w / s);
  } else {
    normalized = weights.map(w => w / rawSum);
  }

  return normalized;
}

export function calculateSleeveArcs(sleeves, gapDeg = 1.5) {
  const normalized = normalizeWeights(sleeves);

  const arcs = [];
  let angle = 0;

  normalized.forEach((portion, idx) => {
    const span = Math.max(0, portion * 360 - gapDeg);
    const start = angle;
    const end = angle + span;

    arcs.push({
      sleeveId: sleeves[idx].id,
      startAngle: start,
      endAngle: end,
      portion
    });

    angle += span + gapDeg;
  });

  // if small rounding leaves a gap, adjust last segment end to 360-gap
  return arcs;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;")
}

export function renderPortfolioRing({sleeves, selectedSleeveId}) {
  if (!Array.isArray(sleeves) || sleeves.length === 0) return '';

  const r = 80;
  const stroke = 28;
  const cx = 100;
  const cy = 100;

  const circumference = 2 * Math.PI * r;

  const normalized = normalizeWeights(sleeves);

  let offset = 0;

  const segments = sleeves.map((s, i) => {
    const portion = normalized[i];
    const length = Math.max(0.0001, portion * circumference);
    const gap = Math.min(6, circumference * 0.01);

    const dashArray = `${length} ${Math.max(0, circumference - length)}`;

    const startAngle = (offset / circumference) * 360;

    offset += length + gap;

    const isSelected = s.id === selectedSleeveId;

    const color = `var(--accent, #f5c542)`;

    return `
      <circle
        class="ring-segment ${isSelected? 'selected':''}"
        data-sleeve-id="${escapeHtml(s.id)}"
        tabindex="0"
        role="button"
        aria-label="${escapeHtml(s.label)} ${Math.round(portion*100)}%"
        r="${r}"
        cx="${cx}"
        cy="${cy}"
        fill="transparent"
        stroke="${color}"
        stroke-width="${stroke}"
        stroke-linecap="round"
        style="transform: rotate(${startAngle - 90}deg); transform-origin: ${cx}px ${cy}px; stroke-dasharray: ${dashArray}; stroke-dashoffset: 0; opacity: ${isSelected?1:0.6};"
      ></circle>
    `;
  }).join('');

  const svg = `
    <svg viewBox="0 0 200 200" class="portfolio-ring" role="img" aria-hidden="false">
      <g>
        ${segments}
      </g>
    </svg>
  `;

  return svg;
}

export default renderPortfolioRing;
