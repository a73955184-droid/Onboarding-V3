import { loadState, resetState } from '../../application/state.js';
import { navigate } from '../../application/router.js';
import { resolveAssessment } from '../../domain/assessment-engine.js';
import {
  STAGE_VIEW,
  STYLE_VIEW,
  MODIFIER_VIEW,
  PROFILE_EVIDENCE_MAP,
  PROFILE_QUESTION_LABELS
} from '../../content/investor-profile-copy.js';

function evidence(state, keys) {
  return keys
    .filter((key) => state.answers?.[key]?.length)
    .map(
      (key) =>
        `<strong>${PROFILE_QUESTION_LABELS[key]}:</strong> ${
          state.answers[key]
            .map((answer) => answer.label)
            .join(' · ')
        }`
    )
    .join('<br>');
}

function bindHeader() {
  document.getElementById('backBtn').onclick = () => {
    navigate('assessment/8');
  };

  document.getElementById('restartBtn').onclick = () => {
    resetState();
    navigate('');
  };
}

export function renderInvestorProfile(root) {
  document.title = 'AaronBux - Your Investor Profile';

  const state = loadState();

  if (!state.answers || !Object.keys(state.answers).length) {
    root.innerHTML = `
      <div class="app-shell recommendation-page">
        <header class="topbar">
          <div class="topbar-inner">
            <button class="btn btn-secondary" id="backBtn">
              Back
            </button>

            <div style="text-align: center">
              <div class="brand">AaronBux</div>
              <div class="step-label">Your investor profile</div>
            </div>

            <button class="btn btn-secondary" id="restartBtn">
              Restart
            </button>
          </div>

          <div class="progress-track">
            <div class="progress-fill" style="width: 92%"></div>
          </div>
        </header>

        <main class="main">
          <div class="card panel">
            <h2>We could not find your answers.</h2>
          </div>
        </main>
      </div>
    `;

    bindHeader();
    return;
  }

  const result = state.result || resolveAssessment(state);

  const stage =
    STAGE_VIEW[result.stageId] ||
    STAGE_VIEW.portfolio_organizer;

  const style =
    STYLE_VIEW[result.styleId] ||
    STYLE_VIEW.steady_steward;

  const modifier =
    MODIFIER_VIEW[result.modifierId] ||
    MODIFIER_VIEW.confidence_builder;

  root.innerHTML = `
    <div class="app-shell recommendation-page profile-page">
      <header class="topbar">
        <div class="topbar-inner">
          <button class="btn btn-secondary" id="backBtn">
            Back
          </button>

          <div style="text-align: center">
            <div class="brand">AaronBux</div>
            <div class="step-label">Your investor profile</div>
          </div>

          <button class="btn btn-secondary" id="restartBtn">
            Restart
          </button>
        </div>

        <div class="progress-track">
          <div class="progress-fill" style="width: 92%"></div>
        </div>
      </header>

      <main class="main">
        <section>
          <div class="card panel result-hero">
            <span class="pill">Your investor profile</span>

            <h1>${stage.headline}</h1>

            <p class="lead">
              Your answers describe both where investing becomes difficult
              and the way you are most likely to stay confident and consistent.
            </p>
          </div>

          <div class="profile-result-grid">
            <article class="recommendation-card">
              <span class="pill">Where you are now</span>

              <h2>${stage.name}</h2>

              <p>${stage.summary}</p>

              <div class="evidence">
                ${evidence(state, PROFILE_EVIDENCE_MAP.stage)}
              </div>
            </article>

            <article class="recommendation-card">
              <span class="pill">How you prefer to invest</span>

              <h2>${style.name}</h2>

              <p>${style.copy}</p>

              <div class="evidence">
                ${evidence(state, PROFILE_EVIDENCE_MAP.style)}
              </div>
            </article>

            <article class="recommendation-card">
              <span class="pill">What affects confidence</span>

              <h2>${modifier.name}</h2>

              <p>${modifier.copy}</p>

              <div class="evidence">
                ${evidence(state, PROFILE_EVIDENCE_MAP.modifier)}
              </div>
            </article>
          </div>

          <div class="recommendation-actions">
            <button id="systemBtn" class="btn btn-primary">
              See your investing system
            </button>
          </div>
        </section>
      </main>
    </div>
  `;

  bindHeader();

  document.getElementById('systemBtn').onclick = () => {
    navigate('recommendation/system');
  };
}
