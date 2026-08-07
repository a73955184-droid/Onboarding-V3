import {
  getState,
  getAssessmentResult,
  resetState
} from '../../application/state.js';

import {
  navigate
} from '../../application/router.js';

import {
  QUESTIONS
} from '../../content/questions.js';


/**
 * Existing archetype recommendation copy.
 *
 * This remains the fallback when portfolio composition is unavailable
 * and continues to provide the archetype-specific operating rules.
 */
const SYSTEMS = {
  ES: {
    name:
      'A simple guided starting system',

    summary:
      'A small number of understandable choices, clear next steps, and very few reasons to intervene.',

    components: [
      [
        'Starting foundation',
        'One diversified way to begin or continue consistently.'
      ],
      [
        'Ready money',
        'Money needed soon remains accessible and separate.'
      ],
      [
        'Later decisions',
        'Additional choices wait until their purpose is understood.'
      ]
    ],

    effort: [
      [
        'Routine decisions',
        'Low effort / primary source of progress'
      ],
      [
        'New choices',
        'Occasional effort / only when a real need appears'
      ],
      [
        'Complex strategies',
        'Defer / low value until the foundation is clear'
      ]
    ],

    monitor: [
      'Progress toward the goal',
      'Whether contributions remain consistent',
      'Whether the timeline or financial situation changed'
    ],

    cadence: [
      'Brief check-ins a few times a year',
      'Review after a meaningful life change',
      'Ignore routine market noise between reviews'
    ],

    rules: [
      'Reconsider when the goal, timeline, or ability to contribute changes',
      'Do not add complexity just to feel more advanced',
      'Prefer a clear reasonable step over an endlessly delayed perfect choice'
    ]
  },

  GD: {
    name:
      'A broad, low-maintenance system',

    summary:
      'Broad diversification does most of the work, while monitoring stays focused on goals and major drift.',

    components: [
      [
        'Long-term growth',
        'Broad exposure intended to compound over time.'
      ],
      [
        'Stability',
        'Assets aligned with nearer needs and comfort.'
      ],
      [
        'Optional additions',
        'Only choices that solve a specific gap.'
      ]
    ],

    effort: [
      [
        'Broad foundation',
        'Low effort / carries most expected progress'
      ],
      [
        'Allocation review',
        'Low to moderate effort / protects alignment'
      ],
      [
        'Product comparison',
        'Low return on extra effort once cost and coverage are similar'
      ]
    ],

    monitor: [
      'Savings and contribution progress',
      'Broad mix and concentration',
      'Meaningful drift from the intended balance'
    ],

    cadence: [
      'Automate routine contributions',
      'Check the overall mix a few times a year',
      'Rebalance on a schedule or meaningful threshold'
    ],

    rules: [
      'Add complexity only when it solves a real need',
      'Do not change because another option recently performed better',
      'Leave the system alone while its original purpose still holds'
    ]
  },

  BFO: {
    name:
      'A balanced multi-purpose system',

    summary:
      'Different needs are separated so growth, stability, and selected opportunities do not compete for the same money.',

    components: [
      [
        'Growth foundation',
        'The main source of long-term compounding.'
      ],
      [
        'Stability and access',
        'Money requiring greater dependability or nearer access.'
      ],
      [
        'Selected ideas',
        'A limited area for choices requiring more thought.'
      ]
    ],

    effort: [
      [
        'Growth foundation',
        'Low effort / primary long-term return role'
      ],
      [
        'Stability layer',
        'Periodic effort / reliability role'
      ],
      [
        'Selected ideas',
        'Higher effort / supplemental return or learning role'
      ]
    ],

    monitor: [
      'Changes in goals or timelines',
      'Whether each part still serves its intended job',
      'Whether selected ideas remain inside their limit'
    ],

    cadence: [
      'Light review a few times a year',
      'Full review annually or after a major life change',
      'Selected ideas reviewed separately when their assumptions change'
    ],

    rules: [
      'Every addition needs a stated job',
      'Do not let selected ideas redefine the whole system',
      'Reconsider when the purpose, timeline, or original reason changes'
    ]
  },

  FT: {
    name:
      'A systematic improvement system',

    summary:
      'A durable base remains simple while selected improvements must justify their cost, complexity, and effort.',

    components: [
      [
        'Durable base',
        'Broad holdings that do not need constant evaluation.'
      ],
      [
        'Targeted improvements',
        'Choices intended to solve a specific limitation.'
      ],
      [
        'Comparison standard',
        'The same criteria used to add, retain, or remove an improvement.'
      ]
    ],

    effort: [
      [
        'Durable base',
        'Low effort / carries most expected progress'
      ],
      [
        'Targeted improvements',
        'Moderate effort / must earn incremental value'
      ],
      [
        'Small product differences',
        'Low expected return on additional research'
      ]
    ],

    monitor: [
      'Cost, concentration, and overlap',
      'Whether the improvement still solves its stated problem',
      'Whether evidence still supports keeping it'
    ],

    cadence: [
      'Collect observations without acting immediately',
      'Review meaningful choices on a schedule',
      'Change only when predefined evidence supports it'
    ],

    rules: [
      'Every improvement must name the problem it solves',
      'Stop researching when the important tradeoffs are understood',
      'Do not replace a sound approach due to recent performance alone'
    ]
  },

  GA: {
    name:
      'A foundation plus exploration system',

    summary:
      'Most progress comes from a stable foundation; a smaller area supports learning and higher-growth ideas within explicit limits.',

    components: [
      [
        'Stable foundation',
        'Most of the money and the main long-term return engine.'
      ],
      [
        'Exploration area',
        'A capped amount for ideas requiring more research.'
      ],
      [
        'Decision record',
        'Why an idea was added, what matters, and when to review it.'
      ]
    ],

    effort: [
      [
        'Stable foundation',
        'Low effort / primary expected return role'
      ],
      [
        'Exploration area',
        'Higher effort / uncertain supplemental return'
      ],
      [
        'Idea discovery',
        'High time cost / value only after passing a clear filter'
      ]
    ],

    monitor: [
      'The reason and size of each exploratory choice',
      'Whether the exploration limit is still respected',
      'Whether a new idea duplicates an existing role'
    ],

    cadence: [
      'Foundation reviewed occasionally',
      'Exploratory choices reviewed monthly or when evidence changes',
      'Whole system checked quarterly'
    ],

    rules: [
      'Set the limit before choosing the idea',
      'Write the reason and review point before acting',
      'Do not add something merely because it is exciting or popular'
    ]
  },

  TO: {
    name:
      'A long-term base with a limited active area',

    summary:
      'Long-term progress remains protected while a small set of active decisions follows explicit triggers and exits.',

    components: [
      [
        'Long-term base',
        'Capital not governed by short-term views.'
      ],
      [
        'Active decision area',
        'A capped amount for selected market-aware choices.'
      ],
      [
        'Trigger and exit record',
        'Evidence, size, downside, and exit written first.'
      ]
    ],

    effort: [
      [
        'Long-term base',
        'Low effort / main long-term return role'
      ],
      [
        'Active choices',
        'High effort / uncertain incremental return'
      ],
      [
        'Market monitoring',
        'High time cost / useful only for selected written theses'
      ]
    ],

    monitor: [
      'The thesis and downside for active choices',
      'Whether expected evidence is developing',
      'Whether the active area remains inside its limit'
    ],

    cadence: [
      'Long-term base reviewed periodically',
      'Active choices reviewed when predefined evidence changes',
      'Whole system checked for activity creep'
    ],

    rules: [
      'No active choice without a thesis and downside limit',
      'Do not act because the market feels urgent',
      'Exit or revise when the original evidence no longer holds'
    ]
  },

  IP: {
    name:
      'A dependable-needs and growth system',

    summary:
      'Money needed for access or income is separated from money that can remain invested for long-term growth.',

    components: [
      [
        'Near-term access',
        'Money that should remain dependable and available.'
      ],
      [
        'Income or stability',
        'Assets supporting planned use or lower uncertainty.'
      ],
      [
        'Long-term growth',
        'Money with enough time to tolerate more movement.'
      ]
    ],

    effort: [
      [
        'Near-term planning',
        'Moderate effort / protects planned use'
      ],
      [
        'Income and stability',
        'Periodic effort / reliability role'
      ],
      [
        'Long-term growth',
        'Low ongoing effort / compounding role'
      ]
    ],

    monitor: [
      'Upcoming withdrawals and cash flow',
      'Income durability and purchasing power',
      'Whether timelines or spending needs changed'
    ],

    cadence: [
      'Review around planned spending needs',
      'Periodic review for long-term growth',
      'Full annual check of access, income, inflation, and goals'
    ],

    rules: [
      'Do not use long-term risk for money needed soon',
      'Evaluate income durability, not yield alone',
      'Adjust when needs or timelines change, not merely when prices move'
    ]
  }
};


const QUESTION_LABELS = {
  setup:
    'How you invest today',

  transition:
    'What sends you searching',

  decisionStyle:
    'How you compare choices',

  marketPsychology:
    'What captures your attention',

  evolution:
    'What feels incomplete',

  tradeoff:
    'How involved you want to be',

  age:
    'Your time context',

  goals:
    'What you need investing to accomplish'
};


const QUESTION_BY_KEY =
  Object.fromEntries(
    QUESTIONS.map(
      (question) => [
        question.screenKey,
        question
      ]
    )
  );


function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function formatIdentifier(value = '') {
  return String(value)
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}


function formatPercentage(weight) {
  const numericWeight =
    Number(weight);

  if (
    !Number.isFinite(
      numericWeight
    )
  ) {
    return '0%';
  }

  return `${Math.round(
    numericWeight * 100
  )}%`;
}


function formatVariant(variantId) {
  switch (variantId) {
    case 'essential':
      return 'Clear and easy to maintain';

    case 'intentional':
      return 'Structured and deliberate';

    case 'engaged':
      return 'Stable with room to engage';

    default:
      return '';
  }
}


function getAnswerIds(
  state,
  key
) {
  const answer =
    state.answers?.[key];

  if (Array.isArray(answer)) {
    return answer
      .map((item) => {
        if (
          typeof item ===
          'string'
        ) {
          return item;
        }

        if (
          item &&
          typeof item ===
          'object'
        ) {
          return (
            item.id ??
            item.optionId ??
            null
          );
        }

        return null;
      })
      .filter(Boolean);
  }

  if (
    typeof answer ===
    'string'
  ) {
    return [answer];
  }

  if (
    answer &&
    typeof answer ===
    'object'
  ) {
    if (
      Array.isArray(
        answer.selectedOptionIds
      )
    ) {
      return answer
        .selectedOptionIds
        .filter(
          (value) =>
            typeof value ===
            'string'
        );
    }

    if (
      typeof answer.optionId ===
      'string'
    ) {
      return [
        answer.optionId
      ];
    }
  }

  return [];
}


function getAnswerLabels(
  state,
  key
) {
  const selectedIds =
    getAnswerIds(
      state,
      key
    );

  const question =
    QUESTION_BY_KEY[key];

  if (!question) {
    return [];
  }

  const labelById =
    Object.fromEntries(
      question.options.map(
        (option) => [
          option.id,
          option.label
        ]
      )
    );

  return selectedIds
    .map(
      (optionId) =>
        labelById[optionId]
    )
    .filter(Boolean);
}


function evidence(
  state,
  keys
) {
  return keys
    .map((key) => ({
      key,

      labels:
        getAnswerLabels(
          state,
          key
        )
    }))
    .filter(
      ({ labels }) =>
        labels.length > 0
    )
    .map(
      ({ key, labels }) => `
        <strong>
          ${escapeHtml(
            QUESTION_LABELS[key]
          )}:
        </strong>

        ${labels
          .map(escapeHtml)
          .join(' · ')}
      `
    )
    .join('<br>');
}


function renderStaticComponents(
  system
) {
  return system.components
    .map(
      (component) => `
        <div class="component">
          <strong>
            ${escapeHtml(
              component[0]
            )}
          </strong>

          <span>
            ${escapeHtml(
              component[1]
            )}
          </span>
        </div>
      `
    )
    .join('');
}


function renderPortfolioSleeves(
  portfolioSystem
) {
  return portfolioSystem.sleeves
    .map((sleeve) => {
      const assetCategories =
        Array.isArray(
          sleeve.assetCategories
        )
          ? sleeve.assetCategories
          : [];

      const assetLabels =
        assetCategories
          .map((category) => {
            if (
              typeof category ===
              'string'
            ) {
              return formatIdentifier(
                category
              );
            }

            return (
              category.label ??
              category.displayName ??
              formatIdentifier(
                category.id
              )
            );
          })
          .filter(Boolean);

      return `
        <article
          class="component sleeve-component"
          data-sleeve-id="${escapeHtml(
            sleeve.id
          )}"
        >
          <div
            class="sleeve-component-header"
          >
            <strong>
              ${escapeHtml(
                sleeve.label
              )}
            </strong>

            <span class="pill">
              ${formatPercentage(
                sleeve.weight
              )}
            </span>
          </div>

          <span>
            ${escapeHtml(
              sleeve.description ||
              formatIdentifier(
                sleeve.returnFunction
              )
            )}
          </span>

          <div class="sleeve-meta">
            <span>
              ${escapeHtml(
                formatIdentifier(
                  sleeve.returnFunction
                )
              )}
            </span>

            <span>
              ${escapeHtml(
                formatIdentifier(
                  sleeve.effort
                )
              )} effort
            </span>
          </div>

          ${
            assetLabels.length > 0
              ? `
                <div class="sleeve-assets">
                  <strong>
                    Default asset categories
                  </strong>

                  <span>
                    ${assetLabels
                      .map(escapeHtml)
                      .join(' · ')}
                  </span>
                </div>
              `
              : ''
          }

          ${
            sleeve.startsUnallocated
              ? `
                <div class="sleeve-status">
                  Begins unallocated
                </div>
              `
              : ''
          }
        </article>
      `;
    })
    .join('');
}


function renderStaticEffort(
  system
) {
  return system.effort
    .map(
      (item) => `
        <div class="metric">
          <span>
            ${escapeHtml(
              item[0]
            )}
          </span>

          <strong>
            ${escapeHtml(
              item[1]
            )}
          </strong>
        </div>
      `
    )
    .join('');
}


function renderPortfolioEffort(
  portfolioSystem
) {
  return portfolioSystem.sleeves
    .map(
      (sleeve) => `
        <div class="metric">
          <span>
            ${escapeHtml(
              sleeve.label
            )}
          </span>

          <strong>
            ${escapeHtml(
              formatIdentifier(
                sleeve.effort
              )
            )} effort ·
            ${formatPercentage(
              sleeve.weight
            )} of portfolio
          </strong>
        </div>
      `
    )
    .join('');
}


function getPortfolioMarketTrends(
  portfolioSystem
) {
  const trends = [];

  portfolioSystem.sleeves
    .forEach((sleeve) => {
      const sleeveTrends =
        Array.isArray(
          sleeve.marketTrends
        )
          ? sleeve.marketTrends
          : [];

      sleeveTrends.forEach(
        (trend) => {
          const trendId =
            typeof trend ===
            'string'
              ? trend
              : trend.id;

          const existing =
            trends.find(
              (item) =>
                item.id === trendId
            );

          if (existing) {
            if (
              !existing.sleeves.includes(
                sleeve.label
              )
            ) {
              existing.sleeves.push(
                sleeve.label
              );
            }

            return;
          }

          trends.push({
            id:
              trendId,

            label:
              typeof trend ===
              'string'
                ? formatIdentifier(
                    trend
                  )
                : (
                    trend.label ??
                    formatIdentifier(
                      trend.id
                    )
                  ),

            relevance:
              typeof trend ===
              'object'
                ? (
                    trend.defaultRelevance ??
                    'informational'
                  )
                : 'informational',

            reviewQuestion:
              typeof trend ===
              'object'
                ? (
                    trend.reviewQuestion ??
                    null
                  )
                : null,

            sleeves: [
              sleeve.label
            ]
          });
        }
      );
    });

  return trends;
}


function renderPortfolioMonitoring(
  portfolioSystem
) {
  const trends =
    getPortfolioMarketTrends(
      portfolioSystem
    );

  if (
    trends.length === 0
  ) {
    return `
      <div class="summary-item">
        Monitor whether each sleeve still performs its intended portfolio role.
      </div>
    `;
  }

  return trends
    .slice(0, 6)
    .map(
      (trend) => `
        <div class="summary-item">
          <strong>
            ${escapeHtml(
              trend.label
            )}
          </strong>

          <span>
            Applies to
            ${escapeHtml(
              trend.sleeves.join(
                ', '
              )
            )}
          </span>

          ${
            trend.reviewQuestion
              ? `
                <small>
                  ${escapeHtml(
                    trend.reviewQuestion
                  )}
                </small>
              `
              : ''
          }
        </div>
      `
    )
    .join('');
}


function renderPortfolioCadence(
  portfolioSystem
) {
  const cadenceMap =
    new Map();

  portfolioSystem.sleeves
    .forEach((sleeve) => {
      const cadence =
        sleeve.reviewCadence ||
        'as-needed';

      if (
        !cadenceMap.has(
          cadence
        )
      ) {
        cadenceMap.set(
          cadence,
          []
        );
      }

      cadenceMap
        .get(cadence)
        .push(
          sleeve.label
        );
    });

  return [
    ...cadenceMap.entries()
  ]
    .map(
      ([
        cadence,
        sleeveLabels
      ]) => `
        <div class="summary-item">
          <strong>
            ${escapeHtml(
              formatIdentifier(
                cadence
              )
            )}
          </strong>

          <span>
            ${escapeHtml(
              sleeveLabels.join(
                ' · '
              )
            )}
          </span>
        </div>
      `
    )
    .join('');
}

function renderWhyThisFits(jobs) {
  if (!jobs || jobs.length === 0) {
    return `
      <section class="card panel fit-summary" style="margin-top: 22px">
        <h2>Why this fits</h2>
        <p class="lead">This recommendation is built from your investor profile and the jobs your answers reveal.</p>
      </section>
    `;
  }

  const firstJobPhrase = jobs[0]?.title || 'your main job';
  const additional = jobs.length > 1 ? ` plus ${jobs.length - 1} other supporting jobs` : '';

  return `
    <section class="card panel fit-summary" style="margin-top: 22px">
      <h2>Why this fits</h2>
      <p class="lead">This portfolio system is designed to support ${escapeHtml(firstJobPhrase.toLowerCase())}${escapeHtml(additional)}. It connects your profile to the recommended archetype and keeps the system aligned with what matters most.</p>
    </section>
  `;
}


export function renderInvestingSystem(
  root
) {
  document.title =
    'AaronBux - Your Investing System';

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
            Profile
          </button>

          <div style="text-align: center">
            <div class="brand">
              AaronBux
            </div>

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
        <div
          id="missingState"
          class="card panel"
          style="display: none"
        >
          <h2>
            We could not find your answers.
          </h2>

          <p class="lead">
            Complete the assessment before viewing your investing system.
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
          <div class="card panel result-hero">
            <span class="pill">
              Your best-fit system
            </span>

            <h1 id="systemName"></h1>

            <p
              class="lead"
              id="systemSummary"
            ></p>

            <div
              id="variantSummary"
              class="evidence"
              style="display: none"
            ></div>
          </div>

          <section
            class="card panel"
            style="margin-top: 22px"
          >
            <span class="pill">
              How the parts work together
            </span>

            <div
              id="components"
              class="component-list"
              style="margin-top: 16px"
            ></div>

            <div
              class="evidence"
              id="structureEvidence"
            ></div>
          </section>

          <div
            class="system-grid"
            style="margin-top: 22px"
          >
            <article class="system-card">
              <span class="pill">
                Effort and return role
              </span>

              <h2>
                Where effort may add value
              </h2>

              <div id="effortMetrics"></div>

              <div
                class="evidence"
                id="effortEvidence"
              ></div>
            </article>

            <article class="system-card">
              <span class="pill">
                What to monitor
              </span>

              <h2 id="monitorHeading"></h2>

              <div
                id="monitorItems"
                class="summary-list"
              ></div>

              <div
                class="evidence"
                id="monitorEvidence"
              ></div>
            </article>

            <article class="system-card">
              <span class="pill">
                Review rhythm
              </span>

              <h2 id="cadenceHeading"></h2>

              <div
                id="cadenceItems"
                class="summary-list"
              ></div>

              <div
                class="evidence"
                id="cadenceEvidence"
              ></div>
            </article>
          </div>

          <section
            class="card panel"
            style="margin-top: 22px"
          >
            <span class="pill">
              When to reconsider something
            </span>

            <div
              id="changeRules"
              class="summary-list"
              style="margin-top: 14px"
            ></div>

            <div
              class="evidence"
              id="rulesEvidence"
            ></div>
          </section>

          <section class="card panel" style="margin-top: 22px">
            <h3>Explore further</h3>
            <p class="lead">See how the parts of your recommended system work together.</p>
            <button id="explorePortfolioBtn" class="btn btn-primary" type="button">Explore your portfolio</button>
          </section>
        </section>
      </main>
    </div>
  `;

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

  const showMissingState =
    () => {
      missingState.style.display =
        'block';

      const startButton =
        root.querySelector(
          '#startAssessmentBtn'
        );

      startButton.addEventListener(
        'click',
        () => {
          navigate(
            'assessment/1'
          );
        }
      );
    };

  if (
    !state.answers ||
    Object.keys(
      state.answers
    ).length === 0
  ) {
    showMissingState();
    return;
  }

  const assessmentResult =
    getAssessmentResult();

  if (!assessmentResult) {
    showMissingState();
    return;
  }

  const staticSystem =
    SYSTEMS[
      assessmentResult.archetypeId
    ] ||
    SYSTEMS.GD;

  const portfolioSystem =
    assessmentResult.portfolioSystem;

  result.style.display =
    'block';

  /*
   * Use the composed portfolio system when available.
   * Preserve the existing static archetype copy as fallback.
   */
  root
    .querySelector(
      '#systemName'
    )
    .textContent =
      portfolioSystem?.system
        ?.systemName ||
      staticSystem.name;

  root
    .querySelector(
      '#systemSummary'
    )
    .textContent =
      portfolioSystem?.system
        ?.philosophy ||
      staticSystem.summary;

  const variantSummary =
    root.querySelector(
      '#variantSummary'
    );

  if (portfolioSystem) {
    variantSummary.style.display =
      'block';

    variantSummary.innerHTML = `
      <strong>
        Your version:
      </strong>

      ${escapeHtml(
        formatVariant(
          portfolioSystem
            .profileVariantId
        )
      )}

      ·

      ${portfolioSystem
        .totals
        .sleeveCount}
      portfolio parts
    `;
  }

  root
    .querySelector(
      '#components'
    )
    .innerHTML =
      portfolioSystem
        ? renderPortfolioSleeves(
            portfolioSystem
          )
        : renderStaticComponents(
            staticSystem
          );

  root
    .querySelector(
      '#effortMetrics'
    )
    .innerHTML =
      portfolioSystem
        ? renderPortfolioEffort(
            portfolioSystem
          )
        : renderStaticEffort(
            staticSystem
          );

  root
    .querySelector(
      '#monitorHeading'
    )
    .textContent =
      'Monitor only what can change the decision';

  root
    .querySelector(
      '#monitorItems'
    )
    .innerHTML =
      portfolioSystem
        ? renderPortfolioMonitoring(
            portfolioSystem
          )
        : staticSystem.monitor
            .map(
              (item) => `
                <div class="summary-item">
                  ${escapeHtml(
                    item
                  )}
                </div>
              `
            )
            .join('');

  root
    .querySelector(
      '#cadenceHeading'
    )
    .textContent =
      'Interact at a pace you can sustain';

  root
    .querySelector(
      '#cadenceItems'
    )
    .innerHTML =
      portfolioSystem
        ? renderPortfolioCadence(
            portfolioSystem
          )
        : staticSystem.cadence
            .map(
              (item) => `
                <div class="summary-item">
                  ${escapeHtml(
                    item
                  )}
                </div>
              `
            )
            .join('');

  /*
   * Preserve the existing archetype-level change rules.
   * These explain the system philosophy and are not replaced by
   * constituent sleeve data.
   */
  root
    .querySelector(
      '#changeRules'
    )
    .innerHTML =
      staticSystem.rules
        .map(
          (item) => `
            <div class="summary-item">
              ${escapeHtml(
                item
              )}
            </div>
          `
        )
        .join('');

  root
    .querySelector(
      '#structureEvidence'
    )
    .innerHTML =
      evidence(
        state,
        [
          'setup',
          'goals'
        ]
      );

  root
    .querySelector(
      '#effortEvidence'
    )
    .innerHTML =
      evidence(
        state,
        [
          'decisionStyle',
          'evolution'
        ]
      );

  root
    .querySelector(
      '#monitorEvidence'
    )
    .innerHTML =
      evidence(
        state,
        [
          'marketPsychology',
          'transition'
        ]
      );

  root
    .querySelector(
      '#cadenceEvidence'
    )
    .innerHTML =
      evidence(
        state,
        [
          'tradeoff',
          'marketPsychology'
        ]
      );

  root
    .querySelector(
      '#rulesEvidence'
    )
    .innerHTML =
      evidence(
        state,
        [
          'transition',
          'goals',
          'age'
        ]
      );

  const exploreBtn = root.querySelector('#explorePortfolioBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      navigate('recommendation/portfolio');
    });
  }
}
