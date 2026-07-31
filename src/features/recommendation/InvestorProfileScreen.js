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
  RECOMMENDATION_COPY,
  EVIDENCE_LABELS
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


function formatAnswer(answer) {
  if (typeof answer === 'string') {
    return answer;
  }

  return answer?.label || answer?.id || '';
}


function renderEvidence(state) {
  if (!state.answers) {
    return '';
  }

  const evidenceItems = Object.entries(EVIDENCE_LABELS)
    .filter(([questionId]) => {
      const answers = state.answers[questionId];

      return Array.isArray(answers)
        ? answers.length > 0
        : Boolean(answers);
    })
    .map(([questionId, label]) => {
      const answers = Array.isArray(state.answers[questionId])
        ? state.answers[questionId]
        : [state.answers[questionId]];

      const answerText = answers
        .map(formatAnswer)
        .filter(Boolean)
        .join(' · ');

      return `
        <div class="evidence-item">
          <strong>${label}</strong>
          <span>${answerText}</span>
        </div>
      `;
    })
    .join('');

  if (!evidenceItems) {
    return '';
  }

  return `
    <section class="card panel recommendation-section">
      <span class="pill">Based on your answers</span>

      <div class="evidence-list">
        ${evidenceItems}
      </div>
    </section>
  `;
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


function bindHeaderActions() {
  const backButton = document.getElementById('backBtn');
  const restartButton = document.getElementById('restartBtn');

  if (backButton) {
    backButton.onclick = () => {
      navigate('assessment/8');
    };
  }

  if (restartButton) {
    restartButton.onclick = () => {
      resetState();
      navigate('');
    };
  }
}


export function renderInvestorProfile(root) {
  document.title = 'AaronBux - Your Investor Profile';

  const state = loadState();

  if (
    !state.answers ||
    Object.keys(state.answers).length === 0
  ) {
    root.innerHTML = `
      <div class="app-shell recommendation-page profile-page">
        <header class="topbar">
          <div class="topbar-inner">
            <button
              class="btn btn-secondary"
              id="backBtn"
              type="button"
            >
              Back
            </button>

            <div style="text-align: center">
              <div class="brand">AaronBux</div>
              <div class="step-label">
                Your investor profile
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
              style="width: 92%"
            ></div>
          </div>
        </header>

        <main class="main">
          <section class="card panel">
            <h2>We could not find your assessment answers.</h2>

            <p class="question-note">
              Return to the assessment to create your investor profile.
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
    archetypeId,
    recommendation
  } = getRecommendation(state);

  root.innerHTML = `
    <div class="app-shell recommendation-page profile-page">
      <header class="topbar">
        <div class="topbar-inner">
          <button
            class="btn btn-secondary"
            id="backBtn"
            type="button"
          >
            Back
          </button>

          <div style="text-align: center">
            <div class="brand">AaronBux</div>
            <div class="step-label">
              Your investor profile
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
            style="width: 92%"
          ></div>
        </div>
      </header>

      <main class="main">
        <section class="card panel result-hero">
          <span class="pill">
            Your investor profile
          </span>

          <h1>${recommendation.diagnosis}</h1>

          <p class="lead">
            ${recommendation.need}
          </p>
        </section>

        <section class="profile-result-grid">
          <article class="recommendation-card">
            <span class="pill">
              Where you are now
            </span>

            <h2>${recommendation.gap}</h2>

            <p>
              ${recommendation.diagnosis}
            </p>
          </article>

          <article class="recommendation-card">
            <span class="pill">
              What your system needs
            </span>

            <h2>
              A clearer way to make and review decisions
            </h2>

            <p>
              ${recommendation.need}
            </p>
          </article>

          <article class="recommendation-card">
            <span class="pill">
              What to make clearer
            </span>

            <h2>
              Three priorities for your investing process
            </h2>

            <ul class="recommendation-list">
              ${renderList(recommendation.gaps)}
            </ul>
          </article>
        </section>

        ${renderEvidence(state)}

        <div class="recommendation-actions">
          <button
            class="btn btn-primary"
            id="systemBtn"
            type="button"
          >
            See your investing system
          </button>
        </div>

        <div
          class="step-label"
          style="text-align: center; margin-top: 1rem"
        >
          Profile code: ${archetypeId}
        </div>
      </main>
    </div>
  `;

  bindHeaderActions();

  document
    .getElementById('systemBtn')
    .onclick = () => {
      navigate('recommendation/system');
    };
}
