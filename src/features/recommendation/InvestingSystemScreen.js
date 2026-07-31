import {
  loadState,
  resetState
} from '../../application/state.js';

import {
  navigate
} from '../../application/router.js';

import {
  resolveAssessment
} from '../../domain/assessment-engine.js';

import {
  RECOMMENDATION_COPY
} from '../../content/recommendation-copy.js';


function getRecommendation(state) {
  const result = state.result || resolveAssessment(state);

  const archetypeId =
    result?.archetypeId ||
    result?.primaryArchetype ||
    result?.archetype ||
    'GD';

  return {
    archetypeId,
    recommendation:
      RECOMMENDATION_COPY[archetypeId] ||
      RECOMMENDATION_COPY.GD
  };
}


function renderList(items = []) {
  return items
    .map(
      (item) => `
        <li>${item}</li>
      `
    )
    .join('');
}


function renderSummaryItems(items = []) {
  return items
    .map(
      (item) => `
        <div class="summary-item">
          ${item}
        </div>
      `
    )
    .join('');
}


function renderSystemParts(items = []) {
  return items
    .map((item) => {
      const separatorIndex = item.indexOf(':');

      if (separatorIndex === -1) {
        return `
          <div class="component">
            <span>${item}</span>
          </div>
        `;
      }

      const title = item.slice(0, separatorIndex);
      const description = item.slice(separatorIndex + 1).trim();

      return `
        <div class="component">
          <strong>${title}</strong>
          <span>${description}</span>
        </div>
      `;
    })
    .join('');
}


function bindHeaderActions() {
  const backButton = document.getElementById('backBtn');
  const restartButton = document.getElementById('restartBtn');

  if (backButton) {
    backButton.onclick = () => {
      navigate('recommendation/profile');
    };
  }

  if (restartButton) {
    restartButton.onclick = () => {
      resetState();
      navigate('');
    };
  }
}


export function renderInvestingSystem(root) {
  document.title = 'AaronBux - Your Investing System';

  const state = loadState();

  if (
    !state.answers ||
    Object.keys(state.answers).length === 0
  ) {
    root.innerHTML = `
      <div class="app-shell recommendation-page system-page">
        <header class="topbar">
          <div class="topbar-inner">
            <button
              class="btn btn-secondary"
              id="backBtn"
              type="button"
            >
              Profile
            </button>

            <div style="text-align: center">
              <div class="brand">AaronBux</div>
              <div class="step-label">
                Your investing system
              </div>
            </div>

            <button
              class="btn btn-secondary"
              id="restartBtn"
              type="button"
            >
              Restart
            </button>
          </div>

          <div class="progress-track">
            <div
              class="progress-fill"
              style="width: 100%"
            ></div>
          </div>
        </header>

        <main class="main">
          <section class="card panel">
            <h2>We could not find your investor profile.</h2>

            <p class="question-note">
              Complete the assessment before viewing your investing system.
            </p>

            <button
              class="btn btn-primary"
              id="startAssessmentBtn"
              type="button"
            >
              Start assessment
            </button>
          </section>
        </main>
      </div>
    `;

    bindHeaderActions();

    document
      .getElementById('startAssessmentBtn')
      .onclick = () => {
        navigate('assessment/1');
      };

    return;
  }

  const {
    recommendation
  } = getRecommendation(state);

  root.innerHTML = `
    <div class="app-shell recommendation-page system-page">
      <header class="topbar">
        <div class="topbar-inner">
          <button
            class="btn btn-secondary"
            id="backBtn"
            type="button"
          >
            Profile
          </button>

          <div style="text-align: center">
            <div class="brand">AaronBux</div>
            <div class="step-label">
              Your investing system
            </div>
          </div>

          <button
            class="btn btn-secondary"
            id="restartBtn"
            type="button"
          >
            Restart
          </button>
        </div>

        <div class="progress-track">
          <div
            class="progress-fill"
            style="width: 100%"
          ></div>
        </div>
      </header>

      <main class="main">
        <section class="card panel result-hero">
          <span class="pill">
            Your investing system
          </span>

          <h1>${recommendation.gap}</h1>

          <p class="lead">
            ${recommendation.need}
          </p>
        </section>

        <section class="card panel recommendation-section">
          <span class="pill">
            Structure
          </span>

          <h2>${recommendation.structure}</h2>

          <div class="component-list">
            ${renderSystemParts(recommendation.parts)}
          </div>
        </section>

        <section class="system-result-grid">
          <article class="recommendation-card">
            <span class="pill">
              Where to focus effort
            </span>

            <h2>
              Spend attention where it can change the outcome
            </h2>

            <div class="summary-list">
              ${renderSummaryItems(recommendation.attention)}
            </div>
          </article>

          <article class="recommendation-card">
            <span class="pill">
              Review rhythm
            </span>

            <h2>${recommendation.rhythm}</h2>

            <div class="summary-list">
              ${renderSummaryItems(
                recommendation.rhythmItems
              )}
            </div>
          </article>

          <article class="recommendation-card">
            <span class="pill">
              Change rules
            </span>

            <h2>
              Reconsider something only when the reason changes
            </h2>

            <ul class="recommendation-list">
              ${renderList(recommendation.rules)}
            </ul>
          </article>
        </section>

        <section class="card panel recommendation-section">
          <span class="pill">
            Your operating principle
          </span>

          <h2>${recommendation.gap}</h2>

          <p class="lead">
            ${recommendation.diagnosis}
          </p>
        </section>

        <div class="recommendation-actions">
          <button
            class="btn btn-secondary"
            id="profileBtn"
            type="button"
          >
            Back to investor profile
          </button>

          <button
            class="btn btn-primary"
            id="restartAssessmentBtn"
            type="button"
          >
            Retake assessment
          </button>
        </div>
      </main>
    </div>
  `;

  bindHeaderActions();

  document
    .getElementById('profileBtn')
    .onclick = () => {
      navigate('recommendation/profile');
    };

  document
    .getElementById('restartAssessmentBtn')
    .onclick = () => {
      resetState();
      navigate('assessment/1');
    };
}
