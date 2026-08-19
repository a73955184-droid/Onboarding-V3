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
    whatBelongs:
      'Broad, durable exposures that are intended to remain part of the portfolio through ordinary market cycles.',
    effort: {
      label: 'Low effort',
      reviewCadenceLabel:
        'Annual review',
      whyThisEffort:
        'This sleeve is designed to operate primarily through broad portfolio rules rather than frequent decisions.'
    }
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
  'What can belong here',
  'Broad US equity',
  'Sleeve mandate',
  sleeve.guidance.whatBelongs,
  'Your effort',
  'Low effort · Annual review',
  sleeve.guidance.effort.whyThisEffort
]) {
  assert.ok(
    html.includes(expectedCopy),
    `Sleeve detail should render ${expectedCopy}`
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
  'Your effort should not repeat the sleeve allocation'
);

const labelOnlyHtml =
  renderSleeveDetailPanel({
    label: 'Label only',
    weightPercent: 10,
    guidance: {
      effort: {
        label: 'Low effort'
      }
    }
  });
assert.match(labelOnlyHtml, /Your effort/);
assert.match(labelOnlyHtml, /Low effort/);
assert.doesNotMatch(labelOnlyHtml, /Low effort\s*·/);

const cadenceOnlyHtml =
  renderSleeveDetailPanel({
    label: 'Cadence only',
    weightPercent: 10,
    guidance: {
      effort: {
        reviewCadenceLabel:
          'Quarterly review'
      }
    }
  });
assert.match(cadenceOnlyHtml, /Quarterly review/);
assert.doesNotMatch(cadenceOnlyHtml, /·\s*Quarterly review/);

const explanationOnlyHtml =
  renderSleeveDetailPanel({
    label: 'Explanation only',
    weightPercent: 10,
    guidance: {
      effort: {
        whyThisEffort:
          'Existing effort explanation.'
      }
    }
  });
assert.match(explanationOnlyHtml, /Your effort/);
assert.match(
  explanationOnlyHtml,
  /Existing effort explanation\./
);

assert.doesNotMatch(
  renderSleeveDetailPanel({
    label: 'No effort',
    weightPercent: 10,
    guidance: {}
  }),
  /Your effort/,
  'Missing effort information should omit the group'
);

const escapedHtml =
  renderSleeveDetailPanel({
    label: '<unsafe sleeve>',
    weightPercent: 10,
    guidance: {
      effort: {
        label: '<unsafe effort>',
        reviewCadenceLabel:
          'Review & decide',
        whyThisEffort:
          '<unsafe explanation>'
      }
    }
  });
assert.doesNotMatch(
  escapedHtml,
  /<unsafe/
);
assert.match(
  escapedHtml,
  /Review &amp; decide/
);

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
  const resolvedHtml =
    renderSleeveDetailPanel(
      resolvedSleeve
    );
  const resolvedEffort =
    resolvedSleeve.guidance.effort;

  assert.ok(
    resolvedHtml.includes(
      expectedEffortSummaries[
        resolvedSleeve.label
      ]
    ),
    `${resolvedSleeve.label} should render its resolved effort and cadence`
  );
  assert.ok(
    resolvedHtml.includes(
      resolvedEffort.whyThisEffort
    ),
    `${resolvedSleeve.label} should render its resolved effort explanation`
  );
  assert.equal(
    (
      resolvedHtml.match(
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
    !resolvedHtml.includes(
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
assert.match(
  screenSource,
  /renderEffortDistribution\(/,
  'Aggregate portfolio effort distribution should remain'
);
assert.match(
  screenSource,
  /YOUR EFFORT MODEL/,
  'The standalone effort section should remain'
);
assert.match(
  screenSource,
  /Effort vs\. return contribution/,
  'Portfolio-level return and effort guidance should remain'
);

console.log(
  'Sleeve effort detail tests passed.'
);
