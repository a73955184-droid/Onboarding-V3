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
            min-width: 900px;
            border-collapse: collapse;
            table-layout: fixed;
          "
        >

          <thead>

            <tr>

              <th
                style="
                  width: 30%;
                  text-align: left;
                  vertical-align: top;
                  padding: 14px 14px 14px 0;
                  border-bottom: 1px solid rgba(0,0,0,0.12);
                "
              >
                Your quiz response
              </th>

              <th
                style="
                  width: 34%;
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
                  width: 36%;
                  text-align: left;
                  vertical-align: top;
                  padding: 14px 0 14px 14px;
                  border-bottom: 1px solid rgba(0,0,0,0.12);
                "
              >
                How your recommended system delivers it
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

                      ${escapeHtml(
                        item.systemJTBD ??
                        item.systemResponse
                      )}

                    </td>


                    <td
                      style="
                        vertical-align: top;
                        padding: 18px 0 18px 14px;
                        border-bottom: 1px solid rgba(0,0,0,0.08);
                      "
                    >

                      ${escapeHtml(
                        item
                          .recommendedSystemDelivery
                          ?.systemDelivery ??
                          '—'
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


/*
 * ============================================================
 * Portfolio System Visualization (Donut)
 * ============================================================
 */

/**
 * Calculate proportional angles for each sleeve arc.
 * Returns array of { sleeve, startAngle, endAngle, angleSpan }
 */
function calculateSleeveAngles(
  sleeves = []
) {
  if (
    !Array.isArray(sleeves) ||
    sleeves.length === 0
  ) {
    return [];
  }

  // Sum the percentages
  const total = sleeves.reduce(
    (sum, sleeve) =>
      sum +
      (typeof sleeve
        .weightPercent ===
      'number'
        ? sleeve
            .weightPercent
        : 0),
    0
  );

  if (total === 0) {
    return [];
  }

  // Calculate angles
  let currentAngle = -90; // Start at top

  return sleeves.map(
    (sleeve) => {
      const percentage =
        (typeof sleeve
          .weightPercent ===
        'number'
          ? sleeve
              .weightPercent
          : 0) / total;

      const angleSpan =
        percentage * 360;

      const startAngle =
        currentAngle;

      const endAngle =
        currentAngle +
        angleSpan;

      currentAngle = endAngle;

      return {
        sleeve,
        startAngle,
        endAngle,
        angleSpan
      };
    }
  );
}


/**
 * Convert angle to radians and calculate SVG arc endpoint.
 */
function polarToCartesian(
  centerX,
  centerY,
  radius,
  angleInDegrees
) {
  const angleInRadians =
    ((angleInDegrees - 90) *
      Math.PI) /
    180.0;

  return {
    x:
      centerX +
      radius *
        Math.cos(
          angleInRadians
        ),
    y:
      centerY +
      radius *
        Math.sin(
          angleInRadians
        )
  };
}


/**
 * Generate SVG arc path for a sleeve segment.
 */
function createArcPath(
  centerX,
  centerY,
  outerRadius,
  innerRadius,
  startAngle,
  endAngle
) {
  const angleSpan = endAngle - startAngle;
  const largeArc =
    angleSpan > 180 ? 1 : 0;

  const radius =
    (outerRadius + innerRadius) /
    2;

  const start =
    polarToCartesian(
      centerX,
      centerY,
      radius,
      startAngle
    );

  const end =
    polarToCartesian(
      centerX,
      centerY,
      radius,
      endAngle
    );

  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  ].join(' ');
}


/**
 * Render the proportional donut visualization with interactive segments.
 */
function renderPortfolioDonutVisualization(
  sleeves = [],
  selectedSleeveId = null
) {
  if (
    !Array.isArray(sleeves) ||
    sleeves.length === 0
  ) {
    return '';
  }

  const sleeveAngles =
    calculateSleeveAngles(sleeves);

  if (sleeveAngles.length === 0) {
    return '';
  }

  // SVG dimensions
  const svgSize = 360;
  const center = svgSize / 2;
  const outerRadius = 126;
  const innerRadius = 98;

  // AaronBux tonal family: quiet structure with selection-led emphasis.
  const colors = [
    '#bcc8cf',
    '#9eabb2',
    '#d4c5ab',
    '#87949b',
    '#b4a991',
    '#6f7d84'
  ];

  // Determine the default selected sleeve (largest by weight)
  let activeSleeveId = selectedSleeveId;
  if (!activeSleeveId) {
    const largest = sleeves.reduce(
      (max, sleeve) =>
        (sleeve.weightPercent ??
          0) >
        (max.weightPercent ?? 0)
          ? sleeve
          : max,
      sleeves[0] ?? {}
    );
    activeSleeveId = largest.id;
  }

  const arcs = sleeveAngles
    .map(
      (angleData, index) => {
        const {
          sleeve,
          startAngle,
          endAngle
        } = angleData;

        const isSelected =
          sleeve.id ===
          activeSleeveId;

        const color =
          colors[index % colors.length];

        const path = createArcPath(
          center,
          center,
          outerRadius,
          innerRadius,
          startAngle,
          endAngle
        );

        return `
          <path
            data-sleeve-id="${escapeHtml(
              sleeve.id
            )}"
            class="portfolio-donut-segment ${
              isSelected
                ? 'is-active'
                : 'is-inactive'
            }"
            d="${path}"
            fill="none"
            stroke="${
              isSelected
                ? '#ffbf00'
                : color
            }"
            data-base-stroke="${color}"
            role="button"
            tabindex="0"
            aria-label="${escapeHtml(
              `${sleeve.label}, ${sleeve.weightPercent} percent of portfolio`
            )}"
            aria-pressed="${
              isSelected ? 'true' : 'false'
            }"
          />
        `;
      }
    )
    .join('');

  return `
    <svg
      id="portfolioDonutSvg"
      width="${svgSize}"
      height="${svgSize}"
      viewBox="0 0 ${svgSize} ${svgSize}"
      style="
        display: block;
        margin: 0 auto;
        max-width: 100%;
        height: auto;
      "
    >
      <g id="sleeveArcs">
        ${arcs}
      </g>

      <g id="donutCenter">
        <circle
          cx="${center}"
          cy="${center}"
          r="82"
          fill="#080f14"
          stroke="#2f353c"
          stroke-width="1"
        />
        <text
          id="donutCenterLabel"
          x="${center}"
          y="${center - 26}"
          text-anchor="middle"
          font-size="12"
          font-weight="700"
          letter-spacing="1.4"
          fill="#dbe7ee"
        />
        <text
          id="donutCenterPercent"
          x="${center}"
          y="${center + 12}"
          text-anchor="middle"
          font-size="34"
          font-weight="700"
          fill="#ffe2ab"
        />
        <text
          id="donutCenterRole"
          x="${center}"
          y="${center + 39}"
          text-anchor="middle"
          font-size="11"
          fill="#bfc8cc"
        />
      </g>
    </svg>

    <div
      class="portfolio-sleeve-instruction"
    >
      Tap sleeve to explore
    </div>

    <div
      class="portfolio-sleeve-selectors"
      aria-label="Portfolio sleeves"
    >
      ${sleeves
        .map(
          (sleeve) => `
            <button
              class="portfolio-sleeve-selector"
              type="button"
              data-sleeve-id="${escapeHtml(
                sleeve.id
              )}"
              aria-pressed="${
                sleeve.id === activeSleeveId
                  ? 'true'
                  : 'false'
              }"
            >
              <span>${escapeHtml(
                sleeve.label
              )}</span>
              <strong>${escapeHtml(
                sleeve.weightPercent
              )}%</strong>
            </button>
          `
        )
        .join('')}
    </div>
  `;
}


/**
 * Render one cohesive detail panel for the selected sleeve.
 */
function renderSleeveDetailPanel(
  sleeve
) {
  if (!sleeve) {
    return '';
  }

  const guidance =
    sleeve.guidance ?? {};

  return `
    <article
      class="portfolio-sleeve-details"
    >
      <div
        class="portfolio-sleeve-details-header"
      >
        <strong>
          ${escapeHtml(
            sleeve.label
          )}
        </strong>

        <span>
          ${escapeHtml(
            sleeve.weightPercent
          )}%
        </span>
      </div>

      <div
        class="portfolio-sleeve-details-body"
      >
        ${
          guidance.job
            ? `
              <div class="portfolio-sleeve-detail-group">
                <strong>Its job</strong>
                <div>${escapeHtml(
                  guidance.job
                )}</div>
              </div>
            `
            : ''
        }

        ${
          guidance.returnContribution
            ? `
              <div class="portfolio-sleeve-detail-group">
                <strong>Return contribution</strong>
                <div>${escapeHtml(
                  guidance.returnContribution
                )}</div>
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
              <div class="portfolio-sleeve-detail-group">
                <strong>Sleeve mandate</strong>
                <div>${escapeHtml(
                  guidance.whatBelongs
                )}</div>
              </div>
            `
            : ''
        }
      </div>
    </article>
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


            <!--
              The archetype-level problem comes from:

              archetype-philosophies.js
                    ↓
              portfolio-job-fit-presenter.js
                    ↓
              investor-system-guidance-presenter.js
                    ↓
              recommendationReveal.investorProblem

              This screen does not infer or rewrite the meaning.
            -->

            <div
              class="summary-item"
              style="margin-top: 22px"
            >

              <strong>
                WHAT THIS PORTFOLIO SYSTEM IS DESIGNED TO SOLVE
              </strong>


              <div
                id="heroInvestorProblemQuestion"
                style="
                  font-weight: 700;
                  margin-top: 10px;
                "
              ></div>


              <div
                id="heroInvestorProblemMeaning"
                style="margin-top: 10px"
              ></div>

            </div>


            <!--
              Preserve philosophy identity and source as provenance.
              The generic philosophy summary is intentionally not
              repeated in the hero.
            -->

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

            </div>


            <div
              id="heroPhilosophySources"
            ></div>


            <div
              id="profileAccountability"
            ></div>

          </section>


          <!-- ==================================================
               PORTFOLIO SYSTEM VISUALIZATION
               ================================================== -->

          <section
            style="margin-top: 24px"
            id="portfolioVisualizationSection"
          >

            <style>
              #portfolioVisualizationSection {
                box-sizing: border-box;
                overflow: hidden;
                padding: clamp(24px, 5vw, 48px);
                border: 1px solid #2f353c;
                border-radius: 20px;
                background: #0e141a;
                color: #dde3eb;
              }

              #portfolioVisualizationSection
              .portfolio-donut-segment {
                cursor: pointer;
                outline: none;
                stroke-linecap: butt;
                transform-box: fill-box;
                transform-origin: center;
                transition:
                  opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                  stroke-width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                  transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                  filter 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                  stroke 0.3s ease;
              }

              #portfolioVisualizationSection
              .portfolio-donut-segment.is-active {
                opacity: 1;
                stroke-width: 32;
                filter: drop-shadow(
                  0 0 12px rgba(188, 200, 207, 0.4)
                );
                transform: scale(1.04);
              }

              #portfolioVisualizationSection
              .portfolio-donut-segment.is-inactive {
                opacity: 0.4;
                stroke-width: 16;
                filter: none;
                transform: scale(1);
              }

              #portfolioVisualizationSection
              .portfolio-donut-segment:focus-visible {
                outline: none;
                opacity: 1;
                filter: drop-shadow(
                  0 0 8px rgba(255, 226, 171, 0.8)
                );
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-instruction {
                margin-top: -12px;
                color: #9eabb2;
                font-size: 0.78rem;
                letter-spacing: 0.08em;
                text-align: center;
                text-transform: uppercase;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-selectors {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 8px;
                margin-top: 20px;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-selector {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 11px;
                border: 1px solid #424a4e;
                border-radius: 999px;
                background: #161c22;
                color: #bfc8cc;
                font: inherit;
                font-size: 0.78rem;
                cursor: pointer;
                transition:
                  border-color 0.2s ease,
                  background 0.2s ease,
                  color 0.2s ease;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-selector strong {
                color: inherit;
                font-variant-numeric: tabular-nums;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-selector[aria-pressed="true"] {
                border-color: #9c8f78;
                background: #2f353c;
                color: #ffe2ab;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-selector:focus-visible {
                outline: 2px solid #ffbf00;
                outline-offset: 2px;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-details {
                overflow: hidden;
                border: 1px solid #424a4e;
                border-radius: 16px;
                background: #161c22;
                box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18);
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-details-header {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                gap: 20px;
                padding: 20px 24px;
                background: #1a2026;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-details-header strong {
                color: #dde3eb;
                font-size: 1.2rem;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-details-header span {
                color: #ffe2ab;
                font-size: 1.25rem;
                font-weight: 700;
                font-variant-numeric: tabular-nums;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-details-body {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 28px 40px;
                padding: 24px;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-detail-group,
              #portfolioVisualizationSection
              .portfolio-sleeve-details-body > .summary-item {
                margin-top: 0 !important;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-detail-group strong,
              #portfolioVisualizationSection
              .portfolio-sleeve-details-body > .summary-item strong {
                display: block;
                margin-bottom: 8px;
                color: #d4c5ab;
                font-size: 0.7rem;
                letter-spacing: 0.09em;
                text-transform: uppercase;
              }

              #portfolioVisualizationSection
              .portfolio-sleeve-detail-group div,
              #portfolioVisualizationSection
              .portfolio-sleeve-details-body > .summary-item > div {
                margin-top: 0 !important;
                color: #bfc8cc;
                font-size: 0.92rem;
                line-height: 1.55;
              }

              @media (max-width: 640px) {
                #portfolioVisualizationSection {
                  padding: 24px 16px;
                  border-radius: 16px;
                }

                #portfolioVisualizationSection
                .portfolio-sleeve-details-header {
                  padding: 18px;
                }

                #portfolioVisualizationSection
                .portfolio-sleeve-details-body {
                  grid-template-columns: 1fr;
                  gap: 22px;
                  padding: 20px 18px;
                }
              }
            </style>

            <span class="pill">
              YOUR PORTFOLIO SYSTEM
            </span>

            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 24px;
                margin-top: 24px;
              "
            >

              <div
                id="portfolioDonutContainer"
                style="
                  width: 100%;
                  max-width: 500px;
                  margin: 0 auto;
                "
              ></div>

              <div
                id="portfolioDetailsContainer"
                style="
                  width: 100%;
                  max-width: 800px;
                "
              ></div>

            </div>

          </section>


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


  /*
   * Archetype-specific investor problem.
   *
   * Prefer the hero-level field exposed specifically by the
   * investor-system-guidance presenter. Preserve the nested
   * philosophy location as a compatibility fallback.
   */
  const investorProblem =
    reveal
      ?.investorProblem ??
    reveal
      ?.philosophy
      ?.investorProblem ??
    null;


  root
    .querySelector(
      '#heroInvestorProblemQuestion'
    )
    .textContent =
      investorProblem
        ?.question ??
      '';


  root
    .querySelector(
      '#heroInvestorProblemMeaning'
    )
    .textContent =
      investorProblem
        ?.meaning ??
      '';


  /*
   * Underlying philosophy provenance.
   *
   * We retain the philosophy name and source but deliberately
   * do not repeat the generic philosophy summary in the hero.
   */
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
   * PORTFOLIO SYSTEM VISUALIZATION
   * ==========================================================
   */

  // Track selected sleeve in visualization
  let selectedSleeveId =
    guidance.sleeves.length > 0
      ? (
          guidance
            .sleeves
            .reduce(
              (max, sleeve) =>
                (sleeve
                  .weightPercent ??
                  0) >
                (max
                  .weightPercent ??
                  0)
                  ? sleeve
                  : max
            )
        )?.id
      : null;

  // Render the donut
  const donutContainer =
    root.querySelector(
      '#portfolioDonutContainer'
    );

  const donutHtml =
    renderPortfolioDonutVisualization(
      guidance.sleeves,
      selectedSleeveId
    );

  donutContainer.innerHTML =
    donutHtml;

  // Function to update the center text
  function updateDonutCenter(
    sleeveId
  ) {
    const sleeve =
      guidance
        .sleeves
        .find(
          (s) =>
            s.id === sleeveId
        );

    if (!sleeve) {
      return;
    }

    const label = root.querySelector(
      '#donutCenterLabel'
    );

    const percent = root.querySelector(
      '#donutCenterPercent'
    );

    const role = root.querySelector(
      '#donutCenterRole'
    );

    if (label) {
      label.textContent =
        sleeve.label ?? '';
    }

    if (percent) {
      percent.textContent =
        typeof sleeve
          .weightPercent ===
        'number'
          ? `${
              sleeve
                .weightPercent
            }%`
          : '';
    }

    if (role) {
      role.textContent =
        sleeve
          .role
          ?.label ?? '';
    }
  }

  // Function to update the selected sleeve details
  function updateSleeveDetails(
    sleeveId
  ) {
    const sleeve =
      guidance
        .sleeves
        .find(
          (item) =>
            item.id === sleeveId
        );

    const detailsContainer =
      root.querySelector(
        '#portfolioDetailsContainer'
      );

    if (!detailsContainer) {
      return;
    }

    detailsContainer.innerHTML =
      sleeve
        ? renderSleeveDetailPanel(
            sleeve
          )
        : '';
  }

  // Function to update arc styling
  function updateArcStyling(
    activeSleeveId
  ) {
    const arcs =
      donutContainer.querySelectorAll(
        '.portfolio-donut-segment'
      );

    arcs.forEach(
      (arc) => {
        const sleeveId =
          arc.getAttribute(
            'data-sleeve-id'
          );

        const isActive =
          sleeveId ===
          activeSleeveId;

        arc.classList.toggle(
          'is-active',
          isActive
        );

        arc.classList.toggle(
          'is-inactive',
          !isActive
        );

        arc.setAttribute(
          'aria-pressed',
          String(isActive)
        );

        arc.setAttribute(
          'stroke',
          isActive
            ? '#ffbf00'
            : arc.getAttribute(
                'data-base-stroke'
              )
        );
      }
    );

    const selectors =
      donutContainer.querySelectorAll(
        '.portfolio-sleeve-selector'
      );

    selectors.forEach(
      (selector) => {
        selector.setAttribute(
          'aria-pressed',
          String(
            selector.getAttribute(
              'data-sleeve-id'
            ) === activeSleeveId
          )
        );
      }
    );
  }

  function showSleeve(
    sleeveId
  ) {
    updateDonutCenter(
      sleeveId
    );

    updateSleeveDetails(
      sleeveId
    );

    updateArcStyling(
      sleeveId
    );
  }

  function selectSleeve(
    sleeveId
  ) {
    if (!sleeveId) {
      return;
    }

    selectedSleeveId =
      sleeveId;

    showSleeve(
      sleeveId
    );
  }

  // Initialize display
  showSleeve(
    selectedSleeveId
  );

  // Add click handlers to arc segments
  const segments =
    donutContainer.querySelectorAll(
      '.portfolio-donut-segment'
    );

  segments.forEach(
    (segment) => {
      segment.addEventListener(
        'click',
        () => {
          const sleeveId =
            segment.getAttribute(
              'data-sleeve-id'
            );

          if (sleeveId) {
            selectSleeve(
              sleeveId
            );
          }
        }
      );

      segment.addEventListener(
        'keydown',
        (event) => {
          if (
            event.key ===
              'Enter' ||
            event.key === ' '
          ) {
            event
              .preventDefault();

            const sleeveId =
              segment.getAttribute(
                'data-sleeve-id'
              );

            if (sleeveId) {
              selectSleeve(
                sleeveId
              );
            }
          }
        }
      );

      // Add hover preview
      segment.addEventListener(
        'mouseenter',
        () => {
          const sleeveId =
            segment.getAttribute(
              'data-sleeve-id'
            );

          if (sleeveId) {
            showSleeve(
              sleeveId
            );
          }
        }
      );

      segment.addEventListener(
        'mouseleave',
        () => {
          showSleeve(
            selectedSleeveId
          );
        }
      );
    }
  );

  const sleeveSelectors =
    donutContainer.querySelectorAll(
      '.portfolio-sleeve-selector'
    );

  sleeveSelectors.forEach(
    (selector) => {
      selector.addEventListener(
        'click',
        () => {
          selectSleeve(
            selector.getAttribute(
              'data-sleeve-id'
            )
          );
        }
      );

      selector.addEventListener(
        'mouseenter',
        () => {
          const sleeveId =
            selector.getAttribute(
              'data-sleeve-id'
            );

          if (sleeveId) {
            showSleeve(
              sleeveId
            );
          }
        }
      );

      selector.addEventListener(
        'mouseleave',
        () => {
          showSleeve(
            selectedSleeveId
          );
        }
      );
    }
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


  const variantLabel =
    String(
      complexity
        ?.variantId ??
      ''
    )
      .replace(
        /_/g,
        ' '
      )
      .replace(
        /\b\w/g,
        (character) =>
          character.toUpperCase()
      );

  root
    .querySelector(
      '#complexityHeading'
    )
    .textContent =
      variantLabel
        ? 'Why ' +
          variantLabel +
          '?'
        : 'Why this version?';


  root
    .querySelector(
      '#complexitySummary'
    )
    .textContent =
      complexity
        ?.variantRationale ??
      complexity
        ?.userFacingSummary ??
      complexity
        ?.generalMeaning ??
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
