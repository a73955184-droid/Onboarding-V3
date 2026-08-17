/*
 * Portfolio Evolution Guidance
 *
 * Explains an already-resolved Stage using the investor's selected
 * setup and evolution evidence. This module does not score answers
 * or participate in profile resolution.
 */


export const PORTFOLIO_EVOLUTION_SETUP_JOBS = Object.freeze({
  not_started: {
    id: 'establish_structure',
    copy:
      'Help me establish a clear portfolio structure before I add more investments.'
  },

  simple_start: {
    id: 'clarify_foundation',
    copy:
      'Help me understand and strengthen the foundation I already have before adding unnecessary complexity.'
  },

  etfs_stocks: {
    id: 'organize_existing_holdings',
    copy:
      'Help me understand how my current investments fit together and where each one belongs.'
  },

  collected: {
    id: 'reconcile_accumulated_ideas',
    copy:
      'Help me organize the ideas I have already added and understand what still belongs, overlaps, or needs a clearer role.'
  },

  established: {
    id: 'improve_existing_system',
    copy:
      'Help me improve my existing portfolio without disrupting parts of the system that are already working.'
  }
});


export const PORTFOLIO_EVOLUTION_NEEDS = Object.freeze({
  understand: {
    id: 'clarify_roles',
    copy:
      'Clarify what each part is for and whether it still belongs in the portfolio.'
  },

  monitor: {
    id: 'define_monitoring',
    copy:
      'Show me what information actually matters for each portfolio role and what I can safely ignore.'
  },

  frequency: {
    id: 'define_review_thresholds',
    copy:
      'Help me know when the portfolio genuinely needs review or change instead of reacting to ordinary movement.'
  },

  effort: {
    id: 'allocate_improvement_effort',
    copy:
      'Help me identify which potential improvements deserve additional research and effort and which would only add complexity.'
  },

  experiment: {
    id: 'integrate_new_ideas_safely',
    copy:
      'Help me understand where a new idea belongs, what it changes or overlaps with, and whether it can improve the portfolio without disrupting what already works.'
  }
});


const SETUP_PRECEDENCE = Object.freeze([
  'established',
  'collected',
  'etfs_stocks',
  'simple_start',
  'not_started'
]);


const PORTFOLIO_EVOLUTION_USER_JTBD = Object.freeze({
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


export function getPortfolioEvolutionGuidance({
  setupOptionIds,
  evolutionOptionId,
  resolvedStageId
} = {}) {
  const baseResult = {
    setupOptionId: null,
    setupJob: null,
    evolutionOptionId:
      evolutionOptionId ?? null,
    evolutionNeed: null,
    userJTBD: null,
    resolvedStageId:
      resolvedStageId ?? null
  };

  if (
    !Array.isArray(setupOptionIds) ||
    setupOptionIds.length === 0 ||
    setupOptionIds.some(
      (optionId) =>
        !Object.hasOwn(
          PORTFOLIO_EVOLUTION_SETUP_JOBS,
          optionId
        )
    ) ||
    !Object.hasOwn(
      PORTFOLIO_EVOLUTION_NEEDS,
      evolutionOptionId
    )
  ) {
    return baseResult;
  }

  const setupOptionId =
    SETUP_PRECEDENCE.find(
      (optionId) =>
        setupOptionIds.includes(
          optionId
        )
    ) ?? null;

  if (!setupOptionId) {
    return baseResult;
  }

  return {
    setupOptionId,
    setupJob:
      PORTFOLIO_EVOLUTION_SETUP_JOBS[
        setupOptionId
      ],
    evolutionOptionId,
    evolutionNeed:
      PORTFOLIO_EVOLUTION_NEEDS[
        evolutionOptionId
      ],
    userJTBD:
      PORTFOLIO_EVOLUTION_USER_JTBD[
        setupOptionId
      ][evolutionOptionId],
    resolvedStageId:
      resolvedStageId ?? null
  };
}
