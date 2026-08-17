/*
 * Portfolio Decision-Making Guidance
 *
 * Explains an already-resolved Behavior profile using selected
 * transition and decision-style evidence. This module does not score
 * answers or participate in profile resolution.
 */


export const PORTFOLIO_DECISION_TRIGGERS = Object.freeze({
  what_to_do: {
    id:
      'next_step_uncertainty',
    copy:
      'Help me turn uncertainty about what to do next into a clear decision question and an understandable next step.'
  },

  doing_right: {
    id:
      'reasoning_validation',
    copy:
      'Help me check whether the reasoning behind my current approach still makes sense before I change it.'
  },

  missing: {
    id:
      'missing_something_uncertainty',
    copy:
      'Help me determine whether something important is genuinely missing or whether more choices would only create unnecessary uncertainty.'
  },

  change: {
    id:
      'change_threshold_uncertainty',
    copy:
      'Help me distinguish a meaningful reason to change the portfolio from movement or information that does not justify action.'
  },

  compare: {
    id:
      'tradeoff_comparison',
    copy:
      'Help me compare reasonable alternatives using the tradeoffs that actually matter to the portfolio decision.'
  }
});


export const PORTFOLIO_DECISION_TYPES = Object.freeze({
  start: {
    id:
      'starting_decision',
    copy:
      'Help me make a first decision that is understandable, appropriately bounded, and does not depend on finding a perfect option.'
  },

  pick: {
    id:
      'choice_decision',
    copy:
      'Help me compare funds, stocks, or other choices using criteria tied to the portfolio job they are supposed to perform.'
  },

  fit: {
    id:
      'portfolio_fit_decision',
    copy:
      'Help me determine whether a new idea actually improves my overall portfolio rather than evaluating it only on its own merits.'
  },

  sell: {
    id:
      'change_or_exit_decision',
    copy:
      'Help me determine whether the reason for owning something has materially changed enough to justify selling, reducing, or leaving it alone.'
  },

  enough: {
    id:
      'research_stopping_decision',
    copy:
      'Help me know when I have enough relevant evidence to make a reasonable decision instead of continuing to research indefinitely.'
  }
});


const TRANSITION_PRECEDENCE = Object.freeze([
  'change',
  'compare',
  'missing',
  'doing_right',
  'what_to_do'
]);


const DECISION_STYLE_PRECEDENCE = Object.freeze([
  'sell',
  'fit',
  'enough',
  'pick',
  'start'
]);


const PORTFOLIO_DECISION_USER_JTBD = Object.freeze({
  what_to_do: Object.freeze({
    start:
      'Help me turn uncertainty about what to do next into one understandable first decision, with a clear reason for why that step makes sense.',
    pick:
      'Help me turn uncertainty about what to do next into a clear comparison of the available choices and the portfolio job each option would perform.',
    fit:
      'Help me turn uncertainty about what to do next into a clear test of whether a new idea actually fits and improves the portfolio I already have.',
    sell:
      'Help me turn uncertainty about what to do next into a clear assessment of whether something should be sold, reduced, changed, or simply left alone.',
    enough:
      'Help me turn uncertainty about what to do next into a bounded research process so I know when I have enough relevant information to make a reasonable decision.'
  }),

  doing_right: Object.freeze({
    start:
      'Help me validate that my starting decision has a sound reason behind it so confidence comes from understanding the choice rather than simply hoping it is right.',
    pick:
      'Help me validate whether the option I am considering fits the criteria that matter to my portfolio instead of judging the choice only by recent performance or popularity.',
    fit:
      'Help me validate whether a new idea improves a defined portfolio job and fits with what I already own before I decide to add it.',
    sell:
      'Help me validate whether the original reason for owning something still holds before I decide to sell, reduce, or leave it alone.',
    enough:
      'Help me validate my reasoning with the evidence that actually matters and recognize when additional research is no longer likely to improve the decision.'
  }),

  missing: Object.freeze({
    start:
      'Help me determine what is actually necessary for a sound starting portfolio so fear of missing something does not push me into unnecessary complexity.',
    pick:
      'Help me determine whether another investment choice solves a real portfolio need or simply adds another option because I am worried I may be missing something.',
    fit:
      'Help me determine whether a new idea fills a genuine portfolio gap, duplicates something I already have, or adds complexity without improving the overall system.',
    sell:
      'Help me determine whether something important has changed in an existing holding before assuming that uncertainty means I need to sell or replace it.',
    enough:
      'Help me distinguish a genuine information gap from the feeling that I should keep researching, so I know when the evidence is sufficient to decide.'
  }),

  change: Object.freeze({
    start:
      'Help me establish clear reasons for revisiting an initial investment decision so ordinary market movement does not make me repeatedly question the starting choice.',
    pick:
      'Help me determine whether new information meaningfully changes the comparison between reasonable investment choices before I switch from one option to another.',
    fit:
      'Help me determine whether a new idea changes the portfolio in a useful way before allowing it to alter an existing structure that may already be doing its job.',
    sell:
      'Help me distinguish a meaningful break in the reason for owning something from ordinary volatility so I can decide whether to sell, reduce, or leave it alone.',
    enough:
      'Help me identify the evidence threshold that would actually justify a portfolio change so I can stop researching when nothing decision-relevant has changed.'
  }),

  compare: Object.freeze({
    start:
      'Help me compare reasonable ways to get started using the tradeoffs that matter most, so I can choose a sound starting path without searching for a perfect one.',
    pick:
      'Help me compare investment choices using consistent criteria tied to their portfolio role, expected contribution, risks, and tradeoffs.',
    fit:
      'Help me compare a new idea with what I already own and understand whether it adds a distinct portfolio benefit that justifies changing the current system.',
    sell:
      'Help me compare the tradeoffs of keeping, reducing, replacing, or selling an existing investment based on whether its original portfolio role still holds.',
    enough:
      'Help me compare the decision-relevant tradeoffs, identify what additional information could actually change the choice, and stop researching when further comparison adds little value.'
  })
});


export function getPortfolioDecisionMakingGuidance({
  transitionOptionIds,
  decisionStyleOptionIds,
  resolvedBehaviorId
} = {}) {
  const baseResult = {
    transitionOptionIds:
      Array.isArray(
        transitionOptionIds
      )
        ? [...transitionOptionIds]
        : [],
    primaryTransitionOptionId: null,
    transitionTrigger: null,
    decisionStyleOptionIds:
      Array.isArray(
        decisionStyleOptionIds
      )
        ? [...decisionStyleOptionIds]
        : [],
    primaryDecisionStyleOptionId: null,
    decisionType: null,
    userJTBD: null,
    resolvedBehaviorId:
      resolvedBehaviorId ?? null
  };

  if (
    baseResult
      .transitionOptionIds
      .length === 0 ||
    baseResult
      .decisionStyleOptionIds
      .length === 0 ||
    baseResult
      .transitionOptionIds
      .some(
        (optionId) =>
          !Object.hasOwn(
            PORTFOLIO_DECISION_TRIGGERS,
            optionId
          )
      ) ||
    baseResult
      .decisionStyleOptionIds
      .some(
        (optionId) =>
          !Object.hasOwn(
            PORTFOLIO_DECISION_TYPES,
            optionId
          )
      )
  ) {
    return baseResult;
  }

  const primaryTransitionOptionId =
    TRANSITION_PRECEDENCE.find(
      (optionId) =>
        baseResult
          .transitionOptionIds
          .includes(optionId)
    ) ?? null;

  const primaryDecisionStyleOptionId =
    DECISION_STYLE_PRECEDENCE.find(
      (optionId) =>
        baseResult
          .decisionStyleOptionIds
          .includes(optionId)
    ) ?? null;

  if (
    !primaryTransitionOptionId ||
    !primaryDecisionStyleOptionId
  ) {
    return baseResult;
  }

  return {
    ...baseResult,
    primaryTransitionOptionId,
    transitionTrigger:
      PORTFOLIO_DECISION_TRIGGERS[
        primaryTransitionOptionId
      ],
    primaryDecisionStyleOptionId,
    decisionType:
      PORTFOLIO_DECISION_TYPES[
        primaryDecisionStyleOptionId
      ],
    userJTBD:
      PORTFOLIO_DECISION_USER_JTBD[
        primaryTransitionOptionId
      ][primaryDecisionStyleOptionId]
  };
}
