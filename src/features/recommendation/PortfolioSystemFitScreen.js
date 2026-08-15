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
 *
 * PURPOSE
 * -------
 *
 * Translate the resolved recommendation into investor language.
 *
 * The screen answers:
 *
 * 1. What does my portfolio need to help me do?
 * 2. Why this portfolio philosophy?
 * 3. Why this version / this many sleeves?
 * 4. Where is my investing effort worth spending?
 * 5. How should the system help me make decisions?
 * 6. What job does each sleeve perform?
 * 7. What belongs in each sleeve?
 * 8. What should I monitor?
 * 9. How often should I review it?
 * 10. What is redundant, mismatched, or unnecessary?
 *
 *
 * IMPORTANT
 * ---------
 *
 * This screen does NOT:
 *
 * - score quiz answers
 * - resolve Stage
 * - resolve Style
 * - resolve Behavior
 * - resolve archetype
 * - resolve variant
 * - modify portfolio construction
 * - modify allocations
 * - select securities
 * - recommend trades
 *
 * It consumes already-resolved domain output.
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
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function renderText(value) {
  if (!value) {
    return '';
  }

  return escapeHtml(value);
}


function renderOptionalParagraph(
  value,
  className = ''
) {
  if (!value) {
    return '';
  }

  return `
    <p class="${className}">
      ${escapeHtml(value)}
    </p>
  `;
}


/*
 * ============================================================
 * Investor Jobs
 * ============================================================
 */

function renderInvestorJob(
  job,
  badge
) {
  if (!job) {
    return '';
  }

  return `
    <article class="profile-card">

      <span class="pill">
        ${escapeHtml(badge)}
      </span>

      <h2>
        ${escapeHtml(job.title)}
      </h2>

      <p>
        <strong>
          ${escapeHtml(job.investorQuestion)}
        </strong>
      </p>

      <p>
        ${escapeHtml(job.job)}
      </p>

      ${
        job.systemResponse
          ? `
            <div
              class="evidence"
              style="margin-top: 14px"
            >
              <strong>
                What your system needs to do
              </strong>

              <div>
                ${escapeHtml(job.systemResponse)}
              </div>
            </div>
          `
          : ''
      }

      ${
        job.resolvedProfile?.label
          ? `
            <div
              class="summary-item"
              style="margin-top: 14px"
            >
              <strong>
                Your diagnosed pattern
              </strong>

              <div>
                ${escapeHtml(
                  job.resolvedProfile.label
                )}
              </div>

              ${
                job.resolvedProfile.summary
                  ? `
                    <div
                      style="margin-top: 6px"
                    >
                      ${escapeHtml(
                        job.resolvedProfile.summary
                      )}
                    </div>
                  `
                  : ''
              }
            </div>
          `
          : ''
      }

    </article>
  `;
}


/*
 * ============================================================
 * Portfolio Philosophy
 * ============================================================
 */

function renderSources(
  sources = []
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
        Principles behind this system
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


/*
 * ============================================================
 * Complexity / Variant
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
 * Effort
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

  if (distribution.length === 0) {
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
                ${escapeHtml(item.label)}
              </strong>

              <div>
                ${escapeHtml(
                  String(item.percent)
                )}% of portfolio
              </div>

              ${
                item.meaning
                  ? `
                    <div
                      style="margin-top: 6px"
                    >
                      ${escapeHtml(item.meaning)}
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
                ${escapeHtml(sleeve.label)}
                ${
                  typeof sleeve.weightPercent ===
                  'number'
                    ? ` · ${sleeve.weightPercent}%`
                    : ''
                }
              </strong>

              <div
                style="margin-top: 4px"
              >
                ${
                  escapeHtml(
                    sleeve.guidance
                      ?.effort
                      ?.label ??
                    ''
                  )
                }

                ${
                  sleeve.guidance
                    ?.effort
                    ?.reviewCadenceLabel
                    ? ` · ${escapeHtml(
                        sleeve.guidance
                          .effort
                          .reviewCadenceLabel
                      )}`
                    : ''
                }
              </div>

              ${
                sleeve.guidance
                  ?.effort
                  ?.whyThisEffort
                  ? `
                    <div
                      style="margin-top: 6px"
                    >
                      ${escapeHtml(
                        sleeve.guidance
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
    behavior?.decisionProtocol ??
    [];

  if (steps.length === 0) {
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
                  String(step.step)
                )}. ${escapeHtml(
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
      .replaceAll('-', ' ')
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
 * Bounded Sleeve System
 * ============================================================
 */

function renderAssetCategories(
  sleeve
) {
  const categories =
    sleeve.assetCategories ??
    [];

  if (
    !Array.isArray(categories) ||
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
                category.id
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
    sleeve.monitoring
      ?.marketTrends ??
    [];

  if (
    !Array.isArray(trends) ||
    trends.length === 0
  ) {
    if (
      sleeve.guidance
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
              sleeve.guidance
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
                        trend.reviewQuestion
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
    sleeve.guidance ?? {};

  const effort =
    guidance.effort ?? {};

  const roleLabel =
    sleeve.role?.label ??
    'Portfolio role';

  return `
    <article class="system-card">

      <span class="pill">
        ${escapeHtml(roleLabel)}
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
        guidance.investorQuestion
          ? `
            <p>
              <strong>
                ${escapeHtml(
                  guidance.investorQuestion
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
        guidance.returnContribution
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
                  guidance.returnContribution
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
        guidance.whatBelongs
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
                  guidance.whatBelongs
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
            effort.reviewCadenceLabel
              ? ` · ${escapeHtml(
                  effort.reviewCadenceLabel
                )}`
              : ''
          }
        </div>

        ${
          effort.usefulAttention
            ? `
              <div
                style="margin-top: 6px"
              >
                ${escapeHtml(
                  effort.usefulAttention
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
        guidance.whatUsuallyDoesNotBelong
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
        guidance.redundancyCheck
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
        effort.redundantAttention
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
        guidance.actionBoundary
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

          <div
            style="text-align: center"
          >
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
            why this portfolio system fits you.
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
               HERO
               ================================================== -->

          <section
            class="card panel result-hero"
          >
            <span class="pill">
              YOUR PORTFOLIO SYSTEM
            </span>

            <h1 id="systemFitTitle"></h1>

            <p
              class="lead"
              id="systemFitSummary"
            ></p>
          </section>


          <!-- ==================================================
               1. INVESTOR JOBS
               ================================================== -->

          <section
            style="margin-top: 24px"
          >
            <span class="pill">
              YOUR INVESTING JOBS
            </span>

            <h2>
              What your system needs to help you do
            </h2>

            <p>
              Your profile translates into three different
              jobs: organize the portfolio, focus your effort,
              and support your decisions.
            </p>

            <div
              class="result-grid"
              id="investorJobCards"
            ></div>
          </section>


          <!-- ==================================================
               2. PHILOSOPHY
               ================================================== -->

          <section
            class="card panel"
            style="margin-top: 24px"
          >
            <span class="pill">
              WHY THIS PORTFOLIO PHILOSOPHY
            </span>

            <h2 id="philosophyName"></h2>

            <p
              class="lead"
              id="philosophySummary"
            ></p>

            <div
              class="summary-item"
              style="margin-top: 16px"
            >
              <strong>
                Why this matters
              </strong>

              <div id="philosophyWhy"></div>
            </div>

            <div id="philosophySources"></div>
          </section>


          <!-- ==================================================
               3. VARIANT / COMPLEXITY
               ================================================== -->

          <section
            class="card panel"
            style="margin-top: 24px"
          >
            <span class="pill">
              WHY THIS VERSION
            </span>

            <h2 id="complexityHeading"></h2>

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
               4. EFFORT MODEL
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
               5. BEHAVIOR / DECISION SUPPORT
               ================================================== -->

          <section
            class="card panel"
            style="margin-top: 24px"
          >
            <span class="pill">
              HOW YOUR SYSTEM HELPS YOU DECIDE
            </span>

            <h2 id="behaviorFraming"></h2>

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
               6. BOUNDED SLEEVES
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
               7. USER-LED PRINCIPLE
               ================================================== -->

          <section
            class="card panel"
            style="margin-top: 24px"
          >
            <span class="pill">
              USER LED
            </span>

            <h2 id="userLedTitle"></h2>

            <p
              class="lead"
              id="userLedExplanation"
            ></p>
          </section>


          <!-- ==================================================
               CTA
               ================================================== -->

          <div class="next-row">

            <button
              id="systemBtn"
              class="btn btn-primary"
              type="button"
            >
              Interact with your portfolio system
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
          'recommendation/profile-jobs'
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
   *
   * Assessment result
   *      ↓
   * Portfolio Job Fit
   *      ↓
   * Existing Fit Presenter
   *      ↓
   * Investor System Guidance Presenter
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
   * HERO
   * ==========================================================
   */

  root
    .querySelector(
      '#systemFitTitle'
    )
    .textContent =
      guidance
        .systemFit
        .title;


  root
    .querySelector(
      '#systemFitSummary'
    )
    .textContent =
      guidance
        .systemFit
        .summary;


  /*
   * ==========================================================
   * INVESTOR JOBS
   * ==========================================================
   */

  root
    .querySelector(
      '#investorJobCards'
    )
    .innerHTML =
      [
        renderInvestorJob(
          guidance
            .investorJobs
            .organize,
          'ORGANIZE'
        ),

        renderInvestorJob(
          guidance
            .investorJobs
            .focus,
          'FOCUS EFFORT'
        ),

        renderInvestorJob(
          guidance
            .investorJobs
            .decide,
          'DECIDE'
        )
      ].join('');


  /*
   * ==========================================================
   * PHILOSOPHY
   * ==========================================================
   */

  root
    .querySelector(
      '#philosophyName'
    )
    .textContent =
      guidance
        .philosophy
        .philosophyName ??
      'Your portfolio philosophy';


  root
    .querySelector(
      '#philosophySummary'
    )
    .textContent =
      guidance
        .philosophy
        .summary ??
      '';


  root
    .querySelector(
      '#philosophyWhy'
    )
    .textContent =
      guidance
        .philosophy
        .whyItMatters ??
      '';


  root
    .querySelector(
      '#philosophySources'
    )
    .innerHTML =
      renderSources(
        guidance
          .philosophy
          .sources
      );


  /*
   * ==========================================================
   * COMPLEXITY / VARIANT
   * ==========================================================
   */

  const complexity =
    guidance.complexity;


  root
    .querySelector(
      '#complexityHeading'
    )
    .textContent =
      'Why ' +
      complexity.sleeveCount +
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
    guidance.effort;


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
        guidance.sleeves
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
    guidance.behavior;


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
        behavior?.outcomes
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
      '#systemBtn'
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
