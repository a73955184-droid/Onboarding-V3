import {
  getState,
  getAssessmentResult,
  resetState
} from '../../application/state.js';

import {
  navigate
} from '../../application/router.js';

import {
  resolvePortfolioJobFit
} from '../../domain/portfolio-system/portfolio-job-fit-resolver.js';

import {
  presentPortfolioJobFit
} from '../../domain/portfolio-philosophy/portfolio-job-fit-presenter.js';


/*
 * ============================================================
 * Portfolio System Fit Screen
 * ============================================================
 *
 * PURPOSE
 *
 * Explain:
 *
 *   quiz evidence
 *       ->
 *   investor jobs
 *       ->
 *   portfolio philosophy
 *       ->
 *   variant
 *       ->
 *   portfolio structure
 *       ->
 *   sleeve rationale
 *       ->
 *   how the whole system supports the user
 *
 *
 * IMPORTANT
 *
 * This screen MUST NOT:
 *
 * - score the quiz
 * - resolve Stage
 * - resolve Style
 * - resolve Behavior
 * - resolve archetype
 * - resolve variant
 * - construct allocations
 * - change portfolio weights
 * - infer investment needs from sleeves
 *
 * All domain reasoning comes from:
 *
 *   resolvePortfolioJobFit()
 *   presentPortfolioJobFit()
 */


/*
 * ------------------------------------------------------------
 * HTML helpers
 * ------------------------------------------------------------
 */

function escapeHtml(value) {
  return String(
    value ?? ''
  )
    .replaceAll(
      '&',
      '&amp;'
    )
    .replaceAll(
      '<',
      '&lt;'
    )
    .replaceAll(
      '>',
      '&gt;'
    )
    .replaceAll(
      '"',
      '&quot;'
    )
    .replaceAll(
      "'",
      '&#039;'
    );
}


function renderEvidenceItems(
  items = []
) {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return `
      <p>
        Your assessment responses were used to
        build this explanation.
      </p>
    `;
  }

  return items
    .map(
      (item) => `
        <div class="summary-item">
          ${escapeHtml(item.text)}
        </div>
      `
    )
    .join('');
}


function renderSourceLinks(
  sources = []
) {
  if (
    !Array.isArray(sources) ||
    sources.length === 0
  ) {
    return '';
  }

  return `
    <div class="evidence">
      <strong>
        Principles behind this system:
      </strong>

      ${sources
        .map(
          (source) => `
            <div>
              ${
                source.url
                  ? `
                    <a
                      href="${escapeHtml(source.url)}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ${escapeHtml(source.organization)}
                      — ${escapeHtml(source.title)}
                    </a>
                  `
                  : `
                    ${escapeHtml(source.organization)}
                    — ${escapeHtml(source.title)}
                  `
              }
            </div>
          `
        )
        .join('')}
    </div>
  `;
}


function renderJobCard(
  job
) {
  if (!job) {
    return '';
  }

  return `
    <article class="profile-card">

      <span class="pill">
        ${escapeHtml(job.eyebrow)}
      </span>

      <h2>
        ${escapeHtml(job.title)}
      </h2>

      ${
        job.description
          ? `
            <p>
              ${escapeHtml(job.description)}
            </p>
          `
          : ''
      }

      ${
        job.portfolioRequirement
          ? `
            <div class="evidence">
              <strong>
                What that means for your portfolio:
              </strong>

              ${escapeHtml(job.portfolioRequirement)}
            </div>
          `
          : ''
      }

      ${
        job.systemFit
          ? `
            <div
              class="evidence"
              style="margin-top: 14px"
            >
              <strong>
                How this system supports it:
              </strong>

              ${escapeHtml(job.systemFit)}
            </div>
          `
          : ''
      }

    </article>
  `;
}


function renderDirectEvidence(
  userFit
) {
  if (
    userFit?.type !==
    'direct-evidence'
  ) {
    return '';
  }

  const evidence =
    userFit.evidence ??
    [];

  if (
    evidence.length === 0
  ) {
    return '';
  }

  return `
    <div
      class="evidence"
      style="margin-top: 14px"
    >
      <strong>
        ${escapeHtml(userFit.heading)}
      </strong>

      ${evidence
        .map(
          (item) => `
            <div>
              ${escapeHtml(item.text)}
            </div>
          `
        )
        .join('')}
    </div>
  `;
}


function renderSystemDesignExplanation(
  userFit
) {
  if (
    userFit?.type !==
    'system-design-only'
  ) {
    return '';
  }

  return `
    <div
      class="evidence"
      style="margin-top: 14px"
    >
      <strong>
        ${escapeHtml(userFit.heading)}
      </strong>

      ${
        userFit.explanation
          ? escapeHtml(
              userFit.explanation
            )
          : ''
      }
    </div>
  `;
}


function renderSleeve(
  sleeve
) {
  const operatingParts = [
    sleeve
      ?.operatingProfile
      ?.effortLabel,

    sleeve
      ?.operatingProfile
      ?.reviewCadenceLabel
  ].filter(Boolean);

  return `
    <article class="system-card">

      <span class="pill">
        ${escapeHtml(
          sleeve?.role?.label
        )}
      </span>

      <h2>
        ${escapeHtml(sleeve.label)}
        ${
          typeof sleeve.weightPercent ===
          'number'
            ? ` · ${sleeve.weightPercent}%`
            : ''
        }
      </h2>

      ${
        operatingParts.length > 0
          ? `
            <p>
              <strong>
                ${operatingParts
                  .map(escapeHtml)
                  .join(' · ')}
              </strong>
            </p>
          `
          : ''
      }

      ${
        sleeve.whyItExists
          ? `
            <div
              class="summary-item"
              style="margin-top: 14px"
            >
              <strong>
                Why this part exists
              </strong>

              <div>
                ${escapeHtml(
                  sleeve.whyItExists
                )}
              </div>
            </div>
          `
          : ''
      }

      ${
        sleeve.contributionToSystem
          ? `
            <div
              class="summary-item"
              style="margin-top: 14px"
            >
              <strong>
                What it contributes to the system
              </strong>

              <div>
                ${escapeHtml(
                  sleeve.contributionToSystem
                )}
              </div>
            </div>
          `
          : ''
      }

      ${renderDirectEvidence(
        sleeve.userFit
      )}

      ${renderSystemDesignExplanation(
        sleeve.userFit
      )}

      ${renderSourceLinks(
        sleeve.sources
      )}

    </article>
  `;
}


/*
 * ------------------------------------------------------------
 * Main screen
 * ------------------------------------------------------------
 */

export function renderPortfolioSystemFit(
  root
) {
  document.title =
    'AaronBux - Why This System Fits You';

  const state =
    getState();

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
              Why this system fits you
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
            style="width: 97%"
          ></div>
        </div>
      </header>


      <main class="main">

        <div
          id="missingState"
          class="card panel"
          style="display: none"
        >
          <h2>
            We could not find your recommendation.
          </h2>

          <p class="lead">
            Complete the assessment before reviewing
            why this investing system fits you.
          </p>

          <button
            id="startAssessmentBtn"
            class="btn btn-primary"
            type="button"
          >
            Start assessment
          </button>
        </div>


        <section
          id="result"
          style="display: none"
        >

          <!--
            HERO
          -->

          <div
            class="card panel result-hero"
          >
            <span
              class="pill"
              id="screenEyebrow"
            ></span>

            <h1
              id="screenTitle"
            ></h1>

            <p
              class="lead"
              id="screenDescription"
            ></p>
          </div>


          <!--
            SECTION 1
            QUIZ EVIDENCE
          -->

          <section
            class="card panel"
            style="margin-top: 22px"
          >
            <span class="pill">
              What your answers told us
            </span>

            <h2>
              The signals behind your profile
            </h2>

            <p id="evidenceDescription"></p>

            <div
              id="evidenceItems"
              class="summary-list"
              style="margin-top: 14px"
            ></div>
          </section>


          <!--
            SECTION 2
            INVESTOR JOBS
          -->

          <section
            style="margin-top: 22px"
          >
            <span class="pill">
              What your portfolio needs to do
            </span>

            <h2 id="jobsHeading"></h2>

            <p id="jobsDescription"></p>

            <div
              id="jobCards"
              class="result-grid"
            ></div>
          </section>


          <!--
            SECTION 3
            PORTFOLIO PHILOSOPHY
          -->

          <section
            class="card panel"
            style="margin-top: 22px"
          >
            <span class="pill">
              Why this portfolio philosophy
            </span>

            <h2
              id="philosophyTitle"
            ></h2>

            <p
              id="philosophySummary"
            ></p>

            <div
              class="evidence"
              id="philosophySources"
            ></div>
          </section>


          <!--
            SECTION 4
            VARIANT
          -->

          <section
            class="card panel"
            style="margin-top: 22px"
          >
            <span class="pill">
              Why this version
            </span>

            <h2
              id="variantTitle"
            ></h2>

            <p
              id="variantSummary"
            ></p>
          </section>


          <!--
            SECTION 5
            STRUCTURE
          -->

          <section
            class="card panel"
            style="margin-top: 22px"
          >
            <span class="pill">
              How this philosophy becomes a portfolio
            </span>

            <h2
              id="structureHeading"
            ></h2>

            <p
              id="structureSummary"
            ></p>

            <div
              id="structureMetrics"
              style="margin-top: 14px"
            ></div>
          </section>


          <!--
            SECTION 6
            SLEEVES
          -->

          <section
            style="margin-top: 22px"
          >
            <span class="pill">
              Why these portfolio parts exist
            </span>

            <h2>
              Each part has a different job
            </h2>

            <p
              id="sleeveDescription"
            ></p>

            <div
              id="sleeveCards"
              class="system-grid"
            ></div>
          </section>


          <!--
            SECTION 7
            SYSTEM FIT RECAP
          -->

          <section
            class="card panel"
            style="margin-top: 22px"
          >
            <span class="pill">
              How the whole system supports you
            </span>

            <h2>
              Your three jobs become operating rules
            </h2>

            <div
              id="systemFitItems"
              class="summary-list"
              style="margin-top: 14px"
            ></div>
          </section>


          <div class="next-row">

            <button
              id="systemBtn"
              class="btn btn-primary"
              type="button"
            >
              See how your system works
            </button>

          </div>

        </section>

      </main>
    </div>
  `;


  /*
   * ----------------------------------------------------------
   * Navigation
   * ----------------------------------------------------------
   */

  const backButton =
    root.querySelector(
      '#backBtn'
    );

  const restartButton =
    root.querySelector(
      '#restartBtn'
    );

  const missingState =
    root.querySelector(
      '#missingState'
    );

  const result =
    root.querySelector(
      '#result'
    );


  /*
   * This is intentionally the conceptual previous screen.
   *
   * Do not change the existing Profile + Jobs screen yet.
   * Routing will be wired in a later step.
   */
  backButton.addEventListener(
    'click',
    () => {
      navigate(
        'recommendation/profile-jobs'
      );
    }
  );


  restartButton.addEventListener(
    'click',
    () => {
      resetState();
      navigate('');
    }
  );


  /*
   * ----------------------------------------------------------
   * State validation
   * ----------------------------------------------------------
   */

  if (
    !state.answers ||
    Object.keys(
      state.answers
    ).length === 0
  ) {
    missingState.style.display =
      'block';

    root
      .querySelector(
        '#startAssessmentBtn'
      )
      .addEventListener(
        'click',
        () => {
          navigate(
            'assessment/1'
          );
        }
      );

    return;
  }


  const assessmentResult =
    getAssessmentResult();

  if (!assessmentResult) {
    missingState.style.display =
      'block';

    return;
  }


  /*
   * ----------------------------------------------------------
   * Domain resolution
   * ----------------------------------------------------------
   */

  let presentation;

  try {
    const fitResult =
      resolvePortfolioJobFit(
        assessmentResult
      );

    presentation =
      presentPortfolioJobFit(
        fitResult
      );
  } catch (error) {
    console.error(
      'Unable to resolve portfolio system fit:',
      error
    );

    missingState.style.display =
      'block';

    return;
  }


  result.style.display =
    'block';


  /*
   * ----------------------------------------------------------
   * HERO
   * ----------------------------------------------------------
   */

  root
    .querySelector(
      '#screenEyebrow'
    )
    .textContent =
      presentation
        .screen
        .eyebrow;

  root
    .querySelector(
      '#screenTitle'
    )
    .textContent =
      presentation
        .screen
        .title;

  root
    .querySelector(
      '#screenDescription'
    )
    .textContent =
      presentation
        .screen
        .description;


  /*
   * ----------------------------------------------------------
   * EVIDENCE
   * ----------------------------------------------------------
   */

  root
    .querySelector(
      '#evidenceDescription'
    )
    .textContent =
      presentation
        .evidence
        .description;

  root
    .querySelector(
      '#evidenceItems'
    )
    .innerHTML =
      renderEvidenceItems(
        presentation
          .evidence
          .items
      );


  /*
   * ----------------------------------------------------------
   * JOBS
   * ----------------------------------------------------------
   */

  root
    .querySelector(
      '#jobsHeading'
    )
    .textContent =
      presentation
        .jobs
        .heading;

  root
    .querySelector(
      '#jobsDescription'
    )
    .textContent =
      presentation
        .jobs
        .description;

  root
    .querySelector(
      '#jobCards'
    )
    .innerHTML =
      [
        presentation
          .jobs
          .stage,

        presentation
          .jobs
          .style,

        presentation
          .jobs
          .behavior
      ]
        .filter(Boolean)
        .map(
          renderJobCard
        )
        .join('');


  /*
   * ----------------------------------------------------------
   * PHILOSOPHY
   * ----------------------------------------------------------
   */

  root
    .querySelector(
      '#philosophyTitle'
    )
    .textContent =
      presentation
        .philosophy
        .archetype
        .title ??
      '';

  root
    .querySelector(
      '#philosophySummary'
    )
    .textContent =
      presentation
        .philosophy
        .archetype
        .summary ??
      '';

  root
    .querySelector(
      '#philosophySources'
    )
    .innerHTML =
      renderSourceLinks(
        presentation
          .philosophy
          .archetype
          .sources
      );


  /*
   * ----------------------------------------------------------
   * VARIANT
   * ----------------------------------------------------------
   */

  root
    .querySelector(
      '#variantTitle'
    )
    .textContent =
      presentation
        .philosophy
        .variant
        .title ??
      '';

  root
    .querySelector(
      '#variantSummary'
    )
    .textContent =
      presentation
        .philosophy
        .variant
        .summary ??
      '';


  /*
   * ----------------------------------------------------------
   * STRUCTURE
   * ----------------------------------------------------------
   */

  root
    .querySelector(
      '#structureHeading'
    )
    .textContent =
      presentation
        .structure
        .sleeveCount +
      (
        presentation
          .structure
          .sleeveCount === 1
          ? ' portfolio part'
          : ' portfolio parts'
      );

  root
    .querySelector(
      '#structureSummary'
    )
    .textContent =
      presentation
        .structure
        .summary;

  const structureMetrics = [];

  if (
    typeof presentation
      .structure
      .lowEffortPercent ===
    'number'
  ) {
    structureMetrics.push(`
      <div class="metric">
        <span>
          Low / very-low effort
        </span>

        <strong>
          ${
            presentation
              .structure
              .lowEffortPercent
          }% of portfolio
        </strong>
      </div>
    `);
  }

  if (
    presentation
      .structure
      .roleLabels
      ?.length
  ) {
    structureMetrics.push(`
      <div class="metric">
        <span>
          Portfolio roles
        </span>

        <strong>
          ${
            presentation
              .structure
              .roleLabels
              .map(escapeHtml)
              .join(' · ')
          }
        </strong>
      </div>
    `);
  }

  root
    .querySelector(
      '#structureMetrics'
    )
    .innerHTML =
      structureMetrics.join('');


  /*
   * ----------------------------------------------------------
   * SLEEVES
   * ----------------------------------------------------------
   */

  root
    .querySelector(
      '#sleeveDescription'
    )
    .textContent =
      presentation
        .sleeves
        .description;

  root
    .querySelector(
      '#sleeveCards'
    )
    .innerHTML =
      presentation
        .sleeves
        .items
        .map(
          renderSleeve
        )
        .join('');


  /*
   * ----------------------------------------------------------
   * SYSTEM FIT RECAP
   * ----------------------------------------------------------
   */

  root
    .querySelector(
      '#systemFitItems'
    )
    .innerHTML =
      presentation
        .systemFit
        .items
        .map(
          (job) => `
            <div class="summary-item">

              <strong>
                ${escapeHtml(
                  job.title
                )}
              </strong>

              <div>
                ${escapeHtml(
                  job.systemFit
                )}
              </div>

            </div>
          `
        )
        .join('');


  /*
   * ----------------------------------------------------------
   * Forward navigation
   * ----------------------------------------------------------
   */

  root
    .querySelector(
      '#systemBtn'
    )
    .addEventListener(
      'click',
      () => {
        navigate(
          'recommendation/system'
        );
      }
    );
}
