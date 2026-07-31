import { QUESTIONS } from '../../content/questions.js';
import { loadState, saveState } from '../../application/state.js';
import { navigate } from '../../application/router.js';
import { applyAnswer } from '../../domain/assessment-engine.js';

export function renderAssessment(root, step) {
  const config = QUESTIONS[step - 1];

  if (!config) {
    navigate('assessment/1');
    return;
  }

  document.title = config.documentTitle;

  root.innerHTML = `
    <div class="app-shell">
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
            <div class="step-label">Step ${step} of 8</div>
          </div>

          <div class="step-label">Investing check</div>
        </div>

        <div class="progress-track">
          <div
            class="progress-fill"
            style="width: ${step * 12.5}%"
          ></div>
        </div>
      </header>

      <main class="main">
        <section class="panel card question-panel">
          <h2>${config.heading}</h2>

          <p class="question-note">
            ${config.note}
          </p>

          <div
            id="options"
            class="screen-grid"
          ></div>
        </section>
      </main>

      <nav class="bottom-nav">
        <div class="bottom-inner">
          <span class="step-label">
            ${config.footerNote}
          </span>

          <button
            class="btn btn-primary"
            id="continueBtn"
            type="button"
          >
            Continue
          </button>
        </div>
      </nav>
    </div>
  `;

  const grid = document.getElementById('options');
  const continueButton = document.getElementById('continueBtn');
  const backButton = document.getElementById('backBtn');
  const selected = [];

  grid.innerHTML = config.options
    .map(
      (option) => `
        <button
          class="option-card"
          data-id="${option.id}"
          type="button"
        >
          <span class="option-card-title">
            ${option.label}
          </span>

          <span class="option-card-meta">
            ${option.helper || ''}
          </span>

          <span class="check">✓</span>
        </button>
      `
    )
    .join('');

  continueButton.disabled = true;

  grid.querySelectorAll('.option-card').forEach((card) => {
    card.onclick = () => {
      const id = card.dataset.id;
      const index = selected.indexOf(id);

      if (index >= 0) {
        selected.splice(index, 1);
        card.classList.remove('selected');
      } else {
        if (config.max === 1) {
          selected.splice(0);

          grid
            .querySelectorAll('.option-card')
            .forEach((optionCard) => {
              optionCard.classList.remove('selected');
            });
        }

        if (selected.length < config.max) {
          selected.push(id);
          card.classList.add('selected');
        }
      }

      continueButton.disabled =
        selected.length < config.min;
    };
  });

  continueButton.onclick = () => {
    const state = applyAnswer(
      loadState(),
      config,
      selected
    );

    saveState(state);

    navigate(
      step === 8
        ? 'recommendation/profile'
        : `assessment/${step + 1}`
    );
  };

  backButton.onclick = () => {
    if (step === 1) {
      navigate('');
      return;
    }

    navigate(`assessment/${step - 1}`);
  };
}
