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


const PORTFOLIO_EVOLUTION_SYSTEM_JTBD = Object.freeze({
  not_started: Object.freeze({
    understand:
      'Help the portfolio start with a clear structure by giving each part a defined purpose before additional investments are added.',
    monitor:
      'Help the portfolio start with clear roles and identify what information will matter for each part once the investor begins investing.',
    frequency:
      'Help the portfolio start with a simple review rhythm that makes clear when attention is useful and when the system can be left alone.',
    effort:
      'Help the portfolio start with a focused foundation so research and effort go toward the decisions that matter most before additional complexity is introduced.',
    experiment:
      'Help the portfolio establish a stable foundation first and keep future experimentation in clearly bounded areas that cannot disrupt the core.'
  }),

  simple_start: Object.freeze({
    understand:
      'Help the portfolio make its existing foundation understandable by showing the purpose of each part and whether any important role is still missing.',
    monitor:
      'Help the portfolio connect its existing foundation to clear roles so monitoring can focus on the information that matters for each part.',
    frequency:
      'Help the portfolio define when its existing foundation genuinely needs review or change and when ordinary market movement can be left alone.',
    effort:
      'Help the portfolio distinguish improvements that meaningfully strengthen its foundation from changes that would add research, effort, or complexity without enough benefit.',
    experiment:
      'Help the portfolio preserve its existing foundation while giving new ideas a clearly defined place where they can be explored without disrupting the core.'
  }),

  etfs_stocks: Object.freeze({
    understand:
      'Help the portfolio organize its current investments into clear roles so it becomes visible what belongs, what overlaps, and what may still be missing.',
    monitor:
      'Help the portfolio connect each current investment to a clear role so monitoring can focus on information that matters to that role instead of treating every holding equally.',
    frequency:
      'Help the portfolio give its different parts clear review expectations so meaningful changes receive attention without turning normal movement into constant portfolio activity.',
    effort:
      'Help the portfolio show where deeper research could meaningfully improve the current structure and where additional effort would add complexity without enough benefit.',
    experiment:
      'Help the portfolio show where a new idea fits, what existing exposure it overlaps with, what useful role it adds, and what would change if it were included.'
  }),

  collected: Object.freeze({
    understand:
      'Help the portfolio organize accumulated investments around clear roles so overlaps, missing purposes, and holdings that no longer contribute meaningfully become visible.',
    monitor:
      'Help the portfolio organize accumulated ideas by purpose so monitoring effort follows the role each part performs rather than the number of investments owned.',
    frequency:
      'Help the portfolio give accumulated investments a deliberate review rhythm so changes happen for a portfolio reason rather than because an idea recently attracted attention.',
    effort:
      'Help the portfolio distinguish which accumulated ideas are worth further research or refinement from those that consume effort without meaningfully improving the system.',
    experiment:
      'Help the portfolio evolve without disrupting what already works by showing where a new idea fits, what it overlaps with, what useful role it adds, and what would change if it were included.'
  }),

  established: Object.freeze({
    understand:
      'Help the portfolio make its existing structure explicit so the contribution of each part is clear before deciding whether anything actually needs to change.',
    monitor:
      'Help the portfolio connect each established role to the information that would genuinely justify review while filtering out signals that do not change its purpose.',
    frequency:
      'Help the portfolio define when its established structure genuinely deserves review or adjustment and when preserving what already works is the better response.',
    effort:
      'Help the portfolio improve selectively by showing what could be improved, what benefit the change adds, and whether that benefit is worth the additional research, effort, or complexity.',
    experiment:
      'Help the portfolio protect its established structure while showing where a new idea would fit, what existing role it could change or duplicate, and whether its added benefit justifies altering what already works.'
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
    systemJTBD: null,
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
    systemJTBD:
      PORTFOLIO_EVOLUTION_SYSTEM_JTBD[
        setupOptionId
      ][evolutionOptionId],
    resolvedStageId:
      resolvedStageId ?? null
  };
}
