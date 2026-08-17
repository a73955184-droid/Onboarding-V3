/*
 * Portfolio Interaction Guidance
 *
 * Explains an already-resolved Style using the investor's selected
 * involvement preference and attention trigger. This module does not
 * score answers or participate in profile resolution.
 */


export const PORTFOLIO_INTERACTION_PREFERENCES = Object.freeze({
  tell_me: {
    id:
      'minimal_guided_interaction',
    copy:
      'Keep my interaction with the portfolio minimal and direct my attention only to the few things that genuinely require it.'
  },

  occasional: {
    id:
      'exception_based_interaction',
    copy:
      'Let me check the portfolio occasionally and keep routine attention low unless something meaningful deserves a closer look.'
  },

  periodic: {
    id:
      'scheduled_interaction',
    copy:
      'Give me a repeatable review rhythm so I can focus on the portfolio at planned times instead of reacting continuously.'
  },

  explore: {
    id:
      'bounded_research_interaction',
    copy:
      'Give me room to research selected ideas while keeping most of the portfolio outside that higher-effort activity.'
  },

  active: {
    id:
      'active_bounded_interaction',
    copy:
      'Let me stay actively engaged while keeping my attention organized around explicit portfolio roles and boundaries.'
  }
});


export const PORTFOLIO_INTERACTION_TRIGGERS = Object.freeze({
  balance: {
    id:
      'account_balance_attention',
    copy:
      'Help me redirect attention from changes in my account balance toward the portfolio roles and information that actually deserve review.'
  },

  market: {
    id:
      'market_event_attention',
    copy:
      'Help me prevent large market moves or alarming headlines from consuming attention across parts of the portfolio they do not meaningfully affect.'
  },

  holding: {
    id:
      'holding_specific_attention',
    copy:
      'Help me focus attention around a holding only when the information is relevant to the role that holding performs in the portfolio.'
  },

  idea: {
    id:
      'new_idea_attention',
    copy:
      'Help me contain the attention new investment ideas receive so exploration does not pull unnecessary effort away from the rest of the portfolio.'
  },

  rarely: {
    id:
      'exception_prompt_attention',
    copy:
      'Help me know what is important enough to deserve my attention when I am not regularly monitoring the portfolio.'
  }
});


const PORTFOLIO_INTERACTION_USER_JTBD = Object.freeze({
  tell_me: Object.freeze({
    balance:
      'Help me keep portfolio interaction simple and redirect my attention from changes in my account balance toward only the few portfolio roles that genuinely need review.',
    market:
      'Help me keep portfolio interaction simple and prevent large market moves or alarming headlines from pulling me into unnecessary monitoring or decisions.',
    holding:
      'Help me keep portfolio interaction simple by showing me when news about something I own actually deserves attention and when I can leave it alone.',
    idea:
      'Help me keep portfolio interaction simple by containing the attention new investment ideas receive so they do not turn routine investing into constant research.',
    rarely:
      'Help me maintain the portfolio with very little ongoing attention and make it clear when something is important enough to bring me back.'
  }),

  occasional: Object.freeze({
    balance:
      'Help me check the portfolio occasionally without letting changes in my account balance determine where I spend my attention.',
    market:
      'Help me interact with the portfolio occasionally and distinguish the market events worth reviewing from the noise I can safely leave alone.',
    holding:
      'Help me check individual holdings when needed without turning every piece of news or price movement into an ongoing monitoring task.',
    idea:
      'Help me give selected new ideas occasional attention without allowing them to increase the effort required across my whole portfolio.',
    rarely:
      'Help me keep routine portfolio interaction light and make the few situations that genuinely deserve a check-in easy to recognize.'
  }),

  periodic: Object.freeze({
    balance:
      'Help me use planned portfolio reviews to understand meaningful progress instead of letting short-term changes in my account balance continually reset my attention.',
    market:
      'Help me keep most portfolio attention inside a planned review rhythm while making room for the limited market events that genuinely deserve attention sooner.',
    holding:
      'Help me review holdings through a repeatable schedule and focus extra attention only when information materially relates to the role a holding is meant to perform.',
    idea:
      'Help me give new investment ideas a defined place in my review process instead of allowing every interesting idea to interrupt the rest of the portfolio.',
    rarely:
      'Help me use a small number of planned portfolio reviews so I can stay informed without needing to monitor the portfolio continuously.'
  }),

  explore: Object.freeze({
    balance:
      'Help me keep most of the portfolio low-maintenance while concentrating additional research on selected ideas instead of reacting to changes in my overall account balance.',
    market:
      'Help me keep most of the portfolio on a stable review rhythm while directing extra research only toward selected opportunities that deserve attention beyond ordinary market noise.',
    holding:
      'Help me concentrate deeper research on selected holdings where additional attention can be useful without turning every holding into a high-effort position.',
    idea:
      'Help me create a bounded research area for new investment ideas so I can explore them without increasing the effort required across the rest of my portfolio.',
    rarely:
      'Help me keep most of the portfolio low-maintenance while giving me a clearly bounded place to spend more time when I choose to research an idea.'
  }),

  active: Object.freeze({
    balance:
      'Help me stay actively engaged without allowing changes in my account balance to determine where my attention goes across the portfolio.',
    market:
      'Help me stay actively engaged with markets while keeping my attention organized around the portfolio roles that are actually affected rather than reacting across the whole system.',
    holding:
      'Help me actively follow holdings while matching the depth of attention to the role and importance of each part of the portfolio.',
    idea:
      'Help me actively explore new investment ideas while keeping that research effort contained so opportunity-seeking does not take over the entire portfolio.',
    rarely:
      'Help me stay selectively active by making clear which parts of the portfolio deserve ongoing attention and which can remain low-maintenance.'
  })
});


export function getPortfolioInteractionGuidance({
  tradeoffOptionId,
  marketPsychologyOptionId,
  resolvedStyleId
} = {}) {
  const baseResult = {
    tradeoffOptionId:
      tradeoffOptionId ?? null,
    interactionPreference: null,
    marketPsychologyOptionId:
      marketPsychologyOptionId ?? null,
    attentionTrigger: null,
    userJTBD: null,
    resolvedStyleId:
      resolvedStyleId ?? null
  };

  if (
    !Object.hasOwn(
      PORTFOLIO_INTERACTION_PREFERENCES,
      tradeoffOptionId
    ) ||
    !Object.hasOwn(
      PORTFOLIO_INTERACTION_TRIGGERS,
      marketPsychologyOptionId
    )
  ) {
    return baseResult;
  }

  return {
    tradeoffOptionId,
    interactionPreference:
      PORTFOLIO_INTERACTION_PREFERENCES[
        tradeoffOptionId
      ],
    marketPsychologyOptionId,
    attentionTrigger:
      PORTFOLIO_INTERACTION_TRIGGERS[
        marketPsychologyOptionId
      ],
    userJTBD:
      PORTFOLIO_INTERACTION_USER_JTBD[
        tradeoffOptionId
      ][marketPsychologyOptionId],
    resolvedStyleId:
      resolvedStyleId ?? null
  };
}
