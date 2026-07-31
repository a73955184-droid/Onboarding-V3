import { QUESTIONS } from '../../content/questions.js';

import {
  getAnswer,
  setAnswer,
  setCurrentQuestionId
} from '../../application/state.js';

import {
  navigate
} from '../../application/router.js';


function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function normalizeSelection(answer) {
  if (Array.isArray(answer)) {
    return answer.filter(
      (value) => typeof value === 'string'
    );
  }

  if (
    typeof answer === 'string' &&
    answer
  ) {
    return [answer];
  }

  if (
    answer &&
    typeof answer === 'object'
  ) {
    if (
      Array.isArray(
        answer.selectedOptionIds
      )
    ) {
      return answer.selectedOptionIds.filter(
        (value) =>
          typeof value === 'string'
      );
    }

    if (
      typeof answer.optionId ===
      'string'
    ) {
      return [answer.optionId];
    }
  }

  return [];
}


export function renderAssessment(
  root,
  step
) {
  const config =
    QUESTIONS[step - 1];

  if (!config) {
    navigate('assessment/1');
    return;
  }

  const totalSteps =
    QUESTIONS.length;

  const questionId =
    config.screenKey;

  const selected =
    normalizeSelection(
      getAnswer(questionId)
    );

  setCurrentQuestionId(
    questionId
  );

  document.title =
    config.documentTitle;

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
            <div class="brand">
              AaronBux
            </div>

            <div class="step-label">
              Step ${step} of ${totalSteps}
            </div>
          </div>

          <div class="step-label">
            Investing check
          </div>
        </div>

        <div class="progress-track">
          <div
            class="progress-fill"
            style="width: ${
              (step / totalSteps) * 100
            }%"
          ></div>
        </div>
      </header>

      <main class="main">
        <section
          class="panel card question-panel"
        >
          <h2>
            ${escapeHtml(
              config.heading
            )}
          </h2>

          <p class="question-note">
            ${escapeHtml(
              config.note
            )}
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
            ${escapeHtml(
              config.footerNote
            )}
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

  const grid =
    root.querySelector(
      '#options'
    );

  const continueButton =
    root.querySelector(
      '#continueBtn'
    );

  const backButton =
    root.querySelector(
      '#backBtn'
    );

  grid.innerHTML =
    config.options
      .map((option) => {
        const isSelected =
          selected.includes(
            option.id
          );

        return `
          <button
            class="option-card${
              isSelected
                ? ' selected'
                : ''
            }"
            data-id="${escapeHtml(
              option.id
            )}"
            type="button"
            aria-pressed="${
              isSelected
            }"
          >
            <span
              class="option-card-title"
            >
              ${escapeHtml(
                option.label
              )}
            </span>

            <span
              class="option-card-meta"
            >
              ${escapeHtml(
                option.helper || ''
              )}
            </span>

            <span
              class="check"
              aria-hidden="true"
            >
              ✓
            </span>
          </button>
        `;
      })
      .join('');

  const refreshContinueState =
    () => {
      continueButton.disabled =
        selected.length <
        config.min;
    };

  refreshContinueState();

  grid
    .querySelectorAll(
      '.option-card'
    )
    .forEach((card) => {
      card.addEventListener(
        'click',
        () => {
          const id =
            card.dataset.id;

          const existingIndex =
            selected.indexOf(id);

          if (
            existingIndex >= 0
          ) {
            selected.splice(
              existingIndex,
              1
            );

            card.classList.remove(
              'selected'
            );

            card.setAttribute(
              'aria-pressed',
              'false'
            );
          } else {
            if (
              config.max === 1
            ) {
              selected.splice(
                0,
                selected.length
              );

              grid
                .querySelectorAll(
                  '.option-card'
                )
                .forEach(
                  (
                    optionCard
                  ) => {
                    optionCard
                      .classList
                      .remove(
                        'selected'
                      );

                    optionCard
                      .setAttribute(
                        'aria-pressed',
                        'false'
                      );
                  }
                );
            }

            if (
              selected.length <
              config.max
            ) {
              selected.push(id);

              card.classList.add(
                'selected'
              );

              card.setAttribute(
                'aria-pressed',
                'true'
              );
            }
          }

          refreshContinueState();
        }
      );
    });

  continueButton.addEventListener(
    'click',
    () => {
      if (
        selected.length <
        config.min
      ) {
        return;
      }

      setAnswer(
        questionId,
        [...selected]
      );

      navigate(
        step === totalSteps
          ? 'recommendation/profile'
          : `assessment/${
              step + 1
            }`
      );
    }
  );

  backButton.addEventListener(
    'click',
    () => {
      if (step === 1) {
        navigate('');
        return;
      }

      navigate(
        `assessment/${
          step - 1
        }`
      );
    }
  );
}
