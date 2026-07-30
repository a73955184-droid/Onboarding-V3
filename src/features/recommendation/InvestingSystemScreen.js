import { loadState, resetState } from '../../application/state.js';
import { navigate } from '../../application/router.js';
import { resolveAssessment } from '../../domain/assessment-engine.js';
import {
  INVESTING_SYSTEMS,
  SYSTEM_QUESTION_LABELS
} from '../../content/investing-system-copy.js';

function evidence(state, keys) {
  return keys
    .filter((key) => state.answers?.[key]?.length)
    .map(
      (key) =>
        `<strong>${SYSTEM_QUESTION_LABELS[key]}:</strong> ${
          state.answers[key]
            .map((answer) => answer.label)
            .join(' · ')
        }`
    )
    .join('<br>');
}

function summaryItems(items) {
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

function bindHeader() {
  document.getElementById('backBtn').onclick = () => {
    navigate('recommendation/profile');
  };

  document.getElementById('restartBtn').onclick = () => {
    resetState();
    navigate('');
  };
}

export function renderInvestingSystem(root) {
  document.title = 'AaronBux - Your Investing System';

  const state = loadState();

  if (!state.answers || !Object.keys(state.answers).length) {
    root.innerHTML = `
      <div class="app-shell recommendation-page">
        <header class="topbar">
          <div class="topbar-inner">
            <button class="btn btn-secondary" id="backBtn">
              Profile
            </button>

            <div style="text-align: center">
              <div class="brand">AaronBux</div>
              <div class="step-label">Your investing system</div>
            </div>

            <button class="btn btn-secondary" id="restartBtn">
              Restart
            </button>
          </div>

          <div class="progress-track">
            <div class="progress-fill" style="width: 100%"></div>
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

  const system =
    INVESTING_SYSTEMS[result.archetypeId] ||
    INVESTING_SYSTEMS.GD;

  root.innerHTML = `
    <div class="app-shell recommendation-page system-page">
      <header class="topbar">
        <div class="topbar-inner">
          <button class="btn btn-secondary" id="backBtn">
            Profile
          </button>

          <div style="text-align: center">
            <div class="brand">AaronBux</div>
            <div class="step-label">Your investing system</div>
          </div>

          <button class="btn btn-secondary" id="restartBtn">
            Restart
          </button>
        </div>

        <div class="progress-track">
          <div class="progress-fill" style="width: 100%"></div>
        </div>
      </header>

      <main class="main">
        <section>
          <div class="card panel result-hero">
            <span class="pill">Your best-fit system</span>

            <h1>${system.name}</h1>

            <p class="lead">${system.summary}</p>
          </div>

          <section class="card panel recommendation-section">
            <span class="pill">System structure</span>

            <h2>Give each part of the portfolio one clear job</h2>

            <div class="component-list">
              ${system.components
                .map(
                  (component) => `
                    <div class="component">
                      <strong>${component[0]}</strong>
                      <span>${component[1]}</span>
                    </div>
                  `
                )
                .join('')}
            </div>

            <div class="evidence">
              ${evidence(state, ['setup', 'goals'])}
            </div>
          </section>

          <div class="system-result-grid">
            <article class="recommendation-card">
              <span class="pill">
                Effort versus expected return
              </span>

              <h2>Spend attention where it can change the outcome</h2>

              <div>
                ${system.effort
                  .map(
                    (metric) => `
                      <div class="metric">
                        <span>${metric[0]}</span>
                        <strong>${metric[1]}</strong>
                      </div>
                    `
                  )
                  .join('')}
              </div>

              <div class="evidence">
                ${evidence(state, ['decisionStyle', 'evolution'])}
              </div>
            </article>

            <article class="recommendation-card">
              <span class="pill">What to monitor</span>

              <h2>Monitor only what can change the decision</h2>

              <div class="summary-list">
                ${summaryItems(system.monitor)}
              </div>

              <div class="evidence">
                ${evidence(state, [
                  'marketPsychology',
                  'transition'
                ])}
              </div>
            </article>

            <article class="recommendation-card">
              <span class="pill">Review rhythm</span>

              <h2>Interact at a pace you can sustain</h2>

              <div class="summary-list">
                ${summaryItems(system.cadence)}
              </div>

              <div class="evidence">
                ${evidence(state, [
                  'tradeoff',
                  'marketPsychology'
                ])}
              </div>
            </article>
          </div>

          <section class="card panel recommendation-section">
            <span class="pill">
              When to reconsider something
            </span>

            <div class="summary-list">
              ${summaryItems(system.rules)}
            </div>

            <div class="evidence">
              ${evidence(state, [
                'transition',
                'goals',
                'age'
              ])}
            </div>
          </section>
        </section>
      </main>
    </div>
  `;

  bindHeader();
}
