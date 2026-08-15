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
} from '../../domain/portfolio-philosophy/portfolio-job-fit-resolver.js';

import {
  presentPortfolioJobFit
} from '../../domain/portfolio-philosophy/portfolio-job-fit-presenter.js';

import {
  presentInvestorSystemGuidance
} from '../../domain/investor-system-guidance/investor-system-guidance-presenter.js';


/*
 * ============================================================
 * Portfolio System Fit Screen
 * ============================================================
 */


/*
 * ============================================================
 * HTML helpers
 * ============================================================
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


/*
 * ============================================================
 * Sources
 * ============================================================
 */

function renderSources(
  sources = [],
  heading = 'Principles behind this system'
) {
  if (
    !Array.isArray(sources) ||
    sources.length === 0
  ) {
    return '';
  }

  return `
    <div
      class="evidence"
      style="margin-top: 16px"
    >
      <strong>
        ${escapeHtml(heading)}
      </strong>

      ${sources
        .map(
          (source) => `
            <div
              style="margin-top: 6px"
            >
              ${
                source.url
                  ? `
                    <a
                      href="${escapeHtml(source.url)}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ${escapeHtml(
                        source.organization
                      )}
                      —
                      ${escapeHtml(
                        source.title
                      )}
                    </a>
                  `
                  : `
                    ${escapeHtml(
                      source.organization
                    )}
                    —
                    ${escapeHtml(
                      source.title
                    )}
                  `
              }
            </div>
          `
        )
        .join('')}
    </div>
  `;
}


/*
 * ============================================================
 * Investor Profile Accountability
 * ============================================================
 */

function renderEvidenceAnswers(
  evidence = []
) {
  if (
    !Array.isArray(evidence) ||
    evidence.length === 0
  ) {
    return `
      <span>
        Your selected answers contributed to this profile result.
      </span>
    `;
  }

  return evidence
    .map(
      (answer) => `
        <div
          style="
            margin-bottom: 8px;
            line-height: 1.45;
          "
        >
          ${
            answer.questionLabel
              ? `
                <strong>
                  ${escapeHtml(
                    answer.questionLabel
                  )}:
                </strong>
                <br>
              `
              : ''
          }

          ${escapeHtml(
            answer.answerText
          )}
        </div>
      `
    )
    .join('');
}


function renderProfileAccountability(
  accountability
) {
  if (!accountability) {
    return '';
  }

  const items =
    accountability.items ??
    [];

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return '';
  }

  return `
    <div
      style="margin-top: 28px"
    >

      <span class="pill">
        ${escapeHtml(
          accountability.eyebrow ??
          'ACCOUNTABLE TO YOUR INVESTOR PROFILE'
        )}
      </span>


      <h2
        style="margin-top: 12px"
      >
        ${escapeHtml(
          accountability.title ??
          'How your answers translate into this system'
        )}
      </h2>


      ${
        accountability.summary
          ? `
            <p>
              ${escapeHtml(
                accountability.summary
              )}
            </p>
          `
          : ''
      }


      <div
        style="
          overflow-x: auto;
          margin-top: 20px;
          padding-bottom: 4px;
        "
      >

        <table
          style="
            width: 100%;
            min-width: 980px;
            border-collapse: collapse;
            table-layout: fixed;
          "
        >

          <thead>

            <tr>

              <th
                style="
                  width: 20%;
                  text-align: left;
                  vertical-align: top;
                  padding: 14px 14px 14px 0;
                  border-bottom: 1px solid rgba(0,0,0,0.12);
                "
              >
                Guidance indication
              </th>

              <th
                style="
                  width: 30%;
                  text-align: left;
                  vertical-align: top;
                  padding: 14px;
                  border-bottom: 1px solid rgba(0,0,0,0.12);
                "
              >
                Your quiz response
              </th>

              <th
                style="
                  width: 25%;
                  text-align: left;
                  vertical-align: top;
                  padding: 14px;
                  border-bottom: 1px solid rgba(0,0,0,0.12);
                "
              >
                Investing system JTBD
              </th>

              <th
                style="
                  width: 25%;
                  text-align: left;
                  vertical-align: top;
                  padding: 14px 0 14px 14px;
                  border-bottom: 1px solid rgba(0,0,0,0.12);
                "
              >
                How your recommended system helps
              </th>

            </tr>

          </thead>


          <tbody>

            ${items
              .map(
                (item) => `
                  <tr>

                    <td
                      style="
                        vertical-align: top;
                        padding: 18px 14px 18px 0;
                        border-bottom: 1px solid rgba(0,0,0,0.08);
                      "
                    >

                      <strong>
                        ${escapeHtml(
                          item.guidanceIndication
                        )}
                      </strong>

                    </td>


                    <td
                      style="
                        vertical-align: top;
                        padding: 18px 14px;
                        border-bottom: 1px solid rgba(0,0,0,0.08);
                      "
                    >

                      ${renderEvidenceAnswers(
                        item.whatYouToldUs
                      )}

                    </td>


                    <td
                      style="
                        vertical-align: top;
                        padding: 18px 14px;
                        border-bottom: 1px solid rgba(0,0,0,0.08);
                      "
                    >

                      <strong>
                        ${escapeHtml(
                          item.userJTBD
                        )}
                      </strong>

                    </td>


                    <td
                      style="
                        vertical-align: top;
                        padding: 18px 0 18px 14px;
                        border-bottom: 1px solid rgba(0,0,0,0.08);
                      "
                    >

                      ${escapeHtml(
                        item.systemResponse
                      )}

                    </td>

                  </tr>
                `
              )
              .join('')}

          </tbody>

        </table>

      </div>

    </div>
  `;
}


/*
 * ============================================================
 * Complexity
 * ============================================================
 */

function renderComplexityReason(
  title,
  body
) {
  if (!body) {
    return '';
  }

  return `
    <div class="summary-item">

      <strong>
        ${escapeHtml(title)}
      </strong>

      <div>
        ${escapeHtml(body)}
      </div>

    </div>
  `;
}


/*
 * ============================================================
 * Effort model
 * ============================================================
 */

function renderEffortDistribution(
  effort
) {
  const distribution =
    effort
      ?.portfolioEffort
      ?.distribution ??
    [];

  if (
    distribution.length === 0
  ) {
    return '';
  }

  return `
    <div
      class="summary-list"
      style="margin-top: 16px"
    >

      ${distribution
        .map(
          (item) => `
            <div class="summary-item">

              <strong>
                ${escapeHtml(
                  item.label
                )}
              </strong>

              <div>
                ${escapeHtml(
                  String(
                    item.percent
                  )
                )}% of portfolio
              </div>

              ${
                item.meaning
                  ? `
                    <div
                      style="margin-top: 6px"
                    >
                      ${escapeHtml(
                        item.meaning
                      )}
                    </div>
                  `
                  : ''
              }

            </div>
          `
        )
        .join('')}

    </div>
  `;
}


function renderSleeveEffortRows(
  sleeves = []
) {
  if (
    !Array.isArray(sleeves) ||
    sleeves.length === 0
  ) {
    return '';
  }

  return `
    <div
      class="summary-list"
      style="margin-top: 18px"
    >

      ${sleeves
        .map(
          (sleeve) => `
            <div class="summary-item">

              <strong>
                ${escapeHtml(
                  sleeve.label
                )}

                ${
                  typeof sleeve
                    .weightPercent ===
                  'number'
                    ? ` · ${
                        sleeve
                          .weightPercent
                      }%`
                    : ''
                }
              </strong>

              <div
                style="margin-top: 4px"
              >
                ${escapeHtml(
                  sleeve
                    .guidance
                    ?.effort
                    ?.label ??
                  ''
                )}

                ${
                  sleeve
                    .guidance
                    ?.effort
                    ?.reviewCadenceLabel
                    ? ` · ${escapeHtml(
                        sleeve
                          .guidance
                          .effort
                          .reviewCadenceLabel
                      )}`
                    : ''
                }
              </div>

              ${
                sleeve
                  .guidance
                  ?.effort
                  ?.whyThisEffort
                  ? `
                    <div
                      style="margin-top: 6px"
                    >
                      ${escapeHtml(
                        sleeve
                          .guidance
                          .effort
                          .whyThisEffort
                      )}
                    </div>
                  `
                  : ''
              }

            </div>
          `
        )
        .join('')}

    </div>
  `;
}


/*
 * ============================================================
 * Behavior
 * ============================================================
 */

function renderDecisionProtocol(
  behavior
) {
  const steps =
    behavior
      ?.decisionProtocol ??
    [];

  if (
    steps.length === 0
  ) {
    return '';
  }

  return `
    <div
      class="summary-list"
      style="margin-top: 18px"
    >

      ${steps
        .map(
          (step) => `
            <div class="summary-item">

              <strong>
                ${escapeHtml(
                  String(
                    step.step
                  )
                )}.
                ${escapeHtml(
                  step.question
                )}
              </strong>

              ${
                step.purpose
                  ? `
                    <div
                      style="margin-top: 6px"
                    >
                      ${escapeHtml(
                        step.purpose
                      )}
                    </div>
                  `
                  : ''
              }

            </div>
          `
        )
        .join('')}

    </div>
  `;
}


function humanizeOutcome(
  outcome
) {
  const map = {
    'leave-alone':
      'Leave alone',

    monitor:
      'Monitor',

    review:
      'Review',

    'consider-action':
      'Consider action',

    'keep-current-system':
      'Keep current system',

    'continue-research':
      'Continue research',

    'review-existing-sleeve':
      'Review existing sleeve',

    'consider-change':
      'Consider change',

    'ignore-opportunity':
      'Ignore opportunity',

    'watch-opportunity':
      'Watch opportunity',

    'research-within-sleeve':
      'Research within sleeve',

    'consider-bounded-allocation':
      'Consider bounded allocation',

    'continue-comparison':
      'Continue comparison',

    'review-improvement-sleeve':
      'Review improvement sleeve',

    'consider-improvement':
      'Consider improvement'
  };

  return (
    map[outcome] ??
    String(outcome)
      .replaceAll(
        '-',
        ' '
      )
  );
}


function renderBehaviorOutcomes(
  outcomes = []
) {
  if (
    !Array.isArray(outcomes) ||
    outcomes.length === 0
  ) {
    return '';
  }

  return `
    <div
      style="
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      "
    >

      ${outcomes
        .map(
          (outcome) => `
            <span class="pill">
              ${escapeHtml(
                humanizeOutcome(
                  outcome
                )
              )}
            </span>
          `
        )
        .join('')}

    </div>
  `;
}


/*
 * ============================================================
 * Sleeve content
 * ============================================================
 */

function renderAssetCategories(
  sleeve
) {
  const categories =
    sleeve
      .assetCategories ??
    [];

  if (
    !Array.isArray(
      categories
    ) ||
    categories.length === 0
  ) {
    return '';
  }

  return `
    <div
      class="summary-item"
      style="margin-top: 12px"
    >

      <strong>
        What can belong here
      </strong>

      <div
        style="margin-top: 6px"
      >
        ${categories
          .map(
            (category) =>
              escapeHtml(
                category.label ??
                category.displayName ??
                category.id ??
                category
              )
          )
          .join(' · ')}
      </div>

    </div>
  `;
}


function renderMarketSignals(
  sleeve
) {
  const trends =
    sleeve
      ?.monitoring
      ?.marketTrends ??
    [];

  if (
    !Array.isArray(trends) ||
    trends.length === 0
  ) {
    if (
      sleeve
        ?.guidance
        ?.relevantSignals
    ) {
      return `
        <div
          class="summary-item"
          style="margin-top: 12px"
        >

          <strong>
            What is worth monitoring
          </strong>

          <div>
            ${escapeHtml(
              sleeve
                .guidance
                .relevantSignals
            )}
          </div>

        </div>
      `;
    }

    return '';
  }

  return `
    <div
      class="summary-item"
      style="margin-top: 12px"
    >

      <strong>
        What is worth monitoring
      </strong>

      ${trends
        .map(
          (trend) => `
            <div
              style="margin-top: 8px"
            >

              <strong>
                ${escapeHtml(
                  trend.label
                )}
              </strong>

              ${
                trend.reviewQuestion
                  ? `
                    <div>
                      ${escapeHtml(
                        trend
                          .reviewQuestion
                      )}
                    </div>
                  `
                  : ''
              }

            </div>
          `
        )
        .join('')}

    </div>
  `;
}


function renderSleeveCard(
  sleeve
) {
  const guidance =
    sleeve
      .guidance ??
    {};

  const effort =
    guidance
      .effort ??
    {};

  const roleLabel =
    sleeve
      ?.role
      ?.label ??
    'Portfolio role';

  return `
    <article class="system-card">

      <span class="pill">
        ${escapeHtml(
          roleLabel
        )}
      </span>

      <h2>
        ${escapeHtml(
          sleeve.label
        )}

        ${
          typeof sleeve
            .weightPercent ===
          'number'
            ? ` · ${
                sleeve
                  .weightPercent
              }%`
            : ''
        }
      </h2>


      ${
        guidance
          .investorQuestion
          ? `
            <p>
              <strong>
                ${escapeHtml(
                  guidance
                    .investorQuestion
                )}
              </strong>
            </p>
          `
          : ''
      }


      ${
        guidance.job
          ? `
            <div class="summary-item">

              <strong>
                Its job
              </strong>

              <div>
                ${escapeHtml(
                  guidance.job
                )}
              </div>

            </div>
          `
          : ''
      }


      ${
        guidance
          .returnContribution
          ? `
            <div
              class="summary-item"
              style="margin-top: 12px"
            >

              <strong>
                Return contribution
              </strong>

              <div>
                ${escapeHtml(
                  guidance
                    .returnContribution
                )}
              </div>

            </div>
          `
          : ''
      }


      ${renderAssetCategories(
        sleeve
      )}


      ${
        guidance
          .whatBelongs
          ? `
            <div
              class="summary-item"
              style="margin-top: 12px"
            >

              <strong>
                Sleeve mandate
              </strong>

              <div>
                ${escapeHtml(
                  guidance
                    .whatBelongs
                )}
              </div>

            </div>
          `
          : ''
      }


      <div
        class="summary-item"
        style="margin-top: 12px"
      >

        <strong>
          Your effort
        </strong>

        <div>
          ${escapeHtml(
            effort.label ??
            'Not specified'
          )}

          ${
            effort
              .reviewCadenceLabel
              ? ` · ${escapeHtml(
                  effort
                    .reviewCadenceLabel
                )}`
              : ''
          }
        </div>

        ${
          effort
            .usefulAttention
            ? `
              <div
                style="margin-top: 6px"
              >
                ${escapeHtml(
                  effort
                    .usefulAttention
                )}
              </div>
            `
            : ''
        }

      </div>


      ${renderMarketSignals(
        sleeve
      )}


      ${
        guidance
          .whatUsuallyDoesNotBelong
          ? `
            <div
              class="summary-item"
              style="margin-top: 12px"
            >

              <strong>
                What usually does not belong
              </strong>

              <div>
                ${escapeHtml(
                  guidance
                    .whatUsuallyDoesNotBelong
                )}
              </div>

            </div>
          `
          : ''
      }


      ${
        guidance
          .redundancyCheck
          ? `
            <div
              class="summary-item"
              style="margin-top: 12px"
            >

              <strong>
                Redundancy check
              </strong>

              <div>
                ${escapeHtml(
                  guidance
                    .redundancyCheck
                )}
              </div>

            </div>
          `
          : ''
      }


      ${
        effort
          .redundantAttention
          ? `
            <div
              class="summary-item"
              style="margin-top: 12px"
            >

              <strong>
                When extra effort becomes unnecessary
              </strong>

              <div>
                ${escapeHtml(
                  effort
                    .redundantAttention
                )}
              </div>

            </div>
          `
          : ''
      }


      ${
        guidance
          .actionBoundary
          ? `
            <div
              class="evidence"
              style="margin-top: 14px"
            >

              <strong>
                When reconsideration is warranted
              </strong>

              <div>
                ${escapeHtml(
                  guidance
                    .actionBoundary
                )}
              </div>

            </div>
          `
          : ''
      }

    </article>
  `;
}


/*
 * ============================================================
 * Main screen
 * ============================================================
 */

export function renderPortfolioSystemFit(
  root
) {
  document.title =
    'AaronBux - Your Portfolio System';

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


          <div
            style="text-align: center"
          >

            <div class="brand">
              AaronBux
            </div>

            <div class="step-label">
              YOUR PORTFOLIO SYSTEM
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
            your portfolio system.
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


          <!-- ==================================================
               HERO / SYSTEM REVEAL
               ================================================== -->

          <section
            class="card panel result-hero"
          >

            <span
              class="pill"
              id="recommendationEyebrow"
            ></span>


            <h1
              id="recommendationTitle"
            ></h1>


            <p
              id="systemName"
              style="
                font-weight: 700;
                margin-top: 10px;
              "
            ></p>


            <div
              class="summary-item"
              style="margin-top: 22px"
            >

              <strong>
                Portfolio philosophy
              </strong>


              <div
                id="heroPhilosophyName"
                style="
                  font-weight: 700;
                  margin-top: 6px;
                "
              ></div>


              <div
                id="heroPhilosophySummary"
                style="margin-top: 6px"
              ></div>

            </div>


            <div
              id="heroPhilosophySources"
            ></div>


            <div
              id="profileAccountability"
            ></div>

          </section>


          <!-- ==================================================
               PHILOSOPHY IMPLEMENTATION
               ================================================== -->

          <section
            class="card panel"
            style="margin-top: 24px"
          >

            <span class="pill">
              HOW THIS PHILOSOPHY ORGANIZES YOUR SYSTEM
            </span>

            <h2>
              What this philosophy requires from the portfolio
            </h2>

            <p
              class="lead"
              id="philosophyWhy"
            ></p>

          </section>


          <!-- ==================================================
               VARIANT / COMPLEXITY
               ================================================== -->

          <section
            class="card panel"
            style="margin-top: 24px"
          >

            <span class="pill">
              WHY THIS VERSION
            </span>


            <h2
              id="complexityHeading"
            ></h2>


            <p
              class="lead"
              id="complexitySummary"
            ></p>


            <div
              class="summary-list"
              id="complexityReasons"
              style="margin-top: 16px"
            ></div>

          </section>


          <!-- ==================================================
               EFFORT MODEL
               ================================================== -->

          <section
            class="card panel"
            style="margin-top: 24px"
          >

            <span class="pill">
              YOUR EFFORT MODEL
            </span>


            <h2>
              Where is your investing effort worth spending?
            </h2>


            <p
              class="lead"
              id="effortSummary"
            ></p>


            <div
              id="effortDistribution"
            ></div>


            <div
              id="sleeveEffortRows"
            ></div>


            <div
              class="evidence"
              style="margin-top: 18px"
            >

              <strong>
                Effort vs. return contribution
              </strong>

              <div
                id="returnEffortExplanation"
              ></div>

            </div>


            <div
              class="summary-item"
              style="margin-top: 14px"
            >

              <strong>
                When extra effort becomes redundant
              </strong>

              <div
                id="effortWarning"
              ></div>

            </div>

          </section>


          <!-- ==================================================
               BEHAVIOR
               ================================================== -->

          <section
            class="card panel"
            style="margin-top: 24px"
          >

            <span class="pill">
              HOW YOUR SYSTEM HELPS YOU DECIDE
            </span>


            <h2
              id="behaviorFraming"
            ></h2>


            <p
              class="lead"
              id="behaviorSummary"
            ></p>


            <div
              class="summary-item"
              style="margin-top: 16px"
            >

              <strong>
                The decision question your system helps answer
              </strong>

              <div
                id="behaviorQuestion"
              ></div>

            </div>


            <div
              class="summary-item"
              style="margin-top: 14px"
            >

              <strong>
                System guardrail
              </strong>

              <div
                id="behaviorGuardrail"
              ></div>

            </div>


            <div
              id="decisionProtocol"
            ></div>


            <div
              id="behaviorOutcomes"
            ></div>

          </section>


          <!-- ==================================================
               BOUNDED SLEEVES
               ================================================== -->

          <section
            style="margin-top: 24px"
          >

            <span class="pill">
              YOUR BOUNDED PORTFOLIO SYSTEM
            </span>


            <h2>
              Every part has a job, boundary, and effort budget
            </h2>


            <p>
              Each sleeve defines what belongs, what outcome it
              contributes, what information matters, how much
              attention it deserves, and when reconsideration is
              actually warranted.
            </p>


            <div
              class="system-grid"
              id="boundedSleeveCards"
            ></div>

          </section>


          <!-- ==================================================
               USER LED
               ================================================== -->

          <section
            class="card panel"
            style="margin-top: 24px"
          >

            <span class="pill">
              USER LED
            </span>


            <h2
              id="userLedTitle"
            ></h2>


            <p
              class="lead"
              id="userLedExplanation"
            ></p>

          </section>


          <div class="next-row">

            <button
              id="portfolioBtn"
              class="btn btn-primary"
              type="button"
            >
              Continue to your portfolio
            </button>

          </div>

        </section>

      </main>

    </div>
  `;


  /*
   * ==========================================================
   * Navigation
   * ==========================================================
   */

  root
    .querySelector(
      '#backBtn'
    )
    .addEventListener(
      'click',
      () => {
        navigate(
          'recommendation/profile'
        );
      }
    );


  root
    .querySelector(
      '#restartBtn'
    )
    .addEventListener(
      'click',
      () => {
        resetState();
        navigate('');
      }
    );


  /*
   * ==========================================================
   * Missing state
   * ==========================================================
   */

  const missingState =
    root.querySelector(
      '#missingState'
    );

  const result =
    root.querySelector(
      '#result'
    );


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
   * ==========================================================
   * Domain pipeline
   * ==========================================================
   */

  let guidance;


  try {
    const fitResult =
      resolvePortfolioJobFit(
        assessmentResult
      );


    const fitPresentation =
      presentPortfolioJobFit(
        fitResult
      );


    guidance =
      presentInvestorSystemGuidance(
        fitPresentation
      );
  } catch (error) {
    console.error(
      'Unable to resolve investor system guidance:',
      error
    );


    missingState.style.display =
      'block';

    return;
  }


  result.style.display =
    'block';


  /*
   * ==========================================================
   * HERO / SYSTEM REVEAL
   * ==========================================================
   */

  const reveal =
    guidance
      .recommendationReveal;


  root
    .querySelector(
      '#recommendationEyebrow'
    )
    .textContent =
      reveal
        .eyebrow;


  root
    .querySelector(
      '#recommendationTitle'
    )
    .textContent =
      reveal
        .title;


  root
    .querySelector(
      '#systemName'
    )
    .textContent =
      reveal
        .systemName
        ? (
            'AaronBux system: ' +
            reveal.systemName
          )
        : '';


  root
    .querySelector(
      '#heroPhilosophyName'
    )
    .textContent =
      reveal
        .philosophy
        .name ??
      '';


  root
    .querySelector(
      '#heroPhilosophySummary'
    )
    .textContent =
      reveal
        .philosophy
        .summary ??
      '';


  root
    .querySelector(
      '#heroPhilosophySources'
    )
    .innerHTML =
      renderSources(
        reveal
          .philosophy
          .sources,
        'Philosophy source'
      );


  /*
   * Updated four-column accountability section.
   */

  root
    .querySelector(
      '#profileAccountability'
    )
    .innerHTML =
      renderProfileAccountability(
        reveal
          .profileAccountability
      );


  /*
   * ==========================================================
   * PHILOSOPHY
   * ==========================================================
   */

  root
    .querySelector(
      '#philosophyWhy'
    )
    .textContent =
      guidance
        .philosophy
        .whyItMatters ??
      '';


  /*
   * ==========================================================
   * COMPLEXITY
   * ==========================================================
   */

  const complexity =
    guidance
      .complexity;


  root
    .querySelector(
      '#complexityHeading'
    )
    .textContent =
      'Why ' +
      complexity
        .sleeveCount +
      ' portfolio roles?';


  root
    .querySelector(
      '#complexitySummary'
    )
    .textContent =
      complexity
        .userFacingSummary ??
      complexity
        .generalMeaning ??
      '';


  root
    .querySelector(
      '#complexityReasons'
    )
    .innerHTML =
      [
        renderComplexityReason(
          'Why this version',
          complexity
            .whyThisVersion
        ),

        renderComplexityReason(
          'What the additional separation gives you',
          complexity
            .whatSeparationProvides
        ),

        renderComplexityReason(
          'Why not simpler?',
          complexity
            .whyNotSimpler
        ),

        renderComplexityReason(
          'Why not more complex?',
          complexity
            .whyNotMoreComplex
        )
      ].join('');


  /*
   * ==========================================================
   * EFFORT
   * ==========================================================
   */

  const effort =
    guidance
      .effort;


  root
    .querySelector(
      '#effortSummary'
    )
    .textContent =
      effort
        ?.portfolioEffort
        ?.summary ??
      effort
        ?.userFacingSummary ??
      '';


  root
    .querySelector(
      '#effortDistribution'
    )
    .innerHTML =
      renderEffortDistribution(
        effort
      );


  root
    .querySelector(
      '#sleeveEffortRows'
    )
    .innerHTML =
      renderSleeveEffortRows(
        guidance
          .sleeves
      );


  root
    .querySelector(
      '#returnEffortExplanation'
    )
    .textContent =
      effort
        ?.returnEffortPrinciple
        ?.explanation ??
      '';


  root
    .querySelector(
      '#effortWarning'
    )
    .textContent =
      effort
        ?.excessiveEffortWarning ??
      effort
        ?.systemBoundary
        ?.excessive ??
      '';


  /*
   * ==========================================================
   * BEHAVIOR
   * ==========================================================
   */

  const behavior =
    guidance
      .behavior;


  root
    .querySelector(
      '#behaviorFraming'
    )
    .textContent =
      behavior
        ?.decisionFraming ??
      'Use your system before reacting.';


  root
    .querySelector(
      '#behaviorSummary'
    )
    .textContent =
      behavior
        ?.userFacingSummary ??
      '';


  root
    .querySelector(
      '#behaviorQuestion'
    )
    .textContent =
      behavior
        ?.investorQuestion ??
      '';


  root
    .querySelector(
      '#behaviorGuardrail'
    )
    .textContent =
      behavior
        ?.systemGuardrail ??
      '';


  root
    .querySelector(
      '#decisionProtocol'
    )
    .innerHTML =
      renderDecisionProtocol(
        behavior
      );


  root
    .querySelector(
      '#behaviorOutcomes'
    )
    .innerHTML =
      renderBehaviorOutcomes(
        behavior
          ?.outcomes
      );


  /*
   * ==========================================================
   * BOUNDED SLEEVES
   * ==========================================================
   */

  root
    .querySelector(
      '#boundedSleeveCards'
    )
    .innerHTML =
      guidance
        .sleeves
        .map(
          renderSleeveCard
        )
        .join('');


  /*
   * ==========================================================
   * USER LED
   * ==========================================================
   */

  root
    .querySelector(
      '#userLedTitle'
    )
    .textContent =
      guidance
        .userLedPrinciple
        .title;


  root
    .querySelector(
      '#userLedExplanation'
    )
    .textContent =
      guidance
        .userLedPrinciple
        .explanation;


  /*
   * ==========================================================
   * Forward navigation
   * ==========================================================
   */

  root
    .querySelector(
      '#portfolioBtn'
    )
    .addEventListener(
      'click',
      () => {
        navigate(
          'recommendation/portfolio'
        );
      }
    );
}
