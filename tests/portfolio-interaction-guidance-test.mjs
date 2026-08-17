import assert from 'node:assert/strict';

import {
  PORTFOLIO_INTERACTION_PREFERENCES,
  PORTFOLIO_INTERACTION_TRIGGERS,
  getPortfolioInteractionGuidance
} from '../src/domain/investor-system-guidance/portfolio-interaction-guidance.js';


const EXPECTED_USER_JTBD = Object.freeze({
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


const observedCopy = new Set();


for (
  const [tradeoffOptionId, attentionCases]
  of Object.entries(EXPECTED_USER_JTBD)
) {
  for (
    const [marketPsychologyOptionId, expectedUserJTBD]
    of Object.entries(attentionCases)
  ) {
    const guidance =
      getPortfolioInteractionGuidance({
        tradeoffOptionId,
        marketPsychologyOptionId,
        resolvedStyleId:
          'systematic_improver'
      });

    assert.equal(
      guidance.interactionPreference,
      PORTFOLIO_INTERACTION_PREFERENCES[
        tradeoffOptionId
      ],
      tradeoffOptionId +
        ' + ' +
        marketPsychologyOptionId +
        ': interaction preference mismatch'
    );

    assert.equal(
      guidance.attentionTrigger,
      PORTFOLIO_INTERACTION_TRIGGERS[
        marketPsychologyOptionId
      ],
      tradeoffOptionId +
        ' + ' +
        marketPsychologyOptionId +
        ': attention trigger mismatch'
    );

    assert.equal(
      guidance.userJTBD,
      expectedUserJTBD,
      tradeoffOptionId +
        ' + ' +
        marketPsychologyOptionId +
        ': exact JTBD mismatch'
    );

    assert.equal(
      guidance.resolvedStyleId,
      'systematic_improver',
      'Resolved Style should pass through unchanged'
    );

    observedCopy.add(
      guidance.userJTBD
    );
  }
}


assert.equal(
  observedCopy.size,
  25,
  'Every interaction combination should have unique curated copy'
);


const fallbackCases = [
  {
    name: 'missing tradeoff',
    input: {
      marketPsychologyOptionId:
        'market'
    }
  },
  {
    name: 'missing market psychology',
    input: {
      tradeoffOptionId:
        'periodic'
    }
  },
  {
    name: 'unknown tradeoff',
    input: {
      tradeoffOptionId:
        'unknown_tradeoff',
      marketPsychologyOptionId:
        'market'
    }
  },
  {
    name: 'unknown market psychology',
    input: {
      tradeoffOptionId:
        'periodic',
      marketPsychologyOptionId:
        'unknown_trigger'
    }
  }
];


for (const fallbackCase of fallbackCases) {
  const guidance =
    getPortfolioInteractionGuidance({
      ...fallbackCase.input,
      resolvedStyleId:
        'steady_steward'
    });

  assert.equal(
    guidance.userJTBD,
    null,
    fallbackCase.name +
      ': should not guess a dynamic JTBD'
  );

  assert.equal(
    guidance.resolvedStyleId,
    'steady_steward',
    fallbackCase.name +
      ': should preserve the resolved Style'
  );
}


console.log(
  'Portfolio interaction guidance tests passed.'
);
