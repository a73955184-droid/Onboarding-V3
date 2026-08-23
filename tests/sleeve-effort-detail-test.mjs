import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  renderSleeveDetailPanel
} from '../src/features/recommendation/PortfolioSystemFitScreen.js';

import {
  resolvePortfolioJobFit
} from '../src/domain/portfolio-philosophy/portfolio-job-fit-resolver.js';

import {
  presentPortfolioJobFit
} from '../src/domain/portfolio-philosophy/portfolio-job-fit-presenter.js';

import {
  presentInvestorSystemGuidance
} from '../src/domain/investor-system-guidance/investor-system-guidance-presenter.js';


function escapeForHtmlTest(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


const sleeve = {
  id: 'durable-core',
  label: 'Durable Core',
  weightPercent: 44,
  assetCategories: [
    {
      label: 'Broad US equity'
    }
  ],
  guidance: {
    job:
      'Provide the primary strategic portfolio foundation.',
    returnContribution:
      'Support the portfolio main long-term return objective.',
    whatUsuallyDoesNotBelong:
      'Concentrated bets whose behavior conflicts with the sleeve mandate.',
    whatBelongs:
      'Broad, durable exposures that are intended to remain part of the portfolio through ordinary market cycles.',
    redundancyCheck:
      'Check whether the asset duplicates the durable core.',
    relevantSignals:
      'Structural changes tied to the sleeve role.',
    actionBoundary:
      'Review when the strategic role changes.',
    effort: {
      label: 'Low effort',
      reviewCadenceLabel:
        'Annual review',
      whyThisEffort:
        'This sleeve is designed to operate primarily through broad portfolio rules rather than frequent decisions.',
      redundantAttention:
        'Daily monitoring does not change the sleeve role.'
    }
  },
  monitoring: {
    marketTrends: [
      {
        label: 'Broad market conditions',
        reviewQuestion:
          'Has anything changed the long-term role this sleeve performs?'
      }
    ]
  }
};

const html =
  renderSleeveDetailPanel(
    sleeve
  );

for (const expectedCopy of [
  'Durable Core',
  'Its job',
  sleeve.guidance.job,
  'Return contribution',
  sleeve.guidance.returnContribution,
  'WHAT BELONGS HERE',
  'WHAT NEEDS YOUR ATTENTION',
  'WHAT TO WATCH',
  'Can belong',
  'Broad US equity',
  "Usually doesn't belong",
  sleeve.guidance.whatUsuallyDoesNotBelong,
  'Sleeve rule',
  sleeve.guidance.whatBelongs,
  'Before adding something',
  sleeve.guidance.redundancyCheck
]) {
  assert.ok(
    html.includes(expectedCopy),
    `Sleeve detail should render ${expectedCopy}`
  );
}

const detailGroupOrder = [
  'Its job',
  'Return contribution',
  'WHAT BELONGS HERE',
  'Can belong',
  "Usually doesn't belong",
  'Sleeve rule',
  'Before adding something'
];
for (let index = 1; index < detailGroupOrder.length; index += 1) {
  assert.ok(
    html.indexOf(detailGroupOrder[index - 1]) <
      html.indexOf(detailGroupOrder[index]),
    `${detailGroupOrder[index]} should follow ${detailGroupOrder[index - 1]}`
  );
}

assert.equal(
  (html.match(/44%/g) ?? []).length,
  1,
  'Sleeve allocation should remain only in the selected-sleeve header'
);
assert.doesNotMatch(
  html,
  /44% of portfolio/,
  'Sleeve details should not repeat the sleeve allocation'
);

assert.doesNotMatch(
  html,
  /Routine review/,
  'Only the default focus area should be expanded'
);

const attentionHtml =
  renderSleeveDetailPanel(
    sleeve,
    'attention'
  );

for (const expectedCopy of [
  'Routine review',
  sleeve.guidance.effort.label,
  sleeve.guidance.effort.reviewCadenceLabel,
  sleeve.guidance.effort.whyThisEffort,
  'Review sooner if',
  sleeve.guidance.actionBoundary,
  'Usually leave it alone when',
  sleeve.guidance.effort.redundantAttention
]) {
  assert.ok(
    attentionHtml.includes(
      expectedCopy
    ),
    `Attention focus should render ${expectedCopy}`
  );
}

assert.doesNotMatch(
  attentionHtml,
  /Can belong/,
  'Belongs content should collapse when attention is active'
);

const watchHtml =
  renderSleeveDetailPanel(
    sleeve,
    'watch'
  );

for (const expectedCopy of [
  'Broad market conditions',
  'Has anything changed the long-term role this sleeve performs?',
  'When it warrants review',
  sleeve.guidance.actionBoundary
]) {
  assert.ok(
    watchHtml.includes(
      expectedCopy
    ),
    `Watch focus should render ${expectedCopy}`
  );
}

assert.doesNotMatch(
  watchHtml,
  /Routine review/,
  'Attention content should collapse when watch is active'
);

const labelOnlyHtml =
  renderSleeveDetailPanel(
    {
      label: 'Label only',
      weightPercent: 10,
      guidance: {
        effort: {
          label: 'Low effort'
        }
      }
    },
    'attention'
  );
assert.match(labelOnlyHtml, /Routine review/);
assert.match(labelOnlyHtml, /Low effort/);
assert.doesNotMatch(labelOnlyHtml, /Low effort\s*·/);

const cadenceOnlyHtml =
  renderSleeveDetailPanel(
    {
      label: 'Cadence only',
      weightPercent: 10,
      guidance: {
        effort: {
          reviewCadenceLabel:
            'Quarterly review'
        }
      }
    },
    'attention'
  );
assert.match(cadenceOnlyHtml, /Quarterly review/);
assert.doesNotMatch(cadenceOnlyHtml, /·\s*Quarterly review/);

const explanationOnlyHtml =
  renderSleeveDetailPanel(
    {
      label: 'Explanation only',
      weightPercent: 10,
      guidance: {
        effort: {
          whyThisEffort:
            'Existing effort explanation.'
        }
      }
    },
    'attention'
  );
assert.match(explanationOnlyHtml, /Routine review/);
assert.match(
  explanationOnlyHtml,
  /Existing effort explanation\./
);

assert.doesNotMatch(
  renderSleeveDetailPanel(
    {
      label: 'No effort',
      weightPercent: 10,
      guidance: {}
    },
    'attention'
  ),
  /Routine review/,
  'Missing effort information should omit the group'
);

const escapedHtml =
  [
    'belongs',
    'attention'
  ]
    .map(
      (focusArea) =>
        renderSleeveDetailPanel(
          {
            label: '<unsafe sleeve>',
            weightPercent: 10,
            guidance: {
              whatUsuallyDoesNotBelong:
                '<unsafe exclusion>',
              effort: {
                label: '<unsafe effort>',
                reviewCadenceLabel:
                  'Review & decide',
                whyThisEffort:
                  '<unsafe explanation>'
              }
            }
          },
          focusArea
        )
    )
    .join('');
assert.doesNotMatch(
  escapedHtml,
  /<unsafe/
);
assert.match(
  escapedHtml,
  /Review &amp; decide/
);
assert.match(
  escapedHtml,
  /&lt;unsafe exclusion&gt;/
);

for (const invalidValue of [null, {}, '   ']) {
  assert.doesNotMatch(
    renderSleeveDetailPanel({
      label: 'Missing boundary',
      weightPercent: 10,
      guidance: {
        whatUsuallyDoesNotBelong:
          invalidValue
      }
    }),
    /Usually doesn't belong/,
    'Missing or invalid boundary copy should omit the group'
  );
}

const resolvedGuidance =
  presentInvestorSystemGuidance(
    presentPortfolioJobFit(
      resolvePortfolioJobFit({
        archetypeId: 'FT',
        stageId: 'adaptive_investor',
        styleId: 'systematic_improver',
        modifierId: 'validation_seeker',
        normalizedAnswers: {
          setup: [
            'etfs_stocks',
            'collected'
          ],
          transition: [
            'what_to_do',
            'change'
          ],
          decisionStyle: [
            'start',
            'fit'
          ],
          marketPsychology:
            'holding',
          evolution:
            'experiment',
          tradeoff:
            'periodic',
          age:
            '10plus',
          goals: [
            'choose'
          ]
        }
      })
    )
  );

assert.equal(
  resolvedGuidance.resolved.archetypeId,
  'FT'
);
assert.equal(
  resolvedGuidance.resolved.variantId,
  'intentional'
);

assert.deepEqual(
  resolvedGuidance.sleeves.map(
    (resolvedSleeve) => ({
      id: resolvedSleeve.id,
      weightPercent:
        resolvedSleeve.weightPercent
    })
  ),
  [
    { id: 'durableCore', weightPercent: 40 },
    { id: 'globalDiversification', weightPercent: 20 },
    { id: 'stability', weightPercent: 15 },
    { id: 'qualityImprovement', weightPercent: 10 },
    { id: 'smallValueImprovement', weightPercent: 10 },
    { id: 'liquidity', weightPercent: 5 }
  ],
  'Recommendation sleeve allocations should remain unchanged'
);

const globalDiversification =
  resolvedGuidance.sleeves.find(
    (resolvedSleeve) =>
      resolvedSleeve.label ===
      'Global Diversification'
  );
const globalBelongsHtml =
  renderSleeveDetailPanel(
    globalDiversification,
    'belongs'
  );
const globalAttentionHtml =
  renderSleeveDetailPanel(
    globalDiversification,
    'attention'
  );
const globalWatchHtml =
  renderSleeveDetailPanel(
    globalDiversification,
    'watch'
  );

for (const expectedCopy of [
  'Broad international equity',
  globalDiversification.guidance.whatUsuallyDoesNotBelong,
  globalDiversification.guidance.whatBelongs,
  globalDiversification.guidance.redundancyCheck
]) {
  assert.ok(
    globalBelongsHtml.includes(
      escapeForHtmlTest(
        expectedCopy
      )
    ),
    `Global Diversification belongs focus should render ${expectedCopy}`
  );
}

for (const expectedCopy of [
  globalDiversification.guidance.effort.label,
  globalDiversification.guidance.effort.reviewCadenceLabel,
  globalDiversification.guidance.effort.whyThisEffort,
  globalDiversification.guidance.actionBoundary,
  globalDiversification.guidance.effort.redundantAttention
]) {
  assert.ok(
    globalAttentionHtml.includes(
      escapeForHtmlTest(
        expectedCopy
      )
    ),
    `Global Diversification attention focus should render ${expectedCopy}`
  );
}

for (const expectedCopy of [
  'International growth conditions',
  'Does the geographic exposure still provide the intended diversification?',
  'Currency movement',
  'Is currency movement changing the long-term role, or only short-term performance?'
]) {
  assert.ok(
    globalWatchHtml.includes(
      escapeForHtmlTest(
        expectedCopy
      )
    ),
    `Global Diversification watch focus should render ${expectedCopy}`
  );
}

const durableCoreBelongsHtml =
  renderSleeveDetailPanel(
    resolvedGuidance.sleeves[0],
    'belongs'
  );
assert.notEqual(
  durableCoreBelongsHtml,
  globalBelongsHtml,
  'Switching sleeves should replace the selected sleeve values'
);
assert.match(
  globalBelongsHtml,
  /Global Diversification/
);
assert.doesNotMatch(
  globalBelongsHtml,
  />Durable Core</
);

const expectedEffortSummaries = {
  'Durable Core':
    'Low effort · Annual review',
  'Global Diversification':
    'Low effort · Annual review',
  Stability:
    'Low effort · Annual review',
  'Quality Improvement':
    'Moderate effort · Quarterly review',
  'Small-Value Improvement':
    'Moderate effort · Quarterly review',
  Liquidity:
    'Very low effort · Review as needs change'
};

for (const resolvedSleeve of resolvedGuidance.sleeves) {
  const resolvedBelongsHtml =
    renderSleeveDetailPanel(
      resolvedSleeve
    );
  const resolvedAttentionHtml =
    renderSleeveDetailPanel(
      resolvedSleeve,
      'attention'
    );
  const resolvedWatchHtml =
    renderSleeveDetailPanel(
      resolvedSleeve,
      'watch'
    );
  const resolvedEffort =
    resolvedSleeve.guidance.effort;
  const resolvedBoundary =
    resolvedSleeve.guidance.whatUsuallyDoesNotBelong;

  assert.equal(
    typeof resolvedBoundary,
    'string',
    `${resolvedSleeve.label} should expose resolved boundary copy`
  );
  assert.ok(
    resolvedBelongsHtml.includes(
      resolvedBoundary
    ),
    `${resolvedSleeve.label} should render its resolved boundary copy`
  );
  assert.ok(
    resolvedBelongsHtml.indexOf('Can belong') <
      resolvedBelongsHtml.indexOf("Usually doesn't belong") &&
      resolvedBelongsHtml.indexOf("Usually doesn't belong") <
        resolvedBelongsHtml.indexOf('Sleeve rule') &&
      resolvedBelongsHtml.indexOf('Sleeve rule') <
        resolvedBelongsHtml.indexOf('Before adding something'),
    `${resolvedSleeve.label} should render boundary copy between assets and mandate`
  );

  assert.ok(
    resolvedBelongsHtml.includes(
      resolvedSleeve.guidance.redundancyCheck
    ),
    `${resolvedSleeve.label} should render its redundancy check`
  );

  assert.ok(
    resolvedAttentionHtml.includes(
      expectedEffortSummaries[
        resolvedSleeve.label
      ]
    ),
    `${resolvedSleeve.label} should render its resolved effort and cadence`
  );
  assert.ok(
    resolvedAttentionHtml.includes(
      resolvedEffort.whyThisEffort
    ),
    `${resolvedSleeve.label} should render its resolved effort explanation`
  );
  assert.ok(
    resolvedAttentionHtml.includes(
      resolvedSleeve.guidance.actionBoundary
    ) &&
    resolvedAttentionHtml.includes(
      resolvedEffort.redundantAttention
    ),
    `${resolvedSleeve.label} should render its attention boundaries`
  );

  for (const trend of resolvedSleeve.monitoring.marketTrends) {
    assert.ok(
      resolvedWatchHtml.includes(
        trend.label
      ) &&
      resolvedWatchHtml.includes(
        escapeForHtmlTest(
          trend.reviewQuestion
        )
      ),
      `${resolvedSleeve.label} should render its existing monitoring signal`
    );
  }

  assert.ok(
    resolvedWatchHtml.includes(
      resolvedSleeve.guidance.actionBoundary
    ),
    `${resolvedSleeve.label} should render its watch action boundary`
  );
  assert.equal(
    (
      resolvedBelongsHtml.match(
        new RegExp(
          `${resolvedSleeve.weightPercent}%`,
          'g'
        )
      ) ?? []
    ).length,
    1,
    `${resolvedSleeve.label} should show its percentage only in the header`
  );
  assert.ok(
    !resolvedBelongsHtml.includes(
      `${resolvedSleeve.weightPercent}% of portfolio`
    )
  );
}

const screenSource =
  readFileSync(
    new URL(
      '../src/features/recommendation/PortfolioSystemFitScreen.js',
      import.meta.url
    ),
    'utf8'
  );

assert.doesNotMatch(
  screenSource,
  /renderSleeveEffortRows|sleeveEffortRows/,
  'Duplicated sleeve-by-sleeve effort rows should be removed'
);
assert.doesNotMatch(
  screenSource,
  /renderEffortDistribution|YOUR EFFORT MODEL|id="effortSummary"|effortDistribution|returnEffortExplanation|effortWarning|Effort vs\. return contribution/,
  'The standalone effort-model section and its dedicated code should be removed'
);
assert.doesNotMatch(
  screenSource,
  /YOUR BOUNDED PORTFOLIO SYSTEM/,
  'The redundant bounded portfolio system should not render'
);
assert.doesNotMatch(
  screenSource,
  /boundedSleeveCards/,
  'The duplicate bounded sleeve cards should not render'
);
assert.match(
  screenSource,
  /YOUR PORTFOLIO SYSTEM/,
  'The interactive portfolio system should remain intact'
);
assert.match(
  screenSource,
  /HOW YOUR SYSTEM HELPS YOU DECIDE/,
  'The decision section should remain intact'
);
assert.match(
  screenSource,
  /USER LED/,
  'The user-led section should remain intact'
);
assert.match(
  screenSource,
  /let selectedSleeveFocusArea =\s*'belongs'/,
  'The local focus state should default to belongs'
);
assert.match(
  screenSource,
  /updateSleeveDetails\(\s*sleeveId\s*\)/,
  'Changing focus should rerender the currently displayed sleeve'
);

console.log(
  'Sleeve effort detail tests passed.'
);
