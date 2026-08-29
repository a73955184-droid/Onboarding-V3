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

import {
  resolveEligibleSecurities
} from '../../domain/portfolio-system/sleeve-security-eligibility-resolver.js';

import {
  resolveSecurityPortfolioFit
} from '../../domain/portfolio-system/security-portfolio-fit-resolver.js';

import {
  resolveEqualWeightAllocation
} from '../../domain/portfolio-system/hypothetical-allocation-resolver.js';

import {
  PHASE_1_SECURITY_REFERENCE
} from '../../domain/portfolio-system/security-reference.js';

import {
  addCurationHolding,
  clearCurationCandidate,
  createPortfolioCurationSession,
  replaceCurationHolding,
  saveCurationAlternative,
  selectCurationCandidate,
  selectCurationCategory,
  setCurationAssessment
} from './portfolio-curation-session.js';


const CURATION_SESSIONS = new Map();

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

function formatAllocationPercentage(weight) {
  const percentage = Number(weight) * 100;

  if (!Number.isFinite(percentage)) return '0%';

  return `${Number(percentage.toFixed(2))}%`;
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
                  <button class="tab-btn active" data-tab="allocation">Curate this sleeve</button>
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

  backBtn.addEventListener('click', () => navigate('recommendation/system-fit'));

  restartBtn.addEventListener('click', () => {
    CURATION_SESSIONS.clear();
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

  const phaseOnePortfolioSystemId = [
    portfolioSystem.system.id,
    portfolioSystem.profileVariantId
  ].join('-');
  const curationSessionKey = phaseOnePortfolioSystemId;
  const existingCurationSession =
    CURATION_SESSIONS.get(curationSessionKey);
  const hasCurrentSleeves =
    existingCurationSession &&
    portfolioSystem.sleeves.every(
      ({ id }) =>
        Object.hasOwn(
          existingCurationSession.holdingsBySleeve,
          id
        )
    );
  const curationState = hasCurrentSleeves
    ? existingCurationSession
    : createPortfolioCurationSession(portfolioSystem.sleeves);
  const searchBySleeve = Object.fromEntries(
    portfolioSystem.sleeves.map(({ id }) => [id, ''])
  );
  let replacementPreviewSleeveId = null;

  CURATION_SESSIONS.set(curationSessionKey, curationState);

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

  function getCategoryLabel(sleeve, categoryId) {
    return sleeve.assetCategories.find(
      (category) => category.id === categoryId
    )?.label ?? categoryId;
  }

  function getSecurity(securityId) {
    return PHASE_1_SECURITY_REFERENCE[securityId] ?? null;
  }

  function renderAllocationHoldings(allocation, emptyMessage) {
    if (allocation.holdings.length === 0) {
      return `<p class="curation-empty">${escapeHtml(emptyMessage)}</p>`;
    }

    return `
      <ul class="curation-allocation-list">
        ${allocation.holdings.map((holding) => {
          const security = getSecurity(holding.securityId);

          return `
            <li>
              <span>${escapeHtml(security?.ticker ?? holding.securityId)}</span>
              <strong>${formatAllocationPercentage(holding.displayWeight)}</strong>
            </li>
          `;
        }).join('')}
      </ul>
    `;
  }

  function renderHypotheticalSleeve(sleeve) {
    const holdings = curationState.holdingsBySleeve[sleeve.id];
    const alternatives =
      curationState.savedAlternativesBySleeve[sleeve.id];
    const allocation = resolveEqualWeightAllocation({
      sleeveWeight: sleeve.weight,
      securityIds: holdings
    });

    return `
      <section class="curation-hypothetical" aria-labelledby="curationHoldingsHeading">
        <h3 id="curationHoldingsHeading">Your hypothetical sleeve · ${formatPercentage(sleeve.weight)}</h3>
        <p class="curation-note">Temporary planning only. These are not actual holdings, no brokerage account is connected and no trades are placed.</p>
        ${renderAllocationHoldings(allocation, 'No holdings added yet.')}
        ${alternatives.length > 0 ? `
          <div class="curation-alternatives">
            <h4>Saved alternatives</h4>
            <p>${alternatives.map(
              (securityId) =>
                escapeHtml(getSecurity(securityId)?.ticker ?? securityId)
            ).join(' · ')}</p>
            <p class="curation-note">Alternatives receive no hypothetical allocation.</p>
          </div>
        ` : ''}
      </section>
    `;
  }

  function renderSecurityBrowser(sleeve, category) {
    if (!category) {
      return '<p class="curation-empty">No approved securities are available for this category.</p>';
    }

    const searchValue = searchBySleeve[sleeve.id] ?? '';
    const normalizedSearch = searchValue.trim().toLowerCase();
    const securities = category.securities.filter(
      (security) =>
        !normalizedSearch ||
        security.ticker.toLowerCase().includes(normalizedSearch) ||
        security.name.toLowerCase().includes(normalizedSearch)
    );
    const categoryLabel = getCategoryLabel(sleeve, category.categoryId);
    const activeCandidateId =
      curationState.activeCandidateIdBySleeve[sleeve.id];

    return `
      <section class="curation-browser" aria-labelledby="securityBrowserHeading">
        <h3 id="securityBrowserHeading">${escapeHtml(categoryLabel)} · ${category.securities.length} ${category.securities.length === 1 ? 'security' : 'securities'}</h3>
        <label class="curation-search-label" for="curationSecuritySearch">Search by name or ticker</label>
        <input
          id="curationSecuritySearch"
          class="curation-search"
          type="search"
          value="${escapeHtml(searchValue)}"
          placeholder="Search by name or ticker"
          autocomplete="off"
        >
        <div class="curation-security-list" role="listbox" aria-label="Eligible securities">
          ${securities.length > 0
            ? securities.map((security) => `
                <button
                  class="curation-security-option ${security.securityId === activeCandidateId ? 'selected' : ''}"
                  type="button"
                  role="option"
                  aria-selected="${security.securityId === activeCandidateId}"
                  data-curation-action="select-candidate"
                  data-security-id="${escapeHtml(security.securityId)}"
                >
                  <strong>${escapeHtml(security.ticker)}</strong>
                  <span>${escapeHtml(security.name)}</span>
                </button>
              `).join('')
            : '<p class="curation-empty">No securities match your search.</p>'}
        </div>
      </section>
    `;
  }

  function renderInspectionPanel(sleeve, category) {
    const candidateId =
      curationState.activeCandidateIdBySleeve[sleeve.id];
    const candidate = category?.securities.find(
      ({ securityId }) => securityId === candidateId
    );

    if (!candidate) {
      return `
        <section class="curation-inspection curation-empty-panel">
          <h3>Inspect a security</h3>
          <p>Select an eligible security to review it. Selection does not add a holding or generate a fit result.</p>
        </section>
      `;
    }

    const categoryLabel = getCategoryLabel(sleeve, category.categoryId);
    const isCurrentHolding =
      curationState.holdingsBySleeve[sleeve.id].includes(candidate.securityId);
    const assessment =
      curationState.assessmentBySleeve[sleeve.id];
    const sourceLink = candidate.sourceUrl
      ? `
          <div class="curation-inspection-field">
            <strong>Source</strong>
            <a href="${escapeHtml(candidate.sourceUrl)}" target="_blank" rel="noopener noreferrer">View issuer source</a>
          </div>
        `
      : '';

    return `
      <section class="curation-inspection" aria-labelledby="curationCandidateHeading">
        <div class="curation-candidate-heading">
          <strong>${escapeHtml(candidate.ticker)}</strong>
          <h3 id="curationCandidateHeading">${escapeHtml(candidate.name)}</h3>
        </div>
        <div class="curation-inspection-field">
          <strong>Category</strong>
          <span>${escapeHtml(categoryLabel)}</span>
        </div>
        <div class="curation-inspection-field">
          <strong>Why it can belong</strong>
          <span>This security is an approved ${escapeHtml(categoryLabel.toLowerCase())} candidate for this sleeve.</span>
        </div>
        ${sourceLink}
        ${assessment ? '' : `
          <div class="curation-actions">
            <button class="btn btn-secondary" type="button" data-curation-action="use-current" ${isCurrentHolding ? 'disabled' : ''}>
              ${isCurrentHolding ? 'Current hypothetical holding' : 'Use as current holding'}
            </button>
            <button class="btn btn-primary" type="button" data-curation-action="assess-fit">Assess fit</button>
          </div>
        `}
      </section>
    `;
  }

  function renderAssessmentAllocation(title, allocation) {
    return `
      <div class="curation-assessment-allocation">
        <strong>${escapeHtml(title)}</strong>
        ${renderAllocationHoldings(allocation, 'No holdings')}
      </div>
    `;
  }

  function renderAssessmentPanel(sleeve) {
    const assessment = curationState.assessmentBySleeve[sleeve.id];

    if (!assessment) return '';

    if (assessment.assessmentStatus === 'unavailable') {
      return `
        <section class="curation-assessment unavailable" aria-live="polite">
          <h3>Assessment unavailable</h3>
          <p>AaronBux does not have enough verified information to complete this comparison. No portfolio-fit conclusion has been generated.</p>
        </section>
      `;
    }

    const effortLabel = {
      decreases: 'Lower',
      unchanged: 'Unchanged',
      increases: 'Higher'
    }[assessment.sleeveAssessment.effortEffect];
    const affectedSecurity = getSecurity(assessment.affectedSecurityId);
    const overlapSecurity = getSecurity(
      assessment.sleeveAssessment.overlappingSecurityIds[0]
    );
    const outcomePresentation = {
      add: {
        label: 'Add',
        action: '<button class="btn btn-primary" type="button" data-curation-action="add-result">Add to hypothetical sleeve</button>'
      },
      replace: {
        label: `Replace ${affectedSecurity?.ticker ?? 'holding'}`,
        action: replacementPreviewSleeveId === sleeve.id
          ? `
              <div class="curation-replacement-preview">
                <h4>Replacement preview</h4>
                <p>Remove ${escapeHtml(affectedSecurity?.ticker ?? 'current holding')}</p>
                <p>Add ${escapeHtml(assessment.candidate.ticker)}</p>
                <p>Recalculate ${escapeHtml(sleeve.label)} sleeve</p>
                <button class="btn btn-primary" type="button" data-curation-action="confirm-replacement">Confirm replacement</button>
              </div>
            `
          : '<button class="btn btn-primary" type="button" data-curation-action="preview-replacement">Preview replacement</button>'
      },
      redundant: {
        label: `Redundant with ${overlapSecurity?.ticker ?? 'current holding'}`,
        action: '<button class="btn btn-secondary" type="button" data-curation-action="save-alternative">Keep as an alternative</button>'
      },
      'do-not-add': {
        label: 'Do not add',
        action: '<button class="btn btn-secondary" type="button" data-curation-action="return-browser">Return to eligible securities</button>'
      }
    }[assessment.outcome];

    return `
      <section class="curation-assessment" aria-live="polite">
        <h3>System-fit assessment</h3>
        <div class="curation-assessment-grid">
          <div><strong>Effect on this sleeve</strong><p>${escapeHtml(assessment.explanation.effectOnSleeve)}</p></div>
          <div><strong>Effect on the full portfolio</strong><p>${escapeHtml(assessment.explanation.effectOnPortfolio)}</p></div>
          <div><strong>Effort effect</strong><p>${escapeHtml(effortLabel)}</p></div>
        </div>
        <div class="curation-allocation-effect">
          <h4>Allocation effect</h4>
          <div class="curation-allocation-comparison">
            ${renderAssessmentAllocation('Before', assessment.allocationBefore)}
            ${renderAssessmentAllocation('After', assessment.allocationAfter)}
          </div>
        </div>
        <div class="curation-result">
          <strong>System-fit result</strong>
          <div class="curation-result-label">${escapeHtml(outcomePresentation.label)}</div>
          <strong>Primary reason</strong>
          <p>${escapeHtml(assessment.primaryExplanation)}</p>
          ${outcomePresentation.action}
        </div>
        <p class="curation-note">${escapeHtml(assessment.disclosure)}</p>
      </section>
    `;
  }

  function renderAllocationPanel(sleeve, system) {
    const browseResult = resolveEligibleSecurities({
      portfolioSystemId: phaseOnePortfolioSystemId,
      variantId: system.profileVariantId,
      sleeveId: sleeve.id
    });
    const activeCategoryId =
      curationState.activeCategoryIdBySleeve[sleeve.id];
    const activeCategory = browseResult.categories.find(
      ({ categoryId }) => categoryId === activeCategoryId
    ) ?? browseResult.categories[0] ?? null;

    if (activeCategory && activeCategory.categoryId !== activeCategoryId) {
      curationState.activeCategoryIdBySleeve[sleeve.id] =
        activeCategory.categoryId;
    }

    return `
      <div class="summary-item"><strong>Default categories</strong><div>${(sleeve.assetCategories||[]).map(a=>escapeHtml(a.displayName||a.id||a)).join(' · ')}</div></div>
      <section class="curation-lab" aria-labelledby="curationLabHeading">
        <div class="curation-intro">
          <h3 id="curationLabHeading">What can belong here</h3>
          <p class="example-security-disclosure">Illustrative examples only—not personalized investment recommendations or guaranteed portfolio holdings.</p>
          <div class="curation-category-controls" aria-label="Allowed asset categories">
            ${browseResult.categories.map((category) => `
              <button
                class="curation-category-btn ${category.categoryId === activeCategory?.categoryId ? 'active' : ''}"
                type="button"
                aria-pressed="${category.categoryId === activeCategory?.categoryId}"
                data-curation-action="select-category"
                data-category-id="${escapeHtml(category.categoryId)}"
              >${escapeHtml(getCategoryLabel(sleeve, category.categoryId))}</button>
            `).join('')}
          </div>
        </div>
        <div class="curation-workspace">
          ${renderSecurityBrowser(sleeve, activeCategory)}
          ${renderInspectionPanel(sleeve, activeCategory)}
        </div>
        ${renderHypotheticalSleeve(sleeve)}
        ${renderAssessmentPanel(sleeve)}
      </section>
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
    root.querySelector('[data-panel="allocation"]').innerHTML = renderAllocationPanel(sleeve, portfolioSystem);
    root.querySelector('[data-panel="effort"]').innerHTML = renderEffortPanel(sleeve, portfolioSystem);
    root.querySelector('[data-panel="monitor"]').innerHTML = renderMonitorPanel(sleeve);
  }

  function getActiveSleeve() {
    return getSelectedSleeve() ?? selected;
  }

  function updateAllocationPanel(sleeve = getActiveSleeve()) {
    root.querySelector('[data-panel="allocation"]').innerHTML =
      renderAllocationPanel(sleeve, portfolioSystem);
  }

  const allocationPanel = root.querySelector(
    '[data-panel="allocation"]'
  );

  allocationPanel.addEventListener('input', (event) => {
    if (!event.target.matches('#curationSecuritySearch')) return;

    const sleeve = getActiveSleeve();
    searchBySleeve[sleeve.id] = event.target.value;
    updateAllocationPanel(sleeve);

    const searchInput = root.querySelector(
      '#curationSecuritySearch'
    );
    searchInput?.focus();
    searchInput?.setSelectionRange(
      searchInput.value.length,
      searchInput.value.length
    );
  });

  allocationPanel.addEventListener('click', (event) => {
    const actionButton = event.target.closest(
      '[data-curation-action]'
    );

    if (!actionButton) return;

    const sleeve = getActiveSleeve();
    const action = actionButton.dataset.curationAction;
    const candidateId =
      curationState.activeCandidateIdBySleeve[sleeve.id];

    if (action === 'select-category') {
      selectCurationCategory(
        curationState,
        sleeve.id,
        actionButton.dataset.categoryId
      );
      replacementPreviewSleeveId = null;
    } else if (action === 'select-candidate') {
      selectCurationCandidate(
        curationState,
        sleeve.id,
        actionButton.dataset.securityId
      );
      replacementPreviewSleeveId = null;
    } else if (action === 'use-current' && candidateId) {
      addCurationHolding(curationState, sleeve.id, candidateId);
      replacementPreviewSleeveId = null;
    } else if (action === 'assess-fit' && candidateId) {
      setCurationAssessment(
        curationState,
        sleeve.id,
        resolveSecurityPortfolioFit({
          portfolioSystemId: phaseOnePortfolioSystemId,
          variantId: portfolioSystem.profileVariantId,
          targetSleeveId: sleeve.id,
          candidateSecurityId: candidateId,
          holdingsBySleeve: curationState.holdingsBySleeve
        })
      );
      replacementPreviewSleeveId = null;
    } else if (action === 'add-result' && candidateId) {
      addCurationHolding(curationState, sleeve.id, candidateId);
      replacementPreviewSleeveId = null;
    } else if (action === 'preview-replacement') {
      replacementPreviewSleeveId = sleeve.id;
    } else if (action === 'confirm-replacement') {
      const assessment =
        curationState.assessmentBySleeve[sleeve.id];

      if (
        assessment?.outcome === 'replace' &&
        assessment.affectedSecurityId &&
        candidateId
      ) {
        replaceCurationHolding(
          curationState,
          sleeve.id,
          assessment.affectedSecurityId,
          candidateId
        );
      }
      replacementPreviewSleeveId = null;
    } else if (action === 'save-alternative' && candidateId) {
      saveCurationAlternative(curationState, sleeve.id, candidateId);
      clearCurationCandidate(curationState, sleeve.id);
      replacementPreviewSleeveId = null;
    } else if (action === 'return-browser') {
      clearCurationCandidate(curationState, sleeve.id);
      replacementPreviewSleeveId = null;
    }

    updateAllocationPanel(sleeve);
  });

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
