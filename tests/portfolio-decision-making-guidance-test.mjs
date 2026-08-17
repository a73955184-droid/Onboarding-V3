import assert from 'node:assert/strict';

import {
  PORTFOLIO_DECISION_TRIGGERS,
  PORTFOLIO_DECISION_TYPES,
  getPortfolioDecisionMakingGuidance
} from '../src/domain/investor-system-guidance/portfolio-decision-making-guidance.js';


const EXPECTED_USER_JTBD = Object.freeze({
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


const observedCopy = new Set();


for (
  const [transitionOptionId, decisionCases]
  of Object.entries(EXPECTED_USER_JTBD)
) {
  for (
    const [decisionStyleOptionId, expectedUserJTBD]
    of Object.entries(decisionCases)
  ) {
    const guidance =
      getPortfolioDecisionMakingGuidance({
        transitionOptionIds: [
          transitionOptionId
        ],
        decisionStyleOptionIds: [
          decisionStyleOptionId
        ],
        resolvedBehaviorId:
          'validation_seeker'
      });

    assert.equal(
      guidance.transitionTrigger,
      PORTFOLIO_DECISION_TRIGGERS[
        transitionOptionId
      ],
      transitionOptionId +
        ' + ' +
        decisionStyleOptionId +
        ': transition trigger mismatch'
    );

    assert.equal(
      guidance.decisionType,
      PORTFOLIO_DECISION_TYPES[
        decisionStyleOptionId
      ],
      transitionOptionId +
        ' + ' +
        decisionStyleOptionId +
        ': decision type mismatch'
    );

    assert.equal(
      guidance.userJTBD,
      expectedUserJTBD,
      transitionOptionId +
        ' + ' +
        decisionStyleOptionId +
        ': exact JTBD mismatch'
    );

    assert.equal(
      guidance.resolvedBehaviorId,
      'validation_seeker',
      'Resolved Behavior should pass through unchanged'
    );

    observedCopy.add(
      guidance.userJTBD
    );
  }
}


assert.equal(
  observedCopy.size,
  25,
  'Every decision-making combination should have unique curated copy'
);


const transitionPrecedence =
  getPortfolioDecisionMakingGuidance({
    transitionOptionIds: [
      'what_to_do',
      'change'
    ],
    decisionStyleOptionIds: [
      'start'
    ]
  });

assert.equal(
  transitionPrecedence
    .primaryTransitionOptionId,
  'change',
  'change should take precedence over what_to_do'
);

assert.deepEqual(
  transitionPrecedence
    .transitionOptionIds,
  [
    'what_to_do',
    'change'
  ],
  'Diagnostic transition evidence should preserve input order'
);


const decisionStylePrecedence =
  getPortfolioDecisionMakingGuidance({
    transitionOptionIds: [
      'what_to_do'
    ],
    decisionStyleOptionIds: [
      'start',
      'fit'
    ]
  });

assert.equal(
  decisionStylePrecedence
    .primaryDecisionStyleOptionId,
  'fit',
  'fit should take precedence over start'
);

assert.deepEqual(
  decisionStylePrecedence
    .decisionStyleOptionIds,
  [
    'start',
    'fit'
  ],
  'Diagnostic decision-style evidence should preserve input order'
);


assert.equal(
  getPortfolioDecisionMakingGuidance({
    transitionOptionIds: [
      'doing_right',
      'compare'
    ],
    decisionStyleOptionIds: [
      'start'
    ]
  }).primaryTransitionOptionId,
  'compare',
  'compare should take precedence over doing_right'
);


assert.equal(
  getPortfolioDecisionMakingGuidance({
    transitionOptionIds: [
      'what_to_do'
    ],
    decisionStyleOptionIds: [
      'pick',
      'sell'
    ]
  }).primaryDecisionStyleOptionId,
  'sell',
  'sell should take precedence over pick'
);


const fallbackCases = [
  {
    name: 'no transition',
    input: {
      decisionStyleOptionIds: [
        'fit'
      ]
    }
  },
  {
    name: 'no decision style',
    input: {
      transitionOptionIds: [
        'change'
      ]
    }
  },
  {
    name: 'unknown transition',
    input: {
      transitionOptionIds: [
        'unknown_transition'
      ],
      decisionStyleOptionIds: [
        'fit'
      ]
    }
  },
  {
    name: 'unknown decision style',
    input: {
      transitionOptionIds: [
        'change'
      ],
      decisionStyleOptionIds: [
        'unknown_decision'
      ]
    }
  },
  {
    name: 'empty arrays',
    input: {
      transitionOptionIds: [],
      decisionStyleOptionIds: []
    }
  }
];


for (const fallbackCase of fallbackCases) {
  const guidance =
    getPortfolioDecisionMakingGuidance({
      ...fallbackCase.input,
      resolvedBehaviorId:
        'confidence_builder'
    });

  assert.equal(
    guidance.userJTBD,
    null,
    fallbackCase.name +
      ': should not guess a dynamic JTBD'
  );

  assert.equal(
    guidance.resolvedBehaviorId,
    'confidence_builder',
    fallbackCase.name +
      ': should preserve the resolved Behavior'
  );
}


console.log(
  'Portfolio decision-making guidance tests passed.'
);
