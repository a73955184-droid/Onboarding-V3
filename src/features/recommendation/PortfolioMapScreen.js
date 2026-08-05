import {
  getState,
  getAssessmentResult,
  getPortfolioSystem,
  getSelectedSleeve,
  setSelectedSleeveId,
  resetState
} from '../../application/state.js';

import { navigate } from '../../application/router.js';

import { renderPortfolioRing, calculateSleeveArcs } from './portfolio-ring.js';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatPercentage(weight) {
  const n = Number(weight);
  if (!Number.isFinite(n)) return '0%';
  return `${Math.round(n * 100)}%`;
}

function renderSystemHeader(system) {
  return `
    <div class="card panel result-hero">
      <span class="pill">Your portfolio system</span>
      <h1 id="pm_systemName">${escapeHtml(system?.system?.systemName || '')}</h1>
      <p class="lead" id="pm_systemSummary">${escapeHtml(system?.system?.philosophy || '')}</p>
    </div>
  `;
}

function renderSleeveSelector(sleeves, selectedSleeveId) {
  return `
    <div class="sleeve-legend">
      ${sleeves
        .map(
          (s) => `
            <button class="sleeve-btn ${s.id===selectedSleeveId? 'selected':''}" data-sleeve-id="${escapeHtml(
            s.id
          )}" type="button">
              <span class="label">${escapeHtml(s.label)}</span>
              <span class="pct">${formatPercentage(s.weight)}</span>
            </button>
          `
        )
        .join('')}
    </div>
  `;
}

export function renderPortfolioMap(root) {
  document.title = 'AaronBux - Portfolio Map';

  const state = getState();

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <button class="btn btn-secondary" id="backBtn" type="button">Back</button>

          <div style="text-align: center">
            <div class="brand">AaronBux</div>
            <div class="step-label">Portfolio System Map</div>
          </div>

          <button class="btn btn-secondary" id="restartBtn" type="button">Restart</button>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width: 100%"></div></div>
      </header>

      <main class="main">
        <div id="missingState" class="card panel" style="display: none">
          <h2>We could not find your recommendation.</h2>
          <p class="lead">Complete the assessment before viewing your portfolio map.</p>
          <button id="startAssessmentBtn" class="btn btn-primary" type="button">Start assessment</button>
        </div>

        <section id="result" style="display: none">
          <div id="systemHeader"></div>

          <div class="portfolio-map-grid">
            <div class="ring-column">
              <div class="card panel ring-card">
                <div id="ringContainer" class="ring-container"></div>
                <div id="ringCenter" class="ring-center" aria-live="polite"></div>
              </div>
              <div id="legendContainer"></div>
            </div>

            <div class="detail-column">
              <div class="card panel selected-summary" id="selectedSummary"></div>

              <div class="card panel detail-tabs">
                <div class="tab-buttons">
                  <button class="tab-btn active" data-tab="allocation">Allocation</button>
                  <button class="tab-btn" data-tab="effort">Effort & Return Role</button>
                  <button class="tab-btn" data-tab="monitor">What to Monitor</button>
                </div>

                <div class="tab-panels">
                  <div class="tab-panel" data-panel="allocation"></div>
                  <div class="tab-panel" data-panel="effort" style="display:none"></div>
                  <div class="tab-panel" data-panel="monitor" style="display:none"></div>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  `;

  const backBtn = root.querySelector('#backBtn');
  const restartBtn = root.querySelector('#restartBtn');

  backBtn.addEventListener('click', () => navigate('recommendation/system'));

  restartBtn.addEventListener('click', () => {
    resetState();
    navigate('');
  });

  const missing = root.querySelector('#missingState');
  const result = root.querySelector('#result');

  if (!state.answers || Object.keys(state.answers).length === 0) {
    missing.style.display = 'block';
    root.querySelector('#startAssessmentBtn').addEventListener('click', () => navigate('assessment/1'));
    return;
  }

  const assessmentResult = getAssessmentResult();

  if (!assessmentResult) {
    missing.style.display = 'block';
    root.querySelector('#startAssessmentBtn').addEventListener('click', () => navigate('assessment/1'));
    return;
  }

  const portfolioSystem = getPortfolioSystem();

  if (!portfolioSystem || !Array.isArray(portfolioSystem.sleeves) || portfolioSystem.sleeves.length === 0) {
    missing.style.display = 'block';
    return;
  }

  result.style.display = 'block';

  root.querySelector('#systemHeader').innerHTML = renderSystemHeader(portfolioSystem);

  const selected = getSelectedSleeve() || portfolioSystem.sleeves[0];

  root.querySelector('#legendContainer').innerHTML = renderSleeveSelector(portfolioSystem.sleeves, selected.id);

  root.querySelector('#ringContainer').innerHTML = renderPortfolioRing({
    sleeves: portfolioSystem.sleeves,
    selectedSleeveId: selected.id
  });

  function updateCenter(sleeve) {
    const el = root.querySelector('#ringCenter');
    el.innerHTML = `
      <div class="center-name">${escapeHtml(sleeve.label)}</div>
      <div class="center-pct">${formatPercentage(sleeve.weight)}</div>
      <div class="center-desc">${escapeHtml(sleeve.description || '')}</div>
    `;
  }

  function renderSelectedSummary(sleeve) {
    const el = root.querySelector('#selectedSummary');
    el.innerHTML = `
      <h2>${escapeHtml(sleeve.label)} · ${formatPercentage(sleeve.weight)}</h2>
      <p>${escapeHtml(sleeve.description || '')}</p>
      <div class="meta">
        <div><strong>Return role:</strong> ${escapeHtml(sleeve.returnFunction)}</div>
        <div><strong>Effort:</strong> ${escapeHtml(sleeve.effort)}</div>
      </div>
    `;
  }

  function renderAllocationPanel(sleeve) {
    return `
      <div class="summary-item"><strong>Allocation</strong><div>${formatPercentage(sleeve.weight)}</div></div>
      <div class="summary-item"><strong>Job</strong><div>${escapeHtml(sleeve.description || '')}</div></div>
      <div class="summary-item"><strong>Default categories</strong><div>${(sleeve.assetCategories||[]).map(a=>escapeHtml(a.displayName||a.id||a)).join(' · ')}</div></div>
      <div class="summary-item"><strong>Starts unallocated</strong><div>${sleeve.startsUnallocated? 'Yes':'No'}</div></div>
    `;
  }

  function renderEffortPanel(sleeve, system) {
    return `
      <div class="summary-item"><strong>Allocation</strong><div>${formatPercentage(sleeve.weight)}</div></div>
      <div class="summary-item"><strong>Effort</strong><div>${escapeHtml(sleeve.effort)}</div></div>
      <div class="summary-item"><strong>Return function</strong><div>${escapeHtml(sleeve.returnFunction)}</div></div>
      <div class="summary-item"><strong>Portfolio effort mix</strong><div>${Object.entries(system.effortMix||{}).map(([k,v])=>`${k}: ${Math.round(v*100)}%`).join(' · ')}</div></div>
    `;
  }

  function renderMonitorPanel(sleeve) {
    const guidance = sleeve.monitoringGuidance || { watch: [], usuallyIgnore: [], reviewTrigger: '' };

    return `
      <div class="summary-item"><strong>Watch</strong><div>${(guidance.watch||[]).map(escapeHtml).join(' · ') || 'No specific watch items.'}</div></div>
      <div class="summary-item"><strong>Usually ignore</strong><div>${(guidance.usuallyIgnore||[]).map(escapeHtml).join(' · ') || 'Typical short-term noise.'}</div></div>
      <div class="summary-item"><strong>Review trigger</strong><div>${escapeHtml(guidance.reviewTrigger || '')}</div></div>
    `;
  }

  function updateDetailPanels(sleeve) {
    root.querySelector('[data-panel="allocation"]').innerHTML = renderAllocationPanel(sleeve);
    root.querySelector('[data-panel="effort"]').innerHTML = renderEffortPanel(sleeve, portfolioSystem);
    root.querySelector('[data-panel="monitor"]').innerHTML = renderMonitorPanel(sleeve);
  }

  // initialize
  updateCenter(selected);
  renderSelectedSummary(selected);
  updateDetailPanels(selected);

  // bind legend clicks
  root.querySelectorAll('.sleeve-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.sleeveId;
      setSelectedSleeveId(id);
      const sleeve = portfolioSystem.sleeves.find(s=>s.id===id);
      updateCenter(sleeve);
      renderSelectedSummary(sleeve);
      updateDetailPanels(sleeve);
      // re-render ring with new selection
      root.querySelector('#ringContainer').innerHTML = renderPortfolioRing({sleeves: portfolioSystem.sleeves, selectedSleeveId: id});
      root.querySelectorAll('.sleeve-btn').forEach(b=>b.classList.toggle('selected', b.dataset.sleeveId===id));
    });
  });

  // bind ring segment events (delegated)
  root.querySelector('#ringContainer').addEventListener('click', (e) => {
    const seg = e.target.closest('.ring-segment');
    if (!seg) return;
    const id = seg.datasetSleeveId || seg.getAttribute('data-sleeve-id');
    if (!id) return;
    setSelectedSleeveId(id);
    const sleeve = portfolioSystem.sleeves.find(s=>s.id===id);
    updateCenter(sleeve);
    renderSelectedSummary(sleeve);
    updateDetailPanels(sleeve);
    root.querySelectorAll('.sleeve-btn').forEach(b=>b.classList.toggle('selected', b.dataset.sleeveId===id));
  });

  // tabs
  root.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      root.querySelectorAll('.tab-panel').forEach(p=>p.style.display = p.dataset.panel === tab ? '' : 'none');
    });
  });
}

export default renderPortfolioMap;
