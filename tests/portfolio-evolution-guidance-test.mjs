import assert from 'node:assert/strict';

import {
  PORTFOLIO_EVOLUTION_NEEDS,
  PORTFOLIO_EVOLUTION_SETUP_JOBS,
  getPortfolioEvolutionGuidance
} from '../src/domain/investor-system-guidance/portfolio-evolution-guidance.js';


const EXPECTED_USER_JTBD = Object.freeze({
  not_started: Object.freeze({
    understand:
      'Help me establish a clear portfolio structure where I understand what each part is for before I add more investments.',
    monitor:
      'Help me build a portfolio where I know what information will matter for each part once I begin investing.',
    frequency:
      'Help me establish a portfolio with a clear review rhythm so I know when attention is useful and when leaving the system alone is reasonable.',
    effort:
      'Help me focus my early research on the decisions that matter most so I do not add complexity before I have a clear foundation.',
    experiment:
      'Help me build a stable foundation first and create clear boundaries for any new ideas I may want to test later.'
  }),

  simple_start: Object.freeze({
    understand:
      'Help me understand why my current foundation fits, what job each part performs, and whether anything important is missing.',
    monitor:
      'Help me connect my existing foundation to clear portfolio roles so I know what information matters and what I can safely ignore.',
    frequency:
      'Help me know when my current foundation genuinely needs review or change instead of reacting to ordinary market movement.',
    effort:
      'Help me identify which improvements to my existing foundation are worth additional research and which would add effort without meaningfully improving the portfolio.',
    experiment:
      'Help me understand where a new idea could fit around my existing foundation without allowing experimentation to disrupt the core.'
  }),

  etfs_stocks: Object.freeze({
    understand:
      'Help me understand how my current investments fit together, what job each one performs, and whether anything is missing, overlapping, or no longer serving a clear purpose.',
    monitor:
      'Help me know what information matters for each part of my current portfolio so I can monitor the system without treating every holding or market move as equally important.',
    frequency:
      'Help me know when the different parts of my portfolio actually need review so I can avoid both ignoring meaningful changes and overreacting to normal ones.',
    effort:
      'Help me identify which parts of my current portfolio deserve deeper research and whether a potential improvement is worth the additional effort or complexity.',
    experiment:
      'Help me understand where a new idea belongs, what it would overlap with in my current portfolio, and whether it adds a useful role without disrupting the existing structure.'
  }),

  collected: Object.freeze({
    understand:
      'Help me understand what role each investment I have added performs and whether anything now overlaps, lacks a clear purpose, or no longer belongs.',
    monitor:
      'Help me understand what deserves monitoring across the ideas I have accumulated so attention stays focused on the role each part is supposed to perform.',
    frequency:
      'Help me create a review rhythm for the ideas I have accumulated so changes happen for a reason rather than because something recently caught my attention.',
    effort:
      'Help me determine which of the ideas I have added genuinely deserve more research or refinement and which are consuming effort without improving the portfolio.',
    experiment:
      'Help me understand where a new idea belongs, what it would change or overlap with in my existing portfolio, and whether it adds a useful role without disrupting what already works.'
  }),

  established: Object.freeze({
    understand:
      'Help me make the structure of my existing portfolio explicit so I can see what each part contributes before deciding whether anything should change.',
    monitor:
      'Help me define what information would actually indicate that a part of my existing portfolio needs review, while filtering out noise that does not change its role.',
    frequency:
      'Help me define when my existing system genuinely deserves review or adjustment and when the better decision is to leave what already works alone.',
    effort:
      'Help me identify where my existing portfolio can genuinely be improved and whether the potential benefit is worth the additional research, effort, or complexity before changing a system that already works.',
    experiment:
      'Help me evaluate where a new idea would fit, what existing role it would change or duplicate, and whether the potential improvement justifies altering a system that already works.'
  })
});


for (
  const [setupOptionId, evolutionCases]
  of Object.entries(EXPECTED_USER_JTBD)
) {
  for (
    const [evolutionOptionId, expectedUserJTBD]
    of Object.entries(evolutionCases)
  ) {
    const guidance =
      getPortfolioEvolutionGuidance({
        setupOptionIds: [
          setupOptionId
        ],
        evolutionOptionId,
        resolvedStageId:
          'system_builder'
      });

    assert.equal(
      guidance.setupOptionId,
      setupOptionId,
      setupOptionId +
        ' + ' +
        evolutionOptionId +
        ': setup mismatch'
    );

    assert.equal(
      guidance.setupJob,
      PORTFOLIO_EVOLUTION_SETUP_JOBS[
        setupOptionId
      ],
      setupOptionId +
        ' + ' +
        evolutionOptionId +
        ': setup job mismatch'
    );

    assert.equal(
      guidance.evolutionNeed,
      PORTFOLIO_EVOLUTION_NEEDS[
        evolutionOptionId
      ],
      setupOptionId +
        ' + ' +
        evolutionOptionId +
        ': evolution need mismatch'
    );

    assert.equal(
      guidance.userJTBD,
      expectedUserJTBD,
      setupOptionId +
        ' + ' +
        evolutionOptionId +
        ': exact JTBD mismatch'
    );

    assert.equal(
      guidance.resolvedStageId,
      'system_builder',
      'Resolved Stage should pass through unchanged'
    );
  }
}


assert.equal(
  getPortfolioEvolutionGuidance({
    setupOptionIds: [
      'simple_start',
      'etfs_stocks'
    ],
    evolutionOptionId:
      'understand'
  }).setupOptionId,
  'etfs_stocks',
  'etfs_stocks should take precedence over simple_start'
);


assert.equal(
  getPortfolioEvolutionGuidance({
    setupOptionIds: [
      'collected',
      'established'
    ],
    evolutionOptionId:
      'understand'
  }).setupOptionId,
  'established',
  'established should take precedence over collected'
);


const fallbackCases = [
  {
    name: 'unknown setup',
    input: {
      setupOptionIds: [
        'unknown_setup'
      ],
      evolutionOptionId:
        'understand'
    }
  },
  {
    name: 'mixed unknown setup',
    input: {
      setupOptionIds: [
        'simple_start',
        'unknown_setup'
      ],
      evolutionOptionId:
        'understand'
    }
  },
  {
    name: 'unknown evolution',
    input: {
      setupOptionIds: [
        'simple_start'
      ],
      evolutionOptionId:
        'unknown_evolution'
    }
  },
  {
    name: 'missing setup',
    input: {
      evolutionOptionId:
        'understand'
    }
  },
  {
    name: 'missing evolution',
    input: {
      setupOptionIds: [
        'simple_start'
      ]
    }
  }
];


for (const fallbackCase of fallbackCases) {
  const guidance =
    getPortfolioEvolutionGuidance({
      ...fallbackCase.input,
      resolvedStageId:
        'portfolio_organizer'
    });

  assert.equal(
    guidance.userJTBD,
    null,
    fallbackCase.name +
      ': should not guess a dynamic JTBD'
  );

  assert.equal(
    guidance.resolvedStageId,
    'portfolio_organizer',
    fallbackCase.name +
      ': should preserve the resolved Stage'
  );
}


console.log(
  'Portfolio evolution guidance tests passed.'
);
